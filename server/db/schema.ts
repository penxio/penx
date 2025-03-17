// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from 'drizzle-orm'
import {
  index,
  int,
  integer,
  primaryKey,
  sqliteTable as table,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import * as t from 'drizzle-orm/sqlite-core'
import { v4 } from 'uuid'
import {
  CommentStatus,
  GateType,
  PostStatus,
  PostType,
  UserRole,
} from '@/lib/types'

export const sites = table('site', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => v4()),
  name: text('name', { length: 100 }).notNull(),
  description: text('description', { length: 500 }).default(''),
  about: text('about').default(''),
  spaceId: text('spaceId', { length: 50 }),
  logo: text('logo', { length: 2183 }).default(''),
  font: text('font', { length: 50 }).default('font-cal'),
  image: text('image', { length: 2183 }).default(''),
  email: text('email', { length: 255 }).unique(),
  socials: text('socials', { mode: 'json' }),
  analytics: text('analytics', { mode: 'json' }),
  config: text('config', { mode: 'json' }),
  navLinks: text('navLinks', { mode: 'json' }),
  catalogue: text('catalogue', { mode: 'json' }),
  newsletterConfig: text('newsletterConfig', { mode: 'json' }),
  notificationConfig: text('notificationConfig', { mode: 'json' }),
  themeName: text('themeName', { length: 50 }),
  themeConfig: text('themeConfig', { mode: 'json' }),
  aiProviders: text('aiProviders', { mode: 'json' }),
  repo: text('repo', { length: 100 }).default(''),
  installationId: integer('installationId').default(0),
  memberCount: integer('memberCount').default(0),
  postCount: integer('postCount').default(0),
  pageCount: integer('pageCount').default(0),
  databaseCount: integer('databaseCount').default(0),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

export const users = table('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => v4()),
  role: text('role').notNull().default(UserRole.READER),
  name: text('name', { length: 255 }).notNull().default(''),
  displayName: text('displayName', { length: 255 }).default(''),
  ensName: text('ensName', { length: 255 }),
  email: text('email', { length: 255 }).unique(),
  emailVerifiedAt: integer('emailVerifiedAt', { mode: 'timestamp' }),
  github: text('github', { mode: 'json' }), // GitHub OAuth info
  google: text('google', { mode: 'json' }), // Google OAuth info
  image: text('image', { length: 2183 }),
  cover: text('cover', { length: 2183 }),
  bio: text('bio', { length: 5000 }).default(''),
  about: text('about').default(''),
  subscriptions: text('subscriptions'),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  posts: many(posts),
  comments: many(comments),
  tags: many(tags),
  accessTokens: many(accessTokens),
}))

export const accounts = table(
  'account',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    providerType: text('providerType', { length: 40 }),
    providerAccountId: text('providerAccountId', { length: 255 })
      .unique()
      .default(''),
    providerInfo: text('providerInfo', { mode: 'json' }),
    email: text('email', { length: 255 }),
    accessToken: text('accessToken', { length: 255 }),
    refreshToken: text('refreshToken', { length: 255 }),
    expiresAt: integer('expiresAt', { mode: 'timestamp' }),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('account_user_id_idx').on(table.userId),
    }
  },
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [accounts.userId] }),
}))

export const posts = table(
  'post',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    slug: text('slug')
      .unique()
      .notNull()
      .$defaultFn(() => v4()),
    title: text('title', { length: 500 }).default(''),
    description: text('description', { length: 1000 }).default(''),
    icon: text('image', { length: 2183 }).default(''),
    image: text('image', { length: 2183 }).default(''),
    content: text('content').notNull().default(''),
    i18n: text('i18n', { mode: 'json' }),
    cid: text('cid', { length: 100 }).default(''),
    creationId: integer('creationId'),
    type: text('type').default(PostType.ARTICLE),
    gateType: text('gateType').default(GateType.FREE),
    status: text('status').default(PostStatus.DRAFT),
    commentStatus: text('commentStatus').default(CommentStatus.OPEN),
    commentCount: integer('commentCount').default(0),
    featured: integer('featured', { mode: 'boolean' }).default(false),
    collectible: integer('collectible', { mode: 'boolean' }).default(false),
    delivered: integer('delivered', { mode: 'boolean' }).default(false),
    isPopular: integer('isPopular', { mode: 'boolean' }).default(false),
    isJournal: integer('isJournal', { mode: 'boolean' }).default(false),
    isPage: integer('isPage', { mode: 'boolean' }).default(false),
    date: text('date', { length: 100 }).default(''),
    publishedAt: integer('publishedAt', { mode: 'timestamp' }),
    archivedAt: integer('archivedAt', { mode: 'timestamp' }),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('posts_user_id_idx').on(table.userId),
      typeIndex: t.index('posts_type_idx').on(table.type),
      getTypeIndex: t.index('posts_gate_type_idx').on(table.gateType),
      userId_status: t
        .index('posts_user_id_post_status')
        .on(table.userId, table.status),
      userId_type: t.index('posts_user_id_type').on(table.userId, table.type),
    }
  },
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [posts.userId] }),
  comments: many(comments),
  authors: many(authors),
  postTags: many(postTags),
}))

export const authors = table(
  'author',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    postId: text('postId').notNull(),
    userId: text('userId').notNull(),
  },
  (table) => {
    return {
      userIdIndex: t.index('authors_user_id_idx').on(table.userId),
      postIdIndex: t.index('authors_post_id_idx').on(table.postId),
    }
  },
)

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [authors.userId] }),
  post: one(posts, { references: [posts.id], fields: [authors.userId] }),
}))

export const comments = table(
  'comment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    content: text('content').default(''),
    parentId: text('parentId').default(''),
    replyCount: integer('replyCount').notNull().default(0),
    postId: text('postId').notNull(),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('comments_user_id_idx').on(table.userId),
      postIdIndex: t.index('comments_post_id_idx').on(table.postId),
    }
  },
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [comments.userId] }),
  post: one(posts, { references: [posts.id], fields: [comments.userId] }),
  parent: one(comments, {
    references: [comments.id],
    fields: [comments.parentId],
  }),
  // replies: many(comments),
}))

export const tags = table(
  'tag',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    name: text('name', { length: 50 }).notNull().default(''),
    color: text('color', { length: 50 }).default(''),
    postCount: integer('postCount').default(0),
    hidden: integer('hidden', { mode: 'boolean' }).default(false),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      nameIndex: t.index('tags_name_idx').on(table.name),
      hiddenIndex: t.index('tags_hidden_idx').on(table.hidden),
    }
  },
)

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [tags.userId] }),
  postTags: many(postTags),
}))

export const postTags = table(
  'post_tag',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    postId: text('postId').notNull(),
    tagId: text('tagId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      postIdIndex: t.index('postTags_post_id_idx').on(table.postId),
    }
  },
)

export const postTagsRelations = relations(postTags, ({ one, many }) => ({
  post: one(posts, { references: [posts.id], fields: [postTags.postId] }),
  tag: one(tags, { references: [tags.id], fields: [postTags.tagId] }),
}))

export const accessTokens = table(
  'access_token',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    token: text('token', { length: 255 }).default(''),
    alias: text('alias', { length: 50 }),
    expiresAt: integer('expiresAt', { mode: 'timestamp' }),
    lastUsedAt: integer('lastUsedAt', { mode: 'timestamp' }),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },

  (table) => {
    return {
      userIdIndex: t.index('accessTokens_user_id_idx').on(table.userId),
    }
  },
)

export const accessTokensRelations = relations(
  accessTokens,
  ({ one, many }) => ({
    user: one(users, { references: [users.id], fields: [accessTokens.userId] }),
  }),
)

export const assets = table(
  'asset',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    url: text('url').unique().notNull(),
    filename: text('title', { length: 1000 }).default(''),
    title: text('title', { length: 1000 }).default(''),
    description: text('description').default(''),
    contentType: text('contentType').notNull(),
    isPublic: integer('isPublic', { mode: 'boolean' }).default(false),
    isTrashed: integer('isTrashed', { mode: 'boolean' }).default(false),
    size: integer('size').default(0),
    userId: text('userId').notNull(),
    sharingConfig: text('sharingConfig', { mode: 'json' }),
    props: text('props', { mode: 'json' }),
    createdAt: integer('createdAt', { mode: 'timestamp' }),
    uploadedAt: integer('uploadedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('assets_user_id_idx').on(table.userId),
      contentTypeIndex: t
        .index('assets_content_type_idx')
        .on(table.contentType),
    }
  },
)

export const assetsRelations = relations(assets, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [assets.userId] }),
  assetLabels: many(assetLabels),
  assetAlbums: many(assetAlbums),
}))

export const labels = table(
  'label',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    name: text('name', { length: 50 }).notNull().default(''),
    color: text('color', { length: 50 }).default(''),
    assetCount: integer('assetCount').default(0),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      nameIndex: t.index('labels_name_idx').on(table.name),
    }
  },
)

export const labelsRelations = relations(labels, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [labels.userId] }),
  assetLabels: many(assetLabels),
}))

export const assetLabels = table(
  'asset_label',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    assetId: text('assetId').notNull(),
    labelId: text('labelId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      assetIdIndex: t.index('assetLabels_asset_id_idx').on(table.assetId),
    }
  },
)

export const assetLabelsRelations = relations(assetLabels, ({ one, many }) => ({
  asset: one(assets, {
    references: [assets.id],
    fields: [assetLabels.assetId],
  }),
  label: one(labels, {
    references: [labels.id],
    fields: [assetLabels.labelId],
  }),
}))

export const albums = table(
  'album',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    name: text('name', { length: 100 }).notNull().default(''),
    assetCount: integer('assetCount').default(0),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      nameIndex: t.index('albums_name_idx').on(table.name),
    }
  },
)

export const albumsRelations = relations(albums, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [albums.userId] }),
  assetAlbums: many(assetAlbums),
}))

export const assetAlbums = table(
  'asset_album',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    assetId: text('assetId').notNull(),
    albumsId: text('labelId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      assetIdIndex: t.index('assetAlbums_asset_id_idx').on(table.assetId),
    }
  },
)

export const assetAlbumsRelations = relations(assetAlbums, ({ one, many }) => ({
  asset: one(assets, {
    references: [assets.id],
    fields: [assetAlbums.assetId],
  }),
  album: one(albums, {
    references: [albums.id],
    fields: [assetAlbums.assetId],
  }),
}))

export const databases = table(
  'database',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    userId: text('userId').notNull(),
    parentId: text('parentId'),
    parentType: text('parentType'),
    activeViewId: text('activeViewId'),
    viewIds: text('viewIds', { mode: 'json' }),
    name: text('name'),
    color: text('color'),
    cover: text('cover', { length: 2183 }).default(''),
    icon: text('icon'),
    trashed: integer('trashed', { mode: 'boolean' }).default(false),
    props: text('props', { mode: 'json' }),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdIndex: t.index('databases_user_id_idx').on(table.userId),
    }
  },
)

export const databasesRelations = relations(databases, ({ one, many }) => ({
  user: one(users, { references: [users.id], fields: [databases.userId] }),
  views: many(views),
  fields: many(fields),
  records: many(records),
}))

export const fields = table(
  'field',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    databaseId: text('databaseId').notNull(),
    isPrimary: integer('isPrimary', { mode: 'boolean' }).default(false),
    name: text('name')
      .notNull()
      .$defaultFn(() => v4()),
    displayName: text('displayName'),
    description: text('description'),
    fieldType: text('fieldType'),
    config: text('config', { mode: 'json' }),
    options: text('options', { mode: 'json' }),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      databaseIdIndex: t.index('fields_database_id_idx').on(table.databaseId),
      fieldTypeIndex: t.index('fields_field_type_idx').on(table.fieldType),
    }
  },
)

export const fieldsRelations = relations(fields, ({ one }) => ({
  database: one(databases, {
    references: [databases.id],
    fields: [fields.databaseId],
  }),
}))

export const records = table(
  'record',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    databaseId: text('databaseId').notNull(),
    sort: integer('sort').default(0),
    fields: text('fields', { mode: 'json' }),
    deletedAt: integer('deletedAt', { mode: 'timestamp' }),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      databaseIdIndex: t.index('records_database_id_idx').on(table.databaseId),
    }
  },
)

export const recordsRelations = relations(records, ({ one }) => ({
  database: one(databases, {
    references: [databases.id],
    fields: [records.databaseId],
  }),
}))

export const views = table(
  'view',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => v4()),
    databaseId: text('databaseId').notNull(),
    name: text('name'),
    description: text('description'),
    viewType: text('viewType'),
    viewFields: text('viewFields', { mode: 'json' }),
    sorts: text('sorts', { mode: 'json' }),
    groups: text('groups', { mode: 'json' }),
    filters: text('filters', { mode: 'json' }),
    kanbanFieldId: text('kanbanFieldId'), // fieldId for kanban
    kanbanOptionIds: text('kanbanOptionIds', { mode: 'json' }), // for kanban sorts
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      databaseIdIndex: t.index('views_database_id_idx').on(table.databaseId),
    }
  },
)

export const viewsRelations = relations(views, ({ one }) => ({
  database: one(databases, {
    references: [databases.id],
    fields: [views.databaseId],
  }),
}))

export type Site = typeof sites.$inferSelect
export type Post = typeof posts.$inferSelect
export type User = typeof users.$inferSelect
export type Account = typeof accounts.$inferSelect
export type Comment = typeof comments.$inferSelect
export type Tag = typeof tags.$inferSelect
export type PostTag = typeof postTags.$inferSelect
export type AccessToken = typeof accessTokens.$inferSelect
export type Asset = typeof assets.$inferSelect
export type Label = typeof labels.$inferSelect
export type Album = typeof albums.$inferSelect
export type AssetLabel = typeof assetLabels.$inferSelect
export type AssetAlbum = typeof assetAlbums.$inferSelect

export type Database = typeof databases.$inferSelect
export type Field = typeof fields.$inferSelect
export type Record = typeof records.$inferSelect
export type View = typeof views.$inferSelect
