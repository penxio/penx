import { sendMessage } from '@/lib/message'
import { browser } from '#imports'

let isOpen = false
export function setupSidePanel() {
  console.log('Setting up side panel...')

  // Handle extension icon click to open side panel
  browser.action.onClicked.addListener(async (tab) => {
    if (isOpen) {
      sendMessage('closeSidePanel', {})
      isOpen = false
      return
    }

    isOpen = true
    console.log('Extension icon clicked, opening side panel for tab:', tab.id)
    try {
      // Open side panel for the current tab
      await browser.sidePanel.open({ tabId: tab.id })
      console.log('Side panel opened successfully for tab:', tab.id)
    } catch (error) {
      console.error('Failed to open side panel for tab:', error)
      // Fallback: open side panel without specific tab
      try {
        await browser.sidePanel.open({
          windowId: chrome.windows.WINDOW_ID_CURRENT,
        })
        console.log('Side panel opened successfully (fallback)')
      } catch (fallbackError) {
        console.error('Failed to open side panel (fallback):', fallbackError)
      }
    }
  })
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel-port') {
    let lastHeartbeat = Date.now()

    port.onMessage.addListener((msg) => {
      if (msg.type === 'sidepanel-ready') {
        console.log('[Background] Side Panel is ready')
      }

      if (msg.type === 'sidepanel-heartbeat') {
        lastHeartbeat = msg.timestamp || Date.now()
        console.log(
          '[Background] Heartbeat received:',
          new Date(lastHeartbeat).toISOString(),
        )
        isOpen = true
      }
    })

    port.onDisconnect.addListener(() => {
      console.log(
        '[Background] Side Panel closed, last heartbeat:',
        new Date(lastHeartbeat).toISOString(),
      )
      isOpen = false
    })
  }
})
