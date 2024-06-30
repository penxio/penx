import { type Remote } from '@huakunshen/comlink'
import { ask, confirm, message, open, save } from '@tauri-apps/plugin-dialog'
import { type IDialog } from '../api/client-types'
import { defaultClientAPI, isMain } from '../client'
import { type IDialogServer } from './server-types'

export function constructAPI(api: Remote<IDialogServer>): IDialog {
  return {
    ask: api.dialogAsk,
    confirm: api.dialogConfirm,
    message: api.dialogMessage,
    open: api.dialogOpen,
    save: api.dialogSave,
  }
}
export const comlinkDialog: IDialog = constructAPI(defaultClientAPI)

export const nativeDialog: IDialog = {
  ask: ask,
  confirm: confirm,
  message: message,
  open: open,
  save: save,
}

export const dialog = isMain ? nativeDialog : comlinkDialog
