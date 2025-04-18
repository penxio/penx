type PropObject = {
  keys?: string | string[]
  desc?: boolean
}
export type Props = PropObject | string | null

export class ArraySorter<ItemType> {
  constructor(private readonly listToBeSorted: ItemType[]) {
    if (!Array.isArray(listToBeSorted)) {
      throw new Error('The list to be sorted must be an array')
    }
  }

  public sortBy(props: Props = null): ItemType[] {
    type Ref = {
      sorted: ItemType[] | Array<string | number | null | undefined | symbol>
      keys: string | string[] | null
    }
    const ref: Ref = { sorted: this.listToBeSorted, keys: null }
    if (props?.hasOwnProperty('keys')) ref.keys = (props as PropObject).keys!
    if (typeof props === 'string') ref.keys = [props]
    if (Array.isArray(ref.keys)) {
      ref.keys.forEach((key) => {
        ref.sorted = this.sortListOfObjects(ref.sorted as ItemType[], key)
      })
    } else {
      ref.sorted = this.sortPlainList(ref.sorted as Array<string | number>)
    }

    if (props?.hasOwnProperty('desc') && (props as PropObject).desc) {
      ref.sorted = (
        ref.sorted as Array<string | number | null | undefined | symbol>
      ).reverse()
    }

    return ref.sorted as ItemType[]
  }

  private sortPlainList(data: Array<string | number>) {
    return data.sort(function (next, current) {
      // Sorting by number key
      if (!isNaN(current as number) && !isNaN(next as number)) {
        return (next as number) - (current as number)
      }
      // Alphabetical sorting
      if ((current as string)?.toLowerCase() > (next as string)?.toLowerCase())
        return -1
      if ((current as string)?.toLowerCase() < (next as string)?.toLowerCase())
        return 1
      return 0
    })
  }

  private sortListOfObjects(data: ItemType[], key: string): ItemType[] {
    return data.sort(function (
      // next: { [key: string]: any } ,
      // current: { [key: string]: any },

      // TODO: handle any
      next: any,
      current: any,
    ) {
      // Sorting by number key
      if (!isNaN(current[key]) && !isNaN(next[key])) {
        return next[key] - current[key]
      }

      // Sorting by date key
      if (!isNaN(new Date(current[key]).valueOf())) {
        const $current = new Date(current[key]).valueOf()
        const $next = { val: new Date(0).valueOf() }
        if (!isNaN(new Date(next[key]).valueOf())) {
          $next.val = new Date(next[key]).valueOf()
        }

        if ($current > $next.val) return -1
        if ($current < $next.val) return 1
        return 0
      }
      // Alphabetical sorting
      if (current[key]?.toLowerCase() > next[key]?.toLowerCase()) return -1
      if (current[key]?.toLowerCase() < next[key]?.toLowerCase()) return 1
      return 0
    })
  }
}
