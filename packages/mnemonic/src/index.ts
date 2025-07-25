import { decrypt, encrypt } from 'eciesjs'
import { get, set } from 'idb-keyval'
import { privateKeyToAccount } from 'viem/accounts'
import {
  calculateSHA256FromString,
  decryptString,
  encryptString,
} from '@penx/encryption'
import {
  generateMnemonic,
  getPrivateKeyFromMnemonic,
  getPublicKeyFromMnemonic,
} from './mnemonic'

export async function getNewMnemonic() {
  const mnemonic = generateMnemonic()
  return mnemonic
}

export async function setMnemonicToLocal(userId: string, mnemonic: string) {
  const key = calculateSHA256FromString(userId)
  const encryptedMnemonic = encryptString(mnemonic, key)
  await set(key, encryptedMnemonic)
  return mnemonic
}

export async function getMnemonicFromLocal(userId: string) {
  try {
    const key = calculateSHA256FromString(userId)
    const encryptedMnemonic = await get(key)
    if (!encryptedMnemonic) return ''
    const mnemonic = decryptString(encryptedMnemonic, key)
    return mnemonic
  } catch (error) {
    return ''
  }
}

export function getPublicKey(mnemonic: string) {
  return getPublicKeyFromMnemonic(mnemonic)
}

export function getPrivateKey(mnemonic: string) {
  return getPrivateKeyFromMnemonic(mnemonic)
}

export function getAddress(mnemonic: string) {
  const privateKey = getPrivateKeyFromMnemonic(mnemonic)
  const account = privateKeyToAccount(privateKey as any)
  return account.address
}

export function encryptByPublicKey(plainText: string, publicKey: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plainText)
  const encrypted = encrypt(publicKey, data)
  return uint8ArrayToBase64(encrypted as any)
}

export function decryptByMnemonic(base64String: string, mnemonic: string) {
  const encryptedData = base64ToUint8Array(base64String)
  const privateKey = getPrivateKeyFromMnemonic(mnemonic)
  const decrypted = decrypt(privateKey, encryptedData)
  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryStr = atob(base64)
  const len = binaryStr.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
