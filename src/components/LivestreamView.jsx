import './LivestreamView.css'

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
      mute: '1',
      playsinline: '1',
      rel: '0',
    })

    return `https://www.youtube.com/embed/${videoId}?${parameters}`
  } catch {
    return null
  }
}

export default function LivestreamView({ videoSrc }) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoSrc)

  return (
    <main className="livestream-view">
      <div className="livestream-content">
        <div className="livestream-video-container">
          {videoSrc ? (
            youtubeEmbedUrl ? (
              <iframe
                className="livestream-video"
                src={youtubeEmbedUrl}
                title="Livestream video"
                allow="autoplay; encrypted-media; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <video
                className="livestream-video"
                autoPlay
                controls
                muted
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

        <article className="livestream-notes">
          <h1 style={{textAlign: 'center'}}>IV – SUPPORT</h1>
          <p>
            When thinking about everything that I wanted the “support” set of my
            recital to be, I thought of no better song to include than “Little
            Blue” by Jacob Collier. Since its release, the song has always met
            me where I was, and has been a reminder of the unwavering North Star
            that my music and my friends have been for me throughout the years.
            I am joined onstage by friends who have gotten me through some of
            the greatest hurdles in my life.
          </p>
          <p>
            “And So It Goes” by Billy Joel plants the seeds that life will move
            on, with or without me, and it's the wakeup call from sitting in the
            living room of “White Clay” singing barbershop with some of my
            closest friends that finally cemented this epiphany in me.
          </p>
          <p>
            “My Song” by Labi Siffre concludes this set, as the last of my
            friends depart the stage. In parallel with my mental health journey,
            I've gone through a lot of harrowing realizations within myself, the
            biggest one being that, no matter how big my support group is, their
            words and sentiment will always fall short if I don't take them to
            heart. This song comes from a place of finally stepping into a sense
            of self-reliance that I've been so reluctant to fall back on. I'm
            still a little diffident, but I'm singing with much more sureness
            than I did before.
          </p>
        </article>
      </div>
    </main>
  )
}
