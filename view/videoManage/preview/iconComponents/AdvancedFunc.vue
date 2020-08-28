<template>
   <div class="realbtn iconfont icon-more" :class="[state.isPlay? '': 'disable',isPoll?'disable':'']" title="高级功能" @mouseenter="showAdv = true" @mouseleave="showAdv = false">
      <ul v-show="showAdv&&selectedObj.isPlay" class="iconmore" style="width:178px;">
        <i class="triangle"></i>
        <li v-for="(item, i) in advList" @click="advClick(item)" @mouseenter="showTowall = item.value === '快速上墙'" :class="{active: isEnter}" :key="i">
          {{item.label}}
          <!-- <div v-show="showTowall&&item.value === '快速上墙'" class="showTowall">
            <iframe style="margin-left:-50%;"></iframe>
            <QuickToWall :camera="cameraId"></QuickToWall>
          </div> -->
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'AdvancedFunc',
  inheritAttrs: false,
  data() {
    return {
      showAdv: false,
      advList: [
        { value: '快速上墙', label: '快速上墙' },
        { value: '快速回放', label: '快速回放' }
      ]
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    advClick(value) {
      console.log(value)
    }
  }
}

</script>
<style lang='less' scoped>
</style>
