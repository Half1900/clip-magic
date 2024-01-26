import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  globalShortcut,
  clipboard,
  webFrame,
  type NativeImage
} from 'electron'
import path from 'node:path'

import { ClipboardEvent } from './event'

export type ChangeText = (text: string) => void
export type ChangeImage = (image: NativeImage) => void
export type ChangeHTML = (html: string) => void

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
    webFrame.insertText(content)
  })
}

const registerEvent = (win: BrowserWindow) => {
  win.on('blur', () => {
    if (win.isVisible()) {
      win.hide()
    }
  })
}

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const winHeight = 240
  const win = new BrowserWindow({
    title: 'Clip Magic',
    icon: path.join(__dirname, '../assets/image/logo.png'),
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
    titleBarStyle: 'hidden'
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
  // 注册快捷键
  registerGlobalShortcuts(win)
  // 注册权柄
  registerHandle(win)
  // 注册事件
  registerEvent(win)
})
