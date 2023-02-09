import en from '@/locales/en.json'
import es from '@/locales/es.json'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Translations, Locale, LocaleKey } from '@/types'

const translations: Translations = { en, es }

export default function useTranslation() {
  const router = useRouter()
  const { locale, asPath } = router

  const setCookie = useCallback((locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`
  }, [])

  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return
      setCookie(l || 'es')
      router.push(asPath, asPath, { locale: l, shallow: true })
    },
    [asPath, locale, router, setCookie],
  )

  const t = useCallback(
    (key: LocaleKey) =>
      locale ? translations[locale as Locale][key] : undefined,
    [locale],
  )

  return { t, locale, setLocale }
}
