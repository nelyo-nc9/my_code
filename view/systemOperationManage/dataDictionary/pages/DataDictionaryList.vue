<!--
 * @Author: tuozhaoping
 * @Date: 2020-06-17 15:49:39
 * @LastEditTime: 2020-06-28 11:15:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\DataDictionary\pages\DataDictionaryList.vue
-->
<template>
  <div class="data-dictionary-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" :disabled="!allowOperation" @click="exportFile">导出</el-button>
          <el-button size="small" :disabled="!allowOperation" @click="print">打印</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange" ref="Table" height="100%" max-height="730" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[10, 25,50,100]"
            :page-size="parmas.page.pageSize"
            :current-page="parmas.page.page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataDircColumnListApi } from '@src/http/systemOperationManage/dataDictionary.api.js'
import Bus from './Bus'
export default {
  name: 'DataDictionaryList',
  components: {
  },
  data() {
    return {
      columns: [
        { prop: 'data', sortable: true, label: '显示名', width: '' },
        { prop: 'homeClass', sortable: true, label: '类别', width: '' },
        { prop: 'sortSerialNum', sortable: true, label: '排列序号', width: '' },
        { prop: 'dictState', sortable: true, label: '状态', width: '' },
        { prop: 'createdAt', sortable: true, label: '创建时间', width: '' }
      ],
      resizable: true,
      tableData: [
      ],
      total: 0,
      allowOperation: false,
      selectData: [],
      parmas: {
        id: '',
        dictId: '',
        type: 1,
        page: {
          pageSize: 10,
          page: 1
        }
      }
    }
  },
  computed: {
  },
  mounted() {
    Bus.$on('busData', (data) => {
      this.parmas = Object.assign(this.parmas, data)
      this.getDataDircColumnListFuc(this.parmas)
      // this.tableData = this.tableData.sort(this.compare('sortSerialNum'))
    })
  },
  created() {
  },
  watch: {
    'total'(nval, oval) {
      if (nval) {
        this.allowOperation = true
      } else {
        this.allowOperation = false
      }
    }
  },
  methods: {
    // 根据返回值进行排序
    // compare(property) {
    //   return function(a, b) {
    //     var value1 = a[property]
    //     var value2 = b[property]
    //     return value1 - value2
    //   }
    // },
    // 根据字典获取列表信息
    getDataDircColumnListFuc(params) {
      getDataDircColumnListApi(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = this.handleData(res.data.data.children.data)
          this.total = Number(res.data.data.totalCount)
        } else {
          this.$messageError(res.data.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 表格数据格式化
    handleData(data) {
      let arr = JSON.parse(JSON.stringify(data))
      arr.forEach(item => {
        if (item.dictState === '1') {
          item.dictState = '启用'
        } else if (item.dictState === '2') {
          item.dictState = '不启用'
        }
      })
      return arr
    },
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.parmas.page.page = val
      this.getDataDircColumnListFuc(this.parmas)
    },
    // 分页条数
    handleSizeChange(val) {
      this.parmas.page.pageSize = val
      this.getDataDircColumnListFuc(this.parmas)
    },
    // 导出
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['显示名', '类别', '排列序号', '状态', '创建时间']
      const filterVal = ['data', 'homeClass', 'sortSerialNum', 'dictState', 'createdAt']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '数据字典列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    print() {
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
          { field: 'data', displayName: '显示名' },
          { field: 'homeClass', displayName: '类别' },
          { field: 'sortSerialNum', displayName: '排列序号' },
          { field: 'dictState', displayName: '状态' },
          { field: 'createdAt', displayName: '创建时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">数据字典列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    }
  },
  beforeDestroy() {
    Bus.$off()
  }
}
</script>

<style lang="less" scoped>
.data-dictionary-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    height: 100%;
    width: 100%;
    .top {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main {
      width: 100%;
      height: calc(~'100% - 70px');
      .list-box-table {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
}
</style>
