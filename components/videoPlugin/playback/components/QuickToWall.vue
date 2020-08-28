<template>
  <div class="wall">
    <div v-if="showWall" class="quick-wall" :style="{width: boxWidth, height: boxHeight, position: 'relative'}">
      <div class="monitor" v-for="(info, i) in infos" :key="i" :style="setStyle(info)">
        <div class="channel" :class="{alarm: info.type === 2 || !info.use, checked: checkedIndex === i + '-' + index}" :style="{width: cwd(info.panecount), height: cht(info.panecount)}" v-for="index in info.panecount" :key="info._id+index" @click="clickHandler(i + '-' + index, info)"></div>
      </div>
    </div>
    <div v-else class="bg-wall">请添加电视墙,再操作</div>
  </div>
</template>
<script>
export default {
  props: {
    camera: {
      type: String
    },
    defaultRoleId: {
      type: String
      // default: "5be27279e74ee9376c681111"
    },
    defaultDevIp: {
      type: String
      // default: "192.168.20.42"
    },
    defaultRowIndex: {
      type: Number
      // default:0
    }
  },
  data() {
    return {
      checkedIndex: null, // 选中的当前项
      oldResource: null,
      infoList: [],
      row: 0, // 行
      clo: 0, // 列
      roleId: this.defaultRoleId,
      layout: {},
      tvwall: {},
      rtscene: { info: [] },
      enableController: false,
      nowIndex: this.defaultRowIndex, // 当前的第几个
      id: '',
      monitors: [],
      devIp: this.defaultDevIp
    }
  },
  computed: {
    infos() {
      if (this.enableController) {
        this.setControllerList()
      } else {
        let count = 0
        if (this.layout) {
          count = this.layout.column * this.layout.row
        }
        this.setList(count)
      }
      return this.infoList
    },
    boxWidth() {
      let oneWidth = 75
      return oneWidth * this.layout.column + 'px'
    },
    boxHeight() {
      let oneHeight = 43
      return oneHeight * this.layout.row + 'px'
    },
    showWall() {
      return this.layout.row > 0
    }
  },
  watch: {
    checkedIndex(index) {
      if (index !== null) {
        const resource = this.findResource(index)
        this.oldResource = resource
        this.oldIndex = index
        // this.addToWall(this.camera, index);
      } else {
        if (this.oldResource) {
          // this.addToWall(this.oldResource.resource, this.oldIndex);
          this.oldResource = this.oldIndex = null
        }
      }
    },
    camera() {
      this.oldResource = this.oldIndex = null
    }
  },
  mounted() {
    this.getTVlist()
  },
  methods: {
    getTVlist() {
      this.$http
        .get(`tvwall/wall?roleid=${this.roleId}`)
        .then(res => {
          if (res.status == 200) {
            var wall = res.data[this.nowIndex]
            this.layout = res.data[this.nowIndex].layout
            this.tvwall = wall
            if (wall.rtscene) {
              this.rtscene = res.data[this.nowIndex].rtscene
            }
            this.id = res.data[this.nowIndex]._id
            this.getMonitorListApi(this.id)
            let resule = !!res.data[this.nowIndex].jointcontroller
            this.enableController = resule
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    getMonitorListApi(id) {
      this.$http
        .get(`tvwall/wall/${id}/monitor`)
        .then(res => {
          if (res.status == 200) {
            this.monitors = res.data
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    clickHandler(index, info) {
      if (info.type === 2 || !info.use) {
        return
      }
      if (index === this.checkedIndex) {
        this.checkedIndex = null
      } else {
        this.checkedIndex = index
        this.addToWall(this.camera, index)
      }
    },
    addToWall(cameraId, index) {
      const arr = index.split('-')
      const monitorcode = +arr[0]
      const pane = +arr[1]
      const info = this.infos[monitorcode]
      var watchInfo = {
        monitor: info.monitor,
        number: pane,
        resource: cameraId
      }
      this.openWall(watchInfo)
    },
    openWall(watchInfo) {
      this.$http
        .post(`tvwall/wall/${this.id}/open`, watchInfo)
        .then(res => {
          if (res.status == 200) {
            this.$Notice.success({ title: '提示', desc: '上墙成功' })
          } else {
            this.$Notice.error({ title: '提示', desc: '上墙失败' })
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    proportionRow() {
      if (!this.layout.screeninfo) {
        return 0
      }
      // 横向
      const row = this.layout.row
      const clientWidth = +this.boxWidth.replace('px', '')
      const physicalWidth =
        this.layout.screeninfo.width * this.layout.column + (row - 1) * this.layout.screeninfo.hinterval // 物理宽度
      this.row = clientWidth / physicalWidth
    },
    proportionClo() {
      if (!this.layout.screeninfo) {
        return 0
      }
      // 纵向
      const clo = this.layout.column
      const clientHeight = +this.boxHeight.replace('px', '')
      const physicalHeight =
        this.layout.screeninfo.height * this.layout.row + (clo - 1) * this.layout.screeninfo.vinterval // 物理宽度
      this.clo = clientHeight / physicalHeight
    },
    // 设置普通电视墙所需窗口数组
    setList(count) {
      this.infoList = []
      if (count === 0) {
        return this.infoList
      }
      for (let i = 0; i < count; i++) {
        this.infoList.push({
          use: false,
          panecount: 1
        })
      }
      const sc = this.rtscene
      if (sc && sc.info) {
        sc.info.forEach(item => {
          if (item.monitor) {
            const mInfo = this.$lodash.find(this.monitors, it => it._id === item.monitor)
            if (mInfo && mInfo.position < count) {
              this.infoList[mInfo.position] = {
                ...item,
                ...mInfo,
                monitor: mInfo._id,
                use: true
              }
              this.infoList[mInfo.position]._id = item._id
            }
          }
        })
      }
    },
    // 设置拼接控制器所需窗口数组
    setControllerList() {
      this.infoList.length = 0
      this.proportionRow()
      this.proportionClo()
      if (this.layout.wininfo.length > 0) {
        this.infoList = this.layout.wininfo.map(item => {
          let obj = {
            use: false,
            panecount: 1
          }
          obj.top = `${item.top * this.clo}px`
          obj.bottom = `${item.bottom * this.clo}px`
          obj.left = `${item.left * this.row}px`
          obj.right = `${item.right * this.row}px`
          if (item.hasOwnProperty('top') && item.hasOwnProperty('bottom')) {
            obj.height = `${(item.bottom - item.top) * this.clo}px`
          }
          if (item.hasOwnProperty('left') && item.hasOwnProperty('right')) {
            obj.width = `${(item.right - item.left) * this.row}px`
          }
          for (let i = 0; i < this.rtscene.info.length; i++) {
            if (this.rtscene.info[i].monitor === item.monitor) {
              const result = {
                ...obj,
                ...this.rtscene.info[i],
                use: true
              }
              return result
            }
          }
          return obj
        })
      }
    },
    cwd(count) {
      const c = Math.sqrt(count)
      const wd = (1 / c) * 100 + '%'
      return `calc(${wd} - 1px)`
    },
    cht(count) {
      const c = Math.sqrt(count)
      const ht = (1 / c) * 100 + '%'
      return `calc(${ht} - 1px)`
    },
    findResource(index) {
      const arr = index.split('-')
      const monitorcode = +arr[0]
      const pane = +arr[1]
      const info = this.infos[monitorcode]
      return info.resources[pane]
    },
    // 设置样式
    setStyle(data) {
      if (this.enableController) {
        return {
          position: 'absolute',
          top: data.top,
          left: data.left,
          width: data.width,
          height: data.height
        }
      }
      return {}
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
  text-align: left;
  border: 1px solid #00a5e3;
  background-color: #1b3153;
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
  width: 72px;
  height: 40px;
  margin: 1.5px;
  box-sizing: border-box;
  border: 1px dashed #555555;
  line-height: 0;
  float: left;
}

.channel {
  margin: 0.5px;
  background: #20adff;
  box-sizing: border-box;
  float: left;
}

.channel.alarm {
  background: #1b3153;
}

.channel.checked {
  border: 1px solid #ed3f14;
}
</style>
