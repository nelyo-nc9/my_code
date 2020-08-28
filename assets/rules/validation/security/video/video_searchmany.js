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
  // 查询表单
  creates: {
    orgName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    keyPartName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属重点部位格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    storageServerId: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('存储位置格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录像计划名称格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    channelName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资源名称格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    ip: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (!ip.test(value)) {
        callback(new Error('IP地址格式不规范'))
      } else {
        callback()
      }
    },
    planTemplateId: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录像计划格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    status: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录像状态格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    streamType: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录像码流格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (!name.test(value) || !han.test(value)) {
        callback(new Error('录入人格式不规范'))
      } else {
        callback()
      }
    },
    updatedAt: (rule, value, callback) => {
      if (value === '' || typeof value === 'object') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入时间格式不可超出128个字符'))
      } else {
        callback()
      }
    }
  }
}
//
// 视频管理，视频配置，视频主机配置，查询
let create2 = {
  // 查询表单
  creates2: {
    orgName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    keyPartName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属重点部位格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('设备名称格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    type: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('设备类型格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    brand: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('品牌格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    modelNum: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('设备型号格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    uniqueId: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('序列号格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    assetCode: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资产编码格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    status: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('状态格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (!name.test(value) || !han.test(value)) {
        callback(new Error('录入人格式不规范'))
      } else {
        callback()
      }
    },
    updatedAt: (rule, value, callback) => {
      if (value === '' || typeof value === 'object') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入时间格式不可超出128个字符'))
      } else {
        callback()
      }
    }
  }
}
// 视频管理，视频配置，摄像机管理配置，查询
let create3 = {
  // 查询表单
  creates3: {
    orgName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    keyPartName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属重点部位格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    deviceName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属设备格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资源名称格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    class: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资源类型格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    brand: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('品牌格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    modelNum: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('设备型号格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    ip: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (!ip.test(value)) {
        callback(new Error('IP地址格式不规范'))
      } else {
        callback()
      }
    },
    uniqueId: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('序列号格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    assetCode: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资产编码格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    status: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('状态格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (!name.test(value) || !han.test(value)) {
        callback(new Error('录入人格式不规范'))
      } else {
        callback()
      }
    },
    updatedAt: (rule, value, callback) => {
      if (value === '' || typeof value === 'object') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入时间格式不可超出128个字符'))
      } else {
        callback()
      }
    }
  }
}
// 视频管理，视频配置，报警输入关联配置，查询
let create4 = {
  // 查询表单
  creates4: {
    orgName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    keyPartName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属重点部位格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    deviceName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属设备格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资源名称格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    class: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资源类型格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    brand: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('品牌格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    modelNum: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('设备型号格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    assetCode: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资产编码格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    status: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('状态格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (!name.test(value) || !han.test(value)) {
        callback(new Error('录入人格式不规范'))
      } else {
        callback()
      }
    },
    updatedAt: (rule, value, callback) => {
      if (value === '' || typeof value === 'object') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入时间格式不可超出128个字符'))
      } else {
        callback()
      }
    }
  }
}
// 视频管理，视频配置，视频主机关联配置，查询
let create5 = {
  // 查询表单
  creates5: {
    orgName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    keyPartName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('所属重点部位格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    deviceName: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('设备名称格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    brand: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('品牌格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    class: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('设备类型格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    modelNum: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('设备型号格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    uniqueId: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('序列号格式不可超出128个字符'))
      } else {
        callback()
      }
    },

    assetCode: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('资产编码格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    status: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('状态格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入机构格式不可超出128个字符'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      if (!name.test(value) || !han.test(value)) {
        callback(new Error('录入人格式不规范'))
      } else {
        callback()
      }
    },
    updatedAt: (rule, value, callback) => {
      if (value === '' || typeof value === 'object') {
        callback()
      }
      if (maxLong(value)) {
        callback(new Error('录入时间格式不可超出128个字符'))
      } else {
        callback()
      }
    }
  }
}
//
let searchCheck_recordHost_recordSearch = {
  orgName: [
    {
      // required: false,
      validator: create.creates.orgName,
      trigger: 'change'
    }
  ],

  keyPartName: [
    {
      validator: create.creates.keyPartName,
      trigger: 'change'
    }
  ],
  storageServerId: [
    {
      validator: create.creates.storageServerId,
      trigger: 'change'
    }
  ],
  name: [
    {
      validator: create.creates.name,
      trigger: 'change'
    }
  ],
  channelName: [
    {
      validator: create.creates.channelName,
      trigger: 'change'
    }
  ],
  ip: [
    {
      validator: create.creates.ip,
      trigger: 'change'
    }
  ],
  planTemplateId: [
    {
      validator: create.creates.planTemplateId,
      trigger: 'change'
    }
  ],
  status: [
    {
      validator: create.creates.status,
      trigger: 'change'
    }
  ],
  streamType: [
    {
      validator: create.creates.streamType,
      trigger: 'change'
    }
  ],
  updatedDept: [
    {
      validator: create.creates.updatedDept,
      trigger: 'change'
    }
  ],
  updatedBy: [
    {
      validator: create.creates.updatedBy,
      trigger: 'change'
    }
  ],
  updatedAt: [
    {
      validator: create.creates.updatedAt,
      trigger: 'change'
    }
  ]
}
//
let searchCheck_videoHost_Search = {
  orgName: [
    {
      // required: false,
      validator: create2.creates2.orgName,
      trigger: 'change'
    }
  ],

  keyPartName: [
    {
      validator: create2.creates2.keyPartName,
      trigger: 'change'
    }
  ],
  name: [
    {
      validator: create2.creates2.name,
      trigger: 'change'
    }
  ],
  type: [
    {
      validator: create2.creates2.type,
      trigger: 'change'
    }
  ],
  brand: [
    {
      validator: create2.creates2.brand,
      trigger: 'change'
    }
  ],
  modelNum: [
    {
      validator: create2.creates2.modelNum,
      trigger: 'change'
    }
  ],
  uniqueId: [
    {
      validator: create2.creates2.uniqueId,
      trigger: 'change'
    }
  ],
  assetCode: [
    {
      validator: create2.creates2.assetCode,
      trigger: 'change'
    }
  ],
  status: [
    {
      validator: create2.creates2.status,
      trigger: 'change'
    }
  ],
  updatedDept: [
    {
      validator: create2.creates2.updatedDept,
      trigger: 'change'
    }
  ],
  updatedBy: [
    {
      validator: create2.creates2.updatedBy,
      trigger: 'change'
    }
  ],
  updatedAt: [
    {
      validator: create2.creates2.updatedAt,
      trigger: 'change'
    }
  ]
}
//
let searchCheck_cameraRelate_Search = {
  orgName: [
    {
      // required: false,
      validator: create3.creates3.orgName,
      trigger: 'change'
    }
  ],

  keyPartName: [
    {
      validator: create3.creates3.keyPartName,
      trigger: 'change'
    }
  ],
  deviceName: [
    {
      validator: create3.creates3.deviceName,
      trigger: 'change'
    }
  ],
  name: [
    {
      validator: create3.creates3.name,
      trigger: 'change'
    }
  ],
  class: [
    {
      validator: create3.creates3.class,
      trigger: 'change'
    }
  ],
  brand: [
    {
      validator: create3.creates3.brand,
      trigger: 'change'
    }
  ],
  modelNum: [
    {
      validator: create3.creates3.modelNum,
      trigger: 'change'
    }
  ],
  ip: [
    {
      validator: create3.creates3.ip,
      trigger: 'change'
    }
  ],
  uniqueId: [
    {
      validator: create3.creates3.uniqueId,
      trigger: 'change'
    }
  ],
  assetCode: [
    {
      validator: create3.creates3.assetCode,
      trigger: 'change'
    }
  ],
  status: [
    {
      validator: create3.creates3.status,
      trigger: 'change'
    }
  ],
  updatedDept: [
    {
      validator: create3.creates3.updatedDept,
      trigger: 'change'
    }
  ],
  updatedBy: [
    {
      validator: create3.creates3.updatedBy,
      trigger: 'change'
    }
  ],
  updatedAt: [
    {
      validator: create3.creates3.updatedAt,
      trigger: 'change'
    }
  ]
}
//
let searchCheck_videoHostIO_Search = {
  orgName: [
    {
      // required: false,
      validator: create4.creates4.orgName,
      trigger: 'change'
    }
  ],

  keyPartName: [
    {
      validator: create4.creates4.keyPartName,
      trigger: 'change'
    }
  ],
  deviceName: [
    {
      validator: create4.creates4.deviceName,
      trigger: 'change'
    }
  ],
  name: [
    {
      validator: create4.creates4.name,
      trigger: 'change'
    }
  ],
  class: [
    {
      validator: create4.creates4.class,
      trigger: 'change'
    }
  ],
  brand: [
    {
      validator: create4.creates4.brand,
      trigger: 'change'
    }
  ],
  modelNum: [
    {
      validator: create4.creates4.modelNum,
      trigger: 'change'
    }
  ],

  assetCode: [
    {
      validator: create4.creates4.assetCode,
      trigger: 'change'
    }
  ],
  status: [
    {
      validator: create4.creates4.status,
      trigger: 'change'
    }
  ],
  updatedDept: [
    {
      validator: create4.creates4.updatedDept,
      trigger: 'change'
    }
  ],
  updatedBy: [
    {
      validator: create4.creates4.updatedBy,
      trigger: 'change'
    }
  ],
  updatedAt: [
    {
      validator: create4.creates4.updatedAt,
      trigger: 'change'
    }
  ]
}
//
let searchCheck_videoHostRelate_Search = {
  orgName: [
    {
      // required: false,
      validator: create5.creates5.orgName,
      trigger: 'change'
    }
  ],

  keyPartName: [
    {
      validator: create5.creates5.keyPartName,
      trigger: 'change'
    }
  ],
  deviceName: [
    {
      validator: create5.creates5.deviceName,
      trigger: 'change'
    }
  ],
  brand: [
    {
      validator: create5.creates5.brand,
      trigger: 'change'
    }
  ],
  class: [
    {
      validator: create5.creates5.class,
      trigger: 'change'
    }
  ],

  modelNum: [
    {
      validator: create5.creates5.modelNum,
      trigger: 'change'
    }
  ],
  uniqueId: [
    {
      validator: create5.creates5.uniqueId,
      trigger: 'change'
    }
  ],
  assetCode: [
    {
      validator: create5.creates5.assetCode,
      trigger: 'change'
    }
  ],
  status: [
    {
      validator: create5.creates5.status,
      trigger: 'change'
    }
  ],
  updatedDept: [
    {
      validator: create5.creates5.updatedDept,
      trigger: 'change'
    }
  ],
  updatedBy: [
    {
      validator: create5.creates5.updatedBy,
      trigger: 'change'
    }
  ],
  updatedAt: [
    {
      validator: create5.creates5.updatedAt,
      trigger: 'change'
    }
  ]
}
export default {
  searchCheck_recordHost_recordSearch,
  searchCheck_videoHost_Search,
  searchCheck_cameraRelate_Search,
  searchCheck_videoHostIO_Search,
  searchCheck_videoHostRelate_Search
}
//
