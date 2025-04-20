const { v4 } = require('uuid')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function uniqueId() {
  return v4()
}

const PropType = {
  TEXT: 'TEXT',
  MARKDOWN: 'MARKDOWN',
  IMAGE: 'IMAGE',
  URL: 'URL',
  SINGLE_SELECT: 'SINGLE_SELECT',
  MULTIPLE_SELECT: 'MULTIPLE_SELECT',
}

const CreationType = {
  ARTICLE: 'ARTICLE',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  PAGE: 'PAGE',
  NFT: 'NFT',
  FIGMA: 'FIGMA',
  NOTE: 'NOTE',
  BOOKMARK: 'BOOKMARK',
  FRIEND: 'FRIEND',
  PROJECT: 'PROJECT',
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
      // include: {
      //   molds: true,
      // },
    })
    console.log('=========>>>>>>>sites:', sites[1])

    for (const site of sites) {
      console.log('id=========>>>>>>>:', site.navLinks)
      continue

      await prisma.site.update({
        where: { id: site.id },
        data: {
          navLinks: [
            {
              title: 'Home',
              pathname: '/',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: true,
            },

            {
              title: 'Areas',
              pathname: '/areas',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: true,
            },

            {
              title: 'Writings',
              pathname: '/writings',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: true,
            },
            {
              title: 'Podcasts',
              pathname: '/podcasts',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: false,
            },
            {
              title: 'Notes',
              pathname: '/notes',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: false,
            },
            {
              title: 'Photos',
              pathname: '/photos',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: false,
            },
            {
              title: 'Projects',
              pathname: '/projects',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: false,
            },
            {
              title: 'Friends',
              pathname: '/friends',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: true,
            },
            {
              title: 'Tags',
              pathname: '/tags',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: false,
            },
            {
              title: 'Guestbook',
              pathname: '/guestbook',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: true,
            },
            {
              title: 'AMA',
              pathname: '/ama',
              type: 'BUILTIN',
              location: 'HEADER',
              visible: false,
            },
            {
              title: 'About',
              pathname: '/about',
              location: 'HEADER',
              type: 'BUILTIN',
              visible: true,
            },
          ],
        },
      })
    }
  } catch (error) {
    console.error('Error seeding users:', error)
  } finally {
    // await prisma.$disconnect()
  }
}

seed()
