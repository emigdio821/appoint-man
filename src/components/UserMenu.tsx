import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownContent,
  DropdownTrigger,
  DropdownSeparator,
} from './primitives/Dropdown'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import useUserStore from '@/stores/user'
import { deleteCookie } from 'cookies-next'
import { useToastManager } from '@/context/toast'
import useTranslation from '@/hooks/useTranslation'
import { BiCog, BiSun, BiMoon, BiLogOut, BiUser } from 'react-icons/bi'
import { useSessionContext } from '@supabase/auth-helpers-react'
import * as Avatar from '@radix-ui/react-avatar'

export default function UserMenu() {
  const router = useRouter()
  const { locale } = router
  const { t } = useTranslation()
  const { user, removeUser } = useUserStore()
  const { theme, setTheme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const { showToast } = useToastManager()
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
      router.push('/')
    } catch (err) {
      let error = t('error')
      if (err instanceof Error) {
        error = err.message
      }
      showToast({ title: 'Error', description: error })
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger
        disabled={isLoading || !user}
        className="simple-btn flex items-center gap-2 text-sm font-medium"
      >
        <span className="max-xs:hidden">
          {user?.user_metadata.name?.split(' ')[0] || 'No user'}
        </span>
        <Avatar.Root className="inline-flex h-5 w-5 select-none items-center justify-center overflow-hidden rounded-md bg-blackA3 align-middle">
          <Avatar.Image
            alt="Avatar"
            src={user?.userImageUrl}
            className="h-full w-full rounded-[inherit] object-cover"
          />
          <Avatar.Fallback
            delayMs={600}
            className="flex h-full w-full items-center justify-center bg-zinc-200 text-sm font-medium dark:bg-zinc-700"
          >
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
        <DropdownItem className="dropdown-item" onClick={openSettings}>
          <div className="dropdown-indicator">
            <BiCog />
          </div>
          {t('settings')}
        </DropdownItem>
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
