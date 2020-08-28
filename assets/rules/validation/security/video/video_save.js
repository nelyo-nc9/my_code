// 视频管理字段正则校验
// 0-64个字符或0-32中文
let name = /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/
// ip   ipv4/ipv6
let ip = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
// 数量
const uniqueId = /^[0-9]*$/
// 端口  0-65535
let port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
// 汉字
const han = /^[\u4e00-\u9fa5]+$/
let maxLong = (value, max = 128) => {
  if (!value) {
    return false
  }
  let leng = 0
  let str = `${value}`.replace(/(^\s*)|(\s*$)/g, '')
  str.split('').forEach((i) => {
    if (/^[\u4e00-\u9fa5]+$/i.test(i)) {
      leng += 1
    }
  })
  if (str.length + leng > max) {
    return true
  } else {
    return false
  }
}
// 视频主机配置新建
let create = {
  creates: {
    name: (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error('录像计划名称为必填'))
      }
      if (maxLong(value)) {
        callback(new Error('录像计划名称格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    planTemplateId: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('录像计划为必填'))
      }
      if (!name.test(value)) {
        callback(new Error('录像计划格式不规范'))
      } else {
        callback()
      }
    },
    streamType: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('录像码流为必填'))
      }
      if (!name.test(value)) {
        callback(new Error('录像码流格式不规范'))
      } else {
        callback()
      }
    },
    status: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('录像状态为必填'))
      }
      if (!name.test(value)) {
        callback(new Error('录像状态格式不规范'))
      } else {
        callback()
      }
    }

  }
}
//
let saveCheck = {
  name: [
    {
      // required: false,
      validator: create.creates.name,
      trigger: 'change'
    }
  ],
  planTemplateId: [
    {
      // required: false,
      validator: create.creates.planTemplateId,
      trigger: 'change'
    }
  ],
  streamType: [
    {
      // required: false,
      validator: create.creates.streamType,
      trigger: 'change'
    }
  ],
  status: [
    {
      // required: false,
      validator: create.creates.status,
      trigger: 'change'
    }
  ]
}

export default {
  saveCheck
}
