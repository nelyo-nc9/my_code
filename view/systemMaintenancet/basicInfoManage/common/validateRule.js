const noNullValid = (value, warningFn) => { // 名称校验（非空）
  if (value) {
    value = value.replace(/(^\s*)|(\s*$)/g, '')
    let len = 0
    for (let i = 0; i < value.length; i++) {
      const code = Number(value[i].charCodeAt(0))
      if (code > 127) {
        len += 2
      } else {
        len++
      }
    }
    if (len > 128) {
      warningFn('不能超过128位字符')
      return false
    } else {
      return true
    }
  } else {
    warningFn('不能为空')
    return false
  }
}
const nameValid = (value, warningFn) => { // 名称校验
  if (value) {
    value = value.replace(/(^\s*)|(\s*$)/g, '')
    let len = 0
    for (let i = 0; i < value.length; i++) {
      const code = Number(value[i].charCodeAt(0))
      if (code > 127) {
        len += 2
      } else {
        len++
      }
    }
    if (len > 128) {
      warningFn('不能超过128位字符')
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}
const phoneValid = (value, warningFn) => { // 固定电话校验
  if (value) {
    let test = /^0\d{2,3}-[1-9]\d{6,7}$/.test(value)
    if (!test) {
      warningFn('请输入正确固定电话号码')
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}
const mobileValid = (value, warningFn) => { // 手机号校验
  if (value) {
    let test = /^1(3|4|5|6|7|8|9)\d{9}$/.test(value)
    if (!test) {
      warningFn('请输入正确手机号码')
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}
const serialValid = (value, warningFn) => { // 机构代码校验
  if (value) {
    let test = /^\d+$/.test(value)
    if (!test) {
      warningFn('只能输入数字')
      return false
    } else {
      return true
    }
  } else {
    warningFn('不能为空')
    return false
  }
}
const emailValid = (value, warningFn) => { // 邮箱校验
  if (value) {
    let test = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)
    if (!test) {
      warningFn('请输入正确邮箱格式')
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}
const typeRuleObj = {
  'name': noNullValid,
  'address': nameValid,
  'oidName': nameValid,
  'telephone': nameValid,
  'principal1': nameValid,
  'principalPhone1': nameValid,
  'principal2': nameValid,
  'principalPhone2': nameValid,
  'principal3': nameValid,
  'principalPhone3': nameValid,
  'principal4': nameValid,
  'principalPhone4': nameValid,
  'principal5': nameValid,
  'principalPhone5': nameValid,
  'policeStation': nameValid,
  'policeTelephone': nameValid,
  'police': nameValid,
  'policeMobilePhone': nameValid,
  'serial': serialValid,
  'remark': nameValid,
  'functionary': nameValid,
  'mobile': nameValid,
  'email': emailValid
}
export function dataRule(val, type, warningFn) { // 数据校验，val-需要校验的值, type-对应typeRuleObj里的校验规则,
  let res = ''
  let ruleType = typeRuleObj[type]
  res = ruleType(val, warningFn)
  return res
}
