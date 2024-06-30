/**
 * This file is the server-side implementation of Tauri API Adapter
 * Code from here should run in regular Tauri webview environment, not iframe or web worker. i.e. needs access to Tauri APIs (invoke is called here)
 * Client from iframe or web worker can call APIs exposed from here
 */
import { Channel, invoke, transformCallback } from '@tauri-apps/api/core'
import {
  emit,
  emitTo,
  once,
  type EventCallback,
  type EventName,
  type EventTarget,
} from '@tauri-apps/api/event'
import {
  appCacheDir,
  appConfigDir,
  appDataDir,
  appLocalDataDir,
  appLogDir,
  audioDir,
  basename,
  cacheDir,
  configDir,
  dataDir,
  delimiter,
  desktopDir,
  dirname,
  documentDir,
  downloadDir,
  executableDir,
  extname,
  fontDir,
  homeDir,
  isAbsolute,
  join,
  localDataDir,
  normalize,
  pictureDir,
  publicDir,
  resolve,
  resolveResource,
  resourceDir,
  runtimeDir,
  sep,
  tempDir,
  templateDir,
  videoDir,
} from '@tauri-apps/api/path'
import {
  ask as dialogAsk,
  confirm as dialogConfirm,
  message as dialogMessage,
  open as dialogOpen,
  save as dialogSave,
} from '@tauri-apps/plugin-dialog'
import {
  copyFile as fsCopyFile,
  create as fsCreate,
  exists as fsExists,
  lstat as fsLstat,
  mkdir as fsMkdir,
  readDir as fsReadDir,
  readFile as fsReadFile,
  readTextFile as fsReadTextFile,
  remove as fsRemove,
  rename as fsRename,
  stat as fsStat,
  truncate as fsTruncate,
  writeFile as fsWriteFile,
  writeTextFile as fsWriteTextFile,
  type WriteFileOptions,
} from '@tauri-apps/plugin-fs'
import {
  active as notificationActive,
  cancel as notificationCancel,
  cancelAll as notificationCancelAll,
  channels as notificationChannels,
  createChannel as notificationCreateChannel,
  isPermissionGranted as notificationIsPermissionGranted,
  onAction as notificationOnAction,
  onNotificationReceived as notificationOnNotificationReceived,
  pending as notificationPending,
  registerActionTypes as notificationRegisterActionTypes,
  removeActive as notificationRemoveActive,
  removeAllActive as notificationRemoveAllActive,
  removeChannel as notificationRemoveChannel,
  requestPermission as notificationRequestPermission,
  sendNotification as notificationSendNotification,
} from '@tauri-apps/plugin-notification'
import {
  arch as osArch,
  eol as osEol,
  exeExtension as osExeExtension,
  family as osFamily,
  hostname as osHostname,
  locale as osLocale,
  platform as osPlatform,
  version as osVersion,
} from '@tauri-apps/plugin-os'
import clipboard from 'tauri-plugin-clipboard-api'
import {
  executeAppleScript as shellExecuteAppleScript,
  executeBashScript as shellExecuteBashScript,
  executeNodeScript as shellExecuteNodeScript,
  executePowershellScript as shellExecutePowershellScript,
  executePythonScript as shellExecutePythonScript,
  executeZshScript as shellExecuteZshScript,
  hasCommand as shellHasCommand,
  likelyOnWindows as shellLikelyOnWindows,
  open as shellOpen,
  type ChildProcess,
  type CommandEvent,
  type InternalSpawnOptions,
  type IOPayload,
} from 'tauri-plugin-shellx-api'
import type { FetchOptions, FetchSendResponse } from './api/fetch/types'
import type {
  IClipboardServer,
  IDialogServer,
  IEventServer,
  IFetchServer,
  IFsServer,
  IFullAPI,
  INotificationServer,
  IOsServer,
  IPathServer,
  IShellServer,
} from './api/server-types'

/* -------------------------------------------------------------------------- */
/*                                    Event                                   */
/* -------------------------------------------------------------------------- */
export const eventApi: IEventServer = {
  eventRawListen<T>(
    event: EventName,
    target: EventTarget,
    handler: EventCallback<T>,
  ): Promise<number> {
    return invoke<number>('plugin:event|listen', {
      event,
      target,
      handler: transformCallback(handler),
    })
  },
  eventRawUnlisten: (event: string, eventId: number): Promise<void> =>
    invoke<void>('plugin:event|unlisten', {
      event,
      eventId,
    }),
  eventEmit: emit,
  eventEmitTo: emitTo,
  eventOnce: once,
}

/* -------------------------------------------------------------------------- */
/*                                  Clipboard                                 */
/* -------------------------------------------------------------------------- */
export const clipboardApi: IClipboardServer = {
  clipboardReadText: clipboard.readText,
  clipboardWriteText: clipboard.writeText,
  clipboardReadImageBase64: clipboard.readImageBase64,
  clipboardReadImageBinary: clipboard.readImageBinary,
  clipboardWriteImageBase64: clipboard.writeImageBase64,
  clipboardWriteImageBinary: clipboard.writeImageBinary,
  clipboardReadFiles: clipboard.readFiles,
  clipboardWriteFiles: clipboard.writeFiles,
  clipboardReadRtf: clipboard.readRtf,
  clipboardWriteRtf: clipboard.writeRtf,
  clipboardReadHtml: clipboard.readHtml,
  clipboardWriteHtml: clipboard.writeHtml,
  clipboardWriteHtmlAndText: clipboard.writeHtmlAndText,
  clipboardHasText: clipboard.hasText,
  clipboardHasRTF: clipboard.hasRTF,
  clipboardHasHTML: clipboard.hasHTML,
  clipboardHasImage: clipboard.hasImage,
  clipboardHasFiles: clipboard.hasFiles,
  clipboardStartMonitor: clipboard.startMonitor,
}

/* -------------------------------------------------------------------------- */
/*                                   Dialog                                   */
/* -------------------------------------------------------------------------- */
export const dialogApi: IDialogServer = {
  dialogAsk,
  dialogConfirm,
  dialogMessage,
  dialogOpen,
  dialogSave,
}

/* -------------------------------------------------------------------------- */
/*                                Notification                                */
/* -------------------------------------------------------------------------- */
export const notificationApi: INotificationServer = {
  notificationIsPermissionGranted,
  notificationRequestPermission,
  notificationSendNotification,
  notificationRegisterActionTypes,
  notificationPending,
  notificationCancel,
  notificationCancelAll,
  notificationActive,
  notificationRemoveActive,
  notificationRemoveAllActive,
  notificationCreateChannel,
  notificationRemoveChannel,
  notificationChannels,
  notificationOnNotificationReceived,
  notificationOnAction,
}

/* -------------------------------------------------------------------------- */
/*                                 File System                                */
/* -------------------------------------------------------------------------- */
export const fsApi: IFsServer = {
  fsReadDir,
  fsReadFile,
  fsReadTextFile,
  fsStat,
  fsLstat,
  fsExists,
  fsMkdir,
  fsCreate,
  fsCopyFile,
  fsRemove,
  fsRename,
  fsTruncate,
  fsWriteFile,

  // official api can't create dot file
  fsWriteTextFile: async (path: string | URL, data: string, options?: WriteFileOptions) => {
    if (typeof path === 'string') {
      if (/(\\\.|\/\.)\w+$/.test(path)) {
        await invoke('create_dot_file', {
          filePath: path,
          codeContent: data,
        })
        return
      }
    }
    return fsWriteTextFile(path, data, options)
  },
}

/* -------------------------------------------------------------------------- */
/*                                     OS                                     */
/* -------------------------------------------------------------------------- */
export const osApi: IOsServer = {
  osPlatform,
  osArch,
  osExeExtension,
  osFamily,
  osHostname,
  osEol: () => Promise.resolve(osEol()),
  osVersion,
  osLocale,
}

/* -------------------------------------------------------------------------- */
/*                                    Shell                                   */
/* -------------------------------------------------------------------------- */
export const shellApi: IShellServer = {
  shellExecute: (
    program: string,
    args: string[],
    options: InternalSpawnOptions,
  ): Promise<ChildProcess<IOPayload>> =>
    invoke<ChildProcess<IOPayload>>('plugin:shellx|execute', {
      program: program,
      args: args,
      options: options,
    }),
  shellKill: (pid: number) =>
    invoke<void>('plugin:shellx|kill', {
      cmd: 'killChild',
      pid: pid,
    }),
  shellStdinWrite: (buffer: string | number[], pid: number) =>
    invoke('plugin:shellx|stdin_write', {
      buffer: buffer,
      pid: pid,
    }),
  shellOpen,
  shellRawSpawn: <O extends IOPayload>(
    program: string,
    args: string[],
    options: InternalSpawnOptions,
    cb: (evt: CommandEvent<O>) => void,
  ): Promise<number> => {
    const onEvent = new Channel<CommandEvent<O>>()
    onEvent.onmessage = cb
    return invoke<number>('plugin:shellx|spawn', {
      program: program,
      args: args,
      options: options,
      onEvent,
    })
  },
  shellExecuteBashScript,
  shellExecutePowershellScript,
  shellExecuteAppleScript,
  shellExecutePythonScript,
  shellExecuteZshScript,
  shellExecuteNodeScript,
  shellHasCommand,
  shellLikelyOnWindows,
}

/* -------------------------------------------------------------------------- */
/*                                    Fetch                                   */
/* -------------------------------------------------------------------------- */
export const fetchApi: IFetchServer = {
  fetchRawFetch: (options: FetchOptions) => invoke<number>('plugin:http|fetch', options),
  fetchFetchCancel: (rid: number) => invoke<void>('plugin:http|fetch_cancel', { rid }),
  fetchFetchSend: (rid: number) => invoke<FetchSendResponse>('plugin:http|fetch_send', { rid }),
  fetchFetchReadBody: (rid: number) =>
    invoke<ArrayBuffer | number[]>('plugin:http|fetch_read_body', { rid }),
}

/**
 * path
 */

export const pathApi: IPathServer = {
  appCacheDir,
  appConfigDir,
  appDataDir,
  appLocalDataDir,
  appLogDir,
  audioDir,
  basename,
  cacheDir,
  configDir,
  dataDir,
  delimiter,
  desktopDir,
  dirname,
  documentDir,
  downloadDir,
  executableDir,
  extname,
  fontDir,
  homeDir,
  isAbsolute,
  join,
  localDataDir,
  normalize,
  pictureDir,
  publicDir,
  resolve,
  resolveResource,
  resourceDir,
  runtimeDir,
  sep,
  tempDir,
  templateDir,
  videoDir,
}

export const defaultServerAPI: IFullAPI = {
  ...clipboardApi,
  ...dialogApi,
  ...notificationApi,
  ...fsApi,
  ...osApi,
  ...shellApi,
  ...fetchApi,
  ...eventApi,
  ...pathApi,
}
