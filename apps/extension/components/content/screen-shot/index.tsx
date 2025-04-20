import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { AppType } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import * as styles from '../content.module.scss'
import { useForceUpdate } from '../hooks'
import { blobToBase64, screenShot } from './common/screen-shot'
import DragLine from './drag-line'

type DragDirection = 'top' | 'bottom' | 'left' | 'right'

export interface IScreenShotRef {
  onSave: () => Promise<void>
}

interface IScreenShotProps {
  destroySelectArea: () => void
}

const ScreenShot = forwardRef<IScreenShotRef, IScreenShotProps>(
  function ScreenShotComponent(props, propsRef) {
    const isScreenshot = useRef(false)
    const loadingRef = useRef(false)
    const ref = useRef<HTMLDivElement>(null)
    const [screenShowAreaIsInit, setScreenShowAreaIsInit] = useState(false)
    const startRef = useRef({ left: 0, top: 0 })
    const endRef = useRef({ left: 0, top: 0 })
    const { forceUpdate } = useForceUpdate()
    const [isDragging, setIsDragging] = useState(false)
    const selectAreaWidth = Math.abs(
      endRef.current.left - startRef.current.left,
    )
    const selectAreaHeight = Math.abs(endRef.current.top - startRef.current.top)
    const selectAreaLeft = Math.min(startRef.current.left, endRef.current.left)
    const selectAreaTop = Math.min(startRef.current.top, endRef.current.top)
    const selectAreaRight = selectAreaLeft + selectAreaWidth
    const selectAreaBottom = selectAreaTop + selectAreaHeight
    const operatePosition = {
      left: Math.max(selectAreaRight - 72, 0),
      top:
        selectAreaBottom + 40 > window.innerHeight
          ? selectAreaTop + 8
          : selectAreaBottom + 8,
    }

    useEffect(() => {
      if (screenShowAreaIsInit) {
        return
      }
      const onMouseDown = (e: MouseEvent) => {
        if (e.button === 2) {
          return
        }
        isScreenshot.current = true
        startRef.current = {
          left: e.clientX,
          top: e.clientY,
        }
      }
      const onMouseUp = () => {
        if (isScreenshot.current && endRef.current.left && endRef.current.top) {
          setScreenShowAreaIsInit(true)
        }
        isScreenshot.current = false
      }

      const onMouseMove = (e: MouseEvent) => {
        if (!isScreenshot.current) {
          return
        }
        endRef.current = {
          left: e.clientX,
          top: e.clientY,
        }
        forceUpdate()
      }
      ref.current?.addEventListener('mousedown', onMouseDown)
      ref.current?.addEventListener('mouseup', onMouseUp)
      ref.current?.addEventListener('mousemove', onMouseMove)
      ref.current?.addEventListener('mouseleave', onMouseUp)

      return () => {
        ref.current?.removeEventListener('mousedown', onMouseDown)
        ref.current?.removeEventListener('mousemove', onMouseMove)
        ref.current?.removeEventListener('mouseup', onMouseUp)
        ref.current?.addEventListener('mouseleave', onMouseUp)
      }
    }, [screenShowAreaIsInit])

    const onDrag = useCallback(
      (
        e: React.DragEvent<HTMLDivElement>,
        direction: DragDirection,
        resetPosition?: boolean,
      ) => {
        setIsDragging(true)
        switch (direction) {
          case 'left': {
            startRef.current.left = e.clientX
            break
          }
          case 'right': {
            endRef.current.left = e.clientX || window.innerWidth
            break
          }
          case 'top': {
            startRef.current.top = e.clientY
            break
          }
          case 'bottom': {
            endRef.current.top = e.clientY || window.innerHeight
            break
          }
          default:
            break
        }
        if (resetPosition) {
          // After the calculation is completed, perform a data correction on endRef and startRef.
          const endPosition = {
            left: Math.max(endRef.current.left, startRef.current.left),
            top: Math.max(endRef.current.top, startRef.current.top),
          }
          const startPosition = {
            left: Math.min(endRef.current.left, startRef.current.left),
            top: Math.min(endRef.current.top, startRef.current.top),
          }
          endRef.current = endPosition
          startRef.current = startPosition
        }
        forceUpdate()
      },
      [],
    )

    const handleDragEnd = () => {
      setIsDragging(false)
    }

    const onScreenshot = useCallback(async () => {
      if (loadingRef.current) {
        return
      }
      loadingRef.current = true
      forceUpdate()

      // Delay 100ms to hide the prompt to avoid taking screenshots.
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 100)
      })

      try {
        const canvas = await screenShot({
          x: startRef.current.left,
          y: startRef.current.top,
          width: Math.abs(endRef.current.left - startRef.current.left),
          height: Math.abs(endRef.current.top - startRef.current.top),
        })

        canvas.toBlob((res) => {
          /*
          sendMessageToSandBox(SandBoxMessageType.startOcr, {
            blob: res,
          });
          */
          blobToBase64(res!)
            .then((base64String) => {
              console.log('sendMessageToSandBox-toBlob-2:', {
                canvas,
                base64String,
              })
            })
            .catch((error) => {
              console.error(error)
            })

          loadingRef.current = false
          forceUpdate()
          props.destroySelectArea()
        })
      } catch (error) {
        loadingRef.current = false
        forceUpdate()
        /*
        sendMessageToSandBox(SandBoxMessageType.startOcr, {
          blob: '',
        });
        */

        props.destroySelectArea()
      }
    }, [])

    useImperativeHandle(
      propsRef,
      () => ({
        onSave: onScreenshot,
        type: AppType.SCREEN_SHOT,
      }),
      [onScreenshot],
    )

    if (loadingRef.current) {
      return
    }

    return (
      <div
        className={cn(styles.screenShotWrapper, {
          [styles.enableSelect]: !screenShowAreaIsInit,
        })}
        ref={ref}
      >
        <div
          className={styles.screenBackgroundLeft}
          style={{
            left: '0',
            top: '0',
            bottom: '0',
            width: `${selectAreaLeft}px`,
          }}
        />
        <div
          className={styles.screenBackgroundTop}
          style={{
            left: `${selectAreaLeft}px`,
            top: '0',
            height: `${selectAreaTop}px`,
            width: `${selectAreaRight - selectAreaLeft}px`,
          }}
        />
        <div
          className={styles.screenBackgroundRight}
          style={{
            left: `${selectAreaRight}px`,
            right: '0',
            top: '0',
            bottom: '0',
          }}
        />
        <div
          className={styles.screenBackgroundBottom}
          style={{
            left: `${selectAreaLeft}px`,
            width: `${selectAreaRight - selectAreaLeft}px`,
            top: `${selectAreaBottom}px`,
            bottom: '0',
          }}
        />
        <div
          className={styles.area}
          id="yq-area"
          style={{
            left: `${selectAreaLeft}px`,
            top: `${selectAreaTop}px`,
            width: `${selectAreaWidth}px`,
            height: `${selectAreaHeight}px`,
          }}
        >
          <DragLine
            width={selectAreaWidth}
            height={2}
            updatePosition={(e, resetPosition) =>
              onDrag(e, 'top', resetPosition)
            }
            direction="top"
            handleDragEnd={handleDragEnd}
          />
          <DragLine
            width={selectAreaWidth}
            height={2}
            updatePosition={(e, resetPosition) =>
              onDrag(e, 'bottom', resetPosition)
            }
            direction="bottom"
            handleDragEnd={handleDragEnd}
          />

          <DragLine
            width={2}
            height={selectAreaHeight}
            updatePosition={(e, resetPosition) =>
              onDrag(e, 'left', resetPosition)
            }
            direction="left"
            key="left"
            handleDragEnd={handleDragEnd}
          />
          <DragLine
            width={2}
            height={selectAreaHeight}
            updatePosition={(e, resetPosition) =>
              onDrag(e, 'right', resetPosition)
            }
            direction="right"
            key="right"
            handleDragEnd={handleDragEnd}
          />
        </div>
        {!isDragging && screenShowAreaIsInit && (
          <div
            className={styles.operateBar}
            style={{
              left: `${operatePosition.left}px`,
              top: `${operatePosition.top}px`,
            }}
          >
            <div
              className={styles.operateItem}
              onClick={props.destroySelectArea}
            >
              <X />
            </div>
            <div className={styles.operateItem} onClick={onScreenshot}>
              <Check />
            </div>
          </div>
        )}
      </div>
    )
  },
)

ScreenShot.displayName = 'ScreenShot'

export default ScreenShot
