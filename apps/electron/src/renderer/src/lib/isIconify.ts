export type IconifyIconType = {
  name: string
  className: string
}

export function isIconify(icon: any): icon is IconifyIconType {
  return typeof icon === 'object' && icon.name
}
