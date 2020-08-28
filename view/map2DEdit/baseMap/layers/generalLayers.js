// 互锁门图层
import layerConfig from 'assets/2DMap/meta/layer'
import generalTrans from 'assets/2DMap/feature/edit/general'
import layerMap from 'assets/2DMap/meta/layerMapShow'
import { mapState, mapActions, mapGetters } from 'vuex'
import { map, filter } from 'lodash'
export default {
  data() {
    return {
      administrativeAreaLayer: layerMap['administrativeArea'], // 行政区划
      importPartLayer: layerConfig.importPartIcon, // 重点部位
      videoRecorderLayer: layerConfig.videoRecorderIcon, // 视频主机
      doorControlLayer: layerConfig.doorControlIcon, // 门禁主机
      doorControlChannelLayer: layerConfig.doorControlChannelIcon, // 门禁通道
      // doubleDoorLayer: layerConfig.doubleDoorIcon, // 互锁门
      commonAlarmLayer: layerConfig.commonAlarmIcon, // 报警主机
      detectorAlarmLayer: layerConfig.detectorAlarmIcon, // 报警探测器
      speechLayer: layerConfig.speechIcon, // 对讲主机
      speechChannelLayer: layerConfig.speechChannelIcon, // 对讲通道
      cabinLayer: layerConfig.cabinIcon, // 防护舱主机
      cabinChannelLayer: layerConfig.cabinChannelIcon // 防护舱通道
    }
  },
  computed: {
    ...mapGetters('map2d/mapIndex', ['administrativeArea']),
    ...mapState('map2d/pointMapShow', {
      administrativeAreaFeatures(state) {
        return this.filterAdministrativeAreaFeatures(state.administrativeAreaFeatures, 'Highlight')
      }
    }),
    ...mapState({
      importPartResource: ({ map2d }) => map2d.mapPoint.importPartResourceArr, // 重点部位 资源数组
      importPartIcons: ({ map2d }) => map2d.mapPoint.importPartIconFeatures, // 重点部位 要素数组
      // videoRecorderResource: ({ map2d }) => map2d.mapPoint.videoRecorderResourceArr, // 视频主机 资源数组
      // videoRecorderIcons: ({ map2d }) => map2d.mapPoint.videoRecorderIconFeatures, // 视频主机 点位要素
      speechResource: ({ map2d }) => map2d.mapPoint.speechResourceArr, // 对讲主机 资源数组
      speechIcons: ({ map2d }) => map2d.mapPoint.speechIconFeatures, // 对讲主机 点位要素
      // speechChannelResource: ({ map2d }) => map2d.mapPoint.speechChannelResourceArr, // 对讲通道 资源数组
      // speechChannelIcons: ({ map2d }) => map2d.mapPoint.speechChannelIconFeatures, // 对讲通道 点位要素
      // doubleDoorResource: ({ map2d }) => map2d.mapPoint.doubleDoorResourceArr, // 互锁门 资源数组
      // doubleDoorIcons: ({ map2d }) => map2d.mapPoint.doubleDoorIconFeatures, // 互锁门 点位要素
      // doorControlResource: ({ map2d }) => map2d.mapPoint.doorControlResourceArr, // 门禁主机 资源数组
      // doorControlIcons: ({ map2d }) => map2d.mapPoint.doorControlIconFeatures, // 门禁主机 点位要素
      // doorControlChannelResource: ({ map2d }) => map2d.mapPoint.doorControlChannelResourceArr, // 门禁通道 资源数组
      // doorControlChannelIcons: ({ map2d }) => map2d.mapPoint.doorControlChannelIconFeatures, // 门禁通道 点位要素
      commonAlarmResource: ({ map2d }) => map2d.mapPoint.commonAlarmResourceArr, // 报警主机 资源数组
      commonAlarmIcons: ({ map2d }) => map2d.mapPoint.commonAlarmIconFeatures, // 报警主机 点位要素
      detectorAlarmResource: ({ map2d }) => map2d.mapPoint.detectorAlarmResourceArr, // 报警探测器 资源数组
      detectorAlarmIcons: ({ map2d }) => map2d.mapPoint.detectorAlarmIconFeatures, // 报警探测器 点位要素
      // protectiveCabinResource: ({ map2d }) => map2d.mapPoint.protectiveCabinResourceArr, // 防护舱 资源数组
      // protectiveCabinIcons: ({ map2d }) => map2d.mapPoint.protectiveCabinIconFeatures, // 防护舱 点位要素
      protectiveCabinChanneResource: ({ map2d }) => map2d.mapPoint.protectiveCabinChannelResourceArr, // 防护舱通道 资源数组
      protectiveCabinChanneIcons: ({ map2d }) => map2d.mapPoint.protectiveCabinChannelIconFeatures, // 防护舱通道 点位要素
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode, // 当前选中的树节点
      resourceLists: ({ map2d }) => map2d.mapPanelSearch.resourceLists, // 资源树
      // isShowMutualLockDoor: ({ map2d }) => map2d.mapIndex.checkedEquipments.mutualLockDoor.mutualLockDoor.value, // 互锁门显隐
      isShowImportPart: ({ map2d }) => map2d.mapIndex.checkedEquipments.importPart.value, // 重点部位 资源数组

      // isShowMutualLockDoor: ({ map2d }) => map2d.mapIndex.checkedEquipments.mutualLockDoor.value, // 互锁门显隐
      // isShowRecorder: ({ map2d }) => map2d.mapIndex.checkedEquipments.recorder.videoHost.value, // 视频主机显隐
      // isShowIntercomHost: ({ map2d }) => map2d.mapIndex.checkedEquipments.intercom.intercomHost.value, // 对讲主机显隐
      // isShowIntercomChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.intercom.intercomChannel.value, // 对讲通道显隐
      isShowAccessHost: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.accessHost.value, // 门禁主机显隐
      isShowAccessChannel: ({ map2d }) => map2d.mapIndex.checkedEquipments.access.accessChannel.value // 门禁通道显隐
      // isShowprotectedCabinHost: ({ map2d }) => map2d.mapIndex.checkedEquipments.protectedCabin.protectedCabinHost.value, // 防护舱显隐
      // isShowprotectedCabinChannel: ({ map2d }) =>
      //   map2d.mapIndex.checkedEquipments.protectedCabin.protectedCabinChannel.value // 防护舱通道显隐
    })
  },
  watch: {
    importPartResource: {
      handler(val) {
        // 显示重点部位
        this.controlSubGeneralPointIcons(this.isShowImportPart, 'importPart')
      },
      deep: true
    },
    // videoRecorderResource: {
    //   handler(val) {
    //     // 显示视频主机
    //     this.controlSubGeneralPointIcons(this.isShowRecorder, 'videoRecorder')
    //   },
    //   deep: true
    // },
    // doubleDoorResource: {
    //   handler(val) {
    //     // 显示互锁门
    //     this.controlSubGeneralPointIcons(this.isShowMutualLockDoor, 'doubleDoor');
    //   },
    //   deep: true
    // },
    // doorControlResource: {
    //   handler(val) {
    //     // 显示门禁主机
    //     this.controlSubGeneralPointIcons(this.isShowAccessHost, 'doorControl')
    //   },
    //   deep: true
    // },
    // doorControlChannelResource: {
    //   handler(val) {
    //     // 显示门禁通道
    //     this.controlSubGeneralPointIcons(this.isShowAccessChannel, 'doorControlChannel')
    //   },
    //   deep: true
    // },
    commonAlarmResource: {
      handler(val) {
        // 显示报警主机
        this.controlSubGeneralPointIcons(true, 'commonAlarm')
      },
      deep: true
    },
    detectorAlarmResource: {
      handler(val) {
        // 显示报警主机
        this.controlSubGeneralPointIcons(true, 'detectorAlarm')
      },
      deep: true
    },
    // speechResource: {
    //   handler(val) {
    //     // 显示对讲主机
    //     this.controlSubGeneralPointIcons(this.isShowIntercomHost, 'speech')
    //   },
    //   deep: true
    // },
    // speechChannelResource: {
    //   handler(val) {
    //     // 显示对讲通道
    //     this.controlSubGeneralPointIcons(this.isShowIntercomChannel, 'speechChannel')
    //   },
    //   deep: true
    // },
    // protectiveCabinResource: {
    //   handler(val) {
    //     // 显示防护舱
    //     this.controlSubGeneralPointIcons(this.isShowprotectedCabinHost, 'protectiveCabin')
    //   },
    //   deep: true
    // },
    // protectiveCabinChanneResource: {
    //   handler(val) {
    //     // 显示防护舱通道
    //     this.controlSubGeneralPointIcons(this.isShowprotectedCabinChannel, 'protectiveCabinChanne')
    //   },
    //   deep: true
    // },
    isShowImportPart(val) {
      // 重点部位显隐
      this.controlSubGeneralPointIcons(val, 'videoRecorder')
    }

    // isShowRecorder(val) {
    //   // 视频主机显隐
    //   this.controlSubGeneralPointIcons(val, 'videoRecorder')
    // }
    // isShowMutualLockDoor(val) {
    //   // 互锁门显隐
    //   this.controlSubGeneralPointIcons(val, 'doubleDoor');
    // },
    // isShowAccessHost(val) {
    //   // 门禁主机显隐
    //   this.controlSubGeneralPointIcons(val, 'doorControl')
    // },
    // isShowAccessChannel(val) {
    //   // 门禁通道显隐
    //   this.controlSubGeneralPointIcons(val, 'doorControlChannel')
    // },
    // isShowIntercomHost(val) {
    //   // 对讲主机显隐
    //   this.controlSubGeneralPointIcons(val, 'speech')
    // },
    // isShowIntercomChannel(val) {
    //   // 对讲通道显隐
    //   this.controlSubGeneralPointIcons(val, 'speechChannel')
    // }
    // isShowprotectedCabinHost(val) {
    //   // 防护舱显隐
    //   this.controlSubGeneralPointIcons(val, 'protectiveCabin')
    // },
    // isShowprotectedCabinChannel(val) {
    //   // 防护舱通道显隐
    //   this.controlSubGeneralPointIcons(val, 'protectiveCabinChanne')
    // }
  },
  methods: {
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType',
      'setPointIconFeatures' // 保存点位元素
    ]),
    ...mapActions('map2d/mapPanelSearch', ['changeResourceTree']),
    // 过滤行政区划图层数据
    filterAdministrativeAreaFeatures(features = [], type) {
      const itemArray = map(this.administrativeArea[type] || {}, (o, k) => ({ key: k, ...o })) // 转换为数组
      const checkedItem = filter(itemArray, { value: true }) // 提取选中项
      const checkedKeys = map(checkedItem, 'key') // 提取选中key
      checkedKeys.push(type) // 保证设备子类型于设备主类型相同的要素保持显示
      // console.log(features);
      return checkedKeys.length ? filter(features, v => checkedKeys.includes(v.attributes.subType)) : [] // 过滤已选中类型要素
    },
    /**
     * 生成图标要素（视频主机、门禁主机、门禁通道、互锁门）
     * @param {*} iconVisible 图层显隐
     * @param {*} type 资源类型
     */
    controlSubGeneralPointIcons(iconVisible, type) {
      if (iconVisible) {
        // 资源数组转换为要素数组
        const resourceArrCp = JSON.parse(JSON.stringify(this[type + 'Resource']))
        let features = generalTrans.transIconFeatures(resourceArrCp, this[type + 'Layer'])
        this.setPointIconFeatures({ type: type, features: features })
      } else {
        this.setPointIconFeatures({ type: type, features: [] })
      }
    },
    /**
     * 地图加载完成后，获取相应的设备
     */
    loadGeneralPointResources() {
      // this.loadQuerySubGeneralPoints()
    },
    /**
     * 按互锁门类型查找已添加到地图的互锁门
     */
    loadQuerySubGeneralPoints() {
      let query = {
        monitortype: 'doubleDoor'
      }
      // 接口查询楼内楼外的某一类互锁门
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query.mapId = this.activeMapConfig.mapId
        // this.loadSubGeneralPointsByMapId(query)
      } else if (this.currentFloor.id) {
        query.floorId = this.currentFloor.id
        // this.loadSubGeneralPointsByFloorId(query)
      }
    },

    /**
     * 添加视频主机，录像机
     * @param {*} cood 坐标
     * @param {*} type 当前点位类型（视频主机、门禁主机、门禁通道、互锁门）
     */
    addvideoRecorderFeature(cood, type, key) {
      if (this.selectedTreeCode) {
        const zoom = window.$context2D.map.getView().getZoom()

        let typeIndex = this.constructAddedData2(this.selectedTreeCode, cood, zoom)
        let { resource, resourceArr } = typeIndex
        // const resourceType = this.macthVideoInfos(resource.type, resource.subType).videoType // 关键字-shen
        const resourceType = type

        console.log('添加信息对象', JSON.stringify(resource))

        this.addMapCommonResourcePoint(resource)
          .then(res => {
            resource.id = res.data.id
            let arr = JSON.parse(JSON.stringify(resourceArr))
            arr.push(resource)
            this.setRefreshTreeList(true) // 刷新机构重点部位树
            this.$message({
              message: '添加成功',
              type: 'success'
            })

            this.setPointResourceByType({ type: resourceType, arr: arr })

            // resource.id = res.data.id
            // let arr = [resource]
            // if (this.boltipcResource.length) {
            //   arr = JSON.parse(JSON.stringify(this.boltipcResource))
            //   arr.push(resource)
            // }
            // this.setPointResourceByType({ type: resourceType, arr: arr })
            // // 更新树节点的 active 状态
            // const tree = JSON.parse(JSON.stringify(this.videoTree))
            // tree[0].children.map(item => {
            //   if (item.id === this.selectedTreeCode.id) {
            //     item.id = res.data.id
            //     item.activeId = item.id
            //     item = { ...item, ...resource }
            //   }
            // })
            // this.changeResourceTree({ type: '1', arr: tree })
          })
          .catch(err => console.log(err))
      }
    },
    /**
     * 添加一般点位
     * @param {*} cood 坐标
     * @param {*} type 当前点位类型（视频主机、门禁主机、门禁通道、互锁门）
     */
    addGeneralPointFeature(cood, type, key) {
      if (this.selectedTreeCode) {
        console.log(this.selectedTreeCode)
        const zoom = window.$context2D.map.getView().getZoom()
        const resource = {
          orgId: '1', // string 必须 机构id
          isouter: true,
          resourceId: '1234567890', // 点位所绑定的资源
          floor: '6671693639313260544', // 点位所属楼层 id
          keyPart: '6671695142006554624', // 点位所属重点部位 id
          name: this.selectedTreeCode.label, // 点位名称
          type: this.selectedTreeCode.type, // 设备大类
          subType: this.selectedTreeCode.monitype, // 设备子类
          level: Math.ceil(zoom), // 可见层级
          coordinate: cood.join(','),
          projection: 'EPSG:3857' // 暂未使用
        }
        // 发送请求
        this.addMapCommonResourcePoint(resource)
          .then(res => {
            resource.id = res.data.id
            let arr = [resource]
            if (this[type + 'Resource'].length) {
              arr = JSON.parse(JSON.stringify(this[type + 'Resource']))
              arr.push(resource)
            }
            this.setPointResourceByType({ type: type, arr: arr })
            // 更新树节点的 active 状态
            const tree = JSON.parse(JSON.stringify(this.resourceLists[key]))
            tree[0].children.map(item => {
              if (item.id === this.selectedTreeCode.id) {
                item.id = res.data.id
                item.activeId = item.id
                item = { ...item, ...resource }
              }
            })
            this.changeResourceTree({ type: key, arr: tree })
          })
          .catch(err => console.log(err))
      }
    }
  }
}
