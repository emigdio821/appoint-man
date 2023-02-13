import axios, { AxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
const eventsEP =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events'
const accessTokenEP = 'https://accounts.google.com/o/oauth2/token'

interface GoogleToken {
  access_token: string
  expires_in: number
  id_token: string
  scope: string
  token_type: string
}

const getAccessToken = (token: string) => {
  return axios<GoogleToken>({
    method: 'POST',
    url: accessTokenEP,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: {
      'Content-Type': 'application/x-www-form-urlencoded',
      grant_type: 'refresh_token',
      client_id: process.env.GOOGLE_ID as string,
      client_secret: process.env.GOOGLE_SECRET as string,
      refresh_token: token,
    },
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabaseServerClient = createServerSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession()

  if (!session) {
    return res.status(403).json('Unauthorized')
  }

  const { data: tokenData } = await getAccessToken(req.body.providerToken)

  try {
    const response = await axios.post(eventsEP, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      body: req.body.event,
    })

    res.status(200).json(response.data)
  } catch (error) {
    const err = error as AxiosError
    const status = err.status || 500
    res.status(status).json(err.code)
  }
}
