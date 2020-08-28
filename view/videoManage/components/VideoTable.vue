<template>
  <div class="table-box">
    <el-table
    v-loading="loading"
     element-loading-text="拼命加载中"
     element-loading-spinner="el-icon-loading"
     element-loading-background="rgba(0, 0, 0, 0.1)"
      stripe
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
import { RESOURCETYPEVIDEO, RESOURCETYPEAUDIO, RESOURCETYPEVINPUT, RESOURCETYPEOUTPUT} from './selectConf'
export default {
  name: 'Table',
  props: {
    loading:{
      type:Boolean,
      default:false,
    },
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
            RESOURCETYPEVIDEO.map((item)=> {
                obj[item.value]=item.label
            });
          } else if (this.type === 'audio') {
            RESOURCETYPEAUDIO.map((item)=> {
                obj[item.value]=item.label
            });
          } else if (this.type === 'input') {
            RESOURCETYPEVINPUT.map((item)=> {
                obj[item.value]=item.label
            });
          } else if (this.type === 'output') {
            RESOURCETYPEOUTPUT.map((item)=> {
                obj[item.value]=item.label
            });
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
   // border: 1px solid #E1E1E1;

}

@media print {
.table-box {
  width: 98%;
  height: calc(~'100% - 37px');
  border-right:  1px solid #E1E1E1;
  border-bottom: 1px solid #E1E1E1;
}

}
</style>
