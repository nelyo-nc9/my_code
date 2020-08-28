// 摄像机图层
import layerConfig from 'assets/2DMap/meta/layer'
import {
  cloneDeep
} from 'lodash'
import {
  VIDEOTYPEKEY,
  FEATURETYPE,
  TREENODETYPE,
  ALARMDEVICETYPE,
  MAPTYPENUMBER
} from 'assets/2DMap/meta/common'
import videoTrans from 'assets/2DMap/feature/edit/video'
import {
  mapState,
  mapActions
} from 'vuex'
import {
  DEVICETYPE,
  MPSIGNKEY
} from '../../../../assets/2DMap/meta/common'
import { pointTypeData } from 'assets/2DMap/meta/pointType'

export default {
  data() {
    return {
      videoRecorderLayer: layerConfig.videoRecorderIcon, // 视频主机

      boltipcLayer: layerConfig.boltipcIcon, // 枪机
      boltipcSectorLayer: layerConfig.boltipcSector, // 枪机可视域
      redBoltipcLayer: layerConfig.redBoltipcIcon, // 红外枪机
      redBoltipcSectorLayer: layerConfig.redBoltipcSector, // 红外枪机可视域
      halfBallipcLayer: layerConfig.halfBallipcIcon, // 半球
      halfBallipcSectorLayer: layerConfig.halfBallipcSector, // 半球可视域
      fastBallipcLayer: layerConfig.fastBallipcIcon, // 快球
      fastBallipcSectorLayer: layerConfig.fastBallipcSector, // 快球可视域
      allViewipcLayer: layerConfig.allViewipcIcon, // 全景
      allViewipcSectorLayer: layerConfig.allViewipcSector, // 全景可视域
      pinholeipcLayer: layerConfig.pinholeipcIcon, // 针孔
      pinholeipcSectorLayer: layerConfig.pinholeipcSector, // 针孔可视域
      smartIPCLayer: layerConfig.smartIPCIcon, // 智能IPC
      smartIPCSectorLayer: layerConfig.smartIPCSector, // 智能IPC可视域
      // 报警设备
      telAlarmHostLayer: layerConfig.telAlarmHostIcon,
      networkAlarmHostLayer: layerConfig.networkAlarmHostIcon,
      fenceAlarmHostLayer: layerConfig.fenceAlarmHostIcon,
      shakeAlarmHostLayer: layerConfig.shakeAlarmHostIcon,
      wallDetectorLayer: layerConfig.wallDetectorIcon,
      ceilingDetectorLayer: layerConfig.ceilingDetectorIcon,
      atmShakeDetectorLayer: layerConfig.atmShakeDetectorIcon,
      vaultShakeDetectorLayer: layerConfig.vaultShakeDetectorIcon,
      doorMagneticDetectorLayer: layerConfig.doorMagneticDetectorIcon,
      glassBrokenDetectorLayer: layerConfig.glassBrokenDetectorIcon,
      smokeDetectorLayer: layerConfig.smokeDetectorIcon,
      pirCurtainDetectorLayer: layerConfig.pirCurtainDetectorIcon,
      temperatureDetectorLayer: layerConfig.temperatureDetectorIcon,
      leakDetectorLayer: layerConfig.leakDetectorIcon,
      voicedDangerButtonLayer: layerConfig.voicedDangerButtonIcon,
      silentDangerButtonLayer: layerConfig.silentDangerButtonIcon,
      correlationDetectorLayer: layerConfig.correlationDetectorIcon,
      offsetDetectorLayer: layerConfig.offsetDetectorIcon,
      shakeOpticalLayer: layerConfig.shakeOpticalIcon,
      electronicFenceLayer: layerConfig.electronicFenceIcon
    }
  },
  computed: {
    ...mapState({
      isMapOuter: ({
        map2d
      }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({
        map2d
      }) => map2d.mapIndex.floorMap, // 楼内地图对象
      indoorInformation: ({
        map2d
      }) => map2d.mapIndex.indoorInformation, // 最新的室内信息
      environmentalScienceInformation: ({
        map2d
      }) => map2d.mapIndex.environmentalScienceInformation, // 最新的环境平面图信息
      boltipcResource: ({
        map2d
      }) => map2d.mapPoint.boltipcResourceArr, // 枪机 资源数组
      boltipcIcons: ({
        map2d
      }) => map2d.mapPoint.boltipcIconFeatures, // 枪机 点位要素
      boltipcSectors: ({
        map2d
      }) => map2d.mapPoint.boltipcSectorFeatures, // 枪机 可视域要素
      redBoltipcResource: ({
        map2d
      }) => map2d.mapPoint.redBoltipcResourceArr, // 红外枪机 资源数组
      redBoltipcIcons: ({
        map2d
      }) => map2d.mapPoint.redBoltipcIconFeatures, // 红外枪机 点位要素
      redBoltipcSectors: ({
        map2d
      }) => map2d.mapPoint.redBoltipcSectorFeatures, // 红外枪机 可视域要素
      halfBallipcResource: ({
        map2d
      }) => map2d.mapPoint.halfBallipcResourceArr, // 半球 资源数组
      halfBallipcIcons: ({
        map2d
      }) => map2d.mapPoint.halfBallipcIconFeatures, // 半球 点位要素
      halfBallipcSectors: ({
        map2d
      }) => map2d.mapPoint.halfBallipcSectorFeatures, // 半球 可视域要素
      fastBallipcResource: ({
        map2d
      }) => map2d.mapPoint.fastBallipcResourceArr, // 球机 资源数组
      fastBallipcIcons: ({
        map2d
      }) => map2d.mapPoint.fastBallipcIconFeatures, // 球机 点位要素
      fastBallipcSectors: ({
        map2d
      }) => map2d.mapPoint.fastBallipcSectorFeatures, // 球机 可视域要素
      allViewipcResource: ({
        map2d
      }) => map2d.mapPoint.allViewipcResourceArr, // 全景 资源数组
      allViewipcIcons: ({
        map2d
      }) => map2d.mapPoint.allViewipcIconFeatures, // 全景 点位要素
      allViewipcSectors: ({
        map2d
      }) => map2d.mapPoint.allViewipcSectorFeatures, // 全景 可视域要素
      pinholeipcResource: ({
        map2d
      }) => map2d.mapPoint.pinholeipcResourceArr, // 针孔 资源数组
      pinholeipcIcons: ({
        map2d
      }) => map2d.mapPoint.pinholeipcIconFeatures, // 针孔 点位要素
      pinholeipcSectors: ({
        map2d
      }) => map2d.mapPoint.pinholeipcSectorFeatures, // 针孔 可视域要素
      smartIPCResource: ({
        map2d
      }) => map2d.mapPoint.smartIPCResourceArr, // 智能IPC 资源数组
      smartIPCIcons: ({
        map2d
      }) => map2d.mapPoint.smartIPCIconFeatures, // 智能IPC 点位要素
      smartIPCSectors: ({
        map2d
      }) => map2d.mapPoint.smartIPCSectorFeatures, // 智能IPC 可视域要素
      selectedTreeCode: ({
        map2d
      }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      videoTree: ({
        map2d
      }) => map2d.mapPanelSearch.resourceLists['1'], // 资源树
      isBoltipc: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.camera.boltipc.value, // 枪机显隐
      isHalfBallipc: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.camera.halfBallipc.value, // 半球显隐
      isFastBallipc: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.camera.fastBallipc.value, // 快球显隐
      isRedBoltipc: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.camera.redBoltipc.value, // 红外枪机显隐
      isAllViewipc: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.camera.allViewipc.value, // 全景显隐
      isPinholeipc: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.camera.pinhole.value, // 针孔显隐
      isSmartIPC: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.camera.smartIPC.value, // 智能IPC显隐
      isSector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.camera.sector.value, // 可视域显隐
      //
      // 录像机
      videoRecorderResource: ({
        map2d
      }) => map2d.mapPoint.videoRecorderResourceArr, // 录像机 资源数组
      videoRecorderIcons: ({
        map2d
      }) => map2d.mapPoint.videoRecorderIconFeatures, // 录像机 点位要素
      // 录像机显隐
      isVideoRecorder: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.recorder.videoHost.value, // 录像机显隐
      // 报警设备

      telAlarmHostResource: ({
        map2d
      }) => map2d.mapPoint.telAlarmHostResourceArr, // 电话报警主机 资源数组
      telAlarmHostIcons: ({
        map2d
      }) => map2d.mapPoint.telAlarmHostIconFeatures, // 电话报警主机 点位要素
      networkAlarmHostResource: ({
        map2d
      }) => map2d.mapPoint.networkAlarmHostResourceArr, // 网络报警主机 资源数组
      networkAlarmHostIcons: ({
        map2d
      }) => map2d.mapPoint.networkAlarmHostIconFeatures, // 网络报警主机 点位要素
      fenceAlarmHostResource: ({
        map2d
      }) => map2d.mapPoint.fenceAlarmHostResourceArr, // 电子围栏总线报警主机 资源数组
      fenceAlarmHostIcons: ({
        map2d
      }) => map2d.mapPoint.fenceAlarmHostIconFeatures, // 电子围栏总线报警主机 点位要素
      shakeAlarmHostResource: ({
        map2d
      }) => map2d.mapPoint.shakeAlarmHostResourceArr, // 震动光纤报警主机 资源数组
      shakeAlarmHostIcons: ({
        map2d
      }) => map2d.mapPoint.shakeAlarmHostIconFeatures, // 震动光纤报警主机 点位要素
      wallDetectorResource: ({
        map2d
      }) => map2d.mapPoint.wallDetectorResourceArr, // 壁挂双鉴探测器 资源数组
      wallDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.wallDetectorIconFeatures, // 壁挂双鉴探测器 点位要素
      ceilingDetectorResource: ({
        map2d
      }) => map2d.mapPoint.ceilingDetectorResourceArr, // 吸顶双鉴探测器 资源数组
      ceilingDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.ceilingDetectorIconFeatures, // 吸顶双鉴探测器 点位要素
      atmShakeDetectorResource: ({
        map2d
      }) => map2d.mapPoint.atmShakeDetectorResourceArr, // atm震动探测器 资源数组
      atmShakeDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.atmShakeDetectorIconFeatures, // atm震动探测器 点位要素
      vaultShakeDetectorResource: ({
        map2d
      }) => map2d.mapPoint.vaultShakeDetectorResourceArr, // 金库震动探测器 资源数组
      vaultShakeDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.vaultShakeDetectorIconFeatures, // 金库震动探测器 点位要素
      doorMagneticDetectorResource: ({
        map2d
      }) => map2d.mapPoint.doorMagneticDetectorResourceArr, // 门磁探测器 资源数组
      doorMagneticDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.doorMagneticDetectorIconFeatures, // 门磁探测器 点位要素
      glassBrokenDetectorResource: ({
        map2d
      }) => map2d.mapPoint.glassBrokenDetectorResourceArr, // 玻璃破碎探测器 资源数组
      glassBrokenDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.glassBrokenDetectorIconFeatures, // 玻璃破碎探测器 点位要素
      smokeDetectorResource: ({
        map2d
      }) => map2d.mapPoint.smokeDetectorResourceArr, // 光电感烟探测器 资源数组
      smokeDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.smokeDetectorIconFeatures, // 光电感烟探测器 点位要素
      pirCurtainDetectorResource: ({
        map2d
      }) => map2d.mapPoint.pirCurtainDetectorResourceArr, // 红外幕帘探测器(入侵) 资源数组
      pirCurtainDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.pirCurtainDetectorIconFeatures, // 红外幕帘探测器(入侵) 点位要素
      temperatureDetectorResource: ({
        map2d
      }) => map2d.mapPoint.temperatureDetectorResourceArr, // 温度探测器 资源数组
      temperatureDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.temperatureDetectorIconFeatures, // 温度探测器 点位要素
      leakDetectorResource: ({
        map2d
      }) => map2d.mapPoint.leakDetectorResourceArr, // 漏水探测器 资源数组
      leakDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.leakDetectorIconFeatures, // 漏水探测器 点位要素
      voicedDangerButtonResource: ({
        map2d
      }) => map2d.mapPoint.voicedDangerButtonResourceArr, // 紧急按钮(有声) 资源数组
      voicedDangerButtonIcons: ({
        map2d
      }) => map2d.mapPoint.voicedDangerButtonIconFeatures, // 紧急按钮(有声) 点位要素
      silentDangerButtonResource: ({
        map2d
      }) => map2d.mapPoint.silentDangerButtonResourceArr, // 紧急按钮(无声) 资源数组
      silentDangerButtonIcons: ({
        map2d
      }) => map2d.mapPoint.silentDangerButtonIconFeatures, // 紧急按钮(无声) 点位要素
      correlationDetectorResource: ({
        map2d
      }) => map2d.mapPoint.correlationDetectorResourceArr, // 红外对射探测器 资源数组
      correlationDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.correlationDetectorIconFeatures, // 红外对射探测器 点位要素
      offsetDetectorResource: ({
        map2d
      }) => map2d.mapPoint.offsetDetectorResourceArr, // 位移探测器 资源数组
      offsetDetectorIcons: ({
        map2d
      }) => map2d.mapPoint.offsetDetectorIconFeatures, // 位移探测器 点位要素
      shakeOpticalResource: ({
        map2d
      }) => map2d.mapPoint.shakeOpticalResourceArr, // 振动光纤 资源数组
      shakeOpticalIcons: ({
        map2d
      }) => map2d.mapPoint.shakeOpticalIconFeatures, // 振动光纤 点位要素
      electronicFenceResource: ({
        map2d
      }) => map2d.mapPoint.electronicFenceResourceArr, // 电子围栏 资源数组
      electronicFenceIcons: ({
        map2d
      }) => map2d.mapPoint.electronicFenceIconFeatures, // 电子围栏 点位要素
      // 报警显隐
      isTelAlarmHost: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.telAlarmHost.value, // 电话报警主机 显隐
      isNetworkAlarmHost: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.networkAlarmHost.value, // 网络报警主机 显隐
      isFenceAlarmHost: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.fenceAlarmHost.value, // 电子围栏总线报警主机 显隐
      isShakeAlarmHost: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.shakeAlarmHost.value, // 震动光纤报警主机 显隐
      isWallDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.wallDetector.value, // 壁挂双鉴探测器 显隐
      isCeilingDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.ceilingDetector.value, // 吸顶双鉴探测器 显隐
      isAtmShakeDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.atmShakeDetector.value, // atm震动探测器 显隐
      isVaultShakeDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.vaultShakeDetector.value, // 金库震动探测器 显隐
      isDoorMagneticDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.doorMagneticDetector.value, // 门磁探测器 显隐
      isGlassBrokenDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.glassBrokenDetector.value, // 玻璃破碎探测器 显隐
      isSmokeDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.smokeDetector.value, // 光电感烟探测器 显隐
      isPirCurtainDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.pirCurtainDetector.value, // 红外幕帘探测器(入侵) 显隐
      isTemperatureDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.temperatureDetector.value, // 温度探测器 显隐
      isLeakDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.leakDetector.value, // 漏水探测器 显隐
      isVoicedDangerButton: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.voicedDangerButton.value, // 紧急按钮(有声) 显隐
      isSilentDangerButton: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.silentDangerButton.value, // 紧急按钮(无声) 显隐
      isCorrelationDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.correlationDetector.value, // 红外对射探测器 显隐
      isOffsetDetector: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.offsetDetector.value, // 位移探测器 显隐
      isShakeOptical: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.shakeOptical.value, // 振动光纤 显隐
      isElectronicFence: ({
        map2d
      }) => map2d.mapIndex.checkedEquipments.alarm.electronicFence.value, // 电子围栏 显隐
      // 用于激活点位不受显隐性控制的变量
      curSelectResourcePoint: ({
        map2d
      }) => map2d.mapPoint.curSelectResourcePoint, // 当前的选择点
      editActive: ({
        map2d
      }) => map2d.mapPoint.editActive // 当前的激活状态
    })
  },
  mounted() {},
  watch: {
    boltipcResource: {
      handler() {
        this.loadBoltipc()
      },
      deep: true
    },
    redBoltipcResource: {
      handler() {
        this.loadRedBoltipc()
      },
      deep: true
    },
    halfBallipcResource: {
      handler() {
        this.loadHalfBallipc()
      },
      deep: true
    },
    fastBallipcResource: {
      handler() {
        this.loadFastBallipc()
      },
      deep: true
    },
    allViewipcResource: {
      handler() {
        this.loadAllViewipc()
      },
      deep: true
    },
    pinholeipcResource: {
      handler() {
        this.loadPinholeipc()
      },
      deep: true
    },
    smartIPCResource: {
      handler() {
        this.loadSmartipc()
      },
      deep: true
    },
    videoRecorderResource: {
      handler() {
        this.loadvideoRecorder()
      },
      deep: true
    },
    // 报警设备

    telAlarmHostResource: {
      handler() {
        this.loadTelAlarmHost()
      },
      deep: true
    },
    networkAlarmHostResource: {
      handler() {
        this.loadNetworkAlarmHost()
      },
      deep: true
    },
    fenceAlarmHostResource: {
      handler() {
        this.loadFenceAlarmHost()
      },
      deep: true
    },
    shakeAlarmHostResource: {
      handler() {
        this.loadShakeAlarmHost()
      },
      deep: true
    },
    wallDetectorResource: {
      handler() {
        this.loadWallDetector()
      },
      deep: true
    },
    ceilingDetectorResource: {
      handler() {
        this.loadCeilingDetector()
      },
      deep: true
    },
    atmShakeDetectorResource: {
      handler() {
        this.loadAtmShakeDetector()
      },
      deep: true
    },
    vaultShakeDetectorResource: {
      handler() {
        this.loadVaultShakeDetector()
      },
      deep: true
    },
    doorMagneticDetectorResource: {
      handler() {
        this.loadDoorMagneticDetector()
      },
      deep: true
    },
    glassBrokenDetectorResource: {
      handler() {
        this.loadGlassBrokenDetector()
      },
      deep: true
    },
    smokeDetectorResource: {
      handler() {
        this.loadSmokeDetector()
      },
      deep: true
    },
    pirCurtainDetectorResource: {
      handler() {
        this.loadPirCurtainDetector()
      },
      deep: true
    },
    temperatureDetectorResource: {
      handler() {
        this.loadTemperatureDetector()
      },
      deep: true
    },
    leakDetectorResource: {
      handler() {
        this.loadLeakDetector()
      },
      deep: true
    },
    voicedDangerButtonResource: {
      handler() {
        this.loadVoicedDangerButton()
      },
      deep: true
    },
    silentDangerButtonResource: {
      handler() {
        this.loadSilentDangerButton()
      },
      deep: true
    },

    correlationDetectorResource: {
      handler() {
        this.loadCorrelationDetector()
      },
      deep: true
    },
    offsetDetectorResource: {
      handler() {
        this.loadOffsetDetector()
      },
      deep: true
    },
    shakeOpticalResource: {
      handler() {
        this.loadShakeOptical()
      },
      deep: true
    },
    electronicFenceResource: {
      handler() {
        this.loadElectronicFence()
      },
      deep: true
    },
    //
    isBoltipc() {
      this.loadBoltipc()
    },
    isRedBoltipc() {
      this.loadRedBoltipc()
    },
    isHalfBallipc() {
      this.loadHalfBallipc()
    },
    isFastBallipc() {
      this.loadFastBallipc()
    },
    isAllViewipc() {
      this.loadAllViewipc()
    },
    isPinholeipc() {
      this.loadPinholeipc()
    },
    isSmartIPC() {
      this.loadSmartipc()
    },

    //
    isVideoRecorder() {
      this.loadvideoRecorder()
    },
    // 报警设备
    isTelAlarmHost() {
      this.loadTelAlarmHost()
    },
    isNetworkAlarmHost() {
      this.loadNetworkAlarmHost()
    },
    isFenceAlarmHost() {
      this.loadFenceAlarmHost()
    },
    isShakeAlarmHost() {
      this.loadShakeAlarmHost()
    },
    isWallDetector() {
      //
      this.loadWallDetector()
    },
    isCeilingDetector() {
      this.loadCeilingDetector()
    },
    isAtmShakeDetector() {
      this.loadAtmShakeDetector()
    },
    isVaultShakeDetector() {
      this.loadVaultShakeDetector()
    },
    isDoorMagneticDetector() {
      this.loadDoorMagneticDetector()
    },
    isGlassBrokenDetector() {
      this.loadGlassBrokenDetector()
    },
    isSmokeDetector() {
      this.loadSmokeDetector()
    },
    isPirCurtainDetector() {
      this.loadPirCurtainDetector()
    },
    isTemperatureDetector() {
      this.loadTemperatureDetector()
    },
    isLeakDetector() {
      this.loadLeakDetector()
    },
    isVoicedDangerButton() {
      this.loadVoicedDangerButton()
    },
    isSilentDangerButton() {
      this.loadSilentDangerButton()
    },
    isCorrelationDetector() {
      this.loadCorrelationDetector()
    },
    isOffsetDetector() {
      this.loadOffsetDetector()
    },
    isShakeOptical() {
      this.loadShakeOptical()
    },
    isElectronicFence() {
      this.loadElectronicFence()
    },
    //

    isSector() {
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.boltipc, this.isBoltipc && this.isSector)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.redBoltipc, this.isRedBoltipc && this.isSector)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.halfBallipc, this.isHalfBallipc && this.isSector)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.fastBallipc, this.isFastBallipc && this.isSector)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.allViewipc, this.isAllViewipc && this.isSector)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.pinholeipc, this.isPinholeipc && this.isSector)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.smartIPC, this.isSmartIPC && this.isSector)
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
    ...mapActions('map2d/mapIndex', ['setRefreshTreeList']),
    ...mapActions('map2d/mapIndex', ['setRefreshTreeListBox']), // 刷新机构重点部位树
    /**
     * 定位并显示选中机构/重点部位点位数据
     * @param {*} data 点位数据
     */
    showKeyPartPointFeature_video(data) {
      let point = cloneDeep(data)
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let {
        type,
        subType
      } = point // 获取到点位大类+子类数据
      let subKeyPartsInfos = this.macthVideoInfos_video(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (!subKeyPartsInfos.pointVisible) {
        // 点位隐藏时
        subKeyPartsInfos.resource = [point] // 将选中的点位数据添加到相应点位资源数组中
        this.loadSubVideoFeatures_video(subKeyPartsInfos, FEATURETYPE.icon, type, subType) // 构造点位数据
      }
    },
    /**
     * 设置机构 图标 要素
     * @param {*} subKeyPartsInfos 方法macthKeyPartsInfos的返回值
     * @param {*} featureType 要素类型
     */
    loadSubKeyPartsFeatures_video(subKeyPartsInfos, featureType) {
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
      setFeaturesFun({
        type: subKeyPartsInfos.pointType,
        features: features
      })
    },
    /**
     * 刷线当前的机构或重点部位
     * @param {*} data 点位数据
     */
    refreshCurrentKeyPartFeature_video(data) {
      console.log('刷线当前的设备资源数据', data)
      let point = cloneDeep(data)
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let {
        type,
        subType
      } = point // 获取到点位大类+子类数据
      let keyPartsInfos = this.macthVideoInfos_video(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (keyPartsInfos.pointVisible) {
        // 点位显示时
        let features = cloneDeep(keyPartsInfos.features)
        features = features.filter(item => item.attributes.id !== point.id) // 过滤掉当前点位数据
        // 获取点位数据
        this.getCommonResourceById(point.id).then(res => {
          if (res && Number(res.code) === 0 && res.data) {
            let feature = videoTrans.transOneIconFeature(res.data, keyPartsInfos.featureLayer)
            feature && features.push(feature)
            this.setPointIconFeatures({
              type: keyPartsInfos.pointType,
              features
            })
          }
        })
      } else {
        // 点位隐藏时
        this.setPointIconFeatures({
          type: keyPartsInfos.pointType,
          features: []
        })
      }
    },
    /**
     * 定位并显示选中机构/重点部位点位数据
     * @param {*} data 点位数据
     */
    locateAndShowKeyPartPoint_video(data) {
      let point = cloneDeep(data)
      point.subType = Number(point.subType) // 强制类型转换（接口返回的数据可能是字符串，我们前端定义的是数字类型）
      let {
        type,
        subType
      } = point // 获取到点位大类+子类数据
      let subKeyPartsInfos = this.macthVideoInfos_video(type, subType, FEATURETYPE.icon) //  // 根据点位大类+子类获取到需要的信息（pointVisible: 对应点位是否显示， resource：点位数据数组，featureLayer：对应点位的图层，keyPartsType：点位的名称前缀如：机构 总行 headLevel）
      if (!subKeyPartsInfos.pointVisible) {
        // 点位隐藏时
        subKeyPartsInfos.resource = [point] // 将选中的点位数据添加到相应点位资源数组中
        this.loadSubKeyPartsFeatures_video(subKeyPartsInfos, FEATURETYPE.icon) // 构造点位数据
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
    macthVideoInfos_video(type, subType, featureType) {
      let setFeaturesFun
      let featureArr = []
      let resourceArr = []
      let featureLayer
      let pointVisible = false
      let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
      let pointTypeValue = pointTypeData[pointTypeKey]
      // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
      setFeaturesFun = this.setPointIconFeatures
      if (pointTypeValue) {
        pointVisible = this['is' + this.firstToUpper(pointTypeValue)]
        resourceArr = this[pointTypeValue + 'Resource']
        featureArr = this[pointTypeValue + 'Icons']
        featureLayer = this[pointTypeValue + 'Layer']
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
    loadSubVideoFeatures_video(subVideoInfos, featureType, type, subType) {
      // 匹配视频子类型资源数据
      const resourceArr = subVideoInfos.resource
      // 匹配视频子类型名称图层
      const featureLayer = subVideoInfos.featureLayer
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
        features = videoTrans.transIconFeatures(resourceArrCp, featureLayer)
      } else if (featureType === FEATURETYPE.geometry) {
        features = videoTrans.transSectorFeatures(resourceArrCp, featureLayer)
      }
      // 匹配视频子类型要素设置函数
      const setFeaturesFun = subVideoInfos.fun
      setFeaturesFun({
        type: subVideoInfos.pointType,
        features: features
      })
      return {
        features
      }
    },
    /**
     * 显示/隐藏 某一类的摄像机 图标要素
     * @param {*} monitortype 设备类型 key值
     * @param {*} iconVisible 图层显隐
     */
    controlSubVideoIcons_video(type, monitortype, iconVisible) {
      const subVideoInfos = this.macthVideoInfos_video(type, monitortype, FEATURETYPE.icon)
      if (iconVisible) {
        this.loadSubVideoFeatures_video(subVideoInfos, FEATURETYPE.icon, type, monitortype)
      } else {
        const setFeaturesFun = subVideoInfos.fun
        // 留下当前的激活点图标
        let featuresAll = subVideoInfos.features
        if (this.curSelectResourcePoint) {
          featuresAll = featuresAll.filter(item => {
            return item.attributes.id === this.curSelectResourcePoint.id
          })
        } else {
          featuresAll = []
        }
        setFeaturesFun({
          type: subVideoInfos.pointType,
          features: featuresAll
        })
      }
    },
    /**
     * 显示/隐藏 某一类的摄像机 可视域要素
     * @param {*} monitortype 设备类型 key值
     * @param {*} iconVisible 图层显隐
     */
    controlSubVideoSectors_video(type, monitortype, iconVisible) {
      const subVideoInfos = this.macthVideoInfos_video(type, monitortype, FEATURETYPE.geometry)
      if (iconVisible) {
        this.loadSubVideoFeatures_video(subVideoInfos, FEATURETYPE.geometry, type, monitortype, type, monitortype)
      } else {
        const setFeaturesFun = subVideoInfos.fun
        // 留下当前的激活点图标
        let featuresAll = subVideoInfos.features
        if (this.curSelectResourcePoint) {
          featuresAll = featuresAll.filter(item => {
            return item.attributes.id === this.curSelectResourcePoint.id
          })
        } else {
          featuresAll = []
        }
        setFeaturesFun({
          type: subVideoInfos.pointType,
          features: featuresAll
        })
      }
    },
    /**
     * 地图加载完成后，获取相应的摄像机
     */
    loadVideoResources_video() {
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
    loadQuerySubVideos_video(monitortype) {
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
    constructAddedData_video(selectedTreeCode, cood, zoom) {
      let resource // 待添加的点位数据
      let resourceArr // 已有的点位数据数组
      selectedTreeCode.pointSubType = Number(selectedTreeCode.pointSubType)
      if (selectedTreeCode.tierType === TREENODETYPE.res || selectedTreeCode.tierType === TREENODETYPE.equ) {
        let {pointType, pointSubType} = selectedTreeCode
        resource = {
          name: selectedTreeCode.name,
          type: pointType, // 类型 设备大类
          subType: String(pointSubType), // number 必须 子类型 设备子类
          coordinate: cood.join(','), // 坐标,
          // orgId: String(selectedTreeCode.id), // string 必须 机构id
          level: Math.ceil(zoom), // 可见层级
          // keyPartId: String(selectedTreeCode.id) // string 必须 机构id
          id: selectedTreeCode.id,
          resourceId: selectedTreeCode['resourceId'],
          deviceId: selectedTreeCode['deviceId'],
          floorId: selectedTreeCode['floorId'],
          keyPartId: selectedTreeCode['keyPartId'],
          orgId: selectedTreeCode['orgId']
        }
        resource.place = this.nowMapPlace
        resource.place === MAPTYPENUMBER.lc && (resource.floorId = this.indoorInformation.id) // 获取楼层id
        resource.place === MAPTYPENUMBER.hj && (resource.envId = this.environmentalScienceInformation.id) // 获取环境平面图id
        if (selectedTreeCode.pointType === DEVICETYPE.videoHost) { // 录像机
          resourceArr = this.videoRecorderResource
        } else {
          let pointTypeKey = pointType === DEVICETYPE.videoHost ? `${pointType}` : `${pointType}-${pointSubType}`
          let pointTypeValue = pointTypeData[pointTypeKey]
          // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
          if (pointTypeValue && this[pointTypeValue + 'Resource']) {
            resourceArr = cloneDeep(this[pointTypeValue + 'Resource'])
          }
        }
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
    addResourceFeature_video(cood) {
      if (this.selectedTreeCode) {
        const zoom = window.$context2D.map.getView().getZoom()
        let typeIndex = this.constructAddedData_video(cloneDeep(this.selectedTreeCode), cood, zoom)
        let { resource, resourceArr } = typeIndex
        let {type, subType} = resource
        let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
        let pointTypeValue = pointTypeData[pointTypeKey]
        // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
        // 添加资源要携带资源id -shen
        resource.resourceId = this.selectedTreeCode.id
        resource.shapeType = MPSIGNKEY.point
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
            this.setPointResourceByType({
              type: pointTypeValue,
              arr: arr
            })
          })
          .catch(err => {
            console.log('添加成功', err)
            this.$notify({ title: '警告',
              message: '添加失败',
              type: 'warning'})
          })
      }
    },
    /**
     * 添加录像机点位
     * @param {*} cood 坐标
     */
    addDeviceFeature_video(cood) {
      if (this.selectedTreeCode) {
        const zoom = window.$context2D.map.getView().getZoom()
        let typeIndex = this.constructAddedData_video(cloneDeep(this.selectedTreeCode), cood, zoom)
        let { resource, resourceArr } = typeIndex
        let {type, subType} = resource
        let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
        let pointTypeValue = pointTypeData[pointTypeKey]
        // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
        resource.deviceId = this.selectedTreeCode.id
        resource.shapeType = MPSIGNKEY.point // 必须
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
        // gis区分 添加在什么类型的地图上 1-GIS地图 2-环境平面图 3-楼层平面图
        this.addMapCommonResourcePoint(resource)
          .then(res => {
            resource.id = res.data.id
            let arr = cloneDeep(resourceArr)
            arr.push(resource)
            // this.setRefreshTreeList(true) //
            this.setRefreshTreeListBox(true) // 刷新机构重点部位树
            this.$notify({
              message: '添加成功',
              type: 'success'
            })
            this.setPointResourceByType({
              type: pointTypeValue,
              arr: arr
            })
          })
          .catch(err => console.log(err))
      }
    },
    /**
     * 添加摄像机点位
     * @param {*} cood 坐标
     */
    addVideoFeature_video(cood) {
      if (this.selectedTreeCode) {
        const zoom = window.$context2D.map.getView().getZoom()
        let typeIndex = this.constructAddedData_video(cloneDeep(this.selectedTreeCode), cood, zoom)
        let { resource, resourceArr } = typeIndex
        let {type, subType} = resource
        let pointTypeKey = type === DEVICETYPE.videoHost ? `${type}` : `${type}-${subType}`
        let pointTypeValue = pointTypeData[pointTypeKey]
        // console.log(`pointTypeKey: ${pointTypeKey}, pointTypeValue: ${pointTypeValue}`)
        // 添加摄像头的同时，同时设置可视域的3个参数
        resource.radiation = 50 // 照射半径 //50 方便开发更改此处 -shen
        resource.viewshedAngle = 0 // 朝向
        resource.viewshed = 90 // 覆盖角度
        // 添加资源要携带资源id -shen
        resource.resourceId = this.selectedTreeCode.id
        resource.shapeType = MPSIGNKEY.point
        resource.place = this.nowMapPlace
        resource.place === MAPTYPENUMBER.lc && (resource.floorId = this.indoorInformation.id) // 获取楼层id
        resource.place === MAPTYPENUMBER.hj && (resource.envId = this.environmentalScienceInformation.id) // 获取环境平面图id
        delete resource.id // 删除id
        // console.log('摄像机信息', this.selectedTreeCode)
        // gis区分 添加在什么类型的地图上 1-GIS地图 2-环境平面图 3-楼层平面图
        // console.log('添加摄像头', JSON.stringify(resource))
        this.addMapCommonResourcePoint(resource)
          .then(res => {
            resource.id = res.data.id
            let arr = cloneDeep(resourceArr)
            arr.push(resource)
            // this.setRefreshTreeList(true) // 刷新机构重点部位树
            this.setRefreshTreeListBox(true) // 刷新机构重点部位树
            this.$notify({
              message: '添加成功',
              type: 'success'
            })

            this.setPointResourceByType({
              type: pointTypeValue,
              arr: arr
            })
          })
          .catch(err => console.log(err))
      }
    },
    // 显示或隐藏图层
    loadBoltipc() {
      this.controlSubVideoIcons_video(DEVICETYPE.video, VIDEOTYPEKEY.boltipc, this.isBoltipc)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.boltipc, this.isBoltipc && this.isSector)
    },
    loadRedBoltipc() {
      this.controlSubVideoIcons_video(DEVICETYPE.video, VIDEOTYPEKEY.redBoltipc, this.isRedBoltipc)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.redBoltipc, this.isRedBoltipc && this.isSector)
    },
    loadHalfBallipc() {
      this.controlSubVideoIcons_video(DEVICETYPE.video, VIDEOTYPEKEY.halfBallipc, this.isHalfBallipc)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.halfBallipc, this.isHalfBallipc && this.isSector)
    },
    loadFastBallipc() {
      this.controlSubVideoIcons_video(DEVICETYPE.video, VIDEOTYPEKEY.fastBallipc, this.isFastBallipc)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.fastBallipc, this.isFastBallipc && this.isSector)
    },
    loadAllViewipc() {
      this.controlSubVideoIcons_video(DEVICETYPE.video, VIDEOTYPEKEY.allViewipc, this.isAllViewipc)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.allViewipc, this.isAllViewipc && this.isSector)
    },
    loadPinholeipc() {
      this.controlSubVideoIcons_video(DEVICETYPE.video, VIDEOTYPEKEY.pinholeipc, this.isPinholeipc)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.pinholeipc, this.isPinholeipc && this.isSector)
    },
    loadSmartipc() {
      this.controlSubVideoIcons_video(DEVICETYPE.video, VIDEOTYPEKEY.smartIPC, this.isSmartIPC)
      this.controlSubVideoSectors_video(DEVICETYPE.video, VIDEOTYPEKEY.smartIPC, this.isSmartIPC && this.isSector)
    },
    // 录像机
    loadvideoRecorder() {
      this.controlSubVideoIcons_video(DEVICETYPE.videoHost, 1, this.isVideoRecorder)
    },
    //

    // // 报警设备子类
    // const ALARMDEVICETYPE = {
    //   telephoneHost: 1, // 电话报警主机
    //   networkHost: 2, // 网络报警主机
    //   eleFenceBusHost: 3, // 电子围栏总线报警主机
    //   vibrationFiberHost: 4, // 震动光纤报警主机
    //   wallMountedDualDetector: 5, // 壁挂双鉴探测器
    //   ceilingDoubleDetector: 6, // 吸顶双鉴探测器
    //   atmShockDetector: 7, // atm震动探测器
    //   treasuryVibrationDetector: 8, // 金库震动探测器
    //   doorMagneticDetector: 9, // 门磁探测器
    //   glassBreakDetector: 10, // 玻璃破碎探测器
    //   photoelectricSmokeDetector: 11, // 光电感烟探测器
    //   infraredCurtainDetectorIntrusion: 12, // 红外幕帘探测器(入侵)
    //   temperatureDetector: 13, // 温度探测器
    //   waterLeakDetector: 14, // 漏水探测器
    //   emergencyButtonWithSound: 15, // 紧急按钮(有声)
    //   emergencyButtonSilent: 16, // 紧急按钮(无声)
    //   infraredDetector: 17, // 红外对射探测器
    //   displacementDetector: 18, // 位移探测器
    //   vibratingFiber: 19, // 振动光纤
    //   electricFence: 20 // 电子围栏
    // }

    loadTelAlarmHost() {
      //
      this.controlSubVideoIcons_video(DEVICETYPE.alarmDevice, ALARMDEVICETYPE.telephoneHost, this.isTelAlarmHost) // 电话报警主机
    },
    loadNetworkAlarmHost() {
      //
      this.controlSubVideoIcons_video(DEVICETYPE.alarmDevice, ALARMDEVICETYPE.networkHost, this.isNetworkAlarmHost) // 网络报警主机
    },
    loadFenceAlarmHost() {
      this.controlSubVideoIcons_video(DEVICETYPE.alarmDevice, ALARMDEVICETYPE.eleFenceBusHost, this.isFenceAlarmHost) // 电子围栏总线报警主机
    },
    loadShakeAlarmHost() {
      this.controlSubVideoIcons_video(DEVICETYPE.alarmDevice, ALARMDEVICETYPE.vibrationFiberHost, this.isShakeAlarmHost) // 震动光纤报警主机
    },
    loadWallDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.wallMountedDualDetector,
        this.isWallDetector
      ) // 壁挂双鉴探测器
    },
    loadCeilingDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.ceilingDoubleDetector,
        this.isCeilingDetector
      ) // 吸顶双鉴探测器
    },
    loadAtmShakeDetector() {
      this.controlSubVideoIcons_video(DEVICETYPE.alarmDevice, ALARMDEVICETYPE.atmShockDetector, this.isAtmShakeDetector) // atm震动探测器
    },

    loadVaultShakeDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.treasuryVibrationDetector,
        this.isVaultShakeDetector
      ) // 金库震动探测器
    },
    loadDoorMagneticDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.doorMagneticDetector,
        this.isDoorMagneticDetector
      ) // 门磁探测器
    },
    loadGlassBrokenDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.glassBreakDetector,
        this.isGlassBrokenDetector
      ) // 玻璃破碎探测器
    },
    loadSmokeDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.photoelectricSmokeDetector,
        this.isSmokeDetector
      ) // 光电感烟探测器
    },
    loadPirCurtainDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.infraredCurtainDetectorIntrusion,
        this.isPirCurtainDetector
      ) // 红外幕帘探测器(入侵)
    },

    loadTemperatureDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.temperatureDetector,
        this.isTemperatureDetector
      ) // 温度探测器
    },
    loadLeakDetector() {
      this.controlSubVideoIcons_video(DEVICETYPE.alarmDevice, ALARMDEVICETYPE.waterLeakDetector, this.isLeakDetector) // 漏水探测器
    },
    loadVoicedDangerButton() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.emergencyButtonWithSound,
        this.isVoicedDangerButton
      ) // 紧急按钮(有声)
    },
    loadSilentDangerButton() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.emergencyButtonSilent,
        this.isSilentDangerButton
      ) // 紧急按钮(无声)
    },
    loadCorrelationDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.infraredDetector,
        this.isCorrelationDetector
      ) // 红外对射探测器
    },
    loadOffsetDetector() {
      this.controlSubVideoIcons_video(
        DEVICETYPE.alarmDevice,
        ALARMDEVICETYPE.displacementDetector,
        this.isOffsetDetector
      ) // 位移探测器
    },
    loadShakeOptical() {
      this.controlSubVideoIcons_video(DEVICETYPE.alarmDevice, ALARMDEVICETYPE.vibratingFiber, this.isShakeOptical) // 振动光纤
    },
    loadElectronicFence() {
      this.controlSubVideoIcons_video(DEVICETYPE.alarmDevice, ALARMDEVICETYPE.electricFence, this.isElectronicFence) // 电子围栏
    }

    //
  }
}
