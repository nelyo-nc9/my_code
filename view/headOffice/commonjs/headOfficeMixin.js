export const headOfficeMixin = {
  data() {
    return {
      properties: [],
      downloadObject: [],
      tHeader: [], //导出表头
      filterVal: [] //导出字段名
    }
  },
  methods: {
    // 打印方法
    Toprint(title) {
      // 判断打印全部还是选中
      let list = []
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: this.properties,
        type: 'json',
        // 表题
        header: '<p class="custom">' + title + '</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle: ' border: 1px solid  lightgray;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray; font-size:12px; text-align:center;'
      })
    },
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      // 表头
      //let tHeader = ['所属部门', '申请编号', '申请缘由', '访客信息', '入园时间', '结束时间', '被访区域', '审批状态']
      // 字段名
      //const filterVal = ['orgName', 'keyPartName', 'name', 'date', 'name', 'date', 'name', 'date']
      let list = []
      // 导出全部或导出选中
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      const data = this.formatJson(this.filterVal, list)
      export_json_to_excel(this.tHeader, data, title)
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    // 表格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 0) {
        if (row.rowspan > 0) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
