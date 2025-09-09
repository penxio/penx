import { PropsWithChildren, useEffect, useState } from 'react'
import { useInterval } from 'react-use'
import ky from 'ky'
import { Button } from '@penx/uikit/ui/button'

type Result = {
  status: 'ok'
  timestamp: string
  uptime: number
}

export function HealthCheck({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true)
  const [healthy, setHealthy] = useState(false)

  function checkHealthy() {
    ky('http://localhost:14158/health')
      .json<Result>()
      .then((d) => {
        if (d.status === 'ok') setHealthy(true)
      })
      .catch((error) => {
        setHealthy(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    checkHealthy()
  }, [])

  useInterval(
    () => {
      console.log('interval........')
      checkHealthy()
    },
    healthy ? null : 3000,
  )

  if (loading) return null

  if (!healthy) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-sm">
          <img
            src="https://penx.io/images/logo.svg"
            className="shadow-popover size-16 rounded-2xl"
          />

          <Button
            onClick={() => {
              window.open('penx://open')
            }}
          >
            Open PenX App
          </Button>
          <div className="text-foreground/50 mt-2 text-center">
            <div className="text-foreground/80 font-semibold">
              PenX Extension needs PenX App to be opened.
            </div>
            <div>
              If PenX is not installed,{' '}
              <a className="text-brand" target="_blank" href="https://penx.io/">
                download PenX
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
