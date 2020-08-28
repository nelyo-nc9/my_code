<template>
  <div class="main">
    <div style="margin:20px 0;">
      <el-button style="font-size:12px;" plain @click="handleDelete()"><i class="el-icon-delete"></i>删除</el-button>
      <el-button style="font-size:12px;" plain @click="exportFile('危险品核查记录列表')"
        ><i class="icon iconfont-ccb ccbdaoru el-icon-"></i>导出</el-button
      >
      <el-button style="font-size:12px;" plain @click="Toprint('危险品核查记录')"
        ><i class="el-icon-printer"></i>打印</el-button
      >
    </div>
    <div style="min-height:400px;">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="400"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @selection-change="handleSelectionChange"
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
          label="单号"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="是否危险品"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="核查时间"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="核查备注信息"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="核查人"
          min-width="70"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="附件" min-width="70">
          <img :src="tableData.address" alt="附件" />
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
  </div>
</template>

<script>
export default {
  name: 'DangerousList',
  props: {
    listType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      total: 0, // 数据总条数
      pageSize: 10, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      isfirstPage: true,
      islastPage: true,
      lastPageNum: Math.ceil(this.listTotal / this.pageSize),
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
    // 选中数据
    handleSelectionChange(val) {
      this.selectData = val
    },
    // 列表删除
    handleDelete() {
      console.log(this.selectData)
      if (!this.selectData) {
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
          this.selectData.map(child => {
            console.log(child.index)
            this.tableData.map((parent, parentindex) => {
              if (parent.index === child.index) {
                this.tableData.splice(parentindex, 1)
              }
            })
          })
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
          { field: 'address', displayName: '单号' },
          { field: 'address', displayName: '是否危险品' },
          { field: 'address', displayName: '核查时间' },
          { field: 'address', displayName: '核查备注信息' },
          { field: 'address', displayName: '核查人' },
          { field: 'address', displayName: '附件' }
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
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '单号',
        '是否危险品',
        '核查时间',
        '核查备注信息',
        '核查人',
        '附件'
      ]
      // 字段名
      const filterVal = ['index', 'date', 'name', 'address', 'address', 'address', 'address', 'address', 'address']
      let list = []
      // 导出全部或导出选中
      if (this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, title)
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style lang="less" scoped>
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
</style>
