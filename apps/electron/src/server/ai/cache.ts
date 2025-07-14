import { LRUCache } from 'lru-cache'

// Define interface for cache entry with proper typing
interface CacheEntry<T = any> {
  value: T
  expiration?: number
}

// Define interface for wrap method options
interface WrapOptions {
  ttl: number
  allowStale?: boolean
}

export class MemoryCache {
  private cache: LRUCache<string, CacheEntry>

  constructor(
    options: Partial<LRUCache.Options<string, CacheEntry, unknown>> = {},
  ) {
    this.cache = new LRUCache({
      maxSize: 30 * 1024 * 1024, // 30MB
      max: 10000,
      sizeCalculation: (value, key) => {
        return JSON.stringify(value).length
      },
      ...options,
    })
  }

  // Get value from cache, checking expiration
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if entry has expired
    if (entry.expiration && Date.now() > entry.expiration) {
      this.cache.delete(key)
      return null
    }

    return entry.value
  }

  // Set value in cache with optional TTL
  set<T = any>(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      value,
      expiration: ttl ? Date.now() + ttl : undefined,
    }
    this.cache.set(key, entry)
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    if (entry.expiration && Date.now() > entry.expiration) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Delete specific key
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear()
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      calculatedSize: this.cache.calculatedSize,
      max: this.cache.max,
      maxSize: this.cache.maxSize,
    }
  }

  // Wrap a function with caching
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    options: WrapOptions,
  ): Promise<T> {
    const { ttl, allowStale = false } = options
    const entry = this.cache.get(key)

    // Check if we have a valid cached value
    if (entry) {
      const isExpired = entry.expiration && Date.now() > entry.expiration

      if (!isExpired) {
        // Return fresh cached value
        return entry.value
      }

      if (allowStale) {
        // Return stale value and refresh in background
        this.refreshInBackground(key, fn, ttl)
        return entry.value
      }
    }

    // No valid cache, fetch fresh value
    try {
      const value = await fn()
      this.set(key, value, ttl)
      return value
    } catch (error) {
      // If we have stale data and function fails, return stale data
      if (entry?.value !== undefined) {
        return entry.value
      }
      throw error
    }
  }

  // Refresh cache entry in background
  private async refreshInBackground<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number,
  ): Promise<void> {
    try {
      const value = await fn()
      this.set(key, value, ttl)
    } catch (error) {
      console.error(`Failed to refresh cache for key "${key}":`, error)
    }
  }

  // Clean up expired entries manually
  cleanupExpired(): number {
    let cleanedCount = 0
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiration && now > entry.expiration) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    return cleanedCount
  }
}

// Export singleton instance
export const cache = new MemoryCache()
