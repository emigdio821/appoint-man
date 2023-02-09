import UserMenu from './UserMenu'
import LangSwitcher from './LangSwitcher'
import { Group, Title, Container, createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  header: {
    width: '100%',
    position: 'fixed',
    padding: `${theme.spacing.xs}px 0`,
    backdropFilter: 'blur(20px)',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? 'rgba(24, 25, 28, 0.8)'
        : 'rgba(250, 250, 250, 0.8)',
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1]
    }`,
  },
}))

export default function Navbar() {
  const { classes } = useStyles()

  return (
    <div className={classes.header}>
      <Container>
        <Group position="apart">
          <Title size="h4">AppointMan</Title>
          <Group spacing={6}>
            <LangSwitcher />
            <UserMenu />
          </Group>
        </Group>
      </Container>
    </div>
  )
}
