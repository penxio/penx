import { get } from 'idb-keyval'
import _ky from 'ky'
import {
  CheckoutInput,
  CreateAssetInput,
  isDesktop,
  isMobileApp,
  PublishStructInput,
  ROOT_HOST,
  SyncAppleSubscriptionInput,
  TRANSCRIBE_URL,
  UpdatePasswordInput,
  UpdateProfileInput,
  UpdateSiteInput,
} from '@penx/constants'
import { IStructNode } from '@penx/model-type'
import { GoogleInfo, Site } from '@penx/types'

async function getHeaders() {
  const session = await get('SESSION')
  if (session?.accessToken) {
    return {
      Authorization: `Bearer ${session.accessToken}`,
    }
  }

  return {}
}

export const ky = _ky.extend({
  hooks: {
    beforeRequest: [
      async (request) => {
        const headers = await getHeaders()
        Object.entries(headers).forEach(([key, value]) => {
          request.headers.set(key, value)
        })
      },
    ],
    beforeError: [
      async (error) => {
        if (error.response) {
          try {
            const errorBody = await error.response.json()
            return errorBody as any
          } catch (parseError) {
            return error
          }
        } else {
          return error
        }
      },
    ],
  },
})

type SyncInput = {
  operation: any
  siteId: string
  key: string
  data: any
}

type Asset = {
  id: string
  url: string
}

type Me = {
  id: string
  image: string
  displayName: string
  bio: string
}

export interface ApiRes<T = any> {
  success: boolean
  data: T
}

export const api = {
  async fetchSession() {
    await ky.get(`${ROOT_HOST}/api/session`).json()
  },

  async getSession(needRefresh = false) {
    return ky
      .get(`${ROOT_HOST}/api/session`, {
        searchParams: needRefresh ? { needRefresh: 'true' } : {},
      })
      .json()
  },

  async updateSite(input: UpdateSiteInput) {
    return await ky
      .post(`${ROOT_HOST}/api/site/update`, {
        json: input,
      })
      .json<Site>()
  },

  async sync(url: string, input: SyncInput) {
    await ky
      .post(url, {
        json: input,
      })
      .json()
  },

  async syncInitialNodes(nodes: any[]) {
    return ky
      .post(`${ROOT_HOST}/api/sync-initial-nodes`, {
        json: {
          nodes,
        },
      })
      .json<{ ok: boolean; existed: boolean; siteId: string }>()
  },

  async deleteAccount() {
    return ky.post(`${ROOT_HOST}/api/delete-account`).json()
  },

  async getAsset(url: string) {
    const { asset } = await ky
      .post(`${ROOT_HOST}/api/asset/get-by-url`, {
        json: { url },
      })
      .json<{ asset: Asset }>()
    return asset
  },

  async createAsset(input: CreateAssetInput) {
    return await ky
      .post(`${ROOT_HOST}/api/asset/create`, {
        json: input,
      })
      .json<{ success: boolean }>()
  },

  async transcribe(file: File, duration: number, hash: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('duration', duration.toString())
    formData.append('hash', hash)
    return ky
      .post(TRANSCRIBE_URL, {
        body: formData,
      })
      .json<{ text: string }>()
  },

  async sendSmsCode(phone: string, userId = '') {
    return ky
      .post(`${ROOT_HOST}/api/send-sms-code`, {
        json: {
          phone,
          userId,
        },
      })
      .json()
  },

  async listStructTemplate() {
    return ky
      .get(`${ROOT_HOST}/api/struct-template/list`)
      .json<(IStructNode['props'] & { id: string })[]>()
  },

  async publishStruct(input: PublishStructInput) {
    return ky
      .post(`${ROOT_HOST}/api/struct-template/publish`, {
        json: input,
      })
      .json()
  },

  async syncAppleSubscription(input: SyncAppleSubscriptionInput) {
    return ky
      .post(`${ROOT_HOST}/api/subscription/sync-apple-subscription`, {
        json: input,
      })
      .json()
  },

  async updatePassword(input: UpdatePasswordInput) {
    return ky
      .post(`${ROOT_HOST}/api/auth/updatePassword`, {
        json: input,
      })
      .json()
  },

  async getMe() {
    return ky.post(`${ROOT_HOST}/api/user/getMe`).json<Me>()
  },

  async updateProfile(input: UpdateProfileInput) {
    return ky
      .post(`${ROOT_HOST}/api/user/updateProfile`, {
        json: input,
      })
      .json()
  },

  async useCouponCode(code: string) {
    return await ky
      .post(`${ROOT_HOST}/api/coupon/useCouponCode`, {
        json: { code },
      })
      .json()
  },

  async cancelSubscription() {
    return ky.post(`${ROOT_HOST}/api/billing/cancel`).json()
  },

  async checkout(input: CheckoutInput) {
    return ky
      .post(`${ROOT_HOST}/api/billing/checkout`, {
        json: input,
      })
      .json<{ success: boolean; url: string }>()
  },

  async updatePublicKey(publicKey: string) {
    return ky
      .post(`${ROOT_HOST}/api/site/updatePublicKey`, {
        json: { publicKey },
      })
      .json<{ success: boolean }>()
  },

  async getGoogleDriveToken() {
    const { data } = await ky
      .post(`${ROOT_HOST}/api/google/getDriveToken`)
      .json<{ success: boolean; data: GoogleInfo }>()
    return data
  },
}
