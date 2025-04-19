import { prisma } from '@penx/db'

export async function fixRowSort(databaseId: string) {
  const records = await prisma.record.findMany({
    where: { databaseId },
  })

  const sortedRecords = records.sort((a, b) => a.sort - b.sort)
  const isSortValid = sortedRecords.every(
    (record, index) => record.sort === index,
  )

  if (!isSortValid) {
    let index = 0
    for (const item of sortedRecords) {
      await prisma.record.update({
        where: { id: item.id },
        data: { sort: index },
      })
      index++
    }

    return prisma.record.findMany({
      where: { databaseId },
    })
  }
  return records
}
