import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { AppType } from '@penx/constants'
import { cn } from '@/lib/utils'
import * as styles from '../content.module.scss'
import { useForceUpdate } from '../hooks'
import { transformDOM } from './common/transform-dom'

type Rect = Pick<DOMRect, 'width' | 'height' | 'left' | 'top'>

export interface ISelectorRef {
  onSave: () => Promise<void>
}

interface ISelectorProps {
  destroySelectArea: (isOpenEditor?: boolean) => void
}

const AreaSelector = forwardRef<ISelectorRef, ISelectorProps>(
  function ScreenShotComponent(props, propsRef) {
    const { forceUpdate } = useForceUpdate()
    const targetRectListRef = useRef<Rect[]>([])
    const targetRectRef = useRef<Rect | null>()
    const targetRef = useRef<Element | null>()
    const targetListRef = useRef<Array<Element>>([])
    const [saving, setSaving] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const onScreenshot = useCallback(async () => {
      // Implementation
    }, [])

    useImperativeHandle(
      propsRef,
      () => ({
        onSave: onScreenshot,
      }),
      [onScreenshot],
    )

    const onSave = useCallback(async () => {
      setSaving(true)
      const selections = targetListRef.current.filter((item) => item) || []
      const selectAreaElements = await transformDOM(selections)
      const combinedString = (
        Array.from(selectAreaElements) as string[]
      ).reduce((prev, current) => prev + current, '')

      props.destroySelectArea(true)
    }, [])

    useImperativeHandle(
      propsRef,
      () => ({
        onSave: async () => {
          onSave()
        },
        type: AppType.CLIP_PAGE,
      }),
      [onSave],
    )

    useEffect(() => {
      function handleMouseOver(e: MouseEvent) {
        const target = document.elementFromPoint(e.clientX, e.clientY)
        // Skip the mask layer itself
        if (target === ref.current || !target) {
          return
        }

        // If the selected element is already selected, it is no longer selected.
        if (targetListRef.current.find((item) => item === target)) {
          return
        }

        // If the selected target is in the background, it will not be selected.
        if (target?.closest('.select-inner')) {
          return
        }

        if (typeof target?.getBoundingClientRect !== 'function') {
          return
        }

        const scrollbarHeight = document.documentElement.scrollTop
        const scrollbarWidth = document.documentElement.scrollLeft

        const { width, height, left, top } = target.getBoundingClientRect()
        targetRef.current = target
        targetRectRef.current = {
          width,
          height,
          left: left + scrollbarWidth,
          top: top + scrollbarHeight,
        }
        forceUpdate()
      }

      const onToggleSelect = (e: MouseEvent) => {
        e.stopImmediatePropagation()
        e.preventDefault()
        const target = e.target as Element
        if (target.closest('.select-confirm')) {
          onSave()
        } else if (target?.closest('.select-inner')) {
          const key = parseInt(
            target.getAttribute('data-select-index') as string,
          )
          targetRectListRef.current = targetRectListRef.current.filter(
            (__, index) => key !== index,
          )
          targetListRef.current = targetListRef.current.filter(
            (__, index) => key !== index,
          )
        } else {
          if (!targetRectRef.current || !targetRef.current) {
            return
          }
          targetRectListRef.current = [
            ...targetRectListRef.current.filter((__, index) => {
              return !targetRef.current?.contains(targetListRef.current[index])
            }),
            targetRectRef.current,
          ]
          targetListRef.current = [
            ...targetListRef.current.filter((__, index) => {
              return !targetRef.current?.contains(targetListRef.current[index])
            }),
            targetRef.current,
          ]
          targetRef.current = null
          targetRectRef.current = null
        }
        forceUpdate()
        setTimeout(() => {
          window.focus()
        }, 200)
      }

      window.addEventListener('mouseover', handleMouseOver)
      window.addEventListener('click', onToggleSelect, true)
      return () => {
        window.removeEventListener('mouseover', handleMouseOver)
        window.removeEventListener('click', onToggleSelect, true)
      }
    }, [onSave])

    if (saving) {
      return null
    }

    return (
      <>
        <div className={cn(styles.mask, 'select-inner')}>
          Click an area to select it, click it again to deselect it. ESC exits,
          Enter completes
          {!!targetRectListRef.current.length && (
            <div
              className={cn(styles.confirm, 'select-confirm')}
              onClick={onSave}
            >
              Confirm selection
            </div>
          )}
        </div>

        {targetRectListRef.current.map((item, index) => {
          return (
            item?.width && (
              <div
                className={cn(
                  styles.selectInner,
                  styles.selected,
                  'select-inner',
                )}
                style={{
                  ...item,
                  pointerEvents: 'all',
                }}
                key={index}
                data-select-index={index}
              />
            )
          )
        })}

        {targetRectRef.current?.width && (
          <div
            ref={ref}
            className={styles.selectInner}
            style={{
              ...targetRectRef.current,
            }}
          />
        )}
      </>
    )
  },
)

AreaSelector.displayName = 'AreaSelector'

export default AreaSelector
