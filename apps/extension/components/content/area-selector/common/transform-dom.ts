function isPenxContent(element: Element) {
  if (
    element.closest('.ne-viewer-body') ||
    document.querySelector('.ne-viewer-body')
  ) {
    return true
  }
  return false
}

export async function transformDOM(domArray: Element[]) {
  const penxDOMIndex: number[] = []

  const clonedDOMArray: Element[] = []

  for (const dom of domArray) {
    if (isPenxContent(dom)) {
      clonedDOMArray.push(dom)
      continue
    }
    const cloneDom = dom.cloneNode(true) as Element
    const div = document.createElement('div')
    if (cloneDom.tagName === 'CODE') {
      const pre = document.createElement('pre')
      pre.appendChild(cloneDom)
      div.appendChild(pre)
    } else {
      div.appendChild(cloneDom)
    }
    clonedDOMArray.push(div)
  }

  for (
    let clonedDOMIndex = 0;
    clonedDOMIndex < clonedDOMArray.length;
    clonedDOMIndex++
  ) {
    let clonedDOM = clonedDOMArray[clonedDOMIndex]

    if (isPenxContent(clonedDOM)) {
      try {
        clonedDOMArray[clonedDOMIndex] = (await transformPenxContent(
          clonedDOM,
        )) as Element
        penxDOMIndex.push(clonedDOMIndex)
        continue
      } catch (error) {
        // If parsing fails, default processing will be performed.
        const div = document.createElement('div')
        div.appendChild(clonedDOM.cloneNode(true))
        clonedDOM = div
      }
    }

    const originDom = domArray[clonedDOMIndex]

    // Replace link with a tag
    const linkElements = clonedDOM.querySelectorAll('a')
    linkElements.forEach((a) => {
      a.setAttribute('href', a.href)
    })

    // Link to replace img tag
    const imgElements = clonedDOM.querySelectorAll('img')
    imgElements.forEach((img) => {
      img.setAttribute('src', img.src)
    })

    // Remove brothers under pre code
    commonCodeBlock(clonedDOM)

    // Processing hexo code
    hexoCodeBlock(clonedDOM)

    await transformVideoToImage(clonedDOM, originDom)

    // Convert canvas to img
    transformCanvasToImage(clonedDOM, originDom)
  }

  return clonedDOMArray.map((item, index) => {
    if (penxDOMIndex.includes(index)) {
      return item
    }
    return transformHTML(item.innerHTML)
  })
}

function transformHTML(html: string): string {
  // Clean the space tags between span tags
  return html.replace(/<\/span> +<span/g, '</span>&nbsp;<span')
}

async function transformPenxContent(element: Element) {
  return new Promise(async (resolve, rejected) => {
    const onMessage = (e: MessageEvent<any>) => {
      if (e.data?.key !== 'tarnsfromPenxContentValue') {
        return
      }
      window.removeEventListener('message', onMessage)
      const result = e.data?.data?.result
      if (!result || !result?.length) {
        transformError('result is empty')
      }
      const title = element.querySelector('#article-title')?.outerHTML
      resolve(`${title || ''}${e.data?.data?.result?.join('\n')}`)
    }

    // Listen for messages
    window.addEventListener('message', onMessage)

    const transformError = (params: any) => {
      window.removeEventListener('message', onMessage)
      rejected(params)
    }

    setTimeout(() => {
      transformError('transform timeout')
    }, 3000)

    await new Promise((resolve1) => {
      let script = document.querySelector(
        '#penx-content-transform-script',
      ) as HTMLScriptElement
      if (script) {
        return resolve1(true)
      }
      script = document.createElement('script') as HTMLScriptElement

      // TODO:fix
      // const file = Chrome.runtime.getURL('penx-transform-script.js');
      const file = 'xxxxx'

      script.id = 'penx-content-transform-script'
      script.setAttribute('src', file)
      document.body.append(script)
      script.onload = () => {
        resolve1(true)
      }
    })

    try {
      const ids: string[] = []
      if (element.classList.contains('ne-viewer-body')) {
        element.childNodes.forEach((item) => {
          const id = (item as Element).id
          if (id) {
            ids.push(id)
          }
        })
      } else if (element.closest('.ne-viewer-body')) {
        const id = findPenxNeTag(element)?.id
        if (id) {
          ids.push(id)
        }
      } else if (element.querySelector('.ne-viewer-body')) {
        element.querySelector('.ne-viewer-body')?.childNodes.forEach((item) => {
          const id = (item as Element).id
          if (id) {
            ids.push(id)
          }
        })
      }

      window.postMessage(
        {
          key: 'tarnsfromPenxContent',
          data: { ids },
        },
        '*',
      )
    } catch (error) {
      transformError(error)
    }
  })
}

function findPenxNeTag(element: Element): any {
  // Checks if the current element starts with a tag "ne"
  if (element.tagName.toLowerCase().startsWith('ne')) {
    return element
  }

  // Find parent element recursively
  if (element.parentNode) {
    return findPenxNeTag(element.parentNode as Element)
  }

  // If no matching tag is found, returns null
  return null
}

function commonCodeBlock(node: Element) {
  const preElements = node.querySelectorAll('pre')
  preElements.forEach((pre) => {
    const codeElement = pre.querySelector('code')
    if (codeElement) {
      const childNodes = pre.childNodes
      const needRemoveNodes: ChildNode[] = []
      const needMergeNodes: ChildNode[] = []
      childNodes.forEach((item) => {
        if ((item as Element)?.tagName === 'CODE' && item !== codeElement) {
          needMergeNodes.push(item)
        }
        if (item !== codeElement) {
          needRemoveNodes.push(item)
        }
      })
      // Remove non-code
      needRemoveNodes.forEach((item) => {
        pre.removeChild(item)
      })
      // Combine multiple codes into one DOM
      needMergeNodes.forEach((item) => {
        codeElement.appendChild(document.createElement('br'))
        item.childNodes.forEach((codeChild) =>
          codeElement.appendChild(codeChild),
        )
      })
    }
  })
}

function hexoCodeBlock(cloneNode: Element) {
  const figures = cloneNode.querySelectorAll('figure')
  const processingCodeBlock = (node: HTMLElement) => {
    const gutter = node.querySelector('td.gutter')
    const code = node.querySelector('td.code')
    if (!gutter || !code) {
      return
    }
    const codeElement = code.querySelector('pre')
    if (codeElement) {
      node.parentNode?.appendChild(codeElement)
    }
    node.parentNode?.removeChild(node)
  }
  figures.forEach((figure) => {
    processingCodeBlock(figure)
  })
  if (figures.length === 0) {
    const tables = cloneNode.querySelectorAll('table')
    tables.forEach((table) => {
      processingCodeBlock(table)
    })
  }
}

async function transformVideoToImage(element: Element, originDom: Element) {
  /*
  const videoMapArray = generateOriginAndCloneDomArray(element, originDom, 'video');

  for (const videoMap of videoMapArray) {
    const rect = videoMap.origin.getBoundingClientRect();
    const canvas = await screenShot({
      x: rect.x,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });

    await new Promise(resolve => {
      const image = document.createElement('img');
      image.src = canvas.toDataURL('image/jpeg');
      videoMap.clone.parentNode?.replaceChild(image, videoMap.clone);

      resolve(true);
    });
  }
  */
}

function transformCanvasToImage(element: Element, originDom: Element) {
  const canvasMapArray = generateOriginAndCloneDomArray(
    element,
    originDom,
    'canvas',
  )

  for (const canvasMap of canvasMapArray) {
    const imageElement = document.createElement('img')
    imageElement.src = (canvasMap.origin as HTMLCanvasElement).toDataURL()
    canvasMap.clone.parentNode?.replaceChild(imageElement, canvasMap.clone)
  }
}

interface IOriginAndCloneDomItem {
  origin: Element
  clone: Element
}

function generateOriginAndCloneDomArray(
  cloneElement: Element,
  originElement: Element,
  name: keyof HTMLElementTagNameMap,
): Array<IOriginAndCloneDomItem> {
  const originDoms = originElement.querySelectorAll(name)
  const cloneDoms = cloneElement.querySelectorAll(name)
  const result: Array<IOriginAndCloneDomItem> = []
  if (originDoms.length < cloneDoms.length) {
    for (let i = 0; i < cloneDoms.length; i++) {
      const cloneDom = cloneDoms[i]
      const originDom = i === 0 ? originElement : originDoms[i - 1]
      result.push({
        origin: originDom,
        clone: cloneDom,
      })
    }
  } else {
    originDoms.forEach((originDom, index) => {
      result.push({
        origin: originDom,
        clone: cloneDoms[index],
      })
    })
  }
  return result
}
