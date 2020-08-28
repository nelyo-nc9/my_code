<template>
  <div class="main">
    <div class="header" v-show="isShowRegioInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>施工报备</el-breadcrumb-item>
        <el-breadcrumb-item>施工区域管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin:20px 0;" v-show="isShowRegioInfo==false">
      <el-button style="font-size:12px;" plain @click="exportFile('施工报备待审核列表')">导出</el-button>
      <el-button style="font-size:12px;" plain @click="Toprint('施工报备待审核列表')">打印</el-button>
    </div>
    <div v-show="isShowRegioInfo==false">
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="index" label="序号" min-width="30"></el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          show-overflow-tooltip
          sortable
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="samll"
              type="text"
              @click.native.prevent="handleEdit(scope.row)"
              style="font-size:12px;margin-left:0;"
            >查看</el-button>
            <el-button
              size="samll"
              type="text"
              @click="isShowCreate=true"
              style="font-size:12px;margin-left:0;"
            >生成任务</el-button>
            <el-button size="samll" type="text" style="font-size:12px;margin-left:0;">绘制区域</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:center;"
        :page-sizes="[25, 50, 100, 200]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
    </div>

    <el-dialog title="巡查任务" :visible.sync="isShowCreate">
      <el-select placeholder="请选择接收人" v-model="create.name">
        <el-option label="张三" value="张三"></el-option>
        <el-option label="李四" value="李四"></el-option>
      </el-select>
      <p>巡查时间</p>
      <el-date-picker type="datetime" placeholder="选择日期时间" v-model="create.startTime"></el-date-picker>
      <span>到</span>
      <el-date-picker type="datetime" placeholder="选择日期时间" v-model="create.overTime"></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowCreate = false">取 消</el-button>
        <el-button type="primary" @click="isShowCreate = false">确 定</el-button>
      </div>
    </el-dialog>

    <RegioInfo
      v-show="isShowRegioInfo==true"
      :isShowRegioInfo.sync="isShowRegioInfo"
      :infoObj="infoObj"
    ></RegioInfo>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import RegioInfo from './regioInfo.vue'
export default {
  components: {
    RegioInfo
  },
  data() {
    return {
      isShowRegioInfo: false,
      isShowCreate: false, //生成任务弹窗
      create: {
        name: '',
        startTime: '',
        overTime: ''
      },
      tableData: [
        {
          index: 1,
          date: '2016-05-02',
          name: '王小虎',
          id: 1,
          orgName: '北京',
          keyPartName: 'haidian'
        },
        {
          index: 2,
          date: '2016-05-04',
          name: '王小虎',
          id: 2,
          orgName: '北京',
          keyPartName: 'haidian'
        },
        {
          index: 3,
          date: '2016-05-01',
          name: '王小虎',
          id: 3,
          orgName: '北京',
          keyPartName: 'haidian'
        },
        {
          index: 4,
          date: '2016-05-03',
          name: '王小虎',
          id: 4,
          orgName: '北京',
          keyPartName: 'haidian'
        }
      ],
      tableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '所属机构', width: '', sortable: 'true' },
        { prop: 'keyPartName', label: '所属重点部位', width: '', sortable: 'true' },
        { prop: 'date', label: '申请编号', width: '', sortable: 'true' },
        { prop: 'name', label: '申请部门', width: '', sortable: 'true' },
        { prop: 'name', label: '申请人', width: '', sortable: 'true' },
        { prop: 'date', label: '施工单位', width: '', sortable: 'true' },
        { prop: 'name', label: '施工区域', width: '', sortable: 'true' },
        { prop: 'date', label: '施工类型', width: '', sortable: 'true' },
        { prop: 'name', label: '开始时间', width: '', sortable: 'true' },
        { prop: 'date', label: '结束时间', width: '', sortable: 'true' },
        { prop: 'name', label: '录入人', width: '', sortable: 'true' },
      ],
      downloadObject: [], //打印/导出数据05
      infoObj: {} //查看
    }
  },
  methods: {
    //排序
    sortChange(val) {
      console.log(val)
    },
    handleSelectionChange(val) {
      console.log(222, val)
      this.downloadObject = val
    },

    // 列表查看
    handleEdit(val) {
      this.infoObj = val
      this.isShowRegioInfo = true
      
      console.log(this.infoObj)
    },
    cereteTask() {},
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
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'date', displayName: '申请编号' },
          { field: 'name', displayName: '申请部门' },
          { field: 'name', displayName: '申请人' },
          { field: 'date', displayName: '施工单位' },
          { field: 'name', displayName: '施工区域' },
          { field: 'date', displayName: '施工类型' },
          { field: 'name', displayName: '开始时间' },
          { field: 'date', displayName: '结束时间' },
          { field: 'name', displayName: '录入人' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">' + title + '</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '所属机构',
        '所属重点部位',
        '申请编号',
        '申请部门',
        '申请人',
        '施工单位',
        '施工区域',
        '施工类型',
        '开始时间',
        '结束时间',
        '录入人',
      ]
      // 字段名
      const filterVal = [
        'orgName',
        'keyPartName',
        'date',
        'name',
        'name',
        'date',
        'name',
        'date',
        'name',
        'date',
        'name'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, title)
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>