<!--
 * @Author: fengbeibei
 * @Date: 2020-05-25 15:35:31
 * @LastEditTime: 2020-05-29 19:59:12
 * @LastEditors: fengbeibei
 * @Description: 测量尺工具
-->
<template>
  <div class="measure">
    <i
      :class="{ 'el-icon-share': true, active: currMeasureType === 'LineString' }"
      title="距离测量"
      @click="handleClickMeasure('LineString')"
    />
    <i
      :class="{ 'el-icon-collection-tag': true, active: currMeasureType === 'Polygon' }"
      title="面积测量"
      @click="handleClickMeasure('Polygon')"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'measure',
  computed: {
    ...mapState('map2d/mapIndex', ['measureActive', 'currMeasureType']),
    ...mapGetters('map2d/mapIndex', ['mapToolbarStatus'])
  },
  watch: {
    ...mapActions('map2d/mapIndex', ['setDrawResult']),
    mapToolbarStatus(newValue, oldValue) {
      if (!newValue.measureControl) {
        this.setMeasureActive({ active: false })
      }
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setMeasureActive']),
    // 处理测量尺点击事件
    handleClickMeasure(type) {
      const active = type === this.currMeasureType ? !this.measureActive : true
      this.setMeasureActive({ active, type })
    }
  }
}
</script>

<style lang="less" scoped>
.measure {
  border-radius: 2px;
  box-sizing: border-box;
 background: rgba(255,255,255,0.95);
    box-shadow:-1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  position: absolute;
  top: 50px;
  right: 85px;
  font-size: 18px;
  i {
    cursor: pointer;
  }
  > i:not(:last-child) {
    margin-right: 10px;
  }
  i.active {
    color: #409eff;
  }
}
</style>
