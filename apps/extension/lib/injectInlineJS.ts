/**
 * Modern inline JavaScript injection utility for Chrome Extensions
 */

export interface InjectionOptions {
  /** Injection target location */
  target?: 'head' | 'body' | 'documentElement'
  /** Whether to automatically remove script after execution */
  cleanup?: boolean
  /** CSP nonce value */
  nonce?: string
  /** Custom script ID */
  id?: string
  /** Script attributes */
  attributes?: {
    defer?: boolean
    async?: boolean
    type?: string
  }
  /** Timeout in milliseconds */
  timeout?: number
  /** Whether to enable silent mode (no error logs) */
  silent?: boolean
  /** Custom error handler */
  onError?: (error: InjectionError) => void
  /** Success callback */
  onSuccess?: (result: InjectionResult) => void
}

export interface InjectionResult {
  /** The injected script element */
  element: HTMLScriptElement
  /** Script ID */
  id: string
  /** Injection timestamp */
  timestamp: number
  /** Execution duration in milliseconds */
  duration?: number
}

export class InjectionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any,
  ) {
    super(message)
    this.name = 'InjectionError'
  }
}

/**
 * Script injector class
 */
class ScriptInjector {
  private static instance: ScriptInjector
  private activeInjections = new Map<string, AbortController>()
  private injectionCount = 0

  static getInstance(): ScriptInjector {
    if (!ScriptInjector.instance) {
      ScriptInjector.instance = new ScriptInjector()
    }
    return ScriptInjector.instance
  }

  /**
   * Inject script
   */
  async inject(
    code: string,
    options: InjectionOptions = {},
  ): Promise<InjectionResult> {
    // Parameter validation
    this.validateInputs(code, options)

    // Generate unique ID
    const id = options.id || this.generateId()

    // Create AbortController for cancellation
    const controller = new AbortController()
    this.activeInjections.set(id, controller)

    try {
      const result = await this.performInjection(
        code,
        options,
        id,
        controller.signal,
      )
      return result
    } finally {
      this.activeInjections.delete(id)
    }
  }

  /**
   * Cancel specified injection operation
   */
  abort(id: string): boolean {
    const controller = this.activeInjections.get(id)
    if (controller) {
      controller.abort()
      return true
    }
    return false
  }

  /**
   * Cancel all active injection operations
   */
  abortAll(): void {
    for (const controller of this.activeInjections.values()) {
      controller.abort()
    }
    this.activeInjections.clear()
  }

  /**
   * Get active injection count
   */
  getActiveCount(): number {
    return this.activeInjections.size
  }

  private validateInputs(code: string, options: InjectionOptions): void {
    if (!code || typeof code !== 'string') {
      throw new InjectionError(
        'Code must be a non-empty string',
        'INVALID_CODE',
      )
    }

    if (!this.isDocumentReady()) {
      throw new InjectionError(
        'Document is not available or ready',
        'DOCUMENT_NOT_READY',
      )
    }

    if (options.timeout && (options.timeout < 0 || options.timeout > 60000)) {
      throw new InjectionError(
        'Timeout must be between 0 and 60000ms',
        'INVALID_TIMEOUT',
      )
    }
  }

  private isDocumentReady(): boolean {
    return !!(document && document.documentElement)
  }

  private generateId(): string {
    return `injected-${Date.now()}-${++this.injectionCount}-${Math.random().toString(36).slice(2, 8)}`
  }

  private async performInjection(
    code: string,
    options: InjectionOptions,
    id: string,
    signal: AbortSignal,
  ): Promise<InjectionResult> {
    const startTime = performance.now()
    const config = this.mergeConfig(options, id)

    return new Promise<InjectionResult>((resolve, reject) => {
      if (signal.aborted) {
        reject(new InjectionError('Operation was aborted', 'ABORTED'))
        return
      }

      // Set timeout
      const timeoutId = setTimeout(() => {
        reject(
          new InjectionError(
            `Injection timeout after ${config.timeout}ms`,
            'TIMEOUT',
          ),
        )
      }, config.timeout)

      // Listen for abort signal
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId)
        reject(new InjectionError('Operation was aborted', 'ABORTED'))
      })

      try {
        // Create script element
        const script = this.createScriptElement(code, config)

        // Set event handlers
        const cleanup = () => {
          clearTimeout(timeoutId)
          if (config.cleanup && script.parentNode) {
            script.parentNode.removeChild(script)
          }
        }

        script.onload = () => {
          const duration = performance.now() - startTime
          const result: InjectionResult = {
            element: script,
            id: config.id,
            timestamp: Date.now(),
            duration,
          }

          cleanup()
          config.onSuccess?.(result)
          resolve(result)
        }

        script.onerror = (event) => {
          cleanup()
          const error = new InjectionError(
            `Script loading failed: ${event}`,
            'LOAD_ERROR',
            { event },
          )
          config.onError?.(error)
          reject(error)
        }

        // Inject to target element
        const target = this.getTargetElement(config.target)
        target.appendChild(script)
      } catch (error) {
        clearTimeout(timeoutId)
        const injectionError =
          error instanceof InjectionError
            ? error
            : new InjectionError(
                `Injection failed: ${error}`,
                'INJECTION_ERROR',
                { originalError: error },
              )
        reject(injectionError)
      }
    })
  }

  private mergeConfig(options: InjectionOptions, id: string) {
    return {
      target: 'head' as const,
      cleanup: true,
      nonce: '',
      timeout: 5000,
      silent: false,
      attributes: {
        defer: false,
        async: false,
        type: 'text/javascript',
      },
      onError: () => {},
      onSuccess: () => {},
      ...options,
      id,
    }
  }

  private createScriptElement(
    code: string,
    config: ReturnType<typeof this.mergeConfig>,
  ): HTMLScriptElement {
    const script = document.createElement('script')

    // Basic attributes
    script.id = config.id
    script.type = config.attributes.type as string

    if (config.nonce) {
      script.nonce = config.nonce
    }

    if (config.attributes.defer) {
      script.defer = true
    }

    if (config.attributes.async) {
      script.async = true
    }

    // Wrap code
    script.textContent = this.wrapCode(code, config)

    return script
  }

  private wrapCode(
    code: string,
    config: ReturnType<typeof this.mergeConfig>,
  ): string {
    const errorReporting = config.silent
      ? ''
      : `
      console.error('[Extension Injection Error]:', error);
      window.dispatchEvent(new CustomEvent('ExtensionInjectionError', {
        detail: { 
          error: error.message, 
          stack: error.stack,
          scriptId: '${config.id}',
          timestamp: Date.now()
        }
      }));
    `

    return `
      (function() {
        'use strict';
        
        // Performance marker
        const startTime = performance.now();
        
        try {
          ${code}
          
          // Success execution marker
          window.dispatchEvent(new CustomEvent('ExtensionInjectionSuccess', {
            detail: { 
              scriptId: '${config.id}',
              duration: performance.now() - startTime,
              timestamp: Date.now()
            }
          }));
          
        } catch (error) {
          ${errorReporting}
          throw error; // Re-throw error for outer catch
        }
      })();
    `
  }

  private getTargetElement(
    target: 'head' | 'body' | 'documentElement',
  ): HTMLElement {
    switch (target) {
      case 'head':
        const head = document.head || document.getElementsByTagName('head')[0]
        if (!head) {
          throw new InjectionError('Head element not found', 'TARGET_NOT_FOUND')
        }
        return head

      case 'body':
        if (!document.body) {
          throw new InjectionError('Body element not found', 'TARGET_NOT_FOUND')
        }
        return document.body

      case 'documentElement':
      default:
        return document.documentElement
    }
  }
}

/**
 * Main injection function
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = await injectInlineJS('console.log("Hello World")')
 *
 * // Advanced usage
 * const result = await injectInlineJS(`
 *   window.myGlobalVar = 'injected';
 *   console.log('Script injected successfully');
 * `, {
 *   target: 'body',
 *   timeout: 10000,
 *   cleanup: false,
 *   onSuccess: (result) => console.log('Success:', result),
 *   onError: (error) => console.error('Error:', error)
 * })
 * ```
 */
export async function injectInlineJS(
  code: string,
  options?: InjectionOptions,
): Promise<InjectionResult> {
  const injector = ScriptInjector.getInstance()
  return injector.inject(code, options)
}

/**
 * Cancel specified injection operation
 */
export function abortInjection(id: string): boolean {
  const injector = ScriptInjector.getInstance()
  return injector.abort(id)
}

/**
 * Cancel all active injection operations
 */
export function abortAllInjections(): void {
  const injector = ScriptInjector.getInstance()
  injector.abortAll()
}

/**
 * Get active injection count
 */
export function getActiveInjectionsCount(): number {
  const injector = ScriptInjector.getInstance()
  return injector.getActiveCount()
}

/**
 * Batch inject scripts
 */
export async function injectMultiple(
  scripts: Array<{ code: string; options?: InjectionOptions }>,
  concurrent = false,
): Promise<InjectionResult[]> {
  if (concurrent) {
    // Concurrent execution
    return Promise.all(
      scripts.map(({ code, options }) => injectInlineJS(code, options)),
    )
  } else {
    // Sequential execution
    const results: InjectionResult[] = []
    for (const { code, options } of scripts) {
      const result = await injectInlineJS(code, options)
      results.push(result)
    }
    return results
  }
}

// Default export
export default injectInlineJS
