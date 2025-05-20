import {
  AddCreationInput,
  editorDefaultValue,
  isMobileApp,
} from '@penx/constants'
import { CommentStatus } from '@penx/db/client'
import { appEmitter } from '@penx/emitter'
import { updateCreationState } from '@penx/hooks/useCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { ICreationNode, NodeType } from '@penx/model-type'
import { store } from '@penx/store'
import { ColumnType, CreationStatus, GateType, PanelType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { useMySite } from './useMySite'

export type Input = {
  type: string
  isAddPanel?: boolean
  content?: string
  title?: string
}

export function useAddCreation() {
  const { structs } = useStructs()
  const { site } = useMySite()

  return async (input: Input) => {
    const { isAddPanel = true } = input
    const struct = structs.find((struct) => struct.type === input.type)
    const area = store.area.get()

    if (!struct) throw new Error('Invalid struct type')

    const id = uniqueId()
    const addCreationInput: AddCreationInput = {
      slug: uniqueId(),
      siteId: site.id,
      title: input.title || '',
      description: '',
      image: '',
      content: input.content || JSON.stringify(editorDefaultValue),
      type: struct.type,
      structId: struct.id,
      areaId: area.id,
    }
    const cells = struct.columns.reduce(
      (acc, column) => {
        let value: any = ''
        if (
          column.columnType === ColumnType.SINGLE_SELECT ||
          column.columnType === ColumnType.MULTIPLE_SELECT
        ) {
          value = column.options.filter((o) => o.isDefault).map((o) => o.id)
        }

        return { ...acc, [column.id]: value }
      },
      {} as Record<string, any>,
    )

    const newCreation: ICreationNode = {
      id,
      type: NodeType.CREATION,
      props: {
        icon: '',
        cells: cells,
        podcast: {},
        i18n: {},
        gateType: GateType.FREE,
        status: CreationStatus.DRAFT,
        commentStatus: CommentStatus.OPEN,
        featured: false,
        collectible: false,
        isJournal: false,
        isPopular: false,
        checked: false,
        delivered: false,
        commentCount: 0,
        cid: '',
        openedAt: new Date(),
        ...addCreationInput,
      } as ICreationNode['props'],
      createdAt: new Date(),
      updatedAt: new Date(),
      areaId: area.id,
      siteId: struct.siteId,
      userId: site.userId,
    }

    store.creations.addCreation(newCreation)

    updateCreationState(newCreation)

    if (isAddPanel) {
      if (isMobileApp && !input.content) {
        appEmitter.emit('ROUTE_TO_CREATION', newCreation)
      } else {
        store.panels.addPanel({
          id: uniqueId(),
          type: PanelType.CREATION,
          creationId: newCreation.id,
        })
      }
    }
    return newCreation
  }
}
