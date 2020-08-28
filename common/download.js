/* eslint-disable no-unused-expressions */
export const download = (url, nameFormat, complete, defeated, progress, type, data) => {
  let req = new XMLHttpRequest()
  type = type || 'get'
  req.open(type, url, true)
  // 监听进度事件
  req.addEventListener('progress', function (evt) {
    if (evt.lengthComputable) {
      // let percentComplete = evt.loaded / evt.total;
      progress ? progress(evt) : ''
    }
  }, false)
  if (type === 'post') {
    req.setRequestHeader('Content-Type', 'application/json')
  }
  req.responseType = 'blob'
  req.setRequestHeader('Authorization', JSON.parse(window.sessionStorage.getItem('user')).token || '')
  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200 || req.status === 201) {
        if (typeof window.chrome !== 'undefined') {
          // Chrome version
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(req.response)
          link.download = nameFormat
          link.click()
        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE version
          let blob = new Blob([req.response], { type: 'application/force-download' })
          window.navigator.msSaveBlob(blob, nameFormat)
        } else {
          // Firefox version
          let file = new File([req.response], nameFormat, { type: 'application/force-download' })
          window.open(URL.createObjectURL(file))
        }
        complete ? complete(req) : ''
      } else {
        // 请求失败
        defeated ? defeated(req) : ''
      }
    }
  }
  if (type === 'post') {
    req.send(JSON.stringify(data))
  } else {
    req.send()
  }
}
