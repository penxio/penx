export interface ISuggestion {
  id: string
  documentId: string
  originalText: string
  suggestedText: string
  description: string
  isResolved: boolean
  userId: string
  documentCreatedAt: Date
  spaceId: string
  createdAt: Date
}
