
<template>
  <div class="platform-list-box">
    <div class="tree-content">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="filter"
               :treeType="treeType"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle></treeBox>
    </div>
    <div class="right-content">
      <!-- 顶部操作栏 -->
      <div class="top-box">
        <!-- 面包屑 -->
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>停车管理</el-breadcrumb-item>
            <el-breadcrumb-item>停车平台管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{topTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <!-- 操作按钮 -->
        <div class="button-box"
             v-if="hostConfigShow">
          <el-button size="mini"
                     @click="hostConfigEditBtn"
                     :disabled="selectData.length !== 1">编辑</el-button>
          <el-button size="mini"
                     @click="exportHost">导出</el-button>
          <el-button size="mini"
                     @click="Toprint">打印</el-button>
        </div>
      </div>
      <div class="table-box"
           v-if="hostConfigShow">
        <div class="table-top">
          <el-button type="text"
                     icon="el-icon-refresh"
                     @click="getAlarmHostList">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search"
                    style="float:right;width:200px;"
                    size="mini"
                    v-model="changeNum"
                    @input="searchEnterFun"></el-input>
          <div style="float:right;width:160px;margin-right:12px;">
            <span>状态</span>
            <el-select style="display:inline-block;width:126px"
                       v-model="parkStatus"
                       size="mini"
                       @change='getValue'>
              <el-option v-for="item in statusList"
                         :key="item.label"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
          <div style="float:right;width:220px;margin-right:12px;">
            <span>停车平台</span>
            <el-select style="display:inline-block;width:159px"
                       v-model="parkName"
                       size="mini"
                       @change='getValue1'>
              <el-option v-for="item in orgNameList"
                         :key="item.uniqueId"
                         :label="item.name"
                         :value="item.uniqueId"></el-option>
            </el-select>
          </div>
        </div>
        <div style="flex:1;"
             ref="tableBox">
          <el-table :data="tableData"
                    border
                    size="mini"
                    stripe
                    @selection-change="handleSelectionChange"
                    @row-dblclick="showDetail"
                    :height="tableHeight">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             label="序号"
                             prop='index'></el-table-column>
            <el-table-column v-for="item in tableColumn"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             :sortable="item.sortable"
                             show-overflow-tooltip
                             align="center"
                             :resizable="resizable"></el-table-column>
          </el-table>
        </div>
        <div class="pagination-box">
          <park-paging ref="listPagination"
                       :total="total"
                       @paginationConfChange="paginationConfChange"></park-paging>
        </div>
      </div>
      <host-edit v-if="hostEditShow"
                 :hostEditInfo="this.selectData[0]"
                 ref="refEdit"
                 @closeEdit='guanbiBtn'
                 @examine='examine'></host-edit>
      <examine v-if="examineShow"
               @closeEdit='guanbiBtn'></examine>
    </div>
  </div>
</template>

<script>
import parkPaging from '../../../components/parkPaging'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/parkingManage/parkingRecord.api.js'
// import { getParkPlatformApi, getParkHostListApi, updateParkHostApi } from '@src/http/parkingManage/parkingRecord.api.js'
import hostEdit from './hostEdit'
import examine from './examine'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'List',
  components: {
    parkPaging,
    treeBox,
    hostEdit,
    examine,
  },
  data() {
    return {
      orgId: '',
      treeType: 2,
      resizable: false,
      tableHeight: 660,
      changeNum: '',
      parkStatus: '',
      hostConfigShow: true,
      hostEditShow: false,
      examineShow: false,
      topTitle: '列表',
      parkName: '',
      tableColumn: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '140' },
        { prop: 'platformName', sortable: true, label: '所属停车平台', width: '140' },
        { prop: 'parking', label: '车场', width: '' },
        { prop: 'name', sortable: true, label: '停车主机名称', width: '140' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'id', label: '设备ID', width: '' },
        { prop: 'ip', label: 'IP地址', width: '' },
        { prop: 'port', label: '端口', width: '' },
        { prop: 'status', label: '状态', width: '' },

        { prop: 'barriersNumber', label: '道闸数量', width: '' },
        { prop: 'channelNumber', label: '通道数量', width: '' },
      ],
      // 状态选项
      statusList: [
        { label: '全部', value: 0 },
        { label: '在线', value: 1 },
        { label: '离线', value: 2 },
      ],
      // 停车平台选项
      orgNameList: [],
      tableData: [],
      total: 0,
      paginationConfig: {
        limit: 100,
        page: 1,
      },
      selectData: [],
    }
  },
  computed: {
    ...mapState({
      handleSelectionChangeArr: ({ parkingManage }) => parkingManage.handleSelectionChangeArr,
      activeData: ({ parkingManage }) => parkingManage.activeData,
    }),
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  created() {
    this.getParkHostList({ page: 1, limit: 25 })
  },
  methods: {
    ...mapMutations(['CHANGE_EXA_SAVE', 'CHANGE_EXA_BTN', 'SELECTION_CHANGE_HTGHT']),
    ...mapActions(['getParkHost', 'exportParkPlatform', 'getParkPlatform']),
    // 停车主机查询
    getParkHostList(data) {
      this.getParkHost(data)
        .then((res) => {
          console.log(res.data.data.hosts, ' 查询停车主机')
          let reslut = res.data && res.data.data && res.data.data.hosts
          if (reslut && reslut.length > 0) {
            reslut.map((item) => {
              if (item.status === 1) {
                item.status = '在线'
              } else {
                item.status = '离线'
              }
            })
          }
          this.tableData = reslut
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 搜索
    searchEnterFun() {
      this.getParkHostList({ name: this.changeNum })
      this.getParkHostList({ ip: this.changeNum })
    },
    // 状态选择
    getValue() {
      this.getParkHostList({ status: this.parkStatus })
    },
    getValue1() {
      this.getParkHostList({ name: this.parkName })
    },
    // 停车平台选择
    getgetParkPlatformFn(data) {
      this.getParkPlatform(data).then((res) => {
        console.log(res.data.data.platforms)
        this.orgNameList = res.data.data.platforms
      })
    },

    // 导出列表
    exportHost() {
      this.exportParkPlatform()
        .then((res) => {
          console.log(res, '导出成功')
        })
        .catch((err) => {
          console.log(err)
        })
      // 前端导出
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      const tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '所属停车平台',
        '停车主机名称',
        '品牌',
        '型号',
        'IP地址',
        '端口',
        '状态',
        '车场',
        '道闸数量',
        '通道数量',
      ]
      const filterVal = [
        'index',
        'orgName',
        'keyPartName',
        'orgName',
        'name',
        'brand',
        'modelNum',
        'ip',
        'port',
        'status',
        'site',
        'wayNum',
        'aisleNum',
      ]
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    // 打印
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'index', displayName: '序号' },
          { field: 'oid', displayName: '所属机构' },
          { field: 'keyPartId', displayName: '所属重点部位' },
          { field: 'orgName', displayName: '所属停车平台' },
          { field: 'name', displayName: '停车主机名称' },
          { field: 'brand', displayName: '品牌' },
          { field: 'model', displayName: '型号' },
          { field: 'model', displayName: 'IP地址' },
          { field: 'port', displayName: '端口' },
          { field: 'status', displayName: '状态' },
          { field: 'site', displayName: '车场' },
          { field: 'wayNum', displayName: '道闸数量' },
          { field: 'aisleNum', displayName: '通道数量' },
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">停车主机</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;',
      })
    },
    getTableList() {},
    refresh() {},
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getTableList()
    },
    // 双击查看
    showDetail(val) {
        console.log(val,'ceshi')
      this.hostEditShow = false
      this.hostConfigShow = false
      this.examineShow = true
    },
    // 编辑按钮
    hostConfigEditBtn() {
      this.hostConfigShow = false
      this.hostEditShow = true
      this.topTitle = '编辑'
    },
    // 刷新列表
    getAlarmHostList() {
      this.getParkHostList()
    },
    resizeFun() {
      // this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    guanbiBtn() {
      this.hostConfigShow = true
      this.hostEditShow = false
      this.examineShow = false
    },
    // 表格选中触发的事件
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
    },
    // 机构数
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {
      console.log(data, '****')
      this.tableData = []
      if (data.tierType === 'org') {
        this.getgetParkPlatformFn({ orgId: data.id })
        let obj = {
          orgId: data.id,
          //   pageSize: this.pageSize,
          //   pageNum: this.page
        }
        this.getParkHost(obj).then((res) => {
          console.log(res)
          let result = res.data.data.hosts
          if (result && result.length > 0) {
            this.tableData = result
          } else {
            this.$notify.warning({
              title: '警告',
              message: '未查到数据',
            })
          }
        })
      } else if (data.tierType === 'loc') {
        this.getgetParkPlatformFn({ orgId: data.id })
        this.getParkHost({ keyPartId: data.id }).then((res) => {
          console.log(res)
          let result = res.data.data.hosts
          if (result && result.length > 0) {
            this.tableData = result
          } else {
            this.$notify.warning({
              title: '警告',
              message: '未查到数据',
            })
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.platform-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-content {
    width: 280px;
    border: 1px solid #e1e1e1;
    .treeBox {
      padding: 10px 10px;
    }
  }
  .right-content {
    font-size: 12px;
    padding-top: 10px;
    width: calc(~'100% - 280px');
    padding-left: 10px;
    box-shadow: 0 0 10px #ccc inset;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  .detail-box,
  .detail-bottom {
    color: #666;
    width: 100%;
    padding: 8px;
    border: 1px solid #f2f2f2;
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    .detail-item {
      display: flex;
      width: 50%;
      height: 32px;
      line-height: 32px;
      .item-left {
        width: 100px;
        background: #f8f8f8;
        border: 1px solid #fff;
      }
      .item-right {
        flex: 1;
        border: 1px solid #f8f8f8;
        border-left: none;
      }
    }
  }
  .detail-bottom {
    .detail-item {
      width: 33.33%;
    }
  }
  .detail-footer {
    margin-top: 24px;
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
</style>
