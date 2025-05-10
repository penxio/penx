import { defaultNavLinks, editorDefaultValue } from '@penx/constants'
import { AreaType, ChargeMode } from '@penx/db/client'
import { getDefaultMolds } from '@penx/libs/getDefaultMolds'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import { localDB } from '@penx/local-db'
import { ISite } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'

export async function initLocalSite(uid?: string) {
  return await localDB.transaction(
    'rw',
    localDB.site,
    localDB.mold,
    localDB.area,
    async () => {
      const siteId = uniqueId()
      const userId = uid || uniqueId()
      await localDB.addSite({
        id: siteId,
        name: 'My Penx Site',
        description: '',
        about: JSON.stringify(editorDefaultValue),
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
        aiProviders: [],
        repo: '',
        installationId: 0,
        balance: 0,
        themeName: 'garden',
        themeConfig: {},
        memberCount: 0,
        creationCount: 0,
        isRemote: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      } as ISite)

      await localDB.mold.bulkPut(
        getDefaultMolds({
          siteId,
          userId,
        }),
      )

      const molds = await localDB.mold.where({ siteId }).toArray()

      await localDB.area.put({
        id: uniqueId(),
        slug: 'first-area',
        name: 'First area',
        description: 'An area for sharing thoughts, stories, and insights.',
        about: JSON.stringify(editorDefaultValue),
        logo: '',
        chargeMode: ChargeMode.FREE,
        widgets: getInitialWidgets(molds),
        type: AreaType.SUBJECT,
        isGenesis: true,
        favorites: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        siteId,
        userId,
      })

      const site = await localDB.site.get(siteId)
      console.log('init local site!!!')
      return site!
    },
  )
}
