import { useEffect, useState } from 'react'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { Card, CardContent } from '@penx/uikit/ui/card'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { ScrollArea } from '@penx/uikit/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/ui/tooltip'
import { ImportPostData } from '@/hooks/usePostImportTask'
import { Calendar, FileText, Link as LinkIcon, Loader2 } from 'lucide-react'

interface PostSelectionListProps {
  posts: ImportPostData[]
  isImporting: boolean
  onImport: (posts: ImportPostData[]) => Promise<void>
}

export function PostSelectionList({
  posts,
  isImporting,
  onImport,
}: PostSelectionListProps) {
  const [selectedPosts, setSelectedPosts] = useState<Record<number, boolean>>(
    posts.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}),
  )
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    setSelectedPosts(
      posts.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}),
    )
  }, [posts])

  const handleToggleAll = (checked: boolean) => {
    setSelectedPosts(
      posts.reduce((acc, _, index) => ({ ...acc, [index]: checked }), {}),
    )
  }

  const handleTogglePost = (index: number, checked: boolean) => {
    setSelectedPosts((prev) => ({ ...prev, [index]: checked }))
  }

  const handleImport = async () => {
    setImporting(true)
    const postsToImport = posts.filter((_, index) => selectedPosts[index])
    await onImport(postsToImport)
    setImporting(false)
  }

  const selectedCount = Object.values(selectedPosts).filter(Boolean).length

  return (
    <div className="flex flex-col space-y-4 overflow-hidden">
      <div className="bg-muted/30 flex items-center justify-between rounded-md p-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedCount === posts.length}
            onCheckedChange={(checked) => handleToggleAll(!!checked)}
            aria-label={`Select all ${posts.length} posts`}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label
            htmlFor="select-all"
            className="flex cursor-pointer items-center text-sm font-medium"
          >
            <FileText className="text-primary/70 mr-1.5 h-3.5 w-3.5" />
            <span>Select all posts</span>
            <Badge variant="outline" className="ml-2 h-5 px-1.5 py-0 text-xs">
              {selectedCount}/{posts.length}
            </Badge>
          </label>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleImport}
                disabled={importing || selectedCount === 0}
                size="sm"
                className="transition-all"
                variant={selectedCount > 0 ? 'default' : 'outline'}
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Importing...
                  </>
                ) : (
                  `Import ${selectedCount} post${selectedCount !== 1 ? 's' : ''}`
                )}
              </Button>
            </TooltipTrigger>
            {selectedCount === 0 && (
              <TooltipContent>
                <p>Select at least one post to import</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="overflow-hidden rounded-md border">
        <ScrollArea className="h-52">
          <div className="divide-y">
            {posts.map((post, index) => (
              <div
                key={index}
                className={`
                  flex cursor-pointer items-start p-3 transition-colors
                  ${selectedPosts[index] ? 'bg-primary/5' : 'hover:bg-muted/50'}
                `}
                onClick={() => handleTogglePost(index, !selectedPosts[index])}
              >
                <Checkbox
                  id={`post-${index}`}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mr-3 mt-1 shrink-0"
                  checked={selectedPosts[index]}
                  onCheckedChange={(checked) =>
                    handleTogglePost(index, !!checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="min-w-0 flex-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="line-clamp-1 text-sm font-medium">
                          {post.title || 'Untitled Post'}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="start"
                        className="max-w-[300px]"
                      >
                        <p className="break-words text-sm">
                          {post.title || 'Untitled Post'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="text-muted-foreground mt-1 flex items-center text-xs">
                    {post.contentFormat && (
                      <Badge
                        variant="outline"
                        className="bg-muted/30 mr-2 h-4 px-1 py-0 text-[10px]"
                      >
                        {post.contentFormat}
                      </Badge>
                    )}

                    {post.url && (
                      <span
                        className="mr-2 flex max-w-[150px] items-center truncate"
                        title={post.url}
                      >
                        <LinkIcon className="mr-1 h-3 w-3 opacity-70" />
                        {new URL(post.url).hostname}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {importing && (
        <div className="text-muted-foreground animate-pulse text-center text-sm">
          Converting and importing posts...
        </div>
      )}
    </div>
  )
}
