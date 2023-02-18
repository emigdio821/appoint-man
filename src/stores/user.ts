import { create } from 'zustand'
import { User } from '@supabase/auth-helpers-nextjs'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  avatar: string
  user: User | null
  addUser: (user: User) => void
  removeUser: () => void
  updateAvatar: (url: string) => void
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: get()?.user || null,
      avatar: get()?.avatar || '',
      addUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
      removeUser: () =>
        set((state) => ({
          ...state,
          user: null,
        })),
      updateAvatar: (url: string) =>
        set((state) => ({
          ...state,
          avatar: url,
        })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// const useUserStore = create<UserState>((set) => ({
//   user: null,
//   addUser: (user) =>
//     set((state) => ({
//       ...state,
//       user,
//     })),
//   removeUser: () =>
//     set((state) => ({
//       ...state,
//       user: null,
//     })),
//   updateAvatar: (url) =>
//     set((state) => {
//       if (state.user) {
//         return {
//           ...state,
//           user: {
//             ...state.user,
//             userImageUrl: url,
//           },
//         }
//       }
//       return {
//         ...state,
//         user: null,
//       }
//     }),
// }))

export default useUserStore
