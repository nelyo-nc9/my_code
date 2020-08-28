<!--
 * @Author: zhangteng
 * @Date: 2020-05-21 11:11:22
 * @LastEditTime: 2020-05-22 19:56:03
 * @LastEditors: zhangteng
 * @Description: 公共表格的抽取
 * @FilePath: \建行CCB\ccb-client\client\src\view\videoManage\components\VideoTable.vue
-->
<template>
  <div class="table-box">
    <el-table
      stripe
      border
      size="medium"
      :data="tableData"
      @select="select"
      height="100%"
      style="width: 100%">
      <!--
        @select-all="selectAll"  // 全选的触发事件
        @selection-change="handleSelectionChange" // 选中的数据发生变化时触发的事件
      -->
      <!-- 复选框 -->
      <el-table-column v-if="selection"
        type="selection"
        width="55">
      </el-table-column>
       <!-- 序号 -->
      <el-table-column v-if="sequence"
        label="序号"
        type="index"
        width="80">
      </el-table-column>
      <!-- <slot name="selection"></slot>
      <slot name="order"></slot> -->
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
</template>

<script>
export default {
  name: 'Table',
  props: {
    resizable: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    selection: {
      type: Boolean,
      default: true
    },
    sequence: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleSelectionChange() {
      console.log('执行了')
    },
    select(s, row) {
      console.log(s, row, '单选')
    },
    selectAll(s) {
      console.log(s, '多选')
    }
  }
}
</script>

<style scoped lang="less">
.table-box {
  width: 100%;
  height: calc(~'100% - 37px');
}
</style>
