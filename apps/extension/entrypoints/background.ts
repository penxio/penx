export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id })
  fetch('https://penx.io/api/session')
    .then((r) => r.json())
    .then((d) => {
      console.log('d=======>>>>>>>>>>:', d)
    })
})
