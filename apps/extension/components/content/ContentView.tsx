import { useEffect, useState } from 'react'
import { ACTIONS, AppType, BACKGROUND_EVENTS } from '@/lib/constants'
import type { MsgRes } from '@/lib/helper'
import { prepareContent } from '@/lib/prepare-content'
import { tinykeys } from 'tinykeys'
import TurndownService from 'turndown'
import { useAreas } from '@penx/hooks/useAreas'
// import { prepareContent } from '~/common/prepare-content'

import { useAppType } from './hooks/useAppType'
import { useNote } from './hooks/useNote'
import { QuickAddEditor } from './QuickAddEditor/QuickAddEditor'
import { updateText, useText } from './stores/text.store'
import {
  getThumbnailState,
  hideThumbnail,
  showThumbnail,
  useThumbnail,
} from './stores/thumbnail.store'
import { Thumbnail } from './Thumbnail'

export const ContentView = () => {
  const { x, y, clientX, clientY, visible } = useThumbnail()
  const { text } = useText()
  const { appType, setAppType } = useAppType()
  const { setNote } = useNote()

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      // 'Shift+D': () => {
      //   console.log('open penx....')
      //   setType(ContentAppType.draggableEditor)
      // },
    })
    return () => {
      unsubscribe()
    }
  }, [setAppType])

  // return (
  //   <div className="fixed left-0 top-0 z-50 h-40 w-40 bg-green-200">Test</div>
  // )

  return (
    <>
      {/* <QuickAddEditor x={clientX} y={clientY} /> */}

      {/* {visible && text && !type && <Thumbnail x={x} y={y} />} */}
      {/* {appType === AppType.NOTE && <QuickAddEditor />} */}
    </>
  )
}
