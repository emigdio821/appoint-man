// import useSWR, { Fetcher } from 'swr'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
import Helmet from '@/components/Helmet'
import useUserStore from '@/stores/user'
import AppWrapper from '@/components/AppWrapper'
import CreateEvent from '@/components/CreateEvent'
import useTranslation from '@/hooks/useTranslation'
import { setCookie, getCookie } from 'cookies-next'
import { GetServerSidePropsContext } from 'next/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { User, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { shallow } from 'zustand/shallow'

interface HomeProps {
  user: User
  googleCookie: string | null
}

export default function Home({ user, googleCookie }: HomeProps) {
  // const router = useRouter()
  const { t } = useTranslation()
  // const { user } = useUserStore(
  //   (state) => ({
  //     user: state.user,
  //   }),
  //   shallow,
  // )
  // const supabase = useSupabaseClient()

  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_, session) => {
  //     if (!session) {
  //       removeUser()
  //       router.push('/login')
  //     }
  //   })

  //   return () => subscription.unsubscribe()
  // }, [removeUser, router, supabase.auth])

  return (
    <AppWrapper>
      <Helmet title={t('homePageTitle')} />
      <h3 className="text-xl font-semibold">
        {t('welcome')}, {user.user_metadata?.name}
      </h3>
      <h6 className="text-xs">Refresh token: {googleCookie}</h6>
      <p className="mb-6 text-sm">{t('welcomeDescription')}</p>
      <CreateEvent />
    </AppWrapper>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req, res } = ctx
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }

  if (session.provider_refresh_token) {
    setCookie('google-refresh-token', session.provider_refresh_token, {
      req,
      res,
    })
  }

  const googleCookie = getCookie('google-refresh-token', { req, res })

  return {
    props: {
      user: session.user,
      initialSession: session,
      googleCookie: googleCookie || null,
    },
  }
}
