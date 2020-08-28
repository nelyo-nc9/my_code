// 报警设备子类 此配置要和

const ALARMDEVICETYPE = {
  电话报警主机: 1,
  网络报警主机: 2,
  电子围栏总线报警主机: 3,
  震动光纤报警主机: 4,
  壁挂双鉴探测器: 5,
  吸顶双鉴探测器: 6,
  ATM震动探测器: 7,
  金库震动探测器: 8,
  门磁探测器: 9,
  玻璃破碎探测器: 10,
  光电感烟探测器: 11,
  '红外幕帘探测器(入侵)': 12,
  温度探测器: 13,
  漏水探测器: 14,
  '紧急按钮（有声）': 15,
  '紧急按钮（无声）': 16,
  红外对射探测器: 17,
  位移探测器: 18,
  振动光纤: 19,
  电子围栏: 20
}
const ALARMDEVICETYPEREVIERSE = {
  1: '电话报警主机',
  2: '网络报警主机',
  3: '电子围栏总线报警主机',
  4: '震动光纤报警主机',
  5: '壁挂双鉴探测器',
  6: '吸顶双鉴探测器',
  7: 'ATM震动探测器',
  8: '金库震动探测器',
  9: '门磁探测器',
  10: '玻璃破碎探测器',
  11: '光电感烟探测器',
  12: '红外幕帘探测器(入侵)',
  13: '温度探测器',
  14: '漏水探测器',
  15: '紧急按钮（有声）',
  16: '紧急按钮（无声）',
  17: '红外对射探测器',
  18: '位移探测器',
  19: '振动光纤',
  20: '电子围栏'
}

//参数是数组
// 根据数据类型，把汉字转换为数字
export const dataToMyData = (dataP, typeP) => {
  let arrResult = []
  if (dataP == undefined) {
    return arrResult
  }
  for (const iterator of dataP) {
    //type是所有点位返回的
    if (iterator.type === typeP) {
      iterator.subType = ALARMDEVICETYPE[iterator.subType]
      iterator.pointSubType = ALARMDEVICETYPE[iterator.pointSubType]
    }
    arrResult.push(iterator)
  }
  return arrResult
}
//参数是对象
//设备树
export const dataToMyDataObject_pointSubType = (dataP, typeP) => {
  //pointType树节点返回的
  if (dataP.pointType === typeP) {
    // iterator.subType = ALARMDEVICETYPE[iterator.subType]
    if (CheckChinese(dataP.pointSubType)) {
      if (dataP.pointSubType != undefined) {
        dataP.pointSubType = ALARMDEVICETYPE[dataP.pointSubType]
      } else {
        // dataP.pointSubType = ALARMDEVICETYPE[dataP.deviceType]
      }
    }
  }

  return dataP
}
//参数是对象
//地图上的点
export const dataToMyDataObject_subType = (dataP, typeP) => {
  //pointType树节点返回的
  if (dataP.type === typeP) {
    // iterator.subType = ALARMDEVICETYPE[iterator.subType]
    if (CheckChinese(dataP.subType)) {
      if (dataP.subType != undefined) {
        dataP.subType = ALARMDEVICETYPE[dataP.subType]
      } else {
        dataP.subType = ALARMDEVICETYPE[dataP.deviceType]
      }
    }
  }

  return dataP
}
export const dataToMyDataObject_subTypeReverse = (dataP, typeP) => {
  //pointType树节点返回的
  if (dataP.type === typeP) {
    // iterator.subType = ALARMDEVICETYPE[iterator.subType]
    // if (CheckChinese(dataP.subType)) {
    if (dataP.subType != undefined) {
      dataP.subType = ALARMDEVICETYPEREVIERSE[String(dataP.subType)]
    } else {
      dataP.subType = dataP.deviceType
    }
    // }
  }

  return dataP
}
//判断是不是中文
function CheckChinese(val) {
  var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
  if (reg.test(val)) {
    return true
  }
}
