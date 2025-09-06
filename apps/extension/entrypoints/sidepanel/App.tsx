import { Provider } from 'jotai'
import { Panel } from '@penx/panel-app/components/Panel/Panel'

function App() {
  return (
    <Provider>
      <Panel location="sidepanel" />
    </Provider>
  )
}

export default App
