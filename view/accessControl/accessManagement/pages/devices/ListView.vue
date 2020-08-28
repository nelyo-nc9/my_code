<template>
  <div id="abs">
    <!-- @click="chageType('Create')" 
    @click="chageType('Update')-->
    <TabMenu :tabList="tabList" />
    <div class="viewVBtns">
      <el-button size="mini" v-print="'#contentinfo'">
        <i class="el-icon-printer"></i>
        打印
      </el-button>
      <el-button @click="chageType(true)" size="mini">关闭</el-button>
    </div>

    <div class="listViewBtns" style="overflow-y:auto" id="printBox">
      <div class="tables" id="contentinfo">
        <el-collapse :value="'1'">
          <el-collapse-item title="门禁主机信息" name="1">
            <p class="pointerTitle">门禁主机信息</p>
            <div class="form-box">
              <div class="form-content">
                <div class="left-form">
                  <el-form size="mini" label-position="right" label-width="120px" :model="hostData">
                    <el-form-item label="门禁主机名称">
                      <span>{{ hostData.name }}</span>
                    </el-form-item>
                    <el-form-item label="所属机构">
                      <span>{{ hostData.orgName }}</span>
                    </el-form-item>
                    <el-form-item label="门禁主机IP地址">
                      <span>{{ hostData.platformIp }}</span>
                    </el-form-item>
                    <el-form-item label="型号">
                      <span>{{ hostData.modelNum }}</span>
                    </el-form-item>
                    <el-form-item label="门禁通道数量">
                      <span>{{ hostData.guardNumber }}</span>
                    </el-form-item>
                    <el-form-item label="报警输入数量">
                      <span>{{ hostData.inputNumber }}</span>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="right-form">
                  <el-form size="mini" label-position="right" label-width="120px">
                    <el-form-item label="门禁主机ID">
                      <span>{{ hostData.uniqueId }}</span>
                    </el-form-item>
                    <el-form-item label="所属重点部位">
                      <span>{{ hostData.keyPartName }}</span>
                    </el-form-item>
                    <el-form-item label="所属门禁平台">
                      <span>{{ hostData.platformName }}</span>
                    </el-form-item>
                    <el-form-item label="品牌">
                      <span>{{ hostData.brand }}</span>
                    </el-form-item>
                    <el-form-item label="门禁主机类型">
                      <span v-if="hostData.type == 1">金库门禁</span>
                      <span v-if="hostData.type == 2">普通门禁</span>
                      <span v-if="hostData.type == 3">互锁门门禁</span>
                    </el-form-item>
                    <el-form-item label="读头数量">
                      <span>{{ hostData.readerNumber }}</span>
                    </el-form-item>
                    <el-form-item label="资源名称">
                      <span>{{ hostData.password }}</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div id="userInfo">
                <ul class="box">
                  <li class="boxItem">
                    <i class="itemTitle">录入时间</i>
                    <span>{{ hostData.updatedAt || '--' }}</span>
                  </li>
                  <li class="boxItem">
                    <i class="itemTitle">录入机构</i>
                    <span>{{ hostData.updatedDept || '--' }}</span>
                  </li>
                  <li class="boxItem">
                    <i class="itemTitle">录入人</i>
                    <span>{{ hostData.updatedBy || '--' }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="tableCon" style="height:340px">
          <el-collapse v-model="activeNames" @change="collapseChange">
            <el-collapse-item title="门禁通道列表" name="1" style="border:none">
              <span class="pointer" @click="toggleOpen('videoChan')">
                门禁通道列表
                <i :class="dropdownStatus.videoChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
              <div v-if="dropdownStatus.videoChan" style="width:100%;margin-top:10px">
                <el-table
                  ref="multipleTable"
                  :data="guardChannels"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="tableSelect"
                  height="300"
                  v-loading="loading"
                >
                  <el-table-column type="index" prop="index" label="序号" width="55"></el-table-column>
                  <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                  <el-table-column show-overflow-tooltip label="门禁通道名称" width="120">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    prop="uniqueId"
                    label="门禁通道ID"
                    width="120"
                  ></el-table-column>
                  <el-table-column label="门禁通道类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <!-- 金库门禁,2|普通门禁,3|互锁门门禁 -->
                      <span v-show="scope.row.class == 1">金库门禁</span>
                      <span v-show="scope.row.class == 2">普通门禁</span>
                      <span v-show="scope.row.class == 3">互锁门门禁</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="modelNum" label="型号" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
                  <!-- <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column label="序号" width="60" type="index"></el-table-column>
                  <el-table-column prop="name" label="门禁主机名称"></el-table-column>
                  <el-table-column prop="address" label="IP地址" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="端口"></el-table-column>
                  <el-table-column prop="name" label="在线状态"></el-table-column>
                  <el-table-column prop="name" label="品牌"></el-table-column>
                  <el-table-column prop="name" label="型号"></el-table-column>
                  <el-table-column prop="name" label="门禁主机类型"></el-table-column>
                  <el-table-column prop="name" label="资产编码"></el-table-column>
                  <el-table-column prop="name" label="门禁通道数"></el-table-column>
                  <el-table-column prop="name" label="门锁数量"></el-table-column>
                  <el-table-column prop="name" label="读头数量"></el-table-column>-->
                </el-table>
              </div>
            </el-collapse-item>
            <el-collapse-item title="读头通道列表" name="2" style="border:none">
              <span class="pointer" @click="toggleOpen('audioChan')">
                读头通道列表
                <i :class="dropdownStatus.audioChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
              <!-- <p>读头通道列表</p> -->
              <div v-if="dropdownStatus.audioChan" style="width:100%;margin-top:10px">
                <el-table
                  ref="multipleTable"
                  :data="readerChannels"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="tableSelect"
                  height="300"
                  v-loading="loading"
                >
                  <el-table-column type="index" prop="index" label="序号" width="55"></el-table-column>
                  <el-table-column show-overflow-tooltip label="读头通道名称" width="120">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="serise" label="读头ID" width="120"></el-table-column>
                  <el-table-column prop="uniqueId" label="门禁通道ID" show-overflow-tooltip></el-table-column>
                  <el-table-column label="进出入标识" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.accessSign == 1 ? '出' : '入' }}</template>
                  </el-table-column>
                  <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="modelNum" label="型号" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
            <el-collapse-item title="报警输入列表" name="3" style="border:none">
              <!-- <p>报警输入列表</p> -->
              <span class="pointer" @click="toggleOpen('inputChan')">
                报警输入列表
                <i :class="dropdownStatus.inputChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
              <div v-if="dropdownStatus.inputChan" style="width:100%;margin-top:10px">
                <el-table
                  ref="multipleTable"
                  :data="inputChannels"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="tableSelect"
                  height="300"
                  v-loading="loading"
                >
                  <el-table-column type="index" prop="index" label="序号" width="55"></el-table-column>

                  <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                  <el-table-column show-overflow-tooltip label="报警输入名称" width="120">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="uniqueId" label="读头ID" width="120"></el-table-column>
                  <el-table-column prop="address" label="门禁通道ID" show-overflow-tooltip></el-table-column>
                  <!-- <el-table-column prop="uniqueId" label="进出入标识" show-overflow-tooltip></el-table-column> -->
                  <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="modelNum" label="型号" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
                  <!--                 <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column label="序号" width="60" type="index"></el-table-column>
                  <el-table-column prop="name" label="门禁主机名称"></el-table-column>
                  <el-table-column prop="address" label="IP地址" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="端口"></el-table-column>
                  <el-table-column prop="name" label="在线状态"></el-table-column>
                  <el-table-column prop="name" label="品牌"></el-table-column>
                  <el-table-column prop="name" label="型号"></el-table-column>
                  <el-table-column prop="name" label="门禁主机类型"></el-table-column>
                  <el-table-column prop="name" label="资产编码"></el-table-column>
                  <el-table-column prop="name" label="门禁通道数"></el-table-column>
                  <el-table-column prop="name" label="门锁数量"></el-table-column>
                  <el-table-column prop="name" label="读头数量"></el-table-column>-->
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDesignated, getHostInfo } from '@src/http/access/host'

export default {
  components: {
    TabMenu: () => import('../../components/tabMenu'),
    userInfo: () => import('@src/view/accessControl/components/userInfo.vue'),
  },
  data() {
    return {
      dropdownStatus: {
        videoChan: true,
        audioChan: true,
        inputChan: true,
      },
      updataHostId: '',
      hostData: {},
      inputChannels: [],
      guardChannels: [],
      readerChannels: [],
      loading: false,
      Info: {},
      tableData: [],
      currentPage4: 4,
      isCreate: '',
      activeNames: ['1', '2', '3'],
      tabList: ['基础信息', '门禁主机配置', '列表', '查看'],
    }
  },
  props: ['isView', 'deviceModel', 'listRow', 'userInfo', 'viewPsData', 'abs'],
  methods: {
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    //打印
    // print() {
    //   printJS('printBox', 'html')
    // },
    // 获取修改主机页面修改当前主机的ID
    childStatus(id) {
      this.updataHostId = a.id
      this.timer = setTimeout(() => {
        getDesignated(this.updataHostId).then((res) => {
          console.log('Log 查看主机及通道数据', res)
          this.hostData = res.data.data.host || []
          this.inputChannels = res.data.data.inputs
          this.guardChannels = res.data.data.passes
          this.readerChannels = res.data.data.readers
          if (this.inputChannels.length < 1 && this.guardChannels.length < 1 && this.readerChannels.length < 1) {
            this.$notify({
              title: '成功',
              message: '暂无通道信息',
              type: 'success',
            })
          } else {
            this.$notify({
              title: '成功',
              message: '获取通道成功',
              type: 'success',
            })
          }
        })
        this.loading = false
      }, 300)
    },
    chageType(a) {
      this.$emit(
        'modelChange',
        {
          ParerntFlag: true,
          currtCom: '列表',
        },
        'Create'
      )
    },
    //table 多选
    tableSelect() {},
    collapseChange(chageItem) {},
    handleSizeChange() {},
    handleCurrentChange() {},
  },
  created() {},
  mounted() {
    let id = this.viewPsData.id || this.abs.id
    this.Info = this.hostData
    // this.loading = true
    // this.timer = setTimeout(() => {
    // alert(id)
    getDesignated({ id }).then((res) => {
      console.log('Log 查看主机及通道数据', res)
      this.hostData = res.data.data.host || []
      this.inputChannels = res.data.data.inputs
      this.guardChannels = res.data.data.passes
      this.readerChannels = res.data.data.readers
      if (this.inputChannels.length < 1 && this.guardChannels.length < 1 && this.readerChannels.length < 1) {
        this.$notify({
          title: '成功',
          message: '暂无通道信息',
          type: 'success',
        })
      } else {
        this.$notify({
          title: '成功',
          message: '获取通道成功',
          type: 'success',
        })
      }
    })
    this.Info = {
      updatedAt: this.hostData.updatedAt,
      updatedDept: this.hostData.orgName,
      updatedBy: this.hostData.username,
    }
    console.log('Log 查看修改后的数据????', this.listRow)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
}
</script>

<style lang="less" scoped>
.viewVBtns {
  margin: 10px 0;
}
.saveBtns {
  padding: 10px 0;
}
.tables {
  .form-box {
    width: 80%;
    height: auto;
    /deep/ .el-form-item {
      border-bottom: 1px solid #e1e1e1;
    }
    .form-content {
      display: flex;
      font-size: 12px;
      padding: 10px;
      .left-form {
        width: 50%;
        border-left: 1px solid #e1e1e1;
        border-top: 1px solid #e1e1e1;
        border-bottom: 1px solid #e1e1e1;
        /deep/ .el-form-item__label {
          background: #f5f5f5;

          height: 35px;
        }
        span {
          padding: 0 10px;
        }
        /deep/ .el-form-item__content {
          // border-bottom: 1px solid #e6e6e6;
          // border-top: 1px solid #e6e6e6;
          background: #fff;
          height: 35px;
        }
        /deep/ .el-form-item__content:first-child {
          border-top: none;
        }
      }
      .right-form {
        width: 50%;
        border-left: 1px solid #e1e1e1;
        border-top: 1px solid #e1e1e1;
        border-right: 1px solid #e1e1e1;
        /deep/ .el-form-item__label {
          background: #e6e6e6;
        }
        /deep/ .el-form-item__label {
          background: #f5f5f5;

          height: 35px;
        }
        span {
          padding: 0 10px;
        }
        /deep/ .el-form-item__content {
          // border-bottom: 1px solid #e1e1e1;
          // border-top: 1px solid #e1e1e1;
          height: 35px;
          background: #fff;
        }
        /deep/ .el-form-item__content:nth-child(1) {
          border-top: none;
        }
      }
      /deep/ .el-form-item {
        padding: 0;
        margin: 0;
        .el-select {
          width: 100%;
        }
      }
    }
    .form-footer {
      width: 100%;
      margin-top: 40px;
      text-align: center;
    }
    #userInfo {
      margin: 20px 0;
      border: 1px solid #e1e1e1;
      .box {
        display: flex;
        background: rgba(245, 245, 245, 1);
        margin: 10px 0;
        margin: 0 auto;
        .boxItem {
          display: flex;
          flex: 1;
          height: 35px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
          .itemTitle {
            padding: 0 10px;
            width: 30%;
            height: 35px;
            display: block;
            text-align: center;
            background: #f5f5f5;

            line-height: 35px;
          }
          span {
            line-height: 35px;
            padding: 0 10px;
            background: #fff;
            display: inline-block;
            width: 70%;
          }
        }
      }
    }
  }
  .tables {
    height: 500px;
    overflow: hidden;
  }
  .tableCon {
    // overflow-y: auto;
    .pointer {
      position: relative;
      margin-left: 5px;
      padding-left: 5px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2d72d3;
      &::after {
        position: absolute;
        content: '';
        display: block;
        width: 2px;
        height: 12px;
        background: #2d71d3;
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .pointerTitle {
    padding: 10px 0;
    text-align: center;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(33, 33, 33, 1);
  }
}
#abs {
  height: 100%;
}
/deep/ .el-collapse {
  border: none;
}
/deep/ .el-collapse-item__header {
  display: none;
}
/deep/ .el-collapse-item__content {
  padding-bottom: 10px;
}
/deep/ .el-table--scrollable-y .el-table__body-wrapper {
  overflow: hidden;
}
</style>
<style lang="less">
@media print {
  #contentinfo {
    .tables {
      .form-box {
        width: 80%;
        height: auto;
        /deep/ .el-form-item {
          border-bottom: 1px solid #e1e1e1;
        }
        .form-content {
          display: flex;
          font-size: 12px;
          padding: 10px;
          .left-form {
            width: 50%;
            border-left: 1px solid #e1e1e1;
            border-top: 1px solid #e1e1e1;
            border-bottom: 1px solid #e1e1e1;
            /deep/ .el-form-item__label {
              background: #f5f5f5;

              height: 35px;
            }
            span {
              padding: 0 10px;
            }
            /deep/ .el-form-item__content {
              // border-bottom: 1px solid #e6e6e6;
              // border-top: 1px solid #e6e6e6;
              background: #fff;
              height: 35px;
            }
            /deep/ .el-form-item__content:first-child {
              border-top: none;
            }
          }
          .right-form {
            width: 50%;
            border-left: 1px solid #e1e1e1;
            border-top: 1px solid #e1e1e1;
            border-right: 1px solid #e1e1e1;
            /deep/ .el-form-item__label {
              background: #e6e6e6;
            }
            /deep/ .el-form-item__label {
              background: #f5f5f5;

              height: 35px;
            }
            span {
              padding: 0 10px;
            }
            /deep/ .el-form-item__content {
              // border-bottom: 1px solid #e1e1e1;
              // border-top: 1px solid #e1e1e1;
              height: 35px;
              background: #fff;
            }
            /deep/ .el-form-item__content:nth-child(1) {
              border-top: none;
            }
          }
          /deep/ .el-form-item {
            padding: 0;
            margin: 0;
            .el-select {
              width: 100%;
            }
          }
        }
        .form-footer {
          width: 100%;
          margin-top: 40px;
          text-align: center;
        }
        #userInfo {
          margin: 20px 0;
          border: 1px solid #e1e1e1;
          .box {
            display: flex;
            background: rgba(245, 245, 245, 1);
            margin: 10px 0;
            margin: 0 auto;
            .boxItem {
              display: flex;
              flex: 1;
              height: 35px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(33, 33, 33, 1);
              .itemTitle {
                padding: 0 10px;
                width: 30%;
                height: 35px;
                display: block;
                text-align: center;
                background: #f5f5f5;

                line-height: 35px;
              }
              span {
                line-height: 35px;
                padding: 0 10px;
                background: #fff;
                display: inline-block;
                width: 70%;
              }
            }
          }
        }
      }
      .tables {
        height: 500px;
        overflow: hidden;
      }
      .tableCon {
        .pointer {
          position: relative;
          margin-left: 5px;
          padding-left: 5px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #2d72d3;
          &::after {
            position: absolute;
            content: '';
            display: block;
            width: 2px;
            height: 12px;
            background: #2d71d3;
            left: -5px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .pointerTitle {
        padding: 10px 0;
        text-align: center;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(33, 33, 33, 1);
      }
    }
  }
}
</style>
