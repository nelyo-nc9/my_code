<template>
  <div class="main">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警主机关联配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>迁移</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="main-content">
      <div style="margin: 10px 0;">报警通道</div>
      <div class="content-box">
        <div style="flex:1;margin-right:1px;height:500px;">
          <div class="title">迁移源信息</div>
          <div class="content-bottom">
            <div class="row">
              <div class="row-left">报警主机</div>
              <div class="row-right">报警主机-营业区</div>
            </div>
            <div class="row">
              <div class="row-left">资产编码</div>
              <div class="row-right">123467654</div>
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
            <OrgTree></OrgTree>
          </div>
        </div>
      </div>
      <div style="margin-top: 24px;">
        <el-button size="mini" type="primary">保存</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import OrgTree from '../../../alarmHost/OrgTree'
export default {
  components: {
    OrgTree
  },
  props: {
    isShowMove: Boolean
  },
  methods: {
    cancel() {
      this.$emit('update:isShowMove', false)
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
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
        background: #F2F2F2;
      }
      .content-bottom {
        height: 468px;
        padding: 12px;
        color: #666;
        .row {
          display: flex;
          height: 32px;
          line-height: 32px;
          .row-left {
            width: 100px;
            background: #F8F8F8;
            border: 1px solid #fff;
          }
          .row-right {
            flex: 1;
            border: 1px solid #F8F8F8;
            border-left: none;
          }
        }
      }
    }
  }
}
</style>