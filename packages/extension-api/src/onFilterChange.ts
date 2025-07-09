import { constructAPICallback } from './common'
import { EventType } from './constants'

// export function onFilterChange(fn: (value: Record<string, any>) => void) {
//   const channel = new MessageChannel()

//   channel.port1.onmessage = (
//     event: MessageEvent<{ type: string; value: Record<string, any> }>,
//   ) => {
//     fn(event.data.value)
//   }

//   // TODO: handle any
//   self.postMessage(
//     {
//       type: EventType.InitOnFilterChange,
//     },
//     [channel.port2] as any,
//   )
// }

export const onFilterChange = constructAPICallback<
  undefined,
  Record<string, any>
>(EventType.InitOnFilterChange)
