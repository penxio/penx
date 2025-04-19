'use client'

import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { cn } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { slug } from 'github-slugger'
import { Node } from 'slate'

interface Props {
  className?: string
  content: any[]
  style?: CSSProperties
}

export const Toc = ({ content, className, style = {} }: Props) => {
  const headings = useMemo(() => {
    if (!Array.isArray(content)) return []
    return content.filter((node: any) =>
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.type),
    )
  }, [content])

  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const headingElements = headings.map((node) => {
      const text = Node.string(node)
      const id = slug(text)
      return document.getElementById(id)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px', threshold: 0 },
    )

    headingElements.forEach((element) => {
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headingElements.forEach((element) => {
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  const types = Array.from(
    new Set(headings.map((node: any) => Number(node.type.replace('h', '')))),
  )
  const min = Math.min(...types)

  if (!headings.length) return null

  return (
    <div
      className={cn(
        'sidebar shrink-0 opacity-60 transition-all hover:opacity-100',
        className,
      )}
      style={{
        ...style,
      }}
    >
      <div className="">
        <h2 className="text-foreground/90 mb-4 text-sm font-semibold">
          <Trans>Table of contents</Trans>
        </h2>

        <div className="flex flex-col gap-2">
          {headings.map((node: any) => {
            const text = Node.string(node)
            const id = slug(text)
            const depth = Number(node.type.replace('h', '')) - min
            const isActive = activeId === id

            return (
              <div
                key={node.id}
                className={cn(
                  'text-foreground/40 hover:text-foreground text-sm transition-all',
                  isActive && 'text-foreground',
                )}
              >
                <a
                  className={cn('cursor-pointer')}
                  style={{
                    paddingLeft: depth * 12,
                  }}
                  href={`#${id}`}
                  onClick={() => setActiveId(id)}
                >
                  {text}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
