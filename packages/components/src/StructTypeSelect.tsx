import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  value: Struct
  onChange: (value: Struct) => void
  setFocused: () => void
}
export const StructTypeSelect = ({
  className,
  value,
  onChange,
  setFocused,
}: Props) => {
  const { structs } = useStructs()
  const [visible, setVisible] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <div
        className="shadow-popover text-foreground flex h-[32px] items-center justify-center rounded-full px-2 text-sm"
        onClick={() => {
          setVisible(!visible)
          setFocused()
        }}
      >
        {value.name}
      </div>
      <AnimatePresence>
        {visible && (
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
                // translateY: -100,
                transition: {
                  // type: 'keyframes',
                },
              },
            }}
            animate={visible ? 'open' : 'closed'}
            className="shadow-popover bg-background absolute left-0  top-0 flex h-[40px] max-w-[90wv] origin-bottom-left items-center gap-2 rounded-md px-3 font-medium"
            onClick={(e) => {
              e.stopPropagation()
              setVisible(false)
              setFocused()
            }}
          >
            {structs.map((struct, index) => (
              <div
                key={struct.id}
                className={cn(
                  'hover:text-brand flex h-6 cursor-pointer items-center rounded-full text-sm',
                  value.id == struct.id && 'text-brand',
                )}
                onClick={() => {
                  onChange(struct)
                }}
              >
                {struct.name}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
