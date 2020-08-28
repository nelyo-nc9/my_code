<template>
  <div class="attr-video attr-panel">
    <!-- 报警探测器  防护舱 -->
    <section class="main">
        <p>{{ curSelectResourcePoint.name }}</p>
      <ul class="info-list">
        <li>
          <span class="label">设备名称</span>
          <span class="value" >{{ curSelectResourcePoint.name }}</span>
        </li>
        <li >
          <span class="label">设备类型</span>
          <span class="value" >{{curSelectResourcePoint.org.name}}</span>
        </li>
          <li >
          <span class="label">所属设备</span>
          <span class="value" >{{curSelectResourcePoint.device.name}}</span>
        </li>
          <li >
          <span class="label">所属重点部位</span>
          <span class="value" >{{curSelectResourcePoint.org.address}}</span>
        </li>
         <li >
          <span class="label">所属机构</span>
          <span class="value" >{{curSelectResourcePoint.org.functionary}}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  /* mixins: [AttrInfo, seatListFun], */
  data() {
    return {
      isFinder: false,
      tempName: '',
      isLayout: true,
      tempId: ''
    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      curSelectResourcePoint: ({ map2d }) =>
        map2d.mapPoint.curSelectResourcePoint
          ? map2d.mapPoint.curSelectResourcePoint
          : { name: '', type: '', keyPartId: '', resourceId: '' }
    })
  },
  watch: {

  },
  methods: {
    ...mapMutations('map2d/pointMapShow', ['CLOSE_MAP_RESOURCE_ATTRIBUTES'])

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
.attr-panel .main .info-list li {
    width: 100%;
    height: 25px;
    line-height: 25px;
}
</style>
