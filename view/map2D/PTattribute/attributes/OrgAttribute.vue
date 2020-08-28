<template>
  <div class="attr-video attr-panel">
    <section class="main">
      <p  v-if="showList">{{ curSelectResourcePoint.name }}</p>
      <ul class="info-list" v-if="showList">
        <li v-for="(item, index) in formData.showInfo" :key="index" >
          <span class="label">{{ item.name }}:</span>
          <span class="value">{{ item.value }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { setOverPlayInfo } from './overPlaySetInfo'
export default {
  /* mixins: [AttrInfo, seatListFun], */
  data() {
    return {
      tempName: '',
      isLayout: true,
      tempId: '',
      showList: false,
      formData: {
        showInfo: [
        ]
      }
    }
  },
  computed: {
    ...mapState({
      curSelectResourcePoint: ({ map2d }) =>
        map2d.mapPoint.curSelectResourcePoint
    })
  },
  watch: {
    curSelectResourcePoint: {
      // 监听选中点位数据的变化
      handler(newValue, oldValue) {
        console.log('xinasnnnasjkasjsdj', newValue)
        if (newValue) {
          this.formData = {
            showInfo: []
          }
          let data = setOverPlayInfo(this.curSelectResourcePoint)
          this.formData = data
          this.showList = true
        } else if (!newValue) {
          this.formData = {
            showInfo: []
          }
          this.showList = false
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // let data = setOverPlayInfo(this.curSelectResourcePoint)
    // this.formData = data
  },
  methods: {
    ...mapMutations('map2d/pointMapShow', ['CLOSE_MAP_RESOURCE_ATTRIBUTES']),
    close() {
      this.CLOSE_MAP_RESOURCE_ATTRIBUTES()
    }
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
.layout {
  float: right;
  height: 30px;
  width: 30px;
}
.layout-btn {
  background: url('../../../../../static/image/map/layout.png') no-repeat center;
  background-size: 20px 20px;
}
.disarm-btn {
  background: url('../../../../../static/image/map/disarm.png') no-repeat center;
  background-size: 20px 20px;
}
.icon-phone {
  width: 10%;
  font-size: 12px;
  cursor: pointer;
}
.phone-down {
  color: red;
}
// .attr-panel .main .info-list li {
//     width: 100%;
//     height: 30px;
//     line-height: 30px;
// }
</style>
