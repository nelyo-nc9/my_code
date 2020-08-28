/**
 * 设备信息管理相关的校验规则
 */
// let nameReg = /^[\u4e00-\u9fa5]{1,5}$/
let nameReg = /^.{0,128}$/
let timeReg = /^((\\d{2}(([02468][048])|([13579][26]))\\-((((0?[13578])|(1[02]))\\-((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))\\-((0?[1-9])|([1-2][0-9])|(30)))|(0?2\\-((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))\\-((((0?[13578])|(1[02]))\\-((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))\\-((0?[1-9])|([1-2][0-9])|(30)))|(0?2\\-((0?[1-9])|(1[0-9])|(2[0-8]))))))(\\s((([0-1][0-9])|(2?[0-3]))\\:([0-5]?[0-9])((\\s)|(\\:([0-5]?[0-9])))))$/
let ipReg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/

let validator = {
  // 设备信息管理
  equipmentInformationManagement: {
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

    // 日期时间格式
    validateTime: (rule, value, callback) => {
      if (!timeReg.test(value)) {
        callback(new Error('日期时间格式不正确'))
      } else {
        callback()
      }
    },

    // 日期格式
    validateDate: (rule, value, callback) => {
      if (!timeReg.test(value)) {
        callback(new Error('日期时间格式不正确'))
      } else {
        callback()
      }
    },
    // ip地址
    validateip: (rule, value, callback) => {
      if (!ipReg.test(value)) {
        return callback(new Error('ip地址格式不正确'))
      } else {
        callback()
      }
    }
  }
}

let queryComponentRules = {
  orgName: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  name: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  labelCode: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  code: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  address: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  assetCode: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  deviceModel: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }]
}
let fireLinkQueryRules = {
  orgName: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  hostId: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  name: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  areaCode: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  loopCode: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  addressCode: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  address: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  description: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  assetsCode: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  code: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  deviceModel: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }]
}

let fireFightingSubsystemManagementRules = {
  orgName: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  deviceName: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  alarmLocation: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  alarmTypeName: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  eventTypeName: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  dealOpinion: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  receivePerson: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }]
}

let fireFightingListRules = {
  name: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  userName: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  orgName: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  ip: [{
    required: false,
    validator: validator.equipmentInformationManagement.validateip,
    rigger: 'blur'
  }],
  object: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  description: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }],
  action: [{
    required: false,
    validator: validator.equipmentInformationManagement.validatelength,
    rigger: 'blur'
  }]
}
export default {
  queryComponentRules,
  fireLinkQueryRules,
  fireFightingSubsystemManagementRules,
  fireFightingListRules
}
