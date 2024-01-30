import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  globalShortcut,
  clipboard,
  Tray,
  Menu,
  nativeImage,
  type NativeImage
} from 'electron'
import path from 'node:path'

import { ClipboardEvent } from './event'
import iconPath from '../assets/image/logo.png'

export type ChangeText = (text: string) => void
export type ChangeImage = (image: NativeImage) => void
export type ChangeHTML = (html: string) => void

const icon = nativeImage.createFromDataURL(iconPath)

export class ClipboardObserver {
  private preContext?: string

  private timer?: NodeJS.Timeout

  private interval?: number

  public changeText?: ChangeText

  public changeImage?: ChangeImage

  public changeHTML?: ChangeHTML

  constructor(options?: {
    interval?: number
    changeText?: ChangeText
    changeImage?: ChangeImage
    changeHTML?: ChangeHTML
  }) {
    this.interval = options?.interval ?? 500
    this.changeText = options?.changeText
    this.changeText = options?.changeText
    this.changeHTML = options?.changeHTML
  }

  readText() {
    const readText = clipboard.readText()
    if (readText === this.preContext) return
    this.preContext = readText
    return readText
  }

  readImage() {
    return clipboard.readImage()
  }

  readHTML() {
    return clipboard.readHTML()
  }

  writeText(content: string) {
    clipboard.writeText(content)
  }

  start() {
    this.timer = setInterval(() => {
      const readText = clipboard.readText()
      // const readImage = clipboard.readImage()
      // const readHTML = clipboard.readHTML()
      if (readText === this.preContext) return
      this.preContext = readText
      this.changeText && this.changeText(readText)
    }, this.interval)
  }

  stop() {
    clearInterval(this.timer)
  }
}

const title = 'Clip Magic'

const registerGlobalShortcuts = (win: BrowserWindow) => {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
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
  const winHeight = 240
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
    alwaysOnTop: true
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
