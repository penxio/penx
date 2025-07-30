'use client'

import React, { memo, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import OpenAI from 'openai'
import { Prompt, ROOT_HOST } from '@penx/constants'
import { Creation } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { localDB } from '@penx/local-db'
import { getSession } from '@penx/session'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { docToString } from '@penx/utils/editorHelper'
import { tiptapToMarkdown } from '@penx/utils/tiptapToMarkdown'
import { Markdown } from '../../../AIChat/markdown'
import { Tags } from './CreationItem/Tags'
import { CustomMasonry } from './CustomMasonry'

const client = new OpenAI({
  apiKey: 'sk-xxx',
  // baseURL: 'http://localhost:4000/api/ai',
  baseURL: `${ROOT_HOST}/api/ai`,
  dangerouslyAllowBrowser: true,
})

interface Props {
  height: number
  width: number
}

export const PanelNotes = (props: Props) => {
  const { creations } = useCreations()
  const notes = creations.filter((c) => c.isNote)
  return (
    <CustomMasonry
      className="p-4"
      items={notes}
      render={NoteCard}
      overscanBy={10}
      width={Number(props.width)}
      height={Number(props.height)}
    />
  )
}

interface ItemProps {
  index: number
  data: Creation
  width: number
}
const NoteCard = memo(({ index, data: creation, width }: ItemProps) => {
  const inited = useRef(false)
  useEffect(() => {
    async function run() {
      const session = await getSession()
      if (!session.accessToken) return
      const stream = await client.chat.completions.create(
        {
          model: 'openai',
          messages: [
            {
              role: 'system',
              content: Prompt.TITLE_GENERATOR,
            },
            {
              role: 'user',
              content: tiptapToMarkdown(creation.content),
            },
          ],
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      )

      let fullText = ''
      for await (const chunk of stream) {
        try {
          const content = chunk.choices[0].delta?.content

          if (content) {
            fullText += content
          }
        } catch (error) {
          // console.log('=======error:', error)
        }
      }
      // console.log('======fullText:', fullText)

      store.creations.updateCreationById(creation.id, {
        props: {
          ...creation.props,
          title: fullText,
        },
      })
      await localDB.updateCreationProps(creation.id, {
        title: fullText,
      })
    }

    if (creation.title) return
    if (inited.current) return
    inited.current = true

    setTimeout(() => {
      run()
    }, 5000)
  }, [creation])

  return (
    <div
      className="shadow-card bg-background cursor-pointer rounded-xl p-3 text-base"
      onClick={() => {
        store.panels.updateMainPanel({
          type: PanelType.CREATION,
          creationId: creation.id,
        })
      }}
    >
      {/* <ContentRender className="px-0 text-sm" content={creation.content} /> */}
      {creation.title && (
        <div className="text-lg font-bold">{creation.title}</div>
      )}
      <Markdown>{tiptapToMarkdown(creation.content)}</Markdown>

      <div className="mt-2 flex items-center gap-2">
        <div className="text-foreground/50 text-[10px]">
          {format(creation.createdAt, 'HH:mm')}
        </div>
        <Tags creation={creation} />
      </div>
    </div>
  )
})
