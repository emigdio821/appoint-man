import en from '@/locales/en.json'
import { User as SupaUser } from '@supabase/auth-helpers-nextjs'

export type TranslationKey = keyof typeof en
export type Locale = 'en' | 'es'

export interface LocaleItems {
  id: Locale
  code: TranslationKey
}

interface UserImageUrl {
  userImageUrl?: string
}

export interface User extends UserImageUrl, SupaUser {}

export interface ToastOptions {
  title: string
  description?: string
  onOpenChange?: (isOpen: boolean) => void
  action?: {
    text: string
    callback: () => void
  }
}

export interface EventPayload {
  summary: string
  description: string
  start: {
    dateTime: string
    timeZome: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees: {
    email: string
  }[]
}

export interface EventFormValues {
  summary: string
  description: string
  date: string
  startTime: string
  endTime: string
}
