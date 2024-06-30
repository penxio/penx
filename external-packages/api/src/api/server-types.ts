import type {
  EventCallback,
  EventName,
  Options as EventOptions,
  EventTarget,
  UnlistenFn,
} from '@tauri-apps/api/event'
import type {
  IClipboard,
  IDialog,
  IEventInternal,
  IFetch,
  IFs,
  INotification,
  IOs,
  IPath,
  IShellInternal,
} from '../api/client-types'

export interface IEventServer {
  eventRawListen<T>(
    event: EventName,
    target: EventTarget,
    handler: EventCallback<any>,
  ): Promise<number>
  eventRawUnlisten: IEventInternal['rawUnlisten']
  eventEmit: IEventInternal['emit']
  eventEmitTo: IEventInternal['emitTo']
  eventOnce<T>(
    event: EventName,
    handler: EventCallback<any>,
    options?: EventOptions,
  ): Promise<UnlistenFn>
}

export interface IClipboardServer {
  clipboardReadText: IClipboard['readText']
  clipboardWriteText: IClipboard['writeText']
  clipboardReadImageBase64: IClipboard['readImageBase64']
  clipboardReadImageBinary: IClipboard['readImageBinary']
  clipboardWriteImageBase64: IClipboard['writeImageBase64']
  clipboardWriteImageBinary: IClipboard['writeImageBinary']
  clipboardReadFiles: IClipboard['readFiles']
  clipboardWriteFiles: IClipboard['writeFiles']
  clipboardReadRtf: IClipboard['readRtf']
  clipboardWriteRtf: IClipboard['writeRtf']
  clipboardReadHtml: IClipboard['readHtml']
  clipboardWriteHtml: IClipboard['writeHtml']
  clipboardWriteHtmlAndText: IClipboard['writeHtmlAndText']
  clipboardHasText: IClipboard['hasText']
  clipboardHasRTF: IClipboard['hasRTF']
  clipboardHasHTML: IClipboard['hasHTML']
  clipboardHasImage: IClipboard['hasImage']
  clipboardHasFiles: IClipboard['hasFiles']
  clipboardStartMonitor: IClipboard['startMonitor']
}

export interface INotificationServer {
  notificationSendNotification: INotification['sendNotification']
  notificationRequestPermission: INotification['requestPermission']
  notificationIsPermissionGranted: INotification['isPermissionGranted']
  notificationRegisterActionTypes: INotification['registerActionTypes']
  notificationPending: INotification['pending']
  notificationCancel: INotification['cancel']
  notificationCancelAll: INotification['cancelAll']
  notificationActive: INotification['active']
  notificationRemoveActive: INotification['removeActive']
  notificationRemoveAllActive: INotification['removeAllActive']
  notificationCreateChannel: INotification['createChannel']
  notificationRemoveChannel: INotification['removeChannel']
  notificationChannels: INotification['channels']
  notificationOnNotificationReceived: INotification['onNotificationReceived']
  notificationOnAction: INotification['onAction']
}

export interface IDialogServer {
  dialogAsk: IDialog['ask']
  dialogConfirm: IDialog['confirm']
  dialogMessage: IDialog['message']
  dialogOpen: IDialog['open']
  dialogSave: IDialog['save']
}

export interface IFsServer {
  fsReadDir: IFs['readDir']
  fsReadFile: IFs['readFile']
  fsReadTextFile: IFs['readTextFile']
  fsStat: IFs['stat']
  fsLstat: IFs['lstat']
  fsExists: IFs['exists']
  fsMkdir: IFs['mkdir']
  fsCreate: IFs['create']
  fsCopyFile: IFs['copyFile']
  fsRemove: IFs['remove']
  fsRename: IFs['rename']
  fsTruncate: IFs['truncate']
  fsWriteFile: IFs['writeFile']
  fsWriteTextFile: IFs['writeTextFile']
}

export interface IOsServer {
  osPlatform: IOs['platform']
  osArch: IOs['arch']
  osExeExtension: IOs['exeExtension']
  osFamily: IOs['family']
  osHostname: IOs['hostname']
  osEol: IOs['eol']
  osVersion: IOs['version']
  osLocale: IOs['locale']
}

export interface IShellServer {
  shellExecute: IShellInternal['execute']
  shellKill: IShellInternal['kill']
  shellStdinWrite: IShellInternal['stdinWrite']
  shellOpen: IShellInternal['open']
  shellRawSpawn: IShellInternal['rawSpawn']
  shellExecuteBashScript: IShellInternal['executeBashScript']
  shellExecutePowershellScript: IShellInternal['executePowershellScript']
  shellExecuteAppleScript: IShellInternal['executeAppleScript']
  shellExecutePythonScript: IShellInternal['executePythonScript']
  shellExecuteZshScript: IShellInternal['executeZshScript']
  shellExecuteNodeScript: IShellInternal['executeNodeScript']
  shellHasCommand: IShellInternal['hasCommand']
  shellLikelyOnWindows: IShellInternal['likelyOnWindows']
}

export interface IFetchServer {
  fetchRawFetch: IFetch['rawFetch']
  fetchFetchCancel: IFetch['fetchCancel']
  fetchFetchSend: IFetch['fetchSend']
  fetchFetchReadBody: IFetch['fetchReadBody']
}

export interface IPathServer {
  appCacheDir: IPath['appCacheDir']
  appConfigDir: IPath['appConfigDir']
  appDataDir: IPath['appDataDir']
  appLocalDataDir: IPath['appLocalDataDir']
  appLogDir: IPath['appLogDir']
  audioDir: IPath['audioDir']
  basename: IPath['basename']
  cacheDir: IPath['cacheDir']
  configDir: IPath['configDir']
  dataDir: IPath['dataDir']
  delimiter: IPath['delimiter']
  desktopDir: IPath['desktopDir']
  dirname: IPath['dirname']
  documentDir: IPath['documentDir']
  downloadDir: IPath['downloadDir']
  executableDir: IPath['executableDir']
  extname: IPath['extname']
  fontDir: IPath['fontDir']
  homeDir: IPath['homeDir']
  isAbsolute: IPath['isAbsolute']
  join: IPath['join']
  localDataDir: IPath['localDataDir']
  normalize: IPath['normalize']
  pictureDir: IPath['pictureDir']
  publicDir: IPath['publicDir']
  resolve: IPath['resolve']
  resolveResource: IPath['resolveResource']
  resourceDir: IPath['resourceDir']
  runtimeDir: IPath['runtimeDir']
  sep: IPath['sep']
  tempDir: IPath['tempDir']
  templateDir: IPath['templateDir']
  videoDir: IPath['videoDir']
}

/**
 * IFullAPI defines all APIs implemented in this package combined together
 * @example
 * ```ts
 * const clientAPI = getApiClient<IFullAPI>(window.parent)
 * ```
 */
export type IFullAPI = IClipboardServer &
  INotificationServer &
  IDialogServer &
  IFsServer &
  IShellServer &
  IPathServer &
  IOsServer &
  IFetchServer &
  IEventServer
