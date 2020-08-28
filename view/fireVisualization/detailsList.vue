<template>
  <div class="keppyre">
    <h2>
      <i class="el-icon-document" style="padding:0 10px;color:#7ba9d1"></i>{{ tableTitle[`${tableType}`] }}运行状态详情
    </h2>
    <div class="top-sel" style="padding-bottom:20px;float:right;text-align:right">
      <!-- <el-autocomplete
        class="w-input"
        style="background:none"
        v-model="formData.orgName"
        value-key="name"
        :fetch-suggestions="
          (val, callback) => {
            querySearch('org', val, callback)
          }
        "
        placeholder="请输入机构"
        :trigger-on-focus="false"
        @select="
          val => {
            selectItem('org', val)
          }
        "
      ></el-autocomplete> -->
      <!-- <el-autocomplete
        class="w-input"
        :readonly="!formData.orgId"
        v-model="formData.keyPartName"
        value-key="name"
        :fetch-suggestions="
          (val, callback) => {
            querySearch('kp', val, callback)
          }
        "
        placeholder="请输入重点部位"
        :trigger-on-focus="false"
        @select="
          val => {
            selectItem('kp', val)
          }
        "
      ></el-autocomplete> -->
      <el-select
        v-model="status"
        placeholder="运行状态"
        popper-class="select-popper"
        :popper-append-to-body="false"
        style="width:17%;text-align:left"
      >
        <el-option label="全部" value=""> </el-option>
        <el-option
          v-for="(item, index) in statusList[`${tableType}`]"
          :key="index"
          :label="item.label"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-input v-model="name" placeholder="请输入..." style="width:17%">
        <i slot="suffix" @click="getTableList" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="top" ref="tablewrapper">
      <el-table
        :data="tableData"
        :height="500"
        style="width: 100%;margin-top:10px;background-color: #062d56"
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" label="序号" min-width="6.25%" align="center"> </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumn[`${tableType}`]"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!-- <span v-if="scope.row[item.prop] === 1 && tableType === 1">正常</span> -->
            <span v-if="scope.row[item.prop] === 4">报警</span>
            <span v-if="scope.row[item.prop] === 3">故障</span>
            <span v-if="scope.row[item.prop] === 2">在线</span>
            <span v-if="scope.row[item.prop] === 1">离线</span>
            <span v-if="scope.row[item.prop] === 3 && tableType !== 1">异常</span>
            <span v-if="item.prop !== 'status'">{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block" style="text-align:right;margin:30px 30px 30px 0;">
      <el-pagination
        style="text-align:right;display:inline-block;"
        :page-sizes="[10, 25, 50, 100, 200]"
        :page-size="pageSize"
        :current-page="pageCurrents"
        layout="total, sizes,slot, prev"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="pageSizeCurrent"
      >
        <el-button type="text" @click="pagePrev">首页</el-button>
      </el-pagination>
      <el-pagination
        style="text-align:right;display:inline-block;"
        :page-sizes="[10, 25, 50, 100, 200]"
        :page-size="pageSize"
        :page-count="1"
        :total="total"
        :current-page="pageCurrents"
        @size-change="pageSizeChange"
        @current-change="pageSizeCurrent"
        layout="slot"
      >
        <span class="page-span">{{ pageCurrents }}/{{ pageCounts }}</span>
      </el-pagination>
      <el-pagination
        style="text-align:right;display:inline-block;"
        :page-sizes="[10, 25, 50, 100, 200]"
        :page-size="pageSize"
        :current-page="pageCurrents"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="pageSizeCurrent"
        layout="next,slot, jumper"
        ><el-button type="text" @click="pageNext">末页</el-button></el-pagination
      >
    </div>
  </div>
</template>
<script>
import { fireInterface } from '@src/http/intelligentFire/equipmentManagement.js'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
export default {
  name: 'detailsList',
  props: {
    treeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      total: 1, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      kepalina: '',
      tableType: 3, // 系统类型
      // 系统表头
      tableTitle: {
        1: '消防水系统设备',
        2: 'NB烟感设备',
        3: '火灾报警设备'
      },
      tableData: [],
      tableColumn: {
        // 水系统
        1: [
          {
            label: '所属机构',
            prop: 'orgName'
          },
          {
            label: '重点部位',
            prop: 'keyPartName'
          },
          {
            label: '设备位置',
            prop: 'address'
          },
          {
            label: '设备名称',
            prop: 'name'
          },
          {
            label: '部件型号',
            prop: 'partsModel'
          },
          {
            label: '时间',
            prop: 'updateAt'
          },
          {
            label: '设备状态',
            prop: 'status'
          },
          {
            label: '数值',
            prop: 'numerical'
          }
        ],
        // NB
        2: [
          {
            label: '所属机构',
            prop: 'orgName'
          },
          {
            label: '重点部位',
            prop: 'keyPartName'
          },
          {
            label: '设备位置',
            prop: 'address'
          },
          {
            label: '设备名称',
            prop: 'name'
          },
          {
            label: '设备型号',
            prop: 'modelNum'
          },
          {
            label: '时间',
            prop: 'updateAt'
          },
          {
            label: '设备状态',
            prop: 'status'
          }
        ],
        // 火灾报警
        3: [
          {
            label: '所属机构',
            prop: 'orgName'
          },
          {
            label: '重点部位',
            prop: 'keyPartName'
          },
          {
            label: '设备位置',
            prop: 'address'
          },
          {
            label: '设备名称',
            prop: 'name'
          },
          {
            label: '设备型号',
            prop: 'modelNum'
          },
          {
            label: '时间',
            prop: 'updateAt'
          },
          {
            label: '设备状态',
            prop: 'status'
          }
        ]
      },
      status: '', // 状态
      statusList: {
        // 部件状态
        1: [
          {
            id: 1,
            label: '离线'
          },
          {
            id: 2,
            label: '在线'
          },
          {
            id: 3,
            label: '故障'
          },
          {
            id: 4,
            label: '报警'
          }
        ],
        2: [
          {
            id: 1,
            label: '离线'
          },
          {
            id: 2,
            label: '在线'
          },
          {
            id: 3,
            label: '异常'
          }
        ],
        3: [
          {
            id: 1,
            label: '离线'
          },
          {
            id: 2,
            label: '在线'
          },
          {
            id: 3,
            label: '异常'
          }
        ]
      },
      name: '', // 设备名称
      currentPage4: 1,
      pagesize: 10,
      userList: [],
      value: '',
      defaultParams: {
        pageSize: 25, // 一页多少条数据
        page: 1, // 第几页
        isChildren: 2, // 是否显示子机构， 1-是 2-否
        hostType: '' // 主机类型(页面类型--sidebarActiveId)
      }
    }
  },
  created() {
    this.pageCount = Math.ceil(this.total / this.pageSize)
    switch (this.tableType) {
      case 1: // 水系统
        this.defaultParams.hostType = [3, 4, 5, 6]
        break
      case 2: // NB
        this.defaultParams.type = [12]
        break
      case 3: // 火灾报警
        this.defaultParams.type = [1, 2]
        break
      default:
        break
    }
    this.handleUserList(this.defaultParams)
  },
  computed: {
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      return this.pageCurrent
    }
  },
  watch: {
    // 监听设备状态
    status: function() {
      this.defaultParams.status = this.status
      this.handleUserList(this.defaultParams)
    },
    // 监听设备状态
    treeData: function(val) {
      console.log(val)
      for (var key in val) {
        if (key !== 'keyPartId') {
          this.defaultParams.keyPartId = ''
        }
        this.defaultParams[key] = val[key]
      }
      this.handleUserList(this.defaultParams)
    },
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.pageSize = this.pageSize
      this.handleUserList(this.defaultParams)
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.page = this.pageCurrent
      this.handleUserList(this.defaultParams)
    }
  },
  methods: {
    // 设置表格行的样式
    tableRowStyle({ row, rowIndex }) {
      return 'line-height: 40px;height:40px'
    },
    // 表头input搜索
    getTableList() {
      this.defaultParams.name = this.name
      this.handleUserList(this.defaultParams)
    },
    // 获取列表数据
    handleUserList(params) {
      let data = {}
      for (var key in params) {
        if (params[key] && params[key] !== []) {
          data[key] = params[key]
        }
      }
      console.log(params)
      if (this.tableType !== 1) {
        // 火灾报警--主机列表
        fireInterface.comBustibleQueryHost(data).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.alarmHostInfo
            this.total = res.data.data.page.totalNumber || 0
            this.pageSize = res.data.data.page.pageSize
            this.pageCurrent = res.data.data.page.page
          }
        })
      } else {
        fireInterface.queryHostParts(data).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.partsInfo
            this.total = res.data.data.page.totalNumber || 0
            this.pageSize = res.data.data.page.pageSize
            this.pageCurrent = res.data.data.page.page
          }
        })
      }
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.formData.orgId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        this.formData.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.formData.keyPartId = val.id
        this.keyPartName = val.name
      }
    },
    // 设置表头行的样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return ' background:#062d56;color:#7ba9d1'
    },
    // 区分单双行
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    // 改变pageSize
    pageSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
    },
    // 首页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 尾页
    pageNext() {
      this.pageCurrent = this.pageCount
    }
  }
}
</script>
<style lang="less" scoped>
/deep/#detail-body {
  width: 96%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  box-sizing: content-box;
  padding-top: 1vw;
  color: #527698;
  /deep/ input::-webkit-input-placeholder {
    color: #527698;
  }
}
/deep/.right-echarts {
  background-color: #062d56;
  margin-left: 1rem;
  height: 67%;
}

/deep/.el-table .warning-row {
  background: #0b4683;
  color: #0976ae;
}

/deep/.el-table .success-row {
  background: #062d56;
  color: #0976ae;
}
/deep/.el-table td {
  height: 37px;
  line-height: 37px;
}
/deep/.el-pager li:hover.active {
  color: #409eff !important;
}
/deep/.block {
  text-align: center;
  margin-top: 1.5%;
  /deep/.page-span {
    color: #6d96b7;
  }
  /deep/.el-button--text {
    color: #6d96b7;
    &:hover {
      color: #66b1ff;
    }
  }
}
/deep/.keppyre h2 {
  float: left;
  margin-top: 6px;
  width: 35%;
  font-size: 1.4rem;
  color: #7ba9d1;
}
/deep/.top-sel {
  width: 60%;
}
/deep/.home,
/deep/.fillcontain {
  height: 100%;
}
/deep/.el-menu {
  border: 0;
}
/deep/.el-col {
  background-color: #eff2f7;
  height: 100%;
  overflow: auto;
}
/deep/.tree-main {
  /deep/ .el-submenu .el-menu-item {
    background-color: #1f2d3d !important;
  }
  /deep/ .el-submenu__title:hover,
  /deep/.el-submenu .el-menu-item:hover {
    background-color: #206dd1 !important;
  }
}
/deep/.el-submenu__title {
  width: 100%;
}

/deep/.tree-main {
  width: 16%;
  height: 100%;
  min-width: 200px;
  .el-tree {
    background: none !important;
  }
  @media screen and (max-width: 2000px) {
    /deep/ .el-tree-node__content,
    /deep/ .el-input__inner {
      // color:red!important;
      height: 37px;
      .el-tree-node__label {
        font-size: 0.5rem;
      }
    }
  }
  @media screen and (max-width: 4000px) and (min-width: 2000px) {
    /deep/ .el-tree-node__content {
      // color:orange!important;
      height: 35px;
    }
  }
  .search-box {
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-top: 0.5rem;
    background: none;
    /deep/.el-input__inner {
      background: none;
      border-radius: 0;
      font-size: 0.5rem;
      border: 0.5px solid #385d7d;
    }
  }
  .el-tree {
    margin-top: 0.5rem;
    border: 0.5px solid #385d7d;
    background: none;
    border-radius: 0;
    height: 100%;
    /deep/ .el-tree-node__content {
      color: white;
    }
    /deep/ .el-tree-node__content:hover {
      background: rgb(47, 74, 107);
      // background:red;
      color: white;
    }
    /deep/ .el-tree-node:focus > .el-tree-node__content {
      background: rgb(47, 74, 107);
      // background:red;
      color: white;
    }
  }
}
/deep/.top {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: space-between;
  p {
    text-align: center;
  }
  .itme {
    width: 33%;
    border: 0.5px solid #385d7d;
    height: 100%;
  }
  .el-table__header-wrapper table thead tr th {
    background: #0b4683 !important;
  }
  .el-table th,
  .el-table tr {
    background: transparent;
    color: #0c9adb;
  }
  .el-table tr.success-row {
    background: #0b4683 !important;
    color: #0c9adb;
  }
}
/deep/.bottom {
  width: 100%;
  border: 0.5px solid #385d7d;
  height: 30%;
  margin-top: 0.5%;
  position: relative;
  /deep/.plain {
    height: 100%;
  }
  /deep/.pie {
    width: 30%;
    height: 30%;
    position: absolute;
    top: 10%;
    right: -2%;
  }
}
/deep/.el-table th {
  text-align: center !important;
}

// .el-table th,
// .el-table tr {
//   border: 0 !important;
//   background-color: transparent !important;
// }

/deep/.el-table::before {
  height: 0;
}
/deep/.keppyre {
  height: 100%;
}
// .el-table,
// .el-table__expanded-cell {
//   background-color: transparent;
// }
/deep/.el-table td,
/deep/.el-table th.is-leaf {
  border-bottom: 0px;
}
/deep/.el-popper,
/deep/.optionsContent {
  color: #206dd1;
}
/deep/.el-table tbody tr:hover td {
  background-color: #0c9adb !important;
  color: #fff;
}
// .el-select-dropdown {
//   background-color: #08164d;
//   margin: 0px;
//   border: 0px;
//   border-radius: 0px;
// }
//input背景色
/deep/.el-input__inner {
  background-color: #062d56;
  color: #fff;
  border: 1px solid #385d7d;
  border-radius: 0px;
  text-align: center;
}
/deep/.el-input__inner:hover {
  border: 1px solid #385d7d;
}
/deep/.select-popper {
  background-color: #2a5981;
  border-radius: 0.08rem;
  border: solid 0.02rem #1c395d;
  font-family: PingFangSC-Regular;
  width: 20%;
  /deep/ .el-select-dropdown__item.selected {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: rgba(74, 141, 253, 1);
  }
  /deep/ li {
    color: #fff;
    background: transparent;
    color: #fff;
    font-size: 16px;
  }
  /deep/.el-select-dropdown__item:hover,
  /deep/.el-select-dropdown__item.hover {
    background-color: rgba(110, 147, 206, 0.2);
    margin-right: 1px;
  }
  //   .popper__arrow::after {
  //     border-bottom-color: red;
  //   }
  //   .popper__arrow {
  //     border-bottom-color: yellow;
  //   }
  /deep/ .el-select-dropdown__empty {
    padding: 0.2rem;
    font-size: 0.28rem;
  }
}
/deep/.el-table {
  font-size: 14px;
}
/deep/.el-select .el-input.is-focus .el-input__inner,
/deep/.el-pagination__sizes .el-input .el-input__inner:hover,
/deep/.el-select .el-input__inner:focus {
  border-color: #2974b1 !important;
}
/deep/li.el-select-dropdown__item.selected {
  color: #7da4c4;
}
/deep/.el-input__inner {
  background-color: #062d56;
  border: 1px solid #385d7d;
  border-radius: 0px;
  text-align: center;
}
/deep/.el-pagination /deep/.el-input /deep/.el-input__inner {
  border: 1px solid #266fab;
  color: #8db7d6;
}
/deep/.el-dialog,
/deep/.el-pager li {
  background-color: transparent;
  color: #6d96b7;
}
/deep/.el-pager li.btn-quicknext,
/deep/.el-pager li.btn-quickprev {
  color: #6d96b7;
}
/deep/.el-pagination .btn-next,
/deep/.el-pagination .btn-prev {
  background: center center no-repeat #062d56;
  background-size: 16px;
  cursor: pointer;
  margin: 0;
  color: #a8d5f3;
}
/deep/.el-pagination .btn-prev,
/deep/.el-pagination .btn-next {
  border: 1px solid #266fab;
}
/deep/.el-pagination button:disabled {
  background-color: transparent;
}
/deep/.el-pagination__total,
/deep/.el-pagination__jump {
  color: #6d96b7;
}
/deep/.el-select-dropdown {
  background-color: #062d56;
  border: 1px solid #1a4b79;
}
/deep/.el-select-dropdown__item:hover {
  background-color: transparent;
}
/deep/.el-select-dropdown__item.hover,
/deep/.el-select-dropdown__item:hover {
  background-color: transparent;
  color: #206dd1;
}
</style>
