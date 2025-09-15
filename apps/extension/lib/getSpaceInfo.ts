import { storage } from '@/lib/storage'
import { localDB } from '@penx/local-db'
import { SessionData, StructType } from '@penx/types'

export async function getSpaceInfo(s?: SessionData) {
  const session = s || (await storage.getSession())
  // console.log('=====session:', session)
  const areas = await localDB.listAreas(session.spaceId)

  const area = areas[0]

  const structs = await localDB.listStructs(area.id)

  // console.log('=======structs:', structs)
  const creations = await localDB.listCreations(area.id)

  const tabStruct = structs.find((s) => s.props.type === StructType.BROWSER_TAB)
  if (!tabStruct) throw new Error('No tab struct')

  const tabNodes = creations.filter((c) => c.props.structId === tabStruct.id)

  const userscriptStruct = structs.find(
    (s) => s.props.type === StructType.USERSCRIPT,
  )

  if (!userscriptStruct) throw new Error('No userscript struct')

  const userscriptNodes = creations.filter(
    (c) => c.props.structId === userscriptStruct.id,
  )

  const bookmarkStruct = structs.find(
    (s) => s.props.type === StructType.BOOKMARK,
  )

  if (!bookmarkStruct) throw new Error('No bookmark struct')

  const bookmarkNodes = creations.filter(
    (c) => c.props.structId === bookmarkStruct.id,
  )

  return {
    area,
    tabStruct,
    tabNodes,
    userscriptStruct,
    userscriptNodes,
    bookmarkStruct,
    bookmarkNodes,
  }
}
