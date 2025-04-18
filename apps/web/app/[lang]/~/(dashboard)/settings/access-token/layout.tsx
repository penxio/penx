import { ReactNode } from 'react'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col justify-between">
        <div className="text-3xl font-bold">Access Token</div>
        <p className="text-muted-foreground my-1 text-sm">
          These tokens have access to your account via the PenX API.
        </p>
      </div>
      {children}
    </div>
  )
}
