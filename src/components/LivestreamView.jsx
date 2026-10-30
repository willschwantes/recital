import './LivestreamView.css'
import { useState } from 'react'

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

const sets = [
  {
    number: 'I',
    title: 'Inspiration',
    sections: [
      {
        title: 'A Creative In The Wild',
        paragraphs: [
          'A Creative In The Wild is a piece I wrote to set the tone for this recital. As I was thinking about my recital, and what I wanted it to be, I thought about programming music that was rich in depth and held steady with its serious tone, as a reflection of the person that I am. That is, if I were a serious person at all. This is a satirical interpretation of the first sparks of the idea, and how my ideas often begin with me at the piano, trying not to be perceived.',
        ],
      },
    ],
  },
  {
    number: 'II',
    title: 'Creation',
    sections: [
      {
        title: 'Le colibri',
        paragraphs: [
          '“Le colibri,” composed by Ernest Chausson, follows the ventures of a hummingbird who goes to drink the nectar of a flower. In doing so, the hummingbird succumbs to the flower’s nectar and dies, not knowing whether he had drunk the flower dry. I programmed this song to showcase my process of running with an idea; oftentimes I fixate on a new song until my brain depletes itself of any new thoughts. In this allegory, the idea is the nectar and my brain is the hummingbird.',
        ],
        lyrics: `The green humming-bird, the king of the hills,\nOn seeing the dew and gleaming sun\nShine in his nest of fine woven grass,\nDarts into the air like a shaft of light.\n\nHe hurries and flies to the nearby springs\nWhere the bamboos sound like the sea,\nWhere the red hibiscus with its heavenly scent\nUnveils the glint of dew at its heart.\n\nHe descends, and settles on the golden flower,\nDrinks so much love from the rosy cup\nThat he dies, not knowing if he’d drunk it dry.\n\nOn your pure lips, O my beloved,\nMy own soul too would sooner have died\nFrom that first kiss which scented it!`,
      },
      {
        title: 'Le chemins de l’amour',
        paragraphs: [
          '“Le chemins de l’amour” by Francis Poulenc reflects on the many shapes that love can take. I find that a lot of the songs I write are rooted in a love of some sort; a love of family, romantic love, a love for the things in life I’ve experienced.',
        ],
        lyrics: `The paths that lead to the sea\nHave retained from our passing\nThe flowers that shed their petals\nAnd the echo beneath their trees\nOf our clear laughter.\nAlas! no trace of those happy days,\nThose radiant joys now flown,\nCan I find again\nIn my heart.\n\nPaths of my love,\nI search for you ceaselessly,\nLost paths, you are no more\nAnd your echoes are muted.\nPaths of despair,\nPaths of memory,\nPaths of our first day,\nDivine paths of love.\n\nIf one day I must forget,\nSince life obliterates everything,\nI wish for my heart to remember one thing,\nMore vivid than the other love,\nTo remember the path\nWhere trembling and quite distracted,\nI one day felt on me your passionate hands.`,
      },
    ],
  },
  {
    number: 'III',
    title: 'Writer’s Block',
    sections: [
      {
        title: 'I Miss The Music',
        paragraphs: [
          '“I Miss The Music” from Curtains comes from the realization that my words have escaped my voice. You don’t realize you have writer’s block until you try to write and the words are gone. This stems from my similar experience in the many times over the years that I’ve gone to write music and realized that the words were indeed gone.',
        ],
      },
      {
        title: 'Franklin Shepard Inc',
        paragraphs: [
          '“Franklin Shepard Inc” from Merrily We Roll Along comes from a place of being split, similar to characters Frank and Charlie from the musical, who are torn between the authenticity of the creative process and the franchising of it all. In a similar vein, I spent a lot of time during my college career split between doing everything and making space in my schedule to continue writing. I grew more and more “at war” with myself as I’ve tried to figure out what is truly important to me, and I thought of no better reflection on this part of my life than “Franklin Shepard Inc.”',
        ],
      },
    ],
  },
  {
    number: 'IV',
    title: 'Support',
    sections: [
      {
        paragraphs: [
          'When thinking about everything that I wanted the “support” set of my recital to be, I thought of no better song to include than “Little Blue” by Jacob Collier. Since its release, the song has always met me where I was, and has been a reminder of the unwavering North Star that my music and my friends have been for me throughout the years. I am joined onstage by friends who have gotten me through some of the greatest hurdles in my life.',
          '“And So It Goes” by Billy Joel plants the seeds that life will move on, with or without me, and it’s the wakeup call from sitting in the living room of “White Clay” singing barbershop with some of my closest friends that finally cemented this epiphany in me.',
          '“My Song” by Labi Siffre concludes this set, as the last of my friends depart the stage. In parallel with my mental health journey, I’ve gone through a lot of harrowing realizations within myself, the biggest one being that, no matter how big my support group is, their words and sentiment will always fall short if I don’t take them to heart. This song comes from a place of finally stepping into a sense of self-reliance that I’ve been so reluctant to fall back on. I’m still a little diffident, but I’m singing with much more sureness than I did before.',
        ],
      },
    ],
  },
  {
    number: 'V',
    title: 'The Idea, Fully Realized',
    sections: [
      {
        title: 'My Grandma’s House',
        paragraphs: [
          '“My Grandma’s House” is a song I wrote at the end of the summer going into my freshman year of college. As we got into high school, my brother and I would often go over and help my grandma with work around the house. After a good afternoon’s work, we would sit out on her back patio, on what my brother dubbed “The Grammy Swing,” and talk about life and anything that was ailing us. She would give us advice and tell us about her life experiences. It was during this time that I learned (even more so than I already knew) that my grandma is a damn awesome woman, so I wrote her this song so she knew that too.',
        ],
      },
      {
        title: 'Going Home',
        paragraphs: [
          '“Going Home” is an ode to my mom. The seeds for this song were planted when I first came home from college. I hadn’t been gone long, but when I got home, my room was exactly how I left it, albeit a little bit tidier, and the lamp on my dresser was on. My mom told me that she would always leave a light on in our rooms when my brother and I left for college, so that we would always know that we have a place to come back to—a place to call home. It wasn’t until I was on the road home from a relative’s funeral last summer that what my mom was doing sunk in. At the end of every journey was a destination, not from Point A to Point B, but rather from Point A to Point A. I would always end up back at home. And there would be the lamp on my dresser, waiting for my return.',
        ],
      },
      {
        title: 'Who Knows?',
        paragraphs: [
          '“Who Knows?” pays homage to the wonderful experiences I’ve had during my time at the University of Delaware. I first came up with the idea for this song about a month after I had toured Greece with UD’s Symphony Orchestra. Then, I began to wonder where I would go from there, and what the next big adventure I would go on would be. Since then, the dreams I once thought were big evolved into something larger than life. Through the people who I’ve crossed paths with, and several valuable lessons learned, I can for sure say that I’ve grown a lot over the past four years, and my dreams have been shaped accordingly. Thank you for helping me grow :)',
        ],
      },
    ],
  },
]

export default function LivestreamView({ videoSrc }) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoSrc)
  const [activeSetIndex, setActiveSetIndex] = useState(0)
  const activeSet = sets[activeSetIndex]

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

        <nav className="set-navigation" aria-label="Recital sets">
          <button
            className="set-navigation-button"
            type="button"
            aria-label="Previous set"
            disabled={activeSetIndex === 0}
            onClick={() => setActiveSetIndex((index) => index - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="set-navigation-position" aria-live="polite">
            Set {activeSet.number} of V
          </span>
          <button
            className="set-navigation-button"
            type="button"
            aria-label="Next set"
            disabled={activeSetIndex === sets.length - 1}
            onClick={() => setActiveSetIndex((index) => index + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </nav>

        <article className="livestream-notes" key={activeSet.number}>
          <h1>{activeSet.number} – {activeSet.title}</h1>
          {activeSet.sections.map((section) => (
            <section className="set-section" key={section.title ?? activeSet.number}>
              {section.title && <h2>{section.title}</h2>}
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.lyrics && <blockquote className="set-lyrics">{section.lyrics}</blockquote>}
            </section>
          ))}
        </article>
      </div>
    </main>
  )
}
