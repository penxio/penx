import { useSiteContext } from '@penx/contexts/SiteContext'
import { updateSiteState } from '@penx/hooks/useSite'
import { CatalogueTree, CreateCatalogueNodeOptions } from '@/lib/catalogue'
import { CatalogueNodeType, ICatalogueNode } from '@penx/model'
import { trpc } from '@penx/trpc-client'
import { uniqueId } from '@penx/unique-id'

export function useCatalogue() {
  const site = useSiteContext()
  const { mutateAsync } = trpc.site.updateSite.useMutation()
  const catalogue = CatalogueTree.fromJSON(site.catalogue || [])

  async function update(catalogue: CatalogueTree) {
    const json = catalogue.toJSON()
    updateSiteState({
      catalogue: json as any,
    })
    await mutateAsync({ id: site.id, catalogue: JSON.stringify(json) })
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
