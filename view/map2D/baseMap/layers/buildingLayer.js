/*
 * @Author: lidongyu
 * @Date: 2020-07-9 13:47:45
 * @LastEditTime: 2020-06-04 20:30:23
 * @LastEditors: lidongyu
 * @Description: 地图图层配置及要素
 */
import { map, filter } from 'lodash';
import { mapState, mapGetters, mapMutations } from 'vuex';
import layerMap from 'assets/2DMap/meta/layerMapShow';
export default {
  data() {
    return {
      ambientImportPartLayer: layerMap['ambientImportPart'],//环境平面图图标地图元素
      insideBuildLayer: layerMap['insideBuild'],//楼内平面图地图元素
    };
  },
  computed: {
    ...mapGetters('map2d/mapIndex', ['checkedEquipments', 'administrativeArea', 'nowSelectAreaInfo', 'mapToolbarStatus', 'boxSelectionArr', 'alarmSetting']),
    ...mapState('map2d/pointMapShow', {
      ambientImportPartFeatures(state) { return this.filterFeatures(state.ambientImportPartFeatures, 'ambientImport'); },//环境平面图图层元素
      insideBuildFeatures(state) { return this.filterFeatures(state.insideBuildFeatures, 'insideBuild'); },//楼内平面图图层元素
    })
  },
  methods: {
    ...mapMutations('map2d/mapIndex', ['SET_ALARM_SETTING']),
    // 过滤设备、要素显隐控制图层数据
    filterFeatures(features = [], type) {
      if (this.alarmSetting.isReceive) {
        let endFeatures1 = filter(features, v => this.alarmSetting.alarmFeatureIds.includes(v.attributes.id));
        let endFeatures2 = JSON.parse(JSON.stringify((endFeatures1)));
        endFeatures2.forEach(item => { item.symbol.iconStyle.url = '/static/map2d/featureIcon/alarm.default.0.png'; return item; });
        return endFeatures2;
      };
      const itemArray = map(this.checkedEquipments[type] || {}, (o, k) => ({ key: k, ...o })); // 转换为数组
      const checkedItem = filter(itemArray, { value: true }); // 提取选中项
      const checkedKeys = map(checkedItem, 'key'); // 提取选中key
      checkedKeys.push(type); // 保证设备子类型于设备主类型相同的要素保持显示
      // console.log(checkedKeys);
      if (this.mapToolbarStatus.selectionControl) {
        let ids = [];
        let arr = this.boxSelectionArr ? this.boxSelectionArr : [];
        arr.forEach(element => {
          ids.push(element.id);
        });
        let features1 = checkedKeys.length ? filter(features, v => checkedKeys.includes(v.attributes.subType)) : []; // 过滤已选中类型要素
        let features2 = filter(features, v => ids.includes(v.attributes.id)); // 过滤已选中类型要素
        return features1.concat(features2);
      } else {
        return checkedKeys.length ? filter(features, v => checkedKeys.includes(v.attributes.subType)) : []; // 过滤已选中类型要素
      }
    }
  }
};
