import axios from 'axios'

// 设备
let BRANDS = [] // 品牌
let MODELS = {} // 设备型号
let DEVICETYPE = [] // 设备类型
let TRANSPORTPROTOCOLS = [] 
let PROTOCOL = [] // 接入协议
// 视频资源
let RESOURCETYPEVIDEO = [] // 资源类型
let RESOURCEBRANDSVIDEO = [] // 资源品牌
let RESOURCEMODELSVIDEO = {} // 资源型号
let TRANSPORTPROTOCOLSVIDEO = [] // 传输协议
let STREAMVIDEO = [] // 码流信息
// 音频资源
let RESOURCETYPEAUDIO = [] // 资源类型
let RESOURCEBRANDSAUDIO = [] // 资源品牌
let RESOURCEMODELSAUDIO = {} // 资源型号
// 报警输入资源
let RESOURCETYPEVINPUT = [] // 资源类型
let RESOURCEBRANDSINPUT = [] // 资源品牌
let RESOURCEMODELSINPUT = {} // 资源型号
// 报警输出资源
let RESOURCETYPEOUTPUT = [] // 资源类型
let RESOURCEBRANDSOUTPUT = [] // 资源品牌
let RESOURCEMODELSOUTPUT = {} // 资源型号

function clearn() {
  BRANDS = [] // 品牌
  MODELS = {} // 设备型号
  DEVICETYPE = [] // 设备类型
  TRANSPORTPROTOCOLS = [] 
  PROTOCOL = [] // 接入协议
  RESOURCETYPEVIDEO = [] // 资源类型
  RESOURCEBRANDSVIDEO = [] // 资源品牌
  RESOURCEMODELSVIDEO = {} // 资源型号
  TRANSPORTPROTOCOLSVIDEO = [] // 传输协议
  STREAMVIDEO = [] // 码流信息
  RESOURCETYPEVINPUT = [] // 资源类型
  RESOURCEBRANDSINPUT = [] // 资源品牌
  RESOURCEMODELSINPUT = {} // 资源型号
  RESOURCETYPEOUTPUT = [] // 资源类型
  RESOURCEBRANDSOUTPUT = [] // 资源品牌
  RESOURCEMODELSOUTPUT = {} // 资源型号
}
export const getDeviceSelectConf = () => {
  let url = 'systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo'
  let obj = {
    'queryList':[
      {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'1',
        'type':'1'
      }, {
        'moduleId':'1',
      'childModuleId':'2',
      'dictId':'2',
      'type':'1'
      }, {
        'moduleId':'1',
      'childModuleId':'2',
      'dictId':'3',
      'type':'1'
      }, {
        'moduleId':'1',
      'childModuleId':'2',
      'dictId':'4',
      'type':'1'
      }, {
        'moduleId':'1',
      'childModuleId':'2',
      'dictId':'5',
      'type':'1'
      }, {
      'moduleId':'1',
      'childModuleId':'2',
      'dictId':'6',
      'type':'2'
      }, {
      'moduleId':'1',
      'childModuleId':'2',
      'dictId':'7',
      'type':'2'
      }, {
      'moduleId':'1',
      'childModuleId':'2',
      'dictId':'8',
      'type':'2'
      }, {
      'moduleId':'1',
      'childModuleId':'2',
      'dictId':'9',
      'type':'2'
      }, {
      'moduleId':'1',
      'childModuleId':'2',
      'dictId':'10',
      'type':'2'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'18'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'19'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'20'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'21'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'22'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'23'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'24'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'25'
      }, {
        'moduleId':'1',
        'childModuleId':'2',
        'dictId':'26'
      }
    ]
  }
  axios.post(url, obj).then(res => {
    clearn()
    let data = res.data.data
    data.forEach(item => {
      if (item.dictId === '1') {
        item.attr.forEach(i => {
          DEVICETYPE.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      } else if (item.dictId === '2') {
        item.attr.forEach(i => {
          BRANDS.push({
            label: i.data,
            value: i.englishName ||i.data
          })
        }) 
      } else if (item.dictId === '3') {
        item.attr.forEach(i => {
          if(MODELS[i.homeClass]) {
            MODELS[i.homeClass].push({
              label: i.data,
              value: i.data,
              sdk:i.sdkName?i.sdkName:''
            })
          } else {
            MODELS[i.homeClass] = [{
              label: i.data,
              value: i.data,
              sdk:i.sdkName?i.sdkName:''
            }]
          }
        })
      } else if (item.dictId === '4') {
        item.attr.forEach(i => {
          PROTOCOL.push({
            label: i.data,
            value: i.data
          })
        })
      } else if (item.dictId === '5') {
        item.attr.forEach(i => {
          TRANSPORTPROTOCOLS.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      } else if (item.dictId === '6') {
        item.attr.forEach(i => {
          RESOURCETYPEVIDEO.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      } else if (item.dictId === '7') {
        item.attr.forEach(i => {
          RESOURCEBRANDSVIDEO.push({
            label: i.data,
            value: i.englishName || i.data
          })
        })
      } else if (item.dictId === '8') {
        item.attr.forEach(i => {
          if(RESOURCEMODELSVIDEO[i.homeClass]) {
            RESOURCEMODELSVIDEO[i.homeClass].push({
              label: i.data,
              value: i.data
            })
          } else {
            RESOURCEMODELSVIDEO[i.homeClass] = [{
              label: i.data,
              value: i.data
            }]
          }
        })
      } else if (item.dictId === '9') {
        item.attr.forEach(i => {
          TRANSPORTPROTOCOLSVIDEO.push({
            label: i.data,
            value: i.data
          })
        })
      } else if (item.dictId === '10') {
        item.attr.forEach(i => {
          STREAMVIDEO.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      } else if (item.dictId === '18') {
        item.attr.forEach(i => {
          RESOURCETYPEAUDIO.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      } else if (item.dictId === '19') {
        item.attr.forEach(i => {
          RESOURCEBRANDSAUDIO.push({
            label: i.data,
            value: i.englishName || i.data
          })
        })
      } else if (item.dictId === '20') {
        item.attr.forEach(i => {
          if(RESOURCEMODELSAUDIO[i.homeClass]) {
            RESOURCEMODELSAUDIO[i.homeClass].push({
              label: i.data,
              value: i.data
            })
          } else {
            RESOURCEMODELSAUDIO[i.homeClass] = [{
              label: i.data,
              value: i.data
            }]
          }
        })
      } else if (item.dictId === '21') {
        item.attr.forEach(i => {
          RESOURCETYPEVINPUT.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      } else if (item.dictId === '22') {
        console.log(item.attr)
        item.attr.forEach(i => {
          RESOURCEBRANDSINPUT.push({
            label: i.data,
            value: i.englishName || i.data
          })
        })
      } else if (item.dictId === '23') {
        item.attr.forEach(i => {
          if(RESOURCEMODELSINPUT[i.homeClass]) {
            RESOURCEMODELSINPUT[i.homeClass].push({
              label: i.data,
              value: i.data
            })
          } else {
            RESOURCEMODELSINPUT[i.homeClass] = [{
              label: i.data,
              value: i.data
            }]
          }
        })
      } else if (item.dictId === '24') {
        item.attr.forEach(i => {
          RESOURCETYPEOUTPUT.push({
            label: i.data,
            value: Number(i.key)
          })
        })
      } else if (item.dictId === '25') {
        item.attr.forEach(i => {
          RESOURCEBRANDSOUTPUT.push({
            label: i.data,
            value: i.englishName || i.data
          })
        })
      } else if (item.dictId === '26') {
        item.attr.forEach(i => {
          if(RESOURCEMODELSOUTPUT[i.homeClass]) {
            RESOURCEMODELSOUTPUT[i.homeClass].push({
              label: i.data,
              value: i.data
            })
          } else {
            RESOURCEMODELSOUTPUT[i.homeClass] = [{
              label: i.data,
              value: i.data
            }]
          }
        })
      }
    })
  }).catch(err => {
    console.log(err)
  })
}


// 设备异常
const DEVICEERROR = [
  {
    label: '全部',
    value: '全部'
  }, {
    label: '磁盘故障',
    value: '磁盘故障'
  }, {
    label: '网络断开',
    value: '网络断开'
  }, {
    label: '通道异常',
    value: '通道异常'
  }, {
    label: '温度异常',
    value: '温度异常'
  }, {
    label: '时间异常',
    value: '时间异常'
  }, {
    label: '非法网络访问',
    value: '非法网络访问'
  }, {
    label: 'IP地址冲突',
    value: 'IP地址冲突'
  }
]
// 移动侦测
const MOVESENSE = [
  {
    label: '全部',
    value: '全部'
  }, {
    label: '图像侦测',
    value: '图像侦测'
  }
]
// 视频诊断
const VIDEOSENSE = [
  {
    label: '全部',
    value: '全部'
  }, {
    label: '镜头移位',
    value: '镜头移位'
  }, {
    label: '视频遮挡',
    value: '视频遮挡'
  }, {
    label: '清晰度异常',
    value: '清晰度异常'
  }, {
    label: '亮度异常',
    value: '亮度异常'
  }, {
    label: '信号缺失',
    value: '信号缺失'
  }, {
    label: '画面冻结',
    value: '画面冻结'
  }, {
    label: '噪声检测',
    value: '噪声检测'
  }, {
    label: '偏色检测',
    value: '偏色检测'
  }
]

// 通道数量
const CHANNLECOUNT = channelSelect()

function channelSelect() {
  let arr = [{
    label: '请选择',
    value: 0
  }]
  for (let i = 1; i <= 128; i++) {
    arr.push({ label: `${i}`, value: i })
  }
  return arr
}

// 日志
// 操作日志类型
const OPTTYPE = [
  { label: '0', value: '全部' },
  { label: '1', value: '一键预览' },
  { label: '2', value: '视频预览' },
  { label: '3', value: '镜头收藏' },
  { label: '4', value: '录像查询' },
  { label: '5', value: '录像回放' },
  { label: '6', value: '录像下载' },
  { label: '7', value: '抓图' },
  { label: '8', value: '紧急录像' },
  { label: '9', value: '对讲' },
  { label: '10', value: '云台控制' },
  { label: '11', value: '图像调节' },
  { label: '12', value: '快速上墙' },
  { label: '13', value: '快速回放' },
  { label: '14', value: '检查记录' },
  { label: '15', value: '事件记录' },
  { label: '16', value: '视频复核' },
  { label: '17', value: '视频轮巡' },
  { label: '18', value: '轮巡策略' },
  { label: '19', value: '镜头顺序调整' },
  { label: '20', value: '录像剪切' },
  { label: '21', value: '同步回放' },
  { label: '22', value: '异步回放' },
  { label: '23', value: '分时段回放' },
  { label: '24', value: '倒放' },
  { label: '25', value: '快速播放' },
  { label: '26', value: '慢速播放' },
  { label: '27', value: '逐帧播放' },
  { label: '28', value: '录像上墙' },
  { label: '29', value: '录像标记' },
  { label: '30', value: '图片检索' },
  { label: '31', value: '视频主机配置' },
  { label: '32', value: '视频主机IO配置' },
  { label: '33', value: '视频主机关联配置' },
  { label: '34', value: '视频主机迁移' },
  { label: '35', value: '视频主机列表导出' },
  { label: '36', value: '视频设备导入' },
  { label: '37', value: '录像计划配置' },
  { label: '38', value: '录像计划查询' },
  { label: '39', value: '录像计划导出' },
  { label: '40', value: '存储服务器管理' },
  { label: '41', value: '存储服务器列表导出' },
  { label: '42', value: '日志查询' },
  { label: '43', value: '日志导出' },
  { label: '100', value: '其他' }
]
// 视频日志类型
const VIDEOTYPE = [
  { label: '0', value: '全部' },
  { label: '1', value: '预览请求' },
  { label: '2', value: '预览关闭' },
  { label: '3', value: '视频轮巡' },
  { label: '4', value: '轮巡停止' },
  { label: '5', value: '查找录像' },
  { label: '6', value: '播放录像' },
  { label: '7', value: '停止播放' },
  { label: '8', value: '下载录像' },
  { label: '9', value: '手工抓图' },
  { label: '10', value: '手工录像' },
  { label: '11', value: '剪切录像' },
  { label: '12', value: '标记录像' },
  { label: '100', value: '其他' }
]

export {
  BRANDS,
  MODELS,
  DEVICETYPE,
  TRANSPORTPROTOCOLS,
  PROTOCOL,
  RESOURCETYPEVIDEO,
  RESOURCEBRANDSVIDEO,
  RESOURCEMODELSVIDEO,
  TRANSPORTPROTOCOLSVIDEO,
  STREAMVIDEO,
  RESOURCETYPEAUDIO,
  RESOURCEBRANDSAUDIO,
  RESOURCEMODELSAUDIO,
  RESOURCETYPEVINPUT,
  RESOURCEBRANDSINPUT,
  RESOURCEMODELSINPUT,
  RESOURCETYPEOUTPUT,
  RESOURCEBRANDSOUTPUT,
  RESOURCEMODELSOUTPUT,
  //
  DEVICEERROR,
  MOVESENSE,
  VIDEOSENSE,
  OPTTYPE,
  VIDEOTYPE,
  CHANNLECOUNT,
  ALARMINMODEL,
  ALARMINBRAND,
  ALARMOUTMODEL
}
