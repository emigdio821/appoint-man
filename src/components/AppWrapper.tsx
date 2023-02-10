import Navbar from './Navbar'
import { Container, Flex, useMantineTheme } from '@mantine/core'

interface WrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: WrapperProps) {
  const theme = useMantineTheme()

  return (
    <Flex justify="space-between">
      <Navbar />
      <Container p="md" pt={theme.spacing.xs + 57} w="100%">
        {children}
      </Container>
    </Flex>
  )
}
