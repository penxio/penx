import { constructAPICallback } from './common'
import { EventType } from './constants'

// export function _onSearchChange(fn: (value: string) => void) {
//   const channel = new MessageChannel()

//   channel.port1.onmessage = (
//     event: MessageEvent<{ type: string; value: string }>,
//   ) => {
//     fn(event.data.value)
//   }

//   // TODO: handle any
//   self.postMessage(
//     {
//       type: EventType.InitOnSearchChange,
//     },
//     [channel.port2] as any,
//   )
// }

// export function onSearchChange(fn: (value: string) => void) {
//   constructAPICallback<undefined, string>(EventType.InitOnSearchChange, (result => {
//     fn(event.data.value)
//   }))
// }

export const onSearchChange = constructAPICallback<undefined, string>(
  EventType.InitOnSearchChange,
)
