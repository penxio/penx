import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import { Editor, useCurrentEditor } from '@tiptap/react'
import { atom, useAtom } from 'jotai'
import {
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
  {
    icon: <SquareIcon />,
    keywords: ['checklist', 'task', 'checkbox', '[]'],
    label: 'To-do list',
    command: (editor: Editor) => {
      editor.chain().focus().toggleTaskList().run()
    },
  },
  // {
  //   icon: <FileCodeIcon />,
  //   keywords: ['```'],
  //   label: 'Code',
  //   value: CodeBlockPlugin.key,
  // },
  {
    icon: <QuoteIcon />,
    keywords: ['citation', 'blockquote', '>'],
    label: 'Quote',
    command: (editor: Editor) => {
      editor.chain().focus().setBlockquote().run()
    },
  },
]

const platform = Capacitor.getPlatform()

export function FixedToolbar() {
  useKeyboardChange()
  const { editor } = useCurrentEditor()
  const { height, isShow, setState } = useKeyboard()

  if (!editor) return null
  const open = isShow && editor?.isFocused

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial="closed"
          exit="closed"
          variants={{
            open: {
              bottom: platform === 'ios' ? height : 0,
              transition: {
                type: 'keyframes',
                // ease: 'easeOut',
                // duration: 0.25,
              },
            },
            closed: {
              bottom: platform === 'ios' ? -height + 200 : -300,
              transition: {
                // type: 'keyframes',
              },
            },
          }}
          animate={open ? 'open' : 'closed'}
          className={cn(
            'border-foreground/5 bg-background fixed left-0 right-0 z-[10000000] mx-auto flex h-10  flex-col items-center border-t',
          )}
        >
          <div className="flex h-full w-full flex-1">
            <div
              className={cn(
                'flex flex-1 items-center gap-2 overflow-x-auto px-2',
              )}
            >
              {turnIntoItems.map(({ icon, command, label }) => (
                <div
                  key={label}
                  className="text-foreground/60 flex size-8 shrink-0 items-center justify-center py-2"
                  onClick={() => {
                    command(editor)
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>

            <div
              className="text-foreground/80 border-foreground/10 flex h-10 w-10 items-center justify-center border-l"
              onClick={() => {
                Keyboard.hide()
              }}
            >
              <span className="icon-[mdi--keyboard-close-outline] size-6"></span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface State {
  isShow: boolean
  height: number
}

const keyboardAtom = atom<State>({
  isShow: false,
  height: 0,
} as State)

export function useKeyboard() {
  const [state, setState] = useAtom(keyboardAtom)

  return {
    ...state,
    setState,
  }
}

export function useKeyboardChange() {
  const { setState } = useKeyboard()

  useEffect(() => {
    const showHandler = Keyboard.addListener('keyboardWillShow', (info) => {
      setState({ isShow: true, height: info.keyboardHeight })
    })
    const hideHandler = Keyboard.addListener('keyboardWillHide', () => {
      setState({ isShow: false, height: 0 })
    })
    return () => {
      showHandler.then((handle) => handle?.remove())
      hideHandler.then((handle) => handle?.remove())
    }
  }, [])
}
