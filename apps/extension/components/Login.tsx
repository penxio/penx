import { Button } from '@penx/uikit/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@penx/uikit/ui/card'
import { Input } from '@penx/uikit/ui/input'
import { Label } from '@penx/uikit/ui/label'
import { cn } from '@/lib/utils'
import { IconGoogle } from './icons/IconGoogle'
import { Logo } from './Logo'

export function Login({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-6 px-4 flex-1',
        className,
      )}
      {...props}
    >
      <Logo className="h-14 w-14" />
      <h1 className="text-xl font-bold">Welcome to PenX</h1>
      <>
        <Button
          size="lg"
          className={cn('w-full gap-2 rounded-full')}
          onClick={() => {
            // window.open('https://penx.io')
            window.open(import.meta.env.PUBLIC_BASE_URL)
          }}
        >
          <IconGoogle className="h-4 w-4" />
          <div className="">{'Google login'}</div>
        </Button>
      </>
    </div>
  )
}
