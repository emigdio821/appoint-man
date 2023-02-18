import en from '@/locales/en.json'

export type TranslationKey = keyof typeof en
export type Locale = 'en' | 'es'

export interface LocaleItems {
  id: Locale
  code: TranslationKey
}

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

export interface ProfileDB {
  id: string
  role: string
  name: string
  email: string
}
