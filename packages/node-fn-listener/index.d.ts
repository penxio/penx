export interface FnEvent {
  event_type: 'keydown' | 'keyup';
  key_code: number;
  timestamp: number;
  is_pressed: boolean;
}

export type FnCallback = (message: string) => void;

export interface ListenerOptions {
  autoRetry?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  logger?: Logger;
}

export interface CompatibilityInfo {
  platform: string;
  arch: string;
  isSupported: boolean;
  isArm64: boolean;
  isX64: boolean;
  supportedFeatures: {
    fnKeyListening: boolean;
    fnKeySimulation: boolean;
    accessibilityPermissions: boolean;
  };
  platformName: string;
}

export interface StateChangeEvent {
  oldState: string;
  newState: string;
}

export interface PermissionChangeEvent {
  hasPermission: boolean;
}

export interface NodeFnListenerEvents {
  'fn-event': (event: FnEvent) => void;
  'fn-keydown': (event: FnEvent) => void;
  'fn-keyup': (event: FnEvent) => void;
  'state-change': (event: StateChangeEvent) => void;
  'permission-change': (event: PermissionChangeEvent) => void;
  'listener-start': () => void;
  'listener-stop': () => void;
  'error': (error: Error) => void;
}

export interface NodeFnListener {
  start(callback: FnCallback): Promise<boolean>;
  stop(): Promise<boolean>;
  readonly listening: boolean;
  readonly currentState: string;
  requestPermission(): Promise<boolean>;
  checkPermission(): boolean;
  readonly fnKeyCode: number;
  readonly fnPressed: boolean;
  simulateKeydown(): Promise<boolean>;
  simulateKeyup(): Promise<boolean>;
  parseEvent(message: string): FnEvent | null;
  readonly compatibility: CompatibilityInfo;
  destroy(): void;
  
  // EventEmitter methods
  on<K extends keyof NodeFnListenerEvents>(event: K, listener: NodeFnListenerEvents[K]): this;
  once<K extends keyof NodeFnListenerEvents>(event: K, listener: NodeFnListenerEvents[K]): this;
  off<K extends keyof NodeFnListenerEvents>(event: K, listener: NodeFnListenerEvents[K]): this;
  removeAllListeners(event?: keyof NodeFnListenerEvents): this;
}

export declare class NodeFnListener {
  constructor(options?: ListenerOptions);
  
  start(callback: FnCallback): Promise<boolean>;
  stop(): Promise<boolean>;
  readonly listening: boolean;
  readonly currentState: string;
  requestPermission(): Promise<boolean>;
  checkPermission(): boolean;
  readonly fnKeyCode: number;
  readonly fnPressed: boolean;
  simulateKeydown(): Promise<boolean>;
  simulateKeyup(): Promise<boolean>;
  parseEvent(message: string): FnEvent | null;
  readonly compatibility: CompatibilityInfo;
  destroy(): void;
  
  // EventEmitter methods
  on<K extends keyof NodeFnListenerEvents>(event: K, listener: NodeFnListenerEvents[K]): this;
  once<K extends keyof NodeFnListenerEvents>(event: K, listener: NodeFnListenerEvents[K]): this;
  off<K extends keyof NodeFnListenerEvents>(event: K, listener: NodeFnListenerEvents[K]): this;
  removeAllListeners(event?: keyof NodeFnListenerEvents): this;
  
  /**
   * Parse event message
   * @param message - Event message
   * @returns Parsed event object
   */
  static parseEvent(message: string): FnEvent | null;
}

// Logger
export interface LoggerOptions {
  level?: number;
  prefix?: string;
  enabled?: boolean;
}

export declare class Logger {
  constructor(options?: LoggerOptions);
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  setLevel(level: number): void;
  setEnabled(enabled: boolean): void;
}

// Error classes
export declare class NodeFnListenerError extends Error {
  constructor(type: string, message: string, cause?: Error);
  type: string;
  cause?: Error;
}

export declare class PermissionError extends NodeFnListenerError {
  constructor(message?: string, cause?: Error);
}

export declare class ListenerStateError extends NodeFnListenerError {
  constructor(type: string, message: string, cause?: Error);
}

export declare class NativeModuleError extends NodeFnListenerError {
  constructor(message?: string, cause?: Error);
}

export declare class EventParseError extends NodeFnListenerError {
  constructor(message?: string, cause?: Error);
}

// Constants
export const EVENT_TYPES: {
  KEYDOWN: 'keydown';
  KEYUP: 'keyup';
};

export const LISTENER_STATES: {
  IDLE: 'idle';
  STARTING: 'starting';
  RUNNING: 'running';
  STOPPING: 'stopping';
  ERROR: 'error';
};

export const ERROR_TYPES: {
  PERMISSION_DENIED: 'PERMISSION_DENIED';
  LISTENER_ALREADY_RUNNING: 'LISTENER_ALREADY_RUNNING';
  LISTENER_NOT_RUNNING: 'LISTENER_NOT_RUNNING';
  NATIVE_MODULE_ERROR: 'NATIVE_MODULE_ERROR';
  INVALID_EVENT_MESSAGE: 'INVALID_EVENT_MESSAGE';
};

export const LOG_LEVELS: {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
};

// Utility functions
export declare function parseEvent(message: string): FnEvent | null;
export declare function checkCompatibility(): CompatibilityInfo;
export declare const createError: {
  permission(message?: string, cause?: Error): PermissionError;
  listenerAlreadyRunning(cause?: Error): ListenerStateError;
  listenerNotRunning(cause?: Error): ListenerStateError;
  nativeModule(message?: string, cause?: Error): NativeModuleError;
  eventParse(message?: string, cause?: Error): EventParseError;
};

export default NodeFnListener; 