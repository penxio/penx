import { EventType } from './constants'

export type PenxAPIResponseMessageEvent<T> = MessageEvent<{
  type: string
  result: T
}>

export type PenxAPIRequestMessageEvent<T> = MessageEvent<{
  type: string
  payload: T
}>

/**
 * Constructs an API function that sends a message to the main thread and returns a promise for the result.
 * @param evtType The event type for sending the message.
 * @param retEvtType The event type for receiving the result.
 * @example
 * ```ts
 * const readText = constructAPI<undefined, string>(EventType.ClipboardReadText, EventType.ClipboardReadTextResult)
 * const writeText = constructAPI<string, void>(EventType.ClipboardWriteText, EventType.ClipboardWriteTextResult)
 * ```
 * @returns A function that takes an optional payload and returns a promise for the result.
 */
export function constructAPI<Payload, Result>(
  evtType: EventType,
  retEvtType?: EventType,
): Exclude<Payload, undefined> extends never
  ? () => Promise<Result>
  : (payload: Payload) => Promise<Result> {
  return ((payload?: Payload) => {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel()
      channel.port1.onmessage = (
        event: PenxAPIResponseMessageEvent<Result>,
      ) => {
        const expectedEvtType = retEvtType ?? evtType
        if (event.data.type === expectedEvtType) {
          resolve(event.data.result)
        } else {
          reject(
            new Error(
              `Unexpected message type: ${event.data.type} (expected: ${expectedEvtType})`,
            ),
          )
        }
      }
      window.parent.postMessage(
        {
          type: evtType,
          payload,
        },
        '*',
        [channel.port2],
      )
    })
  }) as any
}

export function constructAPICallback<Payload, Result>(
  evtType: EventType,
): Exclude<Payload, undefined> extends never
  ? (fn: (result: Result) => void) => void
  : (fn: (result: Result) => void, payload: Payload) => void {
  return (fn: (result: Result) => void, payload?: Payload) => {
    const channel = new MessageChannel()
    channel.port1.onmessage = (event: PenxAPIResponseMessageEvent<Result>) => {
      fn(event.data.result)
    }
    window.parent.postMessage(
      {
        type: evtType,
        payload,
      },
      '*',
      [channel.port2],
    )
  }
}

export function constructAPIExecuter<Payload, Result>(
  evtType: EventType,
  handlerFn: (payload: Payload) => Promise<Result>,
  retEvtType?: EventType,
) {
  return (event: PenxAPIRequestMessageEvent<Payload>) => {
    if (event.data.type === evtType) {
      return handlerFn(event.data.payload).then((result) => {
        event.ports[0].postMessage({
          type: retEvtType ?? evtType,
          result,
        })
      })
    }
  }
}

export function constructAPICallbackExecuter<Payload>(
  evtType: EventType,
  handlerFn: (payload: Payload) => void,
) {
  return (event: PenxAPIRequestMessageEvent<Payload>) => {
    if (event.data.type === evtType) {
      handlerFn(event.data.payload)
    }
  }
}
