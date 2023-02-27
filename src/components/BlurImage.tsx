import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'

interface BlurImageProps {
  src: string
  alt: string
  errorCallback?: () => void
}

export default function BlurImage({ src, alt, errorCallback }: BlurImageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  return (
    <div className="w-full overflow-hidden rounded-[inherit] bg-transparent">
      <Image
        fill
        alt={alt}
        src={src}
        className={clsx(
          'rounded-[inherit] object-cover duration-700 ease-in-out',
          isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0',
        )}
        onLoadStart={() => alert('Start loading!')}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => errorCallback && errorCallback()}
      />
    </div>
  )
}
