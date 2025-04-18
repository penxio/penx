export interface ImportTask {
  id: string
  userId: string
  siteId: string
  url: string
  status: ImportTaskStatus
  progress: number
  error?: string
  total?: number // Total number of items to parse
  result?: PostData[]
  createdAt: Date
  updatedAt: Date
}

export type ImportTaskStatus =
  | 'pending' // Waiting to be processed
  | 'extracting' // Extracting web content
  | 'analyzing' // Analyzing content
  | 'converting' // Converting format
  | 'completed' // Task completed
  | 'failed' // Task failed

export interface PostData {
  title: string
  content: string
  contentFormat?: 'html' | 'markdown' | 'plate' // Format of the content
  url?: string
}

export interface PostLink {
  href: string
  title: string
}

export interface PostDirectoryResult {
  url: string
  timestamp: Date
  items: PostLink[]
}

// Type alias for backward compatibility
export type ExtractResult = PostDirectoryResult
