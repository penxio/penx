'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCatalogue } from '../hooks/useCatalogue'
import { CategoryNodeForm } from './CategoryNodeForm'
import { useCategoryNodeDialog } from './useCategoryNodeDialog'

interface Props {}

export function CategoryNodeDialog({}: Props) {
  const { isOpen, setIsOpen, node } = useCategoryNodeDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">
            {node ? 'Edit category' : 'Add category'}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <CategoryNodeForm />
      </DialogContent>
    </Dialog>
  )
}
