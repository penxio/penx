import { constructAPI } from './common'
import { EventType } from './constants'

export interface IClipboard {
  readText: () => Promise<string>
  writeText: (text: string) => Promise<void>
  readImageBase64: () => Promise<string>
  writeImageBase64: (base64: string) => Promise<void>
  readFiles: () => Promise<string[]>
  writeFiles: (files: string[]) => Promise<void>
  readRtf: () => Promise<string>
  writeRtf: (rtf: string) => Promise<void>
  readHtml: () => Promise<string>
  writeHtml: (html: string) => Promise<void>
  writeHtmlAndText: (data: { html: string; text: string }) => Promise<void>
  hasText: () => Promise<boolean>
  hasRtf: () => Promise<boolean>
  hasHtml: () => Promise<boolean>
  hasImage: () => Promise<boolean>
  hasFiles: () => Promise<boolean>
}

export const clipboard: IClipboard = {
  readText: constructAPI<undefined, string>(EventType.ClipboardReadText),
  writeText: constructAPI<string, void>(EventType.ClipboardWriteText),
  readImageBase64: constructAPI<undefined, string>(
    EventType.ClipboardReadImageBase64,
  ),
  writeImageBase64: constructAPI<string, void>(
    EventType.ClipboardWriteImageBase64,
  ),
  readFiles: constructAPI<undefined, string[]>(EventType.ClipboardReadFiles),
  writeFiles: constructAPI<string[], void>(EventType.ClipboardWriteFiles),
  readRtf: constructAPI<undefined, string>(EventType.ClipboardReadRtf),
  writeRtf: constructAPI<string, void>(EventType.ClipboardWriteRtf),
  readHtml: constructAPI<undefined, string>(EventType.ClipboardReadHtml),
  writeHtml: constructAPI<string, void>(EventType.ClipboardWriteHtml),
  writeHtmlAndText: constructAPI<{ html: string; text: string }, void>(
    EventType.ClipboardWriteHtmlAndText,
  ),
  hasText: constructAPI<void, boolean>(EventType.ClipboardHasText),
  hasRtf: constructAPI<void, boolean>(EventType.ClipboardHasRtf),
  hasHtml: constructAPI<void, boolean>(EventType.ClipboardHasHtml),
  hasImage: constructAPI<void, boolean>(EventType.ClipboardHasImage),
  hasFiles: constructAPI<void, boolean>(EventType.ClipboardHasFiles),
}
