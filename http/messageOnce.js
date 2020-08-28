import { Message, Notification } from 'element-ui'
const showMessage = Symbol('showMessage')
class DomMessage {
  success(options, next, single = true) {
    this[showMessage]('success', options, next, single)
  }
  warning(options, next, single = true) {
    this[showMessage]('warning', options, next, single)
  }
  info(options, next, single = true) {
    this[showMessage]('info', options, next, single)
  }
  error(options, next, single = true) {
    this[showMessage]('error', options, next, single)
  }
  [showMessage](type, options, next, single) {
    if (single) {
      if (document.getElementsByClassName('el-message__content').length === 0) {
        Message[type](options)
        next()
      }
    } else {
      Message[type](options)
    }
  }
}

const position = {
  tl: 'top-left',
  tr: 'top-right',
  br: 'bottom-right',
  bl: 'bottom-left'
}
const typ = {
  w: 'warning',
  i: 'info',
  s: 'success',
  e: 'error'
}
const title = {
  ok: '成功',
  no: '失败'
}
// 提示窗
// t: type            t   主题样式	          string     info
// mg: message       mg   说明文字	          string
// tit: title       tit   标题	              string
// p: position        p   位置	              string     top-right
// st: duration      st   显示时间            number     4500
// set: offset      set   偏移的距离          number     0
// sh: showClose     sh   是否显示关闭按钮	  boolean    true
const Msg = (obj = {t: '', mg: '', tit: '', p: '', st: '', set: '', sh: ''}) => {
  return Notification({
    type: typ[`${obj['t']}`] || 'info',
    message: obj['mg'] || '',
    title: obj['tit'] ? title[`${obj['tit']}`] || obj['tit'] : '',
    position: position[`${obj['p']}`] || 'top-right',
    duration: obj['st'] ? obj['st'] * 1 : 4500,
    offset: obj['set'] * 1 || 0,
    showClose: obj['sh'] ? Boolean(obj['sh']) : true
  })
}

export {DomMessage, Msg}
