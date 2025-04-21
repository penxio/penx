'use client'

type Props = any

export function Link({ isSite = false, href, ...props }: Props) {
  return <a {...props} href={href}></a>
}

export function useRouter() {
  return {
    push(href: string) {
      //
    },
  }
}

export function usePathname() {
  return ''
}
