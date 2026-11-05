import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
let configurationError = null

if (!supabaseUrl || !supabaseAnonKey) {
  configurationError = 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
} else {
  try {
    const url = new URL(supabaseUrl)
    if (!['https:', 'http:'].includes(url.protocol)) {
      configurationError = 'VITE_SUPABASE_URL must use HTTP or HTTPS.'
    }
  } catch {
    configurationError = 'VITE_SUPABASE_URL must be a valid URL.'
  }
}

export const supabaseConfigurationError = configurationError
export const supabase = configurationError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)

async function callStageFunction(body) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(supabaseConfigurationError ?? 'Supabase is not configured.')
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/set-stage`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('The stage-control server returned an invalid response.')
  }

  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new Error('The stage-control server returned an invalid response.')
  }

  if (!response.ok) {
    throw new Error(typeof result.error === 'string' ? result.error : 'The stage-control request failed.')
  }

  return result
}

export async function verifyPresentationAdmin(password) {
  const result = await callStageFunction({ action: 'verify', password })
  if (result.authorized !== true) {
    throw new Error('The stage-control server returned an unexpected response.')
  }
}

export async function setPresentationStage(password, stage) {
  const result = await callStageFunction({ password, stage })
  if (!Number.isInteger(result.stage) || result.stage !== stage) {
    throw new Error('The stage-control server returned an unexpected response.')
  }
  return result.stage
}
