export async function prepareContent() {
  const url = window.location.href

  await scrollPage(url)

  clearExistingBackdrops()

  return prepareContentPostScroll()
}

function prepareContentPostScroll() {
  const contentCopyEl = document.createElement('div')
  contentCopyEl.style.position = 'absolute'
  contentCopyEl.style.left = '-2000px'
  contentCopyEl.style.zIndex = '-2000'
  contentCopyEl.innerHTML = document.body.innerHTML

  // Appending copy of the content to the DOM to enable computed styles capturing ability
  // Without adding that copy to the DOM the `window.getComputedStyle` method will always return undefined.
  document.documentElement.appendChild(contentCopyEl)

  Array.from(contentCopyEl.getElementsByTagName('*')).forEach(
    prepareContentPostItem,
  )

  /*
   * Grab head and body separately as using clone on entire document into a div
   * removes the head and body tags while grabbing html in them. Instead we
   * capture them separately and concatenate them here with head and body tags
   * preserved.
   */
  const contentCopyHtml = `<html><head>${document.head.innerHTML}</head><body>${contentCopyEl.innerHTML}</body></html>`
  // Cleaning up the copy element
  contentCopyEl.remove()
  return contentCopyHtml
}

function prepareContentPostItem(itemEl) {
  const lowerTagName = itemEl.tagName.toLowerCase()

  /*
  if (lowerTagName === 'iframe') {
    const frameHtml = iframes[itemEl.src]
    if (!frameHtml) return

    const containerEl = document.createElement('div')
    containerEl.className = 'omnivore-instagram-embed'
    containerEl.innerHTML = frameHtml

    const parentEl = itemEl.parentNode
    if (!parentEl) return

    parentEl.replaceChild(containerEl, itemEl)

    return
  }
  */

  if (lowerTagName === 'img' || lowerTagName === 'image') {
    // Removing blurred images since they are mostly the copies of lazy loaded ones
    const style = window.getComputedStyle(itemEl)
    const filter = style.getPropertyValue('filter')
    if (filter.indexOf('blur(') === -1) return
    itemEl.remove()
    return
  }

  const style = window.getComputedStyle(itemEl)
  const backgroundImage = style.getPropertyValue('background-image')

  // convert all nodes with background image to img nodes
  const noBackgroundImage = !backgroundImage || backgroundImage === 'none'
  if (!noBackgroundImage) return

  const filter = style.getPropertyValue('filter')
  // avoiding image nodes with a blur effect creation
  if (filter && filter.indexOf('blur(') !== -1) {
    itemEl.remove()
    return
  }

  // Replacing element only of there are no content inside, b/c might remove important div with content.
  // Article example: http://www.josiahzayner.com/2017/01/genetic-designer-part-i.html
  // DIV with class "content-inner" has `url("https://resources.blogblog.com/blogblog/data/1kt/travel/bg_container.png")` background image.

  if (itemEl.src) return
  if (itemEl.innerHTML.length > 24) return

  const BI_SRC_REGEXP = /url\("(.+?)"\)/gi
  const matchedSRC = BI_SRC_REGEXP.exec(backgroundImage)
  // Using "g" flag with a regex we have to manually break down lastIndex to zero after every usage
  // More details here: https://stackoverflow.com/questions/1520800/why-does-a-regexp-with-global-flag-give-wrong-results
  BI_SRC_REGEXP.lastIndex = 0

  const targetSrc = matchedSRC && matchedSRC[1]
  if (!targetSrc) return

  const imgEl = document.createElement('img')
  imgEl.src = targetSrc
  const parentEl = itemEl.parentNode
  if (!parentEl) return

  parentEl.replaceChild(imgEl, itemEl)
}

async function scrollPage(url: string) {
  const scrollingEl = document.scrollingElement || document.body
  const lastScrollPos = scrollingEl.scrollTop
  const currentScrollHeight = scrollingEl.scrollHeight

  /* add blurred overlay while scrolling */
  clearExistingBackdrops()

  const backdropEl = createBackdrop()
  document.body.appendChild(backdropEl)

  /*
   * check below compares scrollTop against initial page height to handle
   * pages with infinite scroll else we shall be infinitely scrolling here.
   * stop scrolling if the url has changed in the meantime.
   */
  while (
    scrollingEl.scrollTop <= currentScrollHeight - 500 &&
    window.location.href === url
  ) {
    const prevScrollTop = scrollingEl.scrollTop
    scrollingEl.scrollTop += 500
    /* sleep upon scrolling position change for event loop to handle events from scroll */
    await new Promise((resolve) => {
      setTimeout(resolve, 10)
    })
    if (scrollingEl.scrollTop === prevScrollTop) {
      /* break out scroll loop if we are not able to scroll for any reason */
      // console.log('breaking out scroll loop', scrollingEl.scrollTop, currentScrollHeight);
      break
    }
  }
  scrollingEl.scrollTop = lastScrollPos
  /* sleep upon scrolling position change for event loop to handle events from scroll */
  await new Promise((resolve) => {
    setTimeout(resolve, 10)
  })
}

function clearExistingBackdrops() {
  console.log('clearExistingBackdrops->')
  const backdropCol = document.querySelectorAll('.webext-acweb-backdrop')
  for (let i = 0; i < backdropCol.length; i++) {
    const backdropEl = backdropCol[i] as any
    backdropEl.style.setProperty('opacity', '0', 'important')
  }

  setTimeout(() => {
    for (let i = 0; i < backdropCol.length; i++) {
      backdropCol[i].remove()
    }
  }, 0.5e3)
}

function createBackdrop() {
  console.log('createBackdrop==>')
  const backdropEl = document.createElement('div')
  backdropEl.className = 'webext-acweb-backdrop'
  backdropEl.style.cssText = `all: initial !important;
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    z-index: 99999 !important;
    background: #fff !important;
    opacity: 0.8 !important;
    transition: opacity 0.3s !important;
    -webkit-backdrop-filter: blur(4px) !important;
    backdrop-filter: blur(4px) !important;
  `
  return backdropEl
}
