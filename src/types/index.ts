import { User as SupaUser } from '@supabase/auth-helpers-nextjs'

export interface Translation {
  homePageTitle: string
  welcome: string
  welcomeTo: string
  welcomeDescription: string
  settings: string
  theme: string
  light: string
  dark: string
  logout: string
  login: string
  signInWith: string
  error: string
  backToHome: string
  pageNotFound: string
  english: string
  spanish: string
  language: string
  goToHome: string
  invalidEmail: string
  requiredField: string
  email: string
  name: string
  createAppointmentTitle: string
  dismiss: string
  success: string
  appointmentCreated: string
  invalidRange: string
}

export interface Translations {
  en: Translation
  es: Translation
}

export type Locale = keyof Translations

export type TranslationKey = keyof Translation

export interface LocaleItems {
  id: Locale
  code: TranslationKey
}

interface UserImageUrl {
  userImageUrl: string
}

interface ProviderRefreshToken {
  providerRefreshToken?: string | null
}

export interface User extends UserImageUrl, ProviderRefreshToken, SupaUser {}

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
