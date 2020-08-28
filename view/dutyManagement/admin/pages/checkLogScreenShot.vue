<!--
 * @Author: your name
 * @Date: 2020-06-05 17:46:06
 * @LastEditTime: 2020-06-05 20:02:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\admin\pages\checkLogScreenShot.vue
-->
<!--
 * @Author: your name
 * @Date: 2020-06-01 21:18:14
 * @LastEditTime: 2020-06-05 11:36:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\index.vue
-->
<template>
  <div class="check-log-screen-shot">
    <!-- 事件记录-查看图片弹窗 -->
      <div v-if="screenShotVisible" class="photo">
        <el-dialog title="查看截图" :visible.sync="screenShotVisible" width="600px" :before-close="checkLogScreenshotHandleClose">
          <div style="height:300px;">这是一张截图</div>
        </el-dialog>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    screenShotVisible: {
      type: Boolean,
      default: false
    }
  },
  name: 'checkLogScreenShot',
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    checkLogScreenshotHandleClose() {
      this.$emit('closeScreenshot')
    }
  }
}
</script>

<style scoped lang="less">
.check-log-screen-shot {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}
/deep/.el-dialog__body {
  height: 300px!important;
}
.photo /deep/.el-dialog {
  height: 300px!important;
  min-height:400px;
}
</style>
