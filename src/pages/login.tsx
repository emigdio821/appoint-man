import {
  Box,
  Text,
  Paper,
  Title,
  Stack,
  Group,
  Button,
  createStyles,
  BackgroundImage,
} from '@mantine/core'
import NextLink from 'next/link'
// import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Helmet from '@/components/Helmet'
import { FaGoogle } from 'react-icons/fa'
import useTranslation from '@/hooks/useTranslation'
import LangSwitcher from '@/components/LangSwitcher'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { GetServerSidePropsContext } from 'next/types'
import { showNotification } from '@mantine/notifications'
import { BiCalendar, BiRightArrowAlt } from 'react-icons/bi'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark'

  return {
    container: {
      height: '100vh',
      alignItems: 'center',
      flexDirection: 'row',
      [`@media (max-width: ${theme.breakpoints.md}px)`]: {
        flexDirection: 'column-reverse',
      },
    },

    paper: {
      borderRight: `1px solid ${
        isDark ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
      width: '30%',
      [`@media (max-width: ${theme.breakpoints.md}px)`]: {
        width: '100%',
        height: '70%',
      },
    },

    imageContainer: {
      width: '70%',
      height: '100%',
      [`@media (max-width: ${theme.breakpoints.md}px)`]: {
        height: '30%',
        width: '100%',
      },
    },

    image: {
      height: '100%',
      opacity: isDark ? 0.8 : 1,
      filter: `brightness(${isDark ? 0.8 : 1})`,
    },

    googleBtn: {
      maxWidth: 300,
      margin: '0 auto',
      borderRadius: theme.radius.xl,
    },
  }
})

export default function Login() {
  // const router = useRouter()
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { supabaseClient, session, isLoading } = useSessionContext()

  async function signInWithGoogle() {
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: '/',
        },
      })
    } catch (error) {
      showNotification({
        color: 'red',
        title: 'Error',
        message: t('error'),
      })
    }
  }

  // useEffect(() => {
  //   if (session) {
  //     router.push('/')
  //   }
  // }, [router, session])

  return (
    <>
      <Helmet title="Login" />
      <Stack spacing={0} className={classes.container}>
        <Paper className={classes.paper} p="xl">
          <Stack align="center">
            <BiCalendar size={28} />
            <Title size="h2" align="center" mb="xl">
              {t('welcomeTo')} AppointMan
            </Title>
            {session ? (
              <Stack spacing="xs">
                <Title size="h4">{session.user.user_metadata.name}</Title>
                <NextLink href="/">
                  <Button loading={isLoading} rightIcon={<BiRightArrowAlt />}>
                    {t('goToHome')}
                  </Button>
                </NextLink>
              </Stack>
            ) : (
              <Stack w="100%" spacing={1}>
                <Text align="center" color="dimmed">
                  {t('signInWith')}
                </Text>
                <Button
                  fullWidth
                  loading={isLoading}
                  leftIcon={<FaGoogle />}
                  onClick={signInWithGoogle}
                  className={classes.googleBtn}
                >
                  Google
                </Button>
              </Stack>
            )}
            <Group spacing="xs">
              <LangSwitcher />
              <ThemeSwitcher />
            </Group>
          </Stack>
        </Paper>
        <Box className={classes.imageContainer}>
          <BackgroundImage
            src="/images/login-bg.webp"
            className={classes.image}
          />
        </Box>
      </Stack>
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
