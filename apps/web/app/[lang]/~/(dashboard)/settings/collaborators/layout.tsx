import { ReactNode } from 'react'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <div className="text-xl font-bold">Add collaborator</div>
        <div className="text-muted-foreground my-1 text-sm">
          Add a collaborator by entering their wallet address or email.
        </div>
      </div>

      {children}
    </div>
  )
}
