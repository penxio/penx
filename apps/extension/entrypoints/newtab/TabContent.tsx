import { Trans } from '@lingui/react'
import { useSession } from '@penx/session'

export function TabContent() {
  const { session } = useSession()
  console.log('=======session:', session)

  return (
    <div>
      <div></div>
      <Trans id="hello" message="Hello worldXXX." />
      HElloxxx
    </div>
  )
}
