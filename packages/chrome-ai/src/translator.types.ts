// chrome-translator-api.d.ts

/**
 * Translation model availability status
 */
type TranslatorAvailability = 'available' | 'downloadable' | 'unavailable'

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
interface TranslatorInstance extends EventTarget {
  /**
   * Translate the given text and return the text in the target language
   * @param text The text to be translated
   * @returns A Promise resolving to the translated text
   */
  translate(text: string): Promise<string>

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
interface TranslatorCreateOptions {
  sourceLanguage: string
  targetLanguage: string

  /**
   * Optional monitor callback function to listen for download progress events.
   * The function receives a TranslatorMonitor instance that allows adding event listeners.
   */
  monitor?(monitor: TranslatorMonitor): void
}

/**
 * Translator global interface representing the Chrome built-in Translator API object
 */
interface Translator {
  /**
   * Get the translation model availability for a specified language pair
   * @param options An object containing sourceLanguage and targetLanguage
   * @returns A Promise resolving to the model availability status
   */
  availability(options: {
    sourceLanguage: string
    targetLanguage: string
  }): Promise<TranslatorAvailability>

  /**
   * Create a translator instance; triggers model download automatically if not already downloaded
   * Supports optional monitor callback to observe download progress
   * @param options An object containing sourceLanguage, targetLanguage, and optional monitor callback
   * @returns A Promise resolving to a TranslatorInstance
   */
  create(options: TranslatorCreateOptions): Promise<TranslatorInstance>
}

// Declare the global Translator variable
declare const Translator: Translator

export {
  Translator,
  TranslatorInstance,
  TranslatorAvailability,
  DownloadProgressEvent,
  TranslatorMonitor,
  TranslatorCreateOptions,
}
