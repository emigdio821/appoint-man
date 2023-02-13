import Link from 'next/link'
import { BiLeftArrowAlt } from 'react-icons/bi'
import useTranslation from '@/hooks/useTranslation'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto mt-4 max-w-2xl rounded-md border p-4 dark:border-zinc-800">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center text-9xl font-extrabold opacity-50">404</h1>
        <h1 className="text-center text-3xl font-bold opacity-90">
          {t('pageNotFound')}
        </h1>
        <Link href="/" className="simple-btn flex items-center gap-1 text-sm">
          <BiLeftArrowAlt />
          {t('goToHome')}
        </Link>
      </div>
    </div>
  )
}
