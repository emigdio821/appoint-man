import { User } from '@/types'
import { create } from 'zustand'

interface UserState {
  user: User | null
  addUser: (user: User) => void
  removeUser: () => void
  updateAvatar: (url: string) => void
}

const useUserStore = create<UserState>((set) => ({
  user: null,
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
            userImageUrl: url,
          },
        }
      }
      return {
        ...state,
        user: null,
      }
    }),
}))

export default useUserStore
