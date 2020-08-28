<template>
  <div class="main">
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>访客管理</el-breadcrumb-item>
        <el-breadcrumb-item>统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="top">
      <h2>今日申请:{{topData.todayApply}}</h2>
      <h3>通过:{{topData.adopt}}</h3>
      <h3>拒绝:{{topData.refuse}}</h3>
      <h3>待审批:{{topData.pendingApproval}}</h3>
      <h4>实到人数:{{topData.yesPeople}}</h4>
      <h4>预约人数:{{topData.appointmentsPeople}}</h4>
      <el-radio-group v-model="radio" class="radio">
        <el-radio :label="1">今日</el-radio>
        <el-radio :label="2">7天</el-radio>
        <el-radio :label="3">20天</el-radio>
        <el-radio :label="4">一年</el-radio>
      </el-radio-group>
    </div>

    <div class="center">
      <div id="echarts"></div>
      <div id="echarts2"></div>
      <div id="echarts3"></div>
    </div>
    <h3>申请详情</h3>
    <hr>
    <div class="ipt">
      <span>申请编号</span>
      <el-input class="input" v-model="formApply.nameId"></el-input>
      <span>访客名称</span>
      <el-input class="input" v-model="formApply.name"></el-input>
      <span>入园时间</span>
      <el-date-picker v-model="formApply.startTime" type="datetime" placeholder="选择开始日期时间"></el-date-picker>
      <el-date-picker v-model="formApply.overTime" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
      <span>审批状态</span>
      <el-input class="input" v-model="formApply.type"></el-input>
      <el-button style="font-size:12px;" class="btn">筛选</el-button>
      <el-button style="font-size:12px;" class="btn" @click="reset">重置</el-button>
      <el-button style="font-size:12px;" class="btn" @click="Toprint('访客统计表')">打印</el-button>
    </div>

    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
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
      </el-table>
    </div>
    <el-pagination
      style="text-align:right;margin:30px;"
      :page-sizes="[25, 50, 100, 200]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      radio: 1,
      //今日申请
      topData: {
        todayApply: 100,
        adopt: 50,
        refuse: 11,
        pendingApproval: 38,
        yesPeople: 80,
        appointmentsPeople: 100
      },
      //表单
      formApply:{
        nameId:'',
        name:'',
        startTime:'',
        overTime:'',
        type:'',
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
        { prop: 'date', label: '所属重点部位', width: '', sortable: 'true' },
        { prop: 'name', label: '申请编号', width: '', sortable: 'true' },
        { prop: 'name', label: '申请缘由', width: '', sortable: 'true' },
        { prop: 'date', label: '访客信息', width: '', sortable: 'true' },
        { prop: 'name', label: '入园时间', width: '', sortable: 'true' },
        { prop: 'date', label: '结束时间', width: '', sortable: 'true' },
        { prop: 'name', label: '被访区域', width: '', sortable: 'true' },
        { prop: 'name', label: '审批状态', width: '', sortable: 'true' }
      ],
       downloadObject: [] //打印/导出数据
    }
  },
  mounted() {
    this.drawLine()
    this.drawLine2()
    this.drawLine3()
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('echarts'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '申请数量统计'
        },
        xAxis: {
          name: '日期',
          nameLocation: 'end',
          type: 'category',
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: '申请数量',
          nameLocation: 'end',
          type: 'category',
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['最高', '最低']
        },
        series: [
          {
            data: [100, 302, 501, 334, 200, 1330, 1320],
            type: 'line'
          }
        ]
      })
    },
    drawLine2() {
      // 基于准备好的dom，初始化echarts实例
      let myChart2 = this.$echarts.init(document.getElementById('echarts2'))
      myChart2.setOption({
        title: {
          text: '申请处理分类统计',
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: 'center',
          data: ['通过', '驳回', '待审核']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '通过' },
              { value: 310, name: '驳回' },
              { value: 234, name: '待审核' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    drawLine3() {
      // 基于准备好的dom，初始化echarts实例
      let myChart3 = this.$echarts.init(document.getElementById('echarts3'))
      myChart3.setOption({
        title: {
          text: '访客趋势统计',
          left: 'left'
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', '预约人数', '实到人数'],
          source: [
            { product: 'Matcha Latte', 预约人数: 50, 实到人数: 40 },
            { product: 'Milk Tea', 预约人数: 100, 实到人数: 50 },
            { product: 'Cheese Cocoa', 预约人数: 20, 实到人数: 10 },
            { product: 'Walnut Brownie', 预约人数: 40, 实到人数: 30 }
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar' }, { type: 'bar' }]
      })
    },

    //排序
    sortChange(val) {
      console.log(val)
    },
    handleSelectionChange(val) {
      console.log(222, val)
      this.downloadObject = val
    },
      // 重置按钮
    reset() {
      for (var index in this.formApply) {
        this.formApply[index] = ''
      }
    },
    // 打印方法
    Toprint(title) {
      // 判断打印全部还是选中
      let list = []
      if (this.tableData.length > 0) {
        list = this.tableData
      } else {
        this.$message('没有数据,无法导出')
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'date', displayName: '所属重点部位' },
          { field: 'keyPartName', displayName: '申请编号' },
          { field: 'name', displayName: '申请缘由' },
          { field: 'name', displayName: '访客信息' },
          { field: 'date', displayName: '入园时间' },
          { field: 'name', displayName: '结束时间' },
          { field: 'date', displayName: '被访区域' },
          { field: 'date', displayName: '审批状态' }
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
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .header {
    margin-top: 10px;
  }
  .top {
    width: 100%;
    height: 50px;
    border: 1px solid #ccc;
    margin: 10px 0;
    display: flex;
    h2,
    h3,
    h4 {
      line-height: 50px;
      margin-left: 20px;
      margin-right: 20px;
    }
    .radio {
      margin-left: 50px;
      line-height: 50px;
    }
  }
  .center {
    margin-bottom: 20px;
    width: 100%;
    height: 240px;
    display: flex;
    div {
      width: 23%;
      height: 100%;
      border: 1px solid #ccc;
      margin-right: 2%;
    }
  }
  .ipt {
    width: 100%;
    height: 60px;
    margin-left: 15%;
    margin-top: 20px;
    display: flex;
    .input {
      width: 200px;
    }
    span {
      margin-left: 10px;
      display: inline-block;
      width: 60px;
      height: 40px;
      text-align: center;
      line-height: 30px;
    }
    .btn {
      margin-left: 20px;
    }
  }
}
</style>