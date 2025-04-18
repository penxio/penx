import { PropsWithChildren } from 'react'
import { AssetsNav } from './AssetsNav'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen pt-10 md:pt-0">
      <AssetsNav />
      {children}
    </div>
  )
}
