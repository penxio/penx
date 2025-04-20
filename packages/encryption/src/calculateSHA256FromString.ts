// function stringToUint8Array(text: string): Uint8Array {
//   const encoder: TextEncoder = new TextEncoder()
//   return encoder.encode(text)
// }

// export async function calculateSHA256FromString(text: string): Promise<string> {
//   const data: Uint8Array = stringToUint8Array(text)
//   const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data)
//   const hashArray: Uint8Array = new Uint8Array(hashBuffer)
//   const hashHex: string = Array.from(hashArray)
//     .map((byte) => byte.toString(16).padStart(2, '0'))
//     .join('')
//   return hashHex
// }

import { SHA256 } from 'crypto-js'

export function calculateSHA256FromString(text: string): string {
  const hash = SHA256(text)
  return hash.toString()
}
