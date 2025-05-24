import { useState } from 'react'
import { Editor, useCurrentEditor } from '@tiptap/react'
import { atom, useAtom } from 'jotai'
import {
  CaseSensitiveIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  PilcrowIcon,
  QuoteIcon,
  SquareIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@penx/utils'

const turnIntoItems = [
  {
    icon: <PilcrowIcon />,
    keywords: ['paragraph'],
    label: 'Text',
    command: (editor: Editor) => {
      editor.chain().focus().setParagraph().run()
    },
  },
  {
    icon: <Heading1Icon />,
    keywords: ['title', 'h1'],
    label: 'Heading 1',
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run()
    },
  },
  {
    icon: <Heading2Icon />,
    keywords: ['subtitle', 'h2'],
    label: 'Heading 2',
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
  },
  {
    icon: <Heading3Icon />,
    keywords: ['subtitle', 'h3'],
    label: 'Heading 3',
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run()
    },
  },
  {
    icon: <ListIcon />,
    keywords: ['unordered', 'ul', '-'],
    label: 'Bulleted list',
    command: (editor: Editor) => {
      editor.chain().focus().toggleBulletList().run()
    },
  },
  {
    icon: <ListOrderedIcon />,
    keywords: ['ordered', 'ol', '1'],
    label: 'Numbered list',
    command: (editor: Editor) => {
      editor.chain().focus().toggleOrderedList().run()
    },
  },
  // {
  //   icon: <SquareIcon />,
  //   keywords: ['checklist', 'task', 'checkbox', '[]'],
  //   label: 'To-do list',
  //   command: (editor: Editor) => {
  //     editor.chain().focus().toggleTaskList().run()
  //   },
  // },
  // {
  //   icon: <FileCodeIcon />,
  //   keywords: ['```'],
  //   label: 'Code',
  //   value: CodeBlockPlugin.key,
  // },
  {
    icon: <QuoteIcon size={20} />,
    keywords: ['citation', 'blockquote', '>'],
    label: 'Quote',
    command: (editor: Editor) => {
      editor.chain().focus().setBlockquote().run()
    },
  },
]

interface Props {
  editor: Editor
}
export function JournalInputToolbar({ editor }: Props) {
  return (
    <div className="flex h-full w-full flex-1">
      <div
        className={cn('text-foreground flex flex-1 items-center gap-2 px-2')}
      >
        <TypographySelect editor={editor} />

        {turnIntoItems.slice(4).map(({ icon, command, label }) => (
          <div
            key={label}
            className="flex size-8 shrink-0 items-center justify-center py-2"
            onClick={() => {
              command(editor)
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  )
}

export const TypographySelect = ({ editor }: Props) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className={cn('relative')}>
      <div
        className="flex h-[32px] w-[32px] items-center justify-center"
        onClick={() => {
          setVisible(!visible)
          editor.chain().focus().run()
        }}
      >
        {/* <CaseSensitiveIcon /> */}
        <span className="icon-[codicon--case-sensitive] size-7"></span>
      </div>
      <AnimatePresence>
        {/* {visible && (
        )} */}
        <motion.div
          initial="closed"
          exit="closed"
          variants={{
            open: {
              // -top-[48px]
              y: -48,
              display: 'flex',
              opacity: 1,
              scale: 1,
              transition: {
                // ease: 'easeOut',
                // duration: 0.25,
              },
            },
            closed: {
              // top: 0,
              opacity: 0,
              display: 'none',
              y: -32,
              scale: 0.8,
              transition: {
                // type: 'keyframes',
              },
            },
          }}
          animate={visible ? 'open' : 'closed'}
          className="shadow-popover bg-background  absolute left-0 top-0 z-[200000] flex h-[40px] max-w-[90wv] origin-bottom-left items-center gap-2 rounded-md px-3 font-medium"
          onClick={(e) => {
            e.stopPropagation()
            // editor.chain().focus().run()
          }}
        >
          {turnIntoItems.slice(0, 4).map(({ label, command, icon }) => (
            <div
              key={label}
              className="flex size-8 shrink-0 items-center justify-center py-2"
              onClick={() => {
                command(editor)
                setVisible(false)
              }}
            >
              {icon}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
