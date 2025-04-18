export const setStatusBarColor = (color = '#ffffff') => {
  setTimeout(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      const metaTag = document.querySelector('meta[name="theme-color"]')
      if (metaTag) {
        metaTag.setAttribute('content', color)
      }
    }
  }, 0)
}
