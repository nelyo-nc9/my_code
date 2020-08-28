<template>
  <div id="viewRealted">
    <div class="meus">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>外委公司管理</el-breadcrumb-item>
        <el-breadcrumb-item>外围公司管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="btns">
      <el-button size="mini">导出</el-button>
      <el-button size="mini">打印</el-button>
    </div>
    <!-- 表格 -->
    <div class="list-box-table">
      <el-table
        stripe
        border
        size="medium"
        :data="tableData"
        @select="select"
        height="100%"
        max-height="770"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-link :underline="false">查看</el-link>
              <el-link :underline="false">编辑</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      tableData: [{}, {}],
      columns: [
        { prop: 'name', sortable: false, label: '公司名称', width: '' },
        { prop: 'keyPart', sortable: true, label: '合同有效期', width: '' },
        { prop: 'name', sortable: true, label: '合同业务范围', width: '' },
        { prop: 'brand', sortable: true, label: '公司电话', width: '' },
        { prop: 'model', sortable: true, label: '公司员工', width: '' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
#viewRealted {
  height: 100%;
  .btns {
    margin: 10px;
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
