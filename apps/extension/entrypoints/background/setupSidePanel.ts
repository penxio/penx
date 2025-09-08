import { sendMessage } from '@/lib/message'
import { browser } from '#imports'
import { closeSidepanel, openSidepanel } from './sidepanel'
import { state } from './state'

export async function setupSidePanel() {
  console.log('Setting up side panel...')

  state.isOpen = false

  // Handle extension icon click to open side panel
  browser.action.onClicked.addListener(async (tab) => {
    const isOpen = state.isOpen

    if (isOpen) {
      return closeSidepanel()
    }

    console.log('Extension icon clicked, opening side panel for tab:', tab.id)
    openSidepanel(tab.id!)
  })

  // Handle keyboard shortcut to toggle side panel
  browser.commands.onCommand.addListener(async (command) => {
    if (command === 'toggle-sidepanel') {
      console.log('Toggle sidepanel shortcut triggered')
      // await toggleSidepanel()

      if (state.isOpen) {
        await closeSidepanel()
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          openSidepanel(tabs[0].id!)
        })
      }
    }

    if (command === 'toggle-panel') {
      sendMessage('togglePanel', {})
    }
  })
}

browser.runtime.onConnect.addListener((port) => {
  // only handle sidepanel-port
  if (port.name !== 'sidepanel-port') return

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
      state.isOpen = true
    }
  })

  port.onDisconnect.addListener(() => {
    console.log(
      '[Background] Side Panel closed, last heartbeat:',
      new Date(lastHeartbeat).toISOString(),
    )
    state.isOpen = false
  })
})
