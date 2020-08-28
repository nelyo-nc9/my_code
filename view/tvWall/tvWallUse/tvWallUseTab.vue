<template>
  <div class="tv-box" style="flex:1">
    <div class="one-wall-tab">
      <tvWallUseLeft></tvWallUseLeft>
      <div class="right-con">
        <div>
          <tvWallUseAPP></tvWallUseAPP>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tvWallUseLeft from './tvWallUseLeft'
import tvWallUseAPP from './tvWallUseAPP'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    tvWallUseLeft,
    tvWallUseAPP
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
