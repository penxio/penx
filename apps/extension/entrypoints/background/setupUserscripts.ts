import { getSpaceInfo } from '@/lib/getSpaceInfo'
import { matchPattern } from '@/lib/matchPattern'
import { onMessage } from '@/lib/message'
import { storage } from '@/lib/storage'
import { browser } from '#imports'
import { Creation, Struct } from '@penx/domain'
import { getCreationFields } from '@penx/libs/getCreationFields'
import { localDB } from '@penx/local-db'
import { Userscript } from '@penx/model-type'

export async function setupUserscripts() {
  onMessage('setupUserscript', async ({ data, ...rest }) => {
    const session = await storage.getSession()

    if (!session) return

    const { userscriptNodes, userscriptStruct, area } = await getSpaceInfo()

    // console.log('=========userscriptNodes:', userscriptNodes)

    for (const item of userscriptNodes) {
      const fields = getCreationFields<Userscript>(
        new Struct(userscriptStruct),
        new Creation(item),
      )

      if (!fields.enabled) continue

      const patterns = fields.match
        .split('\n')
        .filter(Boolean)
        .map((i) => i.trim())

      if (!patterns.length) continue

      const some = patterns.some((p) => matchPattern(p, data.url))

      if (!some) continue

      const script: Browser.userScripts.RegisteredUserScript[] = [
        {
          id: item.id,
          matches: patterns,
          js: [{ code: fields.code }],
        },
      ]

      // console.log('====>>>>>>fields:', fields)

      if (await isUserScriptRegistered(item.id)) {
        browser.userScripts.update(script)
      } else {
        browser.userScripts.register(script)
      }
    }
  })
}

async function isUserScriptRegistered(id: string) {
  const scripts = await browser.userScripts.getScripts()
  console.log('======scripts:', scripts)

  return scripts.some((script) => script.id === id)
}
