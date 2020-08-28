<template>
  <div class="container-wrap">
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
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 查询条件 -->
    <div class="querys">
      <el-form class="query" ref="form" :model="form" label-width="160px">
        <el-form-item label="推送策略名称" class="form-group">
          <el-input v-model="form.pushStrategyName"></el-input>
        </el-form-item>
        <el-form-item label="推送对象" class="form-group">
          <el-select v-model="form.pushObject" placeholder="请选择">
            <el-option
              v-for="item in objoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频源" class="form-group">
          <el-input v-model="form.captureMachineId"></el-input>
        </el-form-item>
        <!-- <el-form-item label="时间模板" class="form-group">
          <el-select v-model="form.timeTemplate" placeholder="请选择">
            <el-option
              v-for="(item, index) in dateing"
              :key="index"
              :label="item.templateName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="启用" class="form-group">
          <el-select v-model="form.isPush" placeholder="请选择">
            <el-option
              v-for="item in startoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源模式" class="form-group">
          <el-select v-model="form.resourceModel" placeholder="请选择">
            <el-option
              v-for="item in resoptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录入人" class="form-group">
          <el-input v-model="form.entryPerson"></el-input>
        </el-form-item>
        <el-form-item label="录入机构" class="form-group">
          <el-input v-model="form.orgName"></el-input>
        </el-form-item>
        <el-form-item label="录入时间" class="form-group form-item">
          <!-- <el-date-picker
            style="width:100%"
            :unlink-panels="true"
            v-model="form.entryTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker> -->
          <el-date-picker
            v-model="form.entryTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="form.entryTime1"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="buttons">
        <el-row>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-row>
        <el-row>
          <el-button @click="reset" size="small">重置</el-button>
        </el-row>
        <el-row>
          <el-button @click="exportFile" size="small">
            导出
            <!-- <a href="/home/ap/safm/ccbc/web/go/businessSysLinkage/PetitionStrategy.xlsx" download="PetitionStrategy.xlsx">导出</a> -->
          </el-button>
        </el-row>
      </div>
    </div>

    <!-- 列表部分 -->
    <div class="lists">
      <el-table
        ref="multipleTable"
        :data="tableData"
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
          min-width="15%"
        ></el-table-column>
        <el-table-column align="center" prop="isPush" label="是否启用" min-width="5%"></el-table-column>
        <el-table-column align="center" prop="entryPerson" label="录入人" min-width="10%"></el-table-column>
        <el-table-column align="center" prop="orgName" label="录入机构" min-width="15%"></el-table-column>
        <el-table-column align="center" prop="entryTime" label="录入时间" min-width="15%"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="block">
      <!-- <el-button type="button" @click="jumpFirstPage" class="my-btn" size="mini">首页</el-button> -->
      <el-pagination
        ref="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.Page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.PageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
      >
        <!-- total:数据长度 -->
      </el-pagination>
      <!-- <el-button type="button" @click="jumpLastPage" class="my-btn" size="mini" style="margin: 0px 5px">尾页</el-button> -->
    </div>
  </div>
</template>

<script>
import {
  getstrategyInfoListApi,
  setstrategyApi,
  getTimeTemplateListApi,
} from '@src/http/businessLinkage/business.api.js'
export default {
  data() {
    return {
      total: 0,
      way: '',
      multipleSelection: [],
      rowdata: [],
      dateing: [],
      form: {
        pushStrategyName: '',
        pushObject: '全部',
        captureMachineId: '',
        // timeTemplate: '',
        isPush: '全部',
        resourceModel: '全部',
        entryPerson: '',
        orgName: '',
        entryTime: '',
        entryTime1: ''
      },
      objoptions: [
        {
          value: '全部',
          label: '全部',
        },
        {
          value: '信访平台',
          label: '信访平台',
        },
      ],
      startoptions: [
        {
          value: '全部',
          label: '全部',
        },
        {
          value: '1',
          label: '是',
        },
        {
          value: '2',
          label: '否',
        },
      ],
      resoptions: [
        {
          value: '全部',
          label: '全部',
        },
        {
          value: '重点部位',
          label: '重点部位',
        },
        {
          value: '资源点位',
          label: '资源点位',
        },
      ],
      page: {
        Page: 1,
        PageSize: 10,
      },
      tableData: [],
    }
  },
  created() {
    this.dates()
  },
  methods: {
    //查询
    search() {
      var conditions = []
      if (this.form.pushStrategyName) {
        var pushStrategyName = {
          key: 'pushStrategyName',
          value: this.form.pushStrategyName,
          operator: 4,
        }
        conditions.push(pushStrategyName)
      }
      if (this.form.pushObject && this.form.pushObject !== '全部') {
        var pushObject = {
          key: 'pushObject',
          value: this.form.pushObject,
          operator: 4,
        }
        conditions.push(pushObject)
      }
      if (this.form.captureMachineId) {
        var captureMachineId = {
          key: 'captureMachineId',
          value: this.form.captureMachineId,
          operator: 4,
        }
        conditions.push(captureMachineId)
      }
      // if (this.form.timeTemplate) {
      //   var timeTemplate = {
      //     key: 'timeTemplate',
      //     value: this.form.timeTemplate,
      //     operator: 4,
      //   }
      //   conditions.push(timeTemplate)
      // }
      if (this.form.isPush && this.form.isPush !== '全部') {
        var isPush = {
          key: 'isPush',
          value: this.form.isPush,
          operator: 4,
        }
        conditions.push(isPush)
      }
      if (this.form.resourceModel && this.form.resourceModel !== '全部') {
        var resourceModel = {
          key: 'resourceModel',
          value: this.form.resourceModel,
          operator: 4,
        }
        conditions.push(resourceModel)
      }
      if (this.form.entryPerson) {
        var entryPerson = {
          key: 'entryPerson',
          value: this.form.entryPerson,
          operator: 4,
        }
        conditions.push(entryPerson)
      }
      if (this.form.orgName) {
        var orgName = {
          key: 'orgName',
          value: this.form.orgName,
          operator: 4,
        }
        conditions.push(orgName)
      }
      if (this.form.entryTime) {
        var entryTime = {
          key: 'entryTime',
          value: this.form.entryTime,
          operator: 0,
        }
        conditions.push(entryTime)
      }
      if (this.form.entryTime) {
        var entryTime1 = {
          key: 'entryTime',
          value: this.form.entryTime1,
          operator: 2,
        }
        conditions.push(entryTime1)
      }
      let params = {
        conditions: conditions,
        page: {
          Page: this.page.Page,
          PageSize: this.page.PageSize,
        },
      }
      getstrategyInfoListApi(params).then((res) => {
        console.log('查询', res)
        this.total = res.data.data.page.totalNumber
        let result = res.data.data.petitionStrategy
        result.map((item, index) => {
          if (item.isPush == '1') {
            item.isPush = '是'
          } else if (item.isPush == '2') {
            item.isPush = '否'
          }
        })
        console.log('列表', result)
        this.tableData = result
      })
    },
    //时间模板
    dates() {
      getTimeTemplateListApi().then((res) => {
        let result = res.data.data
        console.log(result)
        this.dateing = result
        // let date = []
        // for(var i=0;i<result.length;i++){
        //   date.push(result[i])
        //   console.log(date)
        // }
        // this.dates=date
        console.log('时间模板', this.dateing)
      })
    },
    //导出
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      //表头
      let tHeader = [
        '序号',
        '推送策略名称',
        '推送对象',
        '时间模板',
        '是否启用',
        '录入人',
        '录入机构',
        '录入时间'
      ]

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
      if(this.multipleSelection && this.multipleSelection.length > 0){
        list=this.multipleSelection
      }else{
        list = this.tableData
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '推送策略配置查询')
      // let list = []
      // if (this.multipleSelection.length > 0) {
      //   list = this.multipleSelection
      // }
      // let ids = []
      // for (var i = 0; i < list.length; i++) {
      //   ids.push(list[i].id)
      // }
      // if (this.multipleSelection.length !== 0) {
      //   let setexport = {
      //     id: ids,
      //   }
      //   setstrategyApi(setexport).then((res) => {
      //     console.log(res.data.data)
      //     this.way = res.data.data
      //     console.log(this.way);
      //   })
      // }
      // if (this.multipleSelection.length == 0) {
      //   let setexport = {
      //     conditions: [
      //       {
      //         key: 'index',
      //         value: this.tableData.index,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushStrategyName',
      //         value: this.tableData.pushStrategyName,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushObject',
      //         value: this.tableData.pushObject,
      //         operator: 1,
      //       },
      //       {
      //         key: 'timeTemplate',
      //         value: this.tableData.timeTemplate,
      //         operator: 1,
      //       },
      //       {
      //         key: 'isPush',
      //         value: this.tableData.isPush,
      //         operator: 1,
      //       },
      //       {
      //         key: 'entryPerson',
      //         value: this.tableData.entryPerson,
      //         operator: 1,
      //       },
      //       {
      //         key: 'orgName',
      //         value: this.tableData.orgName,
      //         operator: 1,
      //       },
      //       {
      //         key: 'entryTime',
      //         value: this.tableData.entryTime,
      //         operator: 1,
      //       },
      //     ],
      //   }
      //   // let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}res.data.data`
      //   setstrategyApi(setexport).then((res) => {
      //     this.way = res.data.data
      //     console.log(res.data.data);
      //     // console.log(url)
      //     // window.open(url)
      //   })
      // }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    //重置
    reset() {
      this.form.pushStrategyName = ''
      this.form.pushObject = '全部'
      this.form.captureMachineId = ''
      this.form.timeTemplate = ''
      this.form.isPush = '全部'
      this.form.resourceModel = '全部'
      this.form.orgName = ''
      this.form.entryTime = ''
      this.form.entryTime1 = ''
      this.form.entryPerson = ''
    },
    //双击查看
    strategycheck(row) {
      this.rowdata.push(row)
      console.log(this.rowdata)
      this.$emit('changComponent', 'Newpush', '推送策略查看', this.rowdata)
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange--', val)
      this.multipleSelection = val
    },
    handleSizeChange(newsize) {
      console.log(`每页 ${newsize} 条`)
      this.page.PageSize = newsize
      this.search()
    },
    handleCurrentChange(newPage) {
      console.log(`当前页: ${newPage}`)
      this.page.Page = newPage
      this.search()
    },
    jumpFirstPage() {
      this.$refs.pagination.handleCurrentChange(1)
      this.$emit('handleCurrentChange', 1)
    },
    jumpLastPage() {
      let font = this.$refs.pagination
      let cpage = Math.ceil(font.total / font.pageSize)
      font.handleCurrentChange(cpage)
    },
  },
}
</script>

<style scoped lang="less">
.container-wrap {
  padding: 0 20px;
}
.nav {
  width: 500px;
  margin: 10px 0;
  i {
    float: left;
    margin-right: 5px;
  }
  el-breadcrumb {
    float: left;
  }
}
.querys {
  width: 80%;
  margin: 0 auto;
}
.form-group {
  width: 49%;
}
/deep/ .el-form-item__label {
  margin-top: 1px;
  padding: 5px 0;
  text-align: center;
  background: #eee;
  line-height: 28px;
  display: inline-block;
}
.el-form-item {
  margin: 0;
}
.el-form {
  display: inline-block;
}
.el-form-item {
  display: inline-block;
}
.el-select {
  width: 100%;
}
.el-row {
  display: inline-block;
}
.buttons {
  text-align: center;
  margin: 20px 0 30px;
}
.lists {
  height: 500px;
  .el-table {
    height: 400px;
  }
}
.block {
  text-align: center;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  .el-button:first-child {
    line-height: 12px;
  }
}
.form-item{
  .el-input{
    width: 238.5px;
  }
}
.location-icon {
  font-size: 18px;
  float: left;
  margin-top: -4px;
}
</style>
