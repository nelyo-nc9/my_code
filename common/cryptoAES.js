import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse('123456789july703') // 16位
const iv = CryptoJS.enc.Utf8.parse('123456789july703')

export default {
  // aes加密
  encrypt(word) {
    let encrypted = ''
    if (typeof word === 'string') {
      const srcs = CryptoJS.enc.Utf8.parse(word)
      encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
    } else if (typeof word === 'object') {
      // 对象格式的转成json字符串
      const data = JSON.stringify(word)
      const srcs = CryptoJS.enc.Utf8.parse(data)
      encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
    }
    return encrypted.ciphertext.toString()
  },
  // aes解密
  decrypt(word) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  },
  // urlSlice
  urlSlice(str) {
    let reg = new RegExp('(^|&)' + str + '=([^&]*)(&|$)', 'i') // 定义正则表达式
    var r = window.location.search.substr(1).match(reg)
    if (r !== null) {
      return unescape(r[2])
    } else {
      return null
    }
  }
}
