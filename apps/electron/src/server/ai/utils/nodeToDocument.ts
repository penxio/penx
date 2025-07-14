/**
 * Document Builder for RAG (Retrieval-Augmented Generation)
 *
 * This module provides utilities for converting PenX INode objects into documents
 * suitable for RAG processing with Mastra. It handles the complete pipeline from
 * raw node data to structured documents with metadata and text content.
 *
 */
import { MDocument } from '@mastra/rag'
import { INode, isCreationNode, NodeType } from '@penx/model-type'
import { TiptapToMarkdown } from './tiptapToMarkdown'

// Configuration options for processing nodes
export interface ProcessingOptions {
  allowedNodeTypes?: NodeType[] // Node types to include in processing (if not specified, all types are allowed)
  customFilter?: (node: INode) => boolean // Custom filter function for nodes
}

/**
 * Filter nodes based on processing options
 * @param nodes - Array of INodes to filter
 * @param options - Processing options containing filter criteria
 * @returns Filtered array of INodes
 */
export function filterNodes(
  nodes: INode[],
  options?: ProcessingOptions,
): INode[] {
  if (!options) {
    return nodes
  }

  return nodes.filter((node) => {
    // Check allowed node types
    if (options.allowedNodeTypes && options.allowedNodeTypes.length > 0) {
      if (!options.allowedNodeTypes.includes(node.type)) {
        return false
      }
    }

    // Apply custom filter if provided
    if (options.customFilter) {
      if (!options.customFilter(node)) {
        return false
      }
    }

    return true
  })
}

/**
 * Extract metadata from a node containing basic node information
 * @param node - The INode to extract metadata from
 * @returns Object containing node metadata
 */
export function extractMetadata(node: INode): Record<string, any> {
  // Base metadata common to all nodes
  const base = {
    nodeId: node.id,
    nodeType: node.type,
    userId: node.userId,
    siteId: node.siteId,
    areaId: node.areaId,
    updatedAt: node.updatedAt,
  }

  // Add creation-specific metadata if it's a creation node
  if (isCreationNode(node)) {
    return {
      ...base,
      creationTitle: node.props.title,
      creationType: node.props.type,
      creationStatus: node.props.status,
      creationSlug: node.props.slug,
    }
  }

  return base
}

// Lazy-loaded TipTap to Markdown converter instance
let converter: TiptapToMarkdown | null = null

/**
 * Get or create TipTap to Markdown converter instance
 * @returns TiptapToMarkdown instance with bullet list configuration
 */
function getConverter(): TiptapToMarkdown {
  if (!converter) {
    converter = new TiptapToMarkdown({
      bulletListMarker: '-',
    })
  }
  return converter
}

/**
 * Convert node content to plain text/markdown
 * @param node - The INode containing content to convert
 * @returns String representation of the node's content
 */
export function convertToText(node: INode): string {
  // Extract content from node properties
  const props = node.props.content

  // Handle different content formats
  if (typeof props === 'string') {
    try {
      // If props is a JSON string, use convertFromJson
      const text = getConverter().convertFromJson(props)
      return text
    } catch (error) {
      // If JSON parsing fails, return the string as-is
      return props
    }
  } else if (props && typeof props === 'object') {
    // If props is already an object, use the regular convert method
    const text = getConverter().convert(props)
    return text
  }

  // Fallback for null/undefined/other types
  return ''
}

/**
 * Create a document object with text and metadata from a single node
 * @param node - The INode to process
 * @returns Object containing text content and metadata
 */
export function createDoc(node: INode): {
  text: string
  metadata?: Record<string, any>
} {
  const metadata = extractMetadata(node)
  const text = convertToText(node)
  return { text, metadata }
}

/**
 * Convert multiple nodes into an array of document objects with optional filtering
 * @param nodes - Array of INodes to process
 * @param options - Processing options for filtering nodes
 * @returns Array of document objects with text and metadata
 */
export function convertNodesToDocs(
  nodes: INode[],
  options?: ProcessingOptions,
): { text: string; metadata?: Record<string, any> }[] {
  // Filter nodes based on options
  const filteredNodes = filterNodes(nodes, options)

  const docs: { text: string; metadata?: Record<string, any> }[] = []

  // Process each filtered node and add to documents array
  filteredNodes.forEach((node) => {
    docs.push(createDoc(node))
  })

  return docs
}

/**
 * Build a Mastra Document from multiple nodes for RAG processing with optional filtering
 * @param nodes - Array of INodes to convert
 * @param options - Processing options for filtering nodes
 * @returns Promise resolving to MDocument for RAG operations
 */
export async function buildMDocument(
  nodes: INode[],
  options?: ProcessingOptions,
): Promise<MDocument> {
  // Convert nodes to document format with filtering
  const docs: { text: string; metadata?: Record<string, any> }[] =
    convertNodesToDocs(nodes, options)
  // Create Mastra document with markdown type for RAG
  const mDocument = new MDocument({ docs, type: 'markdown' })
  return mDocument
}
