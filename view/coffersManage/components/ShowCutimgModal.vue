<!--
 * @Author: yanglei
 * @Date: 2020-06-06 17:12:34
 * @LastEditTime: 2020-08-02 19:29:48
 * @LastEditors: yanglei
 * @Description:
 * @FilePath: \ccb-client\client\src\view\coffersManage\components\ShowCutimgModal.vue
-->

<template>
  <div class="show-cutimg-container">
    <el-dialog
      title="查看截图"
      :visible.sync="showCutImg"
      :before-close="closeModal"
      :modal="needModal"
      width="30%">
      <div class="img-container">
        <el-image
          style="width: 100%; height: 100%"
          :src="imgSrc"
          fit="cover"></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showCutImg: {
      type: Boolean,
      default: false
    },
    imgSrc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      needModal: false
    }
  },
  methods: {
    /**
     * @description: 通知父组件关闭查看截图对话框
     * @param {type} 无
     * @return: 无
     */
    closeModal() {
      this.$emit('closeCutImg', 'image')
    }
  }
}
</script>

<style lang="less" scoped>
.show-cutimg-container {
  .el-dialog__body {
    .img-container {
      height: 600px;
    }
  }
}
</style>
