import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto flex min-h-screen flex-col px-4 sm:px-6 lg:max-w-2xl xl:px-0">
      {children}
    </section>
  )
}
