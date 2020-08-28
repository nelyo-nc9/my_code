<template>
  <div class="key-part-await-transfer-box">
    <!-- 重点部位-待迁移部位列表 -->
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
          <el-button size="small" :disabled="!hasSelectData" @click="clickTransfer" v-if="isBtn('迁移')">迁移</el-button>
          <el-button size="small" :disabled="!hasSelectData" @click="deleteKeyPart" v-if="isBtn('删除')">删除</el-button>
          <el-button size="small" :disabled="!tableData.length" @click="clickExport">导出</el-button>
          <el-button size="small" :disabled="!hasSelectData" @click="clickPrint">打印</el-button>
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
import { getMoveListApi, deleteKeyPartApi } from '@src/http/basicInfoManage/keyPart.api'
import { download } from '@src/common/download.js'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'AwaitTransferPart',
  props: {
    componentTitle: {
      type: String,
      default: ''
    },
    nodeData: { // 所属机构信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      resizable: true,
      tableData: [],
      total: 0,
      showSubOrg: true,
      selectData: [], // 表单勾选项
      hasSelectData: false, // 删除按钮是否禁用
      page: 1,
      limit: 100,
      columns: [
        { prop: 'name', sortable: true, label: '部位名称', width: '' },
        { prop: 'oidName', sortable: true, label: '所属机构', width: '' },
        { prop: 'address', sortable: true, label: '部位地址', width: '' }
      ]
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
    }
  },
  created() {
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
      this.selectData = []
      let param = {
        ccbLnsId: this.nodeData.serial,
        isRecursion: this.showSubOrg ? 1 : 0,
        page: this.page,
        limit: this.limit
      }
      getMoveListApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          this.tableData = res.data.data.keyPartList.map(item => {
            item.oidName = item.oid.name
            return item
          })
          this.total = res.data.data.count
        } else {
          console.log(res.message, 'err')
          this.tableData = []
          this.$messageError('待迁移部位获取失败，请稍后重试！', '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.tableData = []
        this.$messageError('待迁移部位获取失败，请稍后重试！', '错误')
      })
    },
    // 刷新表格
    refresh() {
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
        header: `<p class="custom">${this.componentTitle}列表</p>`,
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
      })
    },
    selectionChange(items) { // 当表单勾选项发生变化时
      console.log(items, 'items')
      this.selectData = items
    },
    rowDbClick(row) {
    },
    clickTransfer() {
      if (this.selectData.length === 0) {
        this.$messageWarn('请选择一条数据！')
        return
      }
      let param = {
        selectData: this.selectData
      }
      this.$emit('changeComponent', 'BatchTransferDialog', this.componentTitle, param)
    },
    deleteKeyPart() {
      if (this.selectData.length === 0) {
        return
      }
      let idArr = []
      this.selectData.forEach(item => {
        idArr.push(item.keyPart.id)
      })
      let param = {
        ids: idArr
      }
      deleteKeyPartApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          console.log('删除成功')
          this.$messageSuccess('待迁移部位删除成功！', '成功')
          this.getTableList()
        } else {
          console.log(res, '待迁移部位删除失败')
          this.$messageError(`待迁移部位删除失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError('待迁移部位删除失败，请稍后重试！', '错误')
      })
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    clickExport() {
      let params = {
        type: 4,
        listCondition: {
          ccbLnsId: this.nodeData.serial,
          isRecursion: this.showSubOrg ? 1 : 0
        }
      }
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/organizational/v1/key-part/export`
      let name = `待迁移部位导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
      download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'post', params)
    }
  }
}
</script>

<style lang="less" scoped>
  .key-part-await-transfer-box {
    width: 100%;
    height: 100%;
    display: flex;
    .content {
      width: 100%;
      padding-left: 10px;
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
        height: calc(~'100% - 75px');
        .list-box-table {
          width: 100%;
          overflow: auto;
          height: calc(~'100% - 33px');
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
