<template>
    <el-dialog title="关联拓扑图" :visible.sync="flag" width="800px" :before-close="cancel" :close-on-click-modal="false">
      <div class="content">
        <div class="top-info">
          <div class="info-item">
            <div class="info-label">所属机构</div>
            <div class="info-value">{{InfoData.orgName}}</div>
          </div>
          <div class="info-item">
            <div class="info-label">所属重点部位</div>
            <div class="info-value">{{InfoData.keyPartName}}</div>
          </div>
          <div class="info-item" v-if="navTitle==='1'">
            <div class="info-label">设备名称</div>
            <div class="info-value">{{InfoData.name}}</div>
          </div>
          <div class="info-item" v-if="navTitle === '2'">
            <div class="info-label">所属设备</div>
            <div class="info-value" :title="basicData.deviceName">{{basicData.deviceName}}</div>
          </div>
          <div class="info-item" v-if="navTitle === '2'">
            <div class="info-label">探测器名称</div>
            <div class="info-value" :title="InfoData.name">{{InfoData.name}}</div>
          </div>
        </div>
        <Gplot :gplotData="gplotData"></Gplot>
      </div>
    </el-dialog>
</template>

<script>
import Gplot from '../../../../videoManage/components/gplot'
export default {
  name: 'RelevanceInfo',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    InfoData: {
      type: Object,
      required: true
    },
    basicData: {
      type:Object
    },
    navTitle: {
      type: String,
      required: true
    }
  },
  components: {
    Gplot
  },
  computed: {
    gplotData() {
      let gpData = []
      gpData.push({
        id: this.InfoData.id,
        type: this.navTitle === '1' ? 'videoHost' : (this.navTitle === '2' ? 'vidicon' : 'alarm'),
        center: true,
        name: this.InfoData.name
      })
      this.InfoData.video.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'vidicon'
        }
        gpData.push(obj)
      })
      this.InfoData.audio.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'talkback'
        }
        gpData.push(obj)
      })
      this.InfoData.guard.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'guard'
        }
        gpData.push(obj)
      })
      this.InfoData.output.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'alarm'
        }
        gpData.push(obj)
      })
      return gpData
    }
  },
  data() {
    return {
      // gplotData: []
    }
  },
  created() {
  },
  methods: {
    cancel() {
      this.$emit('cancle')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  .top-info {
    width: 80%;
    height: 160px;
    margin: 0 auto;
    .info-item {
      width: 50%;
      height: 40px;
      line-height: 40px;
      border: 1px solid #E1E1E1;
      border-top: none;
      display: flex;
      .info-label {
        width: 104px;
        height: 100%;
        background: #F5F5F5;
        text-align: center;
      }
      .info-value {
        flex: 1;
        text-indent: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &:nth-child(1) {
        border-top: 1px solid #E1E1E1;
      }
    }
  }
}
</style>
