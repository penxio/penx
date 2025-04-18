import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ImportDialog } from './import/ImportDialog'

interface Props {
  className?: string
}

export const ImportPostsButton = ({ className, ...rest }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <div {...rest} className={cn('flex items-center', className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="brand">Import posts</Button>
        </DialogTrigger>
        <ImportDialog open={open} onOpenChange={setOpen} />
      </Dialog>
    </div>
  )
}
