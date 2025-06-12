import { Redirect, Route } from 'react-router-dom'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { SafeArea } from '@capacitor-community/safe-area'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import {
  IonApp,
  IonNav,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { i18n } from '@lingui/core'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { GOOGLE_OAUTH_REDIRECT_URI } from '@penx/constants'
import { useMobileNav } from '@penx/hooks/useMobileNav'
import Menu from './components/Menu'
import PageHome from './pages/PageHome/PageHome'
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
//
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import 'react-datepicker/dist/react-datepicker.css'
import '@glideapps/glide-data-grid/dist/index.css'
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
import { useEffect, useRef } from 'react'
import { Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useCreationId } from '@penx/hooks/useCreationId'
import { LocaleProvider } from '@penx/locales'
import { ICreationNode } from '@penx/model-type'
import { Widget } from '@penx/types'
import { NavProvider } from './components/NavContext'
import { ThemeProvider } from './components/theme-provider'
import { UpgradeDrawer } from './components/UpgradeDrawer/UpgradeDrawer'
import {
  showEstimatedQuota,
  tryPersistWithoutPromptingUser,
} from './lib/indexeddbHelder'
import { initializeRevenueCat } from './lib/initializeRevenueCat'
import { PageAllStructs } from './pages/PageAllStructs/PageAllStructs'
import { PageCreation } from './pages/PageCreation'
import { MoreStructDrawer } from './pages/PageHome/HomeFooter/MoreStructDrawer/MoreStructDrawer'
import { PageLogin } from './pages/PageLogin'
import { PageProfile } from './pages/PageProfile'
import { PageStruct } from './pages/PageStruct'
import { PageStructInfo } from './pages/PageStructInfo/PageStructInfo'
import { PageWidget } from './pages/PageWidget'
import { AppInitializer } from './AppInitializer'

const platform = Capacitor.getPlatform()
async function init() {
  // const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

  const mode = await DarkMode.isDarkMode()

  const isDark = mode.dark

  // showEstimatedQuota()
  const persist = await tryPersistWithoutPromptingUser()
  console.log('========persist:', persist)

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
  const nav = useRef<HTMLIonNavElement>(null)
  const { setNav } = useMobileNav()

  useEffect(() => {
    setNav(nav)
  }, [nav])

  useEffect(() => {
    appEmitter.on('ON_LOGOUT_SUCCESS', () => {
      nav.current?.popToRoot()
    })
  }, [])

  useEffect(() => {
    function handle(creation: ICreationNode) {
      nav.current?.push(PageCreation, {
        creationId: creation.id,
        nav: nav.current,
      })
    }

    appEmitter.on('ROUTE_TO_CREATION', handle)
    return () => {
      appEmitter.off('ROUTE_TO_CREATION', handle)
    }
  }, [])

  useEffect(() => {
    function handle() {
      nav.current?.push(PageStruct, {})
    }

    appEmitter.on('ROUTE_TO_STRUCT', handle)
    return () => {
      appEmitter.off('ROUTE_TO_STRUCT', handle)
    }
  }, [])

  useEffect(() => {
    function handle() {
      nav.current?.push(PageLogin, {})
    }
    appEmitter.on('ROUTE_TO_LOGIN', handle)
    return () => {
      appEmitter.off('ROUTE_TO_LOGIN', handle)
    }
  }, [])

  useEffect(() => {
    function handle() {
      nav.current?.push(PageAllStructs, {})
    }

    appEmitter.on('ROUTE_TO_ALL_STRUCTS', handle)
    return () => {
      appEmitter.off('ROUTE_TO_ALL_STRUCTS', handle)
    }
  }, [])

  useEffect(() => {
    function handle() {
      nav.current?.push(PageProfile, {})
    }
    appEmitter.on('ROUTE_TO_PROFILE', handle)
    return () => {
      appEmitter.off('ROUTE_TO_PROFILE', handle)
    }
  }, [])

  useEffect(() => {
    function handle(widget: Widget) {
      nav.current?.push(PageWidget, { widget })
    }
    appEmitter.on('ROUTE_TO_WIDGET', handle)
    return () => {
      appEmitter.off('ROUTE_TO_WIDGET', handle)
    }
  }, [])

  useEffect(() => {
    function handle(struct?: Struct) {
      nav.current?.push(PageStructInfo, { struct })
    }
    appEmitter.on('ROUTE_TO_STRUCT_INFO', handle)
    return () => {
      appEmitter.off('ROUTE_TO_STRUCT_INFO', handle)
    }
  }, [])

  useEffect(() => {
    SocialLogin.initialize(
      platform === 'ios'
        ? {
            apple: {
              // clientId: '',
            },
          }
        : {
            google: {
              iOSClientId:
                '864679274232-ijpm9pmvthvuhtoo77j387gudd1ibvii.apps.googleusercontent.com',
              webClientId:
                '864679274232-niev1df1dak216q5natclfvg5fhtp7fg.apps.googleusercontent.com',

              // redirectUrl: GOOGLE_OAUTH_REDIRECT_URI,
              // mode: 'online',
            },
          },
    )
  }, [])

  return (
    <IonApp className="">
      <LocaleProvider>
        <ThemeProvider>
          <DashboardProviders>
            <UpgradeDrawer />
            <MoreStructDrawer />
            <AppInitializer />
            <IonReactRouter>
              <IonSplitPane contentId="main">
                <Menu />

                <IonRouterOutlet id="main">
                  <Route path="/" exact={true}>
                    <Redirect to="/folder/area" />
                  </Route>
                  <Route path="/folder/:name" exact={true}>
                    <NavProvider nav={nav.current!}>
                      <IonNav
                        ref={nav}
                        root={() => <PageHome nav={nav.current} />}
                      ></IonNav>
                    </NavProvider>
                  </Route>
                </IonRouterOutlet>
              </IonSplitPane>
            </IonReactRouter>
          </DashboardProviders>
        </ThemeProvider>
      </LocaleProvider>
    </IonApp>
  )
}

export default App
