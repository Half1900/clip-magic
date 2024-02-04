import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  globalShortcut,
  Tray,
  Menu,
  type NativeImage
} from 'electron'

import { ClipboardEvent, SettingsEvent } from './event'
import { useWindow } from './hooks'
import { ClipboardObserver, loadSettingsFile, writeSettingsFile } from './utils'

export type ChangeText = (text: string) => void
export type ChangeImage = (image: NativeImage) => void
export type ChangeHTML = (html: string) => void

const windowHook = useWindow()
const createWindow = windowHook.createWindow
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
  const tray = new Tray(windowHook.icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '选项',
      click() {
        createWindow('settings', {
          parent: win
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

  tray.setToolTip(windowHook.title)
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    win.show()
  })
}

const createMainWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const winHeight = 255

  const win = createWindow({
    height: winHeight,
    width,
    minHeight: winHeight,
    maxHeight: winHeight,
    x: 0,
    y: height - winHeight,
    fullscreenable: false,
    show: false,
    skipTaskbar: true,
    titleBarStyle: 'hidden'
  })

  return win
}

const registerAppSettings = () => {
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: settings.openAtLogin
    })
  }
}

app.whenReady().then(() => {
  // 注册App配置
  registerAppSettings()
  // 创建窗口
  const win = createMainWindow()
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
