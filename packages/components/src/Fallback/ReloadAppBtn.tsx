import { Button } from '@penx/uikit/ui/button'

export const ReloadAppBtn = () => {
  async function reloadApp() {
    window.location.reload()
  }

  return <Button onClick={() => reloadApp()}>Reload App</Button>
}
