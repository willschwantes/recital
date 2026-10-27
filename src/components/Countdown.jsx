import { useEffect, useState } from 'react'

const targetDate = new Date(2026, 10, 6, 20, 0, 0)

function getRemainingTime() {
  const remainingSeconds = Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000))

  return {
    day: Math.floor(remainingSeconds / 86400),
    hour: Math.floor((remainingSeconds % 86400) / 3600),
    minute: Math.floor((remainingSeconds % 3600) / 60),
    second: remainingSeconds % 60,
  }
}

export default function Countdown() {
  const [remainingTime, setRemainingTime] = useState(getRemainingTime)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingTime(getRemainingTime())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const format = (value) => value.toString().padStart(2, '0')
  const time = `${format(remainingTime.hour)}:${format(remainingTime.minute)}:${format(remainingTime.second)}`
  const countdown = remainingTime.day === 0
    ? time
    : `${remainingTime.day < 10 ? remainingTime.day : format(remainingTime.day)}:${time}`
  console.log("The clock ticks!")

  return (
    <div>
      <title>{countdown}</title>
      <p className="countdown" aria-label={countdown}>
        {[...countdown].map((character, index) => (
          <span className="countdown-character" aria-hidden="true" key={index}>
            {character}
          </span>
        ))}
      </p>
    </div>
  )
}
