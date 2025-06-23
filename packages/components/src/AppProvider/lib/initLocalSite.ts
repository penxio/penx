import { t } from '@lingui/core/macro'
import { format } from 'date-fns'
import { defaultEditorContent, defaultNavLinks } from '@penx/constants'
import { getDefaultStructs } from '@penx/libs/getDefaultStructs'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import { localDB } from '@penx/local-db'
import {
  IJournalNode,
  ISiteNode,
  IStructNode,
  NodeType,
} from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'

export async function initLocalSite(uid?: string) {
  return await localDB.transaction('rw', localDB.node, async () => {
    const siteId = uniqueId()
    const userId = uid || uniqueId()
    console.log('========siteId:', siteId, 'uid:', uid)

    const newSite: ISiteNode = {
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
    }
    await localDB.node.add(newSite)

    const areaId = await localDB.node.add({
      id: uniqueId(),
      type: NodeType.AREA,
      props: {
        slug: 'my-area',
        name: t`My area`,
        description: t`An area for sharing thoughts, stories, and insights.`,
        about: JSON.stringify(defaultEditorContent),
        logo: '',
        chargeMode: 'FREE',
        widgets: [],
        isGenesis: true,
        favorites: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      siteId,
      userId,
    })

    await localDB.node.bulkPut(
      getDefaultStructs({
        siteId: siteId,
        userId,
        areaId: areaId,
      }),
    )

    const structs = await localDB.listStructs(areaId)
    const widgets = getInitialWidgets(structs)
    const area = await localDB.getNode(areaId)

    await localDB.node.update(areaId, {
      props: {
        ...area.props,
        widgets,
      },
    })

    await localDB.node.add({
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

    // const structs = (await localDB.node
    //   .where({ type: NodeType.STRUCT, siteId })
    //   .toArray()) as unknown as IStructNode[]

    const site = await localDB.node.get(siteId)
    console.log('init local site!!!')
    return site as ISiteNode
  })
}
