import { User as SupaUser, Session } from '@supabase/auth-helpers-nextjs'

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
}

export interface Translations {
  en: Translation
  es: Translation
}

export type Locale = keyof Translations
export type LocaleKey = keyof Translation

export interface LocaleItems {
  id: Locale
  code: LocaleKey
}

interface UserImageUrl {
  userImageUrl: string
}

interface providerRefreshToken {
  providerRefreshToken?: string | null
}

export interface User extends UserImageUrl, providerRefreshToken, SupaUser {}

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
}
