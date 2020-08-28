<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
            <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
            <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="table-box">
        <div class="table-top">
          <div class="button-box">
            <el-button size="mini">新建</el-button>
            <el-button size="mini">编辑</el-button>
            <el-button size="mini">详情</el-button>
            <el-button size="mini">删除</el-button>
            <el-button size="mini">启用</el-button>
            <el-button size="mini">导出</el-button>
            <el-button size="mini">打印</el-button>
          </div>
        </div>
        <div style="flex:1;"
             ref="tableBox">
          <el-table :data="tableData"
                    border
                    size="mini"
                    stripe
                    :height="'calc(100% - 29px)'"
                    @row-dblclick="showDetail"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in tableColumn"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             :sortable="item.sortable"
                             show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination style="text-align:center;"
                         :page-sizes="[25, 50, 100, 200]"
                         :page-size="100"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="400"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableColumn: [
        // 表格标题行内容
        { prop: 'subsystem', label: '校时任务', sortable: true },
        { prop: 'orgId', label: '执行周期', sortable: true },
        { prop: 'keySite', label: '状态', sortable: true },
        { prop: 'deviceType', label: '录入机构', sortable: true },
        { prop: 'deviceName', label: '录入人', sortable: true }
      ],
      tableData: [
        // 列表数据
      ],
      isShowDetail: false,
      selectItem: []
    }
  },
  mounted() {},
  methods: {
    handleSelectionChange() {},
    showDetail() {}
  }
}
</script>

<style lang="less" scoped>
.content-page {
  width: 100%;
  height: 100%;
  position: relative;
  .el-breadcrumb {
    i {
      margin-right: 5px;
    }
    display: flex;
    align-items: c;
    align-items: center;
    padding: 10px 0px 10px 3px;
  }
  .right-content {
    height: 100%;
    width: 100%;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      .table-top {
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 10px 0px;
        box-sizing: border-box;
        .button-box {
          display: flex;
          align-items: center;
          .el-checkbox {
            margin-left: 10px;
          }
        }
        div {
          display: flex;
          align-items: center;
          .el-input {
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>
