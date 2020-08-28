<!--
 * @Author: shikai
 * @Date: 2020-07-10 02:01:03
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-10 02:31:57
-->
<!--
 * @Author: shikai
 * @Date: 2020-07-09 21:08:34
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-10 01:03:07
-->
<template>
  <div>
    <div class="form-box mab20">
      <div class="box-title">导出报警主机列表</div>
    </div>
    <div class="flex-row mab20">
      <div class="label">文件位置</div>
      <div class="voice-upload">
        <el-input
          v-model="voiceValue"
          placeholder="未选择任何文件"
          :disabled="true"
          size="mini"
          style="margin-right:20px;"
        ></el-input>
        <el-upload
          action=""
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :limit="1"
          accept
          :show-file-list="false"
          style="height: 0;"
        >
        </el-upload>
      </div>
      <el-button size="mini">浏览</el-button>
    </div>
    <div class="from-bottom">
      <el-button size="mini">导出</el-button>
      <el-button size="mini" @click="goBack()">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      voiceValue: ''
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack', 'list')
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {},
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {},
    // 格式限制
    beforeAvatarUpload(file) {
      const isWav = file.type === 'audio/wav'
      if (!isWav) {
        this.$notify.warning({
          message: '上传文件格式只能是WAV格式!',
          title: '警告'
        })
      }
      return isWav
    },
    // 上传成功
    handleAvatarSuccess(res, file, fileList) {
      //   console.log('上传成功', res, file, fileList)
      // this.voiceValue = file.name
    }
  }
}
</script>

<style lang="less" scoped>
.box-title {
  position: relative;
  height: 24px;
  line-height: 24px;
  color: #606266;
  i {
    position: absolute;
    top: 50%;
    left: 100px;
    transform: translateY(-50%);
  }
  &::after {
    display: block;
    content: '';
    border-top: 1px solid #e1e1e1;
    width: calc(~'100% - 120px');
    margin-left: 120px;
    margin-top: -12px;
  }
}

.el-table::before {
  background: none;
}
</style>
