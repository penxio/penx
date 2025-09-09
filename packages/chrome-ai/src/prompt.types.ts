// chrome-translator-api.d.ts

/**
 * Translation model availability status
 */
type LanguageModelAvailability = 'available' | 'downloadable' | 'unavailable'

/**
 * Download progress event type, progress ranges from 0 to 1
 */
interface DownloadProgressEvent extends Event {
  readonly progress: number
  readonly loaded?: number // optional, as your example uses e.loaded
}

/**
 * Monitor interface used for observing Translator download events
 */
interface TranslatorMonitor extends EventTarget {
  addEventListener(
    type: 'downloadprogress' | 'downloadcomplete',
    listener: (event: DownloadProgressEvent | Event) => void,
  ): void
  removeEventListener(
    type: 'downloadprogress' | 'downloadcomplete',
    listener: (event: DownloadProgressEvent | Event) => void,
  ): void
}

/**
 * Translator instance interface, representing a specific translator
 */
interface LanguageModelInstance extends EventTarget {
  /**
   * Translate the given text and return the text in the target language
   * @param text The text to be translated
   * @returns A Promise resolving to the translated text
   */
  promptStreaming(text: string): ReadableStream<string>

  addEventListener(
    type: 'downloadprogress',
    listener: (event: DownloadProgressEvent) => void,
  ): void

  addEventListener(
    type: 'downloadcomplete',
    listener: (event: Event) => void,
  ): void

  removeEventListener(
    type: 'downloadprogress' | 'downloadcomplete',
    listener: (event: DownloadProgressEvent | Event) => void,
  ): void
}

/**
 * Options parameter for Translator.create method, includes optional monitor callback
 */
interface CreateOptions {
  initialPrompts?: any
  topK?: any
  temperature?: any
  signal?: any

  /**
   * Optional monitor callback function to listen for download progress events.
   * The function receives a TranslatorMonitor instance that allows adding event listeners.
   */
  monitor?(monitor: TranslatorMonitor): void
}

export interface ILanguageModel {
  availability(): Promise<LanguageModelAvailability>

  create(options: CreateOptions): Promise<LanguageModelInstance>

  params(): any
}

export type IPromptMessage = {
  role: 'user' | 'system'
  content: string
}
