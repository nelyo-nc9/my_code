<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">门禁信息</span>
      <i class="btn icon iconfont icon-close1" :style="{'font-size': '14px', 'margin-left': '8px'}" title="关闭" ></i>
    </header>
    <section class="main">
      <ul class="info-list">
        <li >
          <span class="label">名称</span>
          <span class="value" >attrInfo.name</span>
        </li>
        <li>
          <span class="label">厂商</span>
          <span class="value" >attrInfo.vendor</span>
        </li>
        <div >
          <li >
            <span class="label">联系人</span>
            <span class="value" >val.contacts</span>
          </li>
          <li>
            <span class="label">电话</span>
            <span class="value" style="width: 60%" >val.telContacts</span>
            <Icon class="icon iconfont icon-phone"  />
          </li>
        </div>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
/* import { mapState } from 'vuex'
import AttrInfo from './AttrInfo'
import seatListFun from '../../../panelTools/seatModel/seatListFun' */
export default {
  // mixins: [AttrInfo, seatListFun],
  data() {
    return {
    }
  },
  computed: {
    /* ...mapState({
      attrInfo: ({ mapPoint }) => mapPoint.mapResourceAttributes
    }) */
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
.icon-phone {
  width: 10%;
  font-size: 12px;
  cursor: pointer;
}
.phone-down {
  color: red;
}
</style>
