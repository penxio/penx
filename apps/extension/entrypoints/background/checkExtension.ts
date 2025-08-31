import ReconnectingEventSource from 'reconnecting-eventsource'
import { APP_LOCAL_HOST } from '@penx/constants'

export async function checkExtension() {
  const es = new ReconnectingEventSource(
    `${APP_LOCAL_HOST}/api/extension/check`,
    {
      max_retry_time: 5000,
    },
  )

  es.onmessage = (event) => {
    console.log('========>>>>>>>>>>>', event.data)
  }
es.addEventListener("message", (e) => {
  console.log(e.data);
});
}
