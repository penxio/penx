
const { v4 } = require('uuid')
const { PrismaClient } = require('@penx/db/client')
const prisma = new PrismaClient()

function uniqueId() {
  return v4()
}


const editorDefaultValue = [
  {
    type: 'p',
    children: [{ text: '' }],
  },
]

async function seed() {
  try {
    const sites = await prisma.site.findMany({
      include: {
        molds: true,
      },
    })
    // console.log('=========>>>>>>>sites:', sites[1])

    for (const site of sites) {
      const posts = await prisma.creation.findMany({
        where: {
          siteId: site.id,
        },
        include: { mold: true }
      })

      for (const post of posts) {
        console.log('=========>>>>>>>post:', post.id);

        const mold = post.mold ? post.mold : site.molds.find((mold) => mold.type === 'ARTICLE')
        await prisma.creation.update({
          where: { id: post.id },
          data: {
            moldId: mold.id,
            type: mold.type
          },
        })

      }

    }
  } catch (error) {
    console.error('Error seeding users:', error)
  } finally {
    // await prisma.$disconnect()
  }
}

seed()
