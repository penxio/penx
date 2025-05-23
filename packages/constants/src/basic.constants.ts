import { NavLink, NavLinkLocation, NavLinkType } from '@penx/types'

export const isServer = typeof window === 'undefined'
export const isBrowser = typeof window !== 'undefined'
export const isProd = process.env.NODE_ENV === 'production'
export const isNavigator = typeof navigator !== 'undefined'

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN!

export const ROOT_HOST: string =
  process.env.NEXT_PUBLIC_ROOT_HOST ||
  // @ts-ignores
  import.meta.env?.VITE_ROOT_HOST ||
  // @ts-ignores
  import.meta.env?.WXT_ROOT_HOST ||
  ''

export const PLATFORM =
  process.env.NEXT_PUBLIC_PLATFORM ||
  // @ts-ignores
  import.meta?.env?.VITE_PLATFORM ||
  // @ts-ignores
  import.meta?.env?.WXT_PLATFORM

export const isDesktop = PLATFORM === 'DESKTOP'
export const isMobileApp = PLATFORM === 'MOBILE'
export const isWeb = PLATFORM === 'WEB'
export const isExtension = PLATFORM === 'EXTENSION'

export const GOOGLE_CLIENT_ID =
  '864679274232-niev1df1dak216q5natclfvg5fhtp7fg.apps.googleusercontent.com'

export const GOOGLE_DRIVE_FOLDER_PREFIX = `penx-`
export const GOOGLE_DRIVE_FOLDER = 'penx'

export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days
export const SECONDS_PER_DAY = BigInt(24 * 60 * 60) // 1 days

export const SITE_MODE = 'SITE_MODE'

export const ACTIVE_SITE = 'ACTIVE_SITE'

export enum SubscriptionType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export enum CreationStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
  CONTRIBUTED = 'CONTRIBUTED',
}

export enum WorkerEvents {
  START_POLLING,
  START_LOCAL_BACKUP,

  START_PULL,
  PULL_SUCCEEDED,
  PULL_FAILED,
}

export const TODO_DATABASE_NAME = '__TODO__'

export const FILE_DATABASE_NAME = '__FILE__'

export const PROJECT_DATABASE_NAME = '__PENX_PROJECT__'
export const FRIEND_DATABASE_NAME = '__PENX_FRIEND__'

export const LOCAL_AUTO_BACKUP_DIR = 'LOCAL_AUTO_BACKUP_DIR'
export const LOCAL_BACKUP_INTERVAL = 'LOCAL_BACKUP_INTERVAL'

export enum EditorMode {
  OUTLINER = 'OUTLINER',
  BLOCK = 'BLOCK',
}

export const WORKBENCH_NAV_HEIGHT = 54

export const DATABASE_TOOLBAR_HEIGHT = 42

export const SIDEBAR_WIDTH = 240

export const defaultEditorContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '' }],
    },
  ],
}

export enum LoginStatus {
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  INIT = 'INIT',
}

export const placeholderBlurhash =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg=='

export const defaultNavLinks: NavLink[] = [
  {
    title: 'Home',
    pathname: '/',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'Areas',
    pathname: '/areas',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'Writings',
    pathname: '/writings',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'Podcasts',
    pathname: '/podcasts',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: false,
  },
  {
    title: 'Notes',
    pathname: '/notes',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: false,
  },
  {
    title: 'Photos',
    pathname: '/photos',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: false,
  },
  {
    title: 'Projects',
    pathname: '/projects',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: false,
  },
  {
    title: 'Friends',
    pathname: '/friends',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: false,
  },
  {
    title: 'Tags',
    pathname: '/tags',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: false,
  },
  {
    title: 'Guestbook',
    pathname: '/guestbook',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: false,
  },
  {
    title: 'AMA',
    pathname: '/ama',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: false,
  },
  {
    title: 'About',
    pathname: '/about',
    location: NavLinkLocation.HEADER,
    type: NavLinkType.BUILTIN,
    visible: false,
  },
]

export const STRIPE_BASIC_MONTHLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID!
export const STRIPE_BASIC_YEARLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID!

export const STRIPE_STANDARD_MONTHLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID!
export const STRIPE_STANDARD_YEARLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_STANDARD_YEARLY_PRICE_ID!

export const STRIPE_PRO_MONTHLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID!
export const STRIPE_PRO_YEARLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID!

export const STRIPE_TEAM_MONTHLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID
export const STRIPE_TEAM_YEARLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID

export const STRIPE_BELIEVER_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_BELIEVER_PRICE_ID

export const FREE_PLAN_POST_LIMIT = Number(
  process.env.FREE_PLAN_POST_LIMIT || 50,
)

export const FREE_PLAN_PAGE_LIMIT = Number(
  process.env.FREE_PLAN_PAGE_LIMIT || 5,
)

export const PRO_PLAN_COLLABORATOR_LIMIT = Number(
  process.env.PRO_PLAN_COLLABORATOR_LIMIT || 3,
)

export const TEAM_PLAN_COLLABORATOR_LIMIT = Number(
  process.env.TEAM_PLAN_COLLABORATOR_LIMIT || 6,
)

export const BUILTIN_PAGE_SLUGS = [
  'about',
  'projects',
  'friends',
  'guestbook',
  'ama',
]

export const LATEST_POSTS_LIMIT = 6
export const HOME_PROJECT_LIMIT = 4

export enum TierInterval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum SubscriptionTarget {
  PENX = 'PENX',
  SITE = 'SITE',
}

export const defaultBenefits = [
  {
    children: [{ text: 'Benefit 1' }],
    id: '5RAj2vDe6E',
    type: 'p',
    indent: 1,
    listStyleType: 'disc',
  },
  {
    id: 'bCGGTOgA9K',
    type: 'p',
    indent: 1,
    listStyleType: 'disc',
    children: [{ text: 'Benefit 2' }],
    listStart: 2,
  },
  {
    id: 'jIzm5TXbMi',
    type: 'p',
    indent: 1,
    listStyleType: 'disc',
    listStart: 3,
    children: [{ text: 'Benefit 2' }],
  },
]

export enum GardenCardType {
  TITLE = 'TITLE',
  TEXT = 'TEXT',
  AREA = 'AREA',
  FRIENDS = 'FRIENDS',
  COMMENTS = 'COMMENTS',
  GUESTBOOK = 'GUESTBOOK',
  PROJECTS = 'PROJECTS',
  TAGS = 'TAGS',
}

export enum CardStyle {
  SHADOW = 'SHADOW',
  BORDERED = 'BORDERED',
  UNSTYLED = 'UNSTYLED',
}

export enum SocialType {
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  BEHANCE = 'BEHANCE',
  BUYMEACOFFEE = 'BUYMEACOFFEE',
  DISCORD = 'DISCORD',
  DRIBBBLE = 'DRIBBBLE',
  EMAIL = 'EMAIL',
  FACEBOOK = 'FACEBOOK',
  GITHUB = 'GITHUB',
  KOFI = 'KOFI',
  LINKEDIN = 'LINKEDIN',
  MASTODON = 'MASTODON',
  MEDIUM = 'MEDIUM',
  SNAPCHAT = 'SNAPCHAT',
  SUBSTACK = 'SUBSTACK',
  TELEGRAM = 'TELEGRAM',
  THREADS = 'THREADS',
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE',
  PATREON = 'PATREON',
}

export const defaultLayouts = [
  {
    h: [1, 1],
    i: '25369289-27e9-4045-8d59-2eba37b8c29d',
    w: [4, 8],
    x: [0, 0],
    y: [0, 0],
    type: 'TITLE',
    props: { title: 'Digital garden' },
  },
  {
    h: [1, 1],
    i: '98a8d964-f43c-4300-a5cd-c80266786705',
    w: [2, 2],
    x: [2, 0],
    y: [7, 6],
    type: 'TWITTER',
  },
  {
    h: [1, 1],
    i: 'fa9e2c67-6176-4e42-85e9-2c07ae5f5ba3',
    w: [2, 2],
    x: [0, 2],
    y: [7, 6],
    type: 'INSTAGRAM',
  },
  {
    h: [1, 1],
    i: 'ee07553d-8060-4bdf-9e5e-9fe7709c8037',
    w: [4, 8],
    x: [0, 0],
    y: [6, 5],
    type: 'TITLE',
    props: { title: 'Contact', subtitle: '' },
  },
  {
    i: '5bf6f117-32f2-4ac3-957d-d32258b29572',
    x: [0, 0],
    y: [8, 1],
    w: [2, 8],
    h: [2, 4],
    type: 'TEXT',
    props: {
      text: [
        {
          children: [{ text: 'This is my digital garden.' }],
          id: 'Yc2MFkWFzw',
          type: 'p',
        },
      ],
    },
  },
]

export enum WidgetType {
  JOURNAL = 'JOURNAL',
  ALL_CREATIONS = 'ALL_CREATIONS',
  RECENTLY_EDITED = 'RECENTLY_EDITED',
  RECENTLY_OPENED = 'RECENTLY_OPENED',
  AI_CHAT = 'AI_CHAT',
  COLLECTION = 'COLLECTION',
  FAVORITES = 'FAVORITES',
  ALL_STRUCTS = 'ALL_STRUCTS',
  STRUCT = 'STRUCT',
}

export const reservedDomains = [
  'admin',
  'api',
  'graphql',
  'cdn',
  'next',
  'docs',
  'help',
  'blog',
  'creator-fi',
  'help',
  'news',
  'status',
  'support',
  'app',
  'community',
  'profile',
  'settings',
  'articles',
  'images',
  'videos',
  'podcasts',
  'about',
  'info',
  'shop',
  'store',
  'www',
  'stats',
  'umami',
  'test',
  'dev',
  'develop',
  'prod',
  'production',
  'sepolia',
]
