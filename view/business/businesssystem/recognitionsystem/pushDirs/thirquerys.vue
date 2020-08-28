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
        <el-breadcrumb-item>推送日志</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 查询条件 -->
    <div class="querys">
      <el-form class="query" ref="form" :model="form" label-width="160px">
        <el-form-item label="所属机构" class="form-group">
          <el-input v-model="form.orgName"></el-input>
        </el-form-item>
        <el-form-item label="所属重点部位" class="form-group">
          <el-input v-model="form.keyPartName"></el-input>
        </el-form-item>
        <el-form-item label="推送对象" class="form-group">
          <el-select v-model="form.pushObject" placeholder>
            <el-option
              v-for="item in objoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" class="form-group">
          <el-input v-model="form.resource"></el-input>
        </el-form-item>
        <el-form-item label="抓拍时间" class="form-group form-item">
          <!-- <el-date-picker
            style="width:100%"
            :unlink-panels="true"
            v-model="form.time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>-->
          <el-date-picker
            v-model="form.time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="form.time1"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="推送时间" class="form-group form-item">
          <!-- <el-date-picker
            style="width:100%"
            :unlink-panels="true"
            v-model="form.times"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>-->
          <el-date-picker
            v-model="form.pushTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="form.pushTime1"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="推送结果" class="form-group">
          <el-select v-model="form.pushResult" placeholder="请选择">
            <el-option
              v-for="item in resoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
          <el-button @click="exportFile" size="small">导出</el-button>
        </el-row>
      </div>
    </div>

    <!-- 列表部分 -->
    <div class="lists">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :border="true"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" type="index" align="center" min-width="10%"></el-table-column>
        <el-table-column align="center" prop="orgName" label="所属机构" min-width="12%"></el-table-column>
        <el-table-column align="center" prop="keyPartName" label="所属重点部位" min-width="12%"></el-table-column>
        <el-table-column align="center" prop="resource" label="资源名称" min-width="12%"></el-table-column>
        <el-table-column align="center" prop="pushObject" label="推送对象" min-width="12%"></el-table-column>
        <el-table-column align="center" prop="time" label="抓拍时间" min-width="12%"></el-table-column>
        <el-table-column align="center" prop="pushTime" label="推送时间" min-width="15%"></el-table-column>
        <el-table-column align="center" prop="pushResult" label="推送结果" min-width="15%"></el-table-column>
        <el-table-column align="center" prop="path" label="查看" min-width="15%">
          <template slot-scope="scope">   
            <el-image :src="'http://192.168.110.229:8010'+scope.row.path" style="width: 20px; height: 20px" :preview-src-list="['http://192.168.110.229:8010'+scope.row.path]" ></el-image>
          </template>
        </el-table-column>
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
import { getPetitionLogApi, setlogApi } from '@src/http/businessLinkage/business.api.js'
export default {
  data() {
    return {
      total: 0,
      way: '',
      multipleSelection: [],
      form: {
        orgName: '',
        keyPartName: '',
        pushObject: '',
        resource: '',
        time: '',
        time1: '',
        pushTime: '',
        pushTime1: '',
        pushResult: '全部',
      },
      objoptions: [
        {
          value: '信访平台',
          label: '信访平台',
        },
      ],
      resoptions: [
        {
          value: '全部',
          label: '全部',
        },
        {
          value: '成功',
          label: '成功',
        },
        {
          value: '失败',
          label: '失败',
        },
      ],
      page: {
        Page: 1,
        PageSize: 10,
      },
      tableData: [],
    }
  },
  methods: {
    search() {
      var conditions = []
      if (this.form.orgName) {
        var orgName = {
          key: 'orgName',
          value: this.form.orgName,
          operator: 4,
        }
        conditions.push(orgName)
      }
      if (this.form.keyPartName) {
        var keyPartName = {
          key: 'keyPartName',
          value: this.form.keyPartName,
          operator: 4,
        }
        conditions.push(keyPartName)
      }
      if (this.form.pushObject) {
        var pushObject = {
          key: 'pushObject',
          value: this.form.pushObject,
          operator: 4,
        }
        conditions.push(pushObject)
      }
      if (this.form.resource) {
        var resource = {
          key: 'resource',
          value: this.form.resource,
          operator: 4,
        }
        conditions.push(resource)
      }
      if (this.form.time) {
        var time = {
          key: 'time',
          value: this.form.time,
          operator: 0,
        }
        conditions.push(time)
      }
      if (this.form.time) {
        var time1 = {
          key: 'time',
          value: this.form.time1,
          operator: 2,
        }
        conditions.push(time1)
      }
      if (this.form.pushTime) {
        var pushTime = {
          key: 'pushTime',
          value: this.form.pushTime,
          operator: 0,
        }
        conditions.push(pushTime)
      }
      if (this.form.pushTime) {
        var pushTime1 = {
          key: 'pushTime',
          value: this.form.pushTime1,
          operator: 2,
        }
        conditions.push(pushTime1)
      }
      if (this.form.pushResult && this.form.pushResult !== '全部') {
        var pushResult = {
          key: 'pushResult',
          value: this.form.pushResult,
          operator: 4,
        }
        conditions.push(pushResult)
      }
      let params = {
        conditions: conditions,
        page: {
          Page: this.page.Page,
          PageSize: this.page.PageSize,
        },
      }
      getPetitionLogApi(params).then((res) => {
        console.log(res.data.data.petitionPushInfo)
        this.total = res.data.data.page.totalNumber
        let result = res.data.data.petitionPushInfo
        this.tableData = result
      })
    },
    //导出
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      //表头
      let tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '资源名称',
        '推送对象',
        '抓拍时间',
        '推送时间',
        '推送结果'
      ]

      //字段名
      const filterVal = [
        'index',
        'orgName',
        'keyPartName',
        'resource',
        'pushObject',
        'time',
        'pushTime',
        'pushResult'
      ]
      let list = []
      //导出全部或导出选中
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '推送日志查询')
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
      //   setlogApi(setexport).then((res) => {
      //     console.log(res.data.data)
      //     this.way = res.data.data
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
      //         key: 'keyPartName',
      //         value: this.tableData.keyPartName,
      //         operator: 1,
      //       },
      //       {
      //         key: 'resource',
      //         value: this.tableData.resource,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushObject',
      //         value: this.tableData.pushObject,
      //         operator: 1,
      //       },
      //       {
      //         key: 'time',
      //         value: this.tableData.time,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushTime',
      //         value: this.tableData.pushTime,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushResult',
      //         value: this.tableData.pushResult,
      //         operator: 1,
      //       },
      //     ],
      //   }
      //   setlogApi(setexport).then((res) => {
      //     console.log(res.data.data)
      //     this.way = res.data.data
      //   })
      // }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },

    //重置
    reset() {
      this.form.orgName = ''
      this.form.keyPartName = ''
      // this.form.names = ''
      this.form.pushObject = ''
      this.form.resource = ''
      this.form.time = ''
      this.form.time1 = ''
      this.form.pushTime = ''
      this.form.pushTime1 = ''
      this.form.pushResult = '全部'
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange--', val)
      this.multipleSelection = val
    },
    handleSizeChange(newsize) {
      this.page.PageSize = newsize
      console.log(`每页 ${newsize} 条`)
      this.search()
    },
    handleCurrentChange(newPage) {
      this.page.Page = newPage
      console.log(`当前页: ${newPage}`)
      this.search()
    },
    // jumpFirstPage() {
    //   this.$refs.pagination.handleCurrentChange(1)
    //   this.$emit('handleCurrentChange', 1)
    // },
    // jumpLastPage() {
    //   let font = this.$refs.pagination
    //   let cpage = Math.ceil(font.total / font.pageSize)
    //   font.handleCurrentChange(cpage)
    // },
  },
}
</script>

<style scoped lang="less">
.container-wrap {
  padding: 0 20px;
}
.nav {
  // width: 500px;
  // padding-left: 20px;
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
  margin-top: 20px;
  width: 80%;
  margin: 0 auto;
  // margin-left: 20px;
}
.form-group {
  width: 49%;
}
// .query{
//   width: 928px;
//   height: 202px;
//   margin-left: 20px;
//   /deep/ .el-input__inner{
//     width: 300px;
//   }
// }
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
// .el-input{
//   width: 300px;
// }
.el-form-item {
  display: inline-block;
}
.el-select {
  // width: 300px;
  width: 100%;
}
.el-row {
  display: inline-block;
}
.buttons {
  // width: 928px;
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
.form-item {
  .el-input {
    width: 238.5px;
  }
}

.location-icon {
  font-size: 18px;
  float: left;
  margin-top: -4px;
}
</style>


