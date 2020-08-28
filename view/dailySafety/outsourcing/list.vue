<template>
  <div id="viewRealted">
    <div v-if="!isTitle">
      <div class="meus">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>外委公司管理</el-breadcrumb-item>
          <el-breadcrumb-item>外围公司管理</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="btns">
        <el-button size="mini" @click="exportFile">
          <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>
          导出
        </el-button>
        <el-button size="mini" @click="Toprint">
          <i class="el-icon-printer"></i>
          打印
        </el-button>
      </div>
      <!-- 表格 -->
      <div class="list-box-table">
        <el-table stripe border size="medium" :data="tableData" @select="selectData" height="100%" max-height="770" style="width: 100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="samll" type="text" @click.native.prevent="handleEdit(scope.$index, tableData)" style="font-size:12px;margin-left:0;">编辑</el-button>
              <el-button size="samll" type="text" @click="handleView(scope.$index, tableData)" style="font-size:12px;margin-left:0;">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <TitleCon v-if="isTitle"  :isStatu="isStatu"></TitleCon>
  </div>
</template>
<script>
import TitleCon from './components/TitleCon'
export default {
  components: {
    TitleCon
  },
  name: '',
  data() {
    return {
      isStatu:null,
      // 表单显示
      isTitle: false,
      tableData: [
        {
          name: '一个公司',
          time: '2022',
          fanwei: '范围',
          phone: '110120119',
          peopleName: '张三，李四，王五',
        },
        {
          name: '一个公司',
          time: '2022',
          fanwei: '很大',
          phone: '110120119',
          peopleName: '张三，李四，王五',
        },
      ],
      columns: [
        { prop: 'name', sortable: false, label: '公司名称', width: 'auto' },
        { prop: 'time', sortable: true, label: '合同有效期', width: 'auto' },
        { prop: 'fanwei', sortable: true, label: '合同业务范围', width: 'auto' },
        { prop: 'phone', sortable: true, label: '公司电话', width: 'auto' },
        { prop: 'peopleName', sortable: true, label: '公司员工', width: '' }
      ]
    }
  },
  methods: {
    selectData() {
      console.log('勾选事件');
    },
    handleEdit(index, row) {
      this.isStatu =false
      this.isTitle = !this.isTitle
      // 列表编辑
      // console.log(index, row)
      // this.clickCreate(['申请列表', '列表', '携物申请单编辑'], '携物申请单编辑')
    },
    handleView(index, row) {
      this.isStatu =true
      this.isTitle = !this.isTitle
      
      // 申请列表查看
      // this.clickCreate(['申请列表', '列表', '查看'], '携物申请单详情')
    },
    // 导出方法
    exportFile(title) {
      const { export_json_to_excel } = require('@src/common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '公司名称',
        '合同有效期',
        '合同业务范围',
        '公司电话',
        '公司员工'
      ]
      // 字段名
      const filterVal = [
        'name',
        'time',
        'fanwei',
        'phone',
        'peopleName'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.tableData.length > 0) {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '管理列表')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // eslint-disable-next-line no-undef
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'name', displayName: '公司名称' },
          { field: 'time', displayName: '合同有效期' },
          { field: 'fanwei', displayName: '合同业务范围' },
          { field: 'phone', displayName: '公司电话' },
          { field: 'peopleName', displayName: '公司员工' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">已审批列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    }
  }
}
</script>

<style lang="less" scoped>
#viewRealted {
  padding: 15px;
  height: 100%;
  .btns {
    margin: 10px 0 10px 0;
  }
  .tableView {
    display: flex;
    margin: 10px;
    height: 260px;
    .tableList {
      width: 473px;
      padding: 5px;
      border: 1px solid #e6e6e6;
      height: 108px;
      ul {
        // padding: 4px;
        border: 1px solid #e6e6e6;

        li {
          text-align: center;
          display: flex;
          line-height: 31px;
          border-bottom: 1px solid #e6e6e6;
          &:nth-child(1) {
            border-bottom: 1px solid #e6e6e6;
          }
          &:last-child {
            border: none;
          }
          i {
            width: 40%;
            height: 30px;
            background: #e6e6e6;
          }
          span {
            text-indent: 5px;
          }
        }
      }
    }
  }
  .box-big {
    display: flex;
    height: 500px;
    flex-direction: column;
    overflow: auto;
  }
  .box-title {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #606266;
    margin-top: 20px;
    i {
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translateY(-50%);
    }
    &::after {
      display: block;
      content: '';
      border-top: 1px solid #e1e1e1;
      width: calc(~'100% - 120px');
      margin-left: 120px;
      margin-top: -12px;
    }
  }
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 10px;
      font-size: 16px;
      height: 20px;
      line-height: 20px;
    }
  }
  .buttom-box {
    height: 200px;
    margin-left: 20px;
  }
  .TopologyView {
    width: 100%;
    margin-top: -48px;
  }
  .collItem {
    height: 400px;
    overflow: auto;
  }
}
</style>
