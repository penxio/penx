import { describe, it, expect } from 'vitest'
import { matchPattern } from './matchPattern'

describe('matchPattern', () => {
  describe('Basic functionality tests', () => {
    it('should match identical URLs', () => {
      const pattern = 'https://example.com/path'
      const url = 'https://example.com/path'
      expect(matchPattern(pattern, url)).toBe(true)
    })

    it('should be case-sensitive (except for scheme and host)', () => {
      const pattern = 'https://example.com/Path'
      const url = 'https://example.com/path'
      expect(matchPattern(pattern, url)).toBe(false)
    })
  })

  describe('Scheme matching tests', () => {
    it('should match * scheme with http and https', () => {
      const pattern = '*://example.com/path'
      expect(matchPattern(pattern, 'http://example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/path')).toBe(true)
    })

    it('* scheme should not match other protocols', () => {
      const pattern = '*://example.com/path'
      expect(matchPattern(pattern, 'ftp://example.com/path')).toBe(false)
      expect(matchPattern(pattern, 'file://example.com/path')).toBe(false)
    })

    it('should match specified scheme', () => {
      expect(matchPattern('http://example.com/path', 'http://example.com/path')).toBe(true)
      expect(matchPattern('https://example.com/path', 'https://example.com/path')).toBe(true)
      expect(matchPattern('ftp://example.com/path', 'ftp://example.com/path')).toBe(true)
    })

    it('should not match wrong scheme', () => {
      expect(matchPattern('http://example.com/path', 'https://example.com/path')).toBe(false)
      expect(matchPattern('https://example.com/path', 'http://example.com/path')).toBe(false)
    })

    it('scheme should be case-insensitive', () => {
      expect(matchPattern('HTTP://example.com/path', 'http://example.com/path')).toBe(true)
      expect(matchPattern('HTTPS://example.com/path', 'https://example.com/path')).toBe(true)
    })
  })

  describe('Host matching tests', () => {
    it('should match host exactly', () => {
      const pattern = 'https://example.com/path'
      expect(matchPattern(pattern, 'https://example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://other.com/path')).toBe(false)
    })

    it('host should be case-insensitive', () => {
      expect(matchPattern('https://EXAMPLE.COM/path', 'https://example.com/path')).toBe(true)
      expect(matchPattern('https://example.com/path', 'https://EXAMPLE.COM/path')).toBe(true)
    })

    it('should correctly handle *.domain.com pattern matching root domain', () => {
      const pattern = 'https://*.example.com/path'
      expect(matchPattern(pattern, 'https://example.com/path')).toBe(true)
    })

    it('should correctly handle *.domain.com pattern matching subdomains', () => {
      const pattern = 'https://*.example.com/path'
      expect(matchPattern(pattern, 'https://sub.example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://api.example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://www.example.com/path')).toBe(true)
    })

    it('should correctly handle *.domain.com pattern matching multi-level subdomains', () => {
      const pattern = 'https://*.example.com/path'
      expect(matchPattern(pattern, 'https://api.v1.example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://deep.nested.sub.example.com/path')).toBe(true)
    })

    it('*.domain.com should not match other domains', () => {
      const pattern = 'https://*.example.com/path'
      expect(matchPattern(pattern, 'https://notexample.com/path')).toBe(false)
      expect(matchPattern(pattern, 'https://example.org/path')).toBe(false)
      expect(matchPattern(pattern, 'https://fakeexample.com/path')).toBe(false)
    })

    it('should handle wildcards in the middle', () => {
      const pattern = 'https://api*.example.com/path'
      expect(matchPattern(pattern, 'https://api1.example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://apiv2.example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://api.example.com/path')).toBe(false) // * does not match empty string
    })

    it('wildcard should not match dots', () => {
      const pattern = 'https://api*.example.com/path'
      expect(matchPattern(pattern, 'https://api.sub.example.com/path')).toBe(false)
    })
  })

  describe('Path matching tests', () => {
    it('should match path exactly', () => {
      const pattern = 'https://example.com/specific/path'
      expect(matchPattern(pattern, 'https://example.com/specific/path')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/other/path')).toBe(false)
    })

    it('should handle path wildcards', () => {
      const pattern = 'https://example.com/path/*'
      expect(matchPattern(pattern, 'https://example.com/path/anything')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/path/sub/deep')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/path/')).toBe(true)
    })

    it('should handle multiple path wildcards', () => {
      const pattern = 'https://example.com/*/api/*'
      expect(matchPattern(pattern, 'https://example.com/v1/api/users')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/v2/api/posts')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/api/users')).toBe(false)
    })

    it('should handle special characters in paths', () => {
      const pattern = 'https://example.com/path/with-dash/*'
      expect(matchPattern(pattern, 'https://example.com/path/with-dash/file')).toBe(true)
      
      const pattern2 = 'https://example.com/path/with_underscore/*'
      expect(matchPattern(pattern2, 'https://example.com/path/with_underscore/file')).toBe(true)
    })

    it('path matching excludes query parameters', () => {
      // According to @match pattern standard, path part excludes query parameters
      const pattern = 'https://example.com/path'
      expect(matchPattern(pattern, 'https://example.com/path?query=value')).toBe(true) // Should match because path parts are identical
      
      const pattern2 = 'https://example.com/path/*'
      expect(matchPattern(pattern2, 'https://example.com/path/file?query=value')).toBe(true) // Wildcard matches path part
      
      // But query parameters themselves should not affect path matching
      expect(matchPattern('https://example.com/path', 'https://example.com/path')).toBe(true)
      expect(matchPattern('https://example.com/path', 'https://example.com/path?')).toBe(true)
    })

    it('path matching should be case-sensitive', () => {
      const pattern = 'https://example.com/Path'
      expect(matchPattern(pattern, 'https://example.com/path')).toBe(false)
      expect(matchPattern(pattern, 'https://example.com/Path')).toBe(true)
    })
  })

  describe('Complex pattern tests', () => {
    it('should handle complete wildcard patterns', () => {
      const pattern = '*://*.example.com/api/*/users/*'
      expect(matchPattern(pattern, 'https://api.example.com/api/v1/users/123')).toBe(true)
      expect(matchPattern(pattern, 'http://sub.example.com/api/v2/users/456')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/api/v1/users/789')).toBe(true)
    })

    it('should handle multiple protocols and wildcard combinations', () => {
      const pattern = '*://*.github.com/*'
      expect(matchPattern(pattern, 'https://github.com/user/repo')).toBe(true)
      expect(matchPattern(pattern, 'https://api.github.com/repos/user/repo')).toBe(true)
      expect(matchPattern(pattern, 'http://raw.github.com/user/repo/main/file.txt')).toBe(true)
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle empty string inputs', () => {
      expect(matchPattern('', 'https://example.com')).toBe(false)
      expect(matchPattern('https://example.com', '')).toBe(false)
      expect(matchPattern('', '')).toBe(false)
    })

    it('should handle null/undefined inputs', () => {
      expect(matchPattern(null as any, 'https://example.com')).toBe(false)
      expect(matchPattern('https://example.com', null as any)).toBe(false)
      expect(matchPattern(undefined as any, 'https://example.com')).toBe(false)
      expect(matchPattern('https://example.com', undefined as any)).toBe(false)
    })

    it('should handle invalid pattern formats', () => {
      expect(matchPattern('invalid-pattern', 'https://example.com')).toBe(false)
      expect(matchPattern('example.com', 'https://example.com')).toBe(false)
      expect(matchPattern('://example.com/path', 'https://example.com/path')).toBe(false)
    })

    it('should handle invalid URLs', () => {
      expect(matchPattern('https://example.com/path', 'invalid-url')).toBe(false)
      expect(matchPattern('https://example.com/path', 'not-a-url')).toBe(false)
      expect(matchPattern('https://example.com/path', 'http://')).toBe(false)
    })

    it('should handle patterns missing path', () => {
      expect(matchPattern('https://example.com', 'https://example.com/path')).toBe(false)
      // Pattern must include path part, even if it's just "/"
    })

    it('should handle port numbers', () => {
      const pattern = 'https://example.com:8080/path'
      expect(matchPattern(pattern, 'https://example.com:8080/path')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/path')).toBe(false)
      expect(matchPattern('https://example.com/path', 'https://example.com:8080/path')).toBe(false)
    })
  })

  describe('Real-world use case tests', () => {
    it('should match any URL with wildcard pattern', () => {
      const pattern = '*://*/*'
      expect(matchPattern(pattern, 'https://example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'http://localhost:3000/app')).toBe(true)
      expect(matchPattern(pattern, 'ftp://files.example.com/download')).toBe(false) // * scheme only matches http/https
      expect(matchPattern(pattern, 'https://sub.domain.com/api/v1/users')).toBe(true)
      expect(matchPattern(pattern, 'http://127.0.0.1:8080/api')).toBe(true)
      expect(matchPattern(pattern, 'https://user:pass@example.com/path')).toBe(true)
    })

    it('should match all HTTPS URLs with https://*/* pattern', () => {
      const pattern = 'https://*/*'
      
      // Should match various HTTPS URLs
      expect(matchPattern(pattern, 'https://example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://www.google.com/search')).toBe(true)
      expect(matchPattern(pattern, 'https://api.github.com/repos')).toBe(true)
      expect(matchPattern(pattern, 'https://localhost:3000/app')).toBe(true)
      expect(matchPattern(pattern, 'https://sub.domain.com/api/v1/users')).toBe(true)
      expect(matchPattern(pattern, 'https://127.0.0.1:8080/api')).toBe(true)
      expect(matchPattern(pattern, 'https://user:pass@example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/')).toBe(true)
      expect(matchPattern(pattern, 'https://example.com/path/to/resource')).toBe(true)
      
      // Should NOT match HTTP URLs
      expect(matchPattern(pattern, 'http://example.com/path')).toBe(false)
      expect(matchPattern(pattern, 'http://localhost:3000/app')).toBe(false)
      
      // Should NOT match other protocols
      expect(matchPattern(pattern, 'ftp://files.example.com/download')).toBe(false)
      expect(matchPattern(pattern, 'file:///path/to/file')).toBe(false)
    })

    it('should match all HTTP URLs with http://*/* pattern', () => {
      const pattern = 'http://*/*'
      
      // Should match various HTTP URLs
      expect(matchPattern(pattern, 'http://example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'http://www.google.com/search')).toBe(true)
      expect(matchPattern(pattern, 'http://localhost:3000/app')).toBe(true)
      expect(matchPattern(pattern, 'http://sub.domain.com/api/v1/users')).toBe(true)
      expect(matchPattern(pattern, 'http://127.0.0.1:8080/api')).toBe(true)
      expect(matchPattern(pattern, 'http://user:pass@example.com/path')).toBe(true)
      expect(matchPattern(pattern, 'http://example.com/')).toBe(true)
      expect(matchPattern(pattern, 'http://example.com/path/to/resource')).toBe(true)
      
      // Should NOT match HTTPS URLs
      expect(matchPattern(pattern, 'https://example.com/path')).toBe(false)
      expect(matchPattern(pattern, 'https://localhost:3000/app')).toBe(false)
      
      // Should NOT match other protocols
      expect(matchPattern(pattern, 'ftp://files.example.com/download')).toBe(false)
      expect(matchPattern(pattern, 'file:///path/to/file')).toBe(false)
    })

    it('should handle different wildcard combinations for any URL matching', () => {
      // Test various wildcard patterns that should match any URL
      expect(matchPattern('*://*/*', 'https://example.com/path')).toBe(true)
      expect(matchPattern('*://*/*', 'http://example.com/')).toBe(true)
      expect(matchPattern('*://*/*', 'https://example.com/path/to/resource')).toBe(true)
      
      // Test that specific schemes still work
      expect(matchPattern('https://*/*', 'https://example.com/path')).toBe(true)
      expect(matchPattern('https://*/*', 'http://example.com/path')).toBe(false)
      
      // Test that specific hosts still work
      expect(matchPattern('*://example.com/*', 'https://example.com/path')).toBe(true)
      expect(matchPattern('*://example.com/*', 'https://other.com/path')).toBe(false)
    })

    it('should match GitHub related URLs', () => {
      const pattern = '*://*.github.com/*'
      expect(matchPattern(pattern, 'https://github.com/user/repo')).toBe(true)
      expect(matchPattern(pattern, 'https://api.github.com/repos')).toBe(true)
      expect(matchPattern(pattern, 'https://raw.githubusercontent.com/user/repo/main/file.txt')).toBe(false)
    })

    it('should match Google services', () => {
      const pattern = '*://*.google.com/*'
      expect(matchPattern(pattern, 'https://www.google.com/search')).toBe(true)
      expect(matchPattern(pattern, 'https://mail.google.com/mail')).toBe(true)
      expect(matchPattern(pattern, 'https://google.com/search')).toBe(true)
      expect(matchPattern(pattern, 'https://youtube.com/watch')).toBe(false)
    })

    it('should match API endpoints', () => {
      const pattern = 'https://api.example.com/v*/users/*'
      expect(matchPattern(pattern, 'https://api.example.com/v1/users/123')).toBe(true)
      expect(matchPattern(pattern, 'https://api.example.com/v2/users/456')).toBe(true)
      expect(matchPattern(pattern, 'https://api.example.com/users/123')).toBe(false)
    })

    it('should match local development environments', () => {
      const pattern = 'http://localhost:*/app/*'
      expect(matchPattern(pattern, 'http://localhost:3000/app/dashboard')).toBe(true)
      expect(matchPattern(pattern, 'http://localhost:8080/app/settings')).toBe(true)
      expect(matchPattern(pattern, 'http://localhost:3000/api/users')).toBe(false)
    })
  })
})
