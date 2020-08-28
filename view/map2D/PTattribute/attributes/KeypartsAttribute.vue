<template>
  <div class="attr-video attr-panel">
    <section class="main">
         <p>{{ curSelectResourcePoint.name }}</p>
      <ul class="info-list">
        <li>
          <span class="label">部位名称</span>
          <span class="value"  v-if=" curSelectResourcePoint.name ">{{ curSelectResourcePoint.name  }}</span>
        </li>
        <li >
          <span class="label">所属机构</span>
          <span class="value" v-if="curSelectResourcePoint.org.name" >{{curSelectResourcePoint.org.name}} </span>
        </li>
          <li >
          <span class="label">部位地址</span>
          <span class="value" v-if="curSelectResourcePoint.keyPart.address" >{{curSelectResourcePoint.keyPart.address}}</span>
        </li>
         <li >
          <span class="label">部位联系人</span>
          <span class="value" v-if="curSelectResourcePoint.keyPart.functionary" >{{curSelectResourcePoint.org.functionary}}</span>
        </li>
          <li >
          <span class="label">移动电话</span>
          <span class="value"  v-if="curSelectResourcePoint.keyPart.telephone">{{curSelectResourcePoint.keyPart.telephone}}</span>
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
          : { name: '',
            org: {name: '',
              address: '',
              functionary: '',
              mobile: '' },
            keyPart: {name: '',
              address: '',
              functionary: '',
              telephone: '' } }
    })
  },
  watch: {
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
