import {
  Dropdown,
  DropdownContent,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownTrigger,
} from './primitives/Dropdown'
import { LocaleItems } from '@/types'
import { useRouter } from 'next/router'
import { BiGlobe } from 'react-icons/bi'
import useTranslation from '@/hooks/useTranslation'

const localeItems: LocaleItems[] = [
  {
    id: 'es',
    code: 'spanish',
  },
  {
    id: 'en',
    code: 'english',
  },
]

export default function LangSwitcher() {
  const { locale, locales } = useRouter()
  const { t, setLocale } = useTranslation()

  if (!locales) {
    return null
  }

  return (
    <Dropdown>
      <DropdownTrigger className="simple-btn" aria-label="Lang switcher">
        <BiGlobe />
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownLabel className="dropdown-label">
          {t('language')}
        </DropdownLabel>
        <DropdownRadioGroup value={locale}>
          {localeItems.map(({ code, id }) => (
            <DropdownRadioItem
              key={id}
              value={id}
              className="dropdown-item"
              onClick={() => setLocale(id)}
            >
              {t(code)}
            </DropdownRadioItem>
          ))}
        </DropdownRadioGroup>
      </DropdownContent>
    </Dropdown>
  )
}
