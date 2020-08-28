<template>
  <!-- 对讲主机关联配置   查看-->
  <div id="viewRealted">
    <!-- 顶部操作栏 -->
    <div class="top">
      <!-- 面包屑 -->
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>音频管理</el-breadcrumb-item>
          <el-breadcrumb-item>对讲主机关联配置</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 操作按钮 -->
      <div class="button-box">
        <el-button size="mini" v-print="'#printJS_container'">打印</el-button>
        <el-button size="mini" @click="back">关闭</el-button>
      </div>
    </div>

    <div class="print-container" ref="printJS_container" id="printJS_container">
      <div class="tableView">
        <div class="tableList">
          <ul>
            <li v-for="(item, index) in tableView" :key="index">
              <i>{{item.title}}</i>
              <span>{{item.context}}</span>
            </li>
          </ul>
        </div>

        <div class="TopologyView">
          <div class="abs">
            <Gplot :gplotData="gplotData" v-if="isShowGplot"></Gplot>
          </div>
        </div>
      </div>
      <div class="box-big">
        <div class="bottom-box">
          <div style="width:100%;">
            <div class="form-title form-title1">
              <span class="title" @click="dropdownStatus.detector1 = !dropdownStatus.detector1">摄像机列表</span>
              <i :class="!dropdownStatus.detector1 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </div>
            <div v-show="!dropdownStatus.detector1" style="width:100%;">
              <el-table size="mini" :data="video" stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in tableData"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="bottom-box">
          <div style="width:100%;">
            <div class="form-title">
              <span class="title" @click="dropdownStatus.detector2 = !dropdownStatus.detector2">对讲通道列表</span>
              <i :class="!dropdownStatus.detector2 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </div>
            <div v-show="!dropdownStatus.detector2" style="width:100%;">
              <el-table size="mini" :data="audio" stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in tableData"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="bottom-box">
          <div style="width:100%;">
            <div class="form-title">
              <span class="title"
                    @click="dropdownStatus.detector3 = !dropdownStatus.detector3">门禁通道列表</span>
              <i :class="!dropdownStatus.detector3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </div>
            <div v-show="!dropdownStatus.detector3" style="width:100%;">
              <el-table size="mini" :data="guard" stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in tableData"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="bottom-box">
          <div style="width:100%;">
            <div class="form-title">
              <span class="title"
                    @click="dropdownStatus.detector4 = !dropdownStatus.detector4">输出通道列表</span>
              <i :class="!dropdownStatus.detector4 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </div>
            <div v-show="!dropdownStatus.detector4" style="width:100%;">
              <el-table size="mini" :data="output" stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in tableData"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import { gethostlinkageApi, getlinks } from '../../../../../http/audioManage/talkback.api'
import Gplot from '@src/view/videoManage/components/gplot'

export default {
  components: {
    TabMenu: () => import('@src/view/accessControl/accessManagement/components/tabMenu'),
    Gplot,
  },
  props: [ 'hostInfo'],

  data() {
    return {
      gplotData: [
        // 关联拓扑假数据
      ],
      isShowGplot: true,
      audio: [],
      video: [],
      output: [],
      guard: [],

      tableData: [
        { prop: 'orgName', label: '所属机构', width: '', sortable: true },
        { prop: 'keypartName', label: '所属重点部位', width: '', sortable: true },
        { prop: 'name', label: '资源名称', width: '', sortable: true },
        { prop: 'brand', label: '品牌', width: '', sortable: true },
        { prop: 'modelNum', label: '型号', width: '', sortable: true },
        { prop: 'serise', label: '通道号', width: '', sortable: true },
        { prop: 'assetCode', label: '资产编码', width: '', sortable: true },
        { prop: 'remark', label: '备注', width: '', sortable: true },
      ],
      // tableDatas:[],
      dropdownStatus: {
        detector1: false,
        detector2: false,
        detector3: false,
        detector4: false
      },
      activeNames: ['1'],
      isShowList: false,
      ParList: ['对讲管理', '对讲主机关联配置', '列表'],
      tableView: [
        { title: '所属机构', context: this.hostInfo.orgName },
        { title: '所属重点部位', context: this.hostInfo.keyPartName },
        { title: '所属名称', context: this.hostInfo.name },
      ],
    }
  },
  methods: {
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    back() {
      this.$emit('cloneExamine')
    },
    collEvent(val) {},

    // 打印
    print() {
      printJS({ printable: 'printJS_container', type: 'html' })
    },

  },
  mounted() {
    let params = {
      ref: 1,
    }
    getlinks(this.hostInfo.id, params).then((res) => {
      console.log('fuck', res)
      this.video = res.data.data.video
      this.output = res.data.data.output
      this.guard = res.data.data.guard
      this.audio = res.data.data.audio
      this.gplotData = []
      let result = res.data.data.video.concat(res.data.data.guard, res.data.data.audio, res.data.data.output)
      let center = {
        name: this.hostInfo.name,
        type: 'alarmHost',
        id: '1',
        center: true, // 用来标识中心元素
      }
      this.gplotData.push(center)
      for (let i = 0; i < result.length; i++) {
        let temp = {
          name: result[i].name,
          type:
            result[i].type === 1
              ? 'vidicon'
              : result[i].type === 4
              ? 'alarmHost'
              : result[i].type === 2
              ? 'talkback'
              : 'guardHost',
          id: i.subSystem +String(i + 2),
        }
        this.gplotData.push(temp)
      }
      this.isShowGplot = false
      this.$nextTick(() => {
        this.isShowGplot = true
      })
    })
  },
}
</script>
<style lang="less" scoped>
#viewRealted {
  height: 100%;
  .top {
    .header {
      color: #333333;
      margin: 23px 0;
      /deep/ .el-breadcrumb {
        font-size: 12px;
        .active {
          .el-breadcrumb__inner {
            color: #2d72d3;
          }
        }
      }
    }
  }
  .tableView {
    display: flex;
    margin-top: 20px;
    .tableList {
      width: 473px;
      padding: 5px;
      border: 1px solid #e6e6e6;
      height: 108px;
      ul {
        // padding: 4px;
        border: 1px solid #e6e6e6;

        li {
          text-align: center;
          display: flex;
          line-height: 31px;
          border-bottom: 1px solid #e6e6e6;
          &:nth-child(1) {
            border-bottom: 1px solid #e6e6e6;
          }
          &:last-child {
            border: none;
          }
          i {
            width: 40%;
            height: 30px;
            background: #e6e6e6;
          }
          span {
            // text-indent: 5px;
            display: inline-block;
            padding-left:15px;
            width:60%;
          }
        }
      }
    }
  }
  .box-big {
    margin-top: 20px;
    padding-bottom: 20px;
  }
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 10px;
      font-size: 16px;
      height: 20px;
      line-height: 20px;
    }
  }
  .bottom-box {
    margin-top: 35px;
    .title {
      margin-left: 7px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      position: relative;
      cursor: pointer;
    }
    .title::before {
      content: '';
      width: 2px;
      height: 12px;
      display: block;
      background: #2d72d3;
      position: absolute;
      left: -7px;
      top: 2.5px;
    }
    .form-title {
      margin: 20px 0 18px;
      i {
        color: #333;
      }
    }
    .form-title1{
      margin-top: 0;
    }
  }
  .TopologyView {
    // width: 100%;
    position: relative;
    flex: 1;
    border: 10px solid red;
    margin-left: 10px;
    border: 1px solid #e1e1e1;
    // padding: 10px;
    height: 576px;
    .abs {
      // margin-top: -100px;
    }
    .gplot-box{
      height: 576px;
    }
  }
  .collItem {
    height: 400px;
    overflow: auto;
  }
}
</style>