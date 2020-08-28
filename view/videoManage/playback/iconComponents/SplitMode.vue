<template>
  <div class="dp-con" ref="split" @mouseleave="splitMouseleave">
    <!-- 区分同步异步 ul上也要加 && !isSync -->
    <!-- <i
      class="icon iconfont"
      :class="[segmentModal && !isSync ?'icon-tuichufenduanhuifang':'icon-fenduanbofang',selectedObj.isPlay && !isSync ? '':'disable']"
      @mouseenter="isSegmentModal"
      :title="segmentModal && !isSync ? '关闭分段回放' : '分时段回放'"
    ></i> -->
    <!-- 不区分同步异步 -->
    <i
      class="icon iconfont"
      :class="[segmentModal ?'icon-tuichufenduanhuifang':'icon-fenduanbofang',selectedObj.isPlay ? '':'disable']"
      @mouseenter="isSegmentModal"
      :title="segmentModal ? '关闭分段回放' : '分时段回放'"
    ></i>
    <ul v-show="selectedObj.isPlay && segmentModal" class="segPlay">
      <i class="rotate"></i>
      <p>
        <el-time-picker
          is-range
          size="mini"
          v-model="value4"
          range-separator="-"
          format="HH:mm"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :editable="false"
          :clearable="false"
          @focus="timeFocus"
          @change="timeChange"
          @blur="timeBlur"
        ></el-time-picker>
      </p>
      <li
        v-for="segment in segmentList"
        :key="'segment' + segment.value"
        @mouseenter="hoverShowscreen=segment.value"
        @mouseleave="hoverShowscreen=segNum"
        @click="segmentSelectScreen(segment.value)"
        :class="{active: segment.value===hoverShowscreen}"
      >{{segment.label}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'SplitMode',
  inheritAttrs: false,
  data() {
    return {
      segmentModal: false,
      isBranchPlay: true,
      hoverShowscreen: 4,
      segNum: 4,
      segmentList: [
        { value: 4, label: '4段' },
        { value: 9, label: '9段' },
        { value: 16, label: '16段' }
      ],
      segTime: ['00:00', '23:59'],
      value4: [new Date(2020, 9, 10, 0, 0), new Date(2020, 9, 10, 23, 59)],
      isSync: false,
      segmentTimeArr: [],
      playType: 'file',
      isTimePopup: false
    }
  },
  mounted() {
    // var tY = new Date().getFullYear()
    // var tM = new Date().getMonth() + 1
    // var tD = new Date().getDate()
    // this.value4 = [new Date(tY, tM, tD, 0, 0), new Date(tY, tM, tD, 23, 59)]
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isSyncF: {
      type: Boolean
    }
  },
  watch: {
    isSyncF() {
      // 判断是同步还是异步 同步true 异步false
      this.isSync = this.isSyncF
    },
    'selectedObj.isPlay': {
      handler(val, olval) {
        if (val && this.isBranchPlay) {
          this.segmentPlay()
        }
      },
      deep: true
    }
    // selectedObj: {
    //   handler(val, olval) {
    //     console.log('数据是不是更新===============================================', val, olval)
    //   },
    //   deep: true
    // }
  },
  methods: {
    timeFocus() {
      this.isTimePopup = true
    },
    timeChange() {
      // console.log('我获得新的值了')
      this.isTimePopup = false
      // this.segmentModal = false
    },
    timeBlur() {
      // console.log('我失去焦点了')
      this.isTimePopup = false
      // this.segmentModal = false
    },
    splitMouseleave() {
      if (!this.isTimePopup) {
        this.segmentModal = false
      }
    },
    setPlaytype(playtype) {
      this.playtype = playtype
    },
    isSegmentModal() {
      // console.log(this.selectedObj.isPlay, this.segmentModal, this.isSync, '这是加载的现有的数据------------------')
      // 判断当前窗口是否播放
      if (this.selectedObj.isPlay) {
        // this.segmentModal = !this.segmentModal
        // 打开分段回放选择
        this.segmentModal = true
      }
    },
    segmentPlay() {
      console.log('segmentPlay!!', this.selectedObj)
      // 判断当前窗口是否播放
      if (this.selectedObj.isPlay) {
        // 现在不管是同步异步也好都能使用分段回放按钮
        // 异步中心回放，和异步前端双击节点回放都是按时间回放
        // 只有异步前端双击录像列表项才是按文件回放
        // let playType = this.selectedObj
        // 按文件回放，开始结束时间是当前文件的开始结束时间
        // var tempTime = this.selectedObj.result.sTime
        if (this.selectedObj.playType === 'file') {
          this.value4 = [new Date(this.selectedObj.result.startTime), new Date(this.selectedObj.result.endTime)]
          console.log(this.value4, '文件时间节点')
        } else {
          // 按时间回放，开始结束时间是00:00 -- 23:59
          // var tempTime = this.selectedObj.result.sTime
          var stY = new Date().getFullYear()
          var stM = new Date().getMonth() + 1
          var stD = new Date().getDate()
          // var stH = new Date().getHours()
          // var stm = new Date().getMinutes()
          this.value4 = [new Date(stY, stM, stD, 0, 0), new Date(stY, stM, stD, 23, 59)]
          console.log('==========', this.value4)
        }
        // this.segmentModal = !this.segmentModal
        this.$emit('iconClick', 'splitOpen', this.segmentModal)
      }
    },
    // 分段保存
    segmentSelectScreen(i) {
      this.segmentModal = false // 关闭展示
      this.isBranchPlay = false
      var sT =
        (this.value4[0].getHours() > 10 ? this.value4[0].getHours() : '0' + this.value4[0].getHours()) +
        ':' +
        (this.value4[0].getMinutes() > 10 ? this.value4[0].getMinutes() : '0' + this.value4[0].getMinutes())
      var eT =
        (this.value4[1].getHours() > 10 ? this.value4[1].getHours() : '0' + this.value4[1].getHours()) +
        ':' +
        (this.value4[1].getMinutes() > 10 ? this.value4[1].getMinutes() : '0' + this.value4[1].getMinutes())
      this.segTime = [sT, eT]
      this.segNum = i
      // console.log('获取分段时间-----------', this.segTime, this.segNum)
      this.getSegmentTime()
    },
    chengeSegTime(time) {
      const date = new Date()
      const t = time.split(':')
      date.setHours(t[0] || 0)
      date.setMinutes(t[1] || 0)
      date.setSeconds(t[2] || 0)
      return date.getTime()
    },
    // 生成分段时间
    getSegmentTime() {
      this.segmentTimeArr = []
      this.segStime = this.chengeSegTime(this.segTime[0])
      this.segEtime = this.chengeSegTime(this.segTime[1])
      const interval = (this.segEtime - this.segStime) / this.segNum
      for (let index = 0; index < this.segNum; index++) {
        var obj = {
          startTime: parseInt((this.segStime + interval * index) / 1000),
          endTime: parseInt((this.segStime + interval * (index + 1)) / 1000)
        }
        this.segmentTimeArr.push(obj)
      }
      console.log(this.segmentTimeArr, ' this.segmentTimeArr this.segmentTimeArr')
      var data = {
        dataArr: this.segmentTimeArr,
        curNum: this.segNum,
        selectedObj: this.selectedObj.result
      }
      this.$emit('iconClick', 'splitSegTime', data)
    }
  }
}
</script>
<style lang="less">
</style>
<style lang='less' scoped>
.dp-con {
  position: relative;
  display: inline-block;
  .icon {
    padding: 0 8px;
    cursor: pointer;
    font-size: 20px;
    color: #333333;
  }
  .disable {
    cursor: not-allowed;
    color: #ccc;
  }
  ul {
    position: absolute;
    background-color: #2d72d3;
    list-style: none;
    color: snow;
    text-align: center;
    line-height: 40px;
    padding: 0 6px;
    border-radius: 4px;
    top: 7px;
    i {
      display: block;
      position: absolute;
      background: #2d72d3;
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      top: 13px;
    }
    li {
      display: inline;
      white-space: nowrap;
      line-height: 40px;
      padding: 0 8px;
      border-right: 1px solid hsla(0, 0%, 100%, 0.1);
      cursor: pointer;
      .sub-stream-check {
        position: absolute;
        left: -100px;
        width: 100px;
        height: 40px;
        line-height: 40px;
      }
    }
    .active {
      color: #fda54b;
    }
  }
}
ul.segPlay {
  width: 338px;
  right: 36px;
  p {
    width: 185px;
    display: inline-block;
    .el-date-editor {
      width: 100%;
    }
  }
  i {
    left: 330px;
  }
}
</style>
