<template>
    <el-dialog title="关联拓扑图" :visible.sync="flag" width="800px" :before-close="cancel"  ref="printJS_people" id="printJS_people"  :close-on-click-modal= false>
      <!-- <div class="dialogDown">
      </div> -->
      <div style="margin-left:600px" class="printBtn">
       <el-button size="small" icon="el-icon-printer" v-print="'#printJS_people'">打印</el-button>
      </div>
      <div class="content" >
        <div class="top-info" >
          <div class="info-item">
            <div class="info-label">所属机构</div>
            <div class="info-value">{{InfoData.orgName}}</div>
          </div>
          <div class="info-item">
            <div class="info-label">所属重点部位</div>
            <div class="info-value">{{InfoData.keyPartName}}</div>
          </div>
          <div class="info-item" v-if="navTitle!=='视频主机关联配置'">
            <div class="info-label">所属设备</div>
            <div class="info-value">{{InfoData.deviceName}}</div>
          </div>
          <div class="info-item" v-if="navTitle!=='视频主机关联配置'">
            <div class="info-label">资源名称</div>
            <div class="info-value">{{InfoData.name}}</div>
          </div>
        </div>
        <Gplot :gplotData="gplotData"></Gplot>
      </div>
    </el-dialog>
</template>

<script>
import Gplot from './gplot'
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
        type: this.navTitle === '视频主机关联配置' ? 'videoHost' : (this.navTitle === '摄像机关联配置' ? 'vidicon' : 'alarm'),
        center: true,
        name: this.InfoData.name
      })
      this.InfoData.video.forEach(i => {
        let obj = {
          id: i.id + '-' + i.subSystem,
          name: i.name,
          type: 'vidicon'
        }
        gpData.push(obj)
      })
      this.InfoData.audio.forEach(i => {
        let obj = {
          id: i.id + '-' + i.subSystem,
          name: i.name,
          type: 'talkback'
        }
        gpData.push(obj)
      })
      this.InfoData.guard.forEach(i => {
        let obj = {
          id: i.id+ '-' +i.subSystem,
          name: i.name,
          type: 'guard'
        }
        gpData.push(obj)
      })
      this.InfoData.output.forEach(i => {
        let obj = {
          id: i.id+ '-' +i.subSystem,
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
    },
    //打印
    Toprint() {
      debugger
      printJS('print-gplot', 'html')
    },
  }
}
</script>

<style lang="less" scoped>
//  .dialogDown{
//     width:50px;
//     height: 50px;
//     background-color:#fff;
//     position: absolute;
//     right: 0 ;
//     top:0 ;
//     display: none;
//   }
.content {
  .top-info {
    width: 80%;
    height: 160px;
    margin: 0 auto;
    .info-item {
      width:80%;
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
        // border: 1px solid #E1E1E1;
      }
      .info-value {
        border-left: 1px solid #E1E1E1;
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
@media print {
 #printJS_people{
    /deep/ .el-icon {
    display: none
  }
 }


  .printBtn {
     display: none;
  }
  // .dialogDown{
  //   display: block;
  // }

 .content {
  .top-info {
    width: 80%;
    height: 160px;
    margin: 0 auto;
    .info-item {
      width:80%;
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
        // border: 1px solid #E1E1E1;
      }
      .info-value {
        border-left: 1px solid #E1E1E1;
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
}
</style>
