import { Author, Creation, CreationTag, Mold, User } from '@prisma/client'

export type CreationById = Creation & {
  creationTags: CreationTag[]
  mold: Mold
  authors: Array<
    Author & {
      user: User
    }
  >
}
