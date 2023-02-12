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
    return res.status(403).json('Unauthorized')
  }

  const response = await fetch(ep, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${session?.provider_token}`,
    },
    body: req.body,
  })

  if (response.ok) {
    const event = await response.json()
    res.status(200).json(event)
  } else {
    res.status(response.status).json(response.statusText)
  }
}
