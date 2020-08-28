<!--
 * @Author: fengbeibei
 * @Date: 2020-05-20 15:41:20
 * @LastEditTime: 2020-05-27 10:25:45
 * @LastEditors: fengbeibei
 * @Description: 电子地图右上角工具栏
-->
<template>
  <div id="mapTools">
    <!-- 右上角工具条 -->
    <div class="tools">
      <div class="mapEditControl iconfont">
        <el-button type="text"
          class="editControl"
          :class="{ activeArea: mapToolbarStatus.equipmentControl }"
          @click="changeToobarStatus('equipmentControl')"
        >
          <p class="iconfont-ccb  ccbdituredianxianyin" title="设备/要素显隐控制"></p>
        </el-button>
        <el-button  type="text"
          class="editControl"
          :class="{ activeArea: mapToolbarStatus.selectionControl }"
          @click="changeToobarStatus('selectionControl')"
        >
          <p class="ccbmianxuan iconfont-ccb" title="框选工具"></p>
        </el-button>
        <el-button  type="text"
          class="editControl"
          :class="{ activeArea: mapToolbarStatus.routeControl }"
          @click="changeToobarStatus('routeControl')"
               :disabled="Boolean(this.isMapOuter === 2)"
        >
          <p class="iconfont-ccb ccblujing1" title="路线规划"></p>
        </el-button>
        <el-button  type="text"
          class="editControl"
          :class="{ activeArea: mapToolbarStatus.measureControl }"
          @click="changeToobarStatus('measureControl')"
              :disabled="Boolean(this.isMapOuter === 2)"
        >
          <p class="iconfont-ccb ccbbiaochi" title="测量尺"></p>
        </el-button>
        <el-button  type="text"
          class="editControl"
          :class="{ activeArea: mapToolbarStatus.weatherControl }"
          @click="changeToobarStatus('weatherControl')"
              :disabled="Boolean(this.isMapOuter === 2)"
        >
          <p class="iconfont-ccb ccbtianqi" title="实时天气"></p>
        </el-button>
        <el-button  type="text"
          class="editControl"
          :class="{ activeArea: mapToolbarStatus.policeControl }"
          @click="changeToobarStatus('policeControl')"
        >
          <p class="iconfont-ccb ccbbaojing3" title="报警配置"></p>
        </el-button>
        <el-button  type="text"
          class="editControl"
          :class="{ activeArea: mapToolbarStatus.correlationControl }"
          @click="changeToobarStatus('correlationControl')"
        >
          <p class=" iconfont-ccb ccbguanlian2" title="关联关系"></p>
        </el-button>
      </div>
    </div>
    <el-collapse-transition>
      <div>
        <!-- 设备/要素筛选控件 -->
        <EquipmentSelectionYing v-show="mapToolbarStatus.equipmentControl" />
        <!-- 框选控件 -->
        <BoxSelect class="popover-box-select" v-show="mapToolbarStatus.selectionControl" />
        <!-- 路线规划控件 -->
        <DistanceBox v-if="mapToolbarStatus.routeControl" />
        <!-- 测量尺控件 -->
        <Measure class="popover-measure" v-show="mapToolbarStatus.measureControl" />
        <AlarmConfiguration v-show="mapToolbarStatus.policeControl" />
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import EquipmentSelectionYing from '../../map2D/panelTool/EquipmentSelectionYing'
import BoxSelect from './BoxSelect'
import Measure from './Measure'
import DistanceBox from './DistanceBox'
import AlarmConfiguration from './AlarmConfiguration'
export default {
  components: {
    EquipmentSelectionYing,
    BoxSelect,
    Measure,
    DistanceBox,
    AlarmConfiguration
  },
  data() {
    return {
      activeKey: null,
      toolList: [
        { id: 1, key: 'layer', title: '图层显隐', icon: ' iconfont-ccb  ccbdituredianxianyin' },
        { id: 2, key: 'boxSelect', title: '框选工具', icon: 'el-icon-full-screen' },
        { id: 3, key: 'transport', title: '运输路线', icon: 'iconfont-ccb ccblujing1 ', invisible: true },
        { id: 4, key: 'point', title: '设备标注', icon: ' iconfont-ccb ccbcanshupeizhi1', invisible: true },
        { id: 5, key: 'routePlanning', title: '路线规划', icon: 'iconfont-ccb ccblujing1' },
        { id: 6, key: 'measure', title: '测量尺', icon: 'iconfont-ccb ccbbiaoch' },
        { id: 7, key: 'weather', title: '实时天气', icon: 'iconfont-ccb ccbtianq', disabled: true },
        { id: 8, key: 'alarmModeSetting', title: '报警模式配置', icon: 'iconfont-ccb ccbbaojing3' }
      ]
    }
  },
  computed: {
    ...mapState('map2d/mapIndex', ['isMapOuter']),
    ...mapGetters('map2d/mapIndex', ['mapToolbarStatus'])
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setPanelInfoStatus']),
    ...mapActions('map2d/mapIndex', ['setMapToolbarStatus', 'setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo']), // 处理弹出框按钮点击事件
    changeToobarStatus(item) {
      if (this.isMapOuter === 2 && item !== 'equipmentControl' && item !== 'policeControl' && item !== 'selectionControl' && item !== 'correlationControl') {
        // alert('楼内平面图或环境平面图不能点击！')
        return
      }
      this.setMapToolbarStatus(item)
    }
  }
}
</script>

<style lang="less" scoped>
.tools {
  clear: both;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.85);
   box-shadow:-1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  // background-color: rgba(51, 51, 51, 0.5);
  cursor: default;
  border-radius: 2px;
  .mapEditControl {
    height: 40px;
    line-height: 48px;
    text-align: center;
    cursor: default;
    border-radius: 4px;
    .editControl {
      display: inline;
      margin: 0px 6px;
      // cursor: pointer;
      // background: #fff;
    border: none;
   color:#656565;
      p {
        display: inline;
        font-size: 20px;
      }
    }
  }
}
.tools .mapEditControl .editControl:hover,
.tools .mapEditControl .activeArea {
  color: #0091ff;
}
</style>
