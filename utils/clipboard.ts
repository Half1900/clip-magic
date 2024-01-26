import { clipboard, type NativeImage } from 'electron'

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

  getText() {
    const readText = clipboard.readText()
    if (readText === this.preContext) return
    this.preContext = readText
    return
  }

  getImage() {
    return clipboard.readImage()
  }

  getHTML() {
    return clipboard.readHTML()
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
