import { User } from '@/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  user: User | null
  addUser: (user: User) => void
  removeUser: () => void
  updateAvatar: (url: string) => void
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: get()?.user || null,
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
      updateAvatar: (url) =>
        set((state) => {
          if (state.user) {
            return {
              ...state,
              user: {
                ...state.user,
                avatar: url,
              },
            }
          }
          return {
            ...state,
            user: null,
          }
        }),
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
