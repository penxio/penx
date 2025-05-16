import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Redirect, Route } from 'react-router-dom'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { SafeArea } from '@capacitor-community/safe-area'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import Menu from './components/Menu'
import PageHome from './pages/PageHome'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
/* Basic CSS for apps built with Ionic */
// import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/react/css/palettes/dark.always.css'
import '@ionic/react/css/palettes/dark.class.css'
// import '@ionic/react/css/palettes/dark.system.css'
/* Theme variables */
import './theme/variables.css'

async function init() {
  const platform = Capacitor.getPlatform()

  // const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

  const mode = await DarkMode.isDarkMode()

  const isDark = mode.dark

  if (['ios', 'android'].includes(platform)) {
    SafeArea.enable({
      config: {
        customColorsForSystemBars: true,
        statusBarColor: '#00000000', // transparent
        statusBarContent: isDark ? 'light' : 'dark',
        navigationBarColor: '#00000000', // transparent
        navigationBarContent: isDark ? 'light' : 'dark',
      },
    })

    // if (mode.dark) {
    //   const html = document.documentElement
    //   html.classList.add('dark')
    //   html.classList.add('ion-palette-dark')
    //   await StatusBar.setStyle({
    //     style: Style.Dark,
    //   })
    // } else {
    //   const html = document.documentElement
    //   html.classList.remove('dark')
    //   html.classList.remove('ion-palette-dark')

    //   await StatusBar.setStyle({
    //     style: Style.Light,
    //   })
    // }

    // if (prefersDarkScheme.matches) {
    //   const html = document.documentElement
    //   html.classList.add('dark')
    //   html.classList.add('ion-palette-dark')
    //   await StatusBar.setStyle({
    //     style: Style.Dark,
    //   })
    // } else {
    //   const html = document.documentElement
    //   html.classList.remove('dark')
    //   html.classList.remove('ion-palette-dark')

    //   await StatusBar.setStyle({
    //     style: Style.Light,
    //   })
    // }

    // prefersDarkScheme.addEventListener('change', async (status) => {
    //   try {
    //     await StatusBar.setStyle({
    //       style: status.matches ? Style.Light : Style.Dark,
    //     })
    //   } catch {
    //     //
    //   }
    // })
  }
}

init()

setupIonicReact()

const App: React.FC = () => {
  return (
    <IonApp>
      <LinguiClientProvider initialLocale={'en'} initialMessages={{}}>
        <DndProvider backend={HTML5Backend}>
          <DashboardProviders>
            <IonReactRouter>
              <IonSplitPane contentId="main">
                <Menu />
                <IonRouterOutlet id="main">
                  <Route path="/" exact={true}>
                    <Redirect to="/folder/area" />
                  </Route>
                  <Route path="/folder/:name" exact={true}>
                    <PageHome />
                  </Route>
                </IonRouterOutlet>
              </IonSplitPane>
            </IonReactRouter>
          </DashboardProviders>
        </DndProvider>
      </LinguiClientProvider>
    </IonApp>
  )
}

export default App
