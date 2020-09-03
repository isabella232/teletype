module.exports = function condition (fn, shouldLog = false) {
  const timeoutError = new Error('Condition timed out: ' + fn.toString())
  Error.captureStackTrace(timeoutError, condition)

  return new Promise((resolve, reject) => {
    const intervalId = global.setInterval(async () => {
      let result = fn()
      if (shouldLog) {
        console.log({result}, fn.toString())
      }
      if (result instanceof Promise) {
        result = await result
        console.log({result}, fn.toString())
      }

      if (result) {
        global.clearTimeout(timeout)
        global.clearInterval(intervalId)
        resolve()
      }
    }, 5)

    const timeout = global.setTimeout(() => {
      global.clearInterval(intervalId)
      reject(timeoutError)
    }, 500)
  })
}
