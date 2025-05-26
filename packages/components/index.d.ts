declare module 'shikwasa'

declare global {
  interface Window {
    __SITE__: any
    __SITE_ID__: string
    __USER_ID__: string
    __PLAYER__: any
  }
}
