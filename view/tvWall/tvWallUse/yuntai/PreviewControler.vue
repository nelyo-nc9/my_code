<template>
  <div id="controler">
    <div class="yunnan">
      <div class="title">云台控制
        <i :class="dropdownStatus.yunCtrl ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="dropdownStatus.yunCtrl = !dropdownStatus.yunCtrl"></i>
      </div>
      <div class="yunnanCtrl" v-if="dropdownStatus.yunCtrl">
        <BasicsCtrl :showMore='showMore'></BasicsCtrl>
      </div>
    </div>
    <div class="imageEdjust">
      <div class="title">
        图像调节
        <i :class="dropdownStatus.imgCtrl ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="dropdownStatus.imgCtrl = !dropdownStatus.imgCtrl"></i>
        <i class="iconfont icon-fuwei" style="position: absolute;right: 15px;" title="恢复默认图像" @click="reDefault"></i>
      </div>
      <div v-if="dropdownStatus.imgCtrl" style="width:100%;">
        <div class="slider">
          <b>亮度</b>
          <div class="slider-box">
            <slider color="#2D71D3" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setPicCfg' @change="setPicCfg" v-model="brightness">
            </slider>
          </div>
        </div>
        <div class="slider">
          <b>锐度</b>
          <div class="slider-box">
            <slider color="#2D71D3" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setPicCfg' @change="setPicCfg" v-model="sharpness">
            </slider>
          </div>
        </div>
        <div class="slider">
          <b>色度</b>
          <div class="slider-box">
            <slider color="#2D71D3" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setPicCfg' @change="setPicCfg" v-model="hue">
            </slider>
          </div>
        </div>
        <div class="slider">
          <b>饱和度</b>
          <div class="slider-box">
            <slider color="#2D71D3" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setPicCfg' @change="setPicCfg" v-model="saturation">
            </slider>
          </div>
        </div>
        <div class="slider">
          <b>对比度</b>
          <div class="slider-box">
            <slider color="#2D71D3" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setPicCfg' @change="setPicCfg" v-model="contrast">
            </slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from './Slider'
import BasicsCtrl from './BasicsCtrl'
export default {
  components: {
    Slider,
    BasicsCtrl
  },
  data() {
    return {
      dropdownStatus: {
        yunCtrl: true,
        imgCtrl: true
      },
      picConfig: '',
      setPicCfg: '',
      showMore: true,
      brightness: 50, // 亮度 Brightness
      sharpness: 50, // 锐度 Sharpness
      hue: 50, // 色度 Chroma
      saturation: 50, // 饱和度 Saturation
      contrast: 50 // 对比度 Contrast
    }
  },
  computed: {
    plugin() {
      return this.$parent.$refs.preview
    },
    pluginStatus() {
      return this.$parent.$refs.preview.videoStatusArr[this.$parent.$refs.preview.checkedPane]
    }
  },
  watch: {
    'plugin.checkedPane'() {
      if (!this.pluginStatus.isPlay) {
        this.initPicCfg()
        return
      }
      this.getPicCfg()
    },
    'pluginStatus.isPlay'() {
      this.getPicCfg()
    }
  },
  methods: {
    initPicCfg() { // 图像调节默认参数
      this.brightness = 50
      this.sharpness = 50
      this.hue = 50
      this.saturation = 50
      this.contrast = 50
    },
    getPicCfg() {
      this.initPicCfg()
      const res = this.plugin.videoPageData[this.plugin.checkedPane]
      console.log(res)
      if (!res) { return }
      const param = {
        devIp: res.devIp,
        port: res.devCport,
        channel: Number(res.channel)
      }
      this.$nextTick(() => {
        this.plugin.GetPlayerPicParam(param) // 和插件沟通过，实际不需要传参数，获取的当前选中焦点窗口插件的信息
          .then(res => {
            this.picConfig = res
            const data = JSON.parse(res)
            if (!data.success) { return }
            this.brightness = +data.Brightness || 50
            this.sharpness = +data.Sharpness || 50
            this.hue = +data.Chroma || 50
            this.saturation = +data.Saturation || 50
            this.contrast = +data.Contrast || 50
          }).catch(err => err)
      })
    },
    _setPicCfg() {
      if (!this.pluginStatus.isPlay) { return }
      const param = {
        Brightness: this.brightness + '',
        Chroma: this.hue + '',
        Saturation: this.saturation + '',
        Contrast: this.contrast + ''
      }
      this.plugin.SetPlayerPicParam(JSON.stringify(param)).then(item => {
        console.log('图像调节返回值', item)
      })
    },
    /**
     * 恢复默认图像
     */
    reDefault() {
      if (!this.pluginStatus.isPlay) { return }
      const param = this.picConfig
      param && this.plugin.SetPlayerPicParam(param)
      this.getPicCfg()
    }
  },
  created() {
    // 使用lodash的防抖动方法
    this.setPicCfg = this.$lodash.debounce(this._setPicCfg.bind(this), 50)
  },
  beforeDestroy() {
    delete this.setPicCfg
  }
}
</script>

<style lang="less" scoped>
#controler {
  width: 100%;
  height: 100%;
  background: #fff;
  .yunnan {
    width: 100%;
    margin-bottom: 15px;
    background: #fff;
    .title {
      height: 36px;
      line-height: 36px;
      color: #333;
      padding: 0 20px 0 10px;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .yunnanCtrl {
      height: calc(100% - 56px);
      padding-bottom: 20px;
      border-bottom: 1px solid #E1E1E1;
    }
  }
  .imageEdjust {
    width: 100%;
    min-height: 220px;
    overflow: auto;
    background: #fff;
    .title {
      height: 36px;
      line-height: 36px;
      color: #333;
      padding: 0 20px 0 10px;
      font-size: 14px;
    }
    .slider {
      width: 100%;
      height: 40px;
      padding: 5px 10px;
      b {
        float: left;
        height: 30px;
        line-height: 30px;
        width: 40px;
        color: #656565;
        text-align: center;
        font-size: 12px;
        font-weight: normal;
        user-select: none;
      }
      .slider-box {
        float: left;
        width: 210px;
      }
      input[type="text"] {
        margin: 0 !important;
      }
    }
  }
}

.yunnanCtrl:after,
.dome-box:after,
.imageEdjust .slider:after,
.clearFloat:after {
  display: block;
  content: "";
  clear: both;
}

// .model {
//   width: 100%;
//   margin: 10px 0;
//   height: 30px;
// }
// .model > div {
//   display: inline-block;
//   width: 26%;
//   height: 30px;
//   background: #3c5073;
//   color: #cacaca;
//   margin: 0 3%;
//   border-radius: 3px;
//   line-height: 30px;
//   text-align: center;
//   cursor: pointer;
// }
// .model > div.active {
//   color: #fff;
//   background: #4699f9;
// }
</style>
