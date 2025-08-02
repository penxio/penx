import { zValidator } from '@hono/zod-validator'
import { format } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { Conf } from 'electron-conf/main'
import { Hono } from 'hono'
import { z } from 'zod'
import { defaultEditorContent } from '@penx/constants'
import { db } from '@penx/db/client'
import { nodes } from '@penx/db/schema/nodes'
import { Creation } from '@penx/domain'
import { ICreationNode, IStructNode, NodeType } from '@penx/model-type'
import { CreationStatus, GateType, SessionData, StructType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export interface BookmarkTreeNode {
  dateAdded?: number
  dateGroupModified?: number
  dateLastUsed?: number
  folderType?: string
  id: string
  index?: number
  parentId?: string
  syncing: boolean
  title: string
  unmodifiable?: string
  url?: string
  category: string
}

export const AddBookmarksInputSchema = z.object({
  bookmarks: z.array(z.any()),
})

const app = new Hono()

app.get(
  '/list',
  // zValidator(
  //   'json',
  //   z.object({
  //     url: z.string(),
  //   }),
  // ),
  async (c) => {
    // const { url } = c.req.valid('json')

    return c.json({
      success: true,
    })
  },
)

app.get(
  '/getFavicon',
  zValidator(
    'query',
    z.object({
      url: z.string(),
    }),
  ),
  async (c) => {
    const { url } = c.req.valid('query')
    const favicon = await import('@victr/favicon-fetcher')
    return c.json({
      success: true,
      data: await favicon.default.text(url),
    })
  },
)

app.post(
  '/createMany',
  zValidator('json', AddBookmarksInputSchema),
  async (c) => {
    const conf = new Conf()
    const input = c.req.valid('json')
    // console.log('=====bookmarks:', input.bookmarks)

    // console.log('=======areas:', areas)
    const session = conf.get('session') as SessionData
    const areaId = conf.get('areaId') as string

    const structs = await db
      .select()
      .from(nodes)
      .where(
        and(
          eq(nodes.spaceId, session.spaceId),
          eq(nodes.type, NodeType.STRUCT),
          eq(nodes.areaId, areaId),
        ),
      )

    const bookmarkStruct = structs.find(
      (s: any) => s.props.type === StructType.BOOKMARK,
    ) as IStructNode

    // console.log('====bookmarkStruct:', JSON.stringify(bookmarkStruct, null, 2))

    const creations = await db
      .select()
      .from(nodes)
      .where(
        and(
          eq(nodes.spaceId, session.spaceId),
          eq(nodes.type, NodeType.CREATION),
          eq(nodes.areaId, areaId),
        ),
      )

    const bookmarks = creations.filter((c) => new Creation(c as any).isBookmark)

    for (const item of input.bookmarks.slice(0, 2) as BookmarkTreeNode[]) {
      const urlColumn = bookmarkStruct.props.columns.find(
        (c) => c.slug === 'url',
      )!

      const find = bookmarks.find((b) => {
        const creation = new Creation(b as any)
        return creation.cells?.[urlColumn.id] === item.url
      })

      // console.log('=========find:', find)

      if (find) continue

      // const favicon = await import('@victr/favicon-fetcher')
      // const faviconUrl = await favicon.default.text(item.url || '')
      // console.log('======faviconUrl:', faviconUrl)

      const cells = bookmarkStruct.props.columns.reduce(
        (acc, column) => {
          let value = ''
          if (column.slug === 'url') {
            value = item.url!
          }
          if (column.slug === 'icon') {
            // value = faviconUrl
          }

          return { ...acc, [column.id]: value }
        },
        {} as Record<string, any>,
      )

      console.log('create........')

      await db.insert(nodes).values({
        id: uniqueId(),
        type: NodeType.CREATION,
        spaceId: session.spaceId,
        props: {
          slug: uniqueId(),
          title: item.title,
          description: '',
          image: '',
          icon: '',
          cells: cells,
          podcast: {},
          i18n: {},
          gateType: GateType.FREE,
          status: CreationStatus.DRAFT,
          content: defaultEditorContent,
          data: {},
          type: bookmarkStruct.props.type,
          structId: bookmarkStruct.id,
          commentStatus: 'OPEN',
          featured: false,
          collectible: false,
          isJournal: false,
          isPopular: false,
          checked: false,
          delivered: false,
          commentCount: 0,
          cid: '',
          openedAt: new Date(),
          date: format(new Date(), 'yyyy-MM-dd'),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: session.userId,
        areaId: areaId,
      } as ICreationNode)
    }

    return c.json({
      success: true,
    })
  },
)

export default app
