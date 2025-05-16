'use client'

import * as React from 'react'
import { buttonVariants } from './button'
import { Separator } from './separator'
import {
  flip,
  offset,
  type UseVirtualFloatingOptions,
} from '@udecode/plate-floating'
import { getLinkAttributes, type TLinkElement } from '@udecode/plate-link'
import {
  FloatingLinkUrlInput,
  LinkPlugin,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
  type LinkFloatingToolbarState,
} from '@udecode/plate-link/react'
import {
  useEditorRef,
  useEditorSelection,
  useFormInputProps,
  usePluginOption,
} from '@udecode/plate/react'
import { cva } from 'class-variance-authority'
import { ExternalLink, Link, Text, Unlink } from 'lucide-react'

const popoverVariants = cva(
  'bg-popover text-popover-foreground outline-hidden z-50 w-auto rounded-md border p-1 shadow-md',
)

const inputVariants = cva(
  'placeholder:text-muted-foreground flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base focus-visible:outline-none focus-visible:ring-transparent md:text-sm',
)

export function LinkFloatingToolbar({
  state,
}: {
  state?: LinkFloatingToolbarState
}) {
  const activeCommentId = usePluginOption({ key: 'comment' }, 'activeId')
  const activeSuggestionId = usePluginOption({ key: 'suggestion' }, 'activeId')

  const floatingOptions: UseVirtualFloatingOptions = React.useMemo(() => {
    return {
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
          padding: 12,
        }),
      ],
      placement:
        activeSuggestionId || activeCommentId ? 'top-start' : 'bottom-start',
    }
  }, [activeCommentId, activeSuggestionId])

  const insertState = useFloatingLinkInsertState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  })
  const {
    hidden,
    props: insertProps,
    ref: insertRef,
    textInputProps,
  } = useFloatingLinkInsert(insertState)

  const editState = useFloatingLinkEditState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  })
  const {
    editButtonProps,
    props: editProps,
    ref: editRef,
    unlinkButtonProps,
  } = useFloatingLinkEdit(editState)
  const inputProps = useFormInputProps({
    preventDefaultOnEnterKeydown: true,
  })

  if (hidden) return null

  const input = (
    <div className="flex w-[330px] flex-col" {...inputProps}>
      <div className="flex items-center">
        <div className="text-muted-foreground flex items-center pl-2 pr-1">
          <Link className="size-4" />
        </div>

        <FloatingLinkUrlInput
          className={inputVariants()}
          placeholder="Paste link"
          data-plate-focus
        />
      </div>
      <Separator className="my-1" />
      <div className="flex items-center">
        <div className="text-muted-foreground flex items-center pl-2 pr-1">
          <Text className="size-4" />
        </div>
        <input
          className={inputVariants()}
          placeholder="Text to display"
          data-plate-focus
          {...textInputProps}
        />
      </div>
    </div>
  )

  const editContent = editState.isEditing ? (
    input
  ) : (
    <div className="box-content flex items-center">
      <button
        className={buttonVariants({ size: 'sm', variant: 'ghost' })}
        type="button"
        {...editButtonProps}
      >
        Edit link
      </button>

      <Separator orientation="vertical" />

      <LinkOpenButton />

      <Separator orientation="vertical" />

      <button
        className={buttonVariants({
          size: 'icon',
          variant: 'ghost',
        })}
        type="button"
        {...unlinkButtonProps}
      >
        <Unlink width={18} />
      </button>
    </div>
  )

  return (
    <>
      <div ref={insertRef} className={popoverVariants()} {...insertProps}>
        {input}
      </div>

      <div ref={editRef} className={popoverVariants()} {...editProps}>
        {editContent}
      </div>
    </>
  )
}

function LinkOpenButton() {
  const editor = useEditorRef()
  const selection = useEditorSelection()

  const attributes = React.useMemo(
    () => {
      const entry = editor.api.node<TLinkElement>({
        match: { type: editor.getType(LinkPlugin) },
      })
      if (!entry) {
        return {}
      }
      const [element] = entry
      return getLinkAttributes(editor, element)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection],
  )

  return (
    <a
      {...attributes}
      className={buttonVariants({
        size: 'icon',
        variant: 'ghost',
      })}
      onMouseOver={(e) => {
        e.stopPropagation()
      }}
      aria-label="Open link in a new tab"
      target="_blank"
    >
      <ExternalLink width={18} />
    </a>
  )
}
