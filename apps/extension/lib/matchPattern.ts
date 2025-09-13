/**
 * 检查单个 @match 模式是否与目标 URL 匹配
 * @param pattern - 格式如 "*://*.example.com/path/*"
 * @param url - 要匹配的完整 URL，如 "https://sub.example.com/path/page.html"
 * @returns 如果匹配返回 true，否则 false
 */
export function matchPattern(pattern: string, url: string): boolean {
  // 1. 拆分 pattern 为 scheme, host, path
  const match = pattern.match(/^(\*|http|https|file|ftp):\/\/([^\/]+)(\/.*)$/)
  if (!match) {
    throw new Error(`Invalid @match pattern: "${pattern}"`)
  }
  const [, schemePattern, hostPattern, pathPattern] = match

  // 2. 解析待匹配 URL
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`Invalid URL: "${url}"`)
  }

  // 3. Scheme 匹配：'*' 等同于 http 和 https
  if (
    schemePattern !== '*' &&
    schemePattern.toLowerCase() !==
      parsed.protocol.replace(':', '').toLowerCase()
  ) {
    return false
  }
  if (
    schemePattern === '*' &&
    !['http', 'https'].includes(parsed.protocol.replace(':', ''))
  ) {
    return false
  }

  // 4. Host 匹配：支持 "*" 通配子域
  //    将 hostPattern 转为正则："." 转义，"*" => "[^.]+"，开头的 "*." 特殊处理匹配任意子域或根域
  const hostRegex = new RegExp(
    '^' +
      hostPattern
        .replace(/\./g, '\\.')
        .replace(/^\*\./, '(?:[^./]+\\.)*') // *.example.com => 任意多级子域或根域
        .replace(/\*/g, '[^./]+') +
      '$',
    'i',
  )
  if (!hostRegex.test(parsed.host)) {
    return false
  }

  // 5. Path 匹配："*" 匹配任意字符，保持 "/" 原义
  const pathRegex = new RegExp(
    '^' + pathPattern.split('*').map(escapeRegExp).join('.*') + '$',
  )
  return pathRegex.test(parsed.pathname + parsed.search)
}

/**
 * 为正则构建转义函数
 */
function escapeRegExp(str: string): string {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
}
