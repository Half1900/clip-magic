import { contextBridge, ipcRenderer } from 'electron'

import { ClipboardEvent } from './event'

contextBridge.exposeInMainWorld('electron', {
  getClipText: () => ipcRenderer.invoke(ClipboardEvent.Change),
  paste: (content: string) => ipcRenderer.invoke(ClipboardEvent.Paste, content)
})
