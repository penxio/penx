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
} from '@penx/constants'
import { IStructNode } from '@penx/model-type'

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

export const api = {
  async fetchSession() {
    await ky.get(`${ROOT_HOST}/api/session`).json()
  },

  async sync(input: SyncInput) {
    await ky
      .post(`${ROOT_HOST}/api/v1/sync`, {
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

  async getSession(needRefresh = false) {
    return ky
      .get(`${ROOT_HOST}/api/session`, {
        searchParams: needRefresh ? { needRefresh: 'true' } : {},
      })
      .json()
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
}
