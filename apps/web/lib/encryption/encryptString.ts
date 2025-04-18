import CryptoJS from 'crypto-js'

export function encryptString(plainText: string, secretKey: string) {
  const key = CryptoJS.enc.Utf8.parse(secretKey)
  // random IV
  const iv = CryptoJS.lib.WordArray.random(16)
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plainText),
    key,
    {
      iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.Pkcs7,
    },
  )

  return iv.toString() + encrypted.toString()
}
