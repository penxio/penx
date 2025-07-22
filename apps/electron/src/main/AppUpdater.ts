import { app, dialog, MessageBoxReturnValue, shell } from 'electron'
import log from 'electron-log'
import { autoUpdater, ProgressInfo, UpdateInfo } from 'electron-updater'

interface ReleaseNotesInfo extends UpdateInfo {
  releaseNotesUrl?: string
}

export class AppUpdater {
  // Optionally maintain progress listeners or UI references here
  // private progressWindow?: BrowserWindow;

  constructor() {
    // Configure logging
    log.transports.file.level = 'info'
    autoUpdater.logger = log

    // Configure autoUpdater options
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true

    // Bind event listeners
    this.bindEvents()
  }

  private bindEvents(): void {
    // Update check started
    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for updates...')
    })

    // Update available
    autoUpdater.on('update-available', (info: UpdateInfo) => {
      log.info('Update available:', info)
      this.showUpdateDialog(info as ReleaseNotesInfo)
    })

    // No updates available
    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
      log.info('No updates available:', info)
    })

    // Download progress
    autoUpdater.on('download-progress', (progress: ProgressInfo) => {
      const speed = (progress.bytesPerSecond / 1024 / 1024).toFixed(2)
      log.info(
        `Download speed: ${speed} MB/s - Downloaded ${progress.percent.toFixed(
          2,
        )}%`,
      )
      this.updateProgressBar(progress.percent)
    })

    // Update downloaded
    autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
      log.info('Update downloaded:', info)
      this.showInstallDialog(info)
    })

    // Update error
    autoUpdater.on('error', (error: Error) => {
      log.error('Update error:', error)
      // this.showErrorDialog(error)
    })
  }

  private async showUpdateDialog(info: ReleaseNotesInfo): Promise<void> {
    const result: MessageBoxReturnValue = await dialog.showMessageBox({
      type: 'info',
      title: 'New Version Available',
      message: `A new version (${info.version}) is available. Would you like to download it now?`,
      detail:
        (typeof info.releaseNotes === 'string' ? info.releaseNotes : '') ||
        'This update includes feature improvements and bug fixes.',
      buttons: ['Download Now', 'Remind Me Later', 'View Details'],
      defaultId: 0,
      cancelId: 1,
    })

    switch (result.response) {
      case 0:
        autoUpdater.downloadUpdate()
        break
      case 1:
        // Remind me later, do nothing
        break
      case 2:
        // View details
        if (info.releaseNotesUrl) {
          shell.openExternal(info.releaseNotesUrl)
        }
        break
    }
  }

  private async showInstallDialog(info: UpdateInfo): Promise<void> {
    const result: MessageBoxReturnValue = await dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: `New version (${info.version}) has been downloaded.`,
      detail: 'The app will restart to install the update.',
      buttons: ['Restart Now', 'Restart Later'],
      defaultId: 0,
      cancelId: 1,
    })

    if (result.response === 0) {
      autoUpdater.quitAndInstall()
    }
  }

  private async showErrorDialog(error: Error): Promise<void> {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Update Failed',
      message: 'An error occurred while checking for updates.',
      detail:
        error.message || 'Please check your network connection and try again.',
      buttons: ['OK'],
    })
  }

  private updateProgressBar(percent: number): void {
    // If you implement a progress UI, handle it here, e.g.:
    // this.progressWindow?.webContents.send('update-progress', percent)
  }

  // Trigger update check (e.g., at launch)
  public checkForUpdates(): void {
    if (process.env.NODE_ENV === 'development') {
      log.info('Skipping update check in development mode')
      return
    }
    autoUpdater.checkForUpdates()
  }

  // Manual trigger for update check
  public checkForUpdatesManually() {
    return autoUpdater.checkForUpdates()
  }
}
