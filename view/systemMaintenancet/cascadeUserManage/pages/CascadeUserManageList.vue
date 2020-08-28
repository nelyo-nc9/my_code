<template>
  <div class="cascadeUser-manage-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>级联用户管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <!-- <el-button size="small" @click="open">强制下线</el-button> -->
          <el-button size="small" @click="look">查看视频资源</el-button>
          <el-button size="small" @click="educe">导出</el-button>
          <el-button size="small" @click="print">打印</el-button>
          <el-button size="small" @click="refresh">刷新</el-button>
        </div>
        <el-dialog title="查看视频资源" :visible.sync="dialogFormVisible">
          <div style="width: 100%;height:530px;">
            <div style="width:100%;height:40px;"><el-button v-if="isBtn('断开视频')" size="small" @click="edit">断开视频</el-button></div>
            <div style=" width: 100%;height: 450px;overflow: auto;">
              <el-table
                stripe
                border
                size="medium"
                :data="tableData"
                highlight-current-row
                @selection-change="handleSelectionChange"
                @current-change="handleCurrentItem"
                ref="Table"
                height="100%"
                max-height="450"
                style="width: 100%"
              >
                <el-table-column type="selection" width="50" align="center"></el-table-column>
                <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                <el-table-column
                  v-for="(column, index) in columns"
                  :key="index"
                  :prop="column.prop"
                  :label="column.label"
                  :width="column.width"
                  :sortable="column.sortable"
                  show-overflow-tooltip
                  align="center"
                  :resizable="resizable"
                ></el-table-column>
              </el-table>
            </div>
            <div style=" width: 100%;height: 40px;display: flex;justify-content: flex-end;align-items: flex-end;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentPageNum"
                :page-sizes="[200,100,50,25]"
                :page-size="pageSize"
                :current-page="page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible = false" size="small">确 定</el-button>
            <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentItem"
            ref="Table"
            height="100%"
            max-height="700"
            style="width: 100%"
          >
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[10, 25,50,100]"
            :page-size="pageSize"
            :current-page="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'CascadeUserManageList',
  data() {
    return {
      status: '全部',
      resizable: false,
      columns: [
        { prop: 'name', sortable: true, label: '姓名', width: '150' },
        { prop: 'logUser', sortable: true, label: '登录用户', width: '200' },
        { prop: 'platform', sortable: true, label: '平台名称', width: '180' },
        { prop: 'org', sortable: true, label: '所属机构', width: '200' },
        { prop: 'ip', sortable: true, label: '用户IP', width: '200' },
        { prop: 'type', sortable: true, label: '登录类型', width: '200' },
        { prop: 'time', sortable: true, label: '登录时间', width: '200' },
        { prop: 'duration', sortable: true, label: '登录时长', width: '200' }
      ],
      tableData: [
        {
          roleName: 'roleName',
          roleType: 'roleType',
          addPermissionType: 'addPermissionType',
          description: 'description'
        },
        {
          roleName: 'roleName1',
          roleType: 'roleType1',
          addPermissionType: 'addPermissionType1',
          description: 'description1'
        },
        {
          roleName: 'roleName2',
          roleType: 'roleType2',
          addPermissionType: 'addPermissionType2',
          description: 'description2'
        }
      ],
      total: 0,
      currentOrgId: '',
      showSubOrg: false,
      paginationConfig: {},
      selectData: [],
      pageSize: 25,
      page: 1,
      currentFlag: false,
      arr: [],
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
    ...mapState({
      currentView: ({ cascadeUserManage }) => cascadeUserManage.currentView,
      currentTitle: ({ cascadeUserManage }) => cascadeUserManage.currentTitle
    })
  },
  created() {
    this.getTableList()
  },
  methods: {
    ...mapActions('cascadeUserManage', ['setState']),
    ...mapMutations('cascadeUserManage', ['SET_STATE']),
    getTableList(obj = { pageSize: 10, page: 1 }) {
      // 请求表格数据方法
    },
    // 刷新表格
    refresh() {
      let obj = { pageSize: this.pageSize, page: this.page }
      this.getTableList(obj)
    },
    // 新建
    create() {
      this.setState({ type: 'SET_STATE', key: 'detailData', value: [] })
      this.setState({ type: 'SET_STATE', key: 'fromView', value: this.currentView })
      this.setState({ type: 'SET_STATE', key: 'fromTitle', value: this.currentTitle })
      this.setState({ type: 'SET_STATE', key: 'currentView', value: 'RoleManageCreate' })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '新建' })
      this.setState({ type: 'SET_STATE', key: 'roleTitle', value: '新建' })
    },
    // 编辑
    edit() {
      if (this.arr.length === 0) {
        return this.$message('请勾选编辑项')
      } else if (this.arr.length > 1) {
        return this.$message('不可批量编辑，请单选')
      } else {
        this.setState({ type: 'SET_STATE', key: 'detailData', value: this.arr })
        this.setState({ type: 'SET_STATE', key: 'fromView', value: this.currentView })
        this.setState({ type: 'SET_STATE', key: 'fromTitle', value: this.currentTitle })
        this.setState({ type: 'SET_STATE', key: 'currentView', value: 'RoleManageCreate' })
        this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '新建' })
        this.setState({ type: 'SET_STATE', key: 'roleTitle', value: '编辑' })
      }
    },
    // 查看视频资源
    look() {
      this.dialogFormVisible = true
      // console.log('111', this.arr)
      // if (this.arr.length <= 0) {
      //   return this.$message('请勾选删除项')
      // } else {
      //   let permissionId = this.arr.map(item => {
      //     let { id } = item
      //     return id
      //   })
      //   console.log(permissionId)
      // }
      // return this.$message('删除')
    },
    // 导出
    educe() {
      return this.$message('导出')
    },
    // 打印
    print() {
      return this.$message('打印')
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.arr = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      let obj = { pageSize: this.pageSize, page: val }
      this.clearSelectData()
      this.getTableList(obj)
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.clearSelectData()
      this.handleCurrentPageNum(1)
    },
    // 列表当前项
    handleCurrentItem(val) {
      this.selectData = [val]
      console.log(val, this.selectData, '列表当前项')
    },
    // 清空列表当前项
    clearSelectData() {
      this.selectData = []
    },
    open() {
      this.$prompt('', '请输入强制下线原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          console.log(value)
          this.$message({
            type: 'success',
            message: '下线成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消下线'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.cascadeUser-manage-list-box {
   width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .top {
      width: 100%;
      height: 70px;
      padding-bottom: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .header {
        margin-bottom: 10px;
        color: #333333;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2D72D3;
            }
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 80px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: calc(~'100% - 40px');
        /deep/ .cell{
          height: 40px;
          vertical-align:middle;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        /deep/ .el-pager li.active {
          color: #2D72D3!important;cursor: pointer;background: rgba(255, 236, 236, 0.1);
        }
      }
    }
  }
}
</style>
