import { constructAPI } from './common'
import { EventType } from './constants'

export interface RunAppleScriptOptions {
  humanReadableOutput?: boolean
}

export type RunAppleScriptPayload = {
  script: string
  argsOrOptions?: string[] | RunAppleScriptOptions
  options?: RunAppleScriptOptions
}

export const runAppleScript = constructAPI<RunAppleScriptPayload, string>(
  EventType.RunAppleScript,
  EventType.RunAppleScriptResult,
)
