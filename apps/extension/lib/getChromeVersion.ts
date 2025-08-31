export function getChromeInfo() {
  const ua = navigator.userAgent

  const chromeVersionMatch = ua.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)
  const version = chromeVersionMatch[1] || ''
  return {
    ua,
    version,
    majorVersion: version.split('.')[0] || '',
    hasChromeAI: 'Translator' in self && 'LanguageModel' in self,
  }
}
