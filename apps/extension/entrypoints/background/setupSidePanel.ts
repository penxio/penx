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
      await toggleSidepanel()
    }
  })
}

async function toggleSidepanel() {
  const isOpen = state.isOpen
  console.log('========isOpen:', isOpen);
  

  if (isOpen) {
    console.log('Closing sidepanel via shortcut')
    await closeSidepanel()
  } else {
    console.log('Opening sidepanel via shortcut')
    // Get the current active tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })

    console.log('=====tabs[0].id:', tabs?.[0]?.id)

    if (tabs[0]?.id) {
      // Send message to content script to simulate user gesture
      try {
        await browser.tabs.sendMessage(tabs[0].id, {
          type: 'TOGGLE_SIDEPANEL',
          action: 'open'
        })
      } catch (error) {
        console.log('Failed to send message to content script:', error)
        // Fallback: try to open directly (might fail due to user gesture requirement)
        await openSidepanel(tabs[0].id)
      }
    }
  }
}

// Handle messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_SIDEPANEL_FROM_CONTENT') {
    console.log('Received open sidepanel request from content script:',  sender?.tab?.id)
    if (sender.tab?.id) {
      // Try to open sidepanel with user gesture context
      openSidepanelWithUserGesture(sender.tab.id)
    }
  }
})

async function openSidepanelWithUserGesture(tabId: number) {
  try {
    console.log('Attempting to open sidepanel with user gesture context for tab:', tabId)
    await browser.sidePanel.open({ tabId: tabId })
    console.log('Side panel opened successfully for tab:', tabId)
    state.isOpen = true
  } catch (error) {
    console.error('Failed to open side panel for tab:', error)
    
    // Fallback: try to open side panel without specific tab
    try {
      await browser.sidePanel.open({
        windowId: chrome.windows.WINDOW_ID_CURRENT,
      })
      console.log('Side panel opened successfully (fallback)')
      state.isOpen = true
    } catch (fallbackError) {
      console.error('Failed to open side panel (fallback):', fallbackError)
      
      // Last resort: show a notification to user
      console.log('All methods failed, user gesture required')
      // We could show a notification here asking user to click the extension icon
      // For now, we'll just log the failure
    }
  }
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
