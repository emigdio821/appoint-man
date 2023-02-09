import Navbar from './Navbar'
import { Container, Flex, createStyles } from '@mantine/core'

interface WrapperProps {
  children: React.ReactNode
}

const useStyles = createStyles((theme) => ({}))

export default function AppWrapper({ children }: WrapperProps) {
  const { theme } = useStyles()
  return (
    <Flex justify="space-between">
      <Navbar />
      <Container p="md" pt={theme.spacing.xs + 57} w="100%">
        {children}
      </Container>
    </Flex>
  )
}
