import { useState } from 'react'
import { Chat } from '@penx/components/AIChat/chat'
import { RagSettingDialog } from '@penx/components/AIChat/rag-setting-dialog'
import { useSession } from '@penx/session'
import { uniqueId } from '@penx/unique-id'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { PopButton } from '~/components/ExtensionApp/widgets/PopButton'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { AIModelSelect, ModelProvider } from './AIModelSelect'

export function PageAIChat() {
  const { currentCommand } = useCurrentCommand()
  const { session } = useSession()
  const [provider, setProvider] = useState<ModelProvider>({
    type: 'PENX',
    model: 'PENX',
  } as any as ModelProvider)

  return (
    <DetailApp
      className=""
      bodyClassName="overflow-hidden" // Override DetailApp's overflow-auto
      hideHeader
      hideFooter
      headerBordered={false}
      command={currentCommand}
    >
      <div className="flex h-full w-full flex-col">
        <div className="drag z-[10] flex w-full shrink-0 cursor-move items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <PopButton />
            <AIModelSelect value={provider} onChange={(v) => setProvider(v)} />
          </div>
          <RagSettingDialog />
        </div>

        <div className="flex min-h-0 w-full flex-1 p-3">
          <Chat
            id={uniqueId()}
            initialMessages={[]}
            provider={provider}
            isReadonly={false}
            session={session}
          />
        </div>
      </div>
    </DetailApp>
  )
}
