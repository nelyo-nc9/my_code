<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">报警点位</span>
      <i class="btn icon iconfont icon-close1" :style="{'font-size': '14px', 'margin-left': '8px'}" title="关闭" @click="close"></i>
      <span class="layout layout-btn" v-if="isLayout"></span>
      <span class="layout disarm-btn"  v-else></span>
    </header>
    <section class="main">
      <ul class="info-list">
        <li>
          <span class="label">名称</span>
          <span class="value" >attrInfo.name</span>
        </li>
        <li >
          <span class="label">级别</span>
          <span class="value" >attrInfo.level</span>
        </li>
        <li v-if="tempName">
          <span class="label">布撤防时间</span>
          <span class="value" :title="tempName">{{tempName}}</span>
        </li>
        <div >
          <li >
            <span class="label">联系人</span>
            <span class="value" >val.contacts</span>
          </li>
          <li >
            <span class="label">电话</span>
            <span class="value" style="width: 60%" >val.telContacts</span>
            <Icon class="icon iconfont icon-phone" />
          </li>
        </div>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
/*
import AttrInfo from './AttrInfo'
import seatListFun from '../../../panelTools/seatModel/seatListFun' */
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
    /* ...mapState({
      attrInfo: ({ mapPoint }) => mapPoint.mapResourceAttributes
    }) */
  },
  watch: {
    /* attrInfo(val) {
      if (val) {
        this.alarmLayoutStatus(val.resourceId)
        this.alarmTemp(val)
      }
    } */
  },
  methods: {
    ...mapMutations('map2d/pointMapShow', ['CLOSE_MAP_RESOURCE_ATTRIBUTES']),
    close() {
      this.CLOSE_MAP_RESOURCE_ATTRIBUTES()
    }
    /* ...mapActions('map2DApplyIX', ['layoutAlarm', 'removalAlram', 'getTempName', 'getAlarmLayout']),
    alarmLayoutStatus(val) {
      this.getAlarmLayout({ id: val }).then(suc => {
      }).catch(err => {
        console.log(err)
        this.errorMsg('布防状态失败！')
      })
    },
    alarmTemp(val) {
      this.getTempName().then(suc => {
        suc.data.forEach(item => {
          if (item._id === val.alarmtemplate) {
            this.tempName = item.name
          }
        })
      }).catch(err => {
        console.log(err)
        this.errorMsg('布防失败！')
      })
    },
    alarmPointClick(type) {
      console.log(this.attrInfo, '1111111111')
      switch (type) {
        case 'protection':
          this.layoutAlarm({ ids: this.attrInfo.resourceId, type: 'res' }).then(() => {
            this.isLayout = false
            this.successMsg('布防成功！')
          }).catch(() => {
            this.errorMsg('布防失败！')
          })
          break
        case 'removal':
          this.removalAlram({ ids: this.attrInfo.resourceId, type: 'res' }).then(() => {
            this.isLayout = true
            this.successMsg('撤防成功！')
          }).catch(() => {
            this.errorMsg('撤防失败！')
          })
          break
      }
    } */
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
</style>
