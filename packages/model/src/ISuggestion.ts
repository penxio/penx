export interface ISuggestion {
  id: string
  documentId: string
  originalText: string
  suggestedText: string
  description: string
  isResolved: boolean
  userId: string
  documentCreatedAt: Date
  siteId: string
  createdAt: Date
}
