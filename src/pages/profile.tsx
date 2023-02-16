import useUserStore from '@/stores/user'
import { shallow } from 'zustand/shallow'
import AppWrapper from '@/components/AppWrapper'
import { useSessionContext } from '@supabase/auth-helpers-react'

export default function Profile() {
  const { supabaseClient, session } = useSessionContext()
  const { user, updateAvatar } = useUserStore(
    (state) => ({
      user: state.user,
      updateAvatar: state.updateAvatar,
    }),
    shallow,
  )

  return (
    <AppWrapper>
      <h3 className="text-xl font-semibold">Profile</h3>
      <input
        type="file"
        accept="image/png, image/jpeg"
        className="simple-input text-sm"
        onChange={async (e) => {
          const files = e.target.files

          if (files && session) {
            try {
              await supabaseClient.storage
                .from('appoint-man')
                .update(`avatars/${user?.id}`, files[0], {
                  cacheControl: '3600',
                  upsert: true,
                  // contentType: files[0].type,
                })

              const { data } = await supabaseClient.storage
                .from('appoint-man')
                .createSignedUrl(`avatars/${user?.id}`, session?.expires_in)

              if (data?.signedUrl) {
                updateAvatar(data.signedUrl)
              } else {
                throw new Error('Bla bla')
              }
            } catch (error) {
              console.log(error)
            }
          }
        }}
      />
    </AppWrapper>
  )
}
