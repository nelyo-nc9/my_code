/**
 * 音频管理相关的校验规则
 */
// 对讲平台的字段正则校验
let name = /(^.{0,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let ip = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
let userName = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let passWord = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let uniqueId = /^[0-9]*$/
let port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
let intercomNumber = /^[0-9]*$/
let outputNumber = /^[0-9]*$/
let updatedBy = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let updatedDept = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let serise = /^[0-9]*$/
let channelname = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let sponsor = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let participant = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/

//获得输入框中字符长度
function getLength(val) {  
  var str = new String(val);  
  var bytesCount = 0;  
  for (var i = 0 ,n = str.length; i < n; i++) {  
      var c = str.charCodeAt(i);  
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
          bytesCount += 1;  
      } else {  
          bytesCount += 2;  
      }  
  }  
  return bytesCount;  
}  

let isNum = /^[0-9]*$/;
// 校验函数
let validator = {
  // 对讲平台
  intercomPlatform: {
    Name: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入平台名称'))
      }
      
      // getLength(value)>128
      if (!name.test(value)) {
        callback(new Error('仅输入长度0-128的字符'))
      } else {
        callback()
      }
    },
    Ip: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入平台ip'))
      }
      if (!ip.test(value)) {
        callback(new Error('ip地址格式不规范'))
      } else {
        callback()
      }
    },
    userName: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入平台用户名'))
      }
      if (!userName.test(value)) {
        callback(new Error('平台用户名格式不规范'))
      } else {
        callback()
      }
    },
    passWord: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入平台密码'))
      }
      if (!passWord.test(value)) {
        callback(new Error('平台密码格式不规范'))
      } else {
        callback()
      }
    },
    intercomNumberCreate: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入通道数量'))
      }
        if (!intercomNumber.test(value)) {
          callback(new Error('对讲通道格式不规范 只能为数字'))
        } else {
          callback()
        }
    },
    outputNumberCreate: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入通道数量'))
      }
        if (!outputNumber.test(value)) {
          callback(new Error('输出通道格式不规范 只能为数字'))
        } else {
          callback()
        }
    },
    intercomNumber: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!intercomNumber.test(value)) {
          callback(new Error('对讲通道格式不规范 只能为数字'))
        } else {
          callback()
        }
      }
    },
    outputNumber: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!outputNumber.test(value)) {
          callback(new Error('输出通道格式不规范 只能为数字'))
        } else {
          callback()
        }
      }
    },
    port: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入终端接收端口'))
      }
      if (!port.test(value)) {
        callback(new Error('终端端口格式不规范'))
      } else {
        callback()
      }
    },
    cport: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入服务器接收端口'))
      }
      if (!port.test(value)) {
        callback(new Error('服务器接收端口格式不规范'))
      } else {
        callback()
      }
    },
    dport: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入服务器接收端口'))
      }
      if (!port.test(value)) {
        callback(new Error('服务器接收端口格式不规范'))
      } else {
        callback()
      }
    },
    uniqueId: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入主机唯一ID'))
      }
      if (!uniqueId.test(value)) {
        callback(new Error('您输入的主机唯一ID不规范'))
      } else {
        callback()
      }
    }
  },

  // 对讲台麦
  mike:{
    name: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入台麦名称'))
      }
      if (!name.test(value)) {
        callback(new Error('仅输入长度0-128的字符'))
      } else {
        callback()
      }
    },
    uniqueId: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入台麦唯一ID'))
      }else {
        callback()
      }
    },
    Ip: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入台麦ip'))
      }
      if (!ip.test(value)) {
        callback(new Error('ip地址格式不规范'))
      } else {
        callback()
      }
    },

    port: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入台麦端口'))
      }else if(!isNum.test(value)){
        return callback(new Error('请输入数字端口'))
      }else {
        callback()
      }
    },

    brand: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择品牌'))
      } else {
        callback()
      }
    },

    modelNum: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择型号'))
      } else {
        callback()
      }
    },

  },

  // 对讲主机
  host:{
    name: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入对讲主机名称'))
      }
      if (!name.test(value)) {
        callback(new Error('仅输入长度0-128的字符'))
      } else {
        callback()
      }
    },
    uniqueId: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入对讲通道数量'))
      }else {
        callback()
      }
    },
    intercomNumber: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入对讲通道数量'))
      }else {
        callback()
      }
    },
    outputNumber: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入输出通道数量'))
      }else {
        callback()
      }
    },
    Ip: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入对讲主机ip'))
      }
      if (!ip.test(value)) {
        callback(new Error('ip地址格式不规范'))
      } else {
        callback()
      }
    },

    port: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入对讲主机端口'))
      }else if(!isNum.test(value)){
        return callback(new Error('请输入数字端口'))
      }else {
        callback()
      }
    },

  },
  
  // 对讲平台/设备查询
  intercomPlatformSearch: {
    Name: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!name.test(value)) {
          callback(new Error('对讲平台名称格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    platformName: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!name.test(value)) {
          callback(new Error('所属对讲平台格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    channelname: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!channelname.test(value)) {
          callback(new Error('对讲通道名称输入格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    ip: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!ip.test(value)) {
          callback(new Error('ip地址格式不规范'))
        } else {
          callback()
        }
      }
    },
    intercomNumber: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!intercomNumber.test(value)) {
          callback(new Error('对讲通道格式不规范 只能为数字'))
        } else {
          callback()
        }
      }
    },
    outputNumber: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!outputNumber.test(value)) {
          callback(new Error('输出通道格式不规范 只能为数字'))
        } else {
          callback()
        }
      }
    },
    uniqueId: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!uniqueId.test(value)) {
          callback(new Error('设备唯一ID格式不规范 只能为数字'))
        } else {
          callback()
        }
      }
    },
    port: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!port.test(value)) {
          callback(new Error('终端端口格式不规范'))
        } else {
          callback()
        }
      }
    },
    cport: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!port.test(value)) {
          callback(new Error('服务器端口格式不规范'))
        } else {
          callback()
        }
      }
    },
    dport: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!port.test(value)) {
          callback(new Error('练级端口格式不规范'))
        } else {
          callback()
        }
      }
    },
    createdBy: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!updatedBy.test(value)) {
          callback(new Error('录入人输入格式不规范'))
        } else {
          callback()
        }
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!updatedBy.test(value)) {
          callback(new Error('录入人输入格式不规范'))
        } else {
          callback()
        }
      }
    },
    createdDept: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!updatedDept.test(value)) {
          callback(new Error('录入机构输入格式不规范'))
        } else {
          callback()
        }
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!updatedBy.test(value)) {
          callback(new Error('录入人输入格式不规范'))
        } else {
          callback()
        }
      }
    },
  },
  // 对讲通道查询 
  IntercomChannelSearch: {
    platformName: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!name.test(value)) {
          callback(new Error('所属对讲平台格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    deviceName: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!name.test(value)) {
          callback(new Error('所属对讲主机格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    channelname: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!channelname.test(value)) {
          callback(new Error('对讲通道名称输入格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    serise: (rule, value, callback) => {
      if (value==""){  
        callback()
      }else{
        if (!serise.test(value)) {
          callback(new Error('通道号输入格式不规范 只能为数字'))
        } else {
          callback()
        }
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!updatedBy.test(value)) {
          callback(new Error('录入人输入格式不规范'))
        } else {
          callback()
        }
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!updatedDept.test(value)) {
          callback(new Error('录入机构输入格式不规范'))
        } else {
          callback()
        }
      }
    },
  },
  // 话筒MAC地址绑定查询
  MicrophoneMAC: {
    Name: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!name.test(value)) {
          callback(new Error('对讲设备名称格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    platformName: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!name.test(value)) {
          callback(new Error('所属对讲平台格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    Ip: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!ip.test(value)) {
          callback(new Error('话筒ip地址格式不规范'))
        } else {
          callback()
        }
      }
    },
    uniqueId: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!uniqueId.test(value)) {
          callback(new Error('您输入的话筒唯一ID格式不规范'))
        } else {
          callback()
        }
      }
    },
    updatedBy: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!updatedBy.test(value)) {
          callback(new Error('录入人输入格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
    updatedDept: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!updatedDept.test(value)) {
          callback(new Error('录入机构输入格式不规范 1-128字符'))
        } else {
          callback()
        }
      }
    },
  },
  // 音频日志
  audioLog: {
    sponsor: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!sponsor.test(value)) {
          callback(new Error('仅输入长度0-32的字符'))
        } else {
          callback()
        }
      }
    },
    participant: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!participant.test(value)) {
          callback(new Error('仅输入长度0-32的字符'))
        } else {
          callback()
        }
      }
    },
    name: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!participant.test(value)) {
          callback(new Error('仅输入长度0-32的字符'))
        } else {
          callback()
        }
      }
    },
    userName: (rule, value, callback) => {
      if (value==""){
        callback()
      }else{
        if (!participant.test(value)) {
          callback(new Error('仅输入长度0-32的字符'))
        } else {
          callback()
        }
      }
    },
  }
}

// 对讲平台新建的校验规则
let intercomPlatformRules = {
  name: [{
    required: true,
    validator: validator.intercomPlatform.name,
    trigger: 'change'
  }],
  keyPartId: [{
    required: true,
    message: '请选择重点部位',
    trigger: 'blur'
  }],
  brand: [{
    required: true,
    message: '请选择品牌',
    trigger: 'change'
  }],
  modelNum: [{
    required: true,
    message: '请选择型号',
    trigger: 'change'
  }],
  accessProtocol: [{
    required: true,
    message: '请选择接入协议',
    trigger: 'change'
  }],
  ip: [{
    required: true,
    validator: validator.intercomPlatform.Ip,
    trigger: 'change'
  }],
  intercomNumber: [{
    required: true,
    validator: validator.intercomPlatform.intercomNumberCreate,
    trigger: 'blur'
  }],
  outputNumber: [{
    required: true,
    validator: validator.intercomPlatform.outputNumberCreate,
    trigger: 'blur'
  }],
  port: [{
    required: true,
    validator: validator.intercomPlatform.port,
    trigger: 'change'
  }],
  cport: [{
    required: true,
    validator: validator.intercomPlatform.cport,
    trigger: 'change'
  }],
  dport: [{
    required: true,
    validator: validator.intercomPlatform.dport,
    trigger: 'change'
  }],
  username: [{
    required: true,
    validator: validator.intercomPlatform.userName,
    trigger: 'blur'
  }],
  password: [{
    required: true,
    validator: validator.intercomPlatform.passWord,
    trigger: 'blur'
  }],
  uniqueId: [{
    required: true,
    validator: validator.intercomPlatform.uniqueId,
    trigger: 'change'
  }],
  accessService: [{
    required: true,
    message: '请选择接入服务器',
    trigger: 'change'
  }]
}

// 新增/编辑 平台台麦 校验规则
let mikeRules = {
  name: [{
    required: true,
    validator: validator.mike.name,
    trigger: 'blur'
  }],

  uniqueId: [{
    required: true,
    validator: validator.mike.uniqueId,
    trigger: 'blur'
  }],

  port: [{
    required: true,
    validator: validator.mike.port,
    trigger: 'change'
  }],

  ip: [{
    required: true,
    validator: validator.mike.Ip,
    trigger: 'change'
  }],

  brand: [{
    required: true,
    validator: validator.mike.brand,
    trigger: 'change'
  }],

  modelNum: [{
    required: true,
    validator: validator.mike.modelNum,
    trigger: 'blur'
  }],
  
}

// 新增/编辑 平台主机 校验规则
let hostRules = {
  name: [{
    required: true,
    validator: validator.host.name,
    trigger: 'blur'
  }],

  uniqueId: [{
    required: true,
    validator: validator.host.uniqueId,
    trigger: 'blur'
  }],

  ip: [{
    required: true,
    validator: validator.host.Ip,
    trigger: 'change'
  }],

  port: [{
    required: true,
    validator: validator.host.port,
    trigger: 'blur'
  }],

  intercomNumber: [{
    required: true,
    validator: validator.host.intercomNumber,
    trigger: 'blur'
  }],

  outputNumber: [{
    required: true,
    validator: validator.host.outputNumber,
    trigger: 'blur'
  }],

  brand: [{
    required: true,
    validator: validator.mike.brand,
    trigger: 'change'
  }],

  modelNum: [{
    required: true,
    validator: validator.mike.modelNum,
    trigger: 'blur'
  }],
  
}

// 对讲平台查询校验规则
let intercomPlatformSearch = {

  name: [{
    // required: true,
    validator: validator.intercomPlatformSearch.Name,
    trigger: 'change'
  }],
  platformName: [{
    // required: true,
    validator: validator.intercomPlatformSearch.platformName,
    trigger: 'change'
  }],
  ip: [{
    // required: false,
    validator: validator.intercomPlatformSearch.ip,
    trigger: 'change'
  }],
  intercomNumber: [{
    // required: true,
    validator: validator.intercomPlatformSearch.intercomNumber,
    trigger: 'blur'
  }],
  outputNumber: [{
    // required: true,
    validator: validator.intercomPlatformSearch.outputNumber,
    trigger: 'change'
  }],
  uniqueId: [{
    // required: true,
    validator: validator.intercomPlatformSearch.uniqueId,
    trigger: 'change'
  }],
  port: [{
    // required: true,
    validator: validator.intercomPlatformSearch.port,
    trigger: 'change'
  }],
  cport: [{
    // required: true,
    validator: validator.intercomPlatformSearch.cport,
    trigger: 'change'
  }],
  dport: [{
    // required: true,
    validator: validator.intercomPlatformSearch.dport,
    trigger: 'change'
  }],
  createdBy: [{
    // required: true,
    validator: validator.intercomPlatformSearch.updatedBy,
    trigger: 'change'
  }],
  updatedBy: [{
    // required: true,
    validator: validator.intercomPlatformSearch.updatedBy,
    trigger: 'change'
  }],
  createdDept: [{
    // required: true,
    validator: validator.intercomPlatformSearch.updatedDept,
    trigger: 'change'
  }],
  updatedDept: [{
    // required: true,
    validator: validator.intercomPlatformSearch.updatedDept,
    trigger: 'change'
  }],
}
// 对讲通道查询校验规则
let IntercomChannelSearch = {
  name: [{
    // required: true,
    validator: validator.IntercomChannelSearch.channelname,
    trigger: 'change'
  }],
  platformName: [{
    // required: true,
    validator: validator.IntercomChannelSearch.platformName,
    trigger: 'change'
  }],
  deviceName: [{
    // required: true,
    validator: validator.IntercomChannelSearch.deviceName,
    trigger: 'change'
  }],
  serise: [{
    // required: true,
    validator: validator.IntercomChannelSearch.serise,
    trigger: 'change'
  }],
  ip: [{
    // required: false,
    validator: validator.IntercomChannelSearch.ip,
    trigger: 'change'
  }],
  uniqueId: [{
    // required: true,
    validator: validator.IntercomChannelSearch.uniqueId,
    trigger: 'change'
  }],
  updatedBy: [{
    // required: true,
    validator: validator.IntercomChannelSearch.updatedBy,
    trigger: 'change'
  }],
  updatedDept: [{
    // required: true,
    validator: validator.IntercomChannelSearch.updatedDept,
    trigger: 'change'
  }],
}
// 话筒MAC地址绑定校验规则
let MicrophoneMAC = {
  name: [{
    // required: true,
    validator: validator.MicrophoneMAC.Name,
    trigger: 'change'
  }],
  platformName: [{
    // required: true,
    validator: validator.MicrophoneMAC.platformName,
    trigger: 'change'
  }],
  ip: [{
    // required: false,
    validator: validator.MicrophoneMAC.Ip,
    trigger: 'change'
  }],
  uniqueId: [{
    // required: true,
    validator: validator.MicrophoneMAC.uniqueId,
    trigger: 'change'
  }],
  updatedBy: [{
    // required: true,
    validator: validator.MicrophoneMAC.updatedBy,
    trigger: 'change'
  }],
  updatedDept: [{
    // required: true,
    validator: validator.MicrophoneMAC.updatedDept,
    trigger: 'change'
  }],  
}
let audioLogRules = {
  sponsor: [{
    validator: validator.audioLog.sponsor,
    trigger: 'change'
  }],
  participant: [{
    validator: validator.audioLog.participant,
    trigger: 'change'
  }],
  name: [{
    validator: validator.audioLog.sponsor,
    trigger: 'change'
  }],
  userName: [{
    validator: validator.audioLog.sponsor,
    trigger: 'change'
  }],
  ip: [{
    // required: false,
    validator: validator.MicrophoneMAC.Ip,
    trigger: 'change'
  }],
  moduleType: [{
    validator: validator.audioLog.userName,
    trigger: 'change'
  }],
  operateName: [{
    validator: validator.audioLog.userName,
    trigger: 'change'
  }],
}

export default {
  intercomPlatformRules,
  intercomPlatformSearch,
  IntercomChannelSearch,
  MicrophoneMAC,
  audioLogRules,
  mikeRules,
  hostRules,
}
