import {
  ColorScheme,
  MantineProvider,
  ColorSchemeProvider,
} from '@mantine/core'
import { useState } from 'react'
import { AppProps } from 'next/app'
import { Inter } from '@next/font/google'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'

const inter = Inter({ subsets: ['latin'] })

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    defaultValue: 'dark',
    key: 'mantine-color-scheme',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            components: {
              Button: {
                defaultProps: {
                  variant: 'default',
                },
              },
              Tooltip: {
                defaultProps: {
                  transitionDuration: 300,
                  transition: 'rotate-left',
                },
              },
            },
          }}
        >
          <NotificationsProvider>
            <Component {...pageProps} className={inter.className} />
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </SessionContextProvider>
  )
}
