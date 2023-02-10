import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
const ep = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  })
  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession()

  if (!session) {
    res.status(500).json({ error: 'No active session' })
    return
  }

  const response = await fetch(ep, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.provider_token}`,
    },
    body: req.body,
  })

  if (response.ok) {
    const event = await response.json()
    res.status(200).json(event)
  } else {
    let message = 'Failed to write data'
    res.status(response.status).json({ error: message })
  }
}
