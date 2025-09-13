import { getSpaceInfo } from '@/lib/getSpaceInfo'
import { sendMessage } from '@/lib/message'
import { storage } from '@/lib/storage'
import { browser } from '#imports'
import { Creation, Struct } from '@penx/domain'
import { getCreationFields } from '@penx/libs/getCreationFields'
import { localDB } from '@penx/local-db'
import { Userscript } from '@penx/model-type'

export async function setupUserscripts() {
  const session = await storage.getSession()

  console.log('=========>>>>>session:', session)

  if (!session) return

  const { userscriptNodes, userscriptStruct, area } = await getSpaceInfo()

  console.log('=========userscriptNodes:', userscriptNodes)

  for (const item of userscriptNodes) {
    const fields = getCreationFields<Userscript>(
      new Struct(userscriptStruct),
      new Creation(item),
    )

    browser.userScripts.register([
      {
        id: item.id,
        matches: ['<all_urls>'],
        js: [
          {
            code: fields.code,
          },
        ],
      },
    ])
  }
}
