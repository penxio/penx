/**
 * original:
 if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (!window.$__IS_ACTION_OPEN__) {
        window.parent.postMessage({ type: 'escape' }, '*')
      }
    }
  })
}
 
 */
export const escAction = `
"undefined"!=typeof document&&document.addEventListener("keydown",e=>{"Escape"!==e.key||window.$__IS_ACTION_OPEN__||window.parent.postMessage({type:"escape"},"*")});
`
