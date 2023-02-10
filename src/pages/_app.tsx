import { useState } from 'react'
import { AppProps } from 'next/app'
// import { Inter } from '@next/font/google'
import { ThemeProvider } from 'next-themes'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import '@/styles/global.css'

// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionContextProvider>
  )
}
