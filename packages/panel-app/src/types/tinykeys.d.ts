declare module 'tinykeys' {
  export interface KeyBindingMap {
    [keybinding: string]: (event: KeyboardEvent) => void;
  }

  export interface KeyBindingOptions {
    event?: "keydown" | "keyup";
    capture?: boolean;
    timeout?: number;
  }

  export function tinykeys(
    target: Window | HTMLElement, 
    keyBindingMap: KeyBindingMap, 
    options?: KeyBindingOptions
  ): () => void;
}
