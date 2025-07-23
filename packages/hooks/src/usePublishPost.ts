import { useState } from 'react'
import { toast } from 'sonner'
import { Address } from 'viem'
import { z } from 'zod'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Creation } from '@penx/domain'
import { ICreationNode } from '@penx/model-type'
// import { revalidateMetadata } from '@penx/libs/revalidateTag'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { syncPostToHub } from '../../services/src/syncPostToHub'

export const PublishPostFormSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required' }),
  gateType: z.any(),
  collectible: z.boolean(),
  delivered: z.boolean(),
  publishedAt: z.date().optional(),
})

export type PublishPostOptions = z.infer<typeof PublishPostFormSchema>

export function usePublishPost() {
  const site = useSiteContext()
  const { id } = site
  // const { setIsOpen } = usePublishDialog()
  const [isLoading, setLoading] = useState(false)

  return {
    isLoading,
    publishPost: async (creation: Creation, opt: PublishPostOptions) => {
      const { gateType, collectible, delivered, slug } = opt
      setLoading(true)

      let creationId: number | undefined
      // try {
      //   await api.creation.publish.mutate({
      //     spaceId: id,
      //     creationId: creation?.id,
      //     ...opt,
      //     slug,
      //   })

      //   setLoading(false)
      //   // revalidateMetadata(`posts`)
      //   // revalidateMetadata(`posts-${post.slug}`)
      //   toast.success('published successfully!')

      //   // backup to github
      //   if (site.repo && site.installationId) {
      //     // const editor = createPlateEditor({
      //     //   value: JSON.parse(creation.content),
      //     //   plugins: editorPlugins,
      //     // })
      //     // const content = (editor.api as any).markdown.serialize()
      //     // syncPostToHub(site, creation, content).catch((error) => {
      //     //   const msg = extractErrorMessage(error)
      //     //   toast.error(msg)
      //     // })
      //   }
      //   // setIsOpen(false)
      // } catch (error) {
      //   console.log('========error:', error)
      //   const msg = extractErrorMessage(error)
      //   toast.error(msg)
      //   setLoading(false)
      //   throw error
      // }
    },
  }
}
