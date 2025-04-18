import CryptoJS from 'crypto-js'

export function md5(str: string) {
  return CryptoJS.MD5(str).toString()
}
