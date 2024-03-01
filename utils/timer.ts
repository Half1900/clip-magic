export function myInterval(fn: () => void, duration: number) {
  const startTime = Date.now()

  function _run() {
    const currentTime = Date.now()
    if (currentTime - startTime < duration) {
      requestAnimationFrame(_run)
      return
    }
    fn()
    myInterval(fn, duration)
  }

  _run()
}
