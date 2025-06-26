import { generateMnemonic, mnemonicToSeed, mnemonicToSeedSync } from 'bip39'
import { decrypt, encrypt } from 'eciesjs'
import { privateToPublic } from 'ethereumjs-util'
import hdkey from 'hdkey'
import { get, set } from 'idb-keyval'
import {
  calculateSHA256FromString,
  decryptString,
  encryptString,
} from '@penx/encryption'

export async function getNewMnemonic() {
  const mnemonic = generateMnemonic()
  return mnemonic
}

export async function setMnemonicToLocal(siteId: string, mnemonic: string) {
  const key = calculateSHA256FromString(siteId)
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
  const seed = mnemonicToSeedSync(mnemonic)
  const root = hdkey.fromMasterSeed(seed)
  const publicKey = privateToPublic(root.privateKey!).toString('hex')
  return publicKey
}

export function encryptByPublicKey(plainText: string, publicKey: string) {
  const data = Buffer.from(plainText)
  const encrypted = encrypt(publicKey, data)
  const base64String = encrypted.toString('base64')
  return base64String
}

export function decryptByMnemonic(base64String: string, mnemonic: string) {
  const buffer = base64ToBuffer(base64String)
  const seed = mnemonicToSeedSync(mnemonic)
  const root = hdkey.fromMasterSeed(seed)
  const privateKey = root.privateKey!.toString('hex')
  return decrypt(privateKey, buffer).toString()
}

function base64ToBuffer(data: string) {
  const binaryData = atob(data)
  const arrayBuffer = new ArrayBuffer(binaryData.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i)
  }

  const buffer = Buffer.from(uint8Array)
  return buffer
}
