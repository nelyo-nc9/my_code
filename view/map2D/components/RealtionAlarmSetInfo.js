import { DEVICETYPE, ALARMDEVICETYPE } from 'assets/2DMap/meta/common'
const { default: point } = require('../../../store/modules/map2D/point')

function getShowInfo(type, subType, obj) {
  const setObj = {
    3: {
      // 摄像机
      attributeArr: [
        { name_cn: '设备名称', attribute: 'name' },
        // { name_cn: '品牌', attribute: 'brand' },
        // { name_cn: '型号', attribute: 'modelNum' },
        { name_cn: '设备类型', attribute: 'class', attribute_dict: {1: '枪机', 2: '半球', 3: '球机', 4: '针孔', 5: '红外枪机', 6: '智能IPC', 7: '全景'} },
        // { name_cn: '所属子系统', attribute: 'subSystem' },
        // { name_cn: '所属设备', attribute: 'deviceName' },
        { name_cn: '所属机构', attribute: 'orgName' },
        { name_cn: '所属部位', attribute: 'keypartName' }
        // { name_cn: '状态', attribute: 'status', attribute_dict: { 1: '离线', 2: '在线' } }
      ]
    }// 'camera', // 摄像机

  }

  let selectObj = setObj[type] || setObj[getSelectSpecialObj(type, subType)]
  return getShowEndResult(selectObj.attributeArr, obj, subType)
}

function getSelectSpecialObj(type, subType) {
  // debugger
  subType = Number(subType)
  console.log(type, subType)
  let endType = 3
  return endType
}

function getShowEndResult(arr, obj, subType) {
  let endArr = []
  if (!obj) {
    arr.forEach(element => {
      let endObj = {
        name: element.name_cn,
        value: ''
      }
      endArr.push(endObj)
    })
    return
  }

  arr.forEach(element => {
    let endObj = {
      name: element.name_cn,
      value: obj[element.attribute] ? obj[element.attribute] : ''
    }
    if (element.subType_dict) {
      endObj.name = element.subType_dict[subType]
    }
    if (element.attribute_dict) {
      endObj.value = element.attribute_dict[obj[element.attribute]]
    }
    endObj.name = endObj.name ? endObj.name : ''
    endObj.value = endObj.value ? endObj.value : ''
    endArr.push(endObj)
  })
  return endArr
}

export function getRealtionAlarmInfo(point_obj) {
  let { type, subType } = point_obj.point
  subType = Number(subType)
  return {
    showInfo: getShowInfo(type, subType, point_obj) // 信息列表
  }
}
