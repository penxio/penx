import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { idb } from '@penx/indexeddb'
import { initPGLiteNodeModelApi } from '@penx/libs/initPGLiteNodeModelApi'
import { Panel } from '@penx/panel-app/components/Panel/Panel'

initPGLiteNodeModelApi()

window.electron.ipcRenderer.on('create-change', async (_, data) => {
  console.log('create change data======:', data)

  await idb.change.add({
    ...data,
    createdAt: new Date(data.createdAt),
  })
  //
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Panel />
  </StrictMode>,
)
