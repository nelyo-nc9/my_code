<!--
 * @Author: tuozhaoping
 * @Date: 2020-06-17 15:49:39
 * @LastEditTime: 2020-06-28 11:15:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\businessParameterConfig\pages\BusinessParameterSetList.vue
-->
<template>
  <div class="business-parameter-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" icon="el-icon-plus" :disabled="disabled" @click="creat">新建</el-button>
          <el-button size="small" icon="el-icon-edit-outline" :disabled="disabled || selectData.length !== 1"  @click="edit">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" :disabled="disabled || selectData.length === 0" @click="deleteDictionary">删除</el-button>
          <el-button size="small" icon="el-icon-lock" :disabled="disabled || selectData.length === 0" @click="disableState">禁用</el-button>
          <el-button size="small" icon="el-icon-unlock" :disabled="disabled || selectData.length === 0" @click="enablementState">启用</el-button>
          <el-button size="small" :disabled="flag || disabled" style="font-size:12px;" @click="exportFile">
            <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
          <el-button size="small" :disabled="flag || disabled" icon="el-icon-printer" @click="print">打印</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange"  @sort-change="sortChange" ref="Table" height="100%" max-height="700" style="width: 100%">
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
import { delDataDictionaryApi, updateDictDictionaryStatusApi } from '@src/http/systemOperationManage/businessParameterConfig.api.js'
import Bus from './Bus'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'BusinessParameterSetList',
  components: {
  },
  props: {
    disabled: {
      type: Boolean
    }
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
      flag: true,
      tableData: [
      ],
      total: 0,
      selectData: [],
      storeArr: [],
      parmas: {
        id: '',
        dictId: '',
        type: 2,
        page: {
          pageSize: 10,
          page: 1
        }
      }
    }
  },
  computed: {
    ...mapState({
      businessParameterConfigParam: ({ businessParameterConfig }) => businessParameterConfig.businessParameterConfigParam
    })
  },
  mounted() {
    Bus.$on('busData', (data) => {
      this.parmas = Object.assign(this.parmas, data)
      this.SET_BUSINESS_PARAMETER_LIST_PARAM(this.parmas)
      this.getDataDircColumnListFuc(this.parmas)
      // this.tableData = this.tableData.sort(this.compare('sortSerialNum'))
    })
  },
  watch: {
    'total'(nval, oval) {
      console.log(nval)
      if (nval !== 0) {
        this.flag = false
      } else {
        this.flag = true
      }
    }
  },
  created() {
  },
  methods: {
    ...mapMutations('businessParameterConfig', ['SET_BUSINESS_PARAMETER_LIST_PARAM']),
    // 根据返回值进行排序
    // compare(property) {
    //   return function(a, b) {
    //     var value1 = a[property]
    //     var value2 = b[property]
    //     return value1 - value2
    //   }
    // },
    // 根据业务参数配置列表信息
    getDataDircColumnListFuc(params) {
      getDataDircColumnListApi(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = this.handleData(res.data.data.children.dataList)
          this.$nextTick(() => {
            Bus.$emit('data', res.data.data.children.classArray)
          })
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
        if (item.dictState === 1) {
          item.dictState = '启用'
        } else if (item.dictState === 2) {
          item.dictState = '禁用'
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
      this.selectData = val
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
    // 批量控制字典状态 --禁用or --启用
    updateDictDictionaryStatusApiFuc(data) {
      let param = {
        type: '2',
        id: this.parmas.id,
        dataId: [],
        dictState: data
      }
      this.selectData.forEach(item => {
        param.dataId.push(item.dataId)
      })
      updateDictDictionaryStatusApi({'updateStatus': param}).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess(res.data.message)
          this.getDataDircColumnListFuc(this.parmas)
        } else {
          this.$messageError('更新失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 禁用
    disableState() {
      this.updateDictDictionaryStatusApiFuc(2)
    },
    enablementState() {
      this.updateDictDictionaryStatusApiFuc(1)
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
      export_json_to_excel(tHeader, data, '业务参数配置列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 清空列表当前项
    clearSelectData() {
      this.selectData = []
    },
    // 新建
    creat() {
      this.$emit('changeMenu', 'creat')
      this.$nextTick(() => {
        Bus.$emit('creat', this.parmas, false)
      })
    },
    edit() {
      this.$emit('changeMenu', 'edit')
      this.$nextTick(() => {
        Bus.$emit('edit', this.selectData, this.parmas.id, true)
      })
    },
    deleteDictionary() {
      this.$confirm('确认删除业务参数吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDataDictionaryApi()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除字典信息
    delDataDictionaryApi() {
      let param = {
        type: '2',
        id: this.parmas.id,
        dataId: []
      }
      this.selectData.forEach(item => {
        param.dataId.push(item.dataId)
      })
      delDataDictionaryApi({'deleteList': param}).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess(res.data.message)
          this.getDataDircColumnListFuc(this.parmas)
        } else {
          this.$messageError('删除失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
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
        header: '<p class="custom">业务参数配置列表</p>',
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
.business-parameter-list-box {
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
      height: calc(~'100% - 100px');
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
