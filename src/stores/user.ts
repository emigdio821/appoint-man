import { User } from '@/types'
import { create } from 'zustand'

interface UserState {
  user: User | null
  addUser: (user: User) => void
  removeUser: () => void
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
}))

export default useUserStore
