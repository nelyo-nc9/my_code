/**
 * 防护舱管理相关的校验规则
 */
//防护舱配置字段正则校验
//0-64个字符或0-32中文
let name = /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/
//ip   ipv4/ipv6
let ip = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/

//数量
let uniqueId = /^[0-9]*$/
//端口  0-65535
let port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

// 防护舱设备配置查询页面校验函数
let validator = {
  intercomPlatform: {
    orgName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('名称为0-64个字符或0-32中文'))
      } else {
        callback()
      }
    },
    keyPartName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('重点部位格式不规范'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('防护舱主机名称格式不规范'))
      } else {
        callback()
      }
    },
    assetCode: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('资产编码格式不规范'))
      } else {
        callback()
      }
    },
    ip: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!ip.test(value)) {
        callback(new Error('ip地址格式不规范'))
      } else {
        callback()
      }
    },
    port: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!port.test(value)) {
        callback(new Error('端口为0-65535'))
      } else {
        callback()
      }
    },
    accessService: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('服务器格式不规范'))
      } else {
        callback()
      }
    },
    cabinNumber: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('防护舱通道数量格式不规范'))
      } else {
        callback()
      }
    },
    inputNumber: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('报警输入数量格式不规范'))
      } else {
        callback()
      }
    },
    outputNumber: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('报警输出数量格式不规范'))
      } else {
        callback()
      }
    },
    brand: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('品牌格式不规范'))
      } else {
        callback()
      }
    },
    deviceSerise: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('设备序列号格式不规范'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('录入机构格式不规范'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('录入人号格式不规范'))
      } else {
        callback()
      }
    },
  }
}
// 引入防护舱设备配置查询页面
let controllerConfiguration = {
  orgName: [{
    validator: validator.intercomPlatform.orgName,
    trigger: 'change'
  }],
  keyPartName: [{
    validator: validator.intercomPlatform.keyPartName,
    trigger: 'change'
  }],
  name: [{
    validator: validator.intercomPlatform.name,
    trigger: 'change'
  }],
  assetCode: [{
    validator: validator.intercomPlatform.assetCode,
    trigger: 'change'
  }],
  ip: [{
    validator: validator.intercomPlatform.ip,
    trigger: 'change'
  }],
  port: [{
    validator: validator.intercomPlatform.port,
    trigger: 'change'
  }],
  accessService: [{
    validator: validator.intercomPlatform.accessService,
    trigger: 'change'
  }],
  cabinNumber: [{
    validator: validator.intercomPlatform.cabinNumber,
    trigger: 'change'
  }],
  inputNumber: [{
    validator: validator.intercomPlatform.inputNumber,
    trigger: 'change'
  }],
  outputNumber: [{
    validator: validator.intercomPlatform.outputNumber,
    trigger: 'change'
  }],
  brand: [{
    validator: validator.intercomPlatform.brand,
    trigger: 'change'
  }],
  deviceSerise: [{
    validator: validator.intercomPlatform.deviceSerise,
    trigger: 'change'
  }],
  updatedDept: [{
    validator: validator.intercomPlatform.updatedDept,
    trigger: 'change'
  }],
  updatedBy: [{
    validator: validator.intercomPlatform.updatedBy,
    trigger: 'change'
  }],

}


// 防护舱主机关联配置查询页面校验函数
let host = {
  hosts: {
    orgName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('名称为0-64个字符或0-32中文'))
      } else {
        callback()
      }
    },
    keyPartName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('重点部位格式不规范'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('防护舱主机名称格式不规范'))
      } else {
        callback()
      }
    },
    assetCode: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('资产编码格式不规范'))
      } else {
        callback()
      }
    },
    ip: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!ip.test(value)) {
        callback(new Error('ip地址格式不规范'))
      } else {
        callback()
      }
    },
    modelNum: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('设备序列号格式不规范'))
      } else {
        callback()
      }
    },
    brand: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('品牌格式不规范'))
      } else {
        callback()
      }
    },
    deviceSerise: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('设备序列号格式不规范'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('录入机构格式不规范'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('录入人号格式不规范'))
      } else {
        callback()
      }
    },
    startTime: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!time.test(value)) {
        callback(new Error('开始时间格式不规范'))
      } else {
        callback()
      }
    },
    endTime: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!time.test(value)) {
        callback(new Error('结束时间格式不规范'))
      } else {
        callback()
      }
    },
  }
}
// 引入防护舱主机关联配置查询页面
let hostConfiguration = {
  orgName: [{
    validator: host.hosts.orgName,
    trigger: 'change'
  }],
  keyPartName: [{
    validator: host.hosts.keyPartName,
    trigger: 'change'
  }],
  name: [{
    validator: host.hosts.name,
    trigger: 'change'
  }],
  assetCode: [{
    validator: host.hosts.assetCode,
    trigger: 'change'
  }],
  ip: [{
    validator: host.hosts.ip,
    trigger: 'change'
  }],
  modelNum: [{
    validator: host.hosts.modelNum,
    trigger: 'change'
  }],
  brand: [{
    validator: host.hosts.brand,
    trigger: 'change'
  }],
  deviceSerise: [{
    validator: host.hosts.deviceSerise,
    trigger: 'change'
  }],
  updatedDept: [{
    validator: host.hosts.updatedDept,
    trigger: 'change'
  }],
  updatedBy: [{
    validator: host.hosts.updatedBy,
    trigger: 'change'
  }],
}


// 防护舱通道关联配置查询页面校验函数
let channel = {
  channels: {
    orgName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('名称为0-64个字符或0-32中文'))
      } else {
        callback()
      }
    },
    keyPartName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('重点部位格式不规范'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('防护舱通道名称格式不规范'))
      } else {
        callback()
      }
    },
    deviceName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('防护舱主机名称格式不规范'))
      } else {
        callback()
      }
    },
    serise: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('防护舱通道号格式不规范'))
      } else {
        callback()
      }
    },
    assetCode: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('资产编码格式不规范'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('录入机构格式不规范'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('录入人号格式不规范'))
      } else {
        callback()
      }
    },
  }
}
// 引入防护舱通道关联配置查询页面
let channelConfiguration = {
  orgName: [{
    validator: channel.channels.orgName,
    trigger: 'change'
  }],
  keyPartName: [{
    validator: channel.channels.keyPartName,
    trigger: 'change'
  }],
  name: [{
    validator: channel.channels.name,
    trigger: 'change'
  }],
  deviceName: [{
    validator: channel.channels.deviceName,
    trigger: 'change'
  }],
  serise: [{
    validator: channel.channels.serise,
    trigger: 'change'
  }],
  assetCode: [{
    validator: channel.channels.assetCode,
    trigger: 'change'
  }],
  updatedDept: [{
    validator: channel.channels.updatedDept,
    trigger: 'change'
  }],
  updatedBy: [{
    validator: channel.channels.updatedBy,
    trigger: 'change'
  }],
}


// 报警输入关联配置查询页面校验函数
let input = {
  inputs: {
    orgName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('名称为0-64个字符或0-32中文'))
      } else {
        callback()
      }
    },
    keyPartName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('重点部位格式不规范'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('报警输入通道名称格式不规范'))
      } else {
        callback()
      }
    },
    deviceName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('所属防护舱主机格式不规范'))
      } else {
        callback()
      }
    },
    serise: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!uniqueId.test(value)) {
        callback(new Error('报警输入通道号格式不规范'))
      } else {
        callback()
      }
    },
    assetCode: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('资产编码格式不规范'))
      } else {
        callback()
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('录入机构格式不规范'))
      } else {
        callback()
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('录入人格式不规范'))
      } else {
        callback()
      }
    },
  }
}
// 引入报警输入关联配置查询页面
let inputConfiguration = {
  orgName: [{
    validator: input.inputs.orgName,
    trigger: 'change'
  }],
  keyPartName: [{
    validator: input.inputs.keyPartName,
    trigger: 'change'
  }],
  name: [{
    validator: input.inputs.name,
    trigger: 'change'
  }],
  deviceName: [{
    validator: input.inputs.deviceName,
    trigger: 'change'
  }],
  serise: [{
    validator: input.inputs.serise,
    trigger: 'change'
  }],
  assetCode: [{
    validator: input.inputs.assetCode,
    trigger: 'change'
  }],
  updatedDept: [{
    validator: input.inputs.updatedDept,
    trigger: 'change'
  }],
  updatedBy: [{
    validator: input.inputs.updatedBy,
    trigger: 'change'
  }],
}


//操作日志
let logsFirst = {
  logsFirsts: {
    name: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('名称格式不规范,为0-64个字符或0-32中文'))
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
    channelName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('防护舱通道名称格式不规范'))
      } else {
        callback()
      }
    },
    deviceName: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('防护舱主机名称格式不规范'))
      } else {
        callback()
      }
    },
    logType: (rule, value, callback) => {
      if (value == '') {
        callback()
      }
      if (!name.test(value)) {
        callback(new Error('日志类型格式不规范'))
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
  channelName: [{
    validator: logsSecond.logsSeconds.channelName,
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
}


export default {
  controllerConfiguration,
  hostConfiguration,
  channelConfiguration,
  inputConfiguration,
  first,
  second
}
