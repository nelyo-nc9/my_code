<template>
  <div id="airlockLogDetail">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="560px"
      :center="true">
      <div class="log-detail">
        <div class="log-detail-item">
          <p class="log-detail-item-label">设备</p>
          <div class="log-detail-item-content">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>{{ detailInfo.mechanism }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ detailInfo.keyParts }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ detailInfo.equipment }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="log-detail-item">
          <p class="log-detail-item-label">事件类型</p>
          <div class="log-detail-item-content">
            <span>报警</span>
            <span>-</span>
            <span>人员倒地</span>
          </div>
        </div>
        <div class="log-detail-item">
          <p class="log-detail-item-label">开始时间</p>
          <div class="log-detail-item-content">{{ detailInfo.startTime }}</div>
        </div>
        <div class="log-detail-item">
          <p class="log-detail-item-label">备注</p>
          <div class="log-detail-item-content">处理人员倒地</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '查询结果',
      dialogVisible: true
    }
  },
  props: {
    detailInfo: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less">
  #airlockLogDetail {
    .log-detail {
      .log-detail-item {
        height: 60px;

        .log-detail-item-label {
          height: 24px;
          line-height: 24px;
        }

        .log-detail-item-content {
          height: 24px;
          line-height: 24px;
        }
      }
    }
  }
</style>
