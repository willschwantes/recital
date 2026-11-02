import { createClient } from 'npm:@supabase/supabase-js@2'

const allowedOrigins = new Set([
  'https://willschwantes.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

function jsonResponse(body: Record<string, unknown>, status: number, origin: string | null) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
  })

  if (origin && allowedOrigins.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return new Response(JSON.stringify(body), { status, headers })
}

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder()
  const leftBytes = encoder.encode(left)
  const rightBytes = encoder.encode(right)
  let difference = leftBytes.length ^ rightBytes.length
  const length = Math.max(leftBytes.length, rightBytes.length)

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0)
  }

  return difference === 0
}

Deno.serve(async (request) => {
  const origin = request.headers.get('Origin')

  if (origin && !allowedOrigins.has(origin)) {
    return jsonResponse({ error: 'Origin is not allowed.' }, 403, null)
  }

  if (request.method === 'OPTIONS') {
    const response = new Response(null, {
      status: 204,
      headers: {
        'Cache-Control': 'no-store',
        'Vary': 'Origin',
      },
    })
    if (origin && allowedOrigins.has(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'authorization, apikey, content-type, x-client-info')
    response.headers.set('Access-Control-Max-Age', '86400')
    return response
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, origin)
  }

  const expectedPassword = Deno.env.get('PRESENTATION_ADMIN_PASSWORD')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!expectedPassword || expectedPassword.length < 32 || !supabaseUrl || !serviceRoleKey) {
    console.error('Stage function is missing valid server-side configuration.')
    return jsonResponse({ error: 'Stage updates are not configured.' }, 500, origin)
  }

  const rawBody = await request.text()
  if (rawBody.length > 2048) {
    return jsonResponse({ error: 'Request is too large.' }, 413, origin)
  }

  let body: { password?: unknown; stage?: unknown }
  try {
    body = JSON.parse(rawBody)
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON.' }, 400, origin)
  }

  if (!body || typeof body !== 'object') {
    return jsonResponse({ error: 'Request body must be a JSON object.' }, 400, origin)
  }

  if (typeof body.password !== 'string' || !constantTimeEqual(body.password, expectedPassword)) {
    return jsonResponse({ error: 'Invalid password.' }, 401, origin)
  }

  if (typeof body.stage !== 'number' || !Number.isInteger(body.stage) || body.stage < -1 || body.stage > 14) {
    return jsonResponse({ error: 'Stage must be an integer between -1 and 14.' }, 400, origin)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data, error } = await supabase
    .from('presentation_control')
    .update({ stage: body.stage })
    .eq('id', true)
    .select('id')
    .maybeSingle()

  if (error || !data) {
    console.error('Could not update presentation stage:', error?.message ?? 'stage row is missing')
    return jsonResponse({ error: 'Unable to update presentation stage.' }, 500, origin)
  }

  return jsonResponse({ stage: body.stage }, 200, origin)
})
