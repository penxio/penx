interface AccessoryObjectText {
  value: string | number
  color?: string
}

export type IAccessory = {
  text?: (string | number) | AccessoryObjectText

  icon?: string
  tag?: {
    value: string | number
    bg?: string
  }
}

export function isAccessoryObjectText(obj: any): obj is AccessoryObjectText {
  return obj?.value !== undefined
}
