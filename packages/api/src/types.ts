import { Author, Creation, CreationTag, Mold, User } from '@penx/db/client'

export type CreationById = Creation & {
  creationTags: CreationTag[]
  mold: Mold
  authors: Array<
    Author & {
      user: User
    }
  >
}
