<template>
  <div class="attr-video attr-panel">
    <section class="main">
      <ul class="info-list">
        <li>
          <span class="label">机构名称</span>
          <span class="value" >{{ curSelectResourcePoint.name }}</span>
        </li>
        <li >
          <span class="label">所属机构</span>
          <span class="value" >{{curSelectResourcePoint.org.name}}</span>
        </li>
          <li >
          <span class="label">机构地址</span>
          <span class="value" >{{curSelectResourcePoint.org.address}}</span>
        </li>
         <li >
          <span class="label">分管领导</span>
          <span class="value" >{{curSelectResourcePoint.org.functionary}}</span>
        </li>
          <li >
          <span class="label">分管领导电话</span>
          <span class="value" >{{curSelectResourcePoint.org.mobile}}</span>
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
          : { name: '', type: '', keyPartId: '', resourceId: '' }
    })
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
.attr-panel .main .info-list li {
    width: 100%;
    height: 25px;
    line-height: 25px;
}
</style>
