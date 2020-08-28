<template>
  <div class="main">
    <div style="margin:20px 0;">
      <el-button
        style="font-size:12px;"
        plain
        @click="clickCreate(['申请列表', '新建'], '携物申请单')"
        v-if="listType === '申请'"
        ><i class="el-icon-plus"></i>新建</el-button
      >
      <el-button
        style="font-size:12px;"
        plain
        @click="handleDelete()"
        v-if="listType === '已审批' || listType === '核查'"
        ><i class="el-icon-delete"></i>删除</el-button
      >
      <el-button style="font-size:12px;" plain @click="exportFile(listType)"
        ><i class="icon iconfont-ccb ccbdaoru el-icon-"></i>导出</el-button
      >
      <el-button style="font-size:12px;" plain @click="Toprint(listType)"
        ><i class="el-icon-printer"></i>打印</el-button
      >
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width:100%"
        height="400"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column
          prop="date"
          label="所属机构"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="name"
          label="所属重点部位"
          min-width="90"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="申请编号"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="申请部门"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="申请人"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="联系电话"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="申请事由"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="人员姓名"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="录入人"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="审批状态"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" min-width="150" v-if="!islistType">
          <template slot-scope="scope">
            <el-button
              size="samll"
              type="text"
              @click.native.prevent="handleEdit(scope.$index, tableData)"
              style="font-size:12px;margin-left:0;"
              >编辑</el-button
            >
            <el-button
              size="samll"
              type="text"
              @click="handleDelete(scope.$index, tableData)"
              style="font-size:12px;margin-left:0;"
              >删除</el-button
            >
            <el-button
              size="samll"
              type="text"
              @click="handleView(scope.$index, tableData)"
              style="font-size:12px;margin-left:0;"
              >查看</el-button
            >
            <el-button
              size="samll"
              type="text"
              @click="handleWithdraw(scope.$index, tableData)"
              style="font-size:12px;margin-left:0;"
              >撤回</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" v-else>
          <template slot-scope="scope">
            <el-button
              size="samll"
              type="text"
              v-if="listType === '待审批'"
              @click.native.prevent="waitApproval(scope.$index, tableData)"
              style="font-size:12px;margin-left:0;"
              >审批</el-button
            >
            <el-button
              size="samll"
              type="text"
              v-if="listType === '已审批' || listType === '核查'"
              @click="hadApproval(scope.$index, tableData)"
              style="font-size:12px;margin-left:0;"
              >查看</el-button
            >
            <el-button
              size="samll"
              type="text"
              v-if="listType === '核查'"
              @click="clikInspect(scope.$index, tableData, '核查任务')"
              style="font-size:12px;margin-left:0;"
              >生成任务</el-button
            >
            <el-button
              size="samll"
              type="text"
              v-if="listType === '核查'"
              @click="clikInspect(scope.$index, tableData, '核查任务详情')"
              style="font-size:12px;margin-left:0;"
              >任务详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="text-align:right;margin:30px 30px 30px 0;">
      <el-pagination
        style="text-align:right;display:inline-block;"
        :page-sizes="[10, 25, 50, 100, 200]"
        :page-size="pageSize"
        :current-page="pageCurrents"
        layout="total, sizes,slot, prev"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="pageSizeCurrent"
      >
        <el-button type="text" @click="pagePrev">首页</el-button>
      </el-pagination>
      <el-pagination
        style="text-align:right;display:inline-block;"
        :page-sizes="[10, 25, 50, 100, 200]"
        :page-size="pageSize"
        :page-count="1"
        :total="total"
        :current-page="pageCurrents"
        @size-change="pageSizeChange"
        @current-change="pageSizeCurrent"
        layout="slot"
      >
        <span>{{ pageCurrents }}/{{ pageCounts }}</span>
      </el-pagination>
      <el-pagination
        style="text-align:right;display:inline-block;"
        :page-sizes="[10, 25, 50, 100, 200]"
        :page-size="pageSize"
        :current-page="pageCurrents"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="pageSizeCurrent"
        layout="next,slot, jumper"
        ><el-button type="text" @click="pageNext">末页</el-button></el-pagination
      >
    </div>

    <el-dialog :title="inspectTitle" :visible.sync="inspect" width="30%" center>
      <el-form :model="formInspect">
        <el-form-item label="接收人">
          <el-input v-model="formInspect.name" autocomplete="off" :disabled="inspectStatus"></el-input>
        </el-form-item>
        <el-form-item label="核查时间">
          <el-input v-model="formInspect.time" autocomplete="off" :disabled="inspectStatus"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="!inspectStatus">
        <el-button @click="inspect = false">取 消</el-button>
        <el-button type="primary" @click="inspect = false">发 送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Applylist',
  props: {
    listType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inspect: false, // 生成任务
      total: 0, // 数据总条数
      pageSize: 10, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      inspectStatus: false, // 核查任务状态
      inspectTitle: '核查任务', // 核查任务表头
      isfirstPage: false,
      islastPage: false,
      formInspect: {
        name: 'name',
        time: 'time'
      },
      islistType: false, // 申请页面false 审批页面true
      item: [{ index: 'ApplyList', label: '申请列表' }],
      tableData: [
        // 列表数据
        {
          index: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          index: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          index: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          index: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      selectData: '' // 列表选中数据
    }
  },
  created() {
    this.islistType = this.listType === '待审批' || this.listType === '已审批' || this.listType === '核查'

    this.pageCount = Math.ceil(this.total / this.pageSize)
    this.total = this.tableData.length
  },
  computed: {
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      console.log(this.pageCurrent)
      return this.pageCurrent
    }
  },
  methods: {
    formatter(row, column) {
      return row.address
    },
    sortChange(val) {
      console.log(val)
    },
    // 选中数据
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleEdit(index, row) {
      // 列表编辑
      console.log(index, row)
      this.clickCreate(['申请列表', '列表', '携物申请单编辑'], '携物申请单编辑')
    },
    handleDelete(index, row) {
      // 列表删除
      console.log(index, row, this.selectData)
      if (index === undefined && this.selectData.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择数据!',
          duration: 1000
        })
        return false
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (row) {
            row.splice(index, 1)
          } else {
            this.selectData.map(child => {
              console.log(child.index)
              this.tableData.map((parent, parentindex) => {
                if (parent.index === child.index) {
                  this.tableData.splice(parentindex, 1)
                }
              })
            })
          }
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 1500
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleView() {
      // 申请列表查看
      this.clickCreate(['申请列表', '列表', '查看'], '携物申请单详情')
    },
    waitApproval() {
      // 列表审批
      this.clickCreate(['待审批列表', '列表', '待审批'], '携物报备申请单审批')
    },
    hadApproval() {
      // 已审批列表查看
      this.clickCreate(['已审批列表', '列表', '已审批'], '携物申请审批记录单')
    },
    // 列表撤回
    handleWithdraw(index, row) {
      this.$confirm('是否撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          row.splice(index, 1)
          this.$message({
            type: 'success',
            message: '撤回成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤回'
          })
        })
    },
    // 生成任务
    clikInspect(index, row, title) {
      this.inspectStatus = title === '核查任务详情'
      this.inspectTitle = title
      this.inspect = true
    },
    // 跳转页面
    clickCreate(arr, listTitle) {
      this.$emit('changeComponent', 'AddApply', arr, listTitle)
    },
    // 改变pageSize
    pageSizeChange(val) {
      console.log(val)
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
      console.log(this.pageCurrent)
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCount
    },
    // 打印方法
    Toprint(title) {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'index', displayName: '序号' },
          { field: 'name', displayName: '所属机构' },
          { field: 'date', displayName: '所属重点部位' },
          { field: 'address', displayName: '申请编号' },
          { field: 'address', displayName: '申请部门' },
          { field: 'address', displayName: '申请人' },
          { field: 'address', displayName: '联系电话' },
          { field: 'address', displayName: '申请事由' },
          { field: 'address', displayName: '人员姓名' },
          { field: 'address', displayName: '录入人' },
          { field: 'address', displayName: '审批状态' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">' + title + '列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 导出
    exportFile(title) {
      let listName = ''
      if (title === '申请') {
        listName = '携物管理申请列表'
      } else {
        listName = title === '待审批' ? '待审批列表' : '已审批列表'
      }
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '申请编号',
        '申请部门',
        '申请人',
        '联系电话',
        '申请事由',
        '人员姓名',
        '录入人',
        '审批状态'
      ]
      // 字段名
      const filterVal = [
        'index',
        'date',
        'name',
        'address',
        'address',
        'address',
        'address',
        'address',
        'address',
        'address',
        'address'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, listName)
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  .number {
    display: inline-block;
    min-width: 20px;
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
</style>
