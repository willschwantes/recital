import './LivestreamView.css'
import { useEffect, useRef, useState } from 'react'
import Countdown from './Countdown.jsx'

function getYouTubeEmbedUrl(source) {
  if (!source) return null

  try {
    const url = new URL(source)
    const hostname = url.hostname.replace(/^www\./, '')
    const pathParts = url.pathname.split('/').filter(Boolean)
    let videoId = null

    if (hostname === 'youtu.be') {
      videoId = pathParts[0]
    } else if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      videoId = url.searchParams.get('v')
        || (['embed', 'live', 'shorts'].includes(pathParts[0]) ? pathParts[1] : null)
    }

    if (!videoId || !/^[\w-]{11}$/.test(videoId)) return null

    const parameters = new URLSearchParams({
      autoplay: '1',
      controls: '1',
      enablejsapi: '1',
      mute: '0',
      playsinline: '1',
      rel: '0',
      origin: window.location.origin,
    })

    return `https://www.youtube.com/embed/${videoId}?${parameters}`
  } catch {
    return null
  }
}

const rainbowTransitionStage = 10
const thankYouStage = 14

function getReleasedSets(content) {
  const sets = new Map()

  for (const item of content) {
    if (
      item?.type !== 'paragraph'
      || typeof item.setNumber !== 'string'
      || typeof item.setTitle !== 'string'
      || !Number.isInteger(item.sectionIndex)
      || item.sectionIndex < 0
      || typeof item.text !== 'string'
    ) {
      continue
    }

    let set = sets.get(item.setNumber)
    if (!set) {
      set = { number: item.setNumber, title: item.setTitle, sections: [] }
      sets.set(item.setNumber, set)
    }

    set.sections[item.sectionIndex] ??= { paragraphs: [] }
    set.sections[item.sectionIndex].paragraphs.push({
      text: item.text,
      bilingualLyrics: Array.isArray(item.bilingualLyrics) ? item.bilingualLyrics : null,
    })
  }

  return [...sets.values()].map((set) => ({
    ...set,
    sections: set.sections.filter(Boolean),
  }))
}

export default function LivestreamView({ videoSrc, stage, content }) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoSrc)
  const youtubePlayerRef = useRef(null)
  const videoPlayerRef = useRef(null)
  const visibleSets = getReleasedSets(content)
  const latestRevealedSet = visibleSets[visibleSets.length - 1]
  const welcomeContent = content.find((item) => item?.type === 'welcome')
  const thankYouContent = content.find((item) => item?.type === 'thank-you')
  const welcomePage = stage >= 0 && welcomeContent
    ? [{ ...welcomeContent, id: 'welcome', type: 'welcome' }]
    : []
  const thankYouPage = stage >= thankYouStage && thankYouContent
    ? [{ ...thankYouContent, id: 'thank-you', type: 'thank-you' }]
    : []
  const pages = stage >= 0
    ? [
        ...welcomePage,
        ...visibleSets.map((set) => ({ ...set, id: set.number, type: 'set' })),
        ...thankYouPage,
      ]
    : visibleSets.map((set) => ({ ...set, id: set.number, type: 'set' }))
  const latestPageId = stage >= thankYouStage
    && thankYouContent
    ? 'thank-you'
    : latestRevealedSet?.number ?? (welcomePage.length ? 'welcome' : null)
  const [activePageId, setActivePageId] = useState(() => latestPageId)
  const [livestreamVisible, setLivestreamVisible] = useState(true)
  const activePage = pages.find((page) => page.id === activePageId) ?? pages[pages.length - 1]
  const activePageIndex = pages.indexOf(activePage)
  const activeSet = activePage?.type === 'set' ? activePage : null

  useEffect(() => {
    if (latestPageId) {
      setActivePageId(latestPageId)
    }
  }, [latestPageId])

  function toggleLivestream() {
    const shouldShow = !livestreamVisible

    if (youtubePlayerRef.current?.contentWindow) {
      youtubePlayerRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: shouldShow ? 'unMute' : 'mute',
          args: [],
        }),
        'https://www.youtube.com',
      )
    }

    if (videoPlayerRef.current) {
      videoPlayerRef.current.muted = !shouldShow
    }

    setLivestreamVisible(shouldShow)
  }

  return (
    <main
      className={[
        'livestream-view',
        stage >= rainbowTransitionStage && 'is-rainbow-transition',
        latestRevealedSet?.number === 'V' && 'is-final-set-revealed',
      ].filter(Boolean).join(' ')}
    >
      <div className="livestream-content">
        <div className="livestream-video-area" id="livestream-video-area">
          <div
            className="livestream-player"
            id="livestream-player"
            aria-hidden={!livestreamVisible}
            inert={!livestreamVisible}
            style={{ maxHeight: livestreamVisible ? 'min(56.25vw, 31.5rem)' : '0px' }}
          >
            <div className="livestream-video-container">
              {videoSrc ? (
                youtubeEmbedUrl ? (
                  <iframe
                    className="livestream-video"
                    ref={youtubePlayerRef}
                    src={youtubeEmbedUrl}
                    title="Livestream video"
                    allow="autoplay; encrypted-media; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <video
                    className="livestream-video"
                    ref={videoPlayerRef}
                    autoPlay
                    controls
                    playsInline
                    src={videoSrc}
                  >
                    Your browser does not support video playback.
                  </video>
                )
              ) : (
                <div className="livestream-video-placeholder">
                  Add a videoSrc prop to display the video.
                </div>
              )}
            </div>
          </div>
          <button
            className="livestream-toggle"
            type="button"
            aria-controls="livestream-player"
            aria-expanded={livestreamVisible}
            aria-label={livestreamVisible ? 'Hide livestream' : 'Show livestream'}
            onClick={toggleLivestream}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={livestreamVisible ? 'm6 14 6-6 6 6' : 'm6 10 6 6 6-6'} />
            </svg>
          </button>
        </div>

        <nav className="set-navigation" aria-label="Recital pages">
          {pages.length > 1 && (
            <button
              className="set-navigation-button"
              type="button"
              aria-label="Previous page"
              disabled={activePageIndex === 0}
              onClick={() => setActivePageId(pages[activePageIndex - 1].id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          {pages.length > 1 && (
            <div className="set-navigation-sets" aria-hidden="true">
              {pages.map((page, index) => (
                <span
                  className={`set-navigation-set${index === activePageIndex ? ' is-active' : ''}`}
                  key={page.id}
                />
              ))}
            </div>
          )}
          <span className="visually-hidden" aria-live="polite">
            {activePage?.type === 'welcome'
              ? 'Welcome'
              : activePage?.type === 'thank-you'
                ? activePage.heading
                : activeSet && `Set ${activeSet.number}: ${activeSet.title}`}
          </span>
          {pages.length > 1 && (
            <button
              className="set-navigation-button"
              type="button"
              aria-label="Next page"
              disabled={activePageIndex === pages.length - 1}
              onClick={() => setActivePageId(pages[activePageIndex + 1].id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </nav>

        {activePage?.type === 'welcome' && (
          <section className="livestream-welcome" aria-label="Welcome">
            {stage <= 1 && (
              <div className={`welcome-countdown${stage === 1 ? ' is-fading-out' : ''}`}>
                <Countdown compact />
              </div>
            )}
            <p>{activePage.text}</p>
          </section>
        )}

        {activePage?.type === 'thank-you' && (
          <section className="livestream-thank-you" aria-label={activePage.heading}>
            <h1>{activePage.heading}</h1>
            <p className="thank-you-intro">{activePage.introduction}</p>
            <h2 className="thank-you-title">{activePage.specialThanksHeading}</h2>
            <div className="thank-you-guide">
              <h3>{activePage.guide.heading}</h3>
              <p>{activePage.guide.names.join(', ')}</p>
            </div>
            <div className="thank-you-groups">
              {activePage.groups.map((group) => (
                <section className="thank-you-group" key={group.heading}>
                  <h3>{group.heading}</h3>
                  {group.entries.map((entry, entryIndex) => (
                    <p key={entryIndex}>
                      {entry.lines.map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {lineIndex > 0 && <br />}
                          {line}
                        </span>
                      ))}
                      {entry.role && <> <em>{entry.role}</em></>}
                    </p>
                  ))}
                </section>
              ))}
            </div>
            <div className="thank-you-additional">
              {activePage.additionalThanks.map((person) => (
                <p key={person}>{person}</p>
              ))}
            </div>
            <p className="thank-you-message">{activePage.closingMessage}</p>
          </section>
        )}

        {activeSet && (
          <article className="livestream-notes" key={activeSet.number}>
            <h1>{activeSet.number} – {activeSet.title}</h1>
            {activeSet.sections.map((section, sectionIndex) => (
              <section className="set-section" key={`${activeSet.number}-${sectionIndex}`}>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <div
                    className="setlist-entry"
                    key={`${sectionIndex}-${paragraphIndex}`}
                  >
                    <p>{paragraph.text.split(/(Curtains|Merrily We Roll Along)/g).map((part, index) => (
                      part === 'Curtains' || part === 'Merrily We Roll Along'
                        ? <em key={index}>{part}</em>
                        : part
                    ))}</p>
                    {paragraph.bilingualLyrics && (
                      <div className="bilingual-lyrics">
                        {paragraph.bilingualLyrics.map((stanza, stanzaIndex) => (
                          <div className="lyric-stanza" key={stanzaIndex}>
                            {stanza.map((line, lineIndex) => (
                              <div className="lyric-line" key={lineIndex}>
                                <span>{line.french || '\u00a0'}</span>
                                <span>{line.lyric}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </article>
        )}
      </div>
    </main>
  )
}
