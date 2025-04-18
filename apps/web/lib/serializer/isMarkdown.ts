export function isMarkdown(text: string): boolean {
  const markdownRegex =
    /^[\s\S]*?(?:\n\s*[-*]\s+.*|\n\s*#+\s+.*|\n\s*>\s+.*|\n\s*`{3}.*\n[\s\S]*?\n\s*`{3}|\n\s*`.*`|\n\s*!\[.*\]\(.*\)|\n\s*\[.*\]\(.*\)|\n\s*[-*]\s+.*|\n\s*\d+\.\s+.*|\n\s*.*\n\s*[-=]+\n|\n\s*.*\n\s*[-=]+\n\s*)*$/
  return markdownRegex.test(text)
}
