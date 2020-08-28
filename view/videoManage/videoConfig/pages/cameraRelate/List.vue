<template>
  <div class="camera-relate-box">
     <!-- 中间树 摄像机关联配置列表-->
    <div class="tree-container">
      <treeBox :lazyTreeApi="getLazyTreeApi" ref="tree"
        searchType="filter"
        :treeType="treeType"
        @clickData="clickData"
        @onceClick="onceClick"
        @rootId="rootId"
        :customizeQuery="customizeQuery"
        treeLazyToggle iconToggle></treeBox>
    </div>
    <!--  -->
    <div class="content">
      <other-list :tierType="tierType" :orgId="currentOrgId" :deviceId="deviceId" :keyPartId="currentKeyPartId" :navTitle="navTitle" @changeComponent="changeComponent" @changeSelect="changeSelect" @changeOrgId="changeOrgId"></other-list>
    </div>
  </div>
</template>

<script>
import OtherList from '../../../components/otherList.vue'
import { getLazyTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
export default {
  name: 'CameraList',
  components: {
    treeBox,
    OtherList
  },
  data() {
    return {
      navTitle: '摄像机关联配置',
      treeType: 1,
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      currentOrgId: '',
      currentKeyPartId: '',
      deviceId: '',
      tierType: 'org'
    }
  },
  methods: {
    changeComponent(value) {
      this.$emit('changeComponent', value)
    },
    getLazyTreeApi(params) {
      return getLazyTreeApi(params)
    },
    changeOrgId(id) {
      this.$emit('changeOrgId', id)
    },
    rootId(id) {
      this.currentOrgId = id
    },
    clickData(data) {
      if (data && data.nodeKey) {
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点this.setPageInfo();
        if (data.tierType === 'org') {
          // zp增加
          if (this.currentOrgId == data.id) {
            this.$children[1].getTableList('org')
          }
          this.currentOrgId = data.id
          // zp增加
          this.tierType = 'org'
        } else if (data.tierType === 'loc') {
          this.currentKeyPartId = data.id
          // zp 改动异步
          this.tierType = 'keyPart'
          this.$nextTick(() => {
            this.$children[1].getTableList('keyPart')
          })
        } else {
          this.deviceId = data.id
          // zp改动异步
          this.tierType = 'dev'
          this.$nextTick(() => {
            this.$children[1].getTableList('dev')
          })
        }
      }
    },
    onceClick(data, node) {
      if (data.tierType === 'org') {
        // zp增加
        if (this.currentOrgId == data.id) {
          this.$children[1].getTableList('org')
        }
        this.currentOrgId = data.id
        // zp增加
        this.tierType = 'org'
      } else if (data.tierType === 'loc') {
        this.currentKeyPartId = data.id
        // zp 改动异步
        this.tierType = 'keyPart'
        this.$nextTick(() => {
          this.$children[1].getTableList('keyPart')
        })
      } else {
        this.deviceId = data.id
        // zp改动异步
        this.tierType = 'dev'
        this.$nextTick(() => {
          this.$children[1].getTableList('dev')
        })
      }
    },
    changeSelect(data) {
      this.$emit('changeSelect', data)
    }
  }
}
</script>

<style lang="less" scoped>
.camera-relate-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-container {
    width: 280px;
    height: auto;
  }
  .content {
    width: calc(~'100% - 280px');
    padding-left: 10px;
    box-shadow: 0 0 10px #ccc inset;
    overflow: hidden;
  }
}
</style>
