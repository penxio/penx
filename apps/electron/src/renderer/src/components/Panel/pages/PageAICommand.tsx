import { useMemo, useState } from 'react'
import { Message, UIMessage } from 'ai'
import { Chat } from '@penx/components/AIChat/chat'
import { RagSettingDialog } from '@penx/components/AIChat/rag-setting-dialog'
import { AIModelSelect, ModelProvider } from '@penx/components/AIModelSelect'
import { useSpace } from '@penx/hooks/useSpace'
import { useStructs } from '@penx/hooks/useStructs'
import { useSession } from '@penx/session'
import { uniqueId } from '@penx/unique-id'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentCreation } from '~/hooks/useCurrentCreation'
import { useQueryNavigations } from '~/hooks/useNavigation'

export function PageAICommand() {
  const { creation } = useCurrentCreation()
  const { space } = useSpace()
  const { structs } = useStructs()
  const { currentCommand } = useCurrentCommand()
  const { session } = useSession()
  const struct = structs.find((s) => s.isAICommand)!
  const promptColumn = struct.columns.find((c) => c.slug === 'prompt')!
  const modelColumn = struct.columns.find((c) => c.slug === 'model')!

  const prompt = creation.cells[promptColumn.id]
  const model = creation.cells[modelColumn.id] as string
  const [type, id, label] = model.split(':')
  const provider = space.aiProviders?.find((i) => i.type === type)!

  const { current } = useQueryNavigations()

  return (
    <DetailApp
      className=""
      bodyClassName="overflow-hidden" // Override DetailApp's overflow-auto
      // hideHeader
      title={creation.title}
      hideFooter
      headerBordered={false}
      command={currentCommand}
    >
      <div className="flex h-full w-full flex-col">
        <Chat
          id={uniqueId()}
          initialMessages={[]}
          isAICommand
          selection={current.data}
          systemPrompt={prompt}
          provider={{
            type: type,
            model: { id, label },
            apiKey: provider.apiKey,
          }}
          isReadonly={false}
          session={session}
        />
      </div>
    </DetailApp>
  )
}
