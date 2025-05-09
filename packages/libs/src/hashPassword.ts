import { genSaltSync, hashSync } from 'bcrypt-edge'

export async function hashPassword(password: string) {
  const salt = genSaltSync(10)
  return hashSync(password, salt)
}
