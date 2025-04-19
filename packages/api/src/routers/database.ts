import { getRandomColorName } from '@penx/libs/color-helper'
import {
  FRIEND_DATABASE_NAME,
  PENX_LOGO_URL,
  PENX_URL,
  PROJECT_DATABASE_NAME,
} from '@penx/constants'
import { prisma } from '@penx/db'
import { ColumnType, Option, ViewColumn, ViewType } from '@/lib/types'
import { uniqueId } from '@penx/unique-id'
import { TRPCError } from '@trpc/server'
import { arrayMoveImmutable } from 'array-move'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { fixRowSort } from '../lib/fixRowSort'
import { getDatabaseData } from '../lib/getDatabaseData'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const databaseRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.database.findMany({
        where: {
          siteId: input.siteId,
        },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      })
    }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return prisma.database.findFirstOrThrow({
      include: {
        views: true,
        columns: true,
        records: {
          orderBy: {
            sort: 'asc',
          },
        },
      },
      where: { id: input },
    })
  }),

  getProjects: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getDatabaseData({
        siteId: input.siteId,
        slug: PROJECT_DATABASE_NAME,
      })
    }),

  getFriends: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getDatabaseData({
        siteId: input.siteId,
        slug: FRIEND_DATABASE_NAME,
      })
    }),

  bySlug: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return prisma.database.findFirstOrThrow({
      include: {
        views: true,
        columns: true,
        records: {
          orderBy: {
            sort: 'asc',
          },
        },
      },
      where: {
        id: input,
        siteId: ctx.activeSiteId,
      },
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // throw new TRPCError({
      //   code: 'BAD_REQUEST',
      //   message: 'You have reached the free plan post limit.',
      // })
      // }

      return prisma.$transaction(
        async (tx) => {
          const newDatabase = await tx.database.create({
            data: {
              ...input,
              userId: ctx.token.uid,
              color: getRandomColorName(),
            },
          })

          const firstColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.TEXT,
              name: uniqueId(),
              displayName: 'Title',
              isPrimary: true,
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const secondColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.SINGLE_SELECT,
              name: uniqueId(),
              displayName: 'Tag',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const newColumns = [firstColumn, secondColumn]

          const viewColumns = newColumns.map((column) => ({
            columnId: column.id,
            width: 160,
            visible: true,
          }))

          const tableView = await tx.view.create({
            data: {
              databaseId: newDatabase.id,
              name: 'Table',
              viewType: ViewType.TABLE,
              viewColumns,
              sorts: [],
              filters: [],
              groups: [],
              kanbanOptionIds: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const listView = await tx.view.create({
            data: {
              databaseId: newDatabase.id,
              name: 'Gallery',
              viewType: ViewType.GALLERY,
              viewColumns,
              sorts: [],
              filters: [],
              groups: [],
              kanbanOptionIds: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          await tx.database.update({
            where: { id: newDatabase.id },
            data: {
              activeViewId: tableView.id,
              viewIds: [tableView.id, listView.id],
            },
          })

          const recordColumns = newColumns.reduce(
            (acc, column) => {
              return {
                ...acc,
                [column.id]: '',
              }
            },
            {} as Record<string, any>,
          )

          await tx.record.createMany({
            data: [
              {
                databaseId: newDatabase.id,
                sort: 0,
                columns: recordColumns,
                siteId: input.siteId,
                userId: ctx.token.uid,
              },
              {
                databaseId: newDatabase.id,
                sort: 1,
                columns: recordColumns,
                siteId: input.siteId,
                userId: ctx.token.uid,
              },
            ],
          })

          return newDatabase
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),

  addRecord: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        siteId: z.string(),
        databaseId: z.string(),
        columns: z.record(z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const records = await fixRowSort(input.databaseId)

      await prisma.record.create({
        data: {
          userId: ctx.token.uid,
          ...input,
          columns: input.columns as any,
          sort: records.length,
        },
      })
      return true
    }),

  addRefBlockRecord: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        databaseId: z.string(),
        refBlockId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const columnList = await prisma.column.findMany({
        where: { databaseId: input.databaseId },
      })

      const count = await prisma.column.count({
        where: { databaseId: input.databaseId },
      })

      const newColumns = columnList.reduce(
        (acc, column) => {
          return {
            ...acc,
            [column.id]: column.isPrimary
              ? { refType: 'BLOCK', id: input.refBlockId }
              : '',
          }
        },
        {} as Record<string, any>,
      )

      const record = await prisma.record.create({
        data: {
          userId: ctx.token.uid,
          siteId: input.siteId,
          databaseId: input.databaseId,
          sort: count + 1,
          columns: newColumns,
        },
      })

      return record
    }),

  addColumn: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        siteId: z.string(),
        databaseId: z.string(),
        columnType: z.string(),
        name: z.string(),
        displayName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const column = await tx.column.create({
            data: {
              ...input,
              options: [],
              config: {},
              userId: ctx.token.uid,
            },
          })

          const viewList = await tx.view.findMany({
            where: { databaseId: input.databaseId },
          })

          for (const view of viewList) {
            await tx.view.update({
              where: { id: view.id },
              data: {
                viewColumns: [
                  ...(view.viewColumns as any),
                  {
                    columnId: column.id,
                    width: 160,
                    visible: true,
                  },
                ],
              },
            })
          }

          const recordList = await tx.record.findMany({
            where: { databaseId: input.databaseId },
          })

          for (const record of recordList) {
            await tx.record.update({
              where: { id: record.id },
              data: {
                columns: {
                  ...(record.columns as any),
                  [column.id]: '',
                },
              },
            })
          }

          return true
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),

  updateColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        name: z.string().optional(),
        displayName: z.string().optional(),
        columnType: z.string().optional(),
        options: z.array(z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: handle options
      const { columnId, options, ...rest } = input
      const column = await prisma.column.update({
        where: { id: columnId },
        data: rest,
      })

      const { slug } = await prisma.database.findUniqueOrThrow({
        where: { id: column.databaseId },
        select: { slug: true },
      })

      const siteId = ctx.activeSiteId
      if (slug === PROJECT_DATABASE_NAME) {
        revalidateTag(`${siteId}-projects`)
      }

      if (slug === FRIEND_DATABASE_NAME) {
        revalidateTag(`${siteId}-friends`)
      }
      return true
    }),

  sortViewColumns: protectedProcedure
    .input(
      z.object({
        viewId: z.string(),
        fromIndex: z.number(),
        toIndex: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await prisma.view.findUniqueOrThrow({
        where: { id: input.viewId },
      })

      await prisma.view.update({
        where: { id: input.viewId },
        data: {
          viewColumns: arrayMoveImmutable(
            view?.viewColumns as any as ViewColumn[],
            input.fromIndex,
            input.toIndex,
          ) as any,
        },
      })

      return true
    }),

  updateRecord: protectedProcedure
    .input(
      z.object({
        recordId: z.string(),
        columns: z.record(z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const record = await prisma.record.update({
        where: { id: input.recordId },
        data: { columns: input.columns as any },
      })

      const { slug } = await prisma.database.findUniqueOrThrow({
        where: { id: record.databaseId },
        select: { slug: true },
      })

      const siteId = ctx.activeSiteId
      if (slug === PROJECT_DATABASE_NAME) {
        revalidateTag(`${siteId}-projects`)
      }

      if (slug === FRIEND_DATABASE_NAME) {
        revalidateTag(`${siteId}-friends`)
      }

      return true
    }),

  deleteColumn: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
        columnId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [viewList, recordList] = await Promise.all([
        prisma.view.findMany({
          where: { databaseId: input.databaseId },
        }),
        prisma.record.findMany({
          where: { databaseId: input.databaseId },
        }),

        prisma.column.delete({
          where: { id: input.columnId },
        }),
      ])

      for (const view of viewList) {
        const viewColumns = view.viewColumns as any as ViewColumn[]

        await prisma.view.update({
          where: { id: view.id },
          data: {
            viewColumns: viewColumns.filter(
              (i) => i.columnId !== input.columnId,
            ) as any,
          },
        })
      }

      for (const record of recordList) {
        const columns = record.columns as Record<string, any>
        delete columns[input.columnId]

        await prisma.record.update({
          where: { id: record.id },
          data: { columns },
        })
      }

      return true
    }),
  deleteRecord: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
        recordId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const records = await fixRowSort(input.databaseId)
      const record = await prisma.record.delete({
        where: {
          id: input.recordId,
        },
      })

      for (const item of records) {
        if (item.sort > record.sort) {
          await prisma.record.update({
            where: { id: item.id },
            data: { sort: item.sort - 1 },
          })
        }
      }

      const { slug } = await prisma.database.findUniqueOrThrow({
        where: { id: record.databaseId },
        select: { slug: true },
      })

      const siteId = ctx.activeSiteId
      if (slug === PROJECT_DATABASE_NAME) {
        revalidateTag(`${siteId}-projects`)
      }

      if (slug === FRIEND_DATABASE_NAME) {
        revalidateTag(`${siteId}-friends`)
      }
      return true
    }),

  updateViewColumn: protectedProcedure
    .input(
      z.object({
        viewId: z.string(),
        columnId: z.string(),
        width: z.number().optional(),
        visible: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await prisma.view.findUniqueOrThrow({
        where: { id: input.viewId },
      })

      const viewColumns = view!.viewColumns as any as ViewColumn[]

      for (const viewColumn of viewColumns) {
        if (viewColumn.columnId === input.columnId) {
          if (input.width) viewColumn.width = input.width
          if (typeof input.visible === 'boolean') {
            viewColumn.visible = input.visible
          }
        }
      }

      await prisma.view.update({
        where: { id: input.viewId },
        data: { viewColumns: viewColumns as any },
      })

      return true
    }),

  addOption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        columnId: z.string(),
        name: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const column = await prisma.column.findUniqueOrThrow({
        where: { id: input.columnId },
      })

      const options = (column?.options as any as Option[]) || []

      await prisma.column.update({
        where: { id: input.columnId },
        data: {
          options: [...options, input],
        },
      })

      return true
    }),

  updateDatabase: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
        name: z.string().optional(),
        color: z.string().optional(),
        cover: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { databaseId, ...rest } = input
      await prisma.database.update({
        where: { id: databaseId },
        data: rest,
      })
      return true
    }),

  deleteDatabase: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await prisma.record.deleteMany({
        where: { databaseId: input },
      })
      await prisma.column.deleteMany({
        where: { databaseId: input },
      })
      await prisma.view.deleteMany({
        where: { databaseId: input },
      })
      await prisma.database.delete({
        where: { id: input },
      })
      return true
    }),

  getOrCreateProjectsDatabase: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const projectsDatabase = await tx.database.findFirst({
            include: {
              views: true,
              columns: true,
              records: {
                orderBy: {
                  sort: 'asc',
                },
              },
            },
            where: {
              siteId: input.siteId,
              slug: PROJECT_DATABASE_NAME,
            },
          })

          if (projectsDatabase) return projectsDatabase

          const newDatabase = await tx.database.create({
            data: {
              siteId: input.siteId,
              userId: ctx.token.uid,
              name: 'Project',
              slug: PROJECT_DATABASE_NAME,
              color: getRandomColorName(),
            },
          })

          const nameColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.TEXT,
              displayName: 'Name',
              name: 'name',
              isPrimary: true,
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const introductionColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.TEXT,
              name: 'introduction',
              displayName: 'Introduction',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const iconColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.IMAGE,
              name: 'icon',
              displayName: 'Icon',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const coverColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.IMAGE,
              name: 'cover',
              displayName: 'Cover',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const urlColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.URL,
              name: 'url',
              displayName: 'URL',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const newColumns = [
            nameColumn,
            introductionColumn,
            iconColumn,
            coverColumn,
            urlColumn,
          ]

          const viewColumns = newColumns.map((column) => ({
            columnId: column.id,
            width: 160,
            visible: true,
          }))

          const tableView = await tx.view.create({
            data: {
              databaseId: newDatabase.id,
              name: 'Table',
              viewType: ViewType.TABLE,
              viewColumns,
              sorts: [],
              filters: [],
              groups: [],
              kanbanOptionIds: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          await tx.database.update({
            where: { id: newDatabase.id },
            data: {
              activeViewId: tableView.id,
              viewIds: [tableView.id],
            },
          })

          const recordColumns = newColumns.reduce(
            (acc, column, index) => {
              let value = ''
              if (index === 0) value = 'PenX'
              if (index === 1) value = 'modern dynamic blogging tools'
              if (index === 2) value = PENX_LOGO_URL
              if (index === 3) value = PENX_LOGO_URL
              if (index === 4) value = PENX_URL
              return {
                ...acc,
                [column.id]: value,
              }
            },
            {} as Record<string, any>,
          )

          await tx.record.createMany({
            data: [
              {
                databaseId: newDatabase.id,
                sort: 0,
                columns: recordColumns,
                siteId: input.siteId,
                userId: ctx.token.uid,
              },
            ],
          })

          return tx.database.findUniqueOrThrow({
            include: {
              views: true,
              columns: true,
              records: {
                orderBy: {
                  sort: 'asc',
                },
              },
            },
            where: { id: newDatabase.id },
          })
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),

  getOrCreateFriendsDatabase: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const friendsDatabase = await tx.database.findFirst({
            include: {
              views: true,
              columns: true,
              records: {
                orderBy: {
                  sort: 'asc',
                },
              },
            },
            where: {
              siteId: input.siteId,
              slug: FRIEND_DATABASE_NAME,
            },
          })

          if (friendsDatabase) return friendsDatabase

          const newDatabase = await tx.database.create({
            data: {
              siteId: input.siteId,
              userId: ctx.token.uid,
              name: 'Friend',
              slug: FRIEND_DATABASE_NAME,
              color: getRandomColorName(),
            },
          })

          const nameColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.TEXT,
              displayName: 'Name',
              name: 'name',
              isPrimary: true,
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const introductionColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.TEXT,
              name: 'introduction',
              displayName: 'Introduction',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const iconColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.IMAGE,
              name: 'avatar',
              displayName: 'Avatar',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const urlColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.URL,
              name: 'url',
              displayName: 'URL',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const statusColumn = await tx.column.create({
            data: {
              databaseId: newDatabase.id,
              columnType: ColumnType.SINGLE_SELECT,
              name: 'status',
              displayName: 'Status',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const approvedId = uniqueId()
          const options = [
            {
              id: uniqueId(),
              columnId: statusColumn.id,
              name: 'pending',
              color: getRandomColorName(),
            },
            {
              id: uniqueId(),
              columnId: statusColumn.id,
              name: 'rejected',
              color: getRandomColorName(),
            },
            {
              id: approvedId,
              columnId: statusColumn.id,
              name: 'approved',
              color: getRandomColorName(),
            },
          ]

          await tx.column.update({
            where: { id: statusColumn.id },
            data: { options },
          })

          const newColumns = [
            nameColumn,
            introductionColumn,
            iconColumn,
            urlColumn,
            statusColumn,
          ]

          const viewColumns = newColumns.map((column) => ({
            columnId: column.id,
            width: 160,
            visible: true,
          }))

          const tableView = await tx.view.create({
            data: {
              databaseId: newDatabase.id,
              name: 'Table',
              viewType: ViewType.TABLE,
              viewColumns,
              sorts: [],
              filters: [],
              groups: [],
              kanbanOptionIds: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          await tx.database.update({
            where: { id: newDatabase.id },
            data: {
              activeViewId: tableView.id,
              viewIds: [tableView.id],
            },
          })

          const recordColumns = newColumns.reduce(
            (acc, column, index) => {
              let value: any = ''
              if (index === 0) value = 'Zio'
              if (index === 1) value = 'Creator of PenX'
              if (index === 2) value = PENX_LOGO_URL
              if (index === 3) value = 'https://zio.penx.io'
              if (index === 4) value = [approvedId]
              return {
                ...acc,
                [column.id]: value,
              }
            },
            {} as Record<string, any>,
          )

          await tx.record.createMany({
            data: [
              {
                databaseId: newDatabase.id,
                sort: 0,
                columns: recordColumns,
                siteId: input.siteId,
                userId: ctx.token.uid,
              },
            ],
          })

          return tx.database.findUniqueOrThrow({
            include: {
              views: true,
              columns: true,
              records: {
                orderBy: {
                  sort: 'asc',
                },
              },
            },
            where: { id: newDatabase.id },
          })
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),
})
