// 视频管理字段正则校验
// 0-64个字符或0-32中文
let name = /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/
// ip   ipv4/ipv6
let ip = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
// 数量
const uniqueId = /^[0-9]*$/
// 端口  0-65535
let port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
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
        return callback(new Error('资源名称必填'))
      }
      if (maxLong(value)) {
        callback(new Error('资源名称格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    class: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('资源类型必填'))
      }
      if (maxLong(value)) {
        callback(new Error('资源类型格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    serise: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('通道号必填'))
      }
      if (maxLong(value)) {
        callback(new Error('通道号格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    brand: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('品牌必填'))
      }
      if (maxLong(value)) {
        callback(new Error('品牌格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    modelNum: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('型号必填'))
      }
      if (maxLong(value)) {
        callback(new Error('型号格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    stream: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('码流必填'))
      }
      if (maxLong(value)) {
        callback(new Error('码流格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    assetCode: (rule, value, callback) => {
      if (maxLong(value)) {
        callback(new Error('资产编码格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    accessProtocol: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('接入协议为必填'))
      }
      if (maxLong(value)) {
        callback(new Error('接入协议格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    accessService: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('接入服务器为必填'))
      }
      if (maxLong(value)) {
        callback(new Error('接入服务器名字不可超出128个字符'))
      } else {
        callback()
      }
    },
    cport: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('控制端口为必填'))
      }
      if (!port.test(value)) {
        callback(new Error('控制端口格式不规范'))
      } else {
        callback()
      }
    },
    username: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('用户名为必填'))
      }
      if (maxLong(value)) {
        callback(new Error('用户名格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    protocol: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('传输协议为必填'))
      }
      if (maxLong(value)) {
        callback(new Error('传输协议格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    uniqueId: (rule, value, callback) => {
      if (maxLong(value)) {
        callback(new Error('序列号格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    ip: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('IP地址为必填'))
      }
      if (!ip.test(value)) {
        callback(new Error('IP地址格式不规范'))
      } else {
        callback()
      }
    },
    dport: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('数据端口为必填'))
      }
      if (maxLong(value)) {
        callback(new Error('数据端口格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    password: (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('密码为必填'))
      }
      if (maxLong(value, 32)) {
        callback(new Error('密码格式不可超出32个字符'))
      } else {
        callback()
      }
    }
  }
}
// 视频通道
let videoChannel = {
  name: [
    {
      required: true,
      validator: create.creates.name,
      trigger: 'change'
    }
  ],
  class: [
    {
      required: true,
      validator: create.creates.class,
      trigger: 'change'
    }
  ],
  serise: [
    {
      required: true,
      validator: create.creates.serise,
      trigger: 'change'
    }
  ],
  brand: [
    {
      required: true,
      validator: create.creates.brand,
      trigger: 'change'
    }
  ],
  modelNum: [
    {
      required: true,
      validator: create.creates.modelNum,
      trigger: 'change'
    }
  ],
  stream: [
    {
      required: true,
      validator: create.creates.stream,
      trigger: 'change'
    }
  ],
  assetCode: [
    {
      //   required: true,
      validator: create.creates.assetCode,
      trigger: 'change'
    }
  ],
  accessService: [
    {
      required: true,
      validator: create.creates.accessService,
      trigger: 'change'
    }
  ],
  accessProtocol: [
    {
      required: true,
      validator: create.creates.accessProtocol,
      trigger: 'change'
    }
  ],
  protocol: [
    {
      required: true,
      validator: create.creates.protocol,
      trigger: 'change'
    }
  ],
  ip: [
    {
      required: true,
      validator: create.creates.ip,
      trigger: 'change'
    }
  ],
  cport: [
    {
      required: true,
      validator: create.creates.cport,
      trigger: 'change'
    }
  ],
  dport: [
    {
      required: true,
      validator: create.creates.dport,
      trigger: 'change'
    }
  ],
  username: [
    {
      required: true,
      validator: create.creates.username,
      trigger: 'change'
    }
  ],
  password: [
    {
      required: true,
      validator: create.creates.password,
      trigger: 'change'
    }
  ],
  uniqueId: [
    {
      validator: create.creates.uniqueId,
      trigger: 'change'
    }
  ]
}
// 音频通道
let audioChannel = {
  name: [
    {
      required: true,
      validator: create.creates.name,
      trigger: 'change'
    }
  ],
  class: [
    {
      required: true,
      validator: create.creates.class,
      trigger: 'change'
    }
  ],
  serise: [
    {
      required: true,
      validator: create.creates.serise,
      trigger: 'change'
    }
  ],
  brand: [
    {
      required: true,
      validator: create.creates.brand,
      trigger: 'change'
    }
  ],
  modelNum: [
    {
      required: true,
      validator: create.creates.modelNum,
      trigger: 'change'
    }
  ],
  assetCode: [
    {
      //   required: true,
      validator: create.creates.assetCode,
      trigger: 'change'
    }
  ]
} // 报警输入通道
let alarmInputChannel = {
  name: [
    {
      required: true,
      validator: create.creates.name,
      trigger: 'change'
    }
  ],
  class: [
    {
      required: true,
      validator: create.creates.class,
      trigger: 'change'
    }
  ],
  serise: [
    {
      required: true,
      validator: create.creates.serise,
      trigger: 'change'
    }
  ],
  brand: [
    {
      required: true,
      validator: create.creates.brand,
      trigger: 'change'
    }
  ],
  modelNum: [
    {
      required: true,
      validator: create.creates.modelNum,
      trigger: 'change'
    }
  ],
  assetCode: [
    {
      //   required: true,
      validator: create.creates.assetCode,
      trigger: 'change'
    }
  ]
} // 报警输出通道
let alarmOutputChannel = {
  name: [
    {
      required: true,
      validator: create.creates.name,
      trigger: 'change'
    }
  ],
  class: [
    {
      required: true,
      validator: create.creates.class,
      trigger: 'change'
    }
  ],
  serise: [
    {
      required: true,
      validator: create.creates.serise,
      trigger: 'change'
    }
  ],
  brand: [
    {
      required: true,
      validator: create.creates.brand,
      trigger: 'change'
    }
  ],
  modelNum: [
    {
      required: true,
      validator: create.creates.modelNum,
      trigger: 'change'
    }
  ],
  assetCode: [
    {
      //   required: true,
      validator: create.creates.assetCode,
      trigger: 'change'
    }
  ]
}
export default {
  videoChannel,
  audioChannel,
  alarmInputChannel,
  alarmOutputChannel
}
