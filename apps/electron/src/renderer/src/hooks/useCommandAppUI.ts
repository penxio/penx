import { atom, useAtom } from 'jotai'
import { IListItem, LoadingType } from '@penx/extension-api'

type MarketplaceUI = {
  type: 'marketplace'
}

type ClipboardHistoryUI = {
  type: 'clipboard-history'
}

type TodayUI = {
  type: 'today'
}

type DatabaseUI = {
  type: 'database'
}

type LoadingUI = {
  type: 'loading'
  data: LoadingType
}

type MarkdownUI = {
  type: 'markdown'
  content: string
}

type ListUI = {
  type: 'list'
  items: IListItem[]
}

type RenderUI = {
  type: 'render'
  component: any
}

export type CommandAppUI =
  | ListUI
  | MarkdownUI
  | LoadingUI
  | MarketplaceUI
  | TodayUI
  | DatabaseUI
  | ClipboardHistoryUI
  | RenderUI

export const commandUIAtom = atom<CommandAppUI>({} as CommandAppUI)

export function useCommandAppUI() {
  const [ui, setUI] = useAtom(commandUIAtom)

  return {
    ui,
    isList: ui.type === 'list',
    setUI
  }
}
