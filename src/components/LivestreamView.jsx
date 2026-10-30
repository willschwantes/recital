import './LivestreamView.css'
import { useRef, useState } from 'react'

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

const sets = [
  {
    number: 'I',
    title: 'INSPIRATION',
    visible: true,
    sections: [
      {
        paragraphs: [
          {
            text: 'A Creative In The Wild is a piece I wrote to set the tone for this recital. As I was thinking about my recital, and what I wanted it to be, I thought about programming music that was rich in depth and held steady with its serious tone, as a reflection of the person that I am. That is, if I were a serious person at all. This is a satirical interpretation of the first sparks of the idea, and how my ideas often begin with me at the piano, trying not to be perceived.',
            visible: true,
          },
        ],
      },
    ],
  },
  {
    number: 'II',
    title: 'CREATION',
    visible: true,
    sections: [
      {
        paragraphs: [
          {
            text: '“Le colibri,” composed by Ernest Chausson, follows the ventures of a hummingbird who goes to drink the nectar of a flower. In doing so, the hummingbird succumbs to the flower\'s nectar and dies, not knowing whether he had drunk the flower dry. I programmed this song to showcase my process of running with an idea; oftentimes I fixate on a new song until my brain depletes itself of any new thoughts. In this allegory, the idea is the nectar and my brain is the hummingbird.',
            visible: true,
            bilingualLyrics: [
          [
            { lyric: 'The green humming-bird, the king of the hills,', french: 'Le vert colibri, le roi des collines,' },
            { lyric: 'On seeing the dew and gleaming sun', french: 'Voyant la rosée et le soleil clair' },
            { lyric: 'Shine in his nest of fine woven grass,', french: 'Luire dans son nid tissé d\'herbe fines,' },
            { lyric: 'Darts into the air like a shaft of light.', french: 'Comme un frais rayon s\'échappe dans l\'air.' },
          ],
          [
            { lyric: 'He hurries and flies to the nearby springs', french: 'Il se hâte et vole au source voisines,' },
            { lyric: 'Where the bamboos sound like the sea,', french: 'Où les bambous font le bruit de la mer;' },
            { lyric: 'Where the red hibiscus with its heavenly scent', french: 'Où l\'açoka rouge, aux odeurs divines,' },
            { lyric: 'Unveils the glint of dew at its heart.', french: 'S\'ouvre, et porte au cœur un humide éclair.' },
          ],
          [
            { lyric: 'He descends, and settles on the golden flower,', french: 'Vers la fleur dorée il descend, se pose,' },
            { lyric: 'Drinks so much love from the rosy cup', french: 'Et boit tant d\'amour dans la coupe rose,' },
            { lyric: 'That he dies, not knowing if he\'d drunk it dry.', french: 'Qu\'il meurt, ne sachant s\'il l\'a pu tarir.' },
          ],
          [
            { lyric: 'On your pure lips, O my beloved,', french: 'Sur ta lèvre pure, ô ma bien-aimée,' },
            { lyric: 'My own soul too would sooner have died', french: 'Telle aussi mon âme eut voulu mourir' },
            { lyric: 'From that first kiss which scented it!', french: 'Du premier baiser qui l\'a parfumée!' },
          ],
        ],
          },
        ],
      },
      {
        paragraphs: [
          {
            text: '“Le chemins de l\'amour” by Francis Poulenc reflects on the many shapes that love can take. I find that a lot of the songs I write are rooted in a love of some sort; a love of family, romantic love, a love for the things in life I\'ve experienced.',
            visible: true,
            bilingualLyrics: [
          [
            { lyric: 'The paths that lead to the sea', french: 'Les chemins qui vont à la mer' },
            { lyric: 'Have retained from our passing', french: 'Ont gardé de notre passage,' },
            { lyric: 'The flowers that shed their petals', french: 'Des fleurs effeuillées' },
            { lyric: 'And the echo beneath their trees', french: 'Et l\'écho sous leurs arbres' },
            { lyric: 'Of our clear laughter.', french: 'De nos deux rires clairs.' },
            { lyric: 'Alas! no trace of those happy days,', french: 'Hélas! des jours de bonheur,' },
            { lyric: 'Those radiant joys now flown,', french: 'Radieuses joies envolées,' },
            { lyric: 'Can I find again', french: 'Je vais sans retrouver traces' },
            { lyric: 'In my heart.', french: 'Dans mon cœur.' },
          ],
          [
            { lyric: 'Paths of my love,', french: 'Chemins de mon amour,' },
            { lyric: 'I search for you ceaselessly,', french: 'Je vous cherche toujours,' },
            { lyric: 'Lost paths, you are no more', french: 'Chemins perdus, vous n\'êtes plus' },
            { lyric: 'And your echoes are muted.', french: 'Et vos échos sont sourds.' },
            { lyric: 'Paths of despair,', french: 'Chemins du désespoir,' },
            { lyric: 'Paths of memory,', french: 'Chemins du souvenir,' },
            { lyric: 'Paths of our first day,', french: 'Chemins du premier jour,' },
            { lyric: 'Divine paths of love.', french: 'Divins chemins d\'amour.' },
          ],
          [
            { lyric: 'If one day I must forget,', french: 'Si je dois l\'oublier un jour,' },
            { lyric: 'Since life obliterates everything,', french: 'La vie effaçant toute chose,' },
            { lyric: 'I wish for my heart to remember one thing,', french: 'Je veut, dans mon cœur, qu\'un souvenir repose,' },
            { lyric: 'More vivid than the other love,', french: 'Plus fort que l\'autre amour.' },
            { lyric: 'To remember the path', french: 'Le souvenir du chemin,' },
            { lyric: 'Where trembling and quite distracted,', french: 'Où tremblante et toute éperdue,' },
            { lyric: 'I one day felt on me your passionate hands.', french: 'Un jour j\'ai senti sur moi brûler tes mains.' },
          ],
        ],
          },
        ],
      },
    ],
  },
  {
    number: 'III',
    title: 'WRITER\'S BLOCK',
    visible: true,
    sections: [
      {
        paragraphs: [
          {
            text: '“I Miss The Music” from Curtains comes from the realization that my words have escaped my voice. You don\'t realize you have writer\'s block until you try to write and the words are gone. This stems from my similar experience in the many times over the years that I\'ve gone to write music and realized that the words were indeed gone.',
            visible: true,
          },
        ],
      },
      {
        paragraphs: [
          {
            text: '“Franklin Shepard Inc” from Merrily We Roll Along comes from a place of being split, similar to characters Frank and Charlie from the musical, who are torn between the authenticity of the creative process and the franchising of it all. In a similar vein, I spent a lot of time during my college career split between doing everything and making space in my schedule to continue writing. I grew more and more “at war” with myself as I\'ve tried to figure out what is truly important to me, and I thought of no better reflection on this part of my life than “Franklin Shepard Inc.”',
            visible: true,
          },
        ],
      },
    ],
  },
  {
    number: 'IV',
    title: 'SUPPORT',
    visible: true,
    sections: [
      {
        paragraphs: [
          {
            text: 'When thinking about everything that I wanted the “support” set of my recital to be, I thought of no better song to include than “Little Blue” by Jacob Collier. Since its release, the song has always met me where I was, and has been a reminder of the unwavering North Star that my music and my friends have been for me throughout the years. I am joined onstage by friends who have gotten me through some of the greatest hurdles in my life.',
            visible: true,
          },
          {
            text: '“And So It Goes” by Billy Joel plants the seeds that life will move on, with or without me, and it\'s the wakeup call from sitting in the living room of “White Clay” singing barbershop with some of my closest friends that finally cemented this epiphany in me.',
            visible: true,
          },
          {
            text: '“My Song” by Labi Siffre concludes this set, as the last of my friends depart the stage. In parallel with my mental health journey, I\'ve gone through a lot of harrowing realizations within myself, the biggest one being that, no matter how big my support group is, their words and sentiment will always fall short if I don\'t take them to heart. This song comes from a place of finally stepping into a sense of self-reliance that I\'ve been so reluctant to fall back on. I\'m still a little diffident, but I\'m singing with much more sureness than I did before.',
            visible: true,
          },
        ],
      },
    ],
  },
  {
    number: 'V',
    title: 'THE IDEA, FULLY REALIZED',
    visible: true,
    sections: [
      {
        paragraphs: [
          {
            text: '“My Grandma\'s House” is a song I wrote at the end of the summer going into my freshman year of college. As we got into high school, my brother and I would often go over and help my grandma with work around the house. After a good afternoon\'s work, we would sit out on her back patio, on what my brother dubbed “The Grammy Swing,” and talk about life and anything that was ailing us. She would give us advice and tell us about her life experiences. It was during this time that I learned (even more so than I already knew) that my grandma is a damn awesome woman, so I wrote her this song so she knew that too.',
            visible: true,
          },
        ],
      },
      {
        paragraphs: [
          {
            text: '“Going Home” is an ode to my mom. The seeds for this song were planted when I first came home from college. I hadn\'t been gone long, but when I got home, my room was exactly how I left it, albeit a little bit tidier, and the lamp on my dresser was on. My mom told me that she would always leave a light on in our rooms when my brother and I left for college, so that we would always know that we have a place to come back to—a place to call home. It wasn\'t until I was on the road home from a relative\'s funeral last summer that what my mom was doing sunk in. At the end of every journey was a destination, not from Point A to Point B, but rather from Point A to Point A. I would always end up back at home. And there would be the lamp on my dresser, waiting for my return.',
            visible: true,
          },
        ],
      },
      {
        paragraphs: [
          {
            text: '“Who Knows?” pays homage to the wonderful experiences I\'ve had during my time at the University of Delaware. I first came up with the idea for this song about a month after I had toured Greece with UD\'s Symphony Orchestra. Then, I began to wonder where I would go from there, and what the next big adventure I would go on would be. Since then, the dreams I once thought were big evolved into something larger than life. Through the people who I\'ve crossed paths with, and several valuable lessons learned, I can for sure say that I\'ve grown a lot over the past four years, and my dreams have been shaped accordingly. Thank you for helping me grow :)',
            visible: true,
          },
        ],
      },
    ],
  },
]

export default function LivestreamView({ videoSrc }) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoSrc)
  const youtubePlayerRef = useRef(null)
  const videoPlayerRef = useRef(null)
  const [activeSetNumber, setActiveSetNumber] = useState('I')
  const [livestreamVisible, setLivestreamVisible] = useState(true)
  const visibleSets = sets.filter((set) => set.visible)
  const activeSet = visibleSets.find((set) => set.number === activeSetNumber) ?? visibleSets[0]
  const activeSetIndex = visibleSets.indexOf(activeSet)

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
    <main className="livestream-view">
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

        <nav className="set-navigation" aria-label="Recital sets">
          {visibleSets.length > 1 && (
            <button
              className="set-navigation-button"
              type="button"
              aria-label="Previous set"
              disabled={activeSetIndex === 0}
              onClick={() => setActiveSetNumber(visibleSets[activeSetIndex - 1].number)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          {visibleSets.length > 1 && (
            <div className="set-navigation-sets" aria-hidden="true">
              {visibleSets.map((set, index) => (
                <span
                  className={`set-navigation-set${index === activeSetIndex ? ' is-active' : ''}`}
                  key={set.number}
                />
              ))}
            </div>
          )}
          <span className="visually-hidden" aria-live="polite">
            {activeSet && `Set ${activeSet.number}: ${activeSet.title}`}
          </span>
          {visibleSets.length > 1 && (
            <button
              className="set-navigation-button"
              type="button"
              aria-label="Next set"
              disabled={activeSetIndex === visibleSets.length - 1}
              onClick={() => setActiveSetNumber(visibleSets[activeSetIndex + 1].number)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </nav>

        {activeSet && (
          <article className="livestream-notes" key={activeSet.number}>
            <h1>{activeSet.number} – {activeSet.title}</h1>
            {activeSet.sections.map((section, sectionIndex) => (
              <section className="set-section" key={`${activeSet.number}-${sectionIndex}`}>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  paragraph.visible && (
                    <div className="setlist-entry" key={`${sectionIndex}-${paragraphIndex}`}>
                      <p>{paragraph.text}</p>
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
                  )
                ))}
              </section>
            ))}
          </article>
        )}
      </div>
    </main>
  )
}
