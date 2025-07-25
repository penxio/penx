import { api } from '@penx/api'
import { getMnemonicFromLocal, setMnemonicToLocal } from '@penx/mnemonic'
import { SessionData } from '@penx/types'

export async function checkMnemonic(session: SessionData): Promise<string> {
  const mnemonic = await getMnemonicFromLocal(session.userId)
  if (mnemonic) return mnemonic
  const info = await api.getMnemonicInfo()

  if (info.mnemonic) {
    await setMnemonicToLocal(session.userId, info.mnemonic)
  } else {
    if (info.encryptedMnemonic) {
      throw new Error('DECRYPT_MNEMONIC_NEEDED')
    }
    throw new Error('No Mnemonic')
  }

  return info.mnemonic
}
