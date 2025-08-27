import { useState } from 'react'
import { AIModelSelect, ModelProvider } from '@penx/components/AIModelSelect'
import { useSession } from '@penx/session'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { PopButton } from '~/components/ExtensionApp/widgets/PopButton'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { Chat } from './Chat'

export function PageAIChat() {
  return (
    <DetailApp
      className=""
      bodyClassName="overflow-hidden" // Override DetailApp's overflow-auto
      hideHeader
      hideFooter
      headerBordered={false}
    >
      <div className="flex h-full w-full flex-col">
        <div className="drag z-[10] flex w-full shrink-0 cursor-move items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <PopButton />
            {/* <AIModelSelect value={provider} onChange={(v) => setProvider(v)} /> */}
          </div>
          {/* <RagSettingDialog /> */}
        </div>
        <Chat />
      </div>
    </DetailApp>
  )
}
