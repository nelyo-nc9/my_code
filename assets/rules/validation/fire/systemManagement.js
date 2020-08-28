/**
 * 停车管理相关的校验规则
 */
// 设备信息管理字段正则校验

// 输入框长度
let nameReg = /^.{0,128}$/
// IP
let ipReg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
// 端口号
let portReg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

let validator = {
  systemManagement: {
    // 输入框长度
    validatelength: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!nameReg.test(value)) {
          callback(new Error('输入框长度为0-128个字符'))
        } else {
          callback()
        }
      }
    },
    // 输入框有无内容
    validatecontent: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
    },
    // 必填项且是输入框
    validateName: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
      if (!nameReg.test(value)) {
        callback(new Error('名称为0-128个字符'))
      } else {
        callback()
      }
    },
    // ip地址
    validateip: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!ipReg.test(value)) {
          return callback(new Error('ip地址格式不正确'))
        } else {
          callback()
        }
      }
    },
    // 端口号
    validatePort: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!portReg.test(value)) {
          callback(new Error('端口，范围是0-65535'))
        } else {
          callback()
        }
      }
    }
  }
}

let CombustibleGasAlarmRules = {
  orgName: [{
    required: true,
    message: '请填写必填项'
  }],
  keyPartName: [{
    required: true,
    message: '请填写必填项'
  }],
  name: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  labelCode: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  validity: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  address: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  assetCode: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  production: [{
    required: true,
    message: '请填写日期',
    rigger: 'blur'
  }],
  inputDeviceType: [{
    required: true,
    message: '请选择传输设备分类',
    rigger: 'blur'
  }],
  inputDeviceName: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  inputDeviceBrand: [{
    required: true,
    message: '请选择传输设备品牌',
    rigger: 'blur'
  }],
  inputDeviceModel: [{
    required: true,
    message: '请选择传输设备型号',
    rigger: 'blur'
  }],
  inputCommunicationType: [{
    required: true,
    message: '请选择传输通讯类型',
    rigger: 'blur'
  }],
  inputDeviceImei: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  inputDeviceAddress: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  inputDeviceIp: [{
    required: false,
    validator: validator.systemManagement.validateip,
    rigger: 'blur'
  }],
  inputDevicePort: [{
    required: false,
    validator: validator.systemManagement.validatePort,
    rigger: 'blur'
  }],
  inputDeviceAssetsCode: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  inputDeviceValidity: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  inputDeviceCode: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }]
}
let relevanceListRules = {
  partsType: [{
    required: true,
    message: '请选择部件类型',
    rigger: 'blur'
  }],
  name: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  brand: [{
    required: true,
    message: '请选择部件品牌',
    rigger: 'blur'
  }],
  partsModel: [{
    required: true,
    message: '请选择部件型号',
    rigger: 'blur'
  }],
  areaCode: [{
    required: true,
    message: '请填写必填项',
    rigger: 'blur'
  }],
  loopCode: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  addressCode: [{
    required: true,
    validator: validator.systemManagement.validateName,
    rigger: 'blur'
  }],
  deviceType: [{
    required: true,
    message: '设备分类不能为空'
  }],
  deviceName: [{
    required: true,
    message: '设备名称不能为空'
  }],
  deviceBrand: [{
    required: true,
    message: '设备品牌不能为空'
  }],
  modelNum: [{
    required: true,
    message: '设备型号不能为空'
  }],
  communicationType: [{
    required: true,
    message: '通讯类型不能为空'
  }],
  deviceAddress: [{
    required: true,
    message: '设备位置不能为空'
  }]
}
let assessmentRankingRules = {
  orgName: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  name: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  labelCode: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  address: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  assetCode: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  inputDeviceName: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  inputDeviceImei: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  inputDeviceIp: [{
    required: false,
    validator: validator.systemManagement.validateip,
    rigger: 'blur'
  }],
  inputDevicePort: [{
    required: false,
    validator: validator.systemManagement.validatePort,
    rigger: 'blur'
  }],
  inputDeviceLabel: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  inputDeviceValidity: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  inputDeviceAddress: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  inputDeviceAssetsCode: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }],
  subsystemNo: [{
    required: false,
    validator: validator.systemManagement.validatelength,
    rigger: 'blur'
  }]
}
export default {
  CombustibleGasAlarmRules,
  relevanceListRules,
  assessmentRankingRules
}
