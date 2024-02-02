interface Window {
  electron: {
    getClipText(): Promise<string>
    paste(content: string): Promise<void>
    getSettings(): Promise<any>
    updateSettings(content: string): Promise<void>
  }
}

declare module '*.ico'
declare module '*.png'
