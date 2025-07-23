import { useState } from 'react'
import { toast } from 'sonner'
// import { serverSideEditor } from '@penx/content-render/server-side-editor'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { CreationStatus } from '@penx/types'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ImportPostData } from './usePostImportTask'

export function usePostImport() {
  const site = useSiteContext()
  const [isImporting, setIsImporting] = useState(false)

  /**
   * Save posts to database
   */
  const saveCreations = async (creation: any[]): Promise<any> => {
    if (!creation.length) {
      toast.error('No posts to import')
      return false
    }

    // try {
    //   await api.creation.importPosts.mutate({
    //     spaceId: site.id,
    //     creations: creation,
    //     creationStatus: CreationStatus.PUBLISHED,
    //   })

    //   return true
    // } catch (error) {
    //   console.error('Error importing posts:', error)
    //   return false
    // }
  }

  /**
   * Import posts from a JSON file
   */
  const importFromFile = async (file: File): Promise<boolean> => {
    setIsImporting(true)

    try {
      const fileContent = await readFileAsText(file)
      const jsonData = JSON.parse(fileContent)
      const posts = Array.isArray(jsonData) ? jsonData : JSON.parse(jsonData)

      if (!Array.isArray(posts)) {
        throw new Error('Invalid file format. Expected an array of posts.')
      }

      const success = await saveCreations(posts)
      if (success) {
        toast.success(`Successfully imported ${posts.length} posts`)
      }

      return success
    } catch (error) {
      console.error('Error parsing file:', error)
      toast.error(extractErrorMessage(error) || 'Failed to parse file')
      return false
    } finally {
      setIsImporting(false)
    }
  }

  /**
   * Read file as text
   */
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Error reading file'))
      reader.readAsText(file)
    })
  }

  /**
   * Convert content format to Plate JSON
   */
  const convertToPlateFormat = async (
    creation: ImportPostData,
  ): Promise<Creation> => {
    let content = creation.content

    // Convert from markdown if needed
    if (creation.contentFormat === 'markdown') {
      // content = await deserializeMd(serverSideEditor, creation.content)
      // if (typeof content === 'object') {
      //   content = JSON.stringify(content)
      // }
    }

    return {
      title: creation.title,
      content: content,
      status: 'DRAFT',
      type: 'ARTICLE',
    } as Creation
  }

  /**
   * Import selected posts from URL import
   */
  const importSelectedPosts = async (
    posts: ImportPostData[],
  ): Promise<boolean> => {
    if (!posts.length) {
      toast.error('No posts selected')
      return false
    }

    setIsImporting(true)

    // Create a single toast that we'll update with progress
    const toastId = toast.loading(
      `Preparing to import ${posts.length} posts...`,
    )

    try {
      // Process large number of posts in batches
      const BATCH_SIZE = 5
      let successCount = 0
      let lastProgressUpdate = 0

      for (let i = 0; i < posts.length; i += BATCH_SIZE) {
        const batch = posts.slice(i, i + BATCH_SIZE)

        // Convert current batch
        const convertedBatch = await Promise.all(
          batch.map(convertToPlateFormat),
        )

        // Save current batch
        const success = await saveCreations(convertedBatch)
        if (success) {
          successCount += batch.length

          // Only update progress toast when progress increases by at least 10%
          // This reduces the number of updates for large imports
          const progressPercent = Math.floor(
            (successCount / posts.length) * 100,
          )
          if (
            progressPercent >= lastProgressUpdate + 10 ||
            successCount === posts.length
          ) {
            lastProgressUpdate = progressPercent
            toast.loading(
              `Importing: ${successCount}/${posts.length} posts (${progressPercent}%)`,
              { id: toastId },
            )
          }
        }
      }

      // Final success or partial success message
      if (successCount === posts.length) {
        toast.success(`Successfully imported all ${posts.length} posts`, {
          id: toastId,
        })
      } else if (successCount > 0) {
        toast.success(`Imported ${successCount} out of ${posts.length} posts`, {
          id: toastId,
        })
      } else {
        toast.error('Failed to import any posts', { id: toastId })
      }

      return successCount > 0
    } catch (error) {
      console.error('Error importing selected posts:', error)
      toast.error(
        extractErrorMessage(error) || 'Failed to import selected posts',
        { id: toastId },
      )
      return false
    } finally {
      setIsImporting(false)
    }
  }

  return {
    isImporting,
    importFromFile,
    importSelectedPosts,
  }
}
