<template>
  <div class="host-panel-mode">
    <div class="panel-content" v-for="(item, index) in alarmHostList" :key="index">
      <div class="panel-content-bck">
        <p class="panel-content-check"><el-checkbox v-model="item.check"></el-checkbox></p>
        <div class="panel-top">
          <div class="panel-left">
            <div class="panel-armed-info">
              <i class="el-icon-close-notification"></i>
              <p class="atmed-status-info" :style="{'color':((item.defenseState=='布防' ? 'red' : 'blue'))}">{{item.defenseState}}</p>
            </div>
            <p class="panel-ip-info">
              <i class="el-icon-monitor"></i>
              <span>{{item.ip}}</span>
            </p>
          </div>
          <div class="panel-right">
            <p>
              <el-button size="mini" @click="backControlClick(item)">回控</el-button>
            </p>
            <p>
              <el-button size="mini" @click="hostLinkControlBtn(item)">关联</el-button>
            </p>
          </div>
        </div>
        <div class="panel-foot">
          <p><i>{{item.locationId}}</i></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alarmHostList: {
      // 报警主机列表
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      panelChecked: false
    }
  },
  watch: {
    alarmHostList: {
      deep: true,
      handler(newValue) {
        console.log(this.alarmHostList, '~~~~~~')
      }
    }
  },
  computed: {},
  created() {
    console.log('面板模式', this.alarmHostList)
  },
  mounted() {},
  methods: {
    backControlClick(data) {
      this.$emit('backControlStatus', true, data)
    },
    hostLinkControlBtn(data) {
      this.$emit('handleLinkBtn', true, data)
    }
  }
}
</script>

<style scoped lang='less'>
.host-panel-mode {
  .panel-content {
    width: 250px;
    height: 160px;
    border: 1px solid #e8e8e8;
    display: inline-block;
    margin-right: 20px;
    padding: 10px;
    box-sizing: border-box;
    .panel-content-bck {
      background: #f2f2f2;
      position: relative;
      .panel-content-check {
        position: absolute;
      }
      .panel-top {
        height: 106px;
        overflow: hidden;
        padding: 10px 10px 0 10px;
        box-sizing: border-box;
        .panel-left {
          float: left;
          width: 140px;
          .panel-armed-info {
            overflow: hidden;
            height: 62px;
            i {
              font-size: 22px;
              float: left;
              padding-right: 10px;
            }
            .atmed-status-info {
              width: 32px;
              margin: 0 auto;
              font-size: 16px;
            }
          }
          .panel-ip-info {
            overflow: hidden;
            height: 34px;
            line-height: 34px;
            i {
              font-size: 22px;
            }
          }
        }
        .panel-right {
          float: right;
          width: 68px;
          p {
            display: inline-block;
            width: 100%;
            text-align: center;
            margin-bottom: 20px;
          }
        }
      }
      .panel-foot {
        height: 34px;
        background: deepskyblue;
        line-height: 34px;
        text-align: center;
      }
    }
  }
}
</style>
