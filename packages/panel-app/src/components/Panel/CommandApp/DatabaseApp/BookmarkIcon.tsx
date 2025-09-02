import { useEffect, useState } from 'react'
import ky from 'ky'
import { Creation, Struct } from '@penx/domain'
import { store } from '@penx/store'
import { getBookmarkIcon } from '../../../../lib/getBookmarkIcon'
import { getBookmarkUrl } from '../../../../lib/getBookmarkUrl'

interface Props {
  struct: Struct
  creation: Creation
}

export function BookmarkIcon({ creation, struct }: Props) {
  const [value, setValue] = useState(getBookmarkIcon(struct, creation))
  useEffect(() => {
    if (value) return
    async function loadFaviconUrl() {
      const url = getBookmarkUrl(struct, creation)
      if (!url) return
      const u = new URL(url)
      const host = `${u.protocol}//${u.host}`
      const { data } = await ky
        .get(`http://localhost:14158/api/bookmark/getFavicon?url=${host}`)
        .json<{ data: string }>()

      const iconColumn = struct.columns.find((c) => c.slug === 'icon')!
      store.creations.updateCreationProps(creation.id, {
        cells: {
          ...creation.cells,
          [iconColumn.id]: data,
        },
      })

      setValue(data)
    }
    // const url = getBookmarkIcon(struct, )
    loadFaviconUrl()
  }, [struct, creation, value, setValue])

  if (!value) return null
  return <img src={value} className="shadow-xs size-4" />
}
