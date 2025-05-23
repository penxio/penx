import { defaultEditorContent, ELEMENT_P } from '@penx/constants'
import { prisma } from '@penx/db'
import { Option } from '@penx/types'

interface Input {
  siteId: string
  id?: string
  slug?: string
}

export async function getDatabaseData<T = any>(input: Input) {
  const where: Record<string, any> = {
    siteId: input.siteId,
  }
  if (input.slug) where.slug = input.slug
  if (input.id) where.id = input.id

  const database = await prisma.database.findFirst({
    include: {
      views: true,
      columns: true,
      records: {
        orderBy: {
          sort: 'asc',
        },
      },
    },
    where,
  })
  if (!database) return []

  const data = database.records.map((record) => {
    return database.columns.reduce(
      (acc, item) => {
        let value = (record.columns as any)[item.id]
        if (item.name === 'status') {
          const options = item.options as any as Option[]
          const option = options?.find((o) => o.id === value?.[0])
          value = option?.name || 'pending'
        }
        return {
          ...acc,
          [item.name]: value,
        }
      },
      {} as Record<string, any>,
    )
  })
  return data as T[]
}
