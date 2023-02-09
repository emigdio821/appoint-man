import {
  Text,
  Menu,
  Stack,
  Title,
  Group,
  Button,
  Avatar,
  createStyles,
  useMantineColorScheme,
} from '@mantine/core'
import { useRouter } from 'next/router'
import useUserStore from '@/stores/user'
import { useDisclosure } from '@mantine/hooks'
import useTranslation from '@/hooks/useTranslation'
import { showNotification } from '@mantine/notifications'
import { BiCog, BiSun, BiMoon, BiLogOut, BiUser } from 'react-icons/bi'
import { useSessionContext } from '@supabase/auth-helpers-react'

const useStyles = createStyles((theme) => ({
  userName: {
    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      display: 'none',
    },
  },

  avatar: {
    color: theme.colors.blue,
    backgroundColor: theme.colors.blue,
  },

  menuActive: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[0],
    img: {
      opacity: 0.85,
      borderRadius: theme.radius.md,
    },
  },
}))

export default function UserMenu() {
  const router = useRouter()
  const { locale } = router
  const { t } = useTranslation()
  const { user, removeUser } = useUserStore()
  const { classes, cx } = useStyles()
  const { supabaseClient } = useSessionContext()
  const [opened, { toggle }] = useDisclosure(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const darkScheme = colorScheme === 'dark'

  async function openSettings() {
    showNotification({
      title: 'WIP',
      message: 'This options is still WIP, try again later',
    })
  }

  async function userSignOut() {
    try {
      await supabaseClient.auth.signOut()
      removeUser()
      router.push('/')
    } catch (error) {
      showNotification({
        color: 'red',
        title: 'Error',
        message: t('error'),
      })
    }
  }

  return (
    <Menu
      position="bottom-end"
      transition="rotate-left"
      onOpen={() => toggle()}
      onClose={() => toggle()}
    >
      <Menu.Target>
        <Button
          px="xs"
          disabled={!user}
          className={cx({
            [classes.menuActive]: opened,
          })}
        >
          <Group spacing={6}>
            <Text className={classes.userName}>
              {user?.user_metadata.name?.split(' ')[0] || 'No user'}
            </Text>
            {user?.userImageUrl ? (
              <Avatar size="sm" src={user.userImageUrl} alt="Avatar">
                <BiUser />
              </Avatar>
            ) : (
              <BiUser />
            )}
          </Group>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack px="sm" spacing={0} mb="md">
          <Title size="h5">{user?.user_metadata.full_name}</Title>
          <Text size="sm">{user?.email}</Text>
        </Stack>
        <Menu.Item icon={<BiCog />} onClick={() => openSettings()}>
          {t('settings')}
        </Menu.Item>
        <Menu.Item
          onClick={() => toggleColorScheme()}
          icon={darkScheme ? <BiSun /> : <BiMoon />}
        >
          {locale === 'en' ? (
            <>{`${darkScheme ? t('light') : t('dark')} ${t('theme')}`}</>
          ) : (
            <>{`${t('theme')} ${darkScheme ? t('light') : t('dark')}`}</>
          )}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" icon={<BiLogOut />} onClick={userSignOut}>
          {t('logout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
