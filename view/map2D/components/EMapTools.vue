<!--
 * @Author: fengbeibei
 * @Date: 2020-05-20 15:41:20
 * @LastEditTime: 2020-05-20 20:28:17
 * @LastEditors: fengbeibei
 * @Description: 电子地图右上角工具栏
-->
<template>
  <div class="tools">
    <div class="button">
      <el-popover v-show="!item.invisible" v-for="item in toolList" :key="item.key" placement="bottom" width="260">
        <i slot="reference" :class="item.icon" title="item.title" @click="handelButtonClick(item, $event)" />
        <div v-if="item.key==='layer'">
          这是控制图层显隐的组件
        </div>
        <div v-if="item.key==='boxSelect'">
          这是框选组件
        </div>
        <div v-if="item.key==='transport'">
          这是运输路线组件
        </div>
        <div v-if="item.key==='point'">
          这里是点位组件
        </div>
        <div v-if="item.key==='routePlanning'">
          这里是路线规划组件
        </div>
        <div v-if="item.key==='measure'">
          这里是测量尺组件
        </div>
        <div v-if="item.key==='weather'">
          这里是实时天气组件
        </div>
        <div v-if="item.key==='alarmModeSetting'">
          这里是警告模式配置组件
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeKey: null,
      toolList: [
        { id: 1, key: 'layer', title: '图层显隐', icon: ' iconfont-ccb  ccbdituredianxianyin' },
        { id: 2, key: 'boxSelect', title: '框选工具', icon: 'iconfont-ccb' },
        { id: 3, key: 'transport', title: '运输路线', icon: 'iconfont-ccb ccblujing1' },
        { id: 4, key: 'point', title: '点位', icon: 'iconfont-ccb' },
        { id: 5, key: 'routePlanning', title: '路线规划', icon: 'iconfont-ccb ccblujing1' },
        { id: 6, key: 'measure', title: '测量尺', invisible: true, icon: 'iconfont-ccb ccbbiaochi' },
        { id: 7, key: 'weather', title: '实时天气', icon: 'iconfont-ccb ccbtianq' },
        { id: 8, key: 'alarmModeSetting', title: '报警模式配置', icon: 'iconfont-ccb ccbbaojing3' }
      ]
    }
  },
  methods: {
    handelButtonClick(item) {
      this.activeKey = item.key
    }
  }
}
</script>

<style lang="less" scoped>
.tools {
  .button i {
    background-color: rgba(0, 0, 0, 0.25);
    padding: 8px;
  }
}
</style>
