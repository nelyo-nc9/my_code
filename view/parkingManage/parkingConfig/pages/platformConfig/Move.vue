<!--
 * @Author: your name
 * @Date: 2020-06-15 17:19:35
 * @LastEditTime: 2020-06-16 11:31:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\platformConfig\Move.vue
-->
<template>
  <div class="main">
    <div class="main-content">
      <div style="margin: 10px 0;">停车平台迁移</div>
      <div class="content-box">
        <div style="flex:1;margin-right:1px;height:500px;">
          <div class="title">迁移源信息</div>
          <div class="content-bottom">
            <div class="row">
              <div class="row-left">所属停车平台</div>
              <div class="row-right">停车平台1</div>
            </div>
            <div class="row">
              <div class="row-left">所属机构</div>
              <div class="row-right">保定分行</div>
            </div>
            <div class="row">
              <div class="row-left">所属重点部位</div>
              <div class="row-right">监控中心</div>
            </div>
          </div>
        </div>
        <div style="flex:1">
          <div class="title">选择迁移目标</div>
          <div class="content-bottom">
            <treeBox :lazyTreeApi="getTreeApi"
                     searchType="filter"
                     :treeType="treeType"
                     @onceClick="onceClick"
                     treeLazyToggle
                     iconToggle></treeBox>
          </div>
        </div>
      </div>
      <div style="margin-top: 24px;">
        <el-button size="mini"
                   type="primary"
                   @click="save">保存</el-button>
        <el-button size="mini"
                   @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
export default {
  components: {
    treeBox
  },
  props: {
    isShowMove: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeType: 1
    }
  },
  methods: {
    save() {
      this.$emit('exsaveBtn')
    },
    cancel() {
      this.$emit('excloseBtn', false)
    },
    // 机构数
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {}
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  flex: 1;
  .main-content {
    width: 600px;
    text-align: center;
    .content-box {
      width: 100%;
      display: flex;
      .title {
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #f2f2f2;
      }
      .content-bottom {
        height: 468px;
        padding: 12px;
        color: #666;
        overflow: auto;
        .row {
          display: flex;
          height: 32px;
          line-height: 32px;
          .row-left {
            width: 100px;
            background: #f8f8f8;
            border: 1px solid #fff;
          }
          .row-right {
            flex: 1;
            border: 1px solid #f8f8f8;
            border-left: none;
          }
        }
      }
    }
  }
}
</style>
