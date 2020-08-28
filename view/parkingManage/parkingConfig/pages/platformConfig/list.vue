<!--
 * @Author: your name
 * @Date: 2020-06-05 17:18:35
 * @LastEditTime: 2020-06-17 11:37:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\platformConfig\list.vue
-->
<template>
  <div class="platform-list-box">
    <div class="tree-content"
         v-if="isEditShow">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="filter"
               :treeType="treeType"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle></treeBox>
    </div>
    <div class="right-content"
         v-if="isEditShow">
      <!-- 顶部操作栏 -->
      <div class="top-box">
        <!-- 面包屑 -->
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>停车管理</el-breadcrumb-item>
            <el-breadcrumb-item>停车平台管理</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <!-- 操作按钮 -->
        <div class="button-box"
             v-if="isListShow">
          <el-button size="mini"
                     @click="isCreateBtn('create')">新建</el-button>
          <el-button size="mini"
                     @click="isCreateBtn('edit')"
                     :disabled="this.selectData.length !== 1">编辑</el-button>
          <el-button size="mini"
                     @click="cancelBtn"
                     :disabled="this.selectData.length < 1">删除</el-button>
          <el-button size="mini"
                     @click="isShowMoveBtn">迁移</el-button>
          <el-button size="mini"
                     @click="exportPlatform">导出</el-button>
          <el-button size="mini"
                     @click="Toprint">打印</el-button>
        </div>
      </div>
      <div class="table-box"
           v-if="isListShow">
        <div class="table-top">
          <el-button type="text"
                     icon="el-icon-refresh"
                     @click="getAlarmHostList">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search"
                    style="float:right;width:200px;"
                    size="mini"
                    v-model="changeNum"
                    @input="searchEnterFun"></el-input>
        </div>
        <div style="flex:1;"
             ref="tableBox">
          <el-table :data="tableData"
                    border
                    size="mini"
                    @selection-change="handleSelectionChange"
                    stripe
                    height="670">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             prop="index"
                             label="序号"></el-table-column>
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
          <el-pagination @size-change="handleSizeChange"
                         style="float:right"
                         @current-change="handleCurrentChange"
                         :page-sizes="[10, 25, 50, 100]"
                         :page-size="pageSize"
                         :current-page="page"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </div>
      <deleteDialog ref='dialogVisible'
                    @deleteInfo="deleteInfo"></deleteDialog>
      <print-List v-if="isPrintShow"
                  @excloseBtn="excloseBtn"></print-List>
      <move-list v-show="isShowMove"
                 :isShowMove="isShowMove"
                 @excloseBtn="excloseBtn"></move-list>
    </div>
    <create-info v-if="!isEditShow"
                 @skipToList='skipToList'
                 ref="platform"></create-info>
  </div>
</template>

<script>
import createInfo from './Create'
import printList from './print'
import deleteDialog from '../../../components/deleteDialog'
import moveList from './Move'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, getParkPlatformApi, deleteParkPlatformApi } from '@src/http/parkingManage/parkingRecord.api.js'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'list',
  components: {
    treeBox,
    printList,
    deleteDialog,
    moveList,
    createInfo,
  },
  data() {
    return {
      orgId: '',
      treeType: 2,
      pageSize: 25,
      page: 1,
      changeNum: '',
      resizable: false,
      isEditShow: true,
      // tableHeight: 700,
      isListShow: true,
      isPrintShow: false,
      isShowMove: false,
      tableColumn: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '' },
        { prop: 'name', sortable: true, label: '平台名称', width: '' },
        { prop: 'id', sortable: true, label: '平台ID', width: '' },
        { prop: 'ip', sortable: true, label: 'IP地址', width: '' },
        { prop: 'port', label: '端口', width: '' },
        { prop: 'updatedDept', label: '录入机构', width: '' },
        { prop: 'updatedBy', label: '录入人', width: '' },
        { prop: 'updatedAt', label: '录入时间', width: '' },
      ],
      tableData: [],
      total: 0,
      paginationConfig: {
        limit: 100,
        page: 1,
      },
      selectData: [],
      dialogVisible: false,
    }
  },
  created() {
    this.getParkPlatformListQuery()
  },
  computed: {
    ...mapState({
      handleSelectionChangeArr: ({ parkingManage }) => parkingManage.handleSelectionChangeArr,
      activeData: ({ parkingManage }) => parkingManage.activeData,
    }),
  },
  mounted() {},
  methods: {
    ...mapMutations(['CHANGE_TAB', 'CHANGE_EXA_BTN', 'CHANGE_EXA_SAVE']),
    ...mapActions(['getParkPlatform', 'deleteParkPlatform', 'exportParkPlatform']),
    getTableList() {},
    refresh() {},
    cancelBtn() {
      this.$refs.dialogVisible.dialogVisible = true
    },

    // detectorData: {
    //   orgId: '',
    //   keyPartId: '',
    //   platformId: 2
    // },
    // 平台搜索
    searchEnterFun() {
      let params = {
        limit: this.paginationConfig.limit,
        page: this.paginationConfig.page,
        port: this.port,
      }
      console.log(this.orgId)
      this.getParkPlatformListQuery({ name: this.changeNum })
      this.getParkPlatformListQuery({ ip: this.changeNum })
      //   getParkPlatformApi({name:this.changeNum})
      //     .then(res => {
      //       console.log('查询停车平台', res.data.data.platforms)
      //       // this.formData.id = res.data.data.id
      //       let result = res.data.data.platforms
      //       console.log(result)
      //       this.tableData = result
      //     })
      //     .catch(err => {
      //       this.Error(err)
      //     })
    },
    // 平台配置--停车平台列表查询
    getParkPlatformListQuery(params) {
      //   let params = {
      //     limit: this.paginationConfig.limit,
      //     page: this.paginationConfig.page
      //   }
      getParkPlatformApi(params)
        .then((res) => {
          console.log('查询停车平台', res.data.data.platforms)
          let result = res.data.data.platforms
          console.log(result, '==========t')
          this.tableData = result
        })
        .catch((err) => {
          this.Error(err)
        })
    },
    // 删除
    deleteInfo() {
      let idsArr = []
      this.selectData.map((item) => {
        idsArr.push(item.id)
      })
      console.log(idsArr)
      deleteParkPlatformApi(idsArr)
        .then((res) => {
          // console.log(res);
          this.$notify.success({
            title: '成功',
            message: '删除成功',
          })
          this.getParkPlatformListQuery()
        })
        .catch((err) => {
          console.log(err)
        })
      // this.deleteParkPlatform(idsArr)
      //   .then(res => {
      //     console.log(res)
      //     this.$notify.success({
      //       title: '成功',
      //       message: '删除成功'
      //     })
      //     this.getParkPlatformListQuery()
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    // 查看
    // examineBtn() {
    //   this.isListShow = false
    //   this.isPrintShow = true
    //   this.CHANGE_EXA_BTN(false)
    // },
    // 新建按钮
    isCreateBtn(val) {
      if (val === 'edit') {
        this.isEditShow = false
        this.selectData[0].orgId = this.selectData[0].orgName
        this.selectData[0].keyPartId = this.selectData[0].keyPartName
        this.$nextTick(() => {
          this.$refs.platform.isEditShow(this.selectData[0])
        })
      } else {
        this.CHANGE_TAB('platformConfig-Create')
      }
    },
    skipToList() {
      this.isEditShow = true
    },
    // 导出
    exportPlatform() {
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
        '平台名称',
        '平台ID',
        'IP地址',
        '端口',
        '录入机构',
        '录入人',
        '录入时间',
      ]
      const filterVal = [
        'index',
        'orgName',
        'keyPartName',
        'name',
        'id',
        'ip',
        'port',
        'updatedDept',
        'updatedBy',
        'updatedAt',
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
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'name', displayName: '平台名称' },
          { field: 'id', displayName: '平台ID' },
          { field: 'ip', displayName: 'IP地址' },
          { field: 'port', displayName: '端口' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' },
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">停车平台</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;',
      })
    },
    excloseBtn() {
      this.isListShow = true
      this.isPrintShow = false
      this.isShowMove = false
    },
    // 迁移
    isShowMoveBtn() {
      this.isShowMove = true
      this.isListShow = false
    },
    // 打印
    printBtn() {
      window.open('www.baidu.com')
    },
    // 列表每页显示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    // 列表分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.zoneArr = []
      this.getAlarmHostManageList({ deviceType: '电话报警主机,网络报警主机', pageSize: this.pageSize, pageNum: val })
    },
    // 刷新列表
    getAlarmHostList() {
      this.getParkPlatformListQuery()
    },
    // 表格选中触发的事件
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
    },
    resizeFun() {
      //   this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    // 机构数
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {
      console.log(data, '****')
      if (data.tierType === 'org') {
        let obj = {
          orgId: data.id,
          //   pageSize: this.pageSize,
          //   pageNum: this.page
        }
        this.getParkPlatform(obj).then((res) => {
          console.log(res)
          let result = res.data.data.platforms
          if (result && result.length > 0) {
            this.tableData = result
          } else {
            this.$notify.warning({
              title: '警告',
              message: '未查到数据',
            })
            this.tableData = []
          }
        })
      } else if (data.tierType === 'loc') {
        this.getParkPlatform({ keyPartId: data.id }).then((res) => {
          console.log(res)
          let result = res.data.data.platforms
          if (result && result.length > 0) {
            this.tableData = result
          } else {
            this.$notify.warning({
              title: '警告',
              message: '未查到数据',
            })
            this.tableData = []
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
      .el-breadcrumb {
        margin-bottom: 12px;
      }
      .button-box {
        margin-bottom: 12px;
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
