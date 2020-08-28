<template>
  <div>
    <!-- 右上角工具条 -->
    <div class="tools">
      <div class="mapEditControl iconfont">
        <div
          class="editControl"
          :class="{'activeArea': mapToolbarStatus.equipmentControl}"
          @click="changeToobarStatus('equipmentControl')"
        >
          <p class="iconfont-ccb  ccbdituredianxianyin" title="设备/要素显隐控制"></p>
        </div>
        <!-- <div class="editControl" :class="{'activeArea': mapToolbarStatus.markControl}" @click="changeToobarStatus('markControl')">
          <p class="el-icon-place" title="设备标注"></p>
        </div>
        <div class="editControl" :class="{'activeArea': mapToolbarStatus.correlationControl}" @click="changeToobarStatus('correlationControl')">
          <p class="el-icon-connection" title="关联关系"></p>
        </div>
        <div class="editControl" :class="{'activeArea': mapToolbarStatus.adminAreaControl}" @click="changeToobarStatus('adminAreaControl')">
          <p class="el-icon-location-information" title="行政区设置"></p>
        </div>-->
        <div
          class="editControl"
          :class="{'activeArea': mapToolbarStatus.mapConfigControl}"
          @click="changeToobarStatus('mapConfigControl')"
        >
          <p class="iconfont-ccb ccbcanshupeizhi1" title="地图配置"></p>
        </div>
      </div>
    </div>
    <el-collapse-transition>
      <!-- 设备/要素筛选控件 -->
      <EquipmentSelection v-if="mapToolbarStatus.equipmentControl" />
    </el-collapse-transition>
  </div>
</template>
<script>
import EquipmentSelection from './EquipmentSelection'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'panel-tools',
  components: { EquipmentSelection },
  computed: {
    ...mapGetters('map2d/mapIndex', ['mapToolbarStatus'])
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setMapToolbarStatus']),
    changeToobarStatus(item) {
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
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.26);
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
      cursor: pointer;
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
