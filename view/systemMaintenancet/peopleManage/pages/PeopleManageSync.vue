<template>
  <div class="people-manage-import-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>人员{{currentTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <!-- <el-button size="small" v-if="isBtn('全部同步')" @click="allSync">全部同步</el-button> -->
          <el-button size="small" v-if="isBtn('同步')" @click="sync" :disabled="storeArr.length === 0">同步</el-button>
          <el-button size="small" @click="look" icon="el-icon-view" :disabled="storeArr.length !== 1">查看</el-button>
          <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
          <el-button size="small" @click="print" icon="el-icon-printer">打印</el-button>
        </div>
        <div class="action-type">
          <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
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
            highlight-current-row
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentItem"
            @cell-dblclick="dblclick"
            ref="Table"
            height="100%"
            style="width: 100%;height: 100%;"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column label="员工照片" type="picture" width="120" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.picture" height="36" />
              </template>
            </el-table-column>
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
            :page-sizes="[25,50,100,200]"
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
import { mapState, mapGetters, mapActions } from 'vuex'
import { download } from '@src/common/download.js'

export default {
  name: 'PeopleManageSync',
  data() {
    return {
      columns: [
        // { prop: 'picture', label: '照片', width: '150' },
        { prop: 'name', sortable: true, label: '姓名', width: '100' },
        { prop: 'pinyin', sortable: true, label: '用户姓名拼音全称', width: '200' },
        { prop: 'userName', sortable: true, label: '员工识别登录名', width: '200' },
        { prop: 'uid', sortable: true, label: '员工编号', width: '120' },
        { prop: 'sex', sortable: true, label: '性别', width: '100' },
        { prop: 'birthday', sortable: true, label: '出生日期', width: '120' },
        { prop: 'degree', sortable: true, label: '学位', width: '100' },
        { prop: 'schooling', sortable: true, label: '学历', width: '100' },
        { prop: 'professional', sortable: true, label: '专业', width: '100' },
        { prop: 'school', sortable: true, label: '毕业院校', width: '120' },
        { prop: 'schoolType', sortable: true, label: '学校性质', width: '120' },
        { prop: 'learningType', sortable: true, label: '学习形式', width: '120' },
        { prop: 'graduationDate', sortable: true, label: '毕业日期', width: '120' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '200' },
        { prop: 'units', sortable: true, label: '工作单位', width: '200' },
        { prop: 'type', sortable: true, label: '用户类型', width: '200' },
        { prop: 'status', sortable: true, label: '用户状态', width: '200' },
        { prop: 'officePhone', sortable: true, label: '办公电话', width: '200' },
        { prop: 'mobilePhone', sortable: true, label: '移动电话', width: '200' },
        { prop: 'alternatePhone', sortable: true, label: '备用电话', width: '200' },
        { prop: 'email', sortable: true, label: '电子邮箱', width: '200' },
        // { prop: 'role', sortable: true, label: '角色', width: '100' },
        { prop: 'createdUserName', sortable: true, label: '录入人', width: '200' },
        { prop: 'createdOrgName', sortable: true, label: '录入机构', width: '200' },
        { prop: 'createdAt', sortable: true, label: '录入时间', width: '200' }
      ],
      resizable: true,
      showSubOrg: true,
      tableData: [],
      storeArr: [],
      total: 0,
      selectData: [],
      pageSize: 25,
      page: 1
    }
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
    ...mapState('peopleManage', ['currentView', 'currentTitle', 'orgId', 'orgName']),
    ...mapState({vstate: ({ peopleManage }) => peopleManage})
  },
  created() {
    if (this.orgId) {
      this.getTableList()
    }
  },
  methods: {
    ...mapActions('peopleManage', ['setState', 'getList', 'peopleAsync', 'exportManage']),
    // 请求表格数据方法
    getTableList(obj = { pageSize: 25, page: 1, sync: 0, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId }) {
      this.getList(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.total = data.page.totalNumber
          if (data.user.length > 0) {
            this.$messageSuccess('列表获取成功')
          } else {
            this.$notify({ type: 'info', message: '无数据', position: 'bottom-right', offset: 100 })
          }
          this.tableData = this.handleData(data.user)
        }
      })
    },
    // 同步请求
    asyncAsk(obj = {}) {
      this.peopleAsync(obj).then(res => {
        let { code, data } = res.data
        console.log(code, data)
        if (code === 0) {
          if (data.result === 1) {
            this.$message('同步成功')
            this.getTableList({ pageSize: this.pageSize, page: this.page, sync: 0, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId })
          } else if (data.result === 2) {
            return this.$message('同步失败')
          }
        }
      })
    },
    // 键值处理
    handleData(data) {
      let arr = this.$lodash.cloneDeep(data)
      arr.forEach(item => {
        if (item.sex === 1) {
          item.sex = '男'
        } else if (item.sex === 2) {
          item.sex = '女'
        } else if (item.sex === 3) {
          item.sex = '未知'
        }
        if (item.status === 1) {
          item.status = '冻结'
        } else if (item.status === 2) {
          item.status = '激活'
        }
        if (item.type === 1) {
          item.type = '用户一'
        } else if (item.type === 2) {
          item.type = '用户二'
        }
        if (!item.orgName) {
          item.orgName = this.orgName
        }
      })
      return arr
    },
    // 刷新表格
    refresh() {
      this.tableData = []
      let obj = { pageSize: this.pageSize, page: this.page, sync: 0, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId }
      this.getTableList(obj)
    },
    rowDbClick(row) {
      console.log(row)
    },
    paginationConfChange(obj) {},
    // 列表勾选
    handleSelectionChange(val) {
      this.storeArr = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      let obj = { pageSize: this.pageSize, page: val, sync: 0, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId }
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
    // 全部同步
    allSync() {
      this.asyncAsk({type: 1, ids: [this.orgId]})
    },
    // 同步
    sync() {
      if (this.storeArr.length <= 0) {
        return this.$message('请勾选同步项')
      } else {
        let ids = this.storeArr.map(item => {
          let { id, org, uid } = item
          return {userId: id, orgId: org, uid: uid}
        })
        this.asyncAsk({type: 2, ids: ids})
      }
    },
    // 查看
    look() {
      if (this.storeArr.length === 0) {
        return this.$message('请勾选查看项')
      } else if (this.storeArr.length > 1) {
        return this.$message('不可批量查看，请单选')
      } else {
        this.setState({ type: 'SET_STATE', key: 'detailData', value: this.storeArr })
        this.setState({ type: 'SET_STATE', key: 'fromView', value: this.currentView })
        this.setState({ type: 'SET_STATE', key: 'fromTitle', value: this.currentTitle })
        this.setState({ type: 'SET_STATE', key: 'currentView', value: 'PeopleManageDetail' })
        this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '查看' })
        let people = JSON.stringify(this.vstate)
        this.$router.push({path: '/systemMaintenancet/basicInfo/peopleManage', query: {people: this.$CryptoAES.encrypt(people)}})
      }
    },
    // 双击查看
    dblclick(val) {
      this.storeArr = [val]
      this.setState({ type: 'SET_STATE', key: 'detailData', value: val })
      this.setState({ type: 'SET_STATE', key: 'fromView', value: this.currentView })
      this.setState({ type: 'SET_STATE', key: 'fromTitle', value: this.currentTitle })
      this.setState({ type: 'SET_STATE', key: 'currentView', value: 'PeopleManageDetail' })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '查看' })
      let people = JSON.stringify(this.vstate)
      this.$router.push({path: '/systemMaintenancet/basicInfo/peopleManage', query: {people: this.$CryptoAES.encrypt(people)}})
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['姓名', '用户姓名拼音全称', '员工识别登录名', '员工编号', '性别', '出生日期', '学位', '学历', '专业', '毕业院校', '学校性质', '学习形式', '毕业日期', '所属机构', '工作单位', '用户类型', '用户状态', '办公电话', '移动电话', '备用电话', '电子邮箱', '录入人', '录入机构', '录入时间']
      const filterVal = ['name', 'pinyin', 'userName', 'uid', 'sex', 'birthday', 'degree', 'schooling', 'professional', 'school', 'schoolType', 'learningType', 'graduationDate', 'orgName', 'units', 'type', 'status', 'officePhone', 'mobilePhone', 'alternatePhone', 'email', 'createdUserName', 'createdOrgName', 'createdAt']
      let list = []
      if (this.storeArr && this.storeArr.length > 0) {
        list = this.storeArr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, `人员同步列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`)
      } else {
        let obj = {sync: 0, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId}
        this.exportEduce(obj)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async exportEduce(obj = {sync: 0, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId}) {
      await this.exportManage(obj).then(res => {
        // console.log(res)
        let {code, data} = res.data
        if (code === 0) {
          let fileName = data.fileName && data.fileName
          if (fileName) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/v1/operation/downFile?fileName=${fileName}`
            let name = `人员同步列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) })
          }
        } else {
          throw res.data.message
        }
      }).catch(err => {
        throw err
      })
    },
    // 打印
    print() {
      // 判断打印全部还是选中
      let list = []
      if (this.storeArr && this.storeArr.length > 0) {
        list = this.storeArr
      } else {
        list = this.tableData
      }
      let arr = this.$lodash.cloneDeep(this.columns)
      list.forEach(item => {
        arr.forEach(atm => {
          if (item[atm.prop]) {
            item[atm.prop] = item[atm.prop] === '' ? '   ' : item[atm.prop]
          } else {
            item[atm.prop] = '      '
          }
        })
      })
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'name', displayName: '姓名' },
          { field: 'pinyin', displayName: '用户姓名拼音全称' },
          { field: 'userName', displayName: '员工识别登录名' },
          { field: 'uid', displayName: '员工编号' },
          { field: 'sex', displayName: '性别' },
          { field: 'birthday', displayName: '出生日期' },
          { field: 'degree', displayName: '学位' },
          { field: 'schooling', displayName: '学历' },
          { field: 'professional', displayName: '专业' },
          { field: 'school', displayName: '毕业院校' },
          { field: 'schoolType', displayName: '学校性质' },
          { field: 'learningType', displayName: '学习形式' },
          { field: 'graduationDate', displayName: '毕业日期' },
          { field: 'orgName', displayName: '所属机构' },
          { field: 'units', displayName: '工作单位' },
          { field: 'type', displayName: '用户类型' },
          { field: 'status', displayName: '用户状态' },
          { field: 'officePhone', displayName: '办公电话' },
          { field: 'mobilePhone', displayName: '移动电话' },
          { field: 'alternatePhone', displayName: '备用电话' },
          { field: 'email', displayName: '电子邮箱' },
          { field: 'createdUserName', displayName: '录入人' },
          { field: 'createdOrgName', displayName: '录入机构' },
          { field: 'createdAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">人员管理同步</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
      })
    }
  },
  watch: {
    showSubOrg() {
      this.getTableList()
    },
    orgId() {
      this.getTableList()
    }
  }
}
</script>

<style lang="less" scoped>
.people-manage-import-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding: 5px 0px 5px 10px;
    .top {
      width: 100%;
      height: 110px;
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
      height: calc(~'100% - 110px');
      .main-title {
        margin: 20px 10px;
      }
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
          color: #2d72d3!important;cursor: pointer;background: rgba(255, 236, 236, 0.1);
        }
      }
    }
  }
}
</style>
