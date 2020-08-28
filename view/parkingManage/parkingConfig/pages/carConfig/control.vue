<!--
 * @Author: your name
 * @Date: 2020-06-09 14:39:01
 * @LastEditTime: 2020-06-17 10:58:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\carConfig\attention.vue
-->
<template>
  <div class="platform-list-box">
    <div class="right-content">
      <!-- 顶部操作栏 -->
      <div class="top-box">
        <!-- 面包屑 -->
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>停车管理</el-breadcrumb-item>
            <el-breadcrumb-item>停车配置</el-breadcrumb-item>
            <el-breadcrumb-item>车辆管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{fourMuen}}</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <!-- 操作按钮 -->
        <div class="button-box"
             v-if="isCarConfig">
          <el-button size="mini"
                     @click="AddParkHost('create')">新建</el-button>
          <el-button size="mini"
                     @click="AddParkHost('edit')"
                     :disabled="handleSelectionChangeArr.length !== 1">编辑</el-button>
          <el-button size="mini"
                     @click="dialogVisibleBtn">删除</el-button>
          <!-- <el-button size="mini"
                     @click="examineBtn"
                     :disabled="handleSelectionChangeArr.length !== 1">查看</el-button> -->
          <el-button size="mini" @click="exportClick">导出</el-button>
          <el-button size="mini"
                     @click="printCarConfig">打印</el-button>
        </div>
      </div>
      <div class="table-box"
           v-if="isCarConfig">
        <div class="table-top">
          <el-button type="text"
                     icon="el-icon-refresh"
                     @click="getAlarmHostList">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search"
                    style="float:right;width:200px;"
                    v-model="licensePlate"
                    @keyup.enter.native="search"
                    size="mini"></el-input>
        </div>
        <div style="flex:1;"
             ref="tableBox">
          <el-table :data="tableData"
                    border
                    size="mini"
                    @row-dblclick="examineBtn"
                    :disabled="handleSelectionChangeArr.length !== 1"
                     @selection-change="handleSelectionChange"
                    stripe
                    :height="tableHeight">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             prop='index'
                             label="序号"></el-table-column>
            <el-table-column v-for="item in tableColumn"

                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             :sortable="item.sortable"
                             show-overflow-tooltip
                             align="center"
                             :resizable="resizable"></el-table-column>
          </el-table>
        </div>
        <div class="pagination-box">
          <park-paging ref="listPagination"
                       :total="total"
                       @paginationConfChange="paginationConfChange"></park-paging>
        </div>
      </div>
      <create-List v-if="isCreate"
       ref="refCreate"
                   @colseCreate="colseCreate"
                   @printShow="printShow"
                   :seta='seta'
                   :fourMuen="fourMuen"
                  ></create-List>
      <print-List v-if="isPrint"
                  :a='a'
                  @AddParkHost="AddParkHost"
                  @printShows="printShows"
                  @getAlarmHostList='getAlarmHostList'
                  @colseCreate="colseCreate"></print-List>
      <del-dialog ref="dialogVisible"></del-dialog>
    </div>
  </div>
</template>

<script>
import { getParkConfigApi, deleteParkConfigApi } from '@src/http/parkingManage/parkingRecord.api.js'
import parkPaging from '../../../components/parkPaging'
import createList from './Create'
import printList from './ptint'
import delDialog from '../../../components/deleteDialog'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'emphasis',
  components: {
    parkPaging,
    createList,
    printList,
    delDialog
  },
  computed: {
    ...mapState({
      handleSelectionChangeArr: ({ parkingManage }) => parkingManage.handleSelectionChangeArr,
      activeData: ({ parkingManage }) => parkingManage.activeData
    })
  },
  watch: {
    isCarConfig(val, oldVal) {
      if (this.isCarConfig) {
        this.fourMuen = '布控车辆列表'
      }
    }
  },
  created() {
    this.getParkConfigList()
  },
  data() {
    return {
      licensePlate: '',
      resizable: false,
      tableHeight: 660,
      isCarConfig: true,
      isCreate: false,
      isPrint: false,
      fourMuen: '布控车辆列表',
      tableColumn: [
        { prop: 'licensePlate', sortable: true, label: '车牌号', width: '' },
        { prop: 'status', sortable: true, label: '布控状态', width: '' },
        { prop: 'timeLimit', sortable: true, label: '期限', width: '' },
        { prop: 'carBrand', sortable: true, label: '车辆品牌', width: '' },
        { prop: 'carModel', sortable: true, label: '车辆型号', width: '' },
        { prop: 'carType', label: '车辆类型', width: '' },
        { prop: 'carColor', label: '车身颜色', width: '' },
        { prop: 'updatedDept', label: '录入机构', width: '' },
        { prop: 'updatedBy', label: '录入人', width: '' },
        { prop: 'updatedAt', label: '录入时间', width: '' }
      ],
      tableData: [
        // {
        //   controlName: '可疑车辆',
        //   carNum: '鄂A-3536S',
        //   status: '启用',
        //   deadline: '20200302-20200304',
        //   brand: '朗逸',
        //   model: 'ESO',
        //   carType: '小轿车',
        //   colorList: '黑',
        //   enterOrgan: '保定分行',
        //   enterPerson: 'yangday',
        //   enterTime: '2020-09-19'
        // },
        // {
        //   controlName: '可疑车辆',
        //   carNum: '鄂A-3536S',
        //   status: '启用',
        //   deadline: '20200302-20200304',
        //   brand: '朗逸',
        //   model: 'ESO',
        //   carType: '小轿车',
        //   colorList: '黑',
        //   enterOrgan: '保定分行',
        //   enterPerson: 'yangday',
        //   enterTime: '2020-09-19'
        // }
      ],
      total: 0,
      paginationConfig: {
        limit: 100,
        page: 1,
        type: 3
      },
      selectData: [],
      a: ''
    }
  },

  // mounted() {
  //   window.addEventListener('resize', this.resizeFun)
  //   this.$nextTick(() => {
  //     this.resizeFun()
  //   })
  // },
  methods: {
    ...mapMutations(['CHANGE_EXA_SAVE', 'CHANGE_EXA_BTN', 'SELECTION_CHANGE_HTGHT']),
    seta(a) {
      this.a = a
    },
    // 新建or编辑
    AddParkHost(val) {
      if (val === 'create') {
        this.isPrint = false
        this.isCarConfig = false
        this.isCreate = true
        this.fourMuen = '布控车辆新建'
      } else if (val === 'edit') {
        this.fourMuen = '布控车辆编辑'
        this.CHANGE_EXA_SAVE(this.handleSelectionChangeArr[0])
        this.isPrint = false
        this.isCarConfig = false
        this.isCreate = true
        this.$nextTick(() => {
          this.$refs.refCreate.formData = JSON.parse(JSON.stringify(this.activeData))
        })
      }
    },
    // 新建中的保存
    printShow() {
      this.isCreate = false
      this.isPrint = true
      this.CHANGE_EXA_BTN(true)
      this.fourMuen = '布控车辆查看'
    },
    // 搜索
    search() {
      // var input=this.input2

      if (this.licensePlate == '') {
        this.$notify.warning({
          title: '警告',
          message: '请添加搜索内容'
        })
      } else {
        let params = {
          limit: this.paginationConfig.limit,
          page: this.paginationConfig.page,
          type: this.paginationConfig.type,
          licensePlate: this.licensePlate
        }
        // console.log(params)
        console.log(this.licensePlate)
        getParkConfigApi(params).then((res) => {
          console.log('搜索停车配置', res.data.data)
          // this.formData.id = res.data.data.id
          let result = res.data.data.parkDefenses
          // console.log(result)
          this.tableData = result
        }).catch((err) => {
          this.Error(err)
        })
      }
    },
    // 打印跳转
    printShows() {
      console.log('dddd')
      this.CHANGE_EXA_BTN(false)
      this.isCreate = false
      this.isPrint = true
      this.isCarConfig = false
      this.fourMuen = '重点关注查看'
    },
    // 查看
    examineBtn(row, column, event) {
      console.log(row)
      this.CHANGE_EXA_BTN(false)
      this.fourMuen = '布控车辆查看'
      this.isCreate = false
      this.isPrint = true
      this.isCarConfig = false
      this.SELECTION_CHANGE_HTGHT(row)
    },
    // 打印
    printCarConfig() {
      // 判断打印全部还是选中
      let listArr = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        listArr = this.multipleSelection
      } else {
        listArr = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: listArr,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'licensePlate', displayName: '车牌号' },
          { field: 'status', displayName: '状态' },
          { field: 'timeLimit', displayName: '期限' },
          { field: 'carBrand', displayName: '品牌' },
          { field: 'carModel', displayName: '型号' },
          { field: 'carType', displayName: '车辆类型' },
          { field: 'carColor', displayName: '车身颜色' },
          { field: 'enterOrgan', displayName: '录入机构' },
          { field: 'enterPerson', displayName: '录入人' },
          { field: 'equipmentData', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">重点车辆关注信息</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 取消新建页面
    colseCreate() {
      this.isCarConfig = true
      this.isCreate = false
    },
    getTableList() {},
    refresh() {},
    select(s, row) {
      this.selectData = s
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getTableList()
    },
    // 刷新列表
    getAlarmHostList() {
      this.getParkConfigList()
    },
    dialogVisibleBtn() {
      this.$refs.dialogVisible.dialogVisible = true
      let idsArr = []
      this.selectData.map(item => {
        idsArr.push(item.id)
      })
      console.log(idsArr)
      deleteParkConfigApi(idsArr).then((res) => {
        // console.log(res);
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.getParkConfigList()
      }).catch(err => {
        console.log(err)
      })
    },
    // 表格选中触发的事件
    handleSelectionChange(val) {
      this.SELECTION_CHANGE_HTGHT(val)
      this.selectData = val
    },
    // 导出
    exportClick() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      const tHeader = [
        '序号',
        '车牌号',
        '状态',
        '期限',
        '品牌',
        '型号',
        '车辆类型',
        '车身颜色',
        '录入机构',
        '录入人',
        '录入时间'
      ]
      const filterVal = [
        'index',
        'licensePlate',
        'status',
        'timeLimit',
        'carBrand',
        'carModel',
        'carType',
        'carColor',
        'enterOrgan',
        'enterPerson',
        'createdAt'
      ]
      let list = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    resizeFun() {
      this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    getParkConfigList() {
      let params = {
        limit: this.paginationConfig.limit,
        page: this.paginationConfig.page,
        type: this.paginationConfig.type
      }
      getParkConfigApi(params).then((res) => {
        console.log('查询停车配置', res.data.data.parkDefenses)
        // this.formData.id = res.data.data.id
        let result = res.data.data.parkDefenses
        // console.log(result)
        this.tableData = result
        result.map((item, index) => {
          if (item.status === 1) {
            item.status = '启用'
          } else {
            item.status = '停用'
          }
          if (item.carColor === 1) {
            item.carColor = '黑色'
          } else {
            item.carColor = '红色'
          }
          if (item.carType === 1) {
            item.carType = '轿车'
          } else if (item.carType === 2) {
            item.carType = '商务车'
          } else if (item.carType === 3) {
            item.carType = '越野车'
          } else if (item.carType === 4) {
            item.carType = '面包车'
          } else if (item.carType === 5) {
            item.carType = '巴士'
          } else if (item.carType === 6) {
            item.carType = '货车'
          } else if (item.carType === 7) {
            item.carType = '自行车'
          } else if (item.carType === 8) {
            item.carType = '摩托车'
          }
        })
      }).catch((err) => {
        this.Error(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.platform-list-box {
  width: 100%;
  height: 100%;
  .right-content {
    height: 100%;
    width: 100%;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  .detail-box,
  .detail-bottom {
    color: #666;
    width: 100%;
    padding: 8px;
    border: 1px solid #f2f2f2;
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    .detail-item {
      display: flex;
      width: 50%;
      height: 32px;
      line-height: 32px;
      .item-left {
        width: 100px;
        background: #f8f8f8;
        border: 1px solid #fff;
      }
      .item-right {
        flex: 1;
        border: 1px solid #f8f8f8;
        border-left: none;
      }
    }
  }
  .detail-bottom {
    .detail-item {
      width: 33.33%;
    }
  }
  .detail-footer {
    margin-top: 24px;
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
</style>
