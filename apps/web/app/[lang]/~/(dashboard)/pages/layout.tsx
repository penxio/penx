import { ReactNode } from 'react'
import { CreatePageButton } from './CreatePageButton'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 p-3 md:p-0">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">All pages</div>
        <CreatePageButton />
      </div>

      {children}
    </div>
  )
}
