import { Trans } from '@lingui/react/macro'
import { ArrowRightIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { ColorfulStructIcon } from '@penx/components/ColorfulStructIcon'
import { appEmitter } from '@penx/emitter'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { StructType } from '@penx/types'
import { cn } from '@penx/utils'
import { useMoreStructDrawer } from './useMoreStructDrawer'

interface Props {}

export function StructList({}: Props) {
  const { structs } = useStructs()
  const { setIsOpen } = useMoreStructDrawer()
  return (
    <div className="-mx-4 flex flex-1 flex-col gap-2 overflow-auto px-4 pb-4">
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
              'text-foreground hover:bg-foreground/5 inline-flex cursor-pointer select-none items-center justify-between gap-2 rounded-lg py-1',
            )}
            onClick={() => {
              appEmitter.emit('ROUTE_TO_NEW_CREATION', struct)
              // addCreation({
              //   type: struct.type,
              // })
              setIsOpen(false)
            }}
          >
            <div className="flex items-center gap-2">
              <ColorfulStructIcon struct={struct} />

              <div className="flex-1 overflow-hidden">
                <div className="text-foreground font-semibold">
                  {struct.name}
                </div>
                <div className="text-foreground/50 max-w-[60vw] truncate text-xs">
                  {struct.description || (
                    <Trans>No introduction for the struct</Trans>
                  )}
                </div>
              </div>
            </div>
            <ArrowRightIcon size={20} className="text-foreground/40" />
          </motion.div>
        ))}
    </div>
  )
}
