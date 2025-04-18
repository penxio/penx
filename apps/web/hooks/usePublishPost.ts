import { useState } from 'react'
import { usePanelCreationContext } from '@/components/Creation/PanelCreationProvider'
import { usePublishDialog } from '@/components/Creation/PublishDialog/usePublishDialog'
import { editorPlugins } from '@/components/editor/plugins/editor-plugins'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { syncPostToHub } from '@/lib/syncPostToHub'
import { api } from '@/lib/trpc'
import { store } from '@/store'
import { GateType } from '@penx/db/client'
import { createPlateEditor } from '@udecode/plate/react'
import { toast } from 'sonner'
import { Address } from 'viem'
import { z } from 'zod'
import { useSiteContext } from '../components/SiteContext'
import { Creation } from './useCreation'

export const PublishPostFormSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required' }),
  gateType: z.nativeEnum(GateType),
  collectible: z.boolean(),
  delivered: z.boolean(),
  publishedAt: z.date().optional(),
})

export type PublishPostOptions = z.infer<typeof PublishPostFormSchema>

export function usePublishPost() {
  const site = useSiteContext()
  const { spaceId, id } = site
  const { setIsOpen } = usePublishDialog()
  const [isLoading, setLoading] = useState(false)
  const creation = usePanelCreationContext()

  return {
    isLoading,
    publishPost: async (opt: PublishPostOptions) => {
      const { gateType, collectible, delivered, slug } = opt
      setLoading(true)

      let creationId: number | undefined
      try {
        await api.creation.publish.mutate({
          siteId: id,
          creationId: creation?.id,
          ...opt,
          slug,
        })

        setLoading(false)
        revalidateMetadata(`posts`)
        // revalidateMetadata(`posts-${post.slug}`)
        toast.success('published successfully!')

        // backup to github
        if (site.repo && site.installationId) {
          const editor = createPlateEditor({
            value: JSON.parse(creation.content),
            plugins: editorPlugins,
          })

          const content = (editor.api as any).markdown.serialize()
          syncPostToHub(site, creation, content).catch((error) => {
            const msg = extractErrorMessage(error)
            toast.error(msg)
          })
        }
        setIsOpen(false)
      } catch (error) {
        console.log('========error:', error)
        const msg = extractErrorMessage(error)
        toast.error(msg)
        setLoading(false)
        throw error
      }
    },
  }
}
