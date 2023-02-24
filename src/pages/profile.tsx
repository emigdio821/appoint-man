import clsx from 'clsx'
import { toast } from 'sonner'
import { bytesToMB } from '@/utils'
import useUserStore from '@/stores/user'
import Helmet from '@/components/Helmet'
import { shallow } from 'zustand/shallow'
import AppWrapper from '@/components/AppWrapper'
import * as Avatar from '@radix-ui/react-avatar'
import { BiCamera, BiUser } from 'react-icons/bi'
import useTranslation from '@/hooks/useTranslation'
import { useState, useEffect, useRef } from 'react'
import { useSupabaseClient, User } from '@supabase/auth-helpers-react'

export default function Profile() {
  const { t } = useTranslation()
  const pageTitle = t('profile')
  const supabase = useSupabaseClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { userFromStore, avatar, updateAvatar } = useUserStore(
    (state) => ({
      avatar: state.avatar,
      userFromStore: state.user,
      updateAvatar: state.updateAvatar,
    }),
    shallow,
  )

  async function createAvatarUrl() {
    const { data, error } = await supabase.storage
      .from('appoint-man')
      .createSignedUrl(`avatars/${user?.id}`, 3600)

    if (error) {
      setIsLoading(false)
      throw new Error(error.message)
    }

    updateAvatar(data.signedUrl)
    setIsLoading(false)
  }

  async function handleFile(files: FileList) {
    setIsLoading(true)
    const { error } = await supabase.storage
      .from('appoint-man')
      .upload(`avatars/${user?.id}`, files[0], {
        upsert: true,
        contentType: files[0].type,
      })

    if (error) {
      setIsLoading(false)
      throw new Error(error.message)
    }

    createAvatarUrl()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files

    if (files?.length) {
      const size = bytesToMB(files[0].size)
      if (size > 3) {
        toast.error('Error', {
          description: t('fileTooBig'),
        })
      } else {
        try {
          toast.promise(() => handleFile(files), {
            error: t('error'),
            success: t('avatarUpdated'),
            loading: `${t('uploading')}...`,
          })
        } catch (error) {
          console.error(error)
          toast.error('Error', { description: t('error') })
        }
      }
    }
  }

  useEffect(() => {
    setUser(userFromStore)
    setIsLoading(false)
  }, [userFromStore])

  return (
    <AppWrapper>
      <Helmet title={pageTitle} />
      <div className="mx-auto mt-4 max-w-2xl rounded-md border p-4 dark:border-zinc-800 dark:bg-zinc-900 max-sm:text-center">
        <h3 className="mb-6 text-xl font-semibold">{pageTitle}</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 max-sm:flex-col-reverse max-sm:gap-4">
            <div>
              <h5 className="text-md font-semibold">
                {user?.user_metadata.full_name}
              </h5>
              <h6 className="text-sm opacity-80">{user?.email}</h6>
            </div>
            <Avatar.Root
              className={clsx(
                'relative inline-flex h-20 w-20 select-none items-center justify-center rounded-lg bg-transparent align-middle',
                { 'animate-pulse': isLoading },
              )}
            >
              {user && (
                <Avatar.Image
                  alt="Avatar"
                  src={avatar}
                  onLoadingStatusChange={async (status) => {
                    if (status === 'error' && avatar) {
                      const { data } = await supabase.storage
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
              <button
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 rounded-md border bg-zinc-100 p-[2px] px-1 disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-700"
              >
                <BiCamera />
              </button>
              <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-[inherit] bg-zinc-100 dark:bg-zinc-800">
                <BiUser className="text-xl" />
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
          <input
            hidden
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="simple-input text-sm"
          />
        </div>
      </div>
    </AppWrapper>
  )
}
