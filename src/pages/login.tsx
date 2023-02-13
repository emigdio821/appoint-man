import Link from 'next/link'
// import { useEffect } from 'react'
// import { useRouter } from 'next/router'
import Helmet from '@/components/Helmet'
import { FaGoogle } from 'react-icons/fa'
import { useToastManager } from '@/context/toast'
import useTranslation from '@/hooks/useTranslation'
import LangSwitcher from '@/components/LangSwitcher'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { GetServerSidePropsContext } from 'next/types'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { BiCalendar, BiLoaderAlt, BiRightArrowAlt } from 'react-icons/bi'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function Login() {
  // const router = useRouter()
  const { t } = useTranslation()
  const { showToast } = useToastManager()
  const { supabaseClient, session, isLoading } = useSessionContext()

  async function signInWithGoogle() {
    const googleScope = 'https://www.googleapis.com/auth'
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: '/',
          queryParams: {
            prompt: 'consent',
            access_type: 'offline',
          },
          scopes: `${googleScope}/calendar ${googleScope}/calendar.events`,
        },
      })
    } catch (err) {
      let error = t('error')
      if (err instanceof Error) {
        error = err.message
      }
      showToast({ title: 'Error', description: error })
    }
  }

  // useEffect(() => {
  //   if (session) {
  //     router.push('/')
  //   }
  // }, [router, session])

  return (
    <>
      <Helmet title={t('login')} />
      <div className="flex h-screen items-center max-md:flex-col-reverse">
        <div className="w-1/3 p-6 max-md:h-2/3 max-md:w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <BiCalendar size={28} />
            <h2 className="mb-6 text-center text-xl font-bold">
              {t('welcomeTo')} AppointMan
            </h2>
            <div className="flex w-full flex-col items-center gap-1">
              {session ? (
                <>
                  <h4 className="text-center text-lg font-bold opacity-80">
                    {session.user.user_metadata.name}
                  </h4>
                  <Link
                    href="/"
                    passHref
                    data-disabled={isLoading}
                    className="simple-btn flex w-full max-w-[240px] items-center justify-center gap-2 rounded-full text-sm"
                  >
                    {t('goToHome')}
                    {isLoading ? (
                      <BiLoaderAlt className="animate-spin" />
                    ) : (
                      <BiRightArrowAlt />
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-center">{t('signInWith')}</p>
                  <button
                    disabled={isLoading}
                    onClick={signInWithGoogle}
                    className="simple-btn flex w-full max-w-[240px] items-center justify-center gap-2 rounded-full text-sm"
                  >
                    {isLoading ? (
                      <BiLoaderAlt className="animate-spin" />
                    ) : (
                      <FaGoogle />
                    )}
                    Google
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-1">
              <LangSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
        <div className="h-full w-2/3 bg-[url('/images/login-bg.webp')] bg-cover max-md:h-1/3 max-md:w-full" />
      </div>
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
    },
  }
}
