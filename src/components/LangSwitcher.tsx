import { useRouter } from 'next/router'
import { useDisclosure } from '@mantine/hooks'
import { BiGlobe, BiCheck } from 'react-icons/bi'
import { LocaleItems, type Locale } from '@/types'
import useTranslation from '@/hooks/useTranslation'
import { Menu, createStyles, Button } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  menuActive: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[0],
  },

  localeActive: {
    fontWeight: 600,
  },
}))

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
  const { classes, cx } = useStyles()
  const { locale, locales } = useRouter()
  const { t, setLocale } = useTranslation()
  const [opened, { toggle }] = useDisclosure(false)
  const selectedIcon = (l: Locale) => (locale === l ? <BiCheck /> : <BiGlobe />)

  if (!locales) return null

  return (
    <Menu
      position="bottom-end"
      transition="rotate-left"
      onOpen={() => toggle()}
      onClose={() => toggle()}
    >
      <Menu.Target>
        <Button
          px="xs"
          className={cx({
            [classes.menuActive]: opened,
          })}
        >
          <BiGlobe />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t('language')}</Menu.Label>
        {locales.map((l) => {
          const localeItem = localeItems.find((item) => item.id === l)
          if (localeItem) {
            const localeItemId = localeItem.id
            return (
              <Menu.Item
                key={localeItemId}
                className={cx({
                  [classes.localeActive]: locale === l,
                })}
                icon={selectedIcon(localeItemId)}
                onClick={() => setLocale(localeItemId)}
              >
                {t(localeItem.code)}
              </Menu.Item>
            )
          }
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
