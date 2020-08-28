<template>
  <div class="wall">
    <div v-if="showWall" class ="quick-wall" :style="{
        width: boxWidth + 'px',
        height: boxHeight + 'px',
        position: 'relative',
        background: '#eaeaea',
        padding: '5px',
        left: 308-boxWidth > 0 ? (308-boxWidth) / 2 + 'px' : 0,
        top: 180-boxHeight > 0 ? (180-boxHeight) / 2  + 'px' : 0}">
      <div class="monitor" v-for="(info, i) in infos" :key="i">
        <div class="channel" :class="{alarm: !info.use, checked: checkedIndex === i + '-' + index}" v-for="index in info.paneCount"
        :style="[styCompute(info.paneCount, index)]" :key="i + '-' + index"
        @click="clickHandler(i + '-' + index, info)">
        </div>
      </div>
    </div>
    <div v-else class="bg-wall">
      请添加电视墙,再进行操作
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    camera: {
      type: Object
    },
    isPlayback: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedIndex: null,
      infoList: [],
      layout: {},
      row: 0,
      clo: 0
    }
  },
  created() {
    // let params = { // 后期接口遗留字段
    //     orgId: this.camera.orgId,
    //     keyPartId: this.camera.keyPartId
    // }
    let params = {}
    this.getTvWallMenuList(params).then((res) => {
      if (res.data.code === 0) {
        this.dealWallData(res.data.data)
        // let data =  {
        //   'results': [{
        //     'id': '29',
        //     'name': 'b20',
        //     'position': '1',
        //     'type': 1,
        //     'rtlayout': {
        //       'type': 2,
        //       'name': '默认布局',
        //       'row': 10,
        //       'column': 10,
        //       'wallId': '29',
        //       'id': '292',
        //       'createdAt': '2020-08-24 10:30:18',
        //       'updatedAt': '2020-08-24 10:30:18'
        //     },
        //     'rtscene': {
        //       'name': '默认场景',
        //       'type': 2,
        //       'layoutId': '292',
        //       'sceneInfo': [{
        //         'monitor': 3,
        //         'channel': 1,
        //         'wndType': 1,
        //         'paneCount': 6,
        //         'rids': [{
        //           'code': 1
        //         }],
        //         'name': '1.10输出通道1',
        //         'deviceId': '7'
        //       }, {
        //         'monitor': 21,
        //         'channel': 1,
        //         'wndType': 1,
        //         'paneCount': 16,
        //         'rids': [{
        //           'code': 1
        //         }],
        //         'name': '1.10输出通道1',
        //         'deviceId': '7'
        //       }, {
        //         'monitor': 40,
        //         'channel': 1,
        //         'wndType': 1,
        //         'paneCount': 4,
        //         'rids': [{
        //           'code': 1
        //         }],
        //         'name': '1.10输出通道1',
        //         'deviceId': '7'
        //       }, {
        //         'monitor': 4,
        //         'channel': 2,
        //         'wndType': 1,
        //         'paneCount': 9,
        //         'rids': [{
        //           'code': 1
        //         }],
        //         'name': '1.10输出通道2',
        //         'deviceId': '7'
        //       }],
        //       'wallId': '29',
        //       'id': '425',
        //       'createdAt': '2020-08-24 10:30:18',
        //       'updatedAt': '2020-08-24 10:30:18'
        //     },
        //     'linkWall': 1,
        //     'createdAt': '2020-08-09 16:07:07',
        //     'updatedAt': '2020-08-24 10:40:15'
        //   }],
        //   'total': 3
        // }
        // this.dealWallData(data)
      }
    })
  },
  computed: {
    boxWidth() {
      let oneWidth = 75
      return oneWidth * this.layout.column + 10
    },
    boxHeight() {
      let oneHeight = 43
      return oneHeight * this.layout.row + 10
    },
    showWall() {
      return this.layout.row > 0
    }
  },
  watch: {
    layout: {
      handler(val) {
         this.infoList = []
        let count = 0
        if (this.layout) {
          count = this.layout.column * this.layout.row
        }
        this.infoList = this.setWallList(count)
        this.infos = this.infoList
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(['openWall', 'getTvWallMenuList']),
    // 设置电视墙所需窗口数组
    setWallList(count) {
      const list = []
      if (count === 0 || !count) {
        return this.infoList
      }
      const key =  this.layout.enableController ? 'code' : 'monitor'
      for (let i = 0; i < count; i++) {
        let obj = {
          use: false,
          paneCount: 1
        }
        obj[key] = i +　1
        list.push(obj)
      }

      const sc = this.layout.enableController ? this.layout.rtlayout : this.layout.rtscene
      const infoData = sc && this.layout.enableController ? sc.wininfo : sc.sceneInfo
      if (infoData) {
        infoData.forEach((item, index) => {
          const mInfo = this.$lodash.find(list, it => it[key] === item[key])
          if (mInfo) {
            mInfo.paneCount = item.paneCount
            mInfo.use = true
          }
        })
      }

      return list
    },
    styCompute(count, index) {
      return this.getLayoutStyle(count)[index - 1]
    },
    clickHandler(index, info) {
      if (index === this.checkedIndex) {
        this.checkedIndex = null
      } else {
        this.checkedIndex = index
        this.$emit('checkWall', index)
        this.addToWall(this.camera, info, index)
      }
    },
    addToWall(resInfo, info, index) { // todo 自己在外部构造调用接口所需的数据
      const arr = index.split('-')
      const key =  this.layout.enableController ? 'code' : 'monitor'
      let windowsRect = {
        paneCount: Number(arr[1])
      }
      windowsRect[key] = info[key]
      let params = {
        rid: resInfo.id,
        wallId: this.layout.id,
        windowsRect
      }
      if (this.isPlayback) {
        this.$emit('addToWall', params)
      } else {
        this.$emit('comfirm', params)
      }
    },
    findResource(index) {
      const arr = index.split('-')
      const monitorcode = +arr[0]
      const pane = +arr[1]
      const info = this.infos[monitorcode]
      return info.resources[pane]
    },
    dealWallData(res) { // 处理上墙的逻辑
      let _this = this
      let wallInfo = res && res.results
      // 改造数据
      wallInfo.forEach(wall => {
        if (wall.linkWall === 1) { // 过滤出默认电视墙
          wall.column = wall.rtlayout.column
          wall.row = wall.rtlayout.row
          wall.enableController = wall.type === 2
          _this.layout = wall
        }
      })
    },
    getLayoutStyle(paneCount) { // 获取布局信息
      let panes = []
      let width3 = 100 / 3 + '%'
      let width6 = 200 / 3 + '%'
      switch (paneCount) {
        case 1:
          panes = [
            { left: 0, top: 0, width: '100%', height: '100%', position: 'absolute' }
          ]
          break
        case 4:
          panes = [
            { left: 0, top: 0, width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: '50%', top: 0, width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: 0, top: '50%', width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: '50%', top: '50%', width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' }
          ]
          break
        case 6:
          panes = [
            { left: 0, top: 0, width: `calc(${width6} - 1px)`, height: `calc(${width6} - 1px)`, position: 'absolute' },
            { left: width6, top: 0, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: width3, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: 0, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width3, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' }
          ]
          break
        case 8:
          panes = [
            { left: 0, top: 0, width: '75%', height: '75%', position: 'absolute' },
            { left: '75%', top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: 0, top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' }
          ]
          break
        case 9:
          panes = [
            { left: 0, top: 0, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width3, top: 0, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: 0, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: 0, top: width3, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width3, top: width3, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: width3, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: 0, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width3, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' }
          ]
          break
        case 16:
          panes = [
            { left: 0, top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: 0, top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: 0, top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: 0, top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' }
          ]
          break
        default:
          panes = [
            { left: 0, top: 0, width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: '50%', top: 0, width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: 0, top: '50%', width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: '50%', top: '50%', width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' }
          ]
          break
      }
      return panes
    }
  }
}
</script>
<style scoped lang="less">
.bg-wall {
  width: 150px;
  height: 50px;
  text-align: center;
  line-height: 50px;
}
.wall {
  overflow: auto;
  text-align: center;
  height: 100%
  // border: 1px solid #00a5e3;
}
.quick-wall {
  position: relative;
}
.monitor,
.channel {
  display: inline-block;
  vertical-align: middle;
}

.monitor {
  position: relative;
  width: 72px;
  height: 40px;
  margin: 1.5px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  line-height: 0;
}

.channel {
  margin: 0.5px;
  background: rgb(153, 153, 153);
  box-sizing: border-box;
}

.channel.alarm {
  background: #fff;
}

.channel.checked {
  border: 1px solid #ed3f14;
  background: darkslategray !important;
}
</style>
