'use client'

import { PropsWithChildren, useEffect } from 'react'
// import { useSession } from '@penx/session'
// import { usePathname } from '@penx/libs/i18n'
// import { setLocalSession } from '@/lib/local-session'
import { Provider } from 'jotai'
import { JotaiNexus } from './JotaiNexus'
import { store } from './store'

export function StoreProvider(props: PropsWithChildren) {
  return (
    <Provider store={store}>
      <JotaiNexus />
      {props.children}
    </Provider>
  )
}
