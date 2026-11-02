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
