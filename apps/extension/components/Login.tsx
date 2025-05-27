import { BASE_URL } from '@/lib/constants'
import { Trans } from '@lingui/react/macro'
import { Button } from '@penx/uikit/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@penx/uikit/card'
import { Input } from '@penx/uikit/input'
import { Label } from '@penx/uikit/label'
import { cn } from '@penx/utils'
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
        className="rounded-2xl border  p-3 text-xl font-bold shadow-2xl"
        style={
          {
            // boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19)',
          }
        }
      >
        <Trans>Welcome to PenX</Trans>
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
          <div className="">
            <Trans>Google login</Trans>
          </div>
        </Button>
      </>
    </div>
  )
}
