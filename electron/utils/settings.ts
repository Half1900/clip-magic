import { app } from 'electron'
import fs from 'node:fs'
import { join } from 'node:path'

import pkg from '../../package.json'

export interface Settings {
  openAtLogin: boolean
  openShortcutKey: string
}

const defaultSettings: Settings = {
  openAtLogin: false,
  openShortcutKey: 'CommandOrControl+Shift+V'
}

const homePath = app.getPath('home')
const configPath = join(homePath, `.${pkg.name}`, '/config')
const settingsFilePath = join(configPath, './settings.json')

export const loadSettingsFile = () => {
  const configExist = fs.existsSync(configPath)
  if (!configExist) {
    fs.mkdirSync(configPath, { recursive: true })
  }
  const settingsExist = fs.existsSync(settingsFilePath)
  if (!settingsExist) {
    writeSettingsFile(defaultSettings)
    return defaultSettings
  }
  return JSON.parse(fs.readFileSync(settingsFilePath, 'utf8')) as Settings
}

export const writeSettingsFile = (settings: Settings) => {
  fs.writeFileSync(
    settingsFilePath,
    JSON.stringify({ ...defaultSettings, ...settings }, null, 2)
  )
}
