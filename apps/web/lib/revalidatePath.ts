'use server'

import { revalidatePath as nextRevalidatePath } from 'next/cache'

export async function revalidatePath(
  originalPath: string,
  type?: 'layout' | 'page',
) {
  nextRevalidatePath(originalPath, type)
}
