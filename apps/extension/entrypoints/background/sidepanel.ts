import { sendMessage } from '@/lib/message'
import { browser } from '#imports'
import { state } from './state'

export async function openSidepanel(tabId: number) {
  try {
    console.log('Side panel opened successfully for tab:', tabId)
    // Open side panel for the current tab
    await browser.sidePanel.open({ tabId: tabId })
    state.isOpen = true
  } catch (error) {
    console.error('Failed to open side panel for tab:', error)
    // Fallback: open side panel without specific tab
    try {
      await browser.sidePanel.open({
        windowId: chrome.windows.WINDOW_ID_CURRENT,
      })
      state.isOpen = true
      console.log('Side panel opened successfully (fallback)')
    } catch (fallbackError) {
      console.error('Failed to open side panel (fallback):', fallbackError)
    }
  }
}

export async function closeSidepanel() {
  try {
    await sendMessage('closeSidePanel', {})
  } catch (error) {
    console.log('=====closeSidePanel error:', error)
  }
  state.isOpen = false
}
