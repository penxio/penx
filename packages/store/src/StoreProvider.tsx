'use client'

import { PropsWithChildren, useEffect } from 'react'
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
