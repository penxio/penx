import { Site } from '@/lib/theme.types'
import mitt from 'mitt'

export type AppEvent = {
  SITE_UPDATED: Site
  KEY_DOWN_ENTER_ON_TITLE: undefined
  CREATION_UPDATED: any
}

export const appEmitter = mitt<AppEvent>()
