<template>
  <div class="keppyre" ref="table_box">
    <h2 style="font-size: 1rem">
      <i class="el-icon-document" style="padding:0 0.1rem;color:#7ba9d1"></i>
      {{this.title ? this.title : "消防水系统设备运行状态详情"}}
    </h2>
    <div
      class="top-sel"
      ref="table_input"
      style="padding-bottom:0.2rem;float:right;text-align:right"
    >
      <el-select
        v-model="value"
        placeholder="报警等级"
        popper-class="select-popper"
        :popper-append-to-body="false"
        style="width:17%;text-align:left"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="type_value"
        placeholder="报警类型"
        popper-class="select-popper"
        :popper-append-to-body="false"
        style="width:17%;text-align:left"
      >
        <el-option
          v-for="item in alarmType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="state_value"
        placeholder="报警状态"
        popper-class="select-popper"
        :popper-append-to-body="false"
        style="width:17%;text-align:left"
      >
        <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <!-- <el-input v-model="kepalina" placeholder="请输入" suffix-icon="el-icon-search" style="width:17%"></el-input> -->
    </div>
    <div class="top" ref="tablewrapper">
      <!-- <div class="itme" id="pie">
          <Pie :options="options" :index="0"></Pie>
      </div>-->
      <!-- <div v-for="(item, index) in hostData" class="itme">
          <p>门禁主机在线运行状态{{ index }}</p>
          <hostList :item="item" :index="index" :key="index"></hostList>
      </div>-->
      <el-table
        :data="tableData"
        :height="tableheight"
        style="width: 100%;margin-top:10px;background-color: #062d56"
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="index" label="序号" min-width="6.25%" align="center"></el-table-column>
        <el-table-column prop="orgName" label="所属机构" min-width="10.5%" align="center"></el-table-column>
        <el-table-column prop="locationName" label="所属部位" min-width="12.75%" align="center"></el-table-column>
        <el-table-column prop="deviceName" label="所属设备" min-width="10.5%" align="center"></el-table-column>
        <el-table-column prop="alarmLocation" label="报警位置" min-width="10.5%" align="center"></el-table-column>
        <el-table-column prop="alarmName" label="报警名称" min-width="10.5%" align="center"></el-table-column>
        <el-table-column prop="startTime" label="发生时间" min-width="13%" align="center"></el-table-column>
        <el-table-column prop="level" label="报警等级" min-width="13%" align="center"></el-table-column>
        <el-table-column prop="alarmStatus" label="报警状态" min-width="7.25%" align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper-status">
              <p>
                <span></span>
                {{ scope.row.alarmStatus }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dealState" label="处理状态" min-width="6.25%" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="block" ref="table_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageNum"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="pages.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.sum"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'detailsList',
  props: {
    title: {
      type: String,
      default: null
    },
    tableData: {
      type: Array,
      default: null
    },
    pages: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tableheight: '100%',
      kepalina: '',
      userList: [],
      options: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '一级报警'
        },
        {
          value: '2',
          label: '二级报警'
        }
      ],
      state: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '已结束'
        },
        {
          value: '2',
          label: '未结束'
        }
      ],
      value: '',
      type_value: '',
      alarmType: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '设备报警'
        },
        {
          value: '2',
          label: '管理报警'
        }
      ],
      state_value: ''
    }
  },
  created() {
    this.handleUserList()
  },
  beforeMount() {
    // this.tableData.forEach((item, index) => {//生成序号
    //   item.index = (this.pages.pageNum - 1) * this.pages.pageSize + index + 1;
    // })
    // console.log(this.tableData)
  },
  computed: {
    ...mapState('fireCount', {
      treeOptions: state => state.treeOptions,
      chooseAlarmType: state => state.chooseAlarmType,
      alarmLeavl: state => state.alarmLeavl,
      alarmState: state => state.alarmState
    })
  },
  mounted() {
    this.tableheight =
      this.$refs.table_box.offsetHeight - this.$refs.table_input.offsetHeight - this.$refs.table_page.offsetHeight

    const that = this
    window.onresize = () => {
      return (() => {
        that.tableheight =
          that.$refs.table_box.offsetHeight - that.$refs.table_input.offsetHeight - that.$refs.table_page.offsetHeight
      })()
    }
  },
  watch: {
    tableheight(val) {
      this.tableheight = val
    },
    type_value(val) {
      this.changeChooseType(val)
      const pay = { pageNum: 1, pageSize: this.pages.pageSize }
      if (val > 0) {
        pay.alarmTypeName = val == 1 ? '设备报警' : '管理报警'
      }
      pay[this.treeOptions.type] = this.treeOptions.id
      if (this.alarmLeavl > 0) {
        pay.level = this.alarmLeavl
      }
      if (this.alarmState > 0) {
        pay.alarmStatus = this.alarmState == 1 ? '已结束' : '未结束'
      }
      this.getAlarmFilter(pay)
    },
    value(val) {
      this.changeleavl(val)
      const pay = { pageNum: 1, pageSize: this.pages.pageSize }
      if (val > 0) {
        pay.level = val
      }
      pay[this.treeOptions.type] = this.treeOptions.id
      if (this.chooseAlarmType > 0) {
        pay.alarmTypeName = this.chooseAlarmType == 1 ? '设备报警' : '管理报警'
      }
      if (this.alarmState > 0) {
        pay.alarmStatus = this.alarmState == 1 ? '已结束' : '未结束'
      }
      this.getAlarmFilter(pay)
    },
    state_value(val) {
      this.changeState(val)
      const pay = { pageNum: 1, pageSize: this.pages.pageSize }
      if (val > 0) {
        pay.alarmStatus = val == 1 ? '已结束' : '未结束'
      }
      pay[this.treeOptions.type] = this.treeOptions.id
      if (this.chooseAlarmType > 0) {
        pay.alarmTypeName = this.chooseAlarmType == 1 ? '设备报警' : '管理报警'
      }
      if (this.alarmLeavl > 0) {
        pay.level = this.alarmLeavl
      }
      this.getAlarmFilter(pay)
    }
  },
  methods: {
    ...mapActions('fireCount', ['getAlarmFilter']),
    ...mapMutations('fireCount', ['changeChooseType', 'changeleavl', 'changeState']),
    //设置表格行的样式
    tableRowStyle({ row, rowIndex }) {
      return 'line-height: 40px;height:40px'
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      // this.pages.pageSize = val;
      // this.pages.pageNum = 1;
      this.getAlarmFilter({ pageNum: 1, pageSize: val })
    },
    handleCurrentChange(currentPage) {
      // this.pages.pageNum = currentPage;
      // console.log(this)
      this.getAlarmFilter({ pageNum: currentPage, pageSize: this.pages.pageSize })
    },
    handleUserList() {
      // this.$http.get('').then(res => {
      //   //这是数据接口，
      //   this.userList = res.body
      // })
    },
    //设置表头行的样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return ' background:#062d56;color:#7ba9d1'
    },
    //区分单双行
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>
<style lang="less" >
#detail-body {
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
.right-echarts {
  background-color: #062d56;
  margin-left: 1rem;
  height: 67%;
}
/deep/.el-table .warning-row {
  background: #0b4683;
  color: #0976ae;
}

.el-table .success-row {
  background: #062d56;
  color: #0976ae;
}
.el-table td {
  height: 37px;
  line-height: 37px;
}
.el-pager li:hover.active {
  color: #409eff !important;
}
.block {
  text-align: center;
  // margin-top: 1rem;
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
}
.keppyre h2 {
  float: left;
  margin-top: 6px;
  width: 35%;
  font-size: 1.4rem;
  color: #7ba9d1;
}
.top-sel {
  width: 60%;
}
.home,
.fillcontain {
  height: 100%;
}
.el-menu {
  border: 0;
}
.el-col {
  background-color: #eff2f7;
  height: 100%;
  overflow: auto;
}
.tree-main {
  /deep/ .el-submenu .el-menu-item {
    background-color: #1f2d3d !important;
  }
  /deep/ .el-submenu__title:hover,
  .el-submenu .el-menu-item:hover {
    background-color: #206dd1 !important;
  }
}
.el-submenu__title {
  width: 100%;
}
.tree-main {
  width: 16%;
  height: 100%;
  min-width: 200px;
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
.top {
  width: 100%;
  height: 75%;
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
  .name-wrapper-status span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    background: radial-gradient(farthest-side at 50% 50%, red, white);
  }
}
.bottom {
  width: 100%;
  border: 0.5px solid #385d7d;
  height: 30%;
  margin-top: 0.5%;
  position: relative;
  .plain {
    height: 100%;
  }
  .pie {
    width: 30%;
    height: 30%;
    position: absolute;
    top: 10%;
    right: -2%;
  }
}
.el-table th {
  text-align: center !important;
}

// .el-table th,
// .el-table tr {
//   border: 0 !important;
//   background-color: transparent !important;
// }

.el-table::before {
  height: 0;
}
.keppyre {
  height: 100%;
  position: relative;
}
// .el-table,
// .el-table__expanded-cell {
//   background-color: transparent;
// }
.el-table td,
.el-table th.is-leaf {
  border-bottom: 0px;
}
.el-popper,
.optionsContent {
  color: #206dd1;
}
.el-table tbody tr:hover td {
  background-color: #000 !important;
}
// .el-select-dropdown {
//   background-color: #08164d;
//   margin: 0px;
//   border: 0px;
//   border-radius: 0px;
// }
//input背景色
.el-input__inner {
  background-color: #062d56;
  color: #fff;
  border: 1px solid #385d7d;
  border-radius: 0px;
  text-align: center;
}
.el-input__inner:hover {
  border: 1px solid #385d7d;
}
.select-popper {
  background-color: #2a5981;
  border-radius: 0.08rem;
  border: solid 0.02rem #1c395d;
  font-family: PingFangSC-Regular;
  width: 20%;
  .el-select-dropdown__item.selected {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: rgba(74, 141, 253, 1);
  }
  li {
    color: #fff;
    background: transparent;
    color: #fff;
    font-size: 16px;
  }
  .el-select-dropdown__item:hover,
  .el-select-dropdown__item.hover {
    background-color: rgba(110, 147, 206, 0.2);
    margin-right: 1px;
  }
  //   .popper__arrow::after {
  //     border-bottom-color: red;
  //   }
  //   .popper__arrow {
  //     border-bottom-color: yellow;
  //   }
  .el-select-dropdown__empty {
    padding: 0.2rem;
    font-size: 0.28rem;
  }
}
.el-table {
  font-size: 14px;
}
.el-select .el-input.is-focus .el-input__inner,
.el-pagination__sizes .el-input .el-input__inner:hover,
.el-select .el-input__inner:focus {
  border-color: #2974b1 !important;
}
li.el-select-dropdown__item.selected {
  color: #7da4c4;
}
.el-input__inner {
  background-color: #062d56;
  border: 1px solid #385d7d;
  border-radius: 0px;
  text-align: center;
}
.el-pagination .el-input .el-input__inner {
  border: 1px solid #266fab;
  color: #8db7d6;
}
.el-dialog,
.el-pager li {
  background-color: transparent;
  color: #6d96b7;
}
.el-pager li.btn-quicknext,
.el-pager li.btn-quickprev {
  color: #6d96b7;
}
.el-pagination .btn-next,
.el-pagination .btn-prev {
  background: center center no-repeat #062d56;
  background-size: 16px;
  cursor: pointer;
  margin: 0;
  color: #a8d5f3;
}
.el-pagination .btn-prev,
.el-pagination .btn-next {
  border: 1px solid #266fab;
}
.el-pagination button:disabled {
  background-color: transparent;
}
.el-pagination__total,
.el-pagination__jump {
  color: #6d96b7;
}
.el-select-dropdown {
  background-color: #062d56;
  border: 1px solid #1a4b79;
}
.el-select-dropdown__item:hover {
  background-color: transparent;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: transparent;
  color: #206dd1;
}
</style>
