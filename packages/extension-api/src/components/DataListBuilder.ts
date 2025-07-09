export interface IDataListItem {
  label: string
  value: string
}

export interface DataListJSON {
  type: 'data-list'
  items: IDataListItem[]
}

export function isDataListJSON(json: any): json is DataListJSON {
  return json.type === 'data-list'
}

export class DataListBuilder {
  loading: boolean = false

  constructor(public items: IDataListItem[] = []) {}

  setItems = (items: IDataListItem[]) => {
    this.items = items
    return this
  }

  addItem = (item: IDataListItem) => {
    this.items.push(item)
  }

  setLoading = (loading: boolean) => {
    this.loading = loading
    return this
  }

  toJSON(): DataListJSON {
    return {
      type: 'data-list',
      items: this.items,
    }
  }
}
