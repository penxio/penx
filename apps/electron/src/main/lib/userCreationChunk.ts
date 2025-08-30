import { MDocument } from '@mastra/rag'
import { db } from '@penx/db/client'
import { IColumn, NodeType } from '@penx/model-type'
import { tiptapToMarkdown } from '@penx/utils/tiptapToMarkdown'

export type CreationNodeStruct = {
  nodeId: string
  structId: string
  userId: string
  structName: string
  header: Record<string, any>
  content: string
}

// Helper function to get the display name for an option by id
function getOptionName(options: any[], id: string) {
  const opt = options.find((opt) => opt.id === id)
  return opt ? opt.name : id
}

/**
 * Convert user creation nodes to structured data with header mapping.
 * @returns Array of CreationNodeStruct
 */
export function userCreationConvert(nodes: any[]): CreationNodeStruct[] {
  // Build a map of struct nodes by their type
  const structMap = new Map<string, any>()
  nodes.forEach((node) => {
    // console.log('===node:', node)
    if (
      node.type === NodeType.STRUCT &&
      node.props &&
      typeof node.props === 'object' &&
      !Array.isArray(node.props)
    ) {
      const propsObj = node.props as any
      if ('type' in propsObj && typeof propsObj.type === 'string') {
        structMap.set(propsObj.type, node)
      }
    }
  })

  // Filter all creation nodes
  const creationList = nodes.filter((node) => node.type === NodeType.CREATION)

  // Map each creation node to a structured object
  return creationList.map((creation: any) => {
    const props = creation.props
    const cells: Record<string, any> = props?.cells || {}
    const struct = structMap.get(props?.type)
    const header: Record<string, any> = {}

    // Map cell values to header fields using struct column definitions
    if (cells && struct?.props?.columns) {
      const structColumns: IColumn[] = struct.props.columns
      const structColumnsMap: Map<string, IColumn> = new Map(
        structColumns.map((column) => [column.id, column]),
      )
      for (const key in cells) {
        const cellValue = cells[key]
        const column = structColumnsMap.get(key)
        if (!column) continue

        if (column.options && column.options.length > 0) {
          if (Array.isArray(cellValue)) {
            // Multi-select: map ids to option names
            header[column.name] = cellValue
              .map((id: string) => getOptionName(column.options, id))
              .filter(Boolean)
          } else {
            // Single-select: map id to option name
            header[column.name] = getOptionName(column.options, cellValue)
          }
        } else {
          // Plain field: assign value directly
          header[column.name] = cellValue
        }
      }

      header['Title'] = props?.title
    }

    const markdownContext = tiptapToMarkdown(props?.content)

    // Serialize header as YAML frontmatter
    const yamlHeader =
      '---\n' +
      Object.entries(header)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: [${value.map((v) => JSON.stringify(v)).join(', ')}]`
          } else {
            return `${key}: ${JSON.stringify(value)}`
          }
        })
        .join('\n') +
      '\n---\n'

    const contentWithHeader = `${yamlHeader}${markdownContext}`

    return {
      userId: creation.userId,
      nodeId: creation.id,
      structId: props?.structId,
      structName: struct?.props?.name,
      header,
      content: contentWithHeader,
    }
  })
}

export async function buildMDocument(): Promise<MDocument[]> {
  // Query all nodes for the user
  const nodes = await db.query.nodes.findMany()

  return buildMDocumentFromCreations(nodes)
}

/**
 * Convert uploaded creation data to MDocument format without database queries.
 * @param creations - Array of creation objects uploaded by user
 * @param userId - The user ID for the documents
 * @returns Array of MDocument
 */
export function buildMDocumentFromCreations(nodes: any[]): MDocument[] {
  const creationStructList: CreationNodeStruct[] = userCreationConvert(nodes)

  const documents: MDocument[] = []
  for (const creation of creationStructList) {
    documents.push(
      MDocument.fromMarkdown(creation.content, {
        userId: creation.userId,
        nodeId: creation.nodeId,
        structId: creation.structId,
        structName: creation.structName,
      }),
    )
  }
  return documents
}
