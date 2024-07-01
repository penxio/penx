export type IconifyIconType = {
  name: string | number
  className?: string
}

export function isIconify(icon: any): icon is IconifyIconType {
  return typeof icon === 'object' && icon.name
}
