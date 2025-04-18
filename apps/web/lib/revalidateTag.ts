'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateMetadata(key: string) {
  revalidateTag(key)
}
