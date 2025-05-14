import { ReloadAppBtn } from './ReloadAppBtn'

export const Fallback = () => {
  return (
    <div className='h-[80vh] flex flex-col items-center justify-center gap-1' >
      <div className='text-lg text-foreground/60'>
        ⚠️Something went wrong
      </div>
      <ReloadAppBtn />
    </div>
  )
}
