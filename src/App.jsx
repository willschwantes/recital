import Countdown from './components/Countdown.jsx'
import LivestreamView from './components/LivestreamView.jsx'

// -1: countdown; 0: welcome with countdown; 1: countdown fades out; 2+: reveal paragraphs; 14: thank-you page.
// Stage 10 fades toward the rainbow; stage 11 reveals Set V.
const presentationStage = 0

export default function App() {
  if (presentationStage === -1) {
    return <Countdown />
  }

  return (
    <LivestreamView
      videoSrc="https://www.youtube.com/live/zSg3Ho_lqYw?si=e8eibNwVPOm2kneY"
      stage={presentationStage}
    />
  )
}
