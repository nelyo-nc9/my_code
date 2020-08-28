// 机构图层
import layerConfig from 'assets/2DMap/meta/layer'
import { KEYPARTTYPE, FEATURETYPE, KEYPARTTYPEORG, DEVICETYPE, TREENODETYPE, MPSIGNKEY, MAPTYPENUMBER } from 'assets/2DMap/meta/common'
import keyPartsTrans from 'assets/2DMap/feature/edit/keyParts'
import { mapState, mapActions } from 'vuex'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      // ------ 定义机构相关图层------
      headLevelLayer: layerConfig.headLevelIcon, // 总行
      oneLevelLayer: layerConfig.oneLevelIcon, // 一级分行
      twoLevelLayer: layerConfig.twoLevelIcon, // 二级分行
      countyLevelLayer: layerConfig.countyLevelIcon, // 县级行
      directlyLevelLayer: layerConfig.directlyLevelIcon, // 直属支行
      // ------定义重点部位相关图层------
      businessOutletsLayer: layerConfig.businessOutletsIcon, // 营业网点
      vaultLayer: layerConfig.vaultIcon, // 金库
      computerRoomLayer: layerConfig.computerRoomIcon, // 计算机房
      officeBuildingLayer: layerConfig.officeBuildingIcon, // 办公楼
      selfServiceBankLayer: layerConfig.selfServiceBankIcon, // 自助银行
      selfServiceEquipmentLayer: layerConfig.selfServiceEquipmentIcon, // 自助设备
      selfServiceSilverLayer: layerConfig.selfServiceSilverIcon, // 自助银亭
      privateBankLayer: layerConfig.privateBankIcon, // 私人银行
      safeDepositLayer: layerConfig.safeDepositIcon, // 保险箱库
      archivesCenterLayer: layerConfig.archivesCenterIcon, // 档案室
      remoteControlCenterLayer: layerConfig.remoteControlCenterIcon, // 远程监控中心
      fiveGSmartBankingLayer: layerConfig.fiveGSmartBankingIcon, // 5G + 智能银行
      fortuneCenterLayer: layerConfig.fortuneCenterIcon, // 财富中心
      otherKeyPartsLayer: layerConfig.otherKeyPartsIcon, // 其他重点部位
      xuniLayer: layerConfig.xuniIcon // 虚拟重点部位
    }
  },
  computed: {
    ...mapState({
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      indoorInformation: ({ map2d }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      environmentalScienceInformation: ({ map2d }) => map2d.mapIndex.environmentalScienceInformation, // 最新的环境平面图信息
      headLevelResource: ({ map2d }) => map2d.mapPoint.headLevelResourceArr, // 机构 总行 资源数组
      headLevelIcons: ({ map2d }) => map2d.mapPoint.headLevelIconFeatures, // 机构 总行 点位要素
      oneLevelResource: ({ map2d }) => map2d.mapPoint.oneLevelResourceArr, // 机构 一行 资源数组
      oneLevelIcons: ({ map2d }) => map2d.mapPoint.oneLevelIconFeatures, // 机构  一行 点位要素

      twoLevelResource: ({ map2d }) => map2d.mapPoint.twoLevelResourceArr, // 机构 二行 资源数组
      twoLevelIcons: ({ map2d }) => map2d.mapPoint.twoLevelIconFeatures, // 机构  二行 点位要素

      countyLevelResource: ({ map2d }) => map2d.mapPoint.countyLevelResourceArr, // 机构 县行 资源数组
      countyLevelIcons: ({ map2d }) => map2d.mapPoint.countyLevelIconFeatures, // 机构  县行 点位要素

      directlyLevelResource: ({ map2d }) => map2d.mapPoint.directlyLevelResourceArr, // 机构 直属行 资源数组
      directlyLevelIcons: ({ map2d }) => map2d.mapPoint.directlyLevelIconFeatures, // 机构  直属行 点位要素

      businessOutletsResource: ({ map2d }) => map2d.mapPoint.businessOutletsResourceArr, // 营业网点 资源数组
      businessOutletsIcons: ({ map2d }) => map2d.mapPoint.businessOutletsIconFeatures, // 营业网点  点位要素

      vaultResource: ({ map2d }) => map2d.mapPoint.vaultResourceArr, // 金库 资源数组
      vaultIcons: ({ map2d }) => map2d.mapPoint.vaultIconFeatures, // 金库  点位要素

      computerRoomResource: ({ map2d }) => map2d.mapPoint.computerRoomResourceArr, // 计算机房 资源数组
      computerRoomIcons: ({ map2d }) => map2d.mapPoint.computerRoomIconFeatures, // 计算机房  点位要素

      officeBuildingResource: ({ map2d }) => map2d.mapPoint.officeBuildingResourceArr, // 办公楼 资源数组
      officeBuildingIcons: ({ map2d }) => map2d.mapPoint.officeBuildingIconFeatures, // 办公楼  点位要素

      selfServiceBankResource: ({ map2d }) => map2d.mapPoint.selfServiceBankResourceArr, // 自助银行 资源数组
      selfServiceBankIcons: ({ map2d }) => map2d.mapPoint.selfServiceBankIconFeatures, // 自助银行  点位要素

      selfServiceEquipmentResource: ({ map2d }) => map2d.mapPoint.selfServiceEquipmentResourceArr, // 自助设备 资源数组
      selfServiceEquipmentIcons: ({ map2d }) => map2d.mapPoint.selfServiceEquipmentIconFeatures, // 自助设备  点位要素

      selfServiceSilverResource: ({ map2d }) => map2d.mapPoint.selfServiceSilverResourceArr, // 自助银亭 资源数组
      selfServiceSilverIcons: ({ map2d }) => map2d.mapPoint.selfServiceSilverIconFeatures, // 自助银亭  点位要素

      privateBankResource: ({ map2d }) => map2d.mapPoint.privateBankResourceArr, // 私人银行 资源数组
      privateBankIcons: ({ map2d }) => map2d.mapPoint.privateBankIconFeatures, // 私人银行  点位要素

      safeDepositResource: ({ map2d }) => map2d.mapPoint.safeDepositResourceArr, // 保险箱库 资源数组
      safeDepositIcons: ({ map2d }) => map2d.mapPoint.safeDepositIconFeatures, // 保险箱库  点位要素

      archivesCenterResource: ({ map2d }) => map2d.mapPoint.archivesCenterResourceArr, // 档案室 资源数组
      archivesCenterIcons: ({ map2d }) => map2d.mapPoint.archivesCenterIconFeatures, // 档案室  点位要素

      remoteControlCenterResource: ({ map2d }) => map2d.mapPoint.remoteControlCenterResourceArr, // 远程监控中心 资源数组
      remoteControlCenterIcons: ({ map2d }) => map2d.mapPoint.remoteControlCenterIconFeatures, // 远程监控中心  点位要素

      fiveGSmartBankingResource: ({ map2d }) => map2d.mapPoint.fiveGSmartBankingResourceArr, // 5G + 智能银行 资源数组
      fiveGSmartBankingIcons: ({ map2d }) => map2d.mapPoint.fiveGSmartBankingIconFeatures, // 5G + 智能银行  点位要素

      fortuneCenterResource: ({ map2d }) => map2d.mapPoint.fortuneCenterResourceArr, // 财富中心 资源数组
      fortuneCenterIcons: ({ map2d }) => map2d.mapPoint.fortuneCenterIconFeatures, // 财富中心  点位要素

      otherKeyPartsResource: ({ map2d }) => map2d.mapPoint.otherKeyPartsResourceArr, // 其他重点部位 资源数组
      otherKeyPartsIcons: ({ map2d }) => map2d.mapPoint.otherKeyPartsIconFeatures, // 其他重点部位  点位要素

      xuniResource: ({ map2d }) => map2d.mapPoint.xuniResourceArr, // 虚拟重点部位 资源数组
      xuniIcons: ({ map2d }) => map2d.mapPoint.xuniIconFeatures, // 虚拟重点部位  点位要素

      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      videoTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists['1'], // 资源树

      isHeadOffice: ({ map2d }) => map2d.mapIndex.checkedEquipments.importPart.headOffice.value, // 总行
      isTierOneBranch: ({ map2d }) => map2d.mapIndex.checkedEquipments.importPart.tierOneBranch.value, // 一级分行
      isSecondLevelBranch: ({ map2d }) => map2d.mapIndex.checkedEquipments.importPart.secondLevelBranch.value, // 二级分行
      isCountyLevel: ({ map2d }) => map2d.mapIndex.checkedEquipments.importPart.countyLevel.value, // 县级行
      isDirectlyLevel: ({ map2d }) => map2d.mapIndex.checkedEquipments.importPart.directlyBranch.value, // 直属支行

      isBusinessOutlets: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.businessOutlets.value, // 营业网点
      isVault: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.vault.value, // 金库
      isComputerRoom: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.computerRoom.value, // 计算机房
      isCfficeBuilding: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.officeBuilding.value, // 办公楼
      isSelfServiceBank: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.selfServiceBank.value, // 自助银行
      isSelfServiceEquipment: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.selfServiceEquipment.value, // 自助设备

      isSelfServiceSilver: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.selfServiceSilver.value, // 自助银亭
      isPrivateBank: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.privateBank.value, // 私人银行

      isSafeDeposit: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.safeDeposit.value, // 保险箱库

      isArchivesCenter: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.archivesCenter.value, // 档案室
      isRemoteControlCenter: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.remoteControlCenter.value, // 远程监控中心
      isFiveGSmartBanking: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.fiveGSmartBanking.value, // 5G + 智能银行
      isFortuneCenter: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.fortuneCenter.value, // 财富中心

      isOtherKeyParts: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.otherKeyParts.value, // 其他重点部位
      isXuni: ({ map2d }) => map2d.mapIndex.checkedEquipments.keyParts.xuni.value, // 虚拟重点部位
      // 用于激活点位不受显隐性控制的变量
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint, // 当前的选择点
      editActive: ({ map2d }) => map2d.mapPoint.editActive// 当前的激活状态
    })
  },
  watch: {
    // 机构
    headLevelResource: {
      handler() {
        this.loadHeadOffice()
      },
      deep: true
    },
    oneLevelResource: {
      handler() {
        this.loadTierOneBranch()
      },
      deep: true
    },
    twoLevelResource: {
      handler() {
        this.loadSecondLevelBranch()
      },
      deep: true
    },
    countyLevelResource: {
      handler() {
        this.loadCountyLevel()
      },
      deep: true
    },
    directlyLevelResource: {
      handler() {
        this.loadDirectlyLevel()
      },
      deep: true
    },
    // 机构
    // 重点部位
    businessOutletsResource: {
      // 营业网点
      handler() {
        this.loadBusinessOutlets()
      },
      deep: true
    },
    vaultResource: {
      // 金库
      handler() {
        this.loadVault()
      },
      deep: true
    },
    computerRoomResource: {
      // 计算机房
      handler() {
        this.loadComputerRoom()
      },
      deep: true
    },
    officeBuildingResource: {
      // 办公楼
      handler() {
        this.loadOfficeBuilding()
      },
      deep: true
    },
    selfServiceBankResource: {
      // 自助银行
      handler() {
        this.loadSelfServiceBank()
      },
      deep: true
    },
    selfServiceEquipmentResource: {
      // 自助设备
      handler() {
        this.loadSelfServiceEquipment()
      },
      deep: true
    },
    selfServiceSilverResource: {
      // 自助银亭
      handler() {
        this.loadSelfServiceSilver()
      },
      deep: true
    },
    privateBankResource: {
      // 私人银行
      handler() {
        this.loadPrivateBank()
      },
      deep: true
    },
    safeDepositResource: {
      // 保险箱库
      handler() {
        this.loadSafeDeposit()
      },
      deep: true
    },
    archivesCenterResource: {
      // 档案室
      handler() {
        this.loadArchivesCenter()
      },
      deep: true
    },
    remoteControlCenterResource: {
      // 远程监控中心
      handler() {
        this.loadRemoteControlCenter()
      },
      deep: true
    },
    fiveGSmartBankingResource: {
      // 5G + 智能银行
      handler() {
        this.loadFiveGSmartBanking()
      },
      deep: true
    },
    fortuneCenterResource: {
      // 财富中心
      handler() {
        this.loadFortuneCenter()
      },
      deep: true
    },
    otherKeyPartsResource: {
      // 其他重点部位
      handler() {
        this.loadOtherKeyParts()
      },
      deep: true
    },
    xuniResource: {
      // 虚拟重点部位
      handler() {
        this.loadXuni()
      },
      deep: true
    },

    // 重点部位

    // 机构
    isHeadOffice() {
      this.loadHeadOffice()
    },
    isTierOneBranch() {
      this.loadTierOneBranch()
    },
    isSecondLevelBranch() {
      this.loadSecondLevelBranch()
    },
    isCountyLevel() {
      this.loadCountyLevel()
    },
    isDirectlyLevel() {
      this.loadDirectlyLevel()
    },
    // 机构
    // 重点部位
    isBusinessOutlets() {
      // 营业网点
      this.loadBusinessOutlets()
    },
    isVault() {
      // 金库
      this.loadVault()
    },
    isComputerRoom() {
      // 计算机房
      this.loadComputerRoom()
    },
    isCfficeBuilding() {
      // 办公楼
      this.loadOfficeBuilding()
    },
    isSelfServiceBank() {
      // 自助银行

      this.loadSelfServiceBank()
    },
    isSelfServiceEquipment() {
      // 自助设备
      this.loadSelfServiceEquipment()
    },
    isSelfServiceSilver() {
      // 自助银亭
      this.loadSelfServiceSilver()
    },
    isPrivateBank() {
      // 私人银行
      this.loadPrivateBank()
    },
    isSafeDeposit() {
      // 保险箱库
      this.loadSafeDeposit()
    },
    isArchivesCenter() {
      // // 档案室
      this.loadArchivesCenter()
    },
    isRemoteControlCenter() {
      // 远程监控中心
      this.loadRemoteControlCenter()
    },
    isFiveGSmartBanking() {
      // 5G + 智能银行
      this.loadFiveGSmartBanking()
    },

    isFortuneCenter() {
      // 财富中心
      this.loadFortuneCenter()
    },
    isOtherKeyParts() {
      // 其他重点部位
      this.loadOtherKeyParts()
    },

    isXuni() {
      // 虚拟重点部位
      this.loadXuni()
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
    ...mapActions('map2d/mapIndex', ['setRefreshTreeList']),
    /**
     * 刷线当前的机构或重点部位
     * @param {*} data 点位数据
     */
    refreshCurrentKeyPartFeature(data) {
      // console.log('刷线当前的机构或重点部位', data)
      let point = JSON.parse(JSON.stringify(data))
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let keyPartsInfos = this.macthKeyPartsInfos(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (keyPartsInfos.pointVisible) {
        // 点位显示时
        let features = JSON.parse(JSON.stringify(keyPartsInfos.features))
        features = features.filter(item => item.attributes.id !== point.id) // 过滤掉当前点位数据
        // 获取点位数据
        this.getCommonResourceById(point.id).then(res => {
          if (res && Number(res.code) === 0 && res.data) {
            let feature = keyPartsTrans.transOneIconFeature(res.data, keyPartsInfos.featureLayer)
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
    showKeyPartPointFeature(data) {
      let point = JSON.parse(JSON.stringify(data))
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let { type, subType } = point // 获取到点位大类+子类数据
      let subKeyPartsInfos = this.macthKeyPartsInfos(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (!subKeyPartsInfos.pointVisible) {
        // 点位隐藏时
        subKeyPartsInfos.resource = [point] // 将选中的点位数据添加到相应点位资源数组中
        this.loadSubKeyPartsFeatures(subKeyPartsInfos, FEATURETYPE.icon, type, subType) // 构造点位数据
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
    macthKeyPartsInfos(digType, monitortype, featureType) {
      let setFeaturesFun // 点位数据数组的vuex actions 设置函数
      let featureArr = [] // 点位数组——图层数据源
      let resourceArr = [] // 点位数据数组
      let featureLayer // 点位图层
      let keyPartsType = '' // 点位的名称前缀如：机构 总行 headLevel
      let pointVisible = false // 点位是否显示
      digType = Number(digType)
      monitortype = Number(monitortype)
      if (digType === DEVICETYPE.org) {
        switch (monitortype) {
          case KEYPARTTYPE.headLevel: // 总行
            keyPartsType = 'headLevel'
            pointVisible = this.isHeadOffice
            break
          case KEYPARTTYPE.oneLevel: // 一级分行
            keyPartsType = 'oneLevel'
            pointVisible = this.isTierOneBranch
            break
          case KEYPARTTYPE.twoLevel: // 二级分行
            keyPartsType = 'twoLevel'
            pointVisible = this.isSecondLevelBranch
            break
          case KEYPARTTYPE.countyLevel: // 县级行
            keyPartsType = 'countyLevel'
            pointVisible = this.isCountyLevel
            break
          case KEYPARTTYPE.directlyLevel: // 直属支行
            keyPartsType = 'directlyLevel'
            pointVisible = this.isDirectlyLevel
            break
        }
      } else if (digType === DEVICETYPE.keyPart) {
        switch (monitortype) {
          case KEYPARTTYPEORG.businessOutlets: // 营业网点
            keyPartsType = 'businessOutlets'
            pointVisible = this.isBusinessOutlets
            break
          case KEYPARTTYPEORG.vault: // 金库
            keyPartsType = 'vault'
            pointVisible = this.isVault
            break
          case KEYPARTTYPEORG.computerRoom: // 计算机房
            keyPartsType = 'computerRoom'
            pointVisible = this.isComputerRoom
            break
          case KEYPARTTYPEORG.officeBuilding: // 办公楼
            keyPartsType = 'officeBuilding'
            pointVisible = this.isCfficeBuilding
            break
          case KEYPARTTYPEORG.selfServiceBank: // 自助银行
            keyPartsType = 'selfServiceBank'
            pointVisible = this.isSelfServiceBank
            break
          case KEYPARTTYPEORG.selfServiceEquipment: // 自助设备
            keyPartsType = 'selfServiceEquipment'
            pointVisible = this.isSelfServiceEquipment
            break
          case KEYPARTTYPEORG.selfServiceSilver: // 自助银亭
            keyPartsType = 'selfServiceSilver'
            pointVisible = this.isSelfServiceSilver
            break
          case KEYPARTTYPEORG.privateBank: // 私人银行
            keyPartsType = 'privateBank'
            pointVisible = this.isPrivateBank
            break
          case KEYPARTTYPEORG.safeDeposit: // 保险箱库
            keyPartsType = 'safeDeposit'
            pointVisible = this.isSafeDeposit
            break
          case KEYPARTTYPEORG.archivesCenter: // 档案室
            keyPartsType = 'archivesCenter'
            pointVisible = this.isArchivesCenter
            break
          case KEYPARTTYPEORG.remoteControlCenter: // 远程监控中心
            keyPartsType = 'remoteControlCenter'
            pointVisible = this.isRemoteControlCenter
            break
          case KEYPARTTYPEORG.fiveGSmartBanking: // 5G + 智能银行
            keyPartsType = 'fiveGSmartBanking'
            pointVisible = this.isFiveGSmartBanking
            break
          case KEYPARTTYPEORG.fortuneCenter: // 财富中心
            keyPartsType = 'fortuneCenter'
            pointVisible = this.isFortuneCenter
            break
          case KEYPARTTYPEORG.otherKeyParts: // 其他重点部位
            keyPartsType = 'otherKeyParts'
            pointVisible = this.isOtherKeyParts
            break
          case KEYPARTTYPEORG.xuni: // 虚拟重点部位
            keyPartsType = 'xuni'
            pointVisible = this.isXuni
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
     * @param {*} subKeyPartsInfos 方法macthKeyPartsInfos的返回值
     * @param {*} featureType 要素类型
     */
    loadSubKeyPartsFeatures(subKeyPartsInfos, featureType, type, subType) {
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
        features = keyPartsTrans.transIconFeatures(resourceArrCp, featureLayer)
      }
      // // 匹配机构子类型要素设置函数
      const setFeaturesFun = subKeyPartsInfos.fun
      // console.log('setFeaturesFun', cloneDeep(features))
      setFeaturesFun({ type: subKeyPartsInfos.keyPartsType, features: features })
    },
    /**
     * 显示/隐藏 某一类的机构 图标要素
     * 机构重点部位大类 digType
     * @param {*} monitortype 设备类型 key值
     * @param {*} iconVisible 图层显隐
     */
    controlSubKeyPartsIcons(digType, monitortype, iconVisible) {
      const subKeyPartsInfos = this.macthKeyPartsInfos(digType, monitortype, FEATURETYPE.icon)
      if (iconVisible) { // 点位显示时
        this.loadSubKeyPartsFeatures(subKeyPartsInfos, FEATURETYPE.icon, digType, monitortype)
      } else { // 点位隐藏时
        const setFeaturesFun = subKeyPartsInfos.fun
        // 留下当前的激活点图标
        let features = subKeyPartsInfos.features
        if (this.curSelectResourcePoint) { // 存在当前选中编辑的点位数据时
          features = features.filter(item => {
            return item.attributes.id === this.curSelectResourcePoint.id
          })
        } else {
          features = []
        }
        setFeaturesFun({ type: subKeyPartsInfos.keyPartsType, features })
      }
    },
    /**
     * 地图加载完成后，获取相应的机构
     */
    // loadVideoResources() {
    //   this.loadQuerySubKeyParts(KEYPARTTYPE.boltipc)
    //   this.loadQuerySubKeyParts(KEYPARTTYPE.halfBallipc)
    //   this.loadQuerySubKeyParts(KEYPARTTYPE.fastBallipc)
    //   this.loadQuerySubKeyParts(KEYPARTTYPE.allViewipc)
    //   this.loadQuerySubKeyParts(KEYPARTTYPE.redBoltipc)
    // },
    /**
     * 按机构类型查找已添加到地图的机构
     * @param {*} monitortype 机构类型
     */
    // loadQuerySubKeyParts(monitortype) {
    //   let query = {}
    //   // 机构重点部位类型（1：总行:2：一级分行、3：二级分行、4：县级行、5 直属支行）
    //   typeof monitortype !== 'undefined' && (query.monitortype = monitortype)
    //   // 接口查询楼内楼外的某一类机构
    //   if (this.isMapOuter && this.activeMapConfig.mapId) {
    //     query.mapId = this.activeMapConfig.mapId
    //     // this.loadSubVideosByMapId(query)
    //   } else if (this.currentFloor.id) {
    //     query.floorId = this.currentFloor.id
    //     // this.loadSubVideosByFloorId(query)
    //   }
    // },
    /**
     * 构造添加的机构、重点部位数据
     *@param {*} selectedTreeNode 树选中的点位
     * @param {*} cood 坐标
     * @param {*} zoom 可见层级
     */
    constructAddedData(selectedTreeNode, cood, zoom) {
      let resource // 待添加的点位数据
      let resourceArr // 已有的点位数据数组
      let nodeData = JSON.parse(JSON.stringify(selectedTreeNode))
      if (nodeData.tierType === TREENODETYPE.org) {
        // 机构
        resource = {
          name: nodeData.name,
          type: DEVICETYPE.org, // 类型 设备大类
          subType: String(nodeData.kind), // number 必须 子类型 设备子类
          coordinate: cood.join(','), // 坐标,
          orgId: String(nodeData.id), // string 必须 机构id
          level: Math.ceil(zoom), // 可见层级
          shapeType: MPSIGNKEY.point // 缩微图形态(枚举: 1,2,3枚举备注: 点位 自定义区域 线)
        }
        resource.place = this.nowMapPlace
        resource.place === MAPTYPENUMBER.lc && (resource.floorId = this.indoorInformation.id) // 获取楼层id
        resource.place === MAPTYPENUMBER.hj && (resource.envId = this.environmentalScienceInformation.id) // 获取环境平面图id
        nodeData.kind = Number(nodeData.kind)
        if (nodeData.kind === KEYPARTTYPE.headLevel) {
          resourceArr = this.headLevelResource
        } else if (nodeData.kind === KEYPARTTYPE.oneLevel) {
          resourceArr = this.oneLevelResource
        } else if (nodeData.kind === KEYPARTTYPE.twoLevel) {
          resourceArr = this.twoLevelResource
        } else if (nodeData.kind === KEYPARTTYPE.countyLevel) {
          resourceArr = this.countyLevelResource
        } else if (nodeData.kind === KEYPARTTYPE.directlyLevel) {
          resourceArr = this.directlyLevelResource
        }
      } else if (nodeData.tierType === TREENODETYPE.loc) {
        // 重点部位
        resource = {
          name: nodeData.name,
          type: DEVICETYPE.keyPart, // 类型 设备大类
          subType: String(nodeData.keyPartType), // number 必须 子类型 设备子类
          coordinate: cood.join(','), // 坐标,
          keyPartId: String(nodeData.id), // string 必须 机构id
          level: Math.ceil(zoom), // 可见层级
          orgId: String(nodeData.orgId),
          shapeType: MPSIGNKEY.point // 缩微图形态(枚举: 1,2,3枚举备注: 点位 自定义区域 线)
        }
        resource.place = this.nowMapPlace
        resource.place === MAPTYPENUMBER.lc && (resource.floorId = this.indoorInformation.id) // 获取楼层id
        resource.place === MAPTYPENUMBER.hj && (resource.envId = this.environmentalScienceInformation.id) // 获取环境平面图id
        // 重点部位类型
        if (nodeData.keyPartType === KEYPARTTYPEORG.businessOutlets) {
          // 营业网点
          resourceArr = this.businessOutletsResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.vault) {
          // 金库
          resourceArr = this.vaultResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.computerRoom) {
          // 计算机房
          resourceArr = this.computerRoomResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.officeBuilding) {
          // 办公楼
          resourceArr = this.officeBuildingResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.selfServiceBank) {
          // 自助银行
          resourceArr = this.selfServiceBankResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.selfServiceEquipment) {
          // 自助设备
          resourceArr = this.selfServiceEquipmentResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.selfServiceSilver) {
          // 自助银亭
          resourceArr = this.selfServiceSilverResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.privateBank) {
          // 私人银行
          resourceArr = this.privateBankResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.safeDeposit) {
          // 保险箱库
          resourceArr = this.safeDepositResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.archivesCenter) {
          // 档案室
          resourceArr = this.archivesCenterResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.remoteControlCenter) {
          // 远程监控中心
          resourceArr = this.remoteControlCenterResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.fiveGSmartBanking) {
          // 5G + 智能银行
          resourceArr = this.fiveGSmartBankingResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.fortuneCenter) {
          // 财富中心
          resourceArr = this.fortuneCenterResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.otherKeyParts) {
          // 其他重点部位
          resourceArr = this.otherKeyPartsResource
        } else if (nodeData.keyPartType === KEYPARTTYPEORG.xuni) {
          // 虚拟重点部位
          resourceArr = this.xuniResource
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
    addImportPartFeature(cood) {
      const zoom = window.$context2D.map.getView().getZoom()
      let typeIndex = this.constructAddedData(this.selectedTreeNode, cood, zoom)
      let { resource, resourceArr } = typeIndex
      const resourceType = this.macthKeyPartsInfos(resource.type, resource.subType).keyPartsType
      // 如果添加微//// 图则不在调用添加接口
      resource.subType = resource.subType.toString()
      this.addMapCommonResourcePoint(resource)
        .then(res => {
          resource.id = res.data.id
          let arr = resourceArr ? JSON.parse(JSON.stringify(resourceArr)) : []
          arr.push(resource)
          this.setRefreshTreeList(true) // 刷新机构重点部位树
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
    },
    // 显示或隐藏图层 机构
    loadHeadOffice() {
      this.controlSubKeyPartsIcons(DEVICETYPE.org, KEYPARTTYPE.headLevel, this.isHeadOffice)
    },
    loadTierOneBranch() {
      this.controlSubKeyPartsIcons(DEVICETYPE.org, KEYPARTTYPE.oneLevel, this.isTierOneBranch)
    },
    loadSecondLevelBranch() {
      this.controlSubKeyPartsIcons(DEVICETYPE.org, KEYPARTTYPE.twoLevel, this.isSecondLevelBranch)
    },
    loadCountyLevel() {
      this.controlSubKeyPartsIcons(DEVICETYPE.org, KEYPARTTYPE.countyLevel, this.isCountyLevel)
    },
    loadDirectlyLevel() {
      this.controlSubKeyPartsIcons(DEVICETYPE.org, KEYPARTTYPE.directlyLevel, this.isDirectlyLevel)
    },
    // 显示或隐藏图层 重点部位
    loadBusinessOutlets() {
      // 营业网点
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.businessOutlets, this.isBusinessOutlets)
    },
    // 金库
    loadVault() {
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.vault, this.isVault)
    },
    loadComputerRoom() {
      // 计算机房
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.computerRoom, this.isComputerRoom)
    },
    loadOfficeBuilding() {
      // 办公楼
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.officeBuilding, this.isCfficeBuilding)
    },
    loadSelfServiceBank() {
      // 自助银行
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.selfServiceBank, this.isSelfServiceBank)
    },

    loadSelfServiceEquipment() {
      // 自助设备
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.selfServiceEquipment, this.isSelfServiceEquipment)
    },
    loadSelfServiceSilver() {
      // 自助银亭
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.selfServiceSilver, this.isSelfServiceSilver)
    },
    loadPrivateBank() {
      // 私人银行
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.privateBank, this.isPrivateBank)
    },
    loadSafeDeposit() {
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.safeDeposit, this.isSafeDeposit)
    },
    loadArchivesCenter() {
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.archivesCenter, this.isArchivesCenter)
    },
    loadRemoteControlCenter() {
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.remoteControlCenter, this.isRemoteControlCenter)
    },
    loadFiveGSmartBanking() {
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.fiveGSmartBanking, this.isFiveGSmartBanking)
    },
    loadFortuneCenter() {
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.fortuneCenter, this.isFortuneCenter)
    },
    loadOtherKeyParts() {
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.otherKeyParts, this.isOtherKeyParts)
    },
    loadXuni() {
      this.controlSubKeyPartsIcons(DEVICETYPE.keyPart, KEYPARTTYPEORG.xuni, this.isXuni)
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
      if (type === DEVICETYPE.org) {
        // 机构
        // 机构* 1-总行、2-  一级分行、3- 二级分行、4- 直管行、5- 县级行
        if (subType === KEYPARTTYPE.headLevel) {
          iconType = 'headOfficeDraw'
        } else if (subType === KEYPARTTYPE.oneLevel) {
          iconType = 'tierOneBranchDraw'
        } else if (subType === KEYPARTTYPE.twoLevel) {
          iconType = 'secondLevelBranchDraw'
        } else if (subType === KEYPARTTYPE.countyLevel) {
          iconType = 'countyLevelDraw'
        } else if (subType === KEYPARTTYPE.directlyLevel) {
          iconType = 'directlyBranchDraw'
        }
      } else if (type === DEVICETYPE.keyPart) {
        // 重点部位类型
        if (subType === KEYPARTTYPEORG.businessOutlets) {
          // 营业网点
          iconType = 'businessOutletsDraw'
        } else if (subType === KEYPARTTYPEORG.vault) {
          // 金库
          iconType = 'vaultDraw'
        } else if (subType === KEYPARTTYPEORG.computerRoom) {
          // 计算机房
          iconType = 'computerRoomDraw'
        } else if (subType === KEYPARTTYPEORG.officeBuilding) {
          // 办公楼
          iconType = 'officeBuildingDraw'
        } else if (subType === KEYPARTTYPEORG.selfServiceBank) {
          // 自助银行
          iconType = 'selfServiceBankDraw'
        } else if (subType === KEYPARTTYPEORG.selfServiceEquipment) {
          // 自助设备
          iconType = 'selfServiceEquipmentDraw'
        } else if (subType === KEYPARTTYPEORG.selfServiceSilver) {
          // 自助银亭
          iconType = 'selfServiceSilverDraw'
        } else if (subType === KEYPARTTYPEORG.privateBank) {
          // 私人银行
          iconType = 'privateBankrDraw'
        } else if (subType === KEYPARTTYPEORG.safeDeposit) {
          // 保险箱库
          iconType = 'safeDepositDraw'
        } else if (subType === KEYPARTTYPEORG.archivesCenter) {
          // 档案室
          iconType = 'archivesCenterDraw'
        } else if (subType === KEYPARTTYPEORG.remoteControlCenter) {
          // 远程监控中心
          iconType = 'remoteControlCenterDraw'
        } else if (subType === KEYPARTTYPEORG.fiveGSmartBanking) {
          // 5G + 智能银行
          iconType = 'fiveGSmartBankingDraw'
        } else if (subType === KEYPARTTYPEORG.fortuneCenter) {
          // 财富中心
          iconType = 'fortuneCenterDraw'
        } else if (subType === KEYPARTTYPEORG.otherKeyParts) {
          // 其他重点部位
          iconType = 'otherKeyPartsDraw'
        } else if (subType === KEYPARTTYPEORG.xuni) {
          // 虚拟重点部位
          iconType = 'xuniDraw'
        }
      }
      return iconType
    }
  }
}
