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
interface userImageUrl {
  userImageUrl: string
}

export interface User extends userImageUrl, SupaUser {}
