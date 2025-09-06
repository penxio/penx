import { Provider } from 'jotai'
import { Panel } from '@penx/panel-app/components/Panel/Panel'

function App() {
  return (
    <Provider>
      <Panel location="sidepanel" defaultTheme="light" />
    </Provider>
  )
}

export default App
