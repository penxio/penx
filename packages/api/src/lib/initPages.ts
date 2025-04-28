import { CreationStatus } from '@penx/db/client'
import { editorDefaultValue, ELEMENT_P } from '@penx/constants'
import { prisma } from '@penx/db'
import { CreationType } from '@penx/types'

const aboutContent = `[{"children":[{"text":""}],"type":"img","url":"/56e813da9280fdf3b068b9b6e3a35cc95a7211241340d014435ff0f641bf48b8","id":"16HHbLVZYS","mime":"image/jpeg","width":120,"align":"center"},{"children":[{"text":"Zio"}],"type":"h2","id":"JG2FDjWpv_","align":"center"},{"children":[{"text":"A developer, designer, husband and father"}],"type":"p","id":"8Q5qxu3H3P","align":"center","style":""},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."}],"type":"p","id":"NCA2XUq3a2","align":"center"},{"children":[{"text":""}],"type":"social-links","id":"4CEre-OJlB"},{"children":[{"text":""}],"type":"p","id":"gIztV3DUgC"}]`

export async function initPages(siteId: string, userId: string) {
  const mold = await prisma.mold.findUnique({
    where: {
      siteId_type: {
        siteId,
        type: CreationType.PAGE,
      },
    },
  })

  const area = await prisma.area.findFirst({
    where: { siteId },
  })
  if (!mold || !area) return

  await prisma.creation.createMany({
    data: [
      {
        areaId: area.id,
        moldId: mold.id,
        userId,
        siteId,
        isPage: true,
        status: CreationStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'About',
        slug: 'about',
        type: CreationType.PAGE,
        content: aboutContent,
      },
      {
        areaId: area.id,
        moldId: mold.id,
        userId,
        siteId,
        isPage: true,
        status: CreationStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'Projects',
        slug: 'projects',
        type: CreationType.PAGE,
        content: `[{"type":"h1","lineHeight":"3.5rem","align":"start","children":[{"text":"My projects"}],"id":"LxtEtBzoOm"},{"children":[{"text":"Some fun stuff I made, hope you like it!"}],"type":"p","id":"25W982NSZb"},{"children":[{"text":"","fontSize":"medium","backgroundColor":"rgb(250, 250, 250)","color":"rgb(39, 39, 42)"}],"type":"p","id":"vfFPtgQu0k"},{"children":[{"text":""}],"type":"projects","id":"DY87LZJE0O"},{"children":[{"text":""}],"type":"p","id":"IrDG67LpWt"}]`,
      },
      {
        areaId: area.id,
        moldId: mold.id,
        userId,
        siteId,
        isPage: true,
        status: CreationStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'Friends',
        slug: 'friends',
        type: CreationType.PAGE,
        content: `[{"type":"h1","children":[{"text":"Friends"}],"id":"9s2oAcc8Cf"},{"type":"p","id":"BJOICSFING","children":[{"text":"My friends' blogs are listed here; you're welcome to add yours too! "}]},{"type":"p","id":"D24AlR9Ijf","children":[{"text":""}]},{"children":[{"text":""}],"type":"friends","id":"FhTb0zwXdG"},{"type":"p","id":"LsKvOTcPDw","children":[{"text":""}]}]`,
      },
      {
        areaId: area.id,
        moldId: mold.id,
        userId,
        siteId,
        isPage: true,
        status: CreationStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'Guestbook',
        slug: 'guestbook',
        type: CreationType.PAGE,
        content:
          '[{"children":[{"text":"Welcome to my guestbook!"}],"type":"h1","id":"JvZ93TKri0"},{"children":[{"text":"Leave a message with your thoughts, suggestions, ideas, critiques, compliments, encouragement, or just a funny comment."}],"type":"p","id":"jrt2ZtjLwC"},{"type":"p","id":"6S-sMNxMxF","children":[{"text":""}]},{"children":[{"text":""}],"type":"comment-box","id":"e8bz6aUmFh"},{"children":[{"text":""}],"type":"p","id":"PaiLUxQDEg"}]',
      },
      {
        areaId: area.id,
        moldId: mold.id,
        userId,
        siteId,
        isPage: true,
        status: CreationStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'AMA',
        slug: 'ama',
        type: CreationType.PAGE,
        content:
          '[{"children":[{"text":"One-on-One Consulting"}],"type":"h1","id":"asd85Q5mJp"},{"children":[{"text":"I offer one-on-one consulting services. With experience in front-end development, full-stack development, UI/UX design, and entrepreneurship, I can help answer your questions related to these areas."}],"type":"p","id":"1-GWJ52aqx"},{"type":"h2","id":"Bg26KXWSox","children":[{"text":"pricing"}]},{"type":"p","id":"0zA43m74R5","children":[{"text":"$50 / per hour"}]},{"type":"p","id":"qHMVkKeyjb","children":[{"text":""}]},{"children":[{"text":""}],"productId":"","type":"product","id":"PhOBNOltpc"},{"children":[{"text":""}],"type":"p","id":"qV6Vv0fK59"}]',
      },
    ],
  })
}
