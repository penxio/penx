import { Author, Creation, CreationTag, Struct, User } from '@penx/db/client'

export type CreationById = Creation & {
  creationTags: CreationTag[]
  struct: Struct
  authors: Array<
    Author & {
      user: User
    }
  >
}
