import { useEffect, useRef, useState } from 'react'
import { setPresentationStage, verifyPresentationAdmin } from '../lib/supabase.js'
import stageDescriptions from '../stageDescriptions.js'
import './StageControl.css'

function getDescription(stage) {
  return stageDescriptions[stage] || 'Add a description in src/stageDescriptions.js'
}

export default function StageControl({ stage }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [password, setPassword] = useState('')
  const [currentStage, setCurrentStage] = useState(stage)
  const [errorMessage, setErrorMessage] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const passwordInputRef = useRef(null)

  useEffect(() => {
    setCurrentStage(stage)
  }, [stage])

  useEffect(() => {
    if (isOpen) return undefined

    let touchStart = null
    let holdTimer = null
    let holdTriggered = false
    let downwardSwipes = 0
    let lastSwipeAt = 0

    function clearHoldTimer() {
      if (holdTimer !== null) {
        window.clearTimeout(holdTimer)
        holdTimer = null
      }
    }

    function handleTouchStart(event) {
      if (event.touches.length !== 1) {
        touchStart = null
        clearHoldTimer()
        return
      }

      const touch = event.touches[0]
      const startedAt = Date.now()
      touchStart = { x: touch.clientX, y: touch.clientY, startedAt }
      holdTriggered = false
      clearHoldTimer()

      if (touch.clientX <= 64 && touch.clientY <= 64) {
        holdTimer = window.setTimeout(() => {
          holdTriggered = true
          setIsOpen(true)
        }, 5000)
      }
    }

    function handleTouchEnd(event) {
      clearHoldTimer()
      if (!touchStart || holdTriggered) {
        touchStart = null
        return
      }

      const touch = event.changedTouches[0]
      const elapsed = Date.now() - touchStart.startedAt
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y
      touchStart = null

      if (deltaY < 70 || Math.abs(deltaX) > 60 || elapsed > 1500) {
        downwardSwipes = 0
        lastSwipeAt = 0
        return
      }

      const now = Date.now()
      downwardSwipes = now - lastSwipeAt <= 2500 ? downwardSwipes + 1 : 1
      lastSwipeAt = now

      if (downwardSwipes >= 3) {
        downwardSwipes = 0
        setIsOpen(true)
      }
    }

    function handleTouchCancel() {
      clearHoldTimer()
      touchStart = null
      downwardSwipes = 0
      lastSwipeAt = 0
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true })

    return () => {
      clearHoldTimer()
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchCancel)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !isBusy) {
        setIsOpen(false)
        setIsAuthorized(false)
        setPassword('')
        setErrorMessage('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isBusy, isOpen])

  useEffect(() => {
    if (isOpen && !isAuthorized) {
      passwordInputRef.current?.focus()
    }
  }, [isAuthorized, isOpen])

  function closePanel() {
    if (isBusy) return
    setIsOpen(false)
    setIsAuthorized(false)
    setPassword('')
    setErrorMessage('')
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsBusy(true)

    try {
      await verifyPresentationAdmin(password)
      setIsAuthorized(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to verify the password.')
    } finally {
      setIsBusy(false)
    }
  }

  async function changeStage(nextStage) {
    setErrorMessage('')
    setIsBusy(true)

    try {
      const updatedStage = await setPresentationStage(password, nextStage)
      setCurrentStage(updatedStage)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to change the presentation stage.')
    } finally {
      setIsBusy(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="stage-control-backdrop">
      <section
        aria-labelledby="stage-control-title"
        aria-modal="true"
        className="stage-control-panel"
        role="dialog"
      >
        <button
          aria-label="Close stage controls"
          className="stage-control-close"
          disabled={isBusy}
          onClick={closePanel}
          type="button"
        >
          ×
        </button>
        <h1 id="stage-control-title">Presentation controls</h1>
        {!isAuthorized ? (
          <form className="stage-control-form" onSubmit={handlePasswordSubmit}>
            <label htmlFor="stage-control-password">Password</label>
            <input
              autoComplete="current-password"
              id="stage-control-password"
              ref={passwordInputRef}
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errorMessage && <p className="stage-control-error" role="alert">{errorMessage}</p>}
            <button disabled={isBusy} type="submit">
              {isBusy ? 'Checking…' : 'Continue'}
            </button>
          </form>
        ) : (
          <>
            <p className="stage-control-status">
              <strong>Current:</strong> {currentStage} - {getDescription(currentStage)}
            </p>
            <p className="stage-control-status">
              <strong>Next:</strong>{' '}
              {currentStage < 14
                ? `${currentStage + 1} - ${getDescription(currentStage + 1)}`
                : '— - No next stage'}
            </p>
            {errorMessage && <p className="stage-control-error" role="alert">{errorMessage}</p>}
            <div className="stage-control-actions">
              <button
                disabled={isBusy || currentStage <= -1}
                onClick={() => changeStage(currentStage - 1)}
                type="button"
              >
                Back
              </button>
              <button
                disabled={isBusy || currentStage >= 14}
                onClick={() => changeStage(currentStage + 1)}
                type="button"
              >
                Forward
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
