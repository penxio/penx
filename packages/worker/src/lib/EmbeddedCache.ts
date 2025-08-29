import { get, set } from 'idb-keyval'

export class EmbeddedCache {
  private static readonly MAX_SIZE = 1000
  private static readonly CACHE_KEY = 'embedded_cache_data'
  private static readonly ORDER_KEY = 'embedded_cache_order'

  private cache: Set<string> = new Set()
  private order: string[] = []
  private isInitialized: boolean = false

  // Initialize cache by loading from IndexedDB
  async init(): Promise<void> {
    if (this.isInitialized) return
    await this.load()
    this.isInitialized = true
  }

  // Load cache from IndexedDB
  async load(): Promise<void> {
    try {
      const cacheData = (await get(EmbeddedCache.CACHE_KEY)) as
        | string[]
        | undefined
      const orderData = (await get(EmbeddedCache.ORDER_KEY)) as
        | string[]
        | undefined

      if (cacheData && Array.isArray(cacheData)) {
        this.cache = new Set(cacheData)
      }

      if (orderData && Array.isArray(orderData)) {
        this.order = orderData
      }
    } catch (error) {
      console.error('Failed to load cache from IndexedDB:', error)
    }
  }

  // Save cache to IndexedDB
  private async save(): Promise<void> {
    try {
      await Promise.all([
        set(EmbeddedCache.CACHE_KEY, Array.from(this.cache)),
        set(EmbeddedCache.ORDER_KEY, this.order),
      ])
    } catch (error) {
      console.error('Failed to save cache to IndexedDB:', error)
    }
  }

  async push(id: string): Promise<void> {
    // Ensure cache is initialized
    await this.init()

    // If id already exists, no need to push
    if (this.cache.has(id)) {
      return
    }

    // Add to cache
    this.cache.add(id)
    this.order.push(id)

    // If exceeds max size, remove the oldest one
    if (this.cache.size > EmbeddedCache.MAX_SIZE) {
      const oldestId = this.order.shift()
      if (oldestId) {
        this.cache.delete(oldestId)
      }
    }

    // Persist to IndexedDB
    await this.save()
  }

  async has(id: string): Promise<boolean> {
    // Ensure cache is initialized
    await this.init()
    return this.cache.has(id)
  }

  // Additional helper methods
  async size(): Promise<number> {
    // Ensure cache is initialized
    await this.init()
    return this.cache.size
  }

  async clear(): Promise<void> {
    // Ensure cache is initialized
    await this.init()
    this.cache.clear()
    this.order = []
    // Persist to IndexedDB
    await this.save()
  }
}

export const embeddedCache = new EmbeddedCache()
