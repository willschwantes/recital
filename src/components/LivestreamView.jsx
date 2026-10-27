import './LivestreamView.css'

export default function LivestreamView({ videoSrc }) {
  return (
    <main className="livestream-view">
      <div className="livestream-content">
        <div className="livestream-video-container">
          {videoSrc ? (
            <video
              className="livestream-video"
              controls
              playsInline
              src={videoSrc}
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="livestream-video-placeholder">
              Add a videoSrc prop to display the video.
            </div>
          )}
        </div>

        <article className="livestream-notes">
          <h1>IV – Support</h1>
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
            on, with or without me, and it’s the wakeup call from sitting in the
            living room of “White Clay” singing barbershop with some of my
            closest friends that finally cemented this epiphany in me.
          </p>
          <p>
            “My Song” by Labi Siffre concludes this set, as the last of my
            friends depart the stage. In parallel with my mental health journey,
            I’ve gone through a lot of harrowing realizations within myself, the
            biggest one being that, no matter how big my support group is, their
            words and sentiment will always fall short if I don’t take them to
            heart. This song comes from a place of finally stepping into a sense
            of self-reliance that I’ve been so reluctant to fall back on. I’m
            still a little diffident, but I’m singing with much more sureness
            than I did before.
          </p>
        </article>
      </div>
    </main>
  )
}
