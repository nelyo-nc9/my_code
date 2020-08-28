<!--
 * @Author: dfk
 * @Date: 2020-08-08 22:19:21
 * @LastEditTime: 2020-08-13 17:20:57
 * @LastEditors: dfk
 * @Description:
-->
<template>
  <i
    class="icon iconfont icon-screenshot"
    :class="[selectedObj.isPlay && !isSync ? '':'disable']"
    title="截图"
    @click="getCapture"
  ></i>
</template>

<script>
import { screenShootApi } from '@src/http/video/videoPreview.api.js'
export default {
  name: 'ScreenShot',
  inheritAttrs: false,
  data() {
    return {
      isSync: false
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {}
    },
    isSyncF: {
      type: Boolean
    },
    pluginDom: {
      type: Function,
      default: () => {}
    },
    checkedPane: {
      type: Number,
      default: 0
    }
  },
  watch: {
    isSyncF() {
      this.isSync = this.isSyncF
    }
  },
  methods: {
    async getCapture() {
      if (this.selectedObj.isPlay && !this.isSync) {
        this.$emit('iconClick', 'getPic')
      }
      if (!this.selectedObj.isPlay) {
        return
      }
      let Base64Data = await new Promise(resolve => {
        let src = ''
        let i = 5
        while (i-- && !src) {
          src = this.pluginDom(this.checkedPane).GetRealPicturebyBase64(1, 50)
        }
        resolve(src)
      })

      let param = {
        base64Img: Base64Data,
        channelId: this.selectedObj.previewData.channelId
      }
      screenShootApi(param).then(res => {
        console.log(res, '截图-res')
        this.$messageSuccess('截图上传成功！', '成功')
      }).catch(err => {
        console.log(err, '截图-err')
        this.$messageError('截图上传失败，请稍后重试！', '错误')
      })
    }
  }
}
</script>
<style lang='less' scoped>
.icon {
  padding: 0 8px;
  cursor: pointer;
  font-size: 20px;
  color: #333333;
}
</style>
