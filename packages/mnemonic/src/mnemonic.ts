
import * as bip32 from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import { wordlists } from 'bip39'
import {
  generateMnemonic as generateMnemonic_,
  privateKeyToAccount,
} from 'viem/accounts'

const ETH_DERIVATION_PATH = "m/44'/60'/0'/0/0"

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

function getPrivateKeyFromMnemonic(
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

  return '0x' + Buffer.from(node.privateKey).toString('hex')
}

// async function main() {
//   const englishWordlist = wordlists.english
//   const mnemonic = generateMnemonic_(englishWordlist, 128)
//   console.log('助记词:', mnemonic)

//   const privateKey = getPrivateKeyFromMnemonic(mnemonic)
//   console.log('私钥:', privateKey)

//   const account = privateKeyToAccount(privateKey as any)
//   console.log('地址:', account.address)
// }

// main().catch(console.error)
