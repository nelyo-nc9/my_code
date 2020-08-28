<template>
  <div class="map2d-edit">
    <!-- 全屏底图 -->
    <section class="base-map">
      <MapEditApp class="outer-map-edit" />
    </section>
    <!-- 左侧搜索结构、点位面板 -->
    <section class="panel-search-wrap">
      <PanelSearch v-if="showLeftFloorInfo" />
      <PanelSwitch @change="handleChangePanelSwitch" />
    </section>
    <!-- 右上工具条 -->
    <section class="panel-tools" :class="{ 'panel-Toolbars-move': isShowPanelTools }">
      <PanelTool />
    </section>
    <!-- 初始不显示的组件，零散弹框面板 -->
    <section class="substitute-modules">
      <!-- 地图配置弹框 -->
      <MapConfig />
      <!-- 右侧详情面板 -->
      <transition name="panelInfo">
        <div v-if="isShowPanelTools && !showBox">
          <PanelInfo class="panelInfo" v-if="isShowPanelTools" />
        </div>
      </transition>
      <!-- 右侧行政区设置面板 -->
      <transition name="panelInfo">
        <div v-if="isShowPanelTools && showBox">
          <PanelInfo class="panelInfo" :is="currPanelToolComponent" v-if="isShowPanelTools" />
        </div>
      </transition>
    </section>
  </div>
</template>
<script>
import Bus from 'assets/2DMap/Bus'
import { mapGetters, mapActions, mapState } from 'vuex'
import MapEditApp from './baseMap/MapEditApp'
import PanelSearch from './panelSearch/PanelSearch'
import PanelTool from './panelTool/Tools'
import MapConfig from './panelTool/MapConfigDialog'
import PanelInfo from './panelInfo/PanelInfo'
import DistrictSetting from './panelInfo/panel/DistrictSetting'
import PanelSwitch from './../map2D/panelSearch/PanelSwitch'
export default {
  name: 'map2d-edit',
  components: { MapEditApp, PanelSearch, PanelSwitch, PanelTool, MapConfig, PanelInfo, DistrictSetting },
  data() {
    return {
      hide: false,
      showBox: false
    }
  },
  watch: {
    '$store.state.map2d.mapIndex.currPanelToolComponent'(newValue, oldValue) {
      if (newValue === 'DistrictSetting') {
        this.showBox = true
      } else {
        this.showBox = false
      }
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['updateShowLeftFloorInfo']),
    // 处理收缩按钮组件状态修改事件
    handleChangePanelSwitch(v) {
      this.updateShowLeftFloorInfo(!v)
    }
  },
  computed: {
    ...mapState('map2d/mapIndex', ['showLeftFloorInfo']),
    ...mapGetters('map2d/mapIndex', ['isShowPanelTools', 'currPanelToolComponent'])
  },
  mounted() {
    this.updateShowLeftFloorInfo(true)
    // 消防一张图页面跳转到此页面
  }
}
</script>
<style lang="less" scoped>
.map2d-edit {
  width: 100%;
  height: 100%;
  position: relative;
  .panel-search-wrap {
    display: flex;
    height: 100%;
    position: absolute;
    z-index: 9;
  }
  .base-map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    .outer-map-edit {
      width: 100%;
      height: 100%;
    }
    // 地图比例尺样式
    /deep/.ol-scale-line {
      left: 374px;
    }
    // 地图指北针
    /deep/.hmap-rotate-control {
      left: 372px;
      right: unset;
      top: 60px;
      bottom: unset;
    }
  }
  .panel-tools {
    width: 87px;
    height: 40px;
    position: fixed;
    right: 20px;
    z-index: 999;
  }
  // 右上角地图工具
  .panel-Toolbars-move {
    right: 340px;
  }
  .panelInfo {
    width: 336px;
    @val: 80px;
    height: calc(~'100% - @{val}');
    background-color: rgba(255, 255, 255, 0.95);
    position: fixed;
    right: 0;
    z-index: 1000;
  }
  .panelInfo-enter-active,
  .panelInfo-leave-active {
    transition: width 0.5s ease;
  }
  .panelInfo-enter, .panelInfo-leave-to /* .fade-leave-active below version 2.1.8 */ {
    width: 0;
  }
}
</style>
