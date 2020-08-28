<!--
 * @Author: fengbeibei
 * @Date: 2020-06-02 20:02:49
 * @LastEditors: fengbeibei
 * @LastEditTime: 2020-06-05 17:40:12
 * @Description: 框选统计面板
-->
<template>
  <div class="box-select-statistics">
    <div class="header">
      <span>框选结果</span>
      <el-button type="text" size="mini">
        <i class="el-icon-close" @click="close" />
      </el-button>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="type in typeList"
        :key="type.label"
        :name="type.label"
        v-if="Boolean((drawResult[type.label] || []).length)"
      >
        <div slot="title">
          {{ type.name }} <span>{{ (drawResult[type.label] || []).length }}</span>
          <i
            :class="['tltle-icon', activeName === type.label ? 'el-icon-caret-bottom' : 'el-icon-caret-top'].join(' ')"
          />
        </div>
        <el-row :gutter="8" style="margin-bottom:5px">
          <el-col :span="type.span || 8" v-for="(item, index) in drawResult[type.label]" :key="index">
            <el-button type="info" size="mini" @click="handleClickItem(item, type, $event)">{{ item.name }}</el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getMapLayerById } from '../utils'
export default {
  name: 'box-select-statistics',
  data() {
    return {
      activeName: 'importPart',
      typeList: [
        { key: 'importPart', label: 'org', name: '机构', span: 12, value: false },
        { key: 'keyParts', label: 'keyPart', name: '重点部位', span: 12, value: false },
        { key: 'camera', label: 'video', name: '摄像机', value: false },
        { key: 'recorder', label: 'videoHost', name: '录像机', value: false },
        { key: 'alarm', label: 'alarmDevice', name: '报警设备', value: false },
        { key: 'fireFighting', label: 'fireDevice', name: '消防设备', value: false },
        { key: 'intercom', label: 'intercomDevice', name: '对讲设备', value: false },
        { key: 'access', label: 'accessControlDevice', name: '门禁设备', value: false },
        { key: 'protectedCabin', label: 'cabin', name: '防护舱', value: false }
      ]
    }
  },
  watch: {
    '$store.state.map2d.mapIndex.drawResult'(newValue, oldValue) {
      console.log(newValue, oldValue)
      console.log('框选弹窗', this.$store.state.map2d.mapIndex.drawResult)
    }
  },

  computed: {
    ...mapGetters('map2d/mapIndex', ['drawResult', 'boxSelectionArr'])
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setPanelInfoStatus']),
    // 通过要素设置地图视角中心
    setCenterByFeature(feature) {
      const { map, ol } = window.$context2D // 获取map实例
      const view = map.getView() // 获取地图视角
      const extent = feature.getGeometry().getExtent() // 获取图形范围
      const center = ol.extent.getCenter(extent) // 获取范围中心
      view.setCenter(center) // 视角切换至要素范围中心
      view.setZoom(10) // 显示级别放大
    },
    close() {
      this.setPanelInfoStatus(false)
    },
    // 点位类型点击事件
    handleClickItem(item, type) {
      item.value = !item.value
      const layer = getMapLayerById(`${type.key}Layer`)
      const source = layer.getSource()
      const feature = source.getFeatureById(item.id)
      if (feature) {
        this.setCenterByFeature(feature)
        console.log(item, type, layer, feature)
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.box-select-statistics {
  height: 100%;
  .el-button--primary {
    height: 22px;
  }
  .header {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /deep/ .el-collapse {
    /deep/ .el-collapse-item__header .tltle-icon {
      margin-left: 8px;
    }
    /deep/ .el-collapse-item__header {
      height: 36px;
      line-height: inherit;
      background-color: inherit;
    }
    /deep/ .el-collapse-item__wrap {
      background-color: inherit;
      max-height: 300px;
      overflow-y: scroll;
    }
    /deep/ .el-button {
      width: 100%;
      margin: 4px 0px;
      padding: 4px 2px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
