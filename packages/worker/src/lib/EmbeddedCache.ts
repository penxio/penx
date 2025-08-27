export class EmbeddedCache {
  private static readonly MAX_SIZE = 1000
  private cache: Set<string> = new Set()
  private order: string[] = []

  push(id: string): void {
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
  }

  has(id: string): boolean {
    return this.cache.has(id)
  }

  // Additional helper methods
  size(): number {
    return this.cache.size
  }

  clear(): void {
    this.cache.clear()
    this.order = []
  }
}
