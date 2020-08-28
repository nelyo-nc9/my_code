<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <!-- 定位图标 -->
      <div class="location-icon float-left">
        <span class="el-icon-location-outline"></span>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动</el-breadcrumb-item>
        <el-breadcrumb-item>信访识别预警</el-breadcrumb-item>
        <el-breadcrumb-item>推送策略配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 顶部导航 -->
    <div class="buttonsection">
      <el-row>
        <el-button @click="add" v-if="isBtn('新建')">新建</el-button>
        <el-button @click="edit" v-if="isBtn('编辑')" :disabled="multipleSelection.length != 1">编辑</el-button>
        <el-button @click="del" v-if="isBtn('删除')" :disabled="multipleSelection == ''">删除</el-button>
        <el-button @click="exportFile">
          导出
        </el-button>
        <el-button @click="Toprint">打印</el-button>
      </el-row>
    </div>
    <!-- 列表部分 -->
    <div class="lists">
      <el-table
        ref="multipleTable"
        :data="pushStrategyList"
        :border="true"
        row-key="id"
        tooltip-effect="dark"
        height="500px"
        @selection-change="handleSelectionChange"
        @row-dblclick="strategycheck"
      >
        <el-table-column align="center" type="selection" min-width="5%"></el-table-column>
        <el-table-column label="序号" type="index" prop="index" align="center" min-width="5%"></el-table-column>
        <el-table-column align="center" prop="pushStrategyName" label="推送策略名称" min-width="15%"></el-table-column>
        <el-table-column align="center" prop="pushObject" label="推送对象" min-width="15%"></el-table-column>
        <el-table-column
          align="center"
          prop="timeTemplate.templateName"
          label="时间模板"
          min-width="10%"
        ></el-table-column>
        <el-table-column align="center" prop="isPush" label="是否启用" min-width="10%"></el-table-column>
        <el-table-column align="center" prop="entryPerson" label="录入人" min-width="10%"></el-table-column>
        <el-table-column align="center" prop="orgName" label="录入机构" min-width="15%"></el-table-column>
        <el-table-column align="center" prop="entryTime" label="录入时间" min-width="15%"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.Page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getstrategyInfoListApi,
  delstrategyInfoListApi,
  setstrategyApi
} from '@src/http/businessLinkage/business.api.js'
import { mapState, mapActions, mapGetters } from 'vuex'
import { download } from '@src/common/download.js'
export default {
  data() {
    return {
      total: 0,
      multipleSelection: [], //选中的数据
      pushStrategyList: [], // 推送策略 列表
      selectData: {},
      rowdata: [],
      fourMuen: '推送策略编辑',
      isnewpush: false,
      way: '',
      page: {
        Page: 1,
        PageSize: 10
      }
    }
  },
  created() {
    this.getstrategyInfoList()
  },
  computed: {
    ...mapGetters('login', ['isBtn'])
  },
  methods: {
    getstrategyInfoList() {
      // let myName = JSON.parse(sessionStorage.getItem('user'))
      let params = {
        // orgId: myName.org,
        conditions: [],
        // updat: [],
        page: {
          Page: this.page.Page,
          PageSize: this.page.PageSize
        }
      }
      getstrategyInfoListApi(params).then(res => {
        // console.log('总数',res.data.data.page.totalNumber)
        this.total = res.data.data.page.totalNumber
        // console.log(this.total)
        let result = res.data.data.petitionStrategy
        result.map((item, index) => {
          if (item.isPush == '1') {
            item.isPush = '启用'
          }
          if (item.isPush == '2') {
            item.isPush = '禁用'
          }
        })
        this.pushStrategyList = result
        // console.log('22222',this.pushStrategyList)
      })
    },
    // 新建
    add() {
      this.$emit('changComponent', 'Newpush')
    },

    // 编辑
    edit() {
      this.$emit('changComponent', 'Newpush', '推送策略编辑', this.multipleSelection)
    },
    // 删除
    del() {
      let delid = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        delid.push(this.multipleSelection[i].id)
      }
      console.log(delid)
      delstrategyInfoListApi(delid)
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getstrategyInfoList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      // this.$confirm('确认删除该推送配置吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     });
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     });
      //   });
      this.getstrategyInfoList()
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectData = this.multipleSelection[0]
      console.log(this.selectData)
    },
    handleSizeChange(newsize) {
      this.page.PageSize = newsize
      console.log(`每页 ${newsize} 条`)
      this.getstrategyInfoList()
    },
    handleCurrentChange(newPage) {
      this.page.Page = newPage
      console.log(`当前页: ${newPage}`)
      this.getstrategyInfoList()
    },

    //双击查看
    strategycheck(row) {
      this.rowdata.push(row)
      console.log(this.rowdata)
      this.$emit('changComponent', 'Newpush', '推送策略查看', this.rowdata)
    },

    //导出
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      //表头
      let tHeader = ['序号', '推送策略名称', '推送对象', '时间模板', '是否启用', '录入人', '录入机构', '录入时间']

      //字段名
      const filterVal = [
        'index',
        'pushStrategyName',
        'pushObject',
        'timeTemplate.templateName',
        'isPush',
        'entryPerson',
        'orgName',
        'entryTime'
      ]
      let list = []
      //导出全部或导出选中
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.pushStrategyList
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '推送策略配置列表')
      // let list = []
      // if (this.multipleSelection.length > 0) {
      //   list = this.multipleSelection
      // }
      // let ids = []
      // for (var i = 0; i < list.length; i++) {
      //   ids.push(list[i].id)
      // }
      // if(this.multipleSelection.length !== 0){
      //   let setexport = {
      //     id: ids,
      //   }
      //   setstrategyApi(setexport).then((res) => {
      //     console.log(res.data.data)
      //     this.way = res.data.data
      //   })
      // }
      // if(this.multipleSelection.length == 0){
      //   let setexport = {
      //     conditions: [
      //       {
      //         key: 'index',
      //         value: this.pushStrategyList.index,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushStrategyName',
      //         value: this.pushStrategyList.pushStrategyName,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushObject',
      //         value: this.pushStrategyList.pushObject,
      //         operator: 1,
      //       },
      //       {
      //         key: 'timeTemplate',
      //         value: this.pushStrategyList.timeTemplate,
      //         operator: 1,
      //       },
      //       {
      //         key: 'isPush',
      //         value: this.pushStrategyList.isPush,
      //         operator: 1,
      //       },
      //       {
      //         key: 'entryPerson',
      //         value: this.pushStrategyList.entryPerson,
      //         operator: 1,
      //       },
      //       {
      //         key: 'orgName',
      //         value: this.pushStrategyList.orgName,
      //         operator: 1,
      //       },
      //       {
      //         key: 'entryTime',
      //         value: this.pushStrategyList.entryTime,
      //         operator: 1,
      //       },
      //     ],
      //   }
      //   setstrategyApi(setexport).then((res) => {
      //     console.log(res.data.data)
      //     this.way = res.data.data
      //   })
      // }
    },

    formatList(list, clomn) {
      let data = []
      list.map((item, index) => {
        let obj = { index: `${++index}`, timeTemplate: { templateName: ' ' } }
        clomn.map((childItem, childIndex) => {
          if (childItem.field === 'timeTemplate.templateName') {
            console.log(item.timeTemplate.templateName)
            obj.timeTemplate.templateName = item.timeTemplate.templateName ? item.timeTemplate.templateName : ' '
          } else {
            obj[childItem.field] = item[childItem.field] ? item[childItem.field] : ' '
          }
        })
        data.push(obj)
      })
      console.log(data)
      return data
    },

    //打印方法
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      let listData = []
      let properties = [
        { field: 'pushStrategyName', displayName: '推送策略名称' },
        { field: 'pushObject', displayName: '推送对象' },
        { field: 'timeTemplate.templateName', displayName: '时间模板' },
        { field: 'isPush', displayName: '是否启用' },
        { field: 'entryPerson', displayName: '录入人' },
        { field: 'orgName', displayName: '录入机构' },
        { field: 'entryTime', displayName: '录入时间' }
      ]
      if (this.selectData && this.selectData.length > 0) {
        list = this.$lodash.cloneDeep(this.selectData)
      } else {
        list = this.$lodash.cloneDeep(this.pushStrategyList)
      }
      listData = this.formatList(list, properties)
      printJS({
        //表格数据的来源
        printable: listData,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'index', displayName: '序号' },
          { field: 'pushStrategyName', displayName: '推送策略名称' },
          { field: 'pushObject', displayName: '推送对象' },
          { field: 'timeTemplate.templateName', displayName: '时间模板' },
          { field: 'isPush', displayName: '是否启用' },
          { field: 'entryPerson', displayName: '录入人' },
          { field: 'orgName', displayName: '录入机构' },
          { field: 'entryTime', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">推送策略配置列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        //表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        //内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    }
  }
}
</script>

<style scoped lang="less">
.nav {
  // width: 500px;
  padding: 0 20px;
  margin: 10px 0;
  i {
    float: left;
    margin-right: 5px;
  }
  el-breadcrumb {
    float: left;
  }
}
.buttonsection {
  color: black;
  margin: 14px 20px 14px 20px;
}
.lists {
  padding: 0 20px;
  max-height: 500px;
}

// 分页样式
.pagination-wrap {
  text-align: center;
  padding: 14px 20px 20px;
  // display: flex;
  // justify-content: center;
  // .el-button:first-child{
  //   line-height: 12px;
  // }
}
.location-icon {
  font-size: 18px;
  float: left;
  margin-top: -4px;
}
</style>
