// import useSWR, { Fetcher } from 'swr'
import {
  User,
  Session,
  createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Helmet from '@/components/Helmet'
import useUserStore from '@/stores/user'
import AppWrapper from '@/components/AppWrapper'
import useTranslation from '@/hooks/useTranslation'
import { GetServerSidePropsContext } from 'next/types'
import CreateAppointment from '@/components/CreateAppointment'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

interface HomeProps {
  user: User
  userImageUrl: string
  initialSession: Session
}

export default function Home({
  user,
  userImageUrl,
  initialSession,
}: HomeProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const supabase = useSupabaseClient()
  const { addUser, removeUser } = useUserStore()
  const { provider_refresh_token: providerRefreshToken } = initialSession

  useEffect(() => {
    if (user) {
      const userData = {
        ...user,
        userImageUrl,
        providerRefreshToken,
      }
      addUser(userData)
    }
  }, [addUser, providerRefreshToken, user, userImageUrl])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        removeUser()
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [removeUser, router, supabase.auth])

  return (
    <AppWrapper>
      <Helmet title={t('homePageTitle')} />
      <h3 className="text-xl font-semibold">
        {t('welcome')}, {user.user_metadata?.name}
      </h3>
      <p className="text-sm">{t('welcomeDescription')}</p>
      <CreateAppointment />
    </AppWrapper>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
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

  const { data } = await supabase.storage
    .from('appoint-man')
    .createSignedUrl(`avatars/${session.user.id}`, 60)

  return {
    props: {
      user: session.user,
      initialSession: session,
      userImageUrl: data?.signedUrl || null,
    },
  }
}
