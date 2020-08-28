<template>
  <div id="add">
    <div class="addButtons">
      <el-button size="mini">新增</el-button>
      <el-button size="mini">修改</el-button>
      <el-button size="mini">删除</el-button>
      <el-button size="mini">迁移</el-button>
      <el-button size="mini">查看</el-button>
      <el-button size="mini">排序</el-button>
      <el-button size="mini">导入</el-button>
      <el-button size="mini">导出</el-button>
      <el-button size="mini">打印</el-button>
    </div>

    <div class="resh">
      <el-checkbox @change="isShowChild" v-model="checked">显示子机构</el-checkbox>
      <span style="margin-left:10px">
        <i class="el-icon-refresh icons" style="font-size:14px"></i>
        <span>刷新列表</span>
      </span>
    </div>
    <div class="tables">
      <el-table
        :stripe="true"
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @select="headerOdd"
        @select-all="headerAll"
      >
        >
        <el-table-column prop="date" fixed label="序号" width="80" type="selection"></el-table-column>
        <el-table-column prop="date" label="所属子系统" width="180"></el-table-column>
        <el-table-column prop="name" label="所属机构" width="180"></el-table-column>
        <el-table-column prop="address" width="180" label="所属重点部位"></el-table-column>
        <el-table-column prop="address" label="门禁平台名称"></el-table-column>
        <el-table-column prop="address" label="品牌"></el-table-column>
        <el-table-column prop="address" label="型号"></el-table-column>
        <el-table-column prop="address" label="IP地址"></el-table-column>
        <el-table-column prop="address" label="端口"></el-table-column>
        <el-table-column prop="address" label="用户名"></el-table-column>
        <el-table-column prop="address" label="密码"></el-table-column>
        <el-table-column prop="address" label="在线状态"></el-table-column>
        <el-table-column prop="address" label="录入人"></el-table-column>
        <el-table-column prop="address" label="录入机构"></el-table-column>
        <el-table-column prop="address" label="录入时间"></el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      checked: false,
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    //选择某一行
    headerOdd() {},
    //全选
    headerAll() {},
    //table class
    tableRowClassName({ row, rowIndex }) {
      console.log(row, rowIndex)
      if (rowIndex % 2 == 1) {
        return 'warning-row'
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    //数据刷新
    resh() {},
    //是否显示子机构
    isShowChild() {
      alert('xx')
    }
  },
  watch: {
    checked(val) {
      //   console.log(val)
    }
  }
}
</script>

<style lang="less" scope>
#add {
  .addButtons {
  }
  .resh {
    padding-top: 15px;
    padding-bottom: 10px;
    .icons {
      margin-right: -2px;
    }
  }
  .tables {
    margin: 10px 0;
    .block {
      text-align: center;
      margin: 20px 0;
      margin-left: -190px;
    }
  }
}
</style>
