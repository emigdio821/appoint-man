import { useEffect } from 'react'
import useSWR, { Fetcher } from 'swr'
import Helmet from '@/components/Helmet'
import useUserStore from '@/stores/user'
import { Text, Title } from '@mantine/core'
import AppWrapper from '@/components/AppWrapper'
import useTranslation from '@/hooks/useTranslation'
import { GetServerSidePropsContext } from 'next/types'
import CreateAppointment from '@/components/CreateAppointment'
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'

interface HomeProps {
  user: User
  userImageUrl: string
}

export default function Home({ user, userImageUrl }: HomeProps) {
  const { t } = useTranslation()
  const { addUser } = useUserStore()

  useEffect(() => {
    if (user) {
      const userData = { ...user, userImageUrl }
      addUser(userData)
    }
  }, [addUser, user, userImageUrl])

  return (
    <AppWrapper>
      <Helmet title="Home" />
      <Title size="h3">
        {t('welcome')}, {user.user_metadata?.name}
      </Title>
      <Text>{t('welcomeDescription')}</Text>
      <CreateAppointment />
    </AppWrapper>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient(ctx)
  // const { locale } = ctx
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
