import { beforeEach } from 'vitest'
import { fakeBrowser } from 'wxt/testing/fake-browser'

// 全局测试设置
beforeEach(() => {
  // 重置 fake browser 状态，确保每个测试都有干净的环境
  // 参考: https://webext-core.aklinker1.io/fake-browser/reseting-state
  fakeBrowser.reset()
})

// Mock browser APIs if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})
