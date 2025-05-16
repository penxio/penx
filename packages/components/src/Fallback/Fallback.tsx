import { ReloadAppBtn } from './ReloadAppBtn'

export const Fallback = () => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-1">
      <div className="text-foreground/60 text-lg">⚠️Something went wrong</div>
      <ReloadAppBtn />
    </div>
  )
}
