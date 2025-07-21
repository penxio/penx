import { ReactNode } from 'react'

export type ShortcutModifier = '$mod' | 'cmd' | 'ctrl' | 'opt' | 'shift'

export type ShortcutKey =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '.'
  | ','
  | ';'
  | '='
  | '+'
  | '-'
  | '['
  | ']'
  | '{'
  | '}'
  | '«'
  | '»'
  | '('
  | ')'
  | '/'
  | '\\'
  | "'"
  | '`'
  | '§'
  | '^'
  | '@'
  | '$'
  | 'return'
  | 'delete'
  | 'deleteForward'
  | 'tab'
  | 'arrowUp'
  | 'arrowDown'
  | 'arrowLeft'
  | 'arrowRight'
  | 'pageUp'
  | 'pageDown'
  | 'home'
  | 'end'
  | 'space'
  | 'escape'
  | 'enter'
  | 'backspace'

export type IconifyIconType = {
  name: string | number
  className?: string
}

export interface BaseActionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  icon?: IconifyIconType
  shortcut?: {
    modifiers: ShortcutModifier[]
    key: ShortcutKey
  }
}

interface AccessoryObjectText {
  value: string | number
  color?: string
}

export type IAccessory = {
  text?: (string | number) | AccessoryObjectText
  icon?: IconifyIconType
  tag?: {
    value: string | number
    bg?: string
  }
}

export function isIconify(icon: any): icon is IconifyIconType {
  return typeof icon === 'object' && icon.name
}

export function isAccessoryObjectText(obj: any): obj is AccessoryObjectText {
  return obj?.value !== undefined
}
