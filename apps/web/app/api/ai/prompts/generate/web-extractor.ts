import axios from 'axios'
import * as cheerio from 'cheerio'
import { ExtractResult, PostLink } from './types'

export class WebExtractor {
  /**
   * Extract web content from URL
   * @param url Target webpage URL
   * @returns Extraction result containing HTML content
   */
  async extractPostDirectory(url: string): Promise<ExtractResult> {
    try {
      // Set realistic request headers to mimic browser behavior
      const headers = {
        // 'User-Agent':
        //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        // Accept:
        //   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        // 'Accept-Language': 'en-US,en;q=0.9',
        // 'Cache-Control': 'no-cache',
        // Pragma: 'no-cache',
        // Referer: 'https://www.google.com/',
        // 'Accept-Encoding': 'gzip, deflate, br',
        // Connection: 'keep-alive',
      }

      // Fetch webpage content using axios
      const response = await axios.get(url, { headers, timeout: 10000 })
      const html = response.data

      if (typeof html !== 'string') {
        throw new Error('Received non-text response')
      }

      if (html.length < 1000) {
        console.warn(
          `Warning: Received suspiciously short HTML content (${html.length} bytes)`,
        )
      }

      const extractItems = this.extractLinksWithText(html, url)

      return {
        items: extractItems,
        url,
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('Error extracting content:', error)
      throw error
    }
  }

  /**
   * Extract links with their associated text content
   * @param html HTML content to process
   * @param baseUrl Optional base URL to resolve relative links
   * @returns Array of objects containing href and text
   */
  extractLinksWithText(html: string, baseUrl?: string): PostLink[] {
    try {
      // Load HTML into cheerio
      const $ = cheerio.load(html)

      const results: PostLink[] = []

      // Select all anchor elements with href attributes
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href')

        const getTitle = () => {
          const h1 = $(element).find('h1').text()
          if (h1) return h1
          const h2 = $(element).find('h2').text()
          if (h2) return h2
          const h3 = $(element).find('h3').text()
          if (h3) return h3
          const h4 = $(element).find('h4').text()
          if (h4) return h4

          return $(element).text().trim().split('\n')[0]
        }

        const title = getTitle()

        if (href) {
          // Resolve relative URLs if baseUrl is provided
          let resolvedHref = href
          if (
            baseUrl &&
            !resolvedHref.startsWith('http') &&
            !resolvedHref.startsWith('#') &&
            !resolvedHref.startsWith('javascript:')
          ) {
            try {
              resolvedHref = new URL(resolvedHref, baseUrl).toString()
            } catch (e) {
              // Keep original href if URL construction fails
            }
          }

          results.push({
            href: resolvedHref,
            title,
          })
        }
      })

      return results
    } catch (error) {
      console.error('Error extracting links with text:', error)
      return []
    }
  }
}

// Create and export singleton
export const webExtractor = new WebExtractor()
