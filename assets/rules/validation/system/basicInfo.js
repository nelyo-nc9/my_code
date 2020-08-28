/**
 * 基础信息管理相关的校验规则
 */
// 基础信息管理的字段正则校验
let name = /(^.{1,64}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let ip = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
let uniqueId = /^[0-9]*$/
let updatedBy = /^[\u4e00-\u9fa5]{0,32}$/
let updatedDept = /^[\u4e00-\u9fa5]{0,32}$/
let card = /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/
let mobile = /^1[3456789]\d{9}$/
let address = /^[\u4e00-\u9fa5]{0,32}$/
let cname = /^[\u4e00-\u9fa5]{0,32}$/
let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
let telephone = /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/
let principa = /^[\u4e00-\u9fa5]{0,32}$/
let principalPhone = /^1[3456789]\d{9}$/
let serial = /^[0-9]*$/
// 校验函数
let validator = {
  // 新建机构
  basicInfoRules: {
    serial: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入机构编号'))
      }
      if (!serial.test(value)) {
        callback(new Error('机构编码输入有误 只能为数字'))
      } else {
        callback()
      }
    },
    mobile: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!mobile.test(value)) {
          callback(new Error('手机号输入有误'))
        } else {
          callback()
        }
      }
    },
    address: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!address.test(value)) {
          callback(new Error('机构地址输入有误 0-64字符 只能中文'))
        } else {
          callback()
        }
      }
    },
    functionary: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入机构负责人名称'))
      }
      if (!name.test(value)) {
        callback(new Error('机构负责人名称输入有误 0-64字符'))
      } else {
        callback()
      }
    },
    name: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入机构中文简称'))
      }
      if (!name.test(value)) {
        callback(new Error('机构中文简称输入有误 0-64字符'))
      } else {
        callback()
      }
    },
    telephone: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!telephone.test(value)) {
          callback(new Error('固定电话格式输入有误'))
        } else {
          callback()
        }
      }
    },
    email: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!email.test(value)) {
          callback(new Error('邮箱格式输入有误'))
        } else {
          callback()
        }
      }
    },
  },
  basicInfoSserchRules: {
    serial: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!serial.test(value)) {
          callback(new Error('机构编号输入有误 只能为数字'))
        } else {
          callback()
        }
      }
    },
    mobile: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!mobile.test(value)) {
          callback(new Error('手机号输入有误'))
        } else {
          callback()
        }
      }
    },
    address: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!address.test(value)) {
          callback(new Error('机构地址输入有误 0-64字符'))
        } else {
          callback()
        }
      }
    },
    functionary: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!name.test(value)) {
          callback(new Error('机构负责人名称输入有误 0-64字符'))
        } else {
          callback()
        }
      }
    },
    name: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!name.test(value)) {
          callback(new Error('机构中文简称输入有误 0-64字符'))
        } else {
          callback()
        }
      }
    },
    telephone: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!telephone.test(value)) {
          callback(new Error('固定电话格式输入有误'))
        } else {
          callback()
        }
      }
    },
    email: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!email.test(value)) {
          callback(new Error('邮箱格式输入有误'))
        } else {
          callback()
        }
      }
    },
    parentName: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!name.test(value)) {
          callback(new Error('上级机构负责人名称输入有误 0-64字符'))
        } else {
          callback()
        }
      }
    },
    parentSerial: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!name.test(value)) {
          callback(new Error('上级机构编码输入有误 0-64字符'))
        } else {
          callback()
        }
      }
    },
  },
  keyPartRules: {
    name: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      if (!name.test(value)) {
        callback(new Error('名称输入有误 长度在 1 到 128 个字符'))
      } else {
        callback()
      }
    },
    address: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('地址不能为空'))
      }
      if (!name.test(value)) {
        callback(new Error('地址输入有误 长度在 1 到 128 个字符'))
      } else {
        callback()
      }
    },
    oidName: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('所属机构不能为空'))
      }
      if (!name.test(value)) {
        callback(new Error('所属机构输入有误 长度在 1 到 128 个字符'))
      } else {
        callback()
      }
    },
    telephone: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('营业网点电话不能为空'))
      }
      if (!telephone.test(value)) {
        callback(new Error('电话输入有误'))
      } else {
        callback()
      }
    },
    serial: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('部位代码不能为空'))
      }
      if (!serial.test(value)) {
        callback(new Error('部位代码输入有误 仅限数字'))
      } else {
        callback()
      }
    },
    principal: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!principa.test(value)) {
          callback(new Error('输入有误 长度在 1 到 128 个字符'))
        } else {
          callback()
        }
      }
    },
    principalPhone: (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!principalPhone.test(value)) {
          callback(new Error('输入有误'))
        } else {
          callback()
        }
      }
    },
  },
  keyPartSearchRules: {
    name: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!name.test(value)) {
          callback(new Error('名称输入有误 长度在 1 到 128 个字符'))
        } else {
          callback()
        }
      }
    },
    address: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!name.test(value)) {
          callback(new Error('地址输入有误 长度在 1 到 128 个字符'))
        } else {
          callback()
        }
      }
    },
    oidName: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!name.test(value)) {
          callback(new Error('所属机构输入有误 长度在 1 到 128 个字符'))
        } else {
          callback()
        }
      }
    },
    telephone: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!telephone.test(value)) {
          callback(new Error('电话输入有误 长度在 1 到 128 个字符'))
        } else {
          callback()
        }
      }
    },
    serial: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!serial.test(value)) {
          callback(new Error('部位代码输入有误 长度在1-6位数字'))
        } else {
          callback()
        }
      }
    },
    principal: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!principa.test(value)) {
          callback(new Error('输入有误 长度在 1 到 128 个字符间'))
        } else {
          callback()
        }
      }
    },
    principalPhone: (rule, value, callback) => {
      if (value == "") {
        callback()
      } else {
        if (!principalPhone.test(value)) {
          callback(new Error('输入有误'))
        } else {
          callback()
        }
      }
    },
  }
}
// 门禁主机查询的校验规则
let basicInfoRules = {
  serial: [{
    required: true,
    validator: validator.basicInfoRules.serial,
    trigger: 'change'
  }],
  mobile: [{
    validator: validator.basicInfoRules.mobile,
    trigger: 'change'
  }],
  address: [{
    validator: validator.basicInfoRules.address,
    trigger: 'change'
  }],
  functionary: [{
    required: true,
    validator: validator.basicInfoRules.functionary,
    trigger: 'change'
  }],
  name: [{
    required: true,
    validator: validator.basicInfoRules.name,
    trigger: 'change'
  }],
  telephone: [{
    validator: validator.basicInfoRules.telephone,
    trigger: 'change'
  }],
  email: [{
    validator: validator.basicInfoRules.email,
    trigger: 'change'
  }],
  parentName: [{
    required: true,
    message: '上级机构名称不能为空'
  }],
  parentSerial: [{
    required: true,
    message: '上级机构编码不能为空'
  }],

}
let basicInfoSearchRules = {
  serial: [{
    validator: validator.basicInfoSserchRules.serial,
    trigger: 'change'
  }],
  mobile: [{
    validator: validator.basicInfoSserchRules.mobile,
    trigger: 'change'
  }],
  address: [{
    validator: validator.basicInfoSserchRules.address,
    trigger: 'change'
  }],
  functionary: [{
    validator: validator.basicInfoSserchRules.functionary,
    trigger: 'change'
  }],
  name: [{
    validator: validator.basicInfoSserchRules.name,
    trigger: 'change'
  }],
  telephone: [{
    validator: validator.basicInfoSserchRules.telephone,
    trigger: 'change'
  }],
  email: [{
    validator: validator.basicInfoSserchRules.email,
    trigger: 'change'
  }],
  parentName: [{
    validator: validator.basicInfoSserchRules.parentName,
    trigger: 'change'
  }],
  parentSerial: [{
    validator: validator.basicInfoSserchRules.parentSerial,
    trigger: 'change'
  }],
}
let keyPartRules = {
  name: [{
    required: true,
    validator: validator.keyPartRules.name,
    trigger: 'blur'
  }],
  address: [{
    required: true,
    validator: validator.keyPartRules.address,
    trigger: 'blur'
  }],
  oidName: [{
    required: true,
    validator: validator.keyPartRules.oidName,
    trigger: 'blur'
  }],
  telephone: [{
    required: true,
    validator: validator.keyPartRules.telephone,
    trigger: 'change'
  }],
  serial: [{
    required: true,
    validator: validator.keyPartRules.serial,
    trigger: 'change'
  }],
  principal1: [{
    validator: validator.keyPartRules.principal,
    trigger: 'change'
  }],
  principalPhone1: [{
    validator: validator.keyPartRules.principalPhone,
    trigger: 'change'
  }],
  principal2: [{
    validator: validator.keyPartRules.principal,
    trigger: 'change'
  }],
  principalPhone2: [{
    validator: validator.keyPartRules.principalPhone,
    trigger: 'change'
  }],
  principal3: [{
    validator: validator.keyPartRules.principal,
    trigger: 'change'
  }],
  principalPhone3: [{
    validator: validator.keyPartRules.principalPhone,
    trigger: 'change'
  }],
  principal4: [{
    validator: validator.keyPartRules.principal,
    trigger: 'change'
  }],
  principalPhone4: [{
    validator: validator.keyPartRules.principalPhone,
    trigger: 'change'
  }],
  principal5: [{
    validator: validator.keyPartRules.principal,
    trigger: 'change'
  }],
  principalPhone5: [{
    validator: validator.keyPartRules.principalPhone,
    trigger: 'change'
  }],
  policeStation: [{
    validator: validator.keyPartRules.principal,
    trigger: 'change'
  }],
  policeTelephone: [{
    validator: validator.keyPartRules.principalPhone,
    trigger: 'change'
  }],
  police: [{
    validator: validator.keyPartRules.principal,
    trigger: 'change'
  }],
  policeMobilePhone: [{
    validator: validator.keyPartRules.principalPhone,
    trigger: 'change'
  }],
  remark: [{
    validator: validator.keyPartRules.principal,
    trigger: 'change'
  }],
  statusName: [{
    required: true,
    message: '部位状态不能为空',
    trigger: ['blur', 'change']
  }],
}
let keyPartSearchRules = {
  name: [{
    validator: validator.keyPartSearchRules.name,
    trigger: 'blur'
  }],
  address: [{
    validator: validator.keyPartSearchRules.address,
    trigger: 'blur'
  }],
  oidName: [{
    validator: validator.keyPartSearchRules.oidName,
    trigger: 'blur'
  }],
  telephone: [{
    validator: validator.keyPartSearchRules.telephone,
    trigger: 'change'
  }],
  serial: [{
    validator: validator.keyPartSearchRules.serial,
    trigger: 'change'
  }],
  principal1: [{
    validator: validator.keyPartSearchRules.principa,
    trigger: 'change'
  }],
  principalPhone1: [{
    validator: validator.keyPartSearchRules.principalPhone,
    trigger: 'change'
  }],
  principal2: [{
    validator: validator.keyPartSearchRules.principal,
    trigger: 'change'
  }],
  principalPhone2: [{
    validator: validator.keyPartSearchRules.principalPhone,
    trigger: 'change'
  }],
  principal3: [{
    validator: validator.keyPartSearchRules.principal,
    trigger: 'change'
  }],
  principalPhone3: [{
    validator: validator.keyPartSearchRules.principalPhone,
    trigger: 'change'
  }],
  principal4: [{
    validator: validator.keyPartSearchRules.principal,
    trigger: 'change'
  }],
  principalPhone4: [{
    validator: validator.keyPartSearchRules.principalPhone,
    trigger: 'change'
  }],
  principal5: [{
    validator: validator.keyPartSearchRules.principal,
    trigger: 'change'
  }],
  principalPhone5: [{
    validator: validator.keyPartSearchRules.principalPhone,
    trigger: 'change'
  }],
  policeStation: [{
    validator: validator.keyPartSearchRules.principal,
    trigger: 'change'
  }],
  policeTelephone: [{
    validator: validator.keyPartSearchRules.principalPhone,
    trigger: 'change'
  }],
  police: [{
    validator: validator.keyPartSearchRules.principal,
    trigger: 'change'
  }],
  policeMobilePhone: [{
    validator: validator.keyPartSearchRules.principalPhone,
    trigger: 'change'
  }],
  remark: [{
    validator: validator.keyPartSearchRules.principal,
    trigger: 'change'
  }],
  statusName: [{
    required: true,
    message: '部位状态不能为空',
    trigger: ['blur', 'change']
  }],
}

export default {
  basicInfoRules,
  keyPartRules,
  keyPartSearchRules,
  basicInfoSearchRules
}
