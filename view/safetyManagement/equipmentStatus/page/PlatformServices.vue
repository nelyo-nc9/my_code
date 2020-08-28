<template>
  <div>
    <!-- 平台系统头部 -->
    <el-row>
      <el-col :span="8">
      <el-button size="mini" plain @click="handleDetection" :disabled="selectData.length <= 0" >ping检测</el-button>
        <!-- <el-button size="mini" plain @click="dialogVisible = true">报修</el-button> -->
        <el-button size="mini" plain>刷新</el-button>
        <el-button size="mini" plain @click="exportFile">导出</el-button>
        <el-button size="mini" plain @click="Toprint">打印</el-button>
        <el-checkbox v-model="checked" style="margin-left:15px;">显示子机构</el-checkbox>
      </el-col>
      <el-col :span="6" class="count">
        <span>统计:</span>
        <span @click="statistics(1)">{{inLine}}</span>
        <span>|</span>
        <span @click="statistics(2)">{{onLine}}</span>
      </el-col>
      <el-col :span="8">
        在线状态：
        <template style="width:100px">
          <el-select style="width:100px" size="medium" v-model="status">
            <!-- <el-option label="全部" value="全部"></el-option>
            <el-option value="1" label="在线"></el-option>
            <el-option value="2" label="离线"></el-option> -->
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
        <el-input
          suffix-icon="el-icon-search"
          style="width:230px"
          size="medium"
          placeholder="请输入设备名称或设备IP"
          v-model="queryInfo.query"
          @change="handleSearch"
        ></el-input>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <div class="tableContent">
      <el-table :data="tableData" border size="mini" stripe :height="'75vh'" @row-dblclick="showDetail" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column v-for="item in tableColumn" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center" :sortable="item.sortable"></el-table-column>
      </el-table>
      <el-pagination style="text-align:center; margin-top:8px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[25, 50, 100, 200]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="500"></el-pagination>
    </div>

    <!-- 弹出表单 -->
    <div class="for-content">
      <el-dialog title="故障催单处理" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <el-form :model="form" ref="form" label-width="100px" size="mini" :rules="rules">
          <el-row>
            <!-- 左边 -->
            <el-col :span="12" class="form-content-left">
              <el-form-item label="故障设备">
                <el-input :disabled="true" v-model="form.badEquipment" style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="所属机构">
                <el-input :disabled="true" v-model="form.orgId" style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="所属平台">
                <el-input :disabled="true" v-model="form.platformId" style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="发现人">
                <el-input :disabled="true" v-model="form.findName" style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="申报类型">
                <el-select v-model="form.chooseType">
                  <el-option label="网络故障" value="1"></el-option>
                  <el-option label="设备故障" value="2"></el-option>
                  <el-option label="软件故障" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 右边 -->
            <el-col :span="12" class="form-content-right">
              <el-form-item label="故障单号">
                <el-input :disabled="true" v-model="form.faultNumber" style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="所属重点部位">
                <el-input :disabled="true" v-model="form.keyParts" style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="所属设备">
                <el-input :disabled="true" v-model="form.equipmentId" style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="发现时间">
                <el-input :disabled="true" v-model="form.findTime" style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="申报原因">
                <el-input v-model="form.declareReasons" style="width:193px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addRepair">保 存</el-button>
          <el-button @click="cleanForm">重 置</el-button>
          <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { getServiceApi, getPingApi, exportServiceManager } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
export default {
  data() {
    return {
      // 在线数
      inLine: 0,
      // 离线数
      onLine: 0,
      // 是否显示子机构
      checked: true,
      // 获取列表需要参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      tableColumn: [
        // 表格标题行内容
        { sortable: true, prop: 'orgName', label: '所属机构', width: 'auto' },
        { sortable: true, prop: 'keyPartName', label: '所属重点部位', width: 'auto' },
        { sortable: true, prop: 'type', label: '设备类型', width: 'auto' },
        { sortable: true, prop: 'name', label: '设备名称', width: 'auto' },
        { sortable: true, prop: 'ip', label: 'IP地址', width: 'auto' },
        { sortable: true, prop: 'status', label: '在线状态', width: 'auto' },
        // { sortable: true, prop: 'brand', label: '品牌', width: 'auto' },
        // { sortable: true, prop: 'modelNum', label: '型号', width: 'auto' },
      ],
      // 表格数据
      tableData: [],
      // 是否在线
      status: 0,
      // 选择器数据
      options: [{
        value: 0,
        label: '全部'
      }, {
        value: 2,
        label: '离线'
      }, {
        value: 1,
        label: '在线'
      }],
      // 总条数
      total: 500,
      // 控制弹出表单
      dialogVisible: false,
      // 表单数据
      form: {
        badEquipment: 'a',
        orgId: 'a',
        platformId: 's',
        findName: 's',
        chooseType: 'd',
        faultNumber: 'f',
        keyParts: 'g',
        equipmentId: 'h',
        findTime: 'j',
        declareReasons: 'k'
      },
      // 选中项
      selectData: [],
      rules: []
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    status() {
      this.getList()
    },
    checked() {
      this.getList()
    }
  },
  methods: {
    // 勾选选项
    handleSelectionChange(val) {
      this.selectData = val
    },
    // 统计
    statistics(val) {
      this.status = val
    },
    // 导出第一步
    exportFile() {
      let params = {
        isShowSubOrg: this.checked ? 1 : 2,
        status: this.status === '全部' ? 0 : this.status,
        path: 'server.xlsx'
      }
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['所属机构', '所属重点部位', '设备类型', '设备名称', 'IP地址', '在线状态', '品牌', '型号']
      // 字段名
      const filterVal = ['orgName', 'keyPartName', 'type', 'name', 'ip', 'status', 'brand', 'modelNum']
      let list = []
      // 导出全部或导出选中
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
        // 筛选过滤
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, 'fileName')
      } else {
        // list = this.tableData
        exportServiceManager(params)
      }
      // // 筛选过滤
      // const data = this.formatJson(filterVal, list)
      // export_json_to_excel(tHeader, data, 'fileName')
    },
    // 导出第二步
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印方法
    Toprint() {
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
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'type', displayName: '设备名称' },
          { field: 'name', displayName: '设备名称' },
          { field: 'ip', displayName: 'IP地址' },
          { field: 'status', displayName: '在线状态' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">设备状态列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}; @page{} body {color:pink}',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111; ',
        // 内容样式
        gridStyle:
          'border:1px solid lightgray; white-space:nowrap; font-size:12px; text-align:center; color:#222; size:auto; margin:0mm; @page {size: auto ;margin: 0mm ;}'
      })
    },
    // // 格式化指定列的值
    // formatter(row, column) {
    //   return row.address;
    // },
    // 控制表单的弹出
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 重置表单
    cleanForm() {
      this.form = {
        badEquipment: '',
        orgId: '',
        platformId: '',
        findName: '',
        chooseType: '',
        faultNumber: '',
        keyParts: '',
        equipmentId: '',
        findTime: '',
        declareReasons: ''
      }
    },
    getList() {
      // 请求表格数据方法
      let params = {
        subSystem: 1,
        limit: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        isShowSubOrg: (this.checked === true ? 1 : 2),
        orgId: this.checked ? this.currentserial : this.currentOrgId
      }
      if (this.status !== '全部') {
        params['status'] = this.status
      }
      if (this.currentKeyPartId) {
        params['keyPartId'] = this.currentKeyPartId
      }
      if (this.queryInfo.query) {
        params['key'] = this.queryInfo.query
      }
      this.tableData = []
      getServiceApi(params).then(res => {
        let result = res.data
        if (result.code === 0) {
          this.$messageSuccess('获取设备列表成功')
          this.total = result.data && (result.data.pageData.totalNumber || 0)
          this.tableData = result.data.list || []
          this.inLine = result.data.onlineCount || 0
          this.onLine = result.data.offineCount || 0
        }
      })
    },
    // 分页器方法
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getList()
    },
    // ping检测
    handleDetection() {
      if (this.selectData.length !== 0) {
        this.selectData.map((item) => {
          getPingApi({ipAddr: item.ip}).then(res => {
            let result = res.data
            if (result.data.status === 1) {
              this.$messageSuccess(`${result.data.ipAddr}ping成功！`)
            } else {
              this.$message.error(`${result.data.ipAddr}ping失败！`)
            }
          })
        })
      }
    },
    // 搜索
    handleSearch() {
      this.getList()
    },
    showDetail() {
      console.log('查看详情')
    },
    addRepair() {
      console.log('保存')
    }
  }
}

</script>

<style lang="less" scoped>
.tableContent {
  margin-top: 10px;
}
.count {
  display: flex;
  align-items: center;
  span {
    margin: 5px 10px 0 10px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  span:nth-child(1) {
    font-weight: 700;
  }
  span:nth-child(2) {
    color: green;
  }
  span:nth-child(4) {
    color: red;
  }
}
.for-content {
  display: flex;
  .form-content-left {
    padding-left: 40px;
  }
  .form-content-right {
    padding-left: 40px;
  }
  .dialog-footer {
    margin-right: 330px;
  }
}
.el-input.is-disabled {
  width: 250px;
}
</style>
