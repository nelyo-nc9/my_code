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
            <el-breadcrumb-item>重点部位</el-breadcrumb-item>
            <el-breadcrumb-item>{{componentTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
          <el-button size="small" icon="el-icon-plus" @click="clickCreate()" v-if="isBtn('新建')">新建</el-button>
          <el-button size="small" icon="el-icon-edit-outline" :disabled="!hasSelectData" @click="clickModify()" v-if="isBtn('编辑')">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" :disabled="!hasSelectData" @click="openDeleteTips()" v-if="isBtn('删除')">删除</el-button>
          <el-button size="small" @click="clickRank()" :disabled="!hasSelectData" v-if="isBtn('排序')">排序</el-button>
          <el-button size="small" icon="icon iconfont-ccb ccbqianyi el-icon-" :disabled="!hasSelectData" @click="clickTransfer()" v-if="isBtn('迁移')">迁移</el-button>
          <el-button size="small" icon="icon iconfont-ccb ccbdaochu1 el-icon-" :disabled="!tableData.length" @click="clickExport" >导出</el-button>
          <el-button size="small" icon="el-icon-printer" :disabled="tableData.length==0" @click="clickPrint" >打印</el-button>
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
            @cell-dblclick="rowDbClick"
            height="100%"
            max-height="805"
            style="width: 100%">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
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
import { getKeyPartListApi, deleteKeyPartApi } from '@src/http/basicInfoManage/keyPart.api'
import { download } from '@src/common/download.js'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'List',
  props: {
    componentTitle: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    nodeData: { // 所属机构信息
      type: Object,
      default: () => {}
    },
    keyPartType: {
      type: Number,
      default: 1
    },
     statusList:{
      type:Array,
      default:()=>{
         return []
      }
    }
  },
  data() {
    return {
      resizable: true,
      tableData: [],
      total: 0,
      showSubOrg: true,
      selectData: [], // 表单勾选项
      hasSelectData: false, // 是否有选择列表
      page: 1,
      limit: 100,
      statusList1:[],
      statusArr:[]
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
    keyPartType() {
      this.getTableList()
    },
    selectData() {
      if (this.selectData.length) {
        this.hasSelectData = true
      } else {
        this.hasSelectData = false
      }
    },
    statusList:{
      handler(newV){
        this.statusList1=newV
      },
      deep:true
    }
  },
  created() {
    if(this.statusList||this.statusList.length>0){
        this.statusArr = this.statusList.map(item=>{return item.label})
    } 
    console.log(this.nodeData, 'this.nodeData6666')
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
      let param = {
        oid: this.nodeData.id,
        isRecursion: this.showSubOrg ? 1 : 0,
        type: this.keyPartType,
        page: this.page,
        limit: this.limit
      }
      getKeyPartListApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          // let statusArr = ['', '正常', '已撤销', '已合并', '临时停业']
          let nearbyKeyPartTypeArr = ['', '', '', '', '', '自助银行', '自助设备', '自助银亭']
          this.tableData = res.data.data.ketPartList.map(item => {
            item.id = item.keyPart.id
            item.name = item.keyPart.name
            item.type = item.keyPart.type
            item.address = item.keyPart.address
            item.orgId = item.keyPart.orgId
            item.oidName = item.oid.name
            item.telephone = item.keyPart.telephone
            item.principal1 = item.keyPart.principal1
            item.principalPhone1 = item.keyPart.principalPhone1
            item.principal2 = item.keyPart.principal2
            item.principalPhone2 = item.keyPart.principalPhone2
            item.principal3 = item.keyPart.principal3
            item.principalPhone3 = item.keyPart.principalPhone3
            item.principal4 = item.keyPart.principal4
            item.principalPhone4 = item.keyPart.principalPhone4
            item.principal5 = item.keyPart.principal5
            item.principalPhone5 = item.keyPart.principalPhone5
            item.policeStation = item.keyPart.policeStation
            item.policeTelephone = item.keyPart.policeTelephone
            item.police = item.keyPart.police
            item.policeMobilePhone = item.keyPart.policeMobilePhone
            item.serial = item.keyPart.serial
            item.remark = item.keyPart.remark
            item.statusName = this.statusArr[Number(item.keyPart.status)-1]
            item.nearbyKeyPartType = item.nearbyKeyPart.type
            item.nearbyKeyPartTypeName = item.nearbyKeyPart.type ? nearbyKeyPartTypeArr[item.nearbyKeyPart.type] : ''
            item.nearbyKeyPartName = item.nearbyKeyPart.name
            item.updatedBy = item.keyPart.updatedBy
            item.updatedDept = item.keyPart.updatedDept
            item.updatedAt = item.keyPart.updatedAt
            return item
          })
          this.total = res.data.data.count
        } else {
          console.log(res.message, 'err')
          this.tableData = []
          this.$messageError('重点部位获取失败，请稍后重试！', '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.tableData = []
        this.$messageError('重点部位获取失败，请稍后重试！', '错误')
      })
    },
    // 刷新表格
    refresh() {
    },
    selectionChange(items) { // 当表单勾选项发生变化时
      console.log(items, 'items')
      this.selectData = items
    },
    rowDbClick(row) {
      console.log(row)
      this.$emit('changeComponent', 'Details', this.componentTitle,row)
    },
    clickCreate() {
      this.$emit('changeComponent', 'Create', this.componentTitle)
    },
    clickModify() {
      if (this.selectData.length === 0) {
        return
      }
      if (this.selectData.length > 1) {
        console.log('只能选择一条数据')
        this.$messageWarn('只能选择一条数据！')
        return
      }
      this.$emit('changeComponent', 'Edit', this.componentTitle, this.selectData[0])
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
      this.$emit('changeComponent', 'TransferDialog', this.componentTitle, this.selectData[0])
    },
    clickRank() {
      this.$emit('changeComponent', 'RankDialog', this.componentTitle)
    },
    clickPrint() {
      let cpData
      if (this.selectData.length === 0) {
        // this.$messageWarn('请选择列表数据！')
        // return
        cpData=JSON.parse(JSON.stringify(this.tableData))
      }else{
        cpData = JSON.parse(JSON.stringify(this.selectData))
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
      // let cpData = JSON.parse(JSON.stringify(this.selectData))
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
        header: `<p class="custom">${this.componentTitle}重点部位列表</p>`,
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样
        gridHeaderStyle: 'border: 1px solid lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
      })
    },
    //删除提示框
    openDeleteTips() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          this.deleteKeyPart()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    deleteKeyPart() {
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
      deleteKeyPartApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          console.log('删除成功')
          this.$messageSuccess('重点部位删除成功！', '成功')
          this.getTableList()
        } else {
          console.log(res, '重点部位删除失败')
          this.$messageError(`重点部位删除失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError('重点部位删除失败，请稍后重试！', '错误')
      })
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
     formatt(row) {
      let obj = {}
      for (let i in row) {
        if (i == 'status') {
          obj[i] = row[i] === 2 ? '在线' : '离线'
        }
        if (i == ('inputNumber' || 'outputNumber' || 'analogNumber' || 'audioNumber' || 'digitalNumber')) {
          obj[i] = row[i] === '' ? '0' : row[i]
        }
        if (i == 'type') {
          obj[i] = DEVICETYPE.filter(item => item.value === row[i])[0] ? DEVICETYPE.filter(item => item.value === row[i])[0].label : '  '
        }
        if (i == 'protocol') {
          obj[i] = TRANSPORTPROTOCOLS.filter(item => item.value === row[i])[0] ? TRANSPORTPROTOCOLS.filter(item => item.value === row[i])[0].label : '  '
        }
        if (i == 'brand') {
          obj[i] = BRANDS.filter(item => item.value === row[i])[0] ? BRANDS.filter(item => item.value === row[i])[0].label : '  '
        }
      }
      return Object.assign(row, obj)
    },
    clickExport() {
      let tHeader=[]
      let filterVal=[]
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      this.columns.forEach(item => {
         tHeader.push(item.label)
         filterVal.push(item.prop)
      })   
      if(this.selectData && this.selectData.length > 0){
        let list = this.selectData
        let data = list.map(v => filterVal.map(j => v[j]))
        data = data.map(item => this.formatt(item))
        export_json_to_excel(tHeader, data, `重点部位导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`)
      } else {
          let params = {
          type: 2,
          listCondition: {
            oid: this.nodeData.id,
            isRecursion: this.showSubOrg ? 1 : 0,
            type: this.keyPartType
          }
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/organizational/v1/key-part/export`
        let name = `重点部位导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'post', params)
      }
      
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
