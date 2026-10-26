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

export default function App() {
  const [remainingTime, setRemainingTime] = useState(getRemainingTime)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingTime(getRemainingTime())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const format = (value) => value.toString().padStart(2, '0')
  const countdown = `${format(remainingTime.day)}:${format(remainingTime.hour)}:${format(remainingTime.minute)}:${format(remainingTime.second)}`
  console.log("The clock ticks!")

  return (
    <div>
      <p className="countdown" aria-label={countdown}>
        {[...countdown].map((character, index) => (
          <span className="countdown-character" aria-hidden="true" key={index}>
            {character}
          </span>
        ))}
      </p>
    </div>
  );
}