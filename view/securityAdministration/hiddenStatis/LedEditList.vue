<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTvWallTreeApi"
               @onceClick="onceClick"
               @rootId="setRootId"
               searchType="filter"
               treeLazyToggle
               iconToggle>
      </treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
            <el-breadcrumb-item>LED设备配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="small"
                     icon="el-icon-plus"
                     @click="skipTo('AddLedEdit', 1)">新建</el-button>
          <el-button :disabled="multipleSelection.length !== 1"
                     size="small"
                     icon="el-icon-edit-outline"
                     @click="skipTo('ChangeLedEdit', 2)">编辑</el-button>
          <el-button :disabled="multipleSelection.length === 0"
                     size="small"
                     icon="el-icon-delete"
                     @click="deleteMethod">删除</el-button>
          <el-button :disabled="multipleSelection.length === 0"
                     size="small"
                     icon="icon iconfont-ccb ccbqianyi el-icon-"
                     @click="skipTo('moveLed', 3)">迁移</el-button>
          <el-button :disabled="multipleSelection.length !== 1"
                     size="small"
                     icon="el-icon-sort"
                     @click="skipTo('SortLed', 4)">排序</el-button>
          <el-button @click="exportMethod"
                     icon="icon iconfont-ccb ccbdaochu1 el-icon-"
                     size="small">导出</el-button>
          <el-button @click="Toprint"
                     size="small"
                     icon="el-icon-printer">打印</el-button>
        </div>
      </div>
      <div class="table-box">
        <div class="table-top">
          <el-checkbox style="margin-right:12px;"
                       @change="change_subOrg"
                       v-model="isShowSubOrg">显示子机构</el-checkbox>
          <el-button @click="handlerRefresh"
                     type="text"
                     icon="el-icon-refresh">刷新列表</el-button>
          <el-input v-model="input"
                    @change="searchList"
                    suffix-icon="el-icon-search"
                    placeholder="请输入设备名称或设备IP..."
                    maxlength="64"
                    style="float:right;width:200px;"
                    size="mini"></el-input>
        </div>
        <div style="flex:1;"
             ref="tableBox">
          <el-table :data="tableData"
                    @cell-dblclick="seeMessage"
                    border
                    size="mini"
                    @selection-change="handleSelectionChange"
                    stripe
                    :height="tableHeight">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column min-width="105px"
                             v-for="item in tableColumn"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             :sortable="item.sortable"
                             show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination :current-page="pageInfo.page"
                         :page-size="pageInfo.limit"
                         style="text-align:right;"
                         :page-sizes="[10, 20, 30, 50]"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="pageInfo.total"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTreeApi, getTvWallTreeApi } from '../../../http/tvWall/tvWallmanage.api'
import treeBox from '@src/components/tree/treeBox'
import { mapMutations, mapActions } from 'vuex'
export default {
  components: {
    treeBox
  },
  data() {
    return {
      input: '', // 搜素
      currentOrgId: '',
      currentKeyPartId: '',
      currentWallId: '',
      rootId: '',
      treeType: 2,
      pageInfo: {
        // 页码组件返回参数
        limit: 50,
        page: 1,
        total: 0 // 总页码
      },
      query: {
        page: 1,
        limit: 50,
        rescusive: false,
        orgId: '',
        keyPartId: '',
        wallId: '',
        type: 3
      },
      filterText: '',
      multipleSelection: [],
      status: '全部',
      isShowSubOrg: false,
      tableHeight: 688,
      tableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '所属机构', width: '', sortable: true },
        { prop: 'keyPartName', label: '所属重点部位', width: '120', sortable: true },
        { prop: 'wallName', label: '所属电视墙', width: '120', sortable: true },
        { prop: 'name', label: '设备名称', width: '', sortable: true },
        { prop: 'brand', label: '品牌', width: '', sortable: true },
        { prop: 'modelNum', label: '型号', width: '', sortable: true },
        { prop: 'accessService', label: '接入服务器', width: '140', sortable: true },
        { prop: 'accessProtocol', label: '接入方式', width: '', sortable: true },
        { prop: 'ip', label: 'IP地址', width: '', sortable: true },
        { prop: 'port', label: '端口', width: '', sortable: true },
        { prop: 'assetCode', label: '资源编码', width: '', sortable: true },
        { prop: 'updatedDept', label: '录入机构', width: '', sortable: true },
        { prop: 'updatedBy', label: '录入人', width: '', sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '120', sortable: true }
      ],
      tableData: []
    }
  },
  created() { },
  mounted() {
    this.getDecodingDeviceList(1)
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_COMPONENTID2', 'SET_MOVEDATA']),
    ...mapActions(['getDecodingDevice', 'deleteDecodingDevice']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getTvWallTreeApi(params) {
      return getTvWallTreeApi(params)
    },
    setRootId(id) {
      this.rootId = id
    },
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.currentOrgId = data.id
      } else if (data.tierType === 'res') {
        this.currentWallId = data.id
      } else {
        this.currentOrgId = node.parent.data.id
        this.currentKeyPartId = data.id
      }
      this.getDecodingDeviceList(1)
    },
    async getDecodingDeviceList(val) {
      await this.getTvWallTreeApi()
      this.query.page = this.pageInfo.page
      this.query.limit = this.pageInfo.limit
      this.query.orgId = this.currentOrgId || this.rootId
      this.query.keyPartId = this.currentKeyPartId || ''
      this.query.wallId = this.currentWallId || ''
      this.getDecodingDevice(this.query)
        .then(res => {
          if (res.data.code === 0) {
            if (val === 2) {
              this.failureMethod('刷新成功')
            }
            this.tableData = res.data.data.hosts
            this.tableData.map(item => {
              item['statusName'] = item.status === 1 ? '在线' : item.status === 2 ? '离线' : ''
            })
            this.pageInfo.total = Number(res.data.data.count.total)
            // 列表请求成功，刷新请求参数
            this.currentOrgId = ''
            this.currentKeyPartId = ''
            this.currentWallId = ''
          } else {
            this.failureMethod('请求失败')
            // 刷新请求参数
            this.currentOrgId = ''
            this.currentKeyPartId = ''
            this.currentWallId = ''
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 是否勾选显示子机构(默认否)
    change_subOrg(val) {
      if (val) {
        this.query.rescusive = true
        this.getDecodingDeviceList(1)
      } else {
        this.query.rescusive = false
        this.getDecodingDeviceList(1)
      }
    },
    // 列表搜索
    searchList(val) {
      let params = {
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
        orgId: this.currentOrgId || this.rootId,
        keyPartId: this.currentKeyPartId || '',
        type: 3,
        key: val
      }
      this.getDecodingDevice(params)
        .then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.hosts
            this.tableData.map(item => {
              item['statusName'] = item.status === 1 ? '在线' : item.status === 2 ? '离线' : ''
            })
            this.pageInfo.total = Number(res.data.data.count.total)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 在线，离线搜索
    search_State(val) {
      let params = {
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
        orgId: this.currentOrgId || this.rootId,
        keyPartId: this.currentKeyPartId || '',
        type: 3,
        status: ''
      }
      if (val === '全部') {
        params.status = ''
      } else if (val === '在线') {
        params.status = 1
      } else if (val === '离线') {
        params.status = 2
      }
      this.getDecodingDevice(params)
        .then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.hosts
            this.tableData.map(item => {
              item['statusName'] = item.status === 1 ? '在线' : item.status === 2 ? '离线' : ''
            })
            this.pageInfo.total = Number(res.data.data.count.total)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    skipTo(data, index) {
      if (index === 1 || index === 5) {
        this.SET_COMPONENTID1(data)
      } else if (index === 2 || index === 4) {
        this.SET_COMPONENTID2('list')
        this.SET_COMPONENTID1(data)
        this.SET_TVWALL_MESSAGE(this.multipleSelection[0])
      } else if (index === 3) { // 迁移
        this.SET_COMPONENTID1(data)
        this.SET_MOVEDATA(this.multipleSelection)
      }
    },
    seeMessage(val) {
      // 双击查看详细信息
      this.SET_COMPONENTID1('newLedMessage')
      this.SET_COMPONENTID2('list') // 从列表进入查看
      this.SET_TVWALL_MESSAGE(val)
    },
    resizeFun() {
      this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    // LED设备列表数据选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除弹框
    deviceModel(val) {
      let title = '确定删除' + val + '吗?' + ',是否继续?'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let obj = {}
          let deleteDataId = []
          this.multipleSelection.map(item => {
            deleteDataId.push(item.id)
          })
          obj.ids = deleteDataId
          this.deleteDecodingDevice(obj)
            .then(res => {
              this.succefullMethod('删除成功')
              this.getDecodingDeviceList(1) // 刷新列表
              this.multipleSelection = [] // 删除成功，清空数组
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除LED设备
    deleteMethod() {
      if (this.multipleSelection.length === 0) {
        this.failureMethod('请选择要删除的LED设备数据')
      } else {
        this.deviceModel('该LED设备')
      }
    },
    // 刷新
    handlerRefresh() {
      this.pageInfo.page = 1
      this.getDecodingDeviceList(2)
    },
    // 分页（修改数量）
    handleSizeChange(val) {
      this.pageInfo.page = 1
      this.pageInfo.limit = val
      this.getDecodingDeviceList(1)
    },
    // 设备列表导出
    exportMethod() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = [
        '所属机构',
        '所属重点部位',
        '所属电视墙',
        '设备名称',
        '品牌',
        '型号',
        '接入服务器',
        '接入方式',
        'IP地址',
        '端口',
        '资源编码',
        '录入机构',
        '录入人',
        '录入时间'
      ]
      // 字段名
      const filterVal = [
        'orgName',
        'keyPartName',
        'wallName',
        'name',
        'brand',
        'modelNum',
        'accessService',
        'accessProtocol',
        'ip',
        'port',
        'assetCode',
        'updatedDept',
        'updatedBy',
        'updatedAt'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'LED设备列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'wallName', displayName: '所属电视墙' },
          { field: 'name', displayName: '设备名称' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' },
          { field: 'accessService', displayName: '接入服务器' },
          { field: 'accessProtocol', displayName: '接入方式' },
          { field: 'ip', displayName: 'IP地址' },
          { field: 'port', displayName: '端口' },
          { field: 'assetCode', displayName: '资源编码' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">LED设备配置列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 分页（修改页码）
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.getDecodingDeviceList(1)
    },
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    height: 100%;
    width: calc(~'100% - 240px');
    position: absolute;
    left: 240px;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
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
// 迁移弹窗样式
.transferWrap /deep/ .el-dialog {
  width: 628px;
}
.transferWrap /deep/.el-dialog__header {
  padding: 10px 20px 10px 20px;
  border-bottom: 1px solid #f3f3f3;
}
.transferWrap /deep/ .el-dialog__title {
  font-weight: bolder;
  font-size: 15px;
}
.transferWrap /deep/.el-dialog__headerbtn {
  top: 15px;
}
.transferWrap2 /deep/ .el-dialog__body {
  padding: 16px 20px;
}
.modelContend {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 300px;
}
.modelLeft {
  width: 270px;
  height: 100%;
  border: 1px solid gainsboro;
}
.titleLeft {
  width: 100%;
  line-height: 30px;
  text-align: center;
  height: 30px;
  background: rgba(242, 242, 242, 1);
}
.modelWrap {
  width: 100%;
  height: 100%;
}
.tvWallModelMessage {
  width: 100%;
  display: flex;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
}
.titleMessage {
  width: 100px;
  text-align: right;
}
.localTerminal1 {
  height: 270px;
  overflow: auto;
}
</style>
