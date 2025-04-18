import { ExtractResult } from './types'

export function getPrompts(extractResult: ExtractResult) {
  const systemPrompt = `You are an AI assistant specialized in analyzing blog post links and identifying genuine blog post URLs from a list of links.`

  const prompt = `
Analyze the following list of links and identify which ones are actual blog posts.

Rules for identifying blog posts:
1. INCLUDE links that:
    - Lead to individual blog articles/posts
    - Have descriptive titles that sound like article content
    - Follow typical blog URL patterns (e.g., /blog/, /post/, /article/, /yyyy/mm/, etc.)

2. EXCLUDE links that are:
    - Navigation menus
    - Category/tag pages
    - Author pages
    - Social media links
    - Login/signup pages
    - Static pages (about, contact, etc.)

3. CLEAN the titles by:
    - Removing dates (e.g., "February 27, 2025", "2023-01-21", etc.)
    - Removing timestamps
    - Removing author information
    - Keeping only the actual article title
    - If the title contains both a date and article name, extract ONLY the article name

Input format is an array of objects with 'title' and 'href':
${JSON.stringify(extractResult.items, null, 2)}

Return ONLY the links you're confident are blog posts, in the same format, with cleaned titles:
[
  { "title": "Clean Post Title Without Date", "href": "https://example.com/post" }
]
    `
  return {
    systemPrompt,
    prompt,
  }
}
