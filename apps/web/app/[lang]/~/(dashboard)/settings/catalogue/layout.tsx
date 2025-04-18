import { ReactNode } from 'react'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold">Catalogue</h2>
      <div className="text-foreground/60 mb-6">
        This is useful if you3 create a site with a sidebar.
      </div>
      {children}
    </div>
  )
}
