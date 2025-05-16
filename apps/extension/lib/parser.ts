import { Readability } from '@mozilla/readability'
import { parseHTML } from 'linkedom'
import { preParseContent } from './content-handler'

const DEBUG_MODE = false

export const parsePreparedContent = async (url: string, html: string) => {
  let dom: Document | null = parseHTML(html).document
  // Attempt to parse the article
  // console.log('%c=parsePreparedContent', 'color:green', { url, html, dom })

  dom = (await preParseContent(url, dom)) || dom

  const content = await getReadabilityResult(url, html, dom, false)

  // console.log('%c=getReadabilityResult:', 'color:green', content)

  return content
}

async function getReadabilityResult(
  url: string,
  html: string,
  dom: Document,
  isNewsletter?: boolean,
) {
  try {
    const article = new Readability(dom, {
      debug: DEBUG_MODE,
      keepClasses: false,
    }).parse()

    if (article) {
      return article
    }
  } catch (error) {
    console.log('parsing error for url', { url, error })
  }
}
