<template>
  <div class="tv-wall">
    <!-- 区分同步异步 -->
    <!-- defaultRoleId:角色ID  defaultDevIp：Ip-->
    <!-- <div v-if="selectedObj.isPlay && !isSync">
      <el-popover placement="top-start" visible-arrow="false" offset="75" trigger="hover">
        <QuickToWall
          :camera="selectedObj.result"
          @addToWall="addToWall"
        ></QuickToWall>
        <i
          slot="reference"
          class="icon iconfont icon-tv-wall"
          :class="[selectedObj.isPlay && !isSync ? '':'disable']"
          title="快速上墙"
        ></i>
      </el-popover>
    </div>
    <i
      v-if="!selectedObj.isPlay  || isSync"
      class="icon iconfont icon-tv-wall"
      :class="[selectedObj.isPlay && !isSync ? '':'disable']"
      title="快速上墙"
    ></i> -->
    <!-- 不区分同步异步 -->
    <div v-if="selectedObj.isPlay">
      <el-popover placement="top-start" visible-arrow="false" offset="75" trigger="hover">
        <QuickToWall
          :camera="selectedObj.result"
          @addToWall="addToWall"
        ></QuickToWall>
        <i
          slot="reference"
          class="icon iconfont icon-tv-wall"
          :class="[selectedObj.isPlay ? '':'disable']"
          title="快速上墙"
        ></i>
      </el-popover>
    </div>
    <i
      v-if="!selectedObj.isPlay"
      class="icon iconfont icon-tv-wall"
      :class="[selectedObj.isPlay? '':'disable']"
      title="快速上墙"
    ></i>
    <!-- <i class="icon iconfont icon-tv-wall" :class="{'disable': !selectedObj.isPlay}" title="快速上墙"></i>
    <iframe
      v-show="showTowall"
      frameborder="0"
      style="    width: 50px;
    height: 50px;
    background: red;
    position: absolute;
    bottom: 41px;
    right: -30px;
    z-index: 999;"
    ></iframe>
    <div v-show="showTowall" class="showTowall">
      <QuickToWall
        camera="5dea182cb915d23760ca9a24"
        defaultDevIp="192.168.20.42"
        :defaultRowIndex="0"
        defaultRoleId="5be27279e74ee9376c681111"
      ></QuickToWall>
    </div>-->
  </div>
</template>

<script>
import QuickToWall from '../playBackPlugin/QuickToWall'
export default {
  components: {
    QuickToWall
  },
  name: 'TVWall',
  inheritAttrs: false,
  data() {
    return {
      showTowall: false,
      isSync: false
    }
  },
  created() {
  },

  mounted() {
  },
  watch: {
    isSyncF() {
      this.isSync = this.isSyncF
    }
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
  methods: {
    // 上墙操作
    addToWall(obj) {
      // 上墙操作有3种情况 小于等于3 前端回放 大于3中心回放 回放控制暂时先放着
      // console.log('返回来的值---------', obj)
      this.$emit('iconClick', 'wallInformation', obj)

      // if (obj.deviceType > 3) {
      //   // 中心回放
      //   newVodOpen(obj).then(res => {
      //     console.log('中心回放', res)
      //     if (res.data.code === 0) {
      //       this.$emit('iconClick', 'wallInformation', obj)
      //     } else {
      //       this.$message.error('中心回放上墙失败')
      //     }
      //   })
      // } else if (obj.deviceType <= 3) {
      //   newFrontVod(obj).then(res => {
      //     console.log('上墙的回调--------', res)
      //     if (res.data.code === 0) {
      //       this.$emit('iconClick', 'wallInformation', obj)
      //     } else {
      //       this.$notify.error({
      //         title: '失败',
      //         message: '前端回放上墙失败',
      //         position: 'bottom-right'
      //       })
      //       // this.$message.error('前端回放上墙失败')
      //     }
      //     // this.$emit('iconClick', 'wallInformation', obj)
      //     // console.log('前端回放', res)
      //   })
      // }
    }
  }
}
</script>
<style lang='less' scoped>
.tv-wall {
  padding: 0px 8px;
}
.icon {
  cursor: pointer;
  font-size: 20px;
  color: #333333;
}
.disable {
  cursor: not-allowed;
  color: #ccc;
}
</style>
