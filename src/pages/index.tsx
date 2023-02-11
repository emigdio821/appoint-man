import { useEffect } from 'react'
// import useSWR, { Fetcher } from 'swr'
import Helmet from '@/components/Helmet'
import useUserStore from '@/stores/user'
import Toast from '@/components/Toast'
import { useState } from 'react'
import AppWrapper from '@/components/AppWrapper'
import useTranslation from '@/hooks/useTranslation'
import { GetServerSidePropsContext } from 'next/types'
// import CreateAppointment from '@/components/CreateAppointment'
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'

interface HomeProps {
  user: User
  userImageUrl: string
}

export default function Home({ user, userImageUrl }: HomeProps) {
  const { t } = useTranslation()
  const { addUser } = useUserStore()
  const [showToast, setShowToast] = useState<boolean>(false)
  const [showToast2, setShowToast2] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      const userData = { ...user, userImageUrl }
      addUser(userData)
    }
  }, [addUser, user, userImageUrl])

  return (
    <AppWrapper>
      <Helmet title="Home" />
      <h3 className="text-2xl font-semibold">
        {t('welcome')}, {user.user_metadata?.name}
      </h3>
      <p className="text-md">{t('welcomeDescription')}</p>
      <Toast setOpen={setShowToast} isOpen={showToast} />
      <Toast setOpen={setShowToast2} isOpen={showToast2} />
      <button onClick={() => setShowToast(!showToast)}>ASDASD</button>
      <button onClick={() => setShowToast2(!showToast2)}>22222</button>
      {/* <CreateAppointment /> */}
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
