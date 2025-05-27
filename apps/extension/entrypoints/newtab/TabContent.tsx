import { Trans } from '@lingui/react/macro'
import { useSession } from '@penx/session'

export function TabContent() {
  const { session } = useSession()
  console.log('=======session:', session)

  return (
    <div>
      <div></div>
      Hello
    </div>
  )
}
