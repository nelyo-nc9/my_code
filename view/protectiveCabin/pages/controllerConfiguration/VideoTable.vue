<template>
  <div class="table-box">
    <el-table stripe
              border
              size="medium"
              :data="tableData"
              @selection-change="select"
              style="width: 100%">
      <!-- 复选框 -->
      <el-table-column v-if="selection"
                       type="selection"
                       width="55">
      </el-table-column>
      <!-- 序号 -->
      <el-table-column v-if="sequence"
                       label="序号"
                       type="index"
                       align="center"
                       width="80">
      </el-table-column>
      <el-table-column v-for="(column, index) in columns"
                       :key="index"
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
      default: false,
    },
    columns: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    selection: {
      type: Boolean,
      default: true,
    },
    sequence: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: String || Number,
      default: '100%',
    },
  },
  methods: {
    select(s) {
      this.$emit('selectChange', s, this.type)
    },
  },
}
</script>

<style scoped lang="less">
.table-box {
  width: 100%;
  height: calc(~'100% - 37px');
}
</style>
