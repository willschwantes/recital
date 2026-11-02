import { readFile } from 'node:fs/promises'

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the shell before importing content.')
}

const content = JSON.parse(await readFile('supabase/private-content.json', 'utf8'))

if (
  !Array.isArray(content)
  || content.some((record) => (
    typeof record.content_id !== 'string'
    || !Number.isInteger(record.release_stage)
    || !Number.isInteger(record.sort_order)
    || typeof record.payload !== 'object'
    || record.payload === null
  ))
) {
  throw new Error('supabase/private-content.json is missing or has an invalid record shape.')
}

const response = await fetch(
  `${supabaseUrl}/rest/v1/presentation_content?on_conflict=content_id`,
  {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(content),
  },
)

if (!response.ok) {
  throw new Error(`Content import failed (${response.status}): ${await response.text()}`)
}

console.log(`Imported ${content.length} presentation content records.`)
