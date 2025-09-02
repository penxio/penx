import { DetailApp } from '../../../../components/ExtensionApp/DetailApp'
import { useCurrentCommand } from '../../../../hooks/useCurrentCommand'
import { SyncContent } from './SyncContent'

export function PageSync() {
  const { currentCommand } = useCurrentCommand()

  return (
    <DetailApp className="" hideFooter headerBordered={false}>
      <SyncContent />
    </DetailApp>
  )
}
