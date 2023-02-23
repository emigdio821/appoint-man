import { useState } from 'react'
import { Toaster } from 'sonner'
import { AppProps } from 'next/app'
// import { Inter } from '@next/font/google'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
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
        {!hideNav.includes(router.pathname) && <Navbar />}
        <Toaster
          duration={6000}
          toastOptions={{
            className:
              'bg-white text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white',
          }}
          style={{
            position: 'fixed',
          }}
        />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionContextProvider>
  )
}
