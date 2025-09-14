/**
 * Check if a single @match pattern matches the target URL
 * @param pattern - Pattern format like "*://*.example.com/path/*"
 * @param url - Complete URL to match, like "https://sub.example.com/path/page.html"
 * @returns true if matches, false otherwise
 */
export function matchPattern(pattern: string, url: string): boolean {
  // Input validation
  if (!pattern || !url) {
    return false
  }

  // 1. Split pattern into scheme, host, path
  const match = pattern.match(/^(\*|http|https|file|ftp):\/\/([^\/]*)(\/.*)$/i)
  if (!match) {
    return false // Return false instead of throwing exception
  }
  const [, schemePattern, hostPattern, pathPattern] = match

  // 2. Parse the URL to match
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false // Return false instead of throwing exception
  }

  // 3. Scheme matching
  if (!isSchemeMatch(schemePattern, parsed.protocol)) {
    return false
  }

  // 4. Host matching (including port)
  if (!isHostMatch(hostPattern, parsed.host)) {
    return false
  }

  // 5. Path matching (only pathname, excluding search parameters)
  if (!isPathMatch(pathPattern, parsed.pathname)) {
    return false
  }

  return true
}

/**
 * Check if scheme matches
 */
function isSchemeMatch(schemePattern: string, protocol: string): boolean {
  const scheme = protocol.replace(':', '').toLowerCase()
  
  if (schemePattern === '*') {
    return ['http', 'https'].includes(scheme)
  }
  
  // Fix: scheme matching should be case-insensitive
  return schemePattern.toLowerCase() === scheme
}

/**
 * Check if host matches (including port)
 */
function isHostMatch(hostPattern: string, host: string): boolean {
  // Handle special case: exact match (case-insensitive)
  if (hostPattern.toLowerCase() === host.toLowerCase()) {
    return true
  }

  // Handle wildcard '*' - matches any host
  if (hostPattern === '*') {
    return true
  }

  // Handle other wildcards
  if (hostPattern.includes('*')) {
    return isHostWildcardMatch(hostPattern, host)
  }

  return false
}

/**
 * Handle host wildcard matching (including port)
 */
function isHostWildcardMatch(hostPattern: string, host: string): boolean {
  // Fix: correctly handle *.example.com pattern
  if (hostPattern.startsWith('*.')) {
    const domain = hostPattern.slice(2).toLowerCase() // Remove "*." and convert to lowercase
    const lowerHost = host.toLowerCase()
    
    // Match root domain: example.com
    if (lowerHost === domain) {
      return true
    }
    
    // Match root domain with port: example.com:8080
    if (lowerHost.startsWith(domain + ':')) {
      return true
    }
    
    // Match subdomains: sub.example.com, sub.sub.example.com
    if (lowerHost.endsWith('.' + domain)) {
      return true
    }
    
    // Match subdomain with port: sub.example.com:8080
    const escapedDomain = domain.replace(/\./g, '\\.')
    const portMatch = lowerHost.match(new RegExp(`^(.+)\\.${escapedDomain}:(.+)$`))
    if (portMatch) {
      return true
    }
    
    return false
  }

  // Handle other wildcard patterns (including port)
  const regexPattern = '^' + 
    hostPattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '[^.:]+') + // Fix: wildcard should not match colon to avoid matching port
    '$'
  
  const regex = new RegExp(regexPattern, 'i')
  return regex.test(host)
}

/**
 * Check if path matches
 */
function isPathMatch(pathPattern: string, pathname: string): boolean {
  // Handle exact match
  if (pathPattern === pathname) {
    return true
  }

  // Handle wildcard matching
  if (pathPattern.includes('*')) {
    const regexPattern = '^' + 
      pathPattern
        .split('*')
        .map(escapeRegExp)
        .join('.*') + 
      '$'
    
    const regex = new RegExp(regexPattern)
    return regex.test(pathname)
  }

  return false
}

/**
 * Escape function for regex construction
 */
function escapeRegExp(str: string): string {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
}
