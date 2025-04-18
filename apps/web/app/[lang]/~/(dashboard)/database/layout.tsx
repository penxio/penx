import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="h-screen w-full pt-12 md:pt-0">{children}</div>
}
