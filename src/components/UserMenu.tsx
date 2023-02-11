import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import useUserStore from '@/stores/user'
import useTranslation from '@/hooks/useTranslation'
import { BiCog, BiSun, BiMoon, BiLogOut, BiUser } from 'react-icons/bi'
import { useSessionContext } from '@supabase/auth-helpers-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Avatar from '@radix-ui/react-avatar'

export default function UserMenu() {
  const router = useRouter()
  const { locale } = router
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const { user, removeUser } = useUserStore()
  const { supabaseClient } = useSessionContext()

  async function openSettings() {
    alert('This options is still WIP, try again later')
  }

  async function userSignOut() {
    try {
      await supabaseClient.auth.signOut()
      removeUser()
      router.push('/')
    } catch (error) {
      alert(t('error'))
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="User Menu"
          className="simple-btn flex items-center gap-2 text-sm"
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
              className="flex h-full w-full items-center justify-center bg-gray-200 text-sm font-medium dark:bg-zinc-800"
            >
              <BiUser />
            </Avatar.Fallback>
          </Avatar.Root>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className="dropdown-content shadow-md"
        >
          <DropdownMenu.Label className="dropdown-label">
            <h4 className="text-base font-semibold">
              {user?.user_metadata.full_name}
            </h4>
          </DropdownMenu.Label>
          <DropdownMenu.Label className="dropdown-label mb-3 opacity-70">
            {user?.email}
          </DropdownMenu.Label>
          <DropdownMenu.DropdownMenuItem className="dropdown-item">
            <DropdownMenu.Item className="dropdown-indicator">
              <BiCog />
            </DropdownMenu.Item>
            {t('settings')}
          </DropdownMenu.DropdownMenuItem>
          <DropdownMenu.DropdownMenuItem
            className="dropdown-item"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            <DropdownMenu.Item className="dropdown-indicator">
              {isDark ? <BiSun /> : <BiMoon />}
            </DropdownMenu.Item>
            {locale === 'en' ? (
              <>{`${isDark ? t('light') : t('dark')} ${t('theme')}`}</>
            ) : (
              <>{`${t('theme')} ${isDark ? t('light') : t('dark')}`}</>
            )}
          </DropdownMenu.DropdownMenuItem>
          <DropdownMenu.Separator className="my-1 h-[1px] bg-gray-100 dark:bg-zinc-700/70" />
          <DropdownMenu.DropdownMenuItem
            onClick={userSignOut}
            className="dropdown-item text-red-400"
          >
            <DropdownMenu.Item className="dropdown-indicator text-red-400">
              <BiLogOut />
            </DropdownMenu.Item>
            <div>Logout</div>
          </DropdownMenu.DropdownMenuItem>
          <DropdownMenu.Arrow className="fill-white dark:fill-zinc-800" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
