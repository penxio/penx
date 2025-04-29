type AsyncTask<T = any> = () => Promise<T>

export class AsyncQueue {
  private queue: AsyncTask[] = []
  private running = false

  public addTask(task: AsyncTask): void {
    this.queue.push(task)
    this.run()
  }

  private async run(): Promise<void> {
    if (this.running) return
    this.running = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()!
      try {
        await task()
      } catch (error) {
        console.error('AsyncQueue:', error)
      }
    }

    this.running = false
  }
}
