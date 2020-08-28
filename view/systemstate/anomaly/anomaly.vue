<template>
  <div class="main">
    <!-- 导航 -->
    <div class="nav">
      <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统状态监控</el-breadcrumb-item>
        <el-breadcrumb-item>系统状态监控</el-breadcrumb-item>
        <el-breadcrumb-item>系统状态异常</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 顶部 -->
    <div class="header">
      <!-- 按钮 -->
      <div>
        <el-row>
          <el-button size="mini" @click="dialogVisible = true">异常处置</el-button>
        </el-row>
      </div>
      <div class="manage">
        <p>
          <span>异常总数：</span>
          <span>{{tableData.length}}</span>
        </p>
        <p>
          <span>已处理：</span>
          <span>{{tableData.filter((item)=>{return item.dealState=='已处理' }).length}}</span>
        </p>
        <p class="untreated">
          <span>未处理：</span>
          <span>{{tableData.filter((item)=>{return item.dealState=='未处理' }).length}}</span>
        </p>
      </div>
    </div>
    <!-- 下划线 -->
    <el-divider></el-divider>
    <!-- 列表 -->
    <div class="tables" id="printContent">
      <!-- :data="tableData" -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        :border="true"
        tooltip-effect="dark"
        height="100%"
        max-height="700"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-dblclick="linkToServerInfoPage"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="mergeQuantity" label="合并数量" width></el-table-column>
        <el-table-column align="center" prop="serverName" label="服务器名称" width></el-table-column>
        <el-table-column align="center" prop="mechanismName" label="所属机构" width></el-table-column>
        <el-table-column align="center" prop="abTime" label="异常时间" width></el-table-column>
        <el-table-column align="center" prop="abType" label="异常类型" width></el-table-column>
        <el-table-column align="center" prop="abContent" label="异常内容" width></el-table-column>
        <el-table-column align="center" prop="dealState" label="处理状态" width>
          <template slot-scope="scope">
            <span v-if="scope.row.dealState == '未处理'" style="color:red">未处理</span>
            <span v-if="scope.row.dealState == '已处理'" style="color:black">已处理</span>
          </template>
        </el-table-column>
        <!-- <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :style="{color : columns.managetype === '未处理' ? 'red': 'black'}"
        :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center"></el-table-column>-->
      </el-table>
    </div>
    <!-- 弹框 -->
    <el-dialog title="异常处置" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!-- <span>这是一段信息</span> -->
      <div class="disposition">
        <p>是否已通知维修人员</p>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="dispositiontype">
        <p>处理结果</p>
        <textarea name id cols="20" rows="5" v-model="textarea"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="diasure">确 定</el-button>
        <el-button @click="diacancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getsysabstateApi, getsysablogApi } from '@src/http/systemstate/anomaly.api.js'
export default {
  data() {
    return {
      textarea: '',
      dialogVisible: false,
      // columns: [
      //   { prop: 'mergeQuantity', sortable: true, label: '合并数量', width: '' },
      //   { prop: 'name', sortable: true, label: '服务器名称', width: '' },
      //   { prop: 'institution', sortable: true, label: '所属机构', width: '' },
      //   { prop: 'abTime', sortable: true, label: '异常时间', width: '' },
      //   { prop: 'abType', sortable: true, label: '异常类型', width: '' },
      //   { prop: 'abContent', sortable: true, label: '异常内容', width: '' },
      //   { prop: 'dealState', sortable: true, label: '处理状态', width: '' },
      // ],
      tableData: [
        // 列表数据
        // {
        //   number: '1',
        //   count: '3',
        //   name: '服务器1',
        //   institution: '保定分行',
        //   time: '2020-02-19 11:08:01',
        //   anotype: 'CPU使用率超标',
        //   anocontent: 'CPU使用率81%',
        //   managetype: '未处理',
        // },
        // {
        //   number: '1',
        //   count: '7',
        //   name: '服务器3',
        //   institution: '保定分行',
        //   time: '2020-03-18 09:10:08',
        //   anotype: '内存使用率超标',
        //   anocontent: '内存使用率81%',
        //   managetype: '已处理',
        // },
      ],
      options: [
        {
          value: '1',
          label: '是',
        },
        {
          value: '2',
          label: '否',
        },
      ],
      value: '是',
      // conditions:[],
      page: {
        Page: 1,
        PageSize: 50,
        time: '',
      },
      multipleSelection: [],
      dismanage: [],
    }
  },
  created() {
    this.getsysabstate()
    this.timer()
  },
  methods: {
    handleClose() {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
      this.dialogVisible = false
    },
    diasure() {
      let myName=JSON.parse(sessionStorage.getItem("user")); 
      let ablog = {
        Id: this.multipleSelection[0].id.toString(),
        ServerName: this.multipleSelection[0].serverName,
        MechanismName: this.multipleSelection[0].mechanismName,
        MergeQuantity: this.multipleSelection[0].mergeQuantity,
        ServerIp: this.multipleSelection[0].serverIp,
        DealState: '已处理',
        DealTime: this.page.time,
        IsNotice: this.value,
        DealResult: this.textarea,
        Disposer: myName.name,
      }
      let AbLogInfo = []
      AbLogInfo.push(ablog)
      var pa = {
        AbLogInfo: AbLogInfo,
      }
      getsysablogApi(pa)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          this.$notify.warning({
            title: '警告',
            message: '处置失败',
          })
        })
      this.dialogVisible = false
      this.textarea = ''
      this.getsysabstate()
      // this.tableData.forEach((v) => {
      //   if (v.dealState == '未处理') {
      //     this.dismanage.push(v.dealState)
      //   }
      // })
      // console.log(this.dismanage)
    },
    diacancel() {
      this.dialogVisible = false
    },
    getsysabstate() {
      let myName=JSON.parse(sessionStorage.getItem("user"));
      let params = {
        orgId: myName.org,
        conditions: [],
        page: {
          Page: this.page.Page,
          PageSize: this.page.PageSize,
        },
      }
      getsysabstateApi(params)
        .then((res) => {
          // let result = []
          let result = res.data.data.ablog.sysAbState
          console.log('列表', result)
          this.tableData = result
        })
        .catch((err) => {
          this.Error(err)
        })
    },
    //勾选选中
    handleSelectionChange(val) {
      console.log('handleSelectionChange--', val)
      this.multipleSelection = val
    },

    // 双击行
    linkToServerInfoPage(row, column, event){
      console.log(row)
      console.log(column)
      console.log(event)
    },
    timer() {
      let newTime = new Date()
      // 以下代码依次是获取当前时间的年月日时分秒
      var year = newTime.getFullYear()
      var month = newTime.getMonth() + 1
      var strDate = newTime.getDate()
      var minute = newTime.getMinutes()
      var hour = newTime.getHours()
      var second = newTime.getSeconds() + 1
      // 固定时间格式
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (hour >= 0 && hour <= 9) {
        hour = '0' + hour
      }
      if (minute >= 0 && minute <= 9) {
        minute = '0' + minute
      }
      if (second >= 0 && second <= 9) {
        second = '0' + second
      }
      var timer = year + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':' + second
      this.page.time = timer
      // console.log(timer)
    },
  },
}
</script>

<style scoped lang="less">
.nav {
  font-size: 12px;
  width: 500px;
  padding-left: 20px;
  margin: 10px 0;
  i {
        display: inline-block;
        // cursor: pointer;
        // margin-top: 1px;
        font-size: 15px;
      }
  el-breadcrumb {
    float: left;
  }
}
.header {
  // width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  .manage {
    margin-right: 50px;
    display: flex;
    justify-content: space-between;
    p {
      margin: 0 5px;
    }
    .untreated {
      color: red;
    }
  }
}
.disposition {
  p {
    margin-top: 3px;
  }
}
.dispositiontype {
  text-align: center;
  margin-top: 20px;
  p {
    margin-right: 100px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.el-divider {
  // width: 1000px;
  margin-left: 20px;
}
.tables {
  margin-left: 20px;
  width: 100%;
  height: 500px;
}
.el-dialog {
  .disposition {
    display: flex;
    justify-content: center;
    .el-select {
      font-size: 12px;
      width: 60px;
      /deep/.el-input__inner {
        height: 25px;
      }
      /deep/.el-select__caret {
        height: 30px;
      }
    }
  }
}
textarea {
  resize: none;
}
</style>
<style lang="less">
.main {
  width: 98%;
}
</style>