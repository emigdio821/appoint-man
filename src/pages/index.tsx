// import useSWR, { Fetcher } from 'swr'
import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
import Helmet from '@/components/Helmet'
import useUserStore from '@/stores/user'
import { setCookie } from 'cookies-next'
import AppWrapper from '@/components/AppWrapper'
import useTranslation from '@/hooks/useTranslation'
import Appointments from '@/components/Appointments'
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
  // const { userFromStore, addUser } = useUserStore(
  //   (state) => ({
  //     userFromStore: state.user,
  //     addUser: state.addUser,
  //   }),
  //   shallow,
  // )

  // useEffect(() => {
  //   if (user) {
  //     addUser(user)
  //   }
  // }, [addUser, user])

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
      <h6 className="mb-4 text-xs">Refresh token: {googleCookie}</h6>
      <Appointments />
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

  const googleCookie = req.cookies['google-refresh-token']

  return {
    props: {
      user: session.user,
      initialSession: session,
      googleCookie: googleCookie || null,
    },
  }
}
