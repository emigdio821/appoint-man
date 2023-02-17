import { useState } from 'react'
import { AppProps } from 'next/app'
// import { Inter } from '@next/font/google'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
import { ToastProvider } from '@/context/toast'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import '@/styles/global.css'

// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const hideNav = ['/login']

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const router = useRouter()

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ToastProvider>
          {!hideNav.includes(router.pathname) && <Navbar />}
          <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
    </SessionContextProvider>
  )
}
