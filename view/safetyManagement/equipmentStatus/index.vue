<!--
 * @Author: lianglei
 * @Date: 2020-06-23 08:42:42
 * @LastEditTime: 2020-07-03 10:15:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\safetyManagement\equipmentStatus\index.vue
--> 
<template>
  <div class="content-page">
    <!-- 左侧 -->
    <section class="left-tree">
      <treeBox
        :lazyTreeApi="getTreeApi"
        searchType="filter"
        :treeType="treeType"
        @clickData="clickData"
        @onceClick="onceClick"
        treeLazyToggle
        iconToggle
      ></treeBox>
    </section>

    <div class="right">
      <!-- 右侧 -->
      <div class="bread-crumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
          <el-breadcrumb-item active>设备状态</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="table-content">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" collapse="ture">
          <el-tab-pane :label="labelValue.VideoSubsystem" name="VideoSubsystem">
            <VideoSubsystem
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="VideoSubsystem"
            ></VideoSubsystem>
          </el-tab-pane>
          <el-tab-pane :label="labelValue.AlarmSubsystem" name="AlarmSubsystem">
            <AlarmSubsystem
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="AlarmSubsystem"
            ></AlarmSubsystem>
          </el-tab-pane>
          <el-tab-pane :label="labelValue.IntercomSubsystem" name="IntercomSubsystem">
            <IntercomSubsystem
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="IntercomSubsystem"
            ></IntercomSubsystem>
          </el-tab-pane>
          <el-tab-pane :label="labelValue.AccessControl" name="AccessControl">
            <AccessControl
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="AccessControl"
            ></AccessControl>
          </el-tab-pane>
          <el-tab-pane :label="labelValue.ParkingSubsystem" name="ParkingSubsystem">
            <ParkingSubsystem
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="ParkingSubsystem"
            ></ParkingSubsystem>
          </el-tab-pane>
          <el-tab-pane :label="labelValue.ProtectiveCompartment" name="ProtectiveCompartment">
            <ProtectiveCompartment
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="ProtectiveCompartment"
            ></ProtectiveCompartment>
          </el-tab-pane>
          <el-tab-pane :label="labelValue.TvWall" name="TvWall">
            <TvWall
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="TvWall"
            ></TvWall>
          </el-tab-pane>
          <el-tab-pane :label="labelValue.TheServer" name="TheServer">
            <TheServer
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="TheServer"
            ></TheServer>
          </el-tab-pane>
          <el-tab-pane :label="labelValue.PlatformServices" name="PlatformServices">
            <PlatformServices
              :currentOrgId="currentOrgId"
              :currentserial="currentserial"
              :currentKeyPartId="currentKeyPartId"
              ref="PlatformServices"
            ></PlatformServices>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '../../../http/audio/manyIntercom'

import {
  VideoSubsystem,
  AlarmSubsystem,
  IntercomSubsystem,
  AccessControl,
  ParkingSubsystem,
  ProtectiveCompartment,
  TvWall,
  TheServer,
  PlatformServices
} from './page/index'
export default {
  components: {
    VideoSubsystem,
    AlarmSubsystem,
    IntercomSubsystem,
    AccessControl,
    ParkingSubsystem,
    ProtectiveCompartment,
    TvWall,
    TheServer,
    PlatformServices,
    treeBox
  },
  data() {
    return {
      treeType: '',
      activeName: 'VideoSubsystem',
      labelValue: {
        VideoSubsystem: '视频子系统（999）',
        AlarmSubsystem: '报警子系统',
        IntercomSubsystem: '对讲子系统（666）',
        AccessControl: '门禁子系统',
        ParkingSubsystem: '停车场子系统',
        ProtectiveCompartment: '防护舱子系统',
        TvWall: '电视墙子系统',
        TheServer: '服务器（233）',
        PlatformServices: '平台服务'
      },
      currentOrgId: '',
      currentserial: '',
      currentKeyPartId: ''
    }
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 获取树
    getTreeApi(params) {
      return getTreeApi(params)
    },
    clickData(data) {
      console.log(data.isRoot, data.serial, '###')
      if (data.isRoot) {
        this.currentOrgId = data.id
        this.currentserial = data.serial
        console.log(data.serial, 333)
        this.$refs[this.activeName].getList()
      }
    },
    onceClick(data, node) {
      if (!data.isRoot) {
        if (data.tierType === 'org') {
          this.currentOrgId = data.id
          this.currentserial = data.serial
          this.currentKeyPartId = ''
        } else {
          this.currentserial = data.serial
          this.currentOrgId = node.parent.data.id
          this.currentKeyPartId = data.id
        }
        // 在下一次更新DOM后执行 解决需要点击两次tree才更新视图的bug
        this.$nextTick(() => {
          this.$refs[this.activeName].getList()
        })
      }
    },
    handleClick(tab, event) {
      console.log(tab)
      console.log(event)
    }
    // handleNodeClick(data) {
    //   console.log(data);
    // },
  }
}
</script>

<style lang="less" scoped>
.content-page {
  width: 100%;
  height: 100%;
  display: flex;
  .left-tree {
    width: 300px;
    height: 100%;
    border-right: 1px solid #e1e1e1;
    overflow: auto;
  }
  .right {
    margin: 0 20px 0 20px;
    width: calc(~'100% - 320px');
    height: calc(~'100% - 10px');
    overflow: hidden;
    .bread-crumb {
      margin: 23px 0 20px 0;
    }
  }
}
</style>
