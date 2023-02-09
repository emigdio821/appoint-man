import { Button, useMantineColorScheme } from '@mantine/core'
import { BiMoon, BiSun } from 'react-icons/bi'

export default function ThemeSwitcher() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const darkScheme = colorScheme === 'dark'

  return (
    <Button px="xs" onClick={() => toggleColorScheme()}>
      {darkScheme ? <BiSun /> : <BiMoon />}
    </Button>
  )
}
