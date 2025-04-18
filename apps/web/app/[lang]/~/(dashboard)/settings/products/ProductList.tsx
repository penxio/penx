'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSite } from '@/hooks/useSite'
import { api, trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { Site } from '@penx/db/client'
import { format } from 'date-fns'
import { produce } from 'immer'
import { Edit3, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { ProductDialog } from './ProductDialog/ProductDialog'
import { useProductDialog } from './ProductDialog/useProductDialog'
import { useProductPriceDialog } from './ProductPriceDialog/useProductPriceDialog'

interface Props {
  site: Site
}

export function ProductList({ site }: Props) {
  const { setState } = useProductDialog()
  const productPriceDialog = useProductPriceDialog()
  const { data = [], isLoading } = trpc.product.list.useQuery()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }
  return (
    <>
      <ProductDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Pricing</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <span>{(item.price / 100).toFixed(2)}</span>
                  <Button
                    variant="secondary"
                    size="xs"
                    className="h-6"
                    onClick={() => {
                      productPriceDialog.setState({
                        isOpen: true,
                        product: item,
                      })
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{format(item.createdAt, 'MM-dd')}</TableCell>
                <TableCell className="text-foreground/70 flex items-center gap-1">
                  <Edit3
                    size={18}
                    className="cursor-pointer"
                    onClick={() => {
                      setState({
                        isOpen: true,
                        product: item,
                        index,
                      })
                    }}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
