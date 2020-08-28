//视频管理字段正则校验
//0-64个字符或0-32中文
let name = /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/
//ip   ipv4/ipv6
let ip = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
//数量
const uniqueId = /^[0-9]*$/
//端口  0-65535
let port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

//视频主机配置新建
let create = {
  creates: {
    alarmtErrorValue: (rule, value, callback) => {
      if (value.length === 0) {
        // if (value === '') {
        return callback(new Error('报警输入必填'))
      }
      //   if (!name.test(value)) {
      //     callback(new Error('报警输入格式不规范'))
      //   } else {
      //     callback()
      //   }
    },
    deviceErrorValue: (rule, value, callback) => {
      if (value.length === 0) {
        // if (value === '') {
        return callback(new Error('异常类型必填'))
      }
      //   if (!name.test(value)) {
      //     callback(new Error('异常类型格式不规范'))
      //   } else {
      //     callback()
      //   }
    },
    moveSenseValue: (rule, value, callback) => {
      if (value.length === 0) {
        // if (value === '') {
        return callback(new Error('移动侦测必填'))
      }
      //   if (!name.test(value)) {
      //     callback(new Error('移动侦测格式不规范'))
      //   } else {
      //     callback()
      //   }
    },
    channelNumber: (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('通道号必填'))
      }
      //   if (!name.test(value)) {
      //     callback(new Error('通道号格式不规范'))
      //   } else {
      //     callback()
      //   }
    },
    judgeType: (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('诊断类型必填'))
      }
      //   if (!name.test(value)) {
      //     callback(new Error('诊断类型格式不规范'))
      //   } else {
      //     callback()
      //   }
    }
  }
}

//视频主机事件管理
let eventManage = {
  alarmtErrorValue: [
    {
      required: true,
      validator: create.creates.alarmtErrorValue,
      trigger: 'change'
    }
  ],
  deviceErrorValue: [
    {
      required: true,
      validator: create.creates.deviceErrorValue,
      trigger: 'change'
    }
  ],
  moveSenseValue: [
    {
      required: true,
      validator: create.creates.moveSenseValue,
      trigger: 'change'
    }
  ],
  channelNumber: [
    {
      required: true,
      validator: create.creates.channelNumber,
      trigger: 'change'
    }
  ],
  judgeType: [
    {
      required: true,
      validator: create.creates.judgeType,
      trigger: 'change'
    }
  ]
}

export default {
  eventManage
}
