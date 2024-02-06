import { app, BrowserWindow, nativeImage } from 'electron'
import { join } from 'path'

import iconPath from '../../assets/image/logo.png'
import pkg from '../../package.json'

interface CreateWindow {
  (
    windowId: string,
    options?: Electron.BrowserWindowConstructorOptions
  ): BrowserWindow
  (options?: Electron.BrowserWindowConstructorOptions): BrowserWindow
}

const title = pkg.title
const icon = nativeImage.createFromDataURL(iconPath)
const loadFileURL = pkg.loadFileURL

export const windowMap = new Map<string, BrowserWindow>()

const createWindow: CreateWindow = (windowId, options) => {
  if (windowMap.has(windowId)) {
    const window = windowMap.get(windowId)!
    window.show()
    return window
  }

  const opts = typeof windowId === 'object' ? windowId : options
  const window = new BrowserWindow({
    title,
    icon,
    width: 600,
    height: 500,
    autoHideMenuBar: true,
    hiddenInMissionControl: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    },
    ...opts
  })

  const loadPath = typeof windowId === 'object' ? '' : `/${windowId}`
  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL + loadPath)
  } else {
    window.loadFile(loadFileURL + loadPath + '/index.html')
  }

  window.on('close', () => windowMap.delete(windowId))

  windowMap.set(windowId, window)

  return window
}

export const useWindow = () => ({ title, icon, createWindow })
