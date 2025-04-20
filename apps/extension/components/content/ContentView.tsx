import { useEffect, useState } from 'react'
import { ACTIONS, AppType, BACKGROUND_EVENTS } from '@/lib/constants'
import type { MsgRes } from '@/lib/helper'
import { prepareContent } from '@/lib/prepare-content'
import { tinykeys } from 'tinykeys'
import TurndownService from 'turndown'
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

document.addEventListener('mouseup', async (event) => {
  const currentElement = event.target
  const targetElement = document.querySelector('.ai-translator-content')

  if (targetElement && targetElement.contains(currentElement as any)) {
    return
  }

  const selectedText = window.getSelection()?.toString() as string

  if (selectedText !== '') {
    const { pageX: x, pageY: y } = event
    // const { clientX: x, clientY: y } = event
    // console.log('====event:', event)
    const clientX = Math.min(event.clientX, window.innerWidth - event.clientX)
    const clientY = Math.min(event.clientY, window.innerHeight - event.clientY)

    setTimeout(() => {
      updateText(selectedText)
      showThumbnail(x, y, clientX, clientY)
    }, 10)
  }
})

document.addEventListener('click', (event) => {
  const currentElement = event.target
  const targetElement = document.querySelector('.penx-editor-content')

  if (targetElement && targetElement.contains(currentElement as any)) {
    return
  }
  const store = getThumbnailState()
  if (store?.visible) {
    hideThumbnail()
  }
})

export const ContentView = () => {
  const { x, y, clientX, clientY, visible } = useThumbnail()
  const { text } = useText()
  const { appType, setAppType } = useAppType()
  const { setNote } = useNote()

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (
        request: MsgRes<keyof typeof BACKGROUND_EVENTS, any>,
        sender,
        sendResponse,
      ) => {
        console.log('%c=contentjs onMessage:', 'color:red', request)
        switch (request.type) {
          case BACKGROUND_EVENTS.GetPageContent:
            prepareContent()
              .then((document) => {
                sendResponse({ document })
              })
              .catch((error) => {
                console.log('prepare error', error)
              })
            break

          case BACKGROUND_EVENTS.EndOfGetPageContent:
            const turndownService = new TurndownService()
            const markdownContent = turndownService.turndown(
              request.payload.content,
            )

            console.log(
              '%c=contentjs onMessage EndOfGetPageContent parse markdownwn results:',
              'color:yellow',
              { markdownContent },
            )
            break

          case ACTIONS.EnterManually:
            // TODO:
            break

          case ACTIONS.AreaSelect:
            setAppType(request.payload.action as AppType)
            break

          default:
            break
        }

        return true
      },
    )
  }, [])

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      // 'Shift+D': () => {
      //   console.log('open penx....')
      //   setType(ContentAppType.draggableEditor)
      // },

      'Alt+Space': () => {
        console.log('open penx....')
        setAppType(AppType.NOTE)
        setTimeout(() => {
          setNote('')
        }, 0)
      },

      Escape: () => {
        hideThumbnail()
        setAppType('')
      },
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
      {appType === AppType.NOTE && <QuickAddEditor />}
    </>
  )
}
