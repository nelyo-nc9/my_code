// 重点部位图层
import layerConfig from 'assets/2DMap/meta/layer';
import generalTrans from 'assets/2DMap/feature/edit/general';
import { DEVICETYPE } from 'assets/2DMap/meta/common';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      importPartLayer: layerConfig.importPartIcon // 重点部位图层样式
    };
  },
  computed: {
    ...mapState({
      importPartResource: ({ map2d }) => map2d.mapPoint.importPartResourceArr, // 重点部位 资源数组
      importPartIcons: ({ map2d }) => map2d.mapPoint.importPartIconFeatures, // 重点部位 点位要素
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode // 当前选中的树节点
    })
  },
  watch: {
    importPartResource: {
      handler() {
        this.controlImportPartIcons(true)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('map2d/mapPoint', [
      'setPointResourceByType', 'setPointIconFeatures', 'addMapCommonResourcePoint'// 重点部位
    ]),
    ...mapActions('map2d/mapPanelSearch', ['changeResourceTree']),
    /**
     * 显示/隐藏 重点部位 图标要素
     * @param {*} iconVisible 图层显隐
     */
    controlImportPartIcons(iconVisible) {
      if (iconVisible) {
        // 资源数组转换为要素数组
        const resourceArrCp = JSON.parse(JSON.stringify(this.importPartResource));
        let features = generalTrans.transFeatures(resourceArrCp, this.importPartLayer);
        this.setPointIconFeatures({ type: 'importPart', features: features });
      } else {
        this.setPointIconFeatures({ type: 'importPart', features: [] });
      }
    },
    /**
     * 地图加载完成后，获取相应的重点部位
     */
    loadImportPartResources() {
      this.loadQueryImportParts();
    },
    /**
     * 按重点部位类型查找已添加到地图的重点部位
     */
    loadQueryImportParts() {
      let query = {
        monitortype: 'importPart'
      };
      // 接口查询楼内楼外的某一类重点部位
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query.mapId = this.activeMapConfig.mapId;
        this.loadImportPartsByMapId(query);
      } else if (this.currentFloor.id) {
        query.floorId = this.currentFloor.id;
        this.loadImportPartsByFloorId(query);
      }
    },
    /**
     * 添加重点部位点位
     * @param {*} cood 坐标
     */
    // addImportPartFeature(cood) {
    //   console.log(this.selectedTreeCode)
    //   if (this.selectedTreeCode) {
    //     // 添加时，只添加图标点位，其他的信息在编辑时修改或添加
    //     const pointInfo = {
    //       point: {
    //         name: '雁塔区建设银行',
    //         type: 1, // 类型
    //         subType: 1, // number 必须 子类型
    //         level: window.$context2D.map.getView().getZoom(), // 可见层级
    //         coordinate: cood.join(','), // 坐标,
    //         resourceId: '5', // 资源id
    //         orgId: '1' // string 必须 机构id
    //       },
    //       type: DEVICETYPE.keyPart // 设备类型
    //     }
    //     let arr = [pointInfo]
    //     this.addMapCommonResourcePoint(pointInfo.point).then((suc) => {
    //       pointInfo.id = suc.data.id
    //       if (this.importPartResource.length) {
    //         arr = JSON.parse(JSON.stringify(this.importPartResource))
    //         // 当前添加的点位，在资源数组中存在时，使用当前信息替换已经存在的资源（点位重绘时会出现该情况）
    //         let tag = -1
    //         arr.map((item, i) => {
    //           if (item.id === pointInfo.id) {
    //             tag = i
    //             arr[i] = pointInfo
    //           }
    //         })
    //         if (tag > -1) {
    //           arr[tag] = pointInfo
    //         } else {
    //           arr.push(pointInfo)
    //         }
    //       }
    //       this.setPointResourceByType({ type: 'importPart', arr: arr })
    //     }).catch(err => console.log(err))
    //     // 更新树节点的 active 状态
    //     const tree = JSON.parse(JSON.stringify(this.videoTree))
    //     tree[0].children.map(item => {
    //       if (item.id === this.selectedTreeCode.id) {
    //         item.activeId = item.id
    //         item.point = pointInfo.point
    //       }
    //     })
    //     this.changeResourceTree({ type: '1', arr: tree })
    //   }
    // },
    /**
     * 重新绘制点位要素
     * @param {*} importPart 要更新的要素信息
     */
    refreshCurrentImportPartFeature(importPart) {
      let resource = this.importPartResource.filter(item => item.attributes.id !== importPart.id);
      let feature = generalTrans.transOneIconFeature(importPart, this.importPartLayer);
      feature && resource.push(feature);
      this.setAlarmHostFeatures(resource);
    }
  }
};
