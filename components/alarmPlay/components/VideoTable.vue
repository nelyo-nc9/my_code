<template>
  <div class="table-box">
    <el-table
      stripe
      border
      size="medium"
      :data="tableData"
      @selection-change="select"
      :height="maxHeight"
      :max-height="maxHeight"
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
        width="80">
      </el-table-column>
      <el-table-column
        v-for="(column, index) in columns" :key="index"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :sortable="column.sortable"
        :formatter="formatterTable"
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
    },
    type: {
      type: String,
      default: ''
    },
    maxHeight: {
      type: String || Number,
      default: '100%'
    }
  },
  methods: {
    select(s) {
      this.$emit('selectChange', s, this.type)
    },
    formatterTable(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'status':
          params = cellValue === 2 ? '在线' : '离线'
          break
        case 'stream':
          obj = {
            1: '主码流',
            2: '子码流',
            3: '第三码流'
          }
          params = obj[cellValue] || ''
          break
        case 'class':
          if (this.type === 'video') {
            obj = {
              1: '枪机',
              2: '半球',
              3: '球机',
              4: '针孔',
              5: '红外枪机',
              6: '智能IPC',
              7: '全景'
            }
          } else if (this.type === 'audio') {
            obj = {
              1: '拾音器'
            }
          } else if (this.type === 'input') {
            obj = {
              1: '警灯',
              2: '警号',
              3: '声闪一体',
              4: '射灯'
            }
          } else if (this.type === 'output') {
            obj = {
              1: '警灯',
              2: '警号',
              3: '声闪一体',
              4: '射灯'
            }
          }
          params = obj[cellValue] || ''
          break
        case 'dport':
        case 'cport':
        case 'inputNumber':
        case 'outputNumber':
        case 'analogNumber':
        case 'audioNumber':
        case 'digitalNumber':
          params = cellValue === '' ? 0 : cellValue
          break
        default:
          params = cellValue
          break
      }
      return params
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
