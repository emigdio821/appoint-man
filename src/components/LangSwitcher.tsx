import { LocaleItems } from '@/types'
import { useRouter } from 'next/router'
import { BiGlobe, BiCheck } from 'react-icons/bi'
import useTranslation from '@/hooks/useTranslation'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

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

  if (!locales) return null

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label="Lang switcher" className="simple-btn">
          <BiGlobe />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className="dropdown-content toast-closed shadow-md"
        >
          <DropdownMenu.Label className="dropdown-label mb-3 opacity-70">
            {t('language')}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={locale}>
            {locales.map((l) => {
              const localeItem = localeItems.find((item) => item.id === l)
              if (localeItem) {
                const localeItemId = localeItem.id
                return (
                  <DropdownMenu.RadioItem
                    key={localeItemId}
                    value={localeItemId}
                    className="dropdown-item"
                    onClick={() => setLocale(localeItemId)}
                  >
                    <DropdownMenu.ItemIndicator className="dropdown-indicator">
                      <BiCheck />
                    </DropdownMenu.ItemIndicator>
                    {t(localeItem.code)}
                  </DropdownMenu.RadioItem>
                )
              }
            })}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Arrow className="fill-white dark:fill-zinc-800" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
