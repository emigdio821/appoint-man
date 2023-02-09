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
