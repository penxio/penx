import { MDocument } from '@mastra/rag'
import {
  INode,
  NodeType,
  isCreationNode,
} from '@penx/model-type'

import { TiptapToMarkdown } from './tiptap-content-converter'

// Configuration options for processing nodes
export interface ProcessingOptions {
  chunkSize?: number // Size of text chunks for splitting
  chunkOverlap?: number // Overlap between consecutive chunks
  allowedNodeTypes?: NodeType[] // Node types to include in processing
  excludedNodeTypes?: NodeType[] // Node types to exclude from processing
  customFilter?: (node: INode) => boolean // Custom filter function for nodes
}

/**
 * Create metadata for a node containing basic node information
 * @param node - The INode to extract metadata from
 * @returns Object containing node metadata
 */
function createMetadata(node: INode): Record<string, any> {
  // Base metadata common to all nodes
  const base = {
    nodeId: node.id,
    nodeType: node.type,
    userId: node.userId,
    siteId: node.siteId,
    areaId: node.areaId,
    updatedAt: node.updatedAt
  }

  // Add creation-specific metadata if it's a creation node
  if (isCreationNode(node)) {
    return {
      ...base,
      creationTitle: node.props.title,
      creationType: node.props.type,
      creationStatus: node.props.status,
      creationSlug: node.props.slug
    }
  }

  return base
}

// Initialize TipTap to Markdown converter with bullet list configuration
const converter = new TiptapToMarkdown({
  bulletListMarker: '-'
})

/**
 * Convert node content to plain text/markdown
 * @param node - The INode containing content to convert
 * @returns String representation of the node's content
 */
function createText(node: INode): string {
  // Extract content from node properties
  const props = node.props.content
  // Convert TipTap JSON format to markdown text
  const text = converter.convert(props)
  return text
}

/**
 * Create a document object with text and metadata from a single node
 * @param node - The INode to process
 * @returns Object containing text content and metadata
 */
function createDoc(node: INode): { text: string; metadata?: Record<string, any> } {
  const metadata = createMetadata(node)
  const text = createText(node)
  return { text, metadata }
}

/**
 * Convert multiple nodes into an array of document objects
 * @param nodes - Array of INodes to process
 * @returns Array of document objects with text and metadata
 */
function createDocs(nodes: INode[]): { text: string; metadata?: Record<string, any> }[] {
  const docs: { text: string; metadata?: Record<string, any> }[] = []

  // Process each node and add to documents array
  nodes.forEach((node) => {
    docs.push(createDoc(node))
  })

  return docs
}

/**
 * Create a Mastra Document from multiple nodes for RAG processing
 * @param nodes - Array of INodes to convert
 * @returns Promise resolving to MDocument for RAG operations
 */
async function createMDocument(nodes: INode[]): Promise<MDocument> {
  // Convert nodes to document format
  const docs: { text: string; metadata?: Record<string, any> }[] = createDocs(nodes)
  // Create Mastra document with markdown type for RAG
  const mDocument = new MDocument({ docs, type: 'markdown' })
  return mDocument
}
