/**
 * 停车管理相关的校验规则
 */
// 停车管理字段正则校验
// 输入框长度
let nameReg = /^.{0,128}$/
// 端口号
let portReg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
// IP
let ipReg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
// 密码
let passWordReg = /^.{0,64}$/
// 车牌号
let licensePlateReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/

let validator = {
  // 停车管理
  parkingManage: {
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
    // 停车平台名称
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
    // 所属机构
    validateorgId: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
    },
    // 端口号
    validatePort: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
      if (!portReg.test(value)) {
        callback(new Error('端口，范围是0-65535'))
      } else {
        callback()
      }
    },
    // 所属重点部位
    validatekeyPartId: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
    },
    // 接入服务器
    validateaccessService: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择接入服务器'))
      }
    },
    // ip地址
    validateip: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
      if (!ipReg.test(value)) {
        return callback(new Error('ip地址格式不正确'))
      } else {
        callback()
      }
    },
    // 密码
    validatepassWord: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!passWordReg.test(value)) {
          callback(new Error('密码为0-64个字符'))
        } else {
          callback()
        }
      }
    },
    // 车牌号码
    validateLicensePlate: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!licensePlateReg.test(value)) {
          callback(new Error('车牌号码格式不正确'))
        } else {
          callback()
        }
      }
    },
    // 车场
    validateparking: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
      if (!nameReg.test(value)) {
        callback(new Error('车场为0-128个字符'))
      } else {
        callback()
      }
    },
    // 型号
    validateModelNum: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
      if (!nameReg.test(value)) {
        callback(new Error('型号为0-128个字符'))
      } else {
        callback()
      }
    },
    // 设备ID
    validateId: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写必填项'))
      }
      if (!nameReg.test(value)) {
        callback(new Error('设备Id为0-128个字符'))
      } else {
        callback()
      }
    }
  }
}

// 停车平台校验规则
let parkingManageRules = {
  orgId: [{
    required: true,
    message: '请填写必填项',
    rigger: 'change'
  }],
  name: [{
    required: true,
    message: '请填写必填项',
    rigger: 'change'
  }],
  port: [{
    required: true,
    validator: validator.parkingManage.validatePort,
    rigger: 'blur'
  }],
  brand: [{
    required: true,
    message: '请选择品牌',
    trigger: 'change'
  }],
  username: [{
    // required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  assetCode: [{
    // required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  remark: [{
    // required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  keyPartId: [{
    required: true,
    validator: validator.parkingManage.validatekeyPartId,
    rigger: 'blur'
  }],
  uniqueId: [{
    // required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  version: [{
    // required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  accessService: [{
    required: true,
    validator: validator.parkingManage.validateaccessService,
    rigger: 'blur'
  }],
  ip: [{
    required: true,
    validator: validator.parkingManage.validateip,
    rigger: 'blur'
  }],
  password: [{
    // required: false,
    validator: validator.parkingManage.validatepassWord,
    rigger: 'blur'
  }]
}

// 停车主机创建校验规则
let detectorRules = {
  ip: [{
    required: true,
    validator: validator.parkingManage.validateip,
    rigger: 'blur'
  }],
  parking: [{
    required: true,
    validator: validator.parkingManage.validateparking,
    rigger: 'blur'
  }],
  name: [{
    required: true,
    validator: validator.parkingManage.validateName,
    rigger: 'change'
  }],
  modelNum: [{
    required: true,
    validator: validator.parkingManage.validateModelNum,
    rigger: 'change'
  }],
  id: [{
    required: true,
    validator: validator.parkingManage.validateId,
    rigger: 'change'
  }],
  port: [{
    required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  assetCode: [{
    required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }]
}

// 停车主机编辑校验规则
let editRules = {
  orgId: [{
    required: true,
    validator: validator.parkingManage.validatecontent,
    rigger: 'blur'
  }],
  parking: [{
    required: true,
    validator: validator.parkingManage.validatecontent,
    rigger: 'blur'
  }],
  brand: [{
    required: true,
    validator: validator.parkingManage.validatecontent,
    rigger: 'blur'
  }],
  aisleNum1: [{
    required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  aisleNum2: [{
    required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  keyPartName: [{
    required: true,
    validator: validator.parkingManage.validatecontent,
    rigger: 'blur'
  }],
  name: [{
    required: true,
    validator: validator.parkingManage.validateName,
    rigger: 'change'
  }],
  ip: [{
    required: true,
    validator: validator.parkingManage.validateip,
    rigger: 'blur'
  }],
  assetCode: [{
    required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  wayNum1: [{
    required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }]
}

// 车辆配置校验规则
let carConfigRules = {
  licensePlate: [{
    required: false,
    validator: validator.parkingManage.validateLicensePlate,
    rigger: 'change'
  }],
  carModel: [{
    required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  remark: [{
    required: false,
    validator: validator.parkingManage.validatelength,
    rigger: 'blur'
  }],
  status: [{
    required: true,
    message: '请选择状态',
    trigger: 'change'
  }]
}
export default {
  parkingManageRules,
  detectorRules,
  editRules,
  carConfigRules
}
