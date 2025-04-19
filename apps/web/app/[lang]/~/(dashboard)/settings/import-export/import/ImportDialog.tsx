import { useState } from 'react'
import { Badge } from '@penx/uikit/ui/badge'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@penx/uikit/ui/tabs'
import { usePostImport } from '@/hooks/usePostImport'
import { ImportPostData, useImportTask } from '@/hooks/usePostImportTask'
import { FileImportTab } from './FileImportTab'
import { URLImportTab } from './URLImportTab'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const {
    importTask,
    isLoading: isTaskLoading,
    createImportTask,
    getImportProgress,
  } = useImportTask()

  const {
    isImporting: isPostImporting,
    importFromFile,
    importSelectedPosts,
  } = usePostImport()

  const isImporting = isTaskLoading || isPostImporting

  const [activeTab, setActiveTab] = useState<'file' | 'url'>('url')

  const handleFileImport = async (file: File) => {
    const success = await importFromFile(file)
    if (success) {
      onOpenChange(false)
    }
  }

  const handleUrlImport = async (url: string) => {
    await createImportTask(url)
  }

  const handleSelectedPostsImport = async (posts: ImportPostData[]) => {
    const success = await importSelectedPosts(posts)
    if (success) {
      onOpenChange(false)
    }
  }

  const progress = getImportProgress()

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Import Posts</DialogTitle>
        <DialogDescription>Choose a method to import posts</DialogDescription>
      </DialogHeader>

      <Tabs
        defaultValue="file"
        value={activeTab}
        className="w-full"
        onValueChange={(value) => setActiveTab(value as 'file' | 'url')}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="relative">
            URL
            {activeTab === 'url' && (
              <Badge
                variant="outline"
                className="bg-muted text-muted-foreground border-border absolute -right-1 -top-1 h-auto px-1 py-0 text-[9px]"
              >
                BETA
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="file">File Import</TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="py-4">
          <FileImportTab
            isImporting={isImporting}
            onFileSelect={handleFileImport}
            description="Import JSON file exported from PenX."
            acceptTypes="application/json"
            fileType="JSON"
          />
        </TabsContent>

        <TabsContent value="url" className="py-4">
          <URLImportTab
            isImporting={isImporting}
            importTask={importTask}
            progress={progress}
            onImport={handleUrlImport}
            onImportPosts={handleSelectedPostsImport}
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  )
}
