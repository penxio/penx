import { useAreaContext } from '@penx/components/AreaContext'
import { CatalogueTree, CreateCatalogueNodeOptions } from '@/lib/catalogue'
import { CatalogueNodeType, ICatalogueNode } from '@penx/model'
import { queryClient } from '@penx/query-client'
import { trpc } from '@penx/trpc-client'
import { uniqueId } from '@penx/unique-id'

export function useCatalogue() {
  const field = useAreaContext()
  const { mutateAsync } = trpc.area.updateArea.useMutation()
  const catalogue = CatalogueTree.fromJSON(field!.catalogue || [])

  async function update(catalogue: CatalogueTree) {
    const json = catalogue.toJSON()

    queryClient.setQueriesData(
      { queryKey: ['areas', field!.id] },
      { ...field, catalogue: json },
    )
    await mutateAsync({ id: field!.id, catalogue: json })
  }

  async function addNode(
    opt: Partial<CreateCatalogueNodeOptions>,
    parentId?: string,
  ) {
    const { id, type, title, ...res } = opt
    catalogue.addNode(
      {
        id: id || uniqueId(),
        folded: false,
        type: type || CatalogueNodeType.CATEGORY,
        title: title || '',
        children: [],
        ...res,
      },
      parentId,
    )
    await update(catalogue)
  }

  async function updateTitle(id: string, title: string) {
    catalogue.updateTitle(id, title)
    await update(catalogue)
  }

  async function updateEmoji(id: string, unified: string) {
    catalogue.updateEmoji(id, unified)
    await update(catalogue)
  }

  async function deleteNode(nodeId: string) {
    catalogue.deleteNode(nodeId)
    await update(catalogue)
  }

  async function setNodes(nodes: any) {
    const catalogue = CatalogueTree.fromJSON(nodes)
    await update(catalogue)
  }

  return { catalogue, addNode, updateTitle, deleteNode, setNodes, updateEmoji }
}
