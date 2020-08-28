<!--
 * @Author: fengbeibei
 * @Date: 2020-05-25 15:41:18
 * @LastEditTime: 2020-05-29 19:57:37
 * @LastEditors: fengbeibei
 * @Description: 框选工具
-->
<template>
  <div class="box-select">
    <i
      :class="{ ' iconfont-ccb ccbdianxuan ': true, active: currDrawType === 'Point' }"
      title="点选要素"
      @click="handleClickBoxSelect('Point')"
    />
    <i
      :class="{ 'el-icon-stopwatch': true, active: currDrawType === 'Circle' }"
      title="圆形框选"
      @click="handleClickBoxSelect('Circle')"
    />
    <i
      :class="{ ' iconfont-ccb ccbmianxuan': true, active: currDrawType === 'Polygon' }"
      title="多边形框选"
      @click="handleClickBoxSelect('Polygon')"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'boxSelect',
  computed: {
    ...mapState('map2d/mapIndex', ['drawActive', 'currDrawType', 'drawStyleType']),
    ...mapGetters('map2d/mapIndex', ['mapToolbarStatus'])
  },
  watch: {
    'mapToolbarStatus.selectionControl'(newValue, oldValue) {
      if (!newValue) {
        this.setDrawActive({ type: null, styleType: null, active: false })
        this.setPanelInfoStatus(false)
      }
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setPanelInfoStatus', 'boxSelectionArr']),
    ...mapActions('map2d/mapIndex', ['setDrawActive', 'setDrawResult']),
    // 处理框选类型按钮点击事件
    handleClickBoxSelect(type) {
      // console.log(this.currDrawType)
      // console.log(this.drawStyleType)
      // type-新的框选类型 与 this.currDrawType-旧的框选类型 都不是点时，清空框选面板里面的数据；否则，框选结果进行叠加
      if (type !== 'Point' && this.currDrawType !== 'Point') {
        let obj = {
          access: [],
          alarm: [],
          camera: [],
          fireFighting: [],
          importPart: [],
          intercom: [],
          keyParts: [],
          protectedCabin: [],
          recorder: []
        }
        this.setDrawResult(obj)
      }
      const styleTypeMap = { Point: 'clickSelect', Circle: 'circleSelect', Polygon: 'polygonSelect' }
      if (type === 'Point') {
        // 点选时不进行绘制操作，通过点击事件拾取点位
        this.setDrawActive({ type: 'Point', styleType: 'clickSelect', active: false })
      } else {
        //  圆形选择、多边形选择需要进行绘制
        const active = type === this.currDrawType ? !this.drawActive : true
        const styleType = styleTypeMap[type]
        this.setDrawActive({ active, type, styleType })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-select {
  border-radius: 2px;
  box-sizing: border-box;
background: rgba(255,255,255,0.95);
   box-shadow:-1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  position: absolute;
  top: 50px;
  right: 158px;
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
