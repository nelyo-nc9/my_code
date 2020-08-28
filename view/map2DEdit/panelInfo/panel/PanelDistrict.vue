<!--
 *
 * @Description: 行政区统计面板
-->
<template>
  <div class="Panel-District">
    <div class="header">
      <span>{{ nowSelectAreaInfo.name }}</span>
      <el-button type="text" size="mini">
        <i class="el-icon-close" @click="close" />
      </el-button>
    </div>
    <el-collapse v-model="activeName">
      <el-collapse-item v-for="type in typeList" :key="type.key" :name="type.key">
        <div slot="title">
          {{ type.name }} <span>{{ (drawResult[type.key] || []).length }}</span>
          <i
            :class="['tltle-icon', activeName === type.key ? 'el-icon-caret-bottom' : 'el-icon-caret-top'].join(' ')"
          />
        </div>
        <el-row :gutter="8" style="margin-bottom:5px">
          <el-col :span="type.span || 8" v-for="{ attributes: item } in drawResult[type.key]" :key="item.id">
            <el-button
              :type.sync="item.value ? 'primary' : 'info'"
              size="mini"
              @click="handleClickItem(item, type, $event)"
              >{{ item.name }}</el-button
            >
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getMapLayerById } from '../../utils'
export default {
  name: 'panel-district',
  data() {
    return {
      activeName: 'importPart',
      typeList: [
        { key: 'importPart', name: '机构', span: 12, value: false },
        { key: 'keyParts', name: '重点部位', span: 12, value: false }
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
    ...mapGetters('map2d/mapIndex', ['drawResult', 'boxSelectionArr', 'nowSelectAreaInfo'])
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
.Panel-District {
  height: 100%;
  .el-button--primary {
    height: 22px;
  }
  .header {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    align-items: center;
  }

  /deep/ .el-collapse {
    background: #fff;
    padding-left: 10px;
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
