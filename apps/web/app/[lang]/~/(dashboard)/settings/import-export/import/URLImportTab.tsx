import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@penx/uikit/ui/alert'
import { Button } from '@penx/uikit/ui/button'
import { Card, CardContent } from '@penx/uikit/ui/card'
import { Input } from '@penx/uikit/ui/input'
import { Progress } from '@penx/uikit/ui/progress'
import { ImportPostData, ImportTask } from '@penx/hooks/usePostImportTask'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Globe,
  Info,
  Link,
  Search,
} from 'lucide-react'
import { PostSelectionList } from './PostSelectionList'

// Define stages for the import process
const STAGES = ['pending', 'extracting', 'analyzing', 'converting', 'completed']

interface URLImportTabProps {
  isImporting: boolean
  importTask: ImportTask | null
  progress: { progress: number; message: string }
  onImport: (url: string) => void
  onImportPosts: (posts: ImportPostData[]) => Promise<void>
}

export function URLImportTab({
  isImporting,
  importTask,
  progress,
  onImport,
  onImportPosts,
}: URLImportTabProps) {
  const [url, setUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleImport = () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }

    try {
      new URL(url)
      setError(null)
      onImport(url)
    } catch (e) {
      setError('Please enter a valid URL')
    }
  }

  const exampleUrls = [
    { name: 'Dan abramov', url: 'https://overreacted.io' },
    { name: 'Vitalik Buterin', url: 'https://vitalik.eth.limo' },
  ]

  const shouldDisplayPostSelection =
    importTask?.status === 'completed' &&
    importTask.result &&
    importTask.result.length > 0
  const shouldDisplayEmptyResult =
    importTask?.status === 'completed' &&
    (!importTask.result || importTask.result.length === 0)

  const getErrorMessage = (
    error?: string,
  ): { message: string; suggestion: string } => {
    if (!error)
      return {
        message: 'Unknown error occurred',
        suggestion: 'Please try again or use a different URL',
      }

    if (error.includes('timeout')) {
      return {
        message: 'The import process took too long',
        suggestion: 'Try a URL with fewer posts or import directly from a file',
      }
    }

    if (error.includes('not found') || error.includes('404')) {
      return {
        message: 'The URL could not be accessed',
        suggestion: 'Check if the URL is correct and publicly accessible',
      }
    }

    // Handle more error types
    if (error.includes('parse') || error.includes('format')) {
      return {
        message: 'Content format not supported',
        suggestion: 'This URL may not contain standard blog content',
      }
    }

    return {
      message: error,
      suggestion: 'Please try again with a different URL',
    }
  }

  return (
    <div className="flex w-full flex-col space-y-5">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Globe className="text-primary h-4 w-4" />
          <p className="text-sm font-medium">Enter blog URL</p>
        </div>

        <Alert
          variant="default"
          className="border-amber-200/30 bg-amber-50/30 dark:border-amber-400/10 dark:bg-amber-900/10"
        >
          <AlertDescription className="flex items-start text-xs">
            <Info className="mr-1.5 mt-0.5 h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-800 dark:text-amber-200">
              For best results, enter a blog's directory page rather than a
              single article. For paginated blogs, import each page separately.
            </span>
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <div className="group relative flex-1">
            <Input
              placeholder="https://example.com/posts"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              disabled={isImporting}
              className="focus-visible:ring-primary/50 pr-10 transition-all"
            />
            <Link className="text-muted-foreground group-hover:text-primary absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors" />
          </div>
          <Button
            onClick={handleImport}
            disabled={isImporting || !url}
            className="min-w-[80px] transition-all"
          >
            {isImporting ? (
              <span className="flex items-center">
                <Search className="mr-2 h-3.5 w-3.5 animate-pulse" />
                Importing...
              </span>
            ) : (
              <span className="flex items-center">
                Import
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </div>

        {importTask?.status === 'failed' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{getErrorMessage(importTask.error).message}</AlertTitle>
            <AlertDescription>
              {getErrorMessage(importTask.error).suggestion}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {isImporting && !shouldDisplayPostSelection && (
        <div className="space-y-2">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{progress.message}</span>
            <span>{Math.round(progress.progress)}%</span>
          </div>
          <Progress value={progress.progress} className="h-1.5" />
        </div>
      )}

      {shouldDisplayPostSelection && (
        <div className="border-primary/20 w-full space-y-2 rounded-lg border-2 border-dashed p-4">
          <div className="flex w-full items-center justify-between">
            {importTask.total &&
              importTask.total > importTask.result!.length && (
                <p className="text-muted-foreground text-xs">
                  {importTask.total - importTask.result!.length} posts couldn't
                  be parsed
                </p>
              )}
          </div>
          <PostSelectionList
            posts={importTask.result!}
            isImporting={isImporting}
            onImport={onImportPosts}
          />
        </div>
      )}

      {shouldDisplayEmptyResult && (
        <Alert>
          <AlertDescription className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
            No posts were found at this URL. Try a different URL or check if the
            blog is accessible.
          </AlertDescription>
        </Alert>
      )}

      {!isImporting &&
        !shouldDisplayPostSelection &&
        !shouldDisplayEmptyResult && (
          <div className="border-muted space-y-2 rounded-lg border p-4">
            <p className="text-muted-foreground flex items-center text-sm font-medium">
              <Info className="text-primary mr-2 h-4 w-4" />
              Try with these examples:
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {exampleUrls.map((example) => (
                <Card
                  key={example.name}
                  className="hover:border-primary/30 hover:bg-primary/5 cursor-pointer border-dashed transition-all"
                  onClick={() => setUrl(example.url)}
                >
                  <CardContent className="flex flex-col p-3">
                    <div className="text-sm font-medium">{example.name}</div>
                    <div className="text-muted-foreground truncate text-xs">
                      {example.url}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      <div className="text-foreground/60 text-sm">
        If import fails, seek help from{' '}
        <a
          href="https://discord.gg/nyVpH9njDu"
          target="_blank"
          className="text-brand"
        >
          our discord
        </a>
        .
      </div>
    </div>
  )
}
