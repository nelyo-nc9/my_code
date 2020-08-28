<template>
  <div class="key-part-await-upload-box">
    <!-- 重点部位-待上传部位列表 -->
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
          <span>部位名称：</span>
          <el-input v-model="name" class="button-box-input" size="small"></el-input>
          <el-button size="small" style="width: 80px; margin-left: 10px" @click="getTableList">查询</el-button>
          <el-button size="small" :disabled="!tableData.length" @click="allUpload" v-if="isBtn('全部上传')">全部上传</el-button>
          <el-button size="small" :disabled="!hasSelectData" @click="clickUpload" v-if="isBtn('上传')">上传</el-button>
          <el-button size="small" @click="refresh">刷新</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table
            ref="uploadTable"
            stripe
            border
            size="medium"
            :data="tableData"
            @selection-change="selectionChange"
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
import { getUploadPartListApi, uploadingKeyPartApi } from '@src/http/basicInfoManage/keyPart.api'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'List',
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
      name: '',
      tableData: [],
      total: 0,
      selectData: [], // 表单勾选项
      hasSelectData: false, // // 是否有选择列表
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
        oid: this.nodeData.id,
        name: this.name,
        page: this.page,
        limit: this.limit
      }
      getUploadPartListApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          this.tableData = res.data.data.keyPartList.map(item => {
            item.name = item.keyPart.name
            item.oidName = item.parent.name
            item.address = item.keyPart.address
            return item
          })
          this.total = res.data.data.count
        } else {
          console.log(res.message, 'err')
          this.tableData = []
          this.$messageError('待上传部位获取失败，请稍后重试！', '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.tableData = []
        this.$messageError('待上传部位获取失败，请稍后重试！', '错误')
      })
    },
    // 刷新
    refresh() {
      this.getTableList()
    },
    selectionChange(items) { // 当表单勾选项发生变化时
      console.log(items, 'items')
      this.selectData = items
    },
    allUpload() {
      this.$refs.uploadTable.toggleAllSelection()
      setTimeout(() => {
        this.clickUpload()
      }, 100)
    },
    clickUpload() {
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
      uploadingKeyPartApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          console.log('上传成功')
          this.$messageSuccess('上传成功！', '成功')
          this.getTableList()
        } else {
          console.log(res, '上传失败')
          this.$messageError('上传失败，请稍后重试！', '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError('上传失败，请稍后重试！', '错误')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .key-part-await-upload-box {
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
          .button-box-input {
            width: 250px;
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
