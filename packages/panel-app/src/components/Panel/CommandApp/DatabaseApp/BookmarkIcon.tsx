import { useEffect, useState } from 'react'
import ky from 'ky'
import { Creation, Struct } from '@penx/domain'
import { store } from '@penx/store'

interface Props {
  struct: Struct
  creation: Creation
}

export function BookmarkIcon({ creation, struct }: Props) {
  const cells = creation.getCells(struct)
  const [value, setValue] = useState(cells.icon)
  useEffect(() => {
    if (value) return
    async function loadFaviconUrl() {
      const url = cells.url as string
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
    loadFaviconUrl()
  }, [struct, creation, value, setValue])

  if (!value) return null
  return <img src={value} className="shadow-xs size-4" />
}
