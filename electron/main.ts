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

import settings from './config/settings.json'
import { ClipboardEvent } from './event'
import { ClipboardObserver } from './utils'
import iconPath from '../assets/image/logo.png'

export type ChangeText = (text: string) => void
export type ChangeImage = (image: NativeImage) => void
export type ChangeHTML = (html: string) => void

const title = 'Clip Magic'
const icon = nativeImage.createFromDataURL(iconPath)

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

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: function () {
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
    alwaysOnTop: true,
    skipTaskbar: true
  })

  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile('.output/public/index.html')
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
