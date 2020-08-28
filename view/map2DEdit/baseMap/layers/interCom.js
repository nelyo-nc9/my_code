// 机构图层
import layerConfig from 'assets/2DMap/meta/layer'
import { INTERCOMTYPE, FEATURETYPE, DEVICETYPE, MPSIGNKEY, CABINTYPE, MAPTYPENUMBER } from 'assets/2DMap/meta/common'
import interComTrans from 'assets/2DMap/feature/edit/interCom'
import { mapState, mapActions } from 'vuex'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      // ------ 定义对讲机相关图层------
      speechLayer: layerConfig.speechIcon, // 对讲主机
      speechChannelLayer: layerConfig.speechChannelIcon // 对讲通道
    }
  },
  computed: {
    ...mapState({
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      environmentalScienceInformation: ({ map2d }) => map2d.mapIndex.environmentalScienceInformation, // 最新的环境平面图信息
      speechResource: ({ map2d }) => map2d.mapPoint.speechResourceArr, // 对讲主机 资源数组
      speechIcons: ({ map2d }) => map2d.mapPoint.speechIconFeatures, // 对讲主机点位要素
      speechChannelResource: ({ map2d }) => map2d.mapPoint.speechChannelResourceArr, // 对讲通道 资源数组
      speechChannelIcons: ({ map2d }) => map2d.mapPoint.speechChannelIconFeatures, // 对讲通道 点位要素
      protectiveCabinResource: ({ map2d }) => map2d.mapPoint.protectiveCabinResourceArr, // 防护舱主机 资源数组
      protectiveCabinIcons: ({ map2d }) => map2d.mapPoint.protectiveCabinIconFeatures, // 防护舱主机点位要素
      protectiveCabinChannelResource: ({ map2d }) => map2d.mapPoint.protectiveCabinChannelResourceArr, // 防护舱通道 资源数组
      protectiveCabinChannelIcons: ({ map2d }) => map2d.mapPoint.protectiveCabinChannelIconFeatures, // 防护舱通道 点位要素
      isIntercomHost: ({ map2d }) => map2d.mapIndex.checkedEquipments.intercom.intercomHost.value, //   对讲主机显隐
      isIntercomChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.intercom.intercomChannel.value, // 对讲通道显隐
      isProtectiveHost: ({ map2d }) => map2d.mapIndex.checkedEquipments.protectedCabin.protectedCabinHost.value, //   对讲主机显隐
      isProtectiveChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.protectedCabin.protectedCabinChannel.value, // 对讲通道显隐
      // 用于激活点位不受显隐性控制的变量
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint, // 当前的选择点
      editActive: ({ map2d }) => map2d.mapPoint.editActive// 当前的激活状态
    })
  },
  watch: {
    // 机构
    speechResource: {
      handler() {
        this.loadIntercomHost()
      },
      deep: true
    },
    speechChannelResource: {
      handler() {
        this.loadIntercomChannel()
      },
      deep: true
    },
    protectiveCabinResource: {
      handler() {
        this.loadProtectiveHost()
      },
      deep: true
    },
    protectiveCabinChannelResource: {
      handler() {
        this.loadProtectiveChannel()
      },
      deep: true
    },
    isIntercomHost() {
      this.loadIntercomHost()
    },
    isIntercomChannel() {
      this.loadIntercomChannel()
    },
    isProtectiveHost() {
      this.loadProtectiveHost()
    },
    isProtectiveChannel() {
      this.loadProtectiveChannel()
    }
    // 重点部位
  },
  methods: {
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType',
      'setPointIconFeatures',
      'addMapCommonResourcePoint' // 新增地图设备点位
    ]),
    ...mapActions('map2d/mapPanelSearch', ['changeResourceTree']),
    ...mapActions('map2d/mapIndex', ['setRefreshTreeListBox']),
    /**
    /**
     * 匹配子类型 查找资源数组、图标要素数组、
     * @param {*} monitortype 设备类型 sunType
     * @param {*} digType 机构重点部位类型
     * @param {*} featureType 要素类型
     * @returns {*} resource 机构数组
     * @returns {*} featureLayer 要素图层
     * @returns {*} features 要素数组
     * @returns {*} fun actions要素赋值方法
     */
    refreshCurrentIntercomFeature(data) {
      let point = JSON.parse(JSON.stringify(data))
      //   point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let keyPartsInfos = this.macthSpeechInfo(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，resType：点位的名称前缀如：机构 总行 headLevel）
      if (keyPartsInfos.pointVisible) {
        // 点位显示时
        let features = JSON.parse(JSON.stringify(keyPartsInfos.features))
        features = features.filter(item => item.attributes.id !== point.id) // 过滤掉当前点位数据
        // 获取点位数据
        this.getCommonResourceById(point.id).then(res => {
          if (Number(res.code) === 0 && res.data) {
            let feature = interComTrans.transOneIconFeature(res.data, keyPartsInfos.featureLayer)
            feature && features.push(feature)
            this.setPointIconFeatures({ type: keyPartsInfos.resType, features })
          }
        })
      } else {
        // 点位隐藏时
        this.setPointIconFeatures({ type: keyPartsInfos.resType, features: [] })
      }
    },
    showIntercomPointFeature(data) { // 显示对讲设备点位要素
      let point = JSON.parse(JSON.stringify(data))
      console.log('point', point)
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let subKeyPartsInfos = this.macthSpeechInfo(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，resType：点位的名称前缀如：机构 总行 headLevel）
      if (!subKeyPartsInfos.pointVisible) {
        // 点位隐藏时
        subKeyPartsInfos.resource = [point] // 将选中的点位数据添加到相应点位资源数组中
        this.loadSubIntercomFeatures(subKeyPartsInfos, FEATURETYPE.icon, type, subType) // 构造点位数据
      }
    },
    // macthKeyPartsInfos(digType, monitortype, featureType) {
    macthSpeechInfo(digType, monitortype, featureType) {
      let setFeaturesFun // 点位数据数组的vuex actions 设置函数
      let featureArr = [] // 点位数组——图层数据源
      let resourceArr = [] // 点位数据数组
      let featureLayer // 点位图层
      let resType = null // 点位的名称前缀如：机构 总行 headLevel
      let pointVisible = false // 点位是否显示
      digType = Number(digType)
      monitortype = Number(monitortype)
      if (digType === DEVICETYPE.intercomDevice) {
        switch (monitortype) {
          case INTERCOMTYPE.speechHost: // 对讲主机
            resType = 'speech'
            pointVisible = this.isIntercomHost
            break
          case INTERCOMTYPE.speechChannel: // 对讲通道
            resType = 'speechChannel'
            pointVisible = this.isIntercomChannel
            break
        }
      } else if (digType === DEVICETYPE.cabin) {
        switch (monitortype) {
          case CABINTYPE.cabinHost: // 对讲主机
            resType = 'protectiveCabin'
            pointVisible = this.isProtectiveHost
            break
          case CABINTYPE.cabinChannel: // 对讲通道
            resType = 'protectiveCabinChannel'
            pointVisible = this.isProtectiveChannel
            break
        }
      }
      resourceArr = this[resType + 'Resource']
      featureArr = this[resType + 'Icons']
      featureLayer = this[resType + 'Layer']
      setFeaturesFun = this.setPointIconFeatures
      return {
        pointVisible,
        resType,
        featureLayer,
        resource: resourceArr,
        features: featureArr,
        fun: setFeaturesFun
      }
    },
    /**
     * 设置机构 图标 要素
     * @param {*} subIntercomInfos 方法macthKeyPartsInfos的返回值
     * @param {*} featureType 要素类型
     */
    loadSubIntercomFeatures(subIntercomInfos, featureType, type, subType) {
      // 匹配机构子类型资源数据
      const resourceArr = subIntercomInfos.resource
      // 匹配机构子类型名称图层
      const featureLayer = subIntercomInfos.featureLayer
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
        features = interComTrans.transIconFeatures(resourceArrCp, featureLayer)
      }
      // // 匹配机构子类型要素设置函数
      const setFeaturesFun = subIntercomInfos.fun
      setFeaturesFun({ type: subIntercomInfos.resType, features: features })
    },
    /**
     * 显示/隐藏 某一类的机构 图标要素
     * 机构重点部位大类 digType
     * @param {*} monitortype 设备类型 key值
     * @param {*} iconVisible 图层显隐
     */
    controlSubIntercomIcons(digType, monitortype, iconVisible) {
      const subIntercomInfos = this.macthSpeechInfo(digType, monitortype, FEATURETYPE.icon)
      if (iconVisible) {
        this.loadSubIntercomFeatures(subIntercomInfos, FEATURETYPE.icon, digType, monitortype)
      } else {
        const setFeaturesFun = subIntercomInfos.fun
        // 留下当前的激活点图标
        let featuresAll = subIntercomInfos.features
        if (this.editActive) {
          featuresAll = featuresAll.filter(item => {
            return item.attributes.id === this.curSelectResourcePoint.id
          })
        } else {
          featuresAll = []
        }
        setFeaturesFun({ type: subIntercomInfos.resType, features: featuresAll })
      }
    },
    /**
     * 地图加载完成后，获取相应的机构
     */
    /**
     * 按机构类型查找已添加到地图的机构
     * @param {*} monitortype 机构类型
     */
    /**
     * 构造添加的机构、重点部位数据
     *@param {*} selectedTreeNode 树选中的点位
     * @param {*} cood 坐标
     * @param {*} zoom 可见层级
     */
    // 后期 可能要加参数    floorId        vuex  有对应的值与对象
    constructAddedDataSpeech(selectedTreeNode, cood, zoom) {
      let resource // 待添加的点位数据
      let resourceArr // 已有的点位数据数组
      let nodeData = JSON.parse(JSON.stringify(selectedTreeNode))
      //  对讲设备
      resource = {
        name: nodeData.name,
        type: nodeData.pointType, // 类型 设备大类
        subType: nodeData.pointSubType.toString(), // number 必须 子类型 设备子类
        coordinate: cood.join(','), // 坐标,
        orgId: nodeData.orgId,
        keyPartId: nodeData.keyPartId,
        level: Math.ceil(zoom), // 可见层级
        shapeType: MPSIGNKEY.point // 缩微图形态(枚举: 1,2,3枚举备注: 点位 自定义区域 线)
      }
      // if (this.isMapOuter === 1) {
      //   // 1-GIS地图
      //   resource.place = MAPTYPENUMBER.gis
      // } else if (this.isMapOuter === 2 && this.floorMap.isFloor === false) {
      //   // 2-环境平面图
      //   resource.place = MAPTYPENUMBER.hj
      // } else if (this.isMapOuter === 2 && this.floorMap.isFloor === true) {
      //   // 3-楼层平面图
      //   resource.place = MAPTYPENUMBER.lc
      //   resource.floorId = this.indoorInformation.id // 获取楼层id
      // }
      resource.place = this.nowMapPlace
      resource.place === MAPTYPENUMBER.lc && (resource.floorId = this.indoorInformation.id)
      resource.place === MAPTYPENUMBER.hj && (resource.envId = this.environmentalScienceInformation.id)
      nodeData.pointSubType = Number(nodeData.pointSubType)
      if (nodeData.tierType === 'res') {
        resource.resourceId = nodeData.id
      } else if (nodeData.tierType === 'equ') {
        resource.deviceId = nodeData.id
      }
      if (nodeData.pointType === DEVICETYPE.intercomDevice) {
        if (nodeData.pointSubType === INTERCOMTYPE.speechHost) {
          resourceArr = this.speechResource
        } else if (nodeData.pointSubType === INTERCOMTYPE.speechChannel) {
          resourceArr = this.speechChannelResource
        }
      } else if (nodeData.pointType === DEVICETYPE.cabin) {
        if (nodeData.pointSubType === CABINTYPE.cabinHost) {
          resourceArr = this.protectiveCabinResource
        } else if (nodeData.pointSubType === CABINTYPE.cabinChannel) {
          resourceArr = this.protectiveCabinChannelResource
        }
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
    addIntercomFeature(cood) {
      if (this.selectedTreeCode) {
        const zoom = window.$context2D.map.getView().getZoom()

        let typeIndex = this.constructAddedDataSpeech(this.selectedTreeCode, cood, zoom)
        let { resource, resourceArr } = typeIndex
        const resourceType = this.macthSpeechInfo(resource.type, resource.subType).resType
        this.addMapCommonResourcePoint(resource)
          .then(res => {
            resource.id = res.data.id
            let arr = resourceArr ? JSON.parse(JSON.stringify(resourceArr)) : []
            arr.push(resource)
            this.setRefreshTreeListBox(true) // 刷新设备树
            this.$notify({
              message: '添加成功',
              type: 'success'
            })
            this.setPointResourceByType({ type: resourceType, arr: arr })
          })
          .catch(err => {
            console.log('添加成功', err)
            this.$notify({ title: '警告',
              message: '添加失败',
              type: 'warning'})
          })
      }
    },
    // 显示或隐藏图层  对讲通道
    loadIntercomHost() {
      this.controlSubIntercomIcons(DEVICETYPE.intercomDevice, INTERCOMTYPE.speechHost, this.isIntercomHost)
    },
    loadIntercomChannel() {
      this.controlSubIntercomIcons(DEVICETYPE.intercomDevice, INTERCOMTYPE.speechChannel, this.isIntercomChannel)
    },
    loadProtectiveHost() {
      this.controlSubIntercomIcons(DEVICETYPE.cabin, CABINTYPE.cabinHost, this.isProtectiveHost)
    },
    loadProtectiveChannel() {
      this.controlSubIntercomIcons(DEVICETYPE.cabin, CABINTYPE.cabinChannel, this.isProtectiveChannel)
    }
    /**
     * 获取对讲设备点位对应的绘制样式类型数据
     * type 点位大类
     * subType 点位子类
     */
  }
}
