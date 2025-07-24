import * as bip32 from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import { wordlists } from 'bip39'
import {
  generateMnemonic as generateMnemonic_,
  privateKeyToAccount,
} from 'viem/accounts'

const ETH_DERIVATION_PATH = "m/44'/60'/0'/0/0"

export function generateMnemonic() {
  const englishWordlist = wordlists.english
  const mnemonic = generateMnemonic_(englishWordlist, 128)
  return mnemonic
}

function parseDerivationPath(path: string): number[] {
  const segments = path
    .split('/')
    .slice(1)
    .map((segment) => {
      let hardened = false
      if (segment.endsWith("'")) {
        hardened = true
        segment = segment.slice(0, -1)
      }
      let index = parseInt(segment)
      if (isNaN(index)) throw new Error('Invalid derivation path segment')
      if (hardened) index += 0x80000000
      return index
    })
  return segments
}

export function getPrivateKeyFromMnemonic(
  mnemonic: string,
  path = ETH_DERIVATION_PATH,
): string {
  const seed = mnemonicToSeedSync(mnemonic)

  let node = bip32.HDKey.fromMasterSeed(seed)

  const segments = parseDerivationPath(path)

  for (const index of segments) {
    node = node.deriveChild(index)
  }

  if (!node.privateKey) throw new Error('Private key not found')

  return '0x' + bytesToHex(new Uint8Array(node.privateKey))
}

export function getPublicKeyFromMnemonic(
  mnemonic: string,
  path = ETH_DERIVATION_PATH,
): string {
  const seed = mnemonicToSeedSync(mnemonic)

  let node = bip32.HDKey.fromMasterSeed(seed)

  const segments = parseDerivationPath(path)
  for (const index of segments) {
    node = node.deriveChild(index)
  }

  if (!node.publicKey) throw new Error('Public key not found')

  return '0x' + bytesToHex(new Uint8Array(node.publicKey))
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// async function main() {
//   const englishWordlist = wordlists.english
//   const mnemonic = generateMnemonic_(englishWordlist, 128)
//   console.log('mnemonic:', mnemonic)

//   const privateKey = getPrivateKeyFromMnemonic(mnemonic)
//   console.log('privateKey:', privateKey)

//   const publicKey = getPublicKeyFromMnemonic(mnemonic)
//   console.log('publicKey:', publicKey)

//   const account = privateKeyToAccount(privateKey as any)
//   console.log('account.address:', account.address)
// }

// main().catch(console.error)
