import NextHead from 'next/head'

interface HelmetProps {
  title?: string
}

export default function Helmet({ title }: HelmetProps) {
  return (
    <NextHead>
      <title>{title || 'Appoint-man'}</title>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width,  maximum-scale=1.0"
      />
      <meta
        name="description"
        content="Appoint-man is an appointment service"
      />
    </NextHead>
  )
}
