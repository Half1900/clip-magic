import fs from 'node:fs'
import { join } from 'node:path'

export interface Settings {
  openAtLogin: boolean
  openShortcutKey: string
}

const defaultSettings: Settings = {
  openAtLogin: false,
  openShortcutKey: 'CommandOrControl+Shift+V'
}

const configPath = join(__dirname, 'config')
const settingsFilePath = join(configPath, './setttings.json')

export const loadSettingsFile = () => {
  const configExist = fs.existsSync(configPath)
  if (!configExist) {
    fs.mkdirSync(configPath)
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
