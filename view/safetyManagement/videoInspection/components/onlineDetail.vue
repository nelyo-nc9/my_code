<template>
  <div>
    <div :visible.sync="modalShow" :close-on-press-escape="false" :show-close="false" width="800px" :fullscreen="isFullscreen" :close-on-click-modal="false" @mousedown.stop @mouseup.stop class="Vmodel">
      <div class="modol-body" ref='modelBody'>
        <div class="modol-body-left lf" ref='modolBodyLeft'>
          <div class="modol-body-left-title">
            日期
          </div>
          <ul class="modol-body-left-details" ref='modolBodyLeftDetails'>
            <li v-for='(item, index) in timeData' :key='index' class="modol-body-left-details-list">
              {{item}}
            </li>
          </ul>
        </div>
        <ul class="modol-body-left-details rt" style='width:75px;text-align: center' v-if='!isDevice'>
          <li class="list-title"></li>
          <li v-for='(item, index) in timeData' :key='index' class="modol-body-left-details-list">
            {{index % 2 === 0 ? '录像详情' : '在线详情'}}
          </li>
        </ul>
        <div class="modol-body-right rt" ref="childBox" :style="{width: `calc(100% - ${isDevice ? '100px' : '175px'})`}">
          <OnlineTime v-if="modalShow" ref="child" :isDevice='isDevice' :isFullScreen='isFullscreen' :timeAllHeight='timeAllHeight' :timeData='timeData' :detailData='detailData' :headerShow='true' :offlineColor='offlineColor' :basicColor='basicColor' :onlineColor='onlineColor' :onlineName="onlineName" :offlineName="offlineName" :baseName="baseName"></OnlineTime>
        </div>
        <div v-if='timeData.length === 0' class="no-data">{{detailsLoading?"数据正在加载中...":"暂无数据"}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import OnlineTime from './onlineTime.vue'
export default {
  name: 'OnlineDetail',
  components: {
    OnlineTime
  },
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    onlineColor: {
      type: String,
      default: '#4699f9'
    },
    basicColor: {
      type: String,
      default: '#0f2343'
    },
    offlineColor: {
      type: String,
      default: '#ddd'
    },
    timeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    detailData: {
      type: Array,
      default: () => {
        return []
      }
    },
    deviceName: {
      type: String
    },
    ModalHeight: {
      type: Number,
      default: 800
    },
    counts: {
      type: Number,
      default: 0
    },
    modalName: {
      type: String,
      default: '设备在线详情'
    },
    onlineName: {
      type: String,
      default: '在线'
    },
    offlineName: {
      type: String,
      default: '离线'
    },
    baseName: {
      type: String,
      default: '未知'
    },
    isDevice: {
      type: Boolean,
      default: true
    },
    pageNumArray: {
      type: Array,
      default: () => [7, 15]
    },
    pageNumProp: {
      type: Number,
      default: 15
    },
    detailsLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // pickerOptions: { // 超出当前时间禁用
      //   disabledDate(time) {
      //     return time.getTime() > Date.now()
      //   }
      // },
      dataType: 0,
      timeAllHeight: 448,
      afterFullscreen: 600,
      isFullscreen: false,
      // showSizer: true,
      // pages: 1,
      // showTimeData: [],
      // showDetailData: []
      selDateVal: [this.$moment(new Date().getTime() - 14 * 24 * 3600 * 1000).format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
    }
  },
  watch: {
    modalShow(newVal, oldVal) {
      this.page = 1
      if (!newVal) { return }
      // this.$refs.modelBody.style.height = '448px'
      setTimeout(() => {
        this.timeAllHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 42
        this.selDateVal = [this.$moment(new Date().getTime() - 14 * 24 * 3600 * 1000).format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      }, 0)
    },
    pageNum(newVal, oldVal) {
      if (!newVal) { return }
      setTimeout(() => {
        this.timeAllHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 42
      }, 0)
    },
    pageNumProp(val) {
      this.pageNum = this.pageNumProp
    },
    isFullscreen(newVal, oldVal) {
      if (newVal === oldVal) { return }
      this.$refs.child.fullscreen()
    },
    dataType() {
      this.page = 1
      this.sendData()
    },
    timeData: {
      handler() {
        setTimeout(() => {
          if (this.$refs.modolBodyLeftDetails) {
            this.timeAllHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 42
          }
        }, 0)
      },
      deep: true
    }
  },
  created() {
    this.pageNum = this.pageNumProp
    console.log(this.timeData);
    console.log(this.detailData);
  },
  mounted() {
    this.$refs.online.style.backgroundColor = this.onlineColor
    this.$refs.offline.style.backgroundColor = this.offlineColor
    this.$refs.baseColor.style.backgroundColor = this.basicColor
    this.sendData()

  },
  beforeDestroy() {
    window.onresize = null
    document.onkeydown = null
  },
  methods: {
    searchData() {
      this.page = 1
      this.sendData()
      // this.$emit('searchData', this.selDateVal)
    },
    sendData() { // 向父组件发送配置信息
      const data = {}
      data.page = this.page
      data.limit = this.pageNum
      data.selDateVal = this.selDateVal
      if (this.dataType === 0) {
        data.onlineRate = ''
      } else {
        data.onlineRate = this.dataType
      }
      this.$emit('sendData', data)
    },
    cancel() { // 关闭
      this.$emit('cancel', false)
      this.dataType = 0
      if (this.isFullscreen) {
        this.isFullscreen = !this.isFullscreen
      }
    },

    // amplification() { // 调用子组件放大事件
    //   this.$refs.child.amplification()
    // },
    // shrink() { // 调用子组件缩小事件
    //   this.$refs.child.shrink()
    // },
  }
}
</script>

<style scoped lang="less">
.Vmodel {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.lf {
  float: left;
}
.rt {
  float: right;
}
.rt-selDate {
  float: right;
  margin-right: 12px;
}
// .title-header {
//   color: @dialog-header-text-color;
// }
.modol-header {
  overflow: hidden;
  margin-bottom: 12px;
}
.modol-header /deep/ .ivu-btn {
  margin-right: 12px;
}
.modol-body {
  overflow-y: auto;
  overflow-x: hidden;
  height: 448px;
}
.modol-body-left {
  width: 100px;
  text-align: center;
}
.modol-body-left-title {
  background-color: #ccc;
  // background-color: @tree-tabs-item-bg-color;
  height: 32px;
  line-height: 32px;
}
.list-title {
  height: 32px;
  line-height: 32px;
}
.modol-body-right {
  height: 100%;
}
.modol-body-left-details-list {
  height: 16px;
  margin-top: 10px;
  line-height: 17px;
}
.full-style {
  cursor: pointer;
  color: #8597ad;
  transition: all 0.25s linear;
}
.full-style:hover {
  color: #fff;
}
.footer {
  /* overflow: hidden; */
  height: 32px;
  clear: both;
}
.cancel {
  margin-left: 24px;
}
.garden {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  margin: 8px;
}
.garden-box {
  line-height: 32px;
  margin-left: 12px;
}
.no-data {
  position: absolute;
  top: 45%;
  left: 0px;
  right: 0px;
  text-align: center;
}
</style>
