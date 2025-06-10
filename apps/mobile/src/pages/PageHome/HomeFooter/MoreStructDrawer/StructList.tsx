import { ArrowRightIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { getBgColor } from '@penx/libs/color-helper'
import { StructType } from '@penx/types'
import { cn } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { StructIcon } from '@penx/widgets/StructIcon'
import { useMoreStructDrawer } from './useMoreStructDrawer'

interface Props {}

export function StructList({}: Props) {
  const { structs } = useStructs()
  const { setIsOpen } = useMoreStructDrawer()
  const addCreation = useAddCreation()
  return (
    <div className="flex flex-col gap-2 px-1 pb-2">
      {structs
        .filter(
          (struct) => ![StructType.VOICE].includes(struct.type as StructType),
        )
        .map((struct, index) => (
          <motion.div
            key={struct.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                // type: 'spring',
                delay: index * 0.1,
              },
            }}
            className={cn(
              'text-foreground hover:bg-foreground/5 inline-flex cursor-pointer select-none items-center justify-between gap-2 rounded-lg py-2 text-lg font-bold',
            )}
            onClick={() => {
              addCreation({
                type: struct.type,
              })
              setIsOpen(false)
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-6 items-center justify-center rounded-md text-white',
                  // generateGradient(struct.color),
                  getBgColor(struct.color),
                )}
              >
                <StructIcon type={struct.type} className="" />
              </div>
              <div>{struct.name}</div>
            </div>
            <ArrowRightIcon size={20} className="text-foreground/40" />
          </motion.div>
        ))}
    </div>
  )
}
