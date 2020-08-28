<template>
  <div class="org-manage-revoke-box">
    <!-- 机构管理-机构维护-撤销机构列表 -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <span>机构名称：</span>
          <el-input v-model="name" class="button-box-input" size="small"></el-input>
          <el-button size="small" style="width: 80px; margin-left: 10px" @click="getTableList">查询</el-button>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" :disabled="disabledData" @click="setSyncData" v-if="isBtn('已处理业务数据')">已处理业务数据</el-button>
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
import { getStateListApi, orgSyncApi } from '@src/http/basicInfoManage/orgManage.api'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'SyncRevoke',
  data() {
    return {
      resizable: true,
      columns: [
        { prop: 'updatedAt', sortable: true, label: '撤销时间', width: '150' },
        { prop: 'name', sortable: true, label: '机构名称', width: '150' },
        { prop: 'serial', sortable: true, label: '机构编号', width: '100' },
        { prop: 'kindName', sortable: true, label: '机构类别', width: '100' },
        { prop: 'telephone', sortable: true, label: '固定电话', width: '120' },
        { prop: 'functionary', sortable: true, label: '机构负责人', width: '120' },
        { prop: 'mobile', sortable: true, label: '移动电话', width: '100' },
        { prop: 'email', sortable: true, label: '电子邮件', width: '100' },
        { prop: 'address', sortable: true, label: '机构地址', width: '100' },
        { prop: 'syncSignName', sortable: true, label: '机构状态', width: '100' },
        { prop: 'businessHours', sortable: true, label: '开始营业时间', width: '150' },
        { prop: 'startBusiness', sortable: true, label: '开业日期', width: '150' },
        { prop: 'closeBusiness', sortable: true, label: '关闭日期', width: '150' },
        { prop: 'pid.name', sortable: true, label: '上级机构名称', width: '120' },
        { prop: 'parentId', sortable: true, label: '上级机构编号', width: '120' },
        { prop: 'pid.id', sortable: true, label: '本部机构标志', width: '120' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
        { prop: 'createdAt', sortable: true, label: '录入时间', width: '150' }
      ],
      tableData: [],
      selectData: [],
      disabledData: true, // 已处理业务数据按钮是否禁用
      total: 0,
      page: 1,
      limit: 100,
      name: '' // 机构名称
    }
  },
  watch: {
    selectData() {
      if (this.selectData.length) {
        this.disabledData = false
      } else {
        this.disabledData = true
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
      let param = {
        page: this.page,
        limit: this.limit,
        name: this.name,
        type: 2 // 1-新增机构，2-撤销机构，3-合并机构，4-迁移机构
      }
      console.log(param, 'param')
      getStateListApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          this.tableData = res.data.data.orgList
          this.total = res.data.data.count
          // let statusArr = ['', '正常营业', '撤销', '合并', '临时停业']
          let kindArr = ['', '总行', '一级分行', '二级分行', '直管行', '县级行', '园区']
          let syncSignArr = ['已同步', '已取消同步', '', '已撤销', '已合并', '已迁移']
          this.tableData.forEach(item => {
            // item.status = statusArr[item.status]
            item.kindName = kindArr[item.kind] || ''
            item.syncSignName = syncSignArr[item.syncSign] || ''
          })
        } else {
          console.log(res.message, 'err')
        }
      }).catch(err => {
        console.log(err, 'err')
      })
    },
    rowDbClick(row) {
    },
    selectionChange(items) { // 当表单勾选项发生变化时
      console.log(items, 'items')
      this.selectData = items
    },
    setSyncData(val) { // 调用机构同步接口
      if (this.selectData.length === 0) {
        return
      }
      let idArr = []
      this.selectData.forEach(item => {
        idArr.push(item.serial)
      })
      let param = {
        oids: idArr,
        type: 3
      }
      let sName = '撤销机构'
      orgSyncApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess(`${sName}成功！`, '成功')
          this.getTableList()
        } else {
          console.log(res, `${sName}失败`)
          this.$messageError(`${sName}失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError(`${sName}失败，请稍后重试！`, '错误')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .org-manage-revoke-box {
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
        .button-box {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
          .el-button {
            width: 130px;
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
