import { EventType } from '../constants'
import { ActionItem, IAccessory, IconifyIconType, isCustomAction } from '../types'

export interface ListHeading {
  type: 'list-heading'
  title: string
}

export interface IListItem {
  id?: string

  type?: 'list-item' | 'list-heading'

  title:
    | string
    | {
        value: string
        tooltip?: string
      }

  subtitle?:
    | string
    | {
        value?: string
        tooltip?: string
      }

  icon?: string | number | IconifyIconType

  actions?: ActionItem[]

  detail?: DetailItem[] | (() => DetailItem[] | Promise<DetailItem[]>)

  extra?: IAccessory[]

  data?: any
}

interface TooltipValue {
  value: string
  tooltip?: string
}

export function isTooltipValue(value: any): value is TooltipValue {
  return typeof value === 'object' && Reflect.has(value, 'value')
}

interface CustomActionPayload {
  type: 'action--custom-action'
  itemIndex: number
  actionIndex: number
}

export function isCustomActionPayload(value: any): value is CustomActionPayload {
  return value?.type === 'action--custom-action' && Reflect.has(value, 'itemIndex')
}

interface OnItemSelectPayload {
  type: 'onItemSelect'
  itemIndex: number
  item: IListItem
}

export function isOnItemSelectPayload(value: any): value is OnItemSelectPayload {
  // return value?.type === 'onItemSelect' && Reflect.has(value, 'itemIndex')
  return value?.type === 'onItemSelect'
}

type DetailMarkdown = {
  content: string
}

type DetailImage = {
  src: string
}

type DetailDataItem = {
  label: string
  value: string
}

export type DetailItem = DetailMarkdown | DetailDataItem | DetailImage

interface State {
  items: IListItem[]
  isLoading: boolean
  isShowingDetail: boolean
  filtering: boolean
  titleLayout: 'column' | 'row'
}

export interface ListJSON extends State {
  type: 'list'
}

export function isListApp(json: any): json is ListJSON {
  return json.type === 'list'
}

type OnItemSelectCallback = (item: IListItem, index: number) => Promise<void> | void

export class ListApp {
  state: State

  onItemSelectCallback: OnItemSelectCallback

  constructor(initialState: Partial<State>) {
    this.state = {
      items: [],
      isLoading: false,
      filtering: true,
      titleLayout: 'row',
      isShowingDetail: false,
      ...initialState,
    } as State
  }

  setState = (nextState: Partial<State>) => {
    const isLoading = nextState?.items?.length ? false : this.state.isLoading
    this.state = {
      ...this.state,
      isLoading,
      ...nextState,
    }
    this.render()
  }

  onSelectItem = (fn: OnItemSelectCallback) => {
    this.onItemSelectCallback = fn
    return this
  }

  run = () => {
    this.render()

    self.addEventListener('message', async (event) => {
      if (isCustomActionPayload(event.data)) {
        const item = this.state.items[event.data.itemIndex]
        const action = item.actions![event.data.actionIndex]
        isCustomAction(action) && action.onSelect?.()
      }

      // handle function detail

      if (isOnItemSelectPayload(event.data)) {
        const item = this.state.items[event.data.itemIndex]
        if (typeof item.detail === 'function') {
          postMessage({
            type: 'detail',
            isLoading: true,
            data: [],
          })

          const data = await item.detail()
          postMessage({
            type: 'detail',
            isLoading: false,
            data,
          })
        }
      }
    })
    return this
  }

  private formatState(state: State) {
    const newItems = state.items.map((item) => {
      return {
        ...item,
        detail: typeof item.detail === 'function' ? 'functionDetail' : item.detail,
        actions: item.actions?.map((action) => {
          if (!isCustomAction(action)) return action
          const { onSelect, ...rest } = action
          return rest
        }),
      }
    })

    return { ...this.state, items: newItems }
  }

  private render = () => {
    postMessage({
      type: EventType.Render,
      payload: {
        type: 'list',
        ...this.formatState(this.state),
      },
    })
  }
}
