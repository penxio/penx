'use client'

import { Link } from '@/lib/i18n'
import { useSearchParams } from 'next/navigation'

export function GoBackButton() {
  const searchParams = useSearchParams()
  const source = searchParams?.get('source')

  return (
    <Link
      href={decodeURIComponent(source || '/')}
      className="bg-foreground/5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // width="1em"
        // height="2em"
        viewBox="0 0 12 24"
        className="h-6"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"
        ></path>
      </svg>
    </Link>
  )
}
