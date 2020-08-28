// 机构图层
import layerConfig from 'assets/2DMap/meta/layer'
import {
  FEATURETYPE,
  DEVICETYPE,
  MPSIGNKEY,
  MAPTYPENUMBER,
  FIREFIGHTINGDEVICETYPE,
  EnglishNamePrefix
} from 'assets/2DMap/meta/common'
import videoTrans from 'assets/2DMap/feature/edit/firefighting'
import { mapState, mapActions } from 'vuex'
import { cloneDeep } from 'lodash'
import { pointTypeData } from 'assets/2DMap/meta/pointType'
export default {
  data() {
    return {
      userInfoTransmissionDeviceLayer: layerConfig.userInfoTransmissionDeviceIcon, //
      firePumpMonitorLayer: layerConfig.firePumpMonitorIcon, //
      hydraulicSensorLayer: layerConfig.hydraulicSensorIcon, //
      liquidLevelSensorLayer: layerConfig.liquidLevelSensorIcon, //
      smokePreventionMonitorLayer: layerConfig.smokePreventionMonitorIcon, //
      gasMonitorLayer: layerConfig.gasMonitorIcon, //
      fireSeparationMonitorLayer: layerConfig.fireSeparationMonitorIcon, //
      electricalFireDetectorLayer: layerConfig.electricalFireDetectorIcon, //
      independentSmokeDetectorLayer: layerConfig.independentSmokeDetectorIcon, //
      independentTemperatureSensorLayer: layerConfig.independentTemperatureSensorIcon, //
      independentCombustibleGasDetectorLayer: layerConfig.independentCombustibleGasDetectorIcon //
    }
  },
  computed: {
    ...mapState({
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      environmentalScienceInformation: ({ map2d }) => map2d.mapIndex.environmentalScienceInformation, // 最新的环境信息
      userInfoTransmissionDeviceResource: ({ map2d }) => map2d.mapPoint.userInfoTransmissionDeviceResourceArr, //  消防设备 资源数组
      userInfoTransmissionDeviceIcons: ({ map2d }) => map2d.mapPoint.userInfoTransmissionDeviceIconFeatures, // 消防设备 点位要素
      firePumpMonitorResource: ({ map2d }) => map2d.mapPoint.firePumpMonitorResourceArr, //  消防设备 资源数组
      firePumpMonitorIcons: ({ map2d }) => map2d.mapPoint.firePumpMonitorIconFeatures, // 消防设备 点位要素
      hydraulicSensorResource: ({ map2d }) => map2d.mapPoint.hydraulicSensorResourceArr, //  消防设备 资源数组
      hydraulicSensorIcons: ({ map2d }) => map2d.mapPoint.hydraulicSensorIconFeatures, // 消防设备 点位要素
      liquidLevelSensorResource: ({ map2d }) => map2d.mapPoint.liquidLevelSensorResourceArr, //  消防设备 资源数组
      liquidLevelSensorIcons: ({ map2d }) => map2d.mapPoint.liquidLevelSensorIconFeatures, // 消防设备 点位要素
      smokePreventionMonitorResource: ({ map2d }) => map2d.mapPoint.smokePreventionMonitorResourceArr, //  消防设备 资源数组
      smokePreventionMonitorIcons: ({ map2d }) => map2d.mapPoint.smokePreventionMonitorIconFeatures, // 消防设备 点位要素
      gasMonitorResource: ({ map2d }) => map2d.mapPoint.gasMonitorResourceArr, //  消防设备 资源数组
      gasMonitorIcons: ({ map2d }) => map2d.mapPoint.gasMonitorIconFeatures, // 消防设备 点位要素
      fireSeparationMonitorResource: ({ map2d }) => map2d.mapPoint.fireSeparationMonitorResourceArr, //  消防设备 资源数组
      fireSeparationMonitorIcons: ({ map2d }) => map2d.mapPoint.fireSeparationMonitorIconFeatures, // 消防设备 点位要素
      electricalFireDetectorResource: ({ map2d }) => map2d.mapPoint.electricalFireDetectorResourceArr, //  消防设备 资源数组
      electricalFireDetectorIcons: ({ map2d }) => map2d.mapPoint.electricalFireDetectorIconFeatures, // 消防设备 点位要素
      independentSmokeDetectorResource: ({ map2d }) => map2d.mapPoint.independentSmokeDetectorResourceArr, //  消防设备 资源数组
      independentSmokeDetectorIcons: ({ map2d }) => map2d.mapPoint.independentSmokeDetectorIconFeatures, // 消防设备 点位要素
      independentTemperatureSensorResource: ({ map2d }) => map2d.mapPoint.independentTemperatureSensorResourceArr, //  消防设备 资源数组
      independentTemperatureSensorIcons: ({ map2d }) => map2d.mapPoint.independentTemperatureSensorIconFeatures, // 消防设备 点位要素
      independentCombustibleGasDetectorResource: ({ map2d }) => map2d.mapPoint.independentCombustibleGasDetectorResourceArr, //  消防设备 资源数组
      independentCombustibleGasDetectorIcons: ({ map2d }) => map2d.mapPoint.independentCombustibleGasDetectorIconFeatures, // 消防设备 点位要素
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      videoTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists['1'], // 资源树
      isUserInfoTransmissionDevice: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.userInfoTransmissionDevice.value, //
      isFirePumpMonitor: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.firePumpMonitor.value, //
      isHydraulicSensor: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.hydraulicSensor.value, //
      isLiquidLevelSensor: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.liquidLevelSensor.value, //
      isSmokePreventionMonitor: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.smokePreventionMonitor.value, //
      isGasMonitor: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.gasMonitor.value, //
      isFireSeparationMonitor: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.fireSeparationMonitor.value, //
      isElectricalFireDetector: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.electricalFireDetector.value, //
      isIndependentSmokeDetector: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.independentSmokeDetector.value, //
      isIndependentTemperatureSensor: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.independentTemperatureSensor.value, //
      isIndependentCombustibleGasDetector: ({ map2d }) => map2d.mapIndex.checkedEquipments.fireFighting.independentCombustibleGasDetector.value, //
      // 用于激活点位不受显隐性控制的变量
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint, // 当前的选择点
      editActive: ({ map2d }) => map2d.mapPoint.editActive // 当前的激活状态
    })
  },
  watch: {
    //
    userInfoTransmissionDeviceResource: {
      handler() {
        this.loadUserInfoTransmissionDevice()
      },
      deep: true
    },
    //
    firePumpMonitorResource: {
      handler() {
        this.loadFirePumpMonitor()
      },
      deep: true
    },
    //
    hydraulicSensorResource: {
      handler() {
        this.loadHydraulicSensor()
      },
      deep: true
    },
    //
    liquidLevelSensorResource: {
      handler() {
        this.loadLiquidLevelSensor()
      },
      deep: true
    },
    //
    smokePreventionMonitorResource: {
      handler() {
        this.loadSmokePreventionMonitor()
      },
      deep: true
    },
    //
    gasMonitorResource: {
      handler() {
        this.loadGasMonitor()
      },
      deep: true
    },
    //
    fireSeparationMonitorResource: {
      handler() {
        this.loadFireSeparationMonitor()
      },
      deep: true
    },
    //
    electricalFireDetectorResource: {
      handler() {
        this.loadElectricalFireDetector()
      },
      deep: true
    },
    independentSmokeDetectorResource: {
      handler() {
        this.loadIndependentSmokeDetector()
      },
      deep: true
    },
    //
    independentTemperatureSensorResource: {
      handler() {
        this.loadIndependentTemperatureSensor()
      },
      deep: true
    },
    //
    independentCombustibleGasDetectorResource: {
      handler() {
        this.loadIndependentCombustibleGasDetector()
      },
      deep: true
    },
    isUserInfoTransmissionDevice() {
      this.loadUserInfoTransmissionDevice()
    },
    isFirePumpMonitor() {
      this.loadFirePumpMonitor()
    },
    isHydraulicSensor() {
      this.loadHydraulicSensor()
    },
    isLiquidLevelSensor() {
      this.loadLiquidLevelSensor()
    },
    isSmokePreventionMonitor() {
      this.loadSmokePreventionMonitor()
    },
    isGasMonitor() {
      this.loadGasMonitor()
    },
    isFireSeparationMonitor() {
      this.loadFireSeparationMonitor()
    },
    isElectricalFireDetector() {
      this.loadElectricalFireDetector()
    },
    isIndependentSmokeDetector() {
      this.loadIndependentSmokeDetector()
    },
    isIndependentTemperatureSensor() {
      this.loadIndependentTemperatureSensor()
    },
    isIndependentCombustibleGasDetector() {
      this.loadIndependentCombustibleGasDetector()
    }
  },
  methods: {
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType',
      'setPointIconFeatures',
      'addMapCommonResourcePoint' // 新增地图设备点位
    ]),
    ...mapActions('map2d/mapPanelSearch', ['changeResourceTree']),
    ...mapActions('map2d/mapIndex', ['setRefreshTreeList']),
    /**
     * 定位并显示选中机构/重点部位点位数据
     * @param {*} data 点位数据
     */
    showKeyPartPointFeature_firefighting(data) {
      let point = cloneDeep(data)
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let subKeyPartsInfos = this.macthVideoInfos_firefighting(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (!subKeyPartsInfos.pointVisible) {
        // 点位隐藏时
        subKeyPartsInfos.resource = [point] // 将选中的点位数据添加到相应点位资源数组中
        this.loadSubVideoFeatures_firefighting(subKeyPartsInfos, FEATURETYPE.icon, type, subType) // 构造点位数据
      }
    },
    /**
     * 设置机构 图标 要素
     * @param {*} subKeyPartsInfos 方法macthKeyPartsInfos的返回值
     * @param {*} featureType 要素类型
     */
    loadSubKeyPartsFeatures_firefighting(subKeyPartsInfos, featureType) {
      // 匹配机构子类型资源数据
      const resourceArr = subKeyPartsInfos.resource
      // 匹配机构子类型名称图层
      const featureLayer = subKeyPartsInfos.featureLayer
      // 资源数组转换为要素数组
      const resourceArrCp = cloneDeep(resourceArr)
      let features
      if (featureType === FEATURETYPE.icon) {
        features = videoTrans.transIconFeatures(resourceArrCp, featureLayer)
      }
      // // 匹配机构子类型要素设置函数
      const setFeaturesFun = subKeyPartsInfos.fun
      // console.log('setFeaturesFun', cloneDeep(features))
      setFeaturesFun({ type: subKeyPartsInfos.pointType, features: features })
    },
    /**
     * 刷线当前的机构或重点部位
     * @param {*} data 点位数据
     */
    refreshCurrentKeyPartFeature_firefighting(data) {
      // console.log('刷线当前的机构或重点部位', data)
      let point = cloneDeep(data)
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let keyPartsInfos = this.macthVideoInfos_firefighting(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (keyPartsInfos.pointVisible) {
        // 点位显示时
        let features = cloneDeep(keyPartsInfos.features)
        features = features.filter(item => item.attributes.id !== point.id) // 过滤掉当前点位数据
        // 获取点位数据
        this.getCommonResourceById(point.id).then(res => {
          if (res && Number(res.code) === 0 && res.data) {
            let feature = videoTrans.transOneIconFeature(res.data, keyPartsInfos.featureLayer)
            feature && features.push(feature)
            this.setPointIconFeatures({ type: keyPartsInfos.pointType, features })
          }
        })
      } else {
        // 点位隐藏时
        this.setPointIconFeatures({ type: keyPartsInfos.pointType, features: [] })
      }
    },
    /**
     * 定位并显示选中机构/重点部位点位数据
     * @param {*} data 点位数据
     */
    locateAndShowKeyPartPoint_firefighting(data) {
      let point = cloneDeep(data)
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let subKeyPartsInfos = this.macthVideoInfos_firefighting(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (!subKeyPartsInfos.pointVisible) {
        // 点位隐藏时
        subKeyPartsInfos.resource = [point] // 将选中的点位数据添加到相应点位资源数组中
        this.loadSubKeyPartsFeatures_firefighting(subKeyPartsInfos, FEATURETYPE.icon) // 构造点位数据
      }
      this.showPointPanelInfo(point) // 显示点位面板信息
    },
    /**
     * 匹配摄像机类型 查找资源数组、图标要素数组、可视域要素数数组、图层、设置要素方法
     * @param {*} monitortype 设备类型 key值
     * @param {*} featureType 要素类型
     * @returns {*} resource 摄像机资源数组
     * @returns {*} featureLayer 要素图层
     * @returns {*} features 要素数组
     * @returns {*} fun actions要素赋值方法
     */
    firstToUpper(str) {
      str = str.trim()
      return str.replace(str[0], str[0].toUpperCase())
    },
    // 判断是不是中文
    CheckChinese(val) {
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (reg.test(val)) {
        return true
      }
    },

    macthVideoInfos_firefighting(type, subType, featureType) {
      let setFeaturesFun
      let featureArr = []
      let resourceArr = []
      let featureLayer
      let pointVisible = false
      let pointTypeValue = pointTypeData[`${type}-${subType}`]
      if (pointTypeValue) {
        pointVisible = this['is' + this.firstToUpper(pointTypeValue)]
        resourceArr = this[pointTypeValue + 'Resource']
        featureArr = this[pointTypeValue + 'Icons']
        featureLayer = this[pointTypeValue + 'Layer']
        setFeaturesFun = this.setPointIconFeatures
        if (featureType === FEATURETYPE.geometry) {
          // 可视域
          featureArr = this[pointTypeValue + 'Sectors']
          featureLayer = this[pointTypeValue + 'SectorLayer']
          setFeaturesFun = this.setVideoSectorFeatures
        }
      }
      return {
        pointVisible: pointVisible, // --shen 流程值，要改
        pointType: pointTypeValue,
        resource: resourceArr,
        featureLayer: featureLayer,
        features: featureArr,
        fun: setFeaturesFun
      }
    },
    /**
     * 设置摄像机 图标/可视域 要素
     * @param {*} subVideoInfos 方法macthVideoInfos的返回值
     * @param {*} featureType 要素类型
     */
    loadSubVideoFeatures_firefighting(subVideoInfos, featureType, type, subType) {
      // 匹配视频子类型资源数据
      const resourceArr = subVideoInfos.resource
      // 匹配视频子类型名称图层
      const featureLayer = subVideoInfos.featureLayer
      // 资源数组转换为要素数组
      let resourceArrCp = cloneDeep(resourceArr)
      let features = []
      if (this.curSelectResourcePoint && (this.curSelectResourcePoint.type + '-' + this.curSelectResourcePoint.subType === type + '-' + subType)) { // 存在当前选中编辑的点位数据，且图层类型与点位类型一致时
        let flag = this.isPointOnNowMap(this.curSelectResourcePoint) // 点位是否在当前地图上
        if (flag) { // 点位在当前地图上时
          resourceArrCp = resourceArrCp.filter(item => { return item.id !== this.curSelectResourcePoint.id }) // 资源数组过滤掉当前选中编辑数据id一致的数据（旧数据）
          resourceArrCp.push(cloneDeep(this.curSelectResourcePoint)) // 将当前选中编辑的数据放入资源数组中（新数据）
        }
      }
      if (featureType === FEATURETYPE.icon) {
        features = videoTrans.transIconFeatures(resourceArrCp, featureLayer)
      } else if (featureType === FEATURETYPE.geometry) {
        features = videoTrans.transSectorFeatures(resourceArrCp, featureLayer)
      }
      // 匹配视频子类型要素设置函数
      const setFeaturesFun = subVideoInfos.fun
      setFeaturesFun({ type: subVideoInfos.pointType, features: features })
      return { features }
    },
    /**
     * 显示/隐藏 某一类的摄像机 图标要素
     * @param {*} monitortype 设备类型 key值
     * @param {*} iconVisible 图层显隐
     */
    controlSubVideoIcons_firefighting(type, subType, iconVisible) {
      const subVideoInfos = this.macthVideoInfos_firefighting(type, subType, FEATURETYPE.icon)
      if (iconVisible) {
        this.loadSubVideoFeatures_firefighting(subVideoInfos, FEATURETYPE.icon, type, subType)
      } else {
        const setFeaturesFun = subVideoInfos.fun
        // 留下当前的激活点图标
        let featuresAll = subVideoInfos.features
        if (this.editActive) {
          featuresAll = featuresAll.filter(item => {
            return item.attributes.id === this.curSelectResourcePoint.id
          })
        } else {
          featuresAll = []
        }
        setFeaturesFun({ type: subVideoInfos.pointType, features: featuresAll })
      }
    },
    /**
     * 显示/隐藏 某一类的摄像机 可视域要素
     * @param {*} monitortype 设备类型 key值
     * @param {*} iconVisible 图层显隐
     */
    controlSubVideoSectors_firefighting(type, subType, iconVisible) {
      const subVideoInfos = this.macthVideoInfos_firefighting(type, subType, FEATURETYPE.geometry)
      if (iconVisible) {
        this.loadSubVideoFeatures_firefighting(subVideoInfos, FEATURETYPE.geometry, type, subType)
      } else {
        const setFeaturesFun = subVideoInfos.fun
        setFeaturesFun({ type: subVideoInfos.pointType, features: [] })
      }
    },
    /**
     * 地图加载完成后，获取相应的摄像机
     */
    loadVideoResources_firefighting() {
      // this.loadQuerySubVideos(VIDEOTYPEKEY.boltipc)
      // this.loadQuerySubVideos(VIDEOTYPEKEY.halfBallipc)
      // this.loadQuerySubVideos(VIDEOTYPEKEY.fastBallipc)
      // this.loadQuerySubVideos(VIDEOTYPEKEY.allViewipc)
      // this.loadQuerySubVideos(VIDEOTYPEKEY.redBoltipc)
    },
    /**
     * 按摄像机类型查找已添加到地图的摄像机
     * @param {*} monitortype 摄像机类型
     */
    loadQuerySubVideos_firefighting(monitortype) {
      let query = {}
      // 监控类型（0：枪机、1：红外:2：半球、3：快球、4：全景）
      typeof monitortype !== 'undefined' && (query.monitortype = monitortype)
      // 接口查询楼内楼外的某一类摄像机
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query.mapId = this.activeMapConfig.mapId
        // this.loadSubVideosByMapId(query)
      } else if (this.currentFloor.id) {
        query.floorId = this.currentFloor.id
        // this.loadSubVideosByFloorId(query)
      }
    },
    /**
     * 构造添加的机构、重点部位数据
     *@param {*} selectedTreeCode 树选中的点位
     * @param {*} cood 坐标
     * @param {*} zoom 可见层级
     */
    constructAddedData_firefighting(selectedTreeCode, cood, zoom) {
      let resource // 待添加的点位数据
      let resourceArr // 已有的点位数据数组
      let nodeData = JSON.parse(JSON.stringify(selectedTreeCode))
      let {pointType, pointSubType} = nodeData
      resource = {
        name: nodeData.name,
        type: pointType, // 类型 设备大类
        subType: pointSubType, // number 必须 子类型 设备子类
        coordinate: cood.join(','), // 坐标,
        orgId: nodeData.orgId, // string 必须 机构id
        keyPartId: nodeData.keyPartId, // string 必须 重点部位id
        level: Math.ceil(zoom), // 可见层级
        shapeType: MPSIGNKEY.point // 缩微图形态(枚举: 1,2,3枚举备注: 点位 自定义区域 线)
      }
      resource.place = this.nowMapPlace
      resource.place === MAPTYPENUMBER.lc && (resource.floorId = this.indoorInformation.id) // 获取楼层id
      resource.place === MAPTYPENUMBER.hj && (resource.envId = this.environmentalScienceInformation.id) // 获取环境平面图id
      nodeData.pointSubType = Number(nodeData.pointSubType)
      let pointTypeValue = pointTypeData[`${pointType}-${pointSubType}`]
      if (pointTypeValue && this[pointTypeValue + 'Resource']) {
        resourceArr = cloneDeep(this[pointTypeValue + 'Resource'])
      }
      if ([FIREFIGHTINGDEVICETYPE.hydraulicSensor, FIREFIGHTINGDEVICETYPE.liquidLevelSensor].includes(nodeData.pointSubType)) { // 资源/部件 （液压传感器、液位传感器）
        resource.resourceId = nodeData.id // 资源id
        nodeData.dId && (resource.dId = nodeData.dId)
      } else { // 主机/设备
        resource.deviceId = nodeData.id // 设备id
      }
      return {
        resource,
        resourceArr
      }
    },
    /**
     * 添加录像机点位
     * @param {*} cood 坐标
     */
    addResourceFeature_firefighting(cood) {
      if (this.selectedTreeCode) {
        const zoom = window.$context2D.map.getView().getZoom()
        let typeIndex = this.constructAddedData_firefighting(this.selectedTreeCode, cood, zoom)
        let { resource, resourceArr } = typeIndex
        let {type, subType} = resource
        let pointTypeValue = pointTypeData[`${type}-${subType}`]
        resource.shapeType = MPSIGNKEY.point
        // console.log('摄像机信息', this.selectedTreeCode)
        if (resource.name == null) {
          resource.name = '数据库没有这个值'
        }
        if (resource.name.length >= 30) {
          resource.name = resource.name.substr(0, 29)
        }
        resource.place = this.nowMapPlace
        resource.place === MAPTYPENUMBER.lc && (resource.floorId = this.indoorInformation.id) // 获取楼层id
        resource.place === MAPTYPENUMBER.hj && (resource.envId = this.environmentalScienceInformation.id) // 获取环境平面图id
        delete resource.id // 删除id
        // console.log('添加资源', JSON.stringify(resource))
        this.addMapCommonResourcePoint(resource)
          .then(res => {
            resource.id = res.data.id
            let arr = cloneDeep(resourceArr)
            arr.push(resource)
            this.setRefreshTreeListBox(true) // 刷新机构重点部位树
            this.$notify({
              message: '添加成功',
              type: 'success'
            })
            this.setPointResourceByType({ type: pointTypeValue, arr: arr })
          })
          .catch(err => {
            console.log('添加成功', err)
            this.$notify({ title: '警告',
              message: '添加失败',
              type: 'warning'})
          })
      }
    },
    // 显示或隐藏图层
    loadUserInfoTransmissionDevice() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.userInfoTransmissionDevice,
        this.isUserInfoTransmissionDevice
      )
    },
    loadFirePumpMonitor() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.firePumpMonitor,
        this.isFirePumpMonitor
      )
    },
    loadHydraulicSensor() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.hydraulicSensor,
        this.isHydraulicSensor
      )
    },
    loadLiquidLevelSensor() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.liquidLevelSensor,
        this.isLiquidLevelSensor
      )
    },
    loadSmokePreventionMonitor() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.smokePreventionMonitor,
        this.isSmokePreventionMonitor
      )
    },
    loadGasMonitor() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.gasMonitor,
        this.isGasMonitor
      )
    },
    loadFireSeparationMonitor() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.fireSeparationMonitor,
        this.isFireSeparationMonitor
      )
    },
    loadElectricalFireDetector() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.electricalFireDetector,
        this.isElectricalFireDetector
      )
    },
    loadIndependentSmokeDetector() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.independentSmokeDetector,
        this.isIndependentSmokeDetector
      )
    },
    loadIndependentTemperatureSensor() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.independentTemperatureSensor,
        this.isIndependentTemperatureSensor
      )
    },
    loadIndependentCombustibleGasDetector() {
      this.controlSubVideoIcons_firefighting(
        DEVICETYPE.fireDevice,
        FIREFIGHTINGDEVICETYPE.independentCombustibleGasDetector,
        this.isIndependentCombustibleGasDetector
      )
    }
  }
}
