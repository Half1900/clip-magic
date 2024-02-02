import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  globalShortcut,
  Tray,
  Menu,
  nativeImage,
  type NativeImage
} from 'electron'
import path from 'node:path'

import { ClipboardEvent, SettingsEvent } from './event'
import { ClipboardObserver, loadSettingsFile, writeSettingsFile } from './utils'
import iconPath from '../assets/image/logo.png'

export type ChangeText = (text: string) => void
export type ChangeImage = (image: NativeImage) => void
export type ChangeHTML = (html: string) => void

const title = 'Clip Magic'
const icon = nativeImage.createFromDataURL(iconPath)
const loadFileUrl = '.output/public'
const settings = loadSettingsFile()

const registerGlobalShortcuts = (win: BrowserWindow) => {
  globalShortcut.register(settings.openShortcutKey, () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
}

const registerHandle = (win: BrowserWindow) => {
  const board = new ClipboardObserver()
  ipcMain.handle(ClipboardEvent.Change, () => {
    return board.readText()
  })
  ipcMain.handle(ClipboardEvent.Paste, (_, content) => {
    board.writeText(content as unknown as string)
    win.hide()
  })
  ipcMain.handle(SettingsEvent.Get, () => {
    return settings
  })
  ipcMain.handle(SettingsEvent.Update, (_, content) => {
    return writeSettingsFile(JSON.parse(content))
  })
}

const registerEvent = (win: BrowserWindow) => {
  win.on('blur', () => {
    if (win.isVisible()) {
      win.hide()
    }
  })
}

const createMenu = (win: BrowserWindow) => {
  const tray = new Tray(icon)

  let set: BrowserWindow | undefined
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '选项',
      click() {
        if (set) return
        set = new BrowserWindow({
          width: 600,
          height: 500,
          parent: win,
          icon,
          hiddenInMissionControl: true,
          autoHideMenuBar: true,
          webPreferences: {
            preload: path.join(__dirname, 'preload.js')
          }
        })
        if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
          set.loadURL(process.env.VITE_DEV_SERVER_URL + '/#/settings')
        } else {
          set.loadFile(loadFileUrl + '/settings/index.html')
        }
        set.on('close', () => {
          set = undefined
        })
      }
    },
    {
      label: '退出',
      click() {
        win.destroy()
        app.quit()
      }
    }
  ])

  tray.setToolTip(title)
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    win.show()
  })
}

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const winHeight = 255
  const win = new BrowserWindow({
    title,
    icon,
    autoHideMenuBar: true,
    hiddenInMissionControl: true,
    height: winHeight,
    width,
    minHeight: winHeight,
    maxHeight: winHeight,
    y: height - winHeight,
    x: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    fullscreenable: false,
    show: false,
    skipTaskbar: true
  })

  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: settings.openAtLogin
    })
  }

  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(loadFileUrl + '/index.html')
  }

  return win
}

app.whenReady().then(() => {
  // 创建窗口
  const win = createWindow()
  // 创建菜单
  createMenu(win)
  // 注册快捷键
  registerGlobalShortcuts(win)
  // 注册权柄
  registerHandle(win)
  // 注册事件
  registerEvent(win)
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
