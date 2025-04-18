import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { prisma } from '@penx/db'

interface Input {
  userId: string
  siteId: string
  title: string
  isJournal?: boolean
  date?: string
}

export async function createPage(input: Input) {
  const newPage = await prisma.creation.create({
    data: {
      content: JSON.stringify(editorDefaultValue),
      isPage: true,
      ...input,
    },
  })

  return newPage
}
