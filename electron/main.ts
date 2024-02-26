import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  globalShortcut,
  Tray,
  Menu
} from 'electron'

import { ClipboardEvent, EditEvent, SettingsEvent } from './event'
import { useWindow, windowMap } from './hooks'
import { ClipboardObserver, loadSettingsFile, writeSettingsFile } from './utils'

const windowHook = useWindow()
const createWindow = windowHook.createWindow
const settings = loadSettingsFile()

const registerGlobalShortcuts = (win: BrowserWindow) => {
  globalShortcut.register(settings.openShortcutKey, () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.showInactive()
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
    win.blur()
  })
  ipcMain.handle(SettingsEvent.Get, () => {
    return settings
  })
  ipcMain.handle(SettingsEvent.Update, (_, content) => {
    return writeSettingsFile(JSON.parse(content))
  })
  ipcMain.handle(EditEvent.Show, () => {
    const l = 450
    createWindow('edit', {
      title: '编辑',
      parent: win,
      width: l,
      maxWidth: l,
      minWidth: l,
      height: l,
      maxHeight: l,
      minHeight: l,
      fullscreenable: false
    })
  })
}

const registerEvent = (win: BrowserWindow) => {
  win.on('blur', () => {
    if (windowMap.size === 1 && win.isVisible()) {
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
          title: '选项',
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
    minWidth: width,
    maxWidth: width,
    minHeight: winHeight,
    maxHeight: winHeight,
    x: 0,
    y: height - winHeight,
    fullscreenable: false,
    show: false,
    skipTaskbar: false,
    titleBarStyle: 'hidden',
    alwaysOnTop: true
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
