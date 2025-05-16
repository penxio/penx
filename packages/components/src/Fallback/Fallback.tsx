import { ReloadAppBtn } from './ReloadAppBtn'

export function fallbackRender({ error, resetErrorBoundary }: any) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <ReloadAppBtn />
    </div>
  )
}

export const Fallback = () => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-1">
      <div className="text-foreground/60 text-lg">⚠️Something went wrong</div>
      <ReloadAppBtn />
    </div>
  )
}
