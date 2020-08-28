<template>
  <div id="viewRealted">
    <div class="meus">
      <!-- <TabMenu :tabList="childTbaList" /> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
        <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
        <el-breadcrumb-item>门禁通道关联配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="btns">
      <el-button size="mini" v-print="'#printJS_container'">打印</el-button>
      <el-button size="mini" @click="back">关闭</el-button>
    </div>
    <div ref="printJS_container" id="printJS_container">
      <div class="tableView">
        <div class="tableList">
          <ul>
            <li v-for="(item, index) in tableItem[0] ? tableItem : tableView" :key="index">
              <i>{{ item.title }}</i>
              <span>{{ item.context || '--' }}</span>
            </li>
          </ul>
        </div>

        <div class="TopologyView">
          <!-- <Topology /> -->
          <div class="abs">
            <Gplot :gplotData="gplotData" v-if="isShowGplot"></Gplot>
          </div>
        </div>
      </div>
      <div id="userInfo">
        <ul class="box">
          <li class="boxItem">
            <i class="itemTitle">录入时间</i>
            <span>{{ Info.updatedAt || '--' }}</span>
          </li>
          <li class="boxItem">
            <i class="itemTitle">录入机构</i>
            <span>{{ Info.updatedDept || '--' }}</span>
          </li>
          <li class="boxItem">
            <i class="itemTitle">录入人</i>
            <span>{{ Info.updatedAt || '--' }}</span>
          </li>
        </ul>
      </div>
      <div class="collItem" id="box">
        <el-collapse v-model="activeNames" @change="collEvent">
          <el-collapse-item title="关联视频通道列表" name="1">
            <el-table :data="video" border style="width: 100%">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column prop="orgName" label="所属机构" width="180"></el-table-column>
              <el-table-column prop="keypartName" label="所属重点部位"></el-table-column>
              <el-table-column prop="name" label="视频通道名称"></el-table-column>
              <!-- <el-table-column prop="serise" label="视频通道号"></el-table-column> -->
              <!-- <el-table-column prop="address" label="状态"></el-table-column> -->
              <!-- <el-table-column prop="address" label="门禁通道类型"></el-table-column> -->
              <el-table-column prop="brand" label="品牌"></el-table-column>
              <el-table-column prop="modelNum" label="型号"></el-table-column>
              <el-table-column prop="serise" label="通道号"></el-table-column>
              <el-table-column prop="assetCode" label="资产编码"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="关联对讲通道列表" name="2">
            <el-table :data="audio" border style="width: 100%">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column prop="orgName" label="所属机构" width="180"></el-table-column>
              <el-table-column prop="keypartName" label="所属重点部位"></el-table-column>
              <el-table-column prop="name" label="对讲通道名称"></el-table-column>
              <!-- <el-table-column prop="address" label="对讲通道号"></el-table-column> -->
              <!-- <el-table-column prop="remark" label="状态"></el-table-column> -->
              <el-table-column prop="brand" label="品牌"></el-table-column>
              <el-table-column prop="modelNum" label="型号"></el-table-column>
              <el-table-column prop="uniqueId" label="ID号"></el-table-column>
              <el-table-column prop="assetCode" label="资产编码"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="关联门禁通道列表" name="3">
            <el-table :data="guard" border style="width: 100%">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column prop="orgName" label="所属机构" width="180"></el-table-column>
              <el-table-column prop="keypartName" label="所属重点部位"></el-table-column>
              <el-table-column prop="name" label="门禁通道名称"></el-table-column>
              <el-table-column prop="uniqueId" label="门禁通道ID"></el-table-column>
              <el-table-column prop label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">关门</span>
                  <span v-if="scope.row.status == 2">开门</span>
                  <span v-if="scope.row.status == 3">未知</span>
                </template>
              </el-table-column>
              <el-table-column prop="brand" label="品牌"></el-table-column>
              <el-table-column prop="modelNum" label="型号"></el-table-column>
              <el-table-column prop="assetCode" label="资产编码"></el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="关联输出通道列表" name="4">
            <el-table :data="output" border style="width: 100%">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column prop="orgName" label="所属机构" width="180"></el-table-column>
              <el-table-column prop="keypartName" label="所属重点部位"></el-table-column>
              <el-table-column prop="name" label="报警输出名称"></el-table-column>
              <el-table-column prop="serise" label="输出通道号"></el-table-column>
              <!-- <el-table-column prop="address" label="状态"></el-table-column> -->
              <el-table-column prop="brand" label="品牌"></el-table-column>
              <el-table-column prop="modelNum" label="型号"></el-table-column>
              <el-table-column prop="assetCode" label="资产编码"></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getGanged } from '@src/http/access/accessMan'
import { CreateUplinkage, getHostOrControlLinkages } from '@src/http/access/CreateOrUpdataLinkage'
// import Gplot from '@src/view/accessControl/components/gplot'
import Gplot from '@src/view/videoManage/components/gplot'

export default {
  components: {
    TabMenu: () => import('@src/view/accessControl/accessManagement/components/tabMenu'),
    Topology: () => import('@src/view/accessControl/accessManagement/components/Topology.vue'),
    userInfo: () => import('@src/view/accessControl/components/userInfo'),
    Gplot,
  },
  props: ['childTbaList', 'tableItem', 'migra', 'hostInfo', 'Info'],

  data() {
    return {
      gplotData: [
        // 关联拓扑假数据
      ],
      isShowGplot: true,
      tableData: [],
      activeNames: ['1', '2', '3', '4'],
      isShowList: false,
      ParList: ['门禁管理', '报警输入关联配置', '列表'],
      tableView: [
        { title: '所属子系统' },
        { title: '所属机构' },
        { title: '所属重点部位' },
        { title: '所属门禁平台' },
        { title: '所属门禁主机' },
        { title: '门禁通道名称' },
      ],
      audio: [],
      guard: [],
      output: [],
      video: [],
    }
  },
  methods: {
          print() {
      printJS({ printable: 'printJS_container', type: 'html' })
    },
    getGanGedList() {
      let params = {
        ref: 2,
      }
      getHostOrControlLinkages(`/resource/v1/guard/linkage/${this.hostInfo.id}`, params).then((res) => {
        this.audio = res.data.data.audio //对讲通道
        this.guard = res.data.data.guard //门禁通道
        this.output = res.data.data.output //输出通道
        this.video = res.data.data.video //视频通道
        this.gplotData = []
        let result = res.data.data.video.concat(res.data.data.audio, res.data.data.output)
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
            id: String(i + 2),
          }
          this.gplotData.push(temp)
        }
        this.isShowGplot = false
        this.$nextTick(() => {
          this.isShowGplot = true
        })
      })
    },
    back() {
      this.$parent.SizeTableHeight()
      this.$emit('model', {
        ListStatus: true,
        menu: this.ParList,
      })
    },
    collEvent(val) {},
  },
  mounted() {
    this.getGanGedList()
  },
}
</script>
<style lang="less" scoped>
#viewRealted {
  height: 100%;
  .btns {
    margin: 10px;
  }
  #printJS_container {
    height: calc(~'100% - 70px');
    overflow: auto;
    .tableView {
      display: flex;
      margin: 10px;
      .tableList {
        width: 282px;
        padding: 5px;
        border: 1px solid #e6e6e6;
        ul {
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
              text-indent: 5px;
            }
          }
        }
      }
      .TopologyView {
        // width: 100%;
        position: relative;
        flex: 1;
        border: 10px solid red;
        margin-left: 10px;
        border: 1px solid #e1e1e1;
        padding: 10px;
        height: 600px;

        // .abs {
        //   margin-top: -10px;
        // }
      }
    }
    .collItem {
      // height: 400px;
      width: 100%;
      // overflow-y: auto;
    }
    #userInfo {
      margin: 0 auto;
      margin-top: 30px;
      width: 80%;
      .box {
        display: flex;
        border: 1px solid rgba(225, 225, 225, 1);
        margin: 0 auto;
        .boxItem {
          display: flex;
          flex: 1;
          height: 30px;
          .itemTitle {
            padding: 0 10px;
            width: 30%;
            height: 30px;
            display: block;
            text-align: center;
            background: #e6e6e6;
            line-height: 30px;
          }
          span {
            line-height: 30px;
            padding: 0 10px;
          }
        }
      }
    }
  }
  /deep/ .el-collapse-item__header {
    color: #2d72d3;
    font-size: 14px;
  }
  /deep/ .el-collapse-item__header {
    text-indent: 10px;
  }
}
</style>

<style lang="less">
@media print {
  #printJS_container {
    height: calc(~'100% - 70px');
    overflow: auto;
    .tableView {
      display: flex;
      margin: 10px;
      .tableList {
        width: 282px;
        padding: 5px;
        border: 1px solid #e6e6e6;
        ul {
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
              text-indent: 5px;
            }
          }
        }
      }
      .TopologyView {
        // width: 100%;
        position: relative;
        flex: 1;
        margin-left: 10px;
        left: -100px;

        padding: 10px;
        height: 600px;
        // .abs {
        //   margin-top: -10px;
        // }
      }
    }
    .collItem {
      // height: 400px;
      width: 100%;
      // overflow-y: auto;
    }
    #userInfo {
      margin-top: 30px;
      // margin-bottom:30px;
      width: 60%;
      .box {
        display: flex;
        border: 1px solid rgba(225, 225, 225, 1);
        margin: 0 auto;
        .boxItem {
          display: flex;
          flex: 1;
          height: 30px;
          .itemTitle {
            padding: 0 10px;
            width: 30%;
            height: 30px;
            display: block;
            text-align: center;
            background: #e6e6e6;
            line-height: 30px;
          }
          span {
            line-height: 30px;
            padding: 0 10px;
          }
        }
      }
    }
  }
}
</style>
