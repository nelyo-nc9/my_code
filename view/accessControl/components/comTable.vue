<template>
  <div class="tableCon">
    <el-table
      ref="TableScalHeight"
      stripe
      border
      size="medium"
      :data="tableData"
      @select="select"
      :height="tabHeight"
      style="width: 100%"
    >
      <el-table-column v-if="selection" type="selection" width="55"></el-table-column>
      <el-table-column v-if="sequence" label="序号" type="index" width="80"></el-table-column>
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
    <div class="block" v-if="isPage">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Tbale',
  props: {
    //是否有 多选框
    selection: {
      type: Boolean,
      default: true
    },
    //是否可以修改列宽
    resizable: {
      type: Boolean,
      default: false
    },
    //是否有序号
    sequence: {
      type: Boolean,
      default: true
    },
    isPage: {
      type: Object
    },
    tableData: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    tabHeight: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      currentPage4: 10,
      num: 0
    }
  },
  methods: {
    handleSelectionChange() {
      // console.log('执行了')
    },
    select(s, row) {
      // console.log(s, row, '单选')
    },
    selectAll(s) {
      // console.log(s, '多选')
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
    }
  },
  updated() {},
  mounted() {
  }
}
</script>

<style lang="less" scoped>
.block {
  text-align: center;
  margin-left: -190px;
}
</style>
