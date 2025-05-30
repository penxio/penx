import { t } from '@lingui/core/macro'
import { format } from 'date-fns'
import { defaultEditorContent, defaultNavLinks } from '@penx/constants'
import { getDefaultStructs } from '@penx/libs/getDefaultStructs'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import {
  IJournalNode,
  ISiteNode,
  IStructNode,
  NodeType,
} from '@penx/model-type'
import { db } from '@penx/pg'
import { uniqueId } from '@penx/unique-id'

export async function initLocalSite(uid?: string) {
  const siteId = uniqueId()
  const userId = uid || uniqueId()

  const site = await db.addNode({
    id: siteId,
    type: NodeType.SITE,
    siteId: siteId,
    props: {
      name: t`My Site`,
      description: '',
      about: JSON.stringify(defaultEditorContent),
      logo: '',
      font: '',
      image: '',
      podcastCover: '',
      email: '',
      socials: {},
      analytics: {},
      config: {
        locales: ['en', 'zh-CN', 'ja'],
      },
      navLinks: defaultNavLinks,
      newsletterConfig: {},
      notificationConfig: {},
      aiSetting: {},
      repo: '',
      installationId: 0,
      balance: 0,
      themeName: 'garden',
      themeConfig: {},
      memberCount: 0,
      creationCount: 0,
      isRemote: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
  })

  const areaId = uniqueId()
  await db.addNode({
    id: areaId,
    type: NodeType.AREA,
    props: {
      slug: 'my-area',
      name: t`My area`,
      description: t`An area for sharing thoughts, stories, and insights.`,
      about: JSON.stringify(defaultEditorContent),
      logo: '',
      chargeMode: 'FREE',
      widgets: getInitialWidgets(),
      isGenesis: true,
      favorites: [],
    },

    createdAt: new Date(),
    updatedAt: new Date(),
    siteId,
    userId,
    areaId: '',
  })

  const defaultStructs = getDefaultStructs({
    siteId: siteId,
    userId,
    areaId,
  })

  for (const struct of defaultStructs) {
    await db.addNode(struct)
  }

  await db.addNode({
    id: uniqueId(),
    type: NodeType.JOURNAL,
    props: {
      date: format(new Date(), 'yyyy-MM-dd'),
      children: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    siteId: siteId,
    userId,
    areaId,
  } as IJournalNode)

  // const structs = (await db.node
  //   .where({ type: NodeType.STRUCT, siteId })
  //   .toArray()) as unknown as IStructNode[]

  return site as ISiteNode
}
