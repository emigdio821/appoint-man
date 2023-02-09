import {
  Stack,
  Title,
  Paper,
  Button,
  Container,
  createStyles,
} from '@mantine/core'
import NextLink from 'next/link'
import { BiLeftArrowAlt } from 'react-icons/bi'
import useTranslation from '@/hooks/useTranslation'

const useStyles = createStyles((theme) => ({
  label: {
    fontSize: 120,
    fontWeight: 900,
    textAlign: 'center',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[2],
  },

  title: {
    fontSize: 32,
    fontWeight: 900,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
}))

export default function NotFound() {
  const { t } = useTranslation()
  const { classes } = useStyles()

  return (
    <Container p="xl" maw={720}>
      <Paper withBorder p="md">
        <Stack align="center">
          <Title className={classes.label}>404</Title>
          <Title className={classes.title}>{t('pageNotFound')}</Title>
          <NextLink href="/">
            <Button size="md" leftIcon={<BiLeftArrowAlt size={14} />}>
              {t('backToHome')}
            </Button>
          </NextLink>
        </Stack>
      </Paper>
    </Container>
  )
}
