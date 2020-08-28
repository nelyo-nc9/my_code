/**
 * 门禁管理相关的校验规则
 */
// 门禁管理的字段正则校验
let name = /(^.{1,64}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let ip = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
let userName = /^.{1,128}$/
let passWord = /^.{1,128}$/
let uniqueId = /^[0-9]*$/
let port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
let updatedBy = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let updatedDept = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let channelname = /(^.{1,128}$)|(^[\u4e00-\u9fa5]{0,32}$)/
let card = /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/
// 校验函数
let validator = {
    // 门禁查询
    accessdevicesSearch: {
      Name: (rule, value, callback) => {
        if (value==""){
          callback()
        }else{
          if (!name.test(value)) {
            callback(new Error('名称格式不规范 请输入长度0-128的字符'))
          } else {
            callback()
          }
        }
      },
      orgName: (rule, value, callback) => {
        if (value==""){
          callback()
        }else{
          if (!name.test(value)) {
            callback(new Error('所属机构名称格式不规范 请输入长度0-128的字符'))
          } else {
            callback()
          }
        }
      },
      keyPartName: (rule, value, callback) => {
        if (value==""){
          callback()
        }else{
          if (!name.test(value)) {
            callback(new Error('所属重点部位格式不规范 请输入长度0-128的字符'))
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
            callback(new Error('所属对讲平台格式不规范'))
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
            callback(new Error('对讲通道名称输入格式不规范'))
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
      uniqueId: (rule, value, callback) => {
        if (value==""){
          callback()
        }else{
          if (!uniqueId.test(value)) {
            callback(new Error('ID格式不规范 只能为数字'))
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
      hostName: (rule, value, callback) => {
        if (value==""){
          callback()
        }else{
          if (!name.test(value)) {
            callback(new Error('所属门禁主机输入格式不规范 长度0-32个字符'))
          } else {
            callback()
          }
        }
      },
    },
    accessLog: {
        Name: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('名称格式不规范 请输入长度0-128的字符'))
              } else {
                callback()
              }
            }
          },
          orgName: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('所属重点部位名称格式不规范 请输入长度0-128的字符'))
              } else {
                callback()
              }
            }
          },
          keyPartName: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('所属重点部位名称格式不规范 请输入长度0-128的字符'))
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
          uniqueId: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!uniqueId.test(value)) {
                callback(new Error('ID格式不规范 只能为数字'))
              } else {
                callback()
              }
            }
          },
          opinion: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('职务输入格式不规范'))
              } else {
                callback()
              }
            }
          },
          dealType: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('部门输入格式不规范'))
              } else {
                callback()
              }
            }
          },
          card: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!card.test(value)) {
                callback(new Error('身份证输入格式不规范'))
              } else {
                callback()
              }
            }
          },
          nums: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!uniqueId.test(value)) {
                callback(new Error('卡号输入格式不规范 只能为数字'))
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
          guardHostId: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('所属门禁平台输入格式不规范 长度0-32个字符'))
              } else {
                callback()
              }
            }
          },
          HostNmae: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('所属门禁平台输入格式不规范 长度0-32个字符'))
              } else {
                callback()
              }
            }
          },
          hostName: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('所属门禁主机输入格式不规范 长度0-32个字符'))
              } else {
                callback()
              }
            }
          },
          operatingObj: (rule, value, callback) => {
            if (value==""){
              callback()
            }else{
              if (!name.test(value)) {
                callback(new Error('操作输入格式不规范 长度0-32个字符'))
              } else {
                callback()
              }
            }
          },
    }
}
// 门禁主机查询的校验规则
let accessdevicesSearch = {
    name: [{
      validator: validator.accessdevicesSearch.Name,
      trigger: 'change'
    }],
    orgName: [{
      validator: validator.accessdevicesSearch.orgName,
      trigger: 'change'
    }],
    keyPartName: [{
      validator: validator.accessdevicesSearch.keyPartName,
      trigger: 'change'
    }],
    updatedDept: [{
      validator: validator.accessdevicesSearch.updatedDept,
      trigger: 'change'
    }],
    updatedBy: [{
      validator: validator.accessdevicesSearch.updatedBy,
      trigger: 'change'
    }],
    uniqueId: [{
      validator: validator.accessdevicesSearch.uniqueId,
      trigger: 'change'
    }],
    hostName: [{
      validator: validator.accessdevicesSearch.hostName,
      trigger: 'change'
    }],
}
let accessLog = {
    username: [{
        validator: validator.accessLog.Name,
        trigger: 'change'
      }],
      ip: [{
        validator: validator.accessLog.ip,
        trigger: 'change'
      }],
      user: [{
        validator: validator.accessLog.Name,
        trigger: 'change'
      }],
      orgName: [{
        validator: validator.accessLog.orgName,
        trigger: 'change'
      }],
      keyPartName: [{
        validator: validator.accessLog.keyPartName,
        trigger: 'change'
      }],
      operatingObj: [{
        validator: validator.accessLog.operatingObj,
        trigger: 'change'
      }],
      operatingInfo: [{
        validator: validator.accessLog.operatingObj,
        trigger: 'change'
      }],
      updatedDept: [{
        validator: validator.accessLog.updatedDept,
        trigger: 'change'
      }],
      updatedBy: [{
        validator: validator.accessLog.updatedBy,
        trigger: 'change'
      }],
      uniqueId: [{
        validator: validator.accessLog.uniqueId,
        trigger: 'change'
      }],
      hostName: [{
        validator: validator.accessLog.hostName,
        trigger: 'change'
      }],
      card: [{
        validator: validator.accessLog.card,
        trigger: 'change'
      }],
      dealType: [{
        validator: validator.accessLog.dealType,
        trigger: 'change'
      }],
      opinion: [{
        validator: validator.accessLog.opinion,
        trigger: 'change'
      }],
      nums: [{
        validator: validator.accessLog.nums,
        trigger: 'change'
      }],
      guardHostId: [{
        validator: validator.accessLog.guardHostId,
        trigger: 'change'
      }],
      name: [{
        validator: validator.accessLog.Name,
        trigger: 'change'
      }],
}


export default {
    accessdevicesSearch,
    accessLog
  }
