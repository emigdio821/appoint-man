import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownContent,
  DropdownTrigger,
  DropdownSeparator,
} from './primitives/Dropdown'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import useUserStore from '@/stores/user'
import { shallow } from 'zustand/shallow'
import { useState, useEffect } from 'react'
import { deleteCookie } from 'cookies-next'
import * as Avatar from '@radix-ui/react-avatar'
import { useToastManager } from '@/context/toast'
import useTranslation from '@/hooks/useTranslation'
import { BiCog, BiSun, BiMoon, BiUser, BiLogOut } from 'react-icons/bi'
import { useSessionContext, type User } from '@supabase/auth-helpers-react'

export default function UserMenu() {
  const router = useRouter()
  const { locale } = router
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const { showToast } = useToastManager()
  const [user, setUser] = useState<User | null>(null)
  const { userFromStore, removeUser, updateAvatar, avatar } = useUserStore(
    (state) => ({
      avatar: state.avatar,
      userFromStore: state.user,
      removeUser: state.removeUser,
      updateAvatar: state.updateAvatar,
    }),
    shallow,
  )
  const { supabaseClient, isLoading } = useSessionContext()

  async function openSettings() {
    showToast({
      title: 'Info',
      description: 'This options is still in construction, come back later',
    })
  }

  async function userSignOut() {
    try {
      await supabaseClient.auth.signOut()
      removeUser()
      deleteCookie('google-refresh-token')
      router.push('/login')
    } catch (err) {
      let error = t('error')
      if (err instanceof Error) {
        error = err.message
      }
      showToast({ title: 'Error', description: error })
    }
  }

  useEffect(() => {
    setUser(userFromStore)
  }, [userFromStore])

  return (
    <Dropdown>
      <DropdownTrigger
        disabled={isLoading || !user}
        className="simple-btn flex items-center gap-2 text-sm font-medium"
      >
        <span className="max-xs:hidden">
          {user ? (
            <>{user.user_metadata.name?.split(' ')[0]}</>
          ) : (
            <div
              role="status"
              className="h-2 w-14 animate-pulse rounded-md bg-zinc-300 dark:bg-zinc-600"
            />
          )}
        </span>
        <Avatar.Root className="inline-flex h-5 w-5 select-none items-center justify-center overflow-hidden rounded-md bg-blackA3 align-middle">
          {user && (
            <Avatar.Image
              alt="Avatar"
              src={avatar}
              onLoadingStatusChange={async (status) => {
                if (status === 'error' && avatar) {
                  const { data } = await supabaseClient.storage
                    .from('appoint-man')
                    .createSignedUrl(`avatars/${user.id}`, 3600)
                  if (data?.signedUrl) {
                    updateAvatar(data.signedUrl)
                  }
                }
              }}
              className="h-full w-full rounded-[inherit] object-cover"
            />
          )}
          <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-700">
            <BiUser />
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownLabel className="dropdown-label mb-0 opacity-100">
          <h4 className="text-base font-semibold">
            {user?.user_metadata.full_name}
          </h4>
        </DropdownLabel>
        <DropdownLabel className="dropdown-label mb-3 opacity-70">
          {user?.email}
        </DropdownLabel>
        <Link href="/profile" passHref>
          <DropdownItem className="dropdown-item">
            <div className="dropdown-indicator">
              <BiUser />
            </div>
            {t('profile')}
          </DropdownItem>
        </Link>
        <DropdownItem
          className="dropdown-item"
          onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')}
        >
          <div className="dropdown-indicator">
            {isDarkTheme ? <BiSun /> : <BiMoon />}
          </div>
          {locale === 'en' ? (
            <>{`${isDarkTheme ? t('light') : t('dark')} ${t('theme')}`}</>
          ) : (
            <>{`${t('theme')} ${isDarkTheme ? t('light') : t('dark')}`}</>
          )}
        </DropdownItem>
        <DropdownSeparator className="dropdown-separator" />
        <DropdownItem className="dropdown-item" onClick={openSettings}>
          <div className="dropdown-indicator">
            <BiCog />
          </div>
          {t('settings')}
        </DropdownItem>
        <DropdownSeparator className="dropdown-separator" />
        <DropdownItem
          onClick={userSignOut}
          className="dropdown-item text-red-400"
        >
          <div className="dropdown-indicator text-red-400">
            <BiLogOut />
          </div>
          <div>Logout</div>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}
