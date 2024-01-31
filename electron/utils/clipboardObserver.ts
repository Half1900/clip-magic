import { clipboard } from 'electron'

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
