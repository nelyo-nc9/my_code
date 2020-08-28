<template>
  <div class="org-manage-await-upload-box">
    <!-- 机构管理-机构维护-待上传机构列表 -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <span>机构名称：</span>
          <el-input v-model="name" class="button-box-input" size="small"></el-input>
          <el-button size="small" style="width: 80px; margin-left: 10px" @click="getTableList">查询</el-button>
          <el-button size="small" :disabled="!tableData.length" @click="allUpload" v-if="isBtn('全部上传')">全部上传</el-button>
          <el-button size="small" :disabled="disabledUpload" @click="clickUpload" v-if="isBtn('上传')">上传</el-button>
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
            @row-dblclick="rowDbClick"
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
      </div>
      <div class="footer">
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
</template>

<script>
import { getUploadListApi, orgUploadApi } from '@src/http/basicInfoManage/orgManage.api'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'AwaitUpload',
  data() {
    return {
      resizable: true,
      columns: [
        { prop: 'uploadStatus', sortable: true, label: '状态', width: '100' },
        { prop: 'name', sortable: true, label: '机构名称', width: '120' },
        { prop: 'serial', sortable: true, label: '机构编号', width: '100' },
        { prop: 'kindName', sortable: true, label: '机构类别', width: '100' },
        { prop: 'telephone', sortable: true, label: '固定电话', width: '120' },
        { prop: 'functionary', sortable: true, label: '机构负责人', width: '120' },
        { prop: 'mobile', sortable: true, label: '移动电话', width: '100' },
        { prop: 'email', sortable: true, label: '电子邮件', width: '100' },
        { prop: 'address', sortable: true, label: '机构地址', width: '100' },
        { prop: 'status', sortable: true, label: '机构状态', width: '100' },
        { prop: 'businessHours', sortable: true, label: '开始营业时间', width: '150' },
        { prop: 'startBusiness', sortable: true, label: '开业日期', width: '150' },
        { prop: 'closeBusiness', sortable: true, label: '关闭日期', width: '150' },
        { prop: 'pid.name', sortable: true, label: '上级机构名称', width: '120' },
        { prop: 'pid.serial', sortable: true, label: '上级机构编号', width: '120' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
        { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
      ],
      tableData: [],
      selectData: [],
      disabledUpload: true,
      total: 0,
      page: 1,
      limit: 100,
      name: '' // 机构名称
    }
  },
  watch: {
    selectData() {
      if (this.selectData.length) {
        this.disabledUpload = false
      } else {
        this.disabledUpload = true
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
    allUpload() {
      this.$refs.uploadTable.toggleAllSelection()
      setTimeout(() => {
        this.clickUpload()
      }, 100)
    },
    clickUpload() { // 上传
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
      orgUploadApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          console.log('上传成功')
          this.$messageSuccess('上传成功！', '成功')
          this.getTableList()
        } else {
          console.log(res, '上传失败')
          this.$messageError(`上传失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError('上传失败，请稍后重试！', '错误')
      })
    },
    sizeChange() { // 每页条数改变
      this.getTableList()
    },
    currentChange() { // 当前页改变
      this.getTableList()
    },
    getTableList(type) { // 请求表格数据方法
      let param = {
        page: this.page,
        limit: this.limit,
        name: this.name
      }
      console.log(param, 'param')
      getUploadListApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          this.tableData = res.data.data.orgList
          this.total = res.data.data.count
          let statusArr = ['', '正常营业', '撤销', '合并', '临时停业']
          let kindArr = ['', '总行', '一级分行', '二级分行', '直管行', '县级行', '园区']
          this.tableData.forEach(item => {
            item.status = statusArr[item.status]
            item.kindName = kindArr[item.kind] || ''
            item.uploadStatus = '未上传'
          })
          if(type==1){
              this.$message.success('刷新列表成功')
          }
        } else {
          console.log(res.message, 'err')
        }
      }).catch(err => {
        console.log(err, 'err')
      })
    },
    // 刷新表格
    refresh() {
      this.getTableList(1);
    },
    selectionChange(items) { // 当表单勾选项发生变化时
      console.log(items, 'items')
      this.selectData = items
    },
    rowDbClick(row) {
    }
  }
}
</script>

<style lang="less" scoped>
  .org-manage-await-upload-box {
    width: 100%;
    height: 100%;
    .content {
      height: 100%;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      .top {
        display: flex;
        flex-direction: column;
        .header {
          margin-bottom: 10px;
          .button-box-input {
            width: 250px;
          }
          .header-center {
            display: inline-block;
            margin-left: 20px;
            span {
              cursor: pointer;
            }
          }
        }
      }
      .main {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 200px;
        .list-box-table {
          overflow: auto;
          flex: 1;
        }
      }
      .footer{
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
</style>
