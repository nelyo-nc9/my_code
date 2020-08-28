/**
 * 防抖：触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。
 * 节流：高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率
 * 防抖函数
 * @method debounce
 *
 * 节流函数
 * @method throttle
 *
 * */
/* debounce */
export function debounce(fn, delay = 1000) {
  let timer = null
  return function () {
    let args = arguments
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(this, args) // this 指向vue
    }, delay)
  }
}
/* throttle */
export function thorttle(fn, delay = 1000) {
  let lastTime = ''
  let timer = ''
  let interval = delay
  return function () {
    let args = arguments
    let nowTime = Date.now()
    if (lastTime && nowTime - lastTime < interval) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        lastTime = nowTime
        fn.apply(this, args)
      }, interval)
    } else {
      lastTime = nowTime
      fn.apply(this, args)
    }
  }
}
