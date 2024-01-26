interface Window {
  electron: {
    getClipText(): Promise<string>
    paste(content: string): Promise<void>
  }
}
