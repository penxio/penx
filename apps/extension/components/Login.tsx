import { BASE_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
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
import { IconGoogle } from './icons/IconGoogle'
import { Logo } from './Logo'

export function Login({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'flex w-full flex-1 flex-col items-center justify-center gap-6 px-4',
        className,
      )}
      {...props}
    >
      <Logo className="h-14 w-14" />
      <h1
        className="border text-xl  font-bold shadow-2xl p-3 rounded-2xl"
        style={
          {
            // boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19)',
          }
        }
      >
        Welcome to PenX
      </h1>
      <>
        <Button
          size="lg"
          className={cn('w-full gap-2 rounded-full')}
          onClick={() => {
            // window.open('https://penx.io')
            window.open(BASE_URL)
          }}
        >
          <IconGoogle className="h-4 w-4" />
          <div className="">{'Google login'}</div>
        </Button>
      </>
    </div>
  )
}
