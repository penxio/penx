import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto flex h-screen max-w-6xl flex-col">
      {children}
    </section>
  )
}
