import { IconifyIconType } from './icon.types'

interface BaseAction {
  icon: IconifyIconType
  title?: string
}
export interface OpenInBrowser extends BaseAction {
  type: 'OpenInBrowser'
  url: string
}

export function isOpenInBrowser(obj: any): obj is OpenInBrowser {
  return obj.type === 'OpenInBrowser'
}

export interface CopyToClipboard extends BaseAction {
  type: 'CopyToClipboard'
  content: string
}

export function isCopyToClipboard(obj: any): obj is CopyToClipboard {
  return obj.type === 'CopyToClipboard'
}

export interface ReleaseExtension extends BaseAction {
  type: 'ReleaseExtension'
  location: string
}

export function isReleaseExtension(obj: any): obj is ReleaseExtension {
  return obj.type === 'ReleaseExtension'
}

export interface SubmitForm extends BaseAction {
  type: 'SubmitForm'
  onSubmit: (values: any) => Promise<void> | void
}

export function isSubmitForm(obj: any): obj is SubmitForm {
  return obj.type === 'SubmitForm'
}

export interface CustomAction extends BaseAction {
  type: 'CustomAction'
  onSelect: () => Promise<void> | void
}

export function isCustomAction(obj: any): obj is CustomAction {
  return obj.type === 'CustomAction'
}

export type ActionItem = OpenInBrowser | CopyToClipboard | SubmitForm | CustomAction
