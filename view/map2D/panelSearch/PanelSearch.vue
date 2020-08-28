<!--
 * @Author: fengbeibei
 * @Date: 2020-05-19 14:56:13
 * @LastEditTime: 2020-06-04 18:17:26
 * @LastEditors: fengbeibei
 * @Description: 左侧导航面板组件
-->
<template>
  <div class="navigation" >
    <!-- <el-input v-model="keywords" size="mini" class="search" placeholder="请输入内容">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="handleClickInputSearch" />
    </el-input>-->
    <el-tabs v-model="select" stretch>
      <el-tab-pane v-for="item in tabs" :key="item.key" :name="item.key" v-loading="!true">
        <span slot="label" :title="item.title">
          <i :class="item.icon" />
        </span>
        <div v-if="item.key === 'organization'" :class="`${item.key}-tab`">
          <organization :treeState="'2'" />
        </div>
        <div v-if="item.key === 'resource'" :class="`${item.key}-tab`">
          <EquipmentControlYing ref="EquipmentControl"></EquipmentControlYing>
        </div>
        <div v-if="item.key === 'poi'" :class="`${item.key}-tab`">
          <POI />
        </div>
        <div v-if="item.key === 'district'" :class="`${item.key}-tab`">
          <District :keywords="keywords" :select="select" ref="District"></District>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 楼层信息面板 -->
    <FloorInfo v-if="showFloorInfo && select  =='organization'  && isMapOuter===2 " class="floor-info" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import EquipmentControlYing from './EquipmentControlYing'
// import PanelSearchTreeBox from '../../map2DEdit/panelSearch/PanelSearchTreeBox'
import Organization from './Organization'
import POI from './POI'
import District from './District'
import FloorInfo from './FloorInfo'
export default {
  name: 'panel-search',
  components: {
    Organization,
    // PanelSearchTreeBox,
    POI,
    EquipmentControlYing,
    District,
    FloorInfo
  },
  computed: {
    ...mapState({
      showFloorInfo: ({ map2d }) => map2d.mapIndex.showFloorInfo,
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter // 1:动态地图，2：静态地图
    })
  },
  data() {
    return {
      ifFloorInfo: this.$store.state.map2d.mapIndex.ifFloorInfo, // 楼层信息面板
      // 页面数据
      select: 'organization', // 下拉框选中key
      keywords: '', // 检索关键字
      defaultPropsOrgTree: {
        children: 'children',
        label: 'label'
      },
      // 页签列表
      tabs: [
        { key: 'organization', label: '机构', title: '组织机构', icon: 'ccbjigou-buwei iconfont-ccb' },
        { key: 'resource', label: '资源', title: '资源列表', icon: 'ccbziyuanliebiao iconfont-ccb' },
        { key: 'poi', label: 'POI', title: '兴趣点', icon: 'ccbxuanzequyushebeiziyuan iconfont-ccb' },
        { key: 'district', label: '区划', title: '行政区划', icon: 'ccbhangzhengquyu iconfont-ccb' }
      ]
    }
  },
  methods: {
    // 处理下拉框更改
    handelSlelctChange(key) {
      console.log(key)
      this.select = key
    },
    // 处理输入框搜索按钮点击
    handleClickInputSearch() {
      console.log('检索关键字', this.keywords, this.select)
      if (this.select === 'district') {
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 左侧导航及菜单
.navigation {
  display: inline-block;
  height: 100%;
  width: 300px;
  position: relative;
  padding: 8px;
  padding-right: 0;
  top: 0px;
  overflow-y: scroll;
  background: rgba(255,255,255,0.95);
  box-shadow:-1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  > *:not(:last-child) {
    margin-top: 8px;
  }
  .search {
    /deep/ .el-select .el-input {
      width: 80px;
    }
    /deep/ .el-select input {
      padding-left: 8px;
    }
  }
  /deep/ .organization-tab .el-tree {
    background: initial;
    color: initial;
  }
  /deep/ .district-tab .el-tree {
    background: initial;
    color: initial;
  }
  .iconfont-ccb {
    font-size: 22px;
  }

  .floor-info {
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>
