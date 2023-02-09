import { Text, Title } from '@mantine/core'
import useSWR, { Fetcher } from 'swr'
import Helmet from '@/components/Helmet'
import AppWrapper from '@/components/AppWrapper'
import { GetServerSidePropsContext } from 'next/types'
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import useTranslation from '@/hooks/useTranslation'

interface HomeProps {
  user: User
}

export default function Home({ user }: HomeProps) {
  const { t } = useTranslation()

  return (
    <AppWrapper>
      <Helmet title="Home" />
      <Title size="h3">
        {t('welcome')}, {user.user_metadata?.name}
      </Title>
      <Text>{t('welcomeDescription')}</Text>
    </AppWrapper>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient(ctx)
  const { locale } = ctx
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

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}
