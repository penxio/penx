import { FC } from 'react'
import { RecoverFromGoogleDialog } from './RecoverFromGoogleDialog'

interface Props {}

export const Recover: FC<Props> = () => {
  return (
    <div>
      <RecoverFromGoogleDialog />
    </div>
  )
}
