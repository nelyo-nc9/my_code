<template>
  <div class="org-manage-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>机构管理</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
          <el-button size="small" icon="icon iconfont-ccb ccbdaochu1 el-icon-" :disabled="!tableData.length" @click="clickExport">导出</el-button>
          <el-button size="small" icon="el-icon-printer" :disabled="!hasSelectData" @click="clickPrint()">打印</el-button>
          <el-button size="small" icon="el-icon-plus" @click="clickCreate()" v-if="isBtn('新建')">新建</el-button>
          <el-button size="small" icon="el-icon-edit-outline" :disabled="!hasSelectData || hasCcbcOrg" @click="clickModify()" v-if="isBtn('编辑')">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" :disabled="!hasSelectData || hasCcbcOrg" @click="openDeleteTips()" v-if="isBtn('删除')">删除</el-button>
          <el-button size="small" @click="clickRank()" v-if="isBtn('排序')">排序</el-button>
          <el-button size="small" icon="icon iconfont-ccb ccbqianyi el-icon-" :disabled="!hasSelectData || hasCcbcOrg" @click="clickTransfer()" v-if="isBtn('迁移')">迁移</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            @selection-change="selectionChange"
            @row-dblclick="rowDbClick"
            height="100%"
            max-height="805"
            style="width: 100%">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="60" align="center"> </el-table-column>
            <el-table-column
              v-for="(column, index) in columns" :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable">
            </el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :page-sizes="[25, 50, 100, 200]"
            :page-size.sync="limit"
            :current-page.sync="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgListApi, orgDeleteApi } from '@src/http/basicInfoManage/orgManage.api'
import { download } from '@src/common/download.js'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgManageList',
  props: {
    nodeData: { // 所属机构信息
      type: Object,
      default: () => {}
    },
     statusArr:{
      type:Array,
      default:()=>{
         return []
      }
    },
    kindArr:{
      type:Array,
      default:()=>{
         return []
      }
    },
  },
  data() {
    return {
      resizable: true,
      columns: [
        { prop: 'name', sortable: true, label: '机构名称', width: '150' },
        { prop: 'serial', sortable: true, label: '机构编号', width: '100' },
        { prop: 'kindName', sortable: true, label: '机构类别', width: '100' },
        { prop: 'telephone', sortable: true, label: '固定电话', width: '120' },
        { prop: 'functionary', sortable: true, label: '机构负责人', width: '120' },
        { prop: 'mobile', sortable: true, label: '移动电话', width: '100' },
        { prop: 'email', sortable: true, label: '电子邮件', width: '100' },
        { prop: 'address', sortable: true, label: '机构地址', width: '150' },
        { prop: 'statusName', sortable: true, label: '机构状态', width: '100' },
        { prop: 'businessHours', sortable: true, label: '开始营业时间', width: '150' },
        { prop: 'startBusiness', sortable: true, label: '开业日期', width: '150' },
        { prop: 'closeBusiness', sortable: true, label: '关闭日期', width: '150' },
        { prop: 'parentName', sortable: true, label: '上级机构名称', width: '120' },
        { prop: 'parentSerial', sortable: true, label: '上级机构编号', width: '120' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
        { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
      ],
      tableData: [],
      total: 0,
      showSubOrg: true,
      selectData: [],
      page: 1,
      limit: 100,
      hasSelectData: false, // 是否有选择列表
      hasCcbcOrg: false, // 是否有建行机构，建行机构不可以修改删除
      statusArr1:[],
      kindArr1:[]
    }
  },
  watch: {
    'nodeData.id': {
      handler() {
        this.getTableList()
      },
      deep: true
    },
    showSubOrg() {
      this.getTableList()
    },
    selectData() {
      if (this.selectData.length) {
        this.hasSelectData = true
      } else {
        this.hasSelectData = false
      }
    },
    statusArr:{
      handler(newV){
        this.statusArr1=newV
      },
      deep:true
    },
    kindArr:{
      handler(newV){
        this.kindArr1=newV
      },
      deep:true
    }
  },
  created() {
    this.kindArr1=this.kindArr.map(item=>{return item.label})
    this.statusArr1=this.statusArr.map(item=>{return item.label})
    console.log(this.statusArr1,'statusArr1')
    this.getTableList()
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
  },
  methods: {
    sizeChange() { // 每页条数改变
      this.getTableList()
    },
    currentChange() { // 当前页改变
      this.getTableList()
    },
    getTableList() { // 请求表格数据方法
      if (!this.nodeData.id) {
        return
      }
      this.selectData = []
      this.hasCcbcOrg = false
      let param = {
        oid: this.nodeData.serial,
        isRecursion: this.showSubOrg ? 1 : 0,
        page: this.page,
        limit: this.limit
      }
      console.log(param, 'param')
      getOrgListApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          this.tableData = res.data.data.orgList
          this.total = res.data.data.count
          // let statusArr = ['', '待营业', '正常营业', '暂停营业', '终止营业']
          // let kindArr = ['', '总行', '一级分行', '二级分行', '直管行', '县级行', '园区']
          this.tableData.forEach(item => {
            item.statusName = this.statusArr1[item.status-1]
            item.kindName = this.kindArr1[item.kind-1] || ''
            item.parentName = item.pid.name || ''
            item.parentSerial = item.pid.serial || ''
          })
        } else {
          console.log(res.message, 'err')
          this.tableData = []
        }
      }).catch(err => {
        console.log(err, 'err')
        this.tableData = []
      })
    },
    // 刷新表格
    refresh() {
    },
    selectionChange(items) { // 当表单勾选项发生变化时
      console.log(items, 'items')
      this.hasCcbcOrg = false
      this.selectData = items
      this.selectData.forEach(item => {
        if (!item.type || item.type !== 1) { // type:0-建行机构，1-安防机构
          this.hasCcbcOrg = true
        }
      })
    },
    rowDbClick(row) {
    },
    clickCreate() {
      this.$emit('changeComponent', 'OrgCreateModify', '新建机构')
    },
    clickModify() {
      if (this.selectData.length === 0) {
        this.$messageWarn('请选择一条数据！')
        return
      }
      if (this.selectData.length > 1) {
        console.log('只能选择一条数据')
        this.$messageWarn('只能选择一条数据！')
        return
      }
      this.$emit('changeComponent', 'OrgCreateModify', '编辑机构', this.selectData[0])
    },
    openDeleteTips(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          this.deleteOrg()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    deleteOrg() {
      if (this.selectData.length === 0) {
        return
      }
      let idArr = []
      this.selectData.forEach(item => {
        idArr.push(item.id)
      })
      let param = {
        ids: idArr
      }
      orgDeleteApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          console.log('删除成功')
          this.$messageSuccess('机构删除成功！', '成功')
          this.getTableList()
        } else {
          console.log(res, '机构删除失败')
          this.$messageError(`机构删除失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError('机构删除失败，请稍后重试！', '错误')
      })
    },
    clickTransfer() {
      if (this.selectData.length === 0) {
        this.$messageWarn('请选择一条数据！')
        return
      }
      if (this.selectData.length > 1) {
        console.log('只能选择一条数据')
        this.$messageWarn('只能选择一条数据！')
        return
      }
      this.$emit('changeComponent', 'TransferDialog', '机构迁移', this.selectData[0])
    },
    clickRank() {
      this.$emit('changeComponent', 'RankDialog', '机构排序')
    },
    clickPrint() {
      if (this.selectData.length === 0) {
        this.$messageWarn('请选择列表数据！')
        return
      }
      let propArr = [{field: 'index', displayName: '序号'}]
      let columnPropArr = []
      for (let i = 0; i < this.columns.length; i++) {
        columnPropArr.push(this.columns[i].prop)
        let tempObj = {
          field: this.columns[i].prop,
          displayName: this.columns[i].label
        }
        propArr.push(tempObj)
      }
      let cpData = JSON.parse(JSON.stringify(this.selectData))
      cpData.forEach((item, index) => {
        item.index = index + 1
        columnPropArr.forEach(it => {
          if (!item.hasOwnProperty(it)) { // 补全没有的项，否则打印时会出现undefined
            item[it] = ''
          }
        })
      })
      console.log(cpData, 'cpData666666666666')
      printJS({
        // 表格数据的来源
        printable: cpData,
        // field 表格内容  displayName：表头名
        properties: propArr,
        type: 'json',
        // 表题
        header: '<p class="custom">机构列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
      })
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    clickExport() {
      let params = {
        type: 2,
        listCondition: {
          oid: this.nodeData.serial,
          isRecursion: this.showSubOrg ? 1 : 0
        }
      }
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/organizational/v1/org/export`
      let name = `机构导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
      download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'post', params)
    }
  }
}
</script>

<style lang="less" scoped>
  .org-manage-list-box {
    width: 100%;
    height: 100%;
    display: flex;
    .content {
      width: 100%;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      .top {
        .header {
          margin-bottom: 10px;
        }
        .button-box {
          margin-bottom: 10px;
          .el-button {
            width: 80px;
          }
        }
      }
      .main {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 200px;
        .list-box-table {
          overflow: auto;
          flex: 1;
        }
        .main-footer{
          height: 40px;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }
      }
    }
  }
</style>
