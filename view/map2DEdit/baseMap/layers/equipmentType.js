// @Description: 设备 ，对讲，门禁防护舱
// @Author: zuoshaohua
// @Date: 2020-07-29 18:57:43
// @LastEditTime: 2020-07-29  11:57:43
// @LastEditors: zuoshaohua

import layerConfig from 'assets/2DMap/meta/layer'
import {
  ACCESSDEVICETYPE,
  INTERCOMTYPE,
  CABINTYPE,
  DEVICETYPE,
  AUDIOEQUIPMENT,
  MPSIGNKEY,
  FEATURETYPE
} from '../../../../assets/2DMap/meta/common'
import equipmentType from 'assets/2DMap/feature/edit/equipmentType'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      // speechLayer: equipmentType.speechIcon, // 对讲主机
      // speechChannelLayer: equipmentType.speechChannelIcon, // 对讲通道
      // cabinLayer: equipmentType.cabinIcon, // 防护舱主机
      // cabinChannelLayer: equipmentType.cabinChannelIcon, // 防护舱通道
      // doubleDoorLayer: equipmentType.doubleDoorIcon, // 联动互锁门
      // doorControlChannelLayer: equipmentType.doorControlChannelIcon, // 门禁通道
      // doorControlLayer: equipmentType.doorControlIcon, // 门禁主机
    }
  },
  computed: {
    ...mapState({
      // doorControlResource: ({ map2d }) => map2d.mapPoint.doorControlResourceArr, // 门禁主机 资源数组
      // doorControlIcons: ({ map2d }) => map2d.mapPoint.doorControlIconFeatures, // 门禁主机 点位要素
      // doorControlChannelResource: ({ map2d }) => map2d.mapPoint.doorControlChannelResourceArr, // 门禁通道 资源数组
      // doorControlChannelIcons: ({ map2d }) => map2d.mapPoint.doorControlChannelIconFeatures, // 门禁通道 点位要素
      // doubleDoorResource: ({ map2d }) => map2d.mapPoint.doubleDoorResourceArr, // 互锁门 资源数组
      // doubleDoorIcons: ({ map2d }) => map2d.mapPoint.doubleDoorIconFeatures, // 互锁门 点位要素

      // protectiveCabinResource: ({ map2d }) => map2d.mapPoint.protectiveCabinResourceArr, // 防护舱主机 资源数组
      // protectiveCabinIcons: ({ map2d }) => map2d.mapPoint.protectiveCabinIconFeatures, // 防护舱主机 点位要素

      // protectiveCabinChannelResource: ({ map2d }) => map2d.mapPoint.protectiveCabinChannelResourceArr, // 防护舱通道 资源数组
      // protectiveCabinChannelIcons: ({ map2d }) => map2d.mapPoint.protectiveCabinChannelIconFeatures, // 防护舱通道 点位要素

      // speechResource: ({ map2d }) => map2d.mapPoint.speechResourceArr, // 对讲主机 资源数组
      // speechIcons: ({ map2d }) => map2d.mapPoint.speechIconFeatures, // 对讲主机 点位要素

      // speechChannelResource: ({ map2d }) => map2d.mapPoint.speechChannelResourceArr, // 对讲通道 资源数组
      // speechChannelIcons: ({ map2d }) => map2d.mapPoint.speechChannelIconFeatures, // 对讲通道 点位要素

      // isIntercomHost: ({ map2d }) => map2d.mapIndex.checkedEquipments.intercom.intercomHost.value, // 对讲主机
      // isIntercomChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.intercom.intercomChannel.value, // 对讲通道

      // isAccessHost: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.accessHost.value, // 门禁主机
      // isAccessChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.accessChannel.value, // 门禁通道
      // isLockDoor: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.lockDoor.value, // 互锁门

      // isProtectedCabinHost: ({ map2d }) => map2d.mapIndex.checkedEquipments.protectedCabin.protectedCabinHost.value, // 防护舱主机
      // isProtectedCabinChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.protectedCabin.protectedCabinChannel.value, // 防护舱通道

      // selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      // videoTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists['1'], // 资源树
      // 用于激活点位不受显隐性控制的变量
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint, // 当前的选择点
      editActive: ({ map2d }) => map2d.mapPoint.editActive // 当前的激活状态
    })
  },
  watch: {
    speechResource: {
      handler() {
        this.loadSpeech()
      },
      deep: true
    },
    speechChannelResource: {
      handler() {
        this.loadSpeechChannel()
      },
      deep: true
    },
    isIntercomHost() {
      this.loadSpeech()
    },
    isIntercomChannel() {
      this.loadSpeechChannel()
    }
  },
  methods: {
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType',
      'setPointIconFeatures',
      'setVideoSectorFeatures', // 所有类型的摄像机
      'addMapCommonResourcePoint' // 新增地图设备点位
    ]),
    ...mapActions('map2d/mapPanelSearch', ['changeResourceTree']),
    ...mapActions('map2d/mapIndex', ['setRefreshTreeListBox']),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeCode']),
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
    macthEquipmentTypeInfos(digType, monitortype, featureType) {
      let setFeaturesFun // 点位数据数组的vuex actions 设置函数
      let featureArr = [] // 点位数组——图层数据源
      let resourceArr = [] // 点位数据数组
      let featureLayer // 点位图层
      let EquipmentTypeType = '' // 点位的名称前缀如：机构 总行 headLevel
      let pointVisible = false // 点位是否显示
      digType = Number(digType)
      monitortype = Number(monitortype)
      if (digType === DEVICETYPE.intercomDevice) {
        switch (monitortype) {
          case AUDIOEQUIPMENT.audioHost: // 对讲主机
            EquipmentTypeType = 'headLevel'
            pointVisible = this.isIntercomHost
            break
          case AUDIOEQUIPMENT.audioChannel: // 对讲通道
            EquipmentTypeType = 'headLevel'
            pointVisible = this.isIntercomChannel
            break
        }
      } else if (digType === DEVICETYPE.keyPart) {
        // switch (monitortype) {
        //   case KEYPARTTYPEORG.businessOutlets: // 营业网点
        //     EquipmentTypeType = 'businessOutlets'
        //     pointVisible = this.isBusinessOutlets
        //     break
        // }
      }

      resourceArr = this[EquipmentTypeType + 'Resource']
      featureArr = this[EquipmentTypeType + 'Icons']
      featureLayer = this[EquipmentTypeType + 'Layer']
      setFeaturesFun = this.setPointIconFeatures
      return {
        pointVisible,
        EquipmentTypeType,
        featureLayer,
        resource: resourceArr,
        features: featureArr,
        fun: setFeaturesFun
      }
    },
    /**
     * 构造添加的对讲数据
     *@param {*} selectedTreeCode 树选中的点位
     * @param {*} cood 坐标
     * @param {*} zoom 可见层级
     */
    constructAddedDataEquipmentType(selectedTreeCode, cood, zoom) {
      let resource // 待添加的点位数据
      let resourceArr // 已有的点位数据数组
      let nodeData = JSON.parse(JSON.stringify(selectedTreeCode))
      // 对讲设备
      resource = {
        name: nodeData.name,
        type: nodeData.pointType, // 类型 设备大类
        subType: nodeData.pointSubType, // number 必须 子类型 设备子类
        coordinate: cood.join(','), // 坐标,
        orgId: nodeData.orgId, // string 必须 机构id
        keyPartId: nodeData.keyPartId, // string 必须 重点部位id
        // deviceId: String(nodeData.id), //设备id
        level: zoom, // 可见层级
        shapeType: MPSIGNKEY.point // 缩微图形态(枚举: 1,2,3枚举备注: 点位 自定义区域 线)
      }
      nodeData.pointSubType = Number(nodeData.pointSubType)
      if (nodeData.pointSubType === INTERCOMTYPE.speechHost) {
        resourceArr = this.speechResource
        resource.deviceId = nodeData.id // 设备id
        delete resource.resourceId
      } else if (nodeData.pointSubType === INTERCOMTYPE.speechChannel) {
        resourceArr = this.speechIcons
        delete resource.deviceId
        resource.resourceId = nodeData.id // 设备id
        if (nodeData.dId) {
          resource.dId = nodeData.dId
        }
      }
      return {
        resource,
        resourceArr
      }
    },
    /**
     * 添加对讲设备点位
     * @param {*} cood 坐标
     */
    addEquipmentTypeFeature(cood) {
      const zoom = window.$context2D.map.getView().getZoom()
      let typeIndex = this.constructAddedDataEquipmentType(this.selectedTreeCode, cood, zoom)
      let { resource, resourceArr } = typeIndex
      const resourceType = this.macthKeyPartsInfos(resource.type, resource.subType).keyPartsType
      // 如果添加微缩图则不在调用添加接口
      this.addMapCommonResourcePoint(resource)
        .then(res => {
          resource.id = res.data.id
          let arr = resourceArr ? JSON.parse(JSON.stringify(resourceArr)) : []
          arr.push(resource)
          this.setRefreshTreeListBox(true) // 刷新设备树
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.setPointResourceByType({ type: resourceType, arr: arr })
          let updateSelectedTreeCode = cloneDeep(this.selectedTreeCode)
          updateSelectedTreeCode.isPoint = true
          this.setSelectedTreeCode(updateSelectedTreeCode)
        })
        .catch(err => console.log(err))
    },
    /**
     * 显示/隐藏 某一类的机构 图标要素
     * 机构重点部位大类 digType
     * @param {*} monitortype 设备类型 key值
     * @param {*} iconVisible 图层显隐
     */
    controlSubEquipmentTypeIcons(digType, monitortype, iconVisible) {
      const subEquipmentTypeInfos = this.macthEquipmentTypeInfos(digType, monitortype, FEATURETYPE.icon)
      if (iconVisible) {
        this.loadSubEquipmentTypeFeatures(subEquipmentTypeInfos, FEATURETYPE.icon)
      } else {
        const setFeaturesFun = subEquipmentTypeInfos.fun
        // 留下当前的激活点图标
        let featuresAll = subEquipmentTypeInfos.features
        if (this.editActive) {
          featuresAll = featuresAll.filter(item => {
            return item.attributes.id === this.curSelectResourcePoint.id
          })
        } else {
          featuresAll = []
        }
        setFeaturesFun({ type: subEquipmentTypeInfos.EquipmentTypeType, features: featuresAll })
      }
    },
    // 显示或隐藏图层 对讲设备
    loadSpeech() {
      // 对讲主机
      this.controlSubEquipmentTypeIcons(DEVICETYPE.intercomDevice, AUDIOEQUIPMENT.audioHost, this.isIntercomHost)
    },
    loadSpeechChannel() {
      // 对讲通道
      this.controlSubEquipmentTypeIcons(DEVICETYPE.intercomDevice, AUDIOEQUIPMENT.audioChannel, this.isIntercomChannel)
    }
  }
}
