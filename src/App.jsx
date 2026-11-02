import { useEffect, useState } from 'react'
import Countdown from './components/Countdown.jsx'
import LivestreamView from './components/LivestreamView.jsx'
import { supabase, supabaseConfigurationError } from './lib/supabase.js'

function isValidContentItem(item) {
  if (!item || typeof item !== 'object') return false

  if (item.type === 'welcome') return typeof item.text === 'string'

  if (item.type === 'paragraph') {
    return typeof item.setNumber === 'string'
      && typeof item.setTitle === 'string'
      && Number.isInteger(item.sectionIndex)
      && item.sectionIndex >= 0
      && typeof item.text === 'string'
      && (item.bilingualLyrics === undefined || Array.isArray(item.bilingualLyrics))
  }

  if (item.type === 'thank-you') {
    return typeof item.heading === 'string'
      && typeof item.introduction === 'string'
      && typeof item.specialThanksHeading === 'string'
      && typeof item.guide?.heading === 'string'
      && Array.isArray(item.guide?.names)
      && Array.isArray(item.groups)
      && item.groups.every((group) => (
        typeof group.heading === 'string'
        && Array.isArray(group.entries)
        && group.entries.every((entry) => (
          Array.isArray(entry.lines)
          && entry.lines.every((line) => typeof line === 'string')
          && (entry.role === undefined || typeof entry.role === 'string')
        ))
      ))
      && Array.isArray(item.additionalThanks)
      && typeof item.closingMessage === 'string'
  }

  return false
}

export default function App() {
  const [presentation, setPresentation] = useState(null)
  const [errorMessage, setErrorMessage] = useState(supabaseConfigurationError)

  useEffect(() => {
    if (!supabase) return undefined

    let active = true
    let requestInProgress = false

    async function refreshPresentation() {
      if (requestInProgress) return
      requestInProgress = true

      let result
      try {
        result = await supabase.rpc('get_presentation')
      } catch (error) {
        requestInProgress = false
        if (active) {
          setErrorMessage(`Unable to load presentation: ${error instanceof Error ? error.message : 'network request failed'}`)
        }
        return
      }

      if (!active) return
      requestInProgress = false

      const { data, error } = result
      if (error) {
        setErrorMessage(`Unable to load presentation: ${error.message}`)
        return
      }

      if (
        !data
        || !Number.isInteger(data.stage)
        || data.stage < -1
        || data.stage > 14
        || !Array.isArray(data.content)
        || data.content.some((item) => !isValidContentItem(item))
      ) {
        setErrorMessage('The presentation backend returned invalid data.')
        return
      }

      const hasWelcome = data.content.some((item) => item.type === 'welcome')
      const hasParagraph = data.content.some((item) => item.type === 'paragraph')
      const hasThankYou = data.content.some((item) => item.type === 'thank-you')
      if (
        (data.stage >= 0 && !hasWelcome)
        || (data.stage >= 2 && !hasParagraph)
        || (data.stage >= 14 && !hasThankYou)
        || (data.stage < 14 && hasThankYou)
      ) {
        setErrorMessage('The presentation backend is missing required content or returned unreleased content.')
        return
      }

      setPresentation(data)
      setErrorMessage(null)
    }

    refreshPresentation()
    const intervalId = window.setInterval(refreshPresentation, 2000)

    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [])

  if (!presentation) {
    return (
      <main className="presentation-status" role={errorMessage ? 'alert' : 'status'}>
        {errorMessage ?? 'Connecting to the presentation…'}
      </main>
    )
  }

  return (
    <>
      {errorMessage && (
        <div className="presentation-warning" role="alert">
          {errorMessage}
        </div>
      )}
      {presentation.stage === -1 ? (
        <Countdown />
      ) : (
        <LivestreamView
          videoSrc="https://www.youtube.com/live/kAsZNQ_VNLg?si=uppgTzv3E3Pknq07"
          stage={presentation.stage}
          content={presentation.content}
        />
      )}
    </>
  )
}
