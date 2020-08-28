/**
 * 联动互锁门相关的校验规则
 */
//联动互锁门字段正则校验
//0-64个字符或0-32中文
let name = /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/
//ip   ipv4/ipv6
let ip = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/

//数量
let uniqueId = /^[0-9]*$/
//端口  0-65535
let port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/



//操作日志
let logsFirst = {
  logsFirsts: {
    name: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('姓名格式不规范'))
      } else {
        callback()
      }
    },
    userName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('用户格式不规范'))
      } else {
        callback()
      }
    },
    orgName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('所属机构格式不规范'))
      } else {
        callback()
      }
    },
    ip: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!ip.test(value)) {
        callback(new Error('ip格式不规范'))
      } else {
        callback()
      }
    },
    object: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('操作对象格式不规范'))
      } else {
        callback()
      }
    },
    description: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('操作描述格式不规范'))
      } else {
        callback()
      }
    },
  }
}
//引入操作日志
let first = {
  name: [{
    validator: logsFirst.logsFirsts.name,
    trigger: 'change'
  }],
  userName: [{
    validator: logsFirst.logsFirsts.userName,
    trigger: 'change'
  }],
  orgName: [{
    validator: logsFirst.logsFirsts.orgName,
    trigger: 'change'
  }],
  ip: [{
    validator: logsFirst.logsFirsts.ip,
    trigger: 'change'
  }],
  object: [{
    validator: logsFirst.logsFirsts.object,
    trigger: 'change'
  }],
  description: [{
    validator: logsFirst.logsFirsts.description,
    trigger: 'change'
  }],
}
//时间日志
let logsSecond = {
  logsSeconds: {
    orgName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('所属机构格式不规范'))
      } else {
        callback()
      }
    },
    keyPartName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('所属重点部位格式不规范'))
      } else {
        callback()
      }
    },
    deviceName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('所属门禁格式不规范'))
      } else {
        callback()
      }
    },
    logType: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('日志子类型格式不规范'))
      } else {
        callback()
      }
    },
    guardChannelName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('门禁通道名称格式不规范'))
      } else {
        callback()
      }
    },
    cardNumber: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('卡号格式不规范'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('姓名格式不规范'))
      } else {
        callback()
      }
    },
    identityCard: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('身份证格式不规范'))
      } else {
        callback()
      }
    },
    department: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('部门格式不规范'))
      } else {
        callback()
      }
    },
    job: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('职务格式不规范'))
      } else {
        callback()
      }
    },

  }
}
//引入时间日志
let second = {
  orgName: [{
    validator: logsSecond.logsSeconds.orgName,
    trigger: 'change'
  }],
  keyPartName: [{
    validator: logsSecond.logsSeconds.keyPartName,
    trigger: 'change'
  }],
  deviceName: [{
    validator: logsSecond.logsSeconds.deviceName,
    trigger: 'change'
  }],
  logType: [{
    validator: logsSecond.logsSeconds.logType,
    trigger: 'change'
  }],
  guardChannelName: [{
    validator: logsSecond.logsSeconds.guardChannelName,
    trigger: 'change'
  }],
  cardNumber: [{
    validator: logsSecond.logsSeconds.cardNumber,
    trigger: 'change'
  }],
  name: [{
    validator: logsSecond.logsSeconds.name,
    trigger: 'change'
  }],
  identityCard: [{
    validator: logsSecond.logsSeconds.identityCard,
    trigger: 'change'
  }],
  department: [{
    validator: logsSecond.logsSeconds.department,
    trigger: 'change'
  }],
  job: [{
    validator: logsSecond.logsSeconds.job,
    trigger: 'change'
  }],
}


export default {
  first,
  second
}
