import en from '@/locales/en.json'
import es from '@/locales/es.json'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'
import { Translations, Locale, TranslationKey } from '@/types'

const translations: Translations = { en, es }

export default function useTranslation() {
  const router = useRouter()
  const { locale, asPath } = router
  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return
      setCookie('NEXT_LOCALE', l || 'es')
      router.push(asPath, asPath, { locale: l, shallow: true })
    },
    [asPath, locale, router],
  )

  const t = useCallback(
    (key: TranslationKey) =>
      locale ? translations[locale as Locale][key] : '',
    [locale],
  )

  return { t, locale, setLocale }
}
