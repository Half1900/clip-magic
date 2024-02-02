import { contextBridge, ipcRenderer } from 'electron'

import { ClipboardEvent, SettingsEvent } from './event'
import { Settings } from './utils'

contextBridge.exposeInMainWorld('electron', {
  getClipText: () => ipcRenderer.invoke(ClipboardEvent.Change),
  paste: (content: string) => ipcRenderer.invoke(ClipboardEvent.Paste, content),
  getSettings: () => ipcRenderer.invoke(SettingsEvent.Get),
  updateSettings: (content: Settings) =>
    ipcRenderer.invoke(SettingsEvent.Update, content)
})
