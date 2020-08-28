// 机构图层
import layerConfig from 'assets/2DMap/meta/layer'
import {
  KEYPARTTYPE,
  FEATURETYPE,
  KEYPARTTYPEORG,
  DEVICETYPE,
  TREENODETYPE,
  MPSIGNKEY,
  ACCESSDEVICETYPE,
  MAPTYPENUMBER
} from 'assets/2DMap/meta/common'
import keyPartsTrans_accessControl from 'assets/2DMap/feature/edit/accessControl'
import { mapState, mapActions } from 'vuex'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      // ------ 定义门禁相关图层------
      doorControlChannelLayer: layerConfig.doorControlChannelIcon, // 门禁通道
      doorControlLayer: layerConfig.doorControlIcon, // 门禁主机
      doubleDoorLayer: layerConfig.doubleDoorIcon, // 互锁门主机
      doubleDoorChannelLayer: layerConfig.doubleDoorChannelIcon // 互锁门通道
    }
  },
  computed: {
    ...mapState({
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      environmentalScienceInformation: ({ map2d }) => map2d.mapIndex.environmentalScienceInformation, // 最新的环境信息

      doorControlResource: ({ map2d }) => map2d.mapPoint.doorControlResourceArr, // 门禁主机 资源数组
      doorControlIcons: ({ map2d }) => map2d.mapPoint.doorControlIconFeatures, // 门禁主机 点位要素
      doorControlChannelResource: ({ map2d }) => map2d.mapPoint.doorControlChannelResourceArr, // 门禁通道 资源数组
      doorControlChannelIcons: ({ map2d }) => map2d.mapPoint.doorControlChannelIconFeatures, // 门禁通道 点位要素

      doubleDoorResource: ({ map2d }) => map2d.mapPoint.doubleDoorResourceArr, // 互锁门通道 资源数组
      doubleDoorIcons: ({ map2d }) => map2d.mapPoint.doubleDoorIconFeatures, // 互锁门通道 点位要素

      doubleDoorChannelResource: ({ map2d }) => map2d.mapPoint.doubleDoorChannelResourceArr, // 互锁门主机  资源数组
      doubleDoorChannelIcons: ({ map2d }) => map2d.mapPoint.doubleDoorChannelIconFeatures, // 互锁门主机 点位要素

      isDoorControl: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.accessHost.value, // 门禁主机
      isDoorControlChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.accessChannel.value, // 门禁通道

      isDoubleDoor: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.lockDoor.value, // 互锁门主机
      isDoubleDoorChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.lockDoorChannel.value, // 互锁门通道
      // 用于激活点位不受显隐性控制的变量
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint, // 当前的选择点
      editActive: ({ map2d }) => map2d.mapPoint.editActive // 当前的激活状态
    })
  },
  watch: {
    doorControlResource: {
      handler(val) {
        // 显示门禁主机
        this.loadDoorControl()
      },
      deep: true
    },
    doorControlChannelResource: {
      handler(val) {
        // 显示门禁通道
        this.loadDoorControlChannel()
      },
      deep: true
    },
    doubleDoorResource: {
      handler(val) {
        // 显示互锁门通道
        this.loadLockDoor()
      },
      deep: true
    },
    doubleDoorChannelResource: {
      handler(val) {
        //  显示互锁门主机
        this.loadLockDoorChannel()
      },
      deep: true
    },

    isDoorControl(val) {
      // 门禁主机显隐
      this.loadDoorControl()
    },
    isDoorControlChannel(val) {
      // 门禁通道显隐
      this.loadDoorControlChannel()
    },
    isDoubleDoor(val) {
      // 显示互锁门通道
      this.loadLockDoor()
    },
    isDoubleDoorChannel(val) {
      //  显示互锁门主机
      this.loadLockDoorChannel()
    }
  },
  methods: {
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType', // 点位要素相关
      'setPointIconFeatures',
      'addMapCommonResourcePoint' // 新增地图设备点位
    ]),
    ...mapActions('map2d/mapPanelSearch', ['changeResourceTree']),
    ...mapActions('map2d/mapIndex', ['setRefreshTreeListBox']),
    /**
     * 刷线当前的机构或重点部位
     * @param {*} data 点位数据
     */
    refreshCurrentKeyPartFeature_accessControl(data) {
      let point = JSON.parse(JSON.stringify(data))
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let keyPartsInfos = this.macthKeyPartsInfos_accessControl(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (keyPartsInfos.pointVisible) {
        // 点位显示时
        let features = JSON.parse(JSON.stringify(keyPartsInfos.features))
        features = features.filter(item => item.attributes.id !== point.id) // 过滤掉当前点位数据
        // 获取点位数据
        this.getCommonResourceById(point.id).then(res => {
          if (res && Number(res.code) === 0 && res.data) {
            let feature = keyPartsTrans_accessControl.transOneIconFeature(res.data, keyPartsInfos.featureLayer)
            feature && features.push(feature)
            this.setPointIconFeatures({ type: keyPartsInfos.keyPartsType, features })
          }
        })
      } else {
        // 点位隐藏时
        this.setPointIconFeatures({ type: keyPartsInfos.keyPartsType, features: [] })
      }
    },
    /**
     * 定位并显示选中机构/重点部位点位数据
     * @param {*} data 点位数据
     */
    showAccessControlPointFeature(data) {
      let point = JSON.parse(JSON.stringify(data))
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let subKeyPartsInfos = this.macthKeyPartsInfos_accessControl(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (!subKeyPartsInfos.pointVisible) {
        // 点位隐藏时
        subKeyPartsInfos.resource = [point] // 将选中的点位数据添加到相应点位资源数组中
        this.loadSubKeyPartsFeatures_accessControl(subKeyPartsInfos, FEATURETYPE.icon, type, subType) // 构造点位数据
      }
    },
    /**
     * 匹配机构子类型 查找资源数组、图标要素数组、
     * @param {*} monitortype 设备类型 key值
     * @param {*} digType 机构重点部位类型
     * @param {*} featureType 要素类型
     * @returns {*} resource 机构数组
     * @returns {*} featureLayer 要素图层
     * @returns {*} features 要素数组
     * @returns {*} fun actions要素赋值方法
     */
    macthKeyPartsInfos_accessControl(digType, monitortype, featureType) {
      let setFeaturesFun // 点位数据数组的vuex actions 设置函数
      let featureArr = [] // 点位数组——图层数据源
      let resourceArr = [] // 点位数据数组
      let featureLayer // 点位图层
      let keyPartsType = '' // 点位的名称前缀如：机构 总行 headLevel
      let pointVisible = false // 点位是否显示
      digType = Number(digType)
      monitortype = Number(monitortype)
      if (digType === DEVICETYPE.accessControlDevice) {
        switch (monitortype) {
          case ACCESSDEVICETYPE.doorControlHost: // 门禁主机
            keyPartsType = 'doorControl'
            pointVisible = this.isDoorControl
            break
          case ACCESSDEVICETYPE.doorControlChannel: // 门禁通道
            keyPartsType = 'doorControlChannel'
            pointVisible = this.isDoorControlChannel
            break
          case ACCESSDEVICETYPE.doubleDoor: // 互锁门主机
            keyPartsType = 'doubleDoor'
            pointVisible = this.isDoubleDoor
            break
          case ACCESSDEVICETYPE.doubleDoorChannel: //  互锁门通道
            keyPartsType = 'doubleDoorChannel'
            pointVisible = this.isDoubleDoorChannel
            break
        }
      }

      resourceArr = this[keyPartsType + 'Resource']
      featureArr = this[keyPartsType + 'Icons']
      featureLayer = this[keyPartsType + 'Layer']
      setFeaturesFun = this.setPointIconFeatures
      return {
        pointVisible,
        keyPartsType,
        featureLayer,
        resource: resourceArr,
        features: featureArr,
        fun: setFeaturesFun
      }
    },
    /**
     * 设置机构 图标 要素
     * @param {*} subKeyPartsInfos 方法 macthKeyPartsInfos_accessControl 的返回值
     * @param {*} featureType 要素类型
     */
    loadSubKeyPartsFeatures_accessControl(subKeyPartsInfos, featureType, type, subType) {
      // 匹配机构子类型资源数据
      const resourceArr = subKeyPartsInfos.resource
      // 匹配机构子类型名称图层
      const featureLayer = subKeyPartsInfos.featureLayer
      // 资源数组转换为要素数组
      let resourceArrCp = JSON.parse(JSON.stringify(resourceArr))
      if (this.curSelectResourcePoint && (this.curSelectResourcePoint.type + '-' + this.curSelectResourcePoint.subType === type + '-' + subType)) { // 存在当前选中编辑的点位数据，且图层类型与点位类型一致时
        let flag = this.isPointOnNowMap(this.curSelectResourcePoint) // 点位是否在当前地图上
        if (flag) { // 点位在当前地图上时
          resourceArrCp = resourceArrCp.filter(item => { return item.id !== this.curSelectResourcePoint.id }) // 资源数组过滤掉当前选中编辑数据id一致的数据（旧数据）
          resourceArrCp.push(cloneDeep(this.curSelectResourcePoint)) // 将当前选中编辑的数据放入资源数组中（新数据）
        }
      }
      let features = []
      if (featureType === FEATURETYPE.icon) {
        features = keyPartsTrans_accessControl.transIconFeatures(resourceArrCp, featureLayer)
      }
      // // 匹配机构子类型要素设置函数
      const setFeaturesFun = subKeyPartsInfos.fun
      setFeaturesFun({ type: subKeyPartsInfos.keyPartsType, features: features })
    },
    /**
     * 显示/隐藏 某一类的门禁设备 图标要素
     * 机构重点部位大类 digType
     * @param {*} monitortype 设备类型 key值
     * @param {*} iconVisible 图层显隐
     */
    controlSubIcons_accessControl(digType, monitortype, iconVisible) {
      const subKeyPartsInfos = this.macthKeyPartsInfos_accessControl(digType, monitortype, FEATURETYPE.icon)
      if (iconVisible) {
        this.loadSubKeyPartsFeatures_accessControl(subKeyPartsInfos, FEATURETYPE.icon, digType, monitortype)
      } else {
        const setFeaturesFun = subKeyPartsInfos.fun
        // 留下当前的激活点图标
        let featuresAll = subKeyPartsInfos.features
        if (this.editActive) {
          featuresAll = featuresAll.filter(item => {
            return item.attributes.id === this.curSelectResourcePoint.id
          })
        } else {
          featuresAll = []
        }
        setFeaturesFun({ type: subKeyPartsInfos.keyPartsType, features: featuresAll })
      }
    },
    /**
     * 构造添加的机构、重点部位数据
     *@param {*} selectedTreeCode 树选中的点位
     * @param {*} cood 坐标
     * @param {*} zoom 可见层级
     */
    constructAddedData_accessControl(selectedTreeCode, cood, zoom) {
      let resource // 待添加的点位数据
      let resourceArr // 已有的点位数据数组
      let nodeData = JSON.parse(JSON.stringify(selectedTreeCode))
      // 机构
      resource = {
        name: nodeData.name,
        type: nodeData.pointType, // 类型 设备大类
        subType: nodeData.pointSubType, // number 必须 子类型 设备子类
        coordinate: cood.join(','), // 坐标,
        orgId: nodeData.orgId, // string 必须 机构id
        keyPartId: nodeData.keyPartId, // string 必须 重点部位id
        level: Math.ceil(zoom), // 可见层级
        shapeType: MPSIGNKEY.point // 缩微图形态(枚举: 1,2,3枚举备注: 点位 自定义区域 线)
      }
      // 判断当前是图层上的需要上传对应的字段
      // floorId否 楼层id orgId否 机构id keyPartId否 重点部位id place是 点位存放位置 1-GIS地图 2-环境平面图 3-楼层平面图
      // if (this.isMapOuter === 1) {
      //   // 1-GIS地图
      //   resource.place = MAPTYPENUMBER.gis
      // } else if (this.isMapOuter === 2 && this.floorMap.isFloor === false) {
      //   // 2-环境平面图
      //   resource.place = MAPTYPENUMBER.hj
      // } else if (this.isMapOuter === 2 && this.floorMap.isFloor === true) {
      //   // 3-楼层平面图
      //   resource.place = MAPTYPENUMBER.lc
      //   // 楼层id
      //   resource.floorId = this.indoorInformation.id // 获取楼层id
      // }
      resource.place = this.nowMapPlace
      resource.place === MAPTYPENUMBER.lc && (resource.floorId = this.indoorInformation.id) // 获取楼层id
      resource.place === MAPTYPENUMBER.hj && (resource.envId = this.environmentalScienceInformation.id) // 获取环境平面图id
      nodeData.pointSubType = Number(nodeData.pointSubType)
      if (nodeData.pointSubType === ACCESSDEVICETYPE.doorControlHost) {
        resourceArr = this.doorControlResource
        resource.deviceId = nodeData.id // 设备id
      } else if (nodeData.pointSubType === ACCESSDEVICETYPE.doorControlChannel) {
        resourceArr = this.doorControlChannelResource
        resource.resourceId = nodeData.id // 设备id
        if (nodeData.dId) {
          resource.dId = nodeData.dId
        }
      } else if (nodeData.pointSubType === ACCESSDEVICETYPE.doubleDoor) {
        // 互锁门通道
        resourceArr = this.doorControlChannelResource
        resource.resourceId = nodeData.id // 设备id
        if (nodeData.dId) {
          resource.dId = nodeData.dId
        }
      } else if (nodeData.pointSubType === ACCESSDEVICETYPE.doubleDoorChannel) {
        // 互锁门主机
        resourceArr = this.doubleDoorChannelResource
        resource.deviceId = nodeData.id // 设备id
      }
      return {
        resource,
        resourceArr
      }
    },
    /**
     * 添加机构重点部位点位
     * @param {*} cood 坐标
     */
    addEquipmentTypeFeature(cood) {
      const zoom = window.$context2D.map.getView().getZoom()
      let typeIndex = this.constructAddedData_accessControl(this.selectedTreeCode, cood, zoom)

      let { resource, resourceArr } = typeIndex
      const resourceType = this.macthKeyPartsInfos_accessControl(resource.type, resource.subType).keyPartsType
      // 如果添加微// 图则不在调用添加接口
      if (resource.coordinate.split(',').length > 2) {
        resource.shapeType = 2
        let arr = resourceArr ? JSON.parse(JSON.stringify(resourceArr)) : []
        let endArr = []
        arr.forEach(element => {
          if (element.id === resource.id) {
            endArr.push(resource)
          }
          endArr.push(element)
        })
        this.setRefreshTreeListBox(true) // 刷新设备树
        this.setPointResourceByType({ type: resourceType, arr: endArr })
      }
      // 地图新增设备点位
      this.addMapCommonResourcePoint(resource)
        .then(res => {
          if (Number(res.code) === 0) {
            resource.id = res.data.id
            let arr = resourceArr ? JSON.parse(JSON.stringify(resourceArr)) : []
            arr.push(resource)
            this.setRefreshTreeListBox(true) // 刷新设备树
            this.$notify({
              message: '添加成功',
              type: 'success'
            })
            this.setPointResourceByType({ type: resourceType, arr: arr })
          } else {
            this.$notify({
              message: '添加失败',
              type: 'warning'
            })
          }
        })
        .catch(err => {
          console.log('添加成功', err)
          this.$notify({ title: '警告',
            message: '添加失败',
            type: 'warning'})
        })
    },
    // 显示或隐藏图层 门禁设备
    loadDoorControl() {
      // 门禁设备
      this.controlSubIcons_accessControl(
        DEVICETYPE.accessControlDevice,
        ACCESSDEVICETYPE.doorControlHost,
        this.isDoorControl
      )
    },
    loadDoorControlChannel() {
      // 门禁通道
      this.controlSubIcons_accessControl(
        DEVICETYPE.accessControlDevice,
        ACCESSDEVICETYPE.doorControlChannel,
        this.isDoorControlChannel
      )
    },
    loadLockDoor() {
      // 显示互锁门通道
      this.controlSubIcons_accessControl(DEVICETYPE.accessControlDevice, ACCESSDEVICETYPE.doubleDoor, this.isDoubleDoor)
    },
    loadLockDoorChannel() {
      // 显示互锁门主机
      this.controlSubIcons_accessControl(
        DEVICETYPE.accessControlDevice,
        ACCESSDEVICETYPE.doubleDoorChannel,
        this.isDoubleDoorChannel
      )
    },
    /**
     * 获取机构/重点部位点位对应的绘制样式类型数据
     * type 点位大类
     * subType 点位子类
     */
    getKeyPartPointStyleType(type, subType) {
      type = Number(type)
      subType = Number(subType)
      let iconType // 绘制图标类型
      if (type === DEVICETYPE.accessControlDevice) {
        // 机构
        // 机构* 1-总行、2-  一级分行、3- 二级分行、4- 直管行、5- 县级行
        // 门禁设备
        if (subType === ACCESSDEVICETYPE.doorControlHost) {
          iconType = 'accessHostDraw'
        } else if (subType === ACCESSDEVICETYPE.doorControlChannel) {
          iconType = 'accessChannelDraw'
        } else if (subType === ACCESSDEVICETYPE.doubleDoorChannel) {
          // 互锁门主机
          iconType = 'doubleDoorChannelDraw'
        } else if (subType === ACCESSDEVICETYPE.doubleDoor) {
          // 互锁门通道
          iconType = 'LockDoorDraw'
        }
      }
      return iconType
    }
  }
}
