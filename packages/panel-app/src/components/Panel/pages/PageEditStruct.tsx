import { Trans } from '@lingui/react/macro'
import { DatabaseProvider } from '@penx/components/DatabaseProvider'
import { usePublishStructDialog } from '@penx/components/PublishStructDialog/usePublishStructDialog'
import { EditStructForm } from '@penx/components/StructDialog/EditStructForm'
import { useStructs } from '@penx/hooks/useStructs'
import { useStructTemplates } from '@penx/hooks/useStructTemplates'
import { isBuiltinStruct } from '@penx/libs/isBuiltinStruct'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { DetailApp } from '../../../components/ExtensionApp/DetailApp'
import { useCurrentStruct } from '../../../hooks/useCurrentStruct'
import { navigation } from '../../../hooks/useNavigation'
import { openCommand } from '../../../lib/openCommand'
import { StructInfo } from '../CommandApp/DatabaseApp/StructInfo'

export function PageEditStruct() {
  const {
    struct: { id },
  } = useCurrentStruct()
  const { structs } = useStructs()

  const struct = structs.find((s) => s.id === id)!
  const { setState } = usePublishStructDialog()
  const { session } = useSession()
  useStructTemplates()

  function publish() {
    if (!session) {
      openCommand({
        id: 'account',
      })
      return
    }
    setState({
      isOpen: true,
      struct,
    })
  }

  return (
    <DetailApp
      footerPostfix={
        isBuiltinStruct(struct.type) ? null : (
          <Button size="sm" className="text-sm" onClick={publish}>
            <Trans>Publish Struct</Trans>
          </Button>
        )
      }
    >
      <DatabaseProvider struct={struct}>
        <div className="divide-foreground/10 flex  h-full justify-between divide-x">
          <div className="flex-1 overflow-auto p-3">
            <EditStructForm struct={struct} isPanel />
          </div>
          <div className="flex-1 overflow-auto p-1">
            <StructInfo struct={struct} />
          </div>
        </div>
      </DatabaseProvider>
    </DetailApp>
  )
}
