<template>
  <div class="tv-box" style="flex:1">
    <div class="one-wall-tab">
      <TVWallSetLeft></TVWallSetLeft>
      <div class="right-con">
        <div>
          <TVWallSetApp></TVWallSetApp>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TVWallSetLeft from './tvWallSetLeft'
import TVWallSetApp from './tvWallSetApp'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    TVWallSetLeft,
    TVWallSetApp
  },
  data() {
    return {}
  },

  computed: {},
  methods: {},
  created() {}
}
</script>
<style lang="less" scoped>
.right-con {
  flex: 1;
  padding: 0 16px;
}
.right-con > div {
  height: 100%;
}
.tv-box {
  overflow: hidden;
  height: 100%;
}
.one-wall-tab {
  display: flex;
  width: 100%;
  height: 100%;
  // height: ~'calc(100% - 41px)';
}
</style>
