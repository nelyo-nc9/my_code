<template>
  <div class="tv-wall">
    <div v-if="selectedObj.isPlay && !isSync">
      <el-popover placement="top-start" visible-arrow="false" offset="75" trigger="hover">
        <!-- defaultRoleId:角色ID  defaultDevIp：Ip-->
        <QuickToWall
          camera="5dea182cb915d23760ca9a24"
          defaultDevIp="192.168.20.42"
          :defaultRowIndex="0"
          defaultRoleId="5be27279e74ee9376c681111"
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
import QuickToWall from '../QuickToWall'
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
  methods: {}
}
</script>
<style lang='less' scoped>
</style>
