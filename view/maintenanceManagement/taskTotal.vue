
<template>
    <div class="page">
      <div class="titleBox">
        <Step secondTitle="维保任务统计"></Step>
      </div>
      <div class="searchArea">
        <div class="needFlex">
          <div class="item">
            <div class="title">机构</div>
            <el-input v-model="organization" style="width:330px"></el-input>
          </div>
          <div class="item">
            <div class="title">重点部位</div>
            <el-input v-model="part" style="width:330px"></el-input>
          </div>
          <div class="item">
            <div class="title">维保单位</div>
            <el-input v-model="company" style="width:330px"></el-input>
          </div>
          <el-button style="width:150px; margin-left:50px">统计</el-button>
        </div>
      </div>
      <div class="showArea">
        <div class="needFlex">
          <div class="item" style="background:blue">
            <div class="title">总任务数量</div>
            <p>324个</p>
          </div>
          <div class="item" style="background:green">
            <div class="title">已完成任务数量</div>
            <p>310个</p>
          </div>
          <div class="item" style="background:orange">
            <div class="title">任务完成率</div>
            <p>90%</p>
          </div>
        </div>
      </div>
      <div class="timeSelect">
        <p>当前时间： {{year}} 年 {{month}} 月</p> <i class="el-icon-date" @click="showWindow"></i>
        <div class="window" v-show="windowShow">
          <div class="needFlex">
            <el-select v-model="yearSelect" style="width:120px">
                <el-option v-for="item in yearArr" :key="item.index" :label="item" :value="item" style="width:120px"></el-option>
            </el-select>
            <el-select v-model="quarterSelect" style="width:120px">
                <el-option v-for="item in quarterArr" :key="item.index" :label="item" :value="item" style="width:120px"></el-option>
            </el-select>
            <el-select v-model="monthSelect" style="width:120px">
                <el-option v-for="item in monthArr" :key="item.index" :label="item" :value="item" style="width:120px"></el-option>
            </el-select>
          </div>
          <el-button style="width:120px; margin:10px 0;" @click="showTime">自定义范围</el-button>
          <div class="timeLimit" v-show="timeShow">
            <el-date-picker v-model="timeLimit"
              type="daterange" align="right"
              unlink-panels range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="btnBox">
              <el-button type="primary" @click="submit">应用</el-button>
              <el-button type="primary" @click="close">取消</el-button>
          </div>
        </div>
      </div>
      <div id="echarts" style="width: 1500px;height: 500px; box-sizing:border-box; line-height: 289px;"></div>
    </div>
</template>

<script>
import Step from './components/step.vue'
export default {
  name: '',
  components: {
    Step
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      windowShow: false,
      timeShow: false,
      year: '',
      month: '',
      yearArr: [],
      monthArr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      quarterArr: ['第一季度', '第二季度', '第三季度', '第四季度'],
      yearSelect: '',
      monthSelect: '',
      quarterSelect: '',
      timeLimit: [],
      organization: '',
      part: '',
      company: ''
    }
  },
  watch: {
    monthSelect() {
      if (this.monthSelect) {
        this.quarterSelect = ''
        this.timeLimit = []
      }
    },
    quarterSelect() {
      if (this.quarterSelect) {
        this.monthSelect = ''
        this.timeLimit = []
      }
    },
    timeLimit() {
      console.log(this.timeLimit)
      if (this.timeLimit.length !== 0) {
        this.yearSelect = ''
        this.monthSelect = ''
        this.quarterSelect = ''
      }
    }
  },
  methods: {
    showWindow() {
      this.windowShow = !this.windowShow
    },
    showTime() {
      this.timeShow = !this.timeShow
    },
    submit() {
      console.log(this.timeLimit)
      this.windowShow = false
    },
    close() {
      this.windowShow = false
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('echarts'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          backgroundColor: 'rgb(255,255,255,1)',
          textStyle: {
            color: '#585858',
            fontSize: '12'
          }
        },
        legend: {
          data: ['已完成', '未完成'],
          bottom: '0'
        },
        xAxis: [
          {
            axisLabel: {interval: 0}, // 显示所有X轴刻度
            type: 'category',
            data: ['xxx营业网', 'xxx营业网点', 'xxx营业网点', 'x财富中心', 'xxx自助银行', 'xxx监控中心大楼', 'xxx5G+智能银行', 'xxx营业网', 'xxx营业网点', 'xxx营业网点', 'x财富中心', 'xxx自助银行', 'xxx保管箱库', 'xxx自助银亭']
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 150, // 刻度最大值
            interval: 10, // 刻度间隔
            splitLine: {
              show: false, // 是否显示每层的水平线
              lineStyle: {
                type: 'dashed'// 水平线的虚实
              }
            },
            axisLine: { // y轴
              'show': false
            },
            axisTick: { // y轴刻度线
              'show': false
            }
          }
        ],
        series: [
          {
            name: '已完成',
            type: 'bar',
            barWidth: '20%',
            data: [50, 70, 140, 30, 80, 52, 68, 48, 39, 110, 70, 40, 94, 94],
            itemStyle: {
              normal: {
                color: '#0099ff'
              }
            }
          },
          {
            name: '未完成',
            type: 'bar',
            barWidth: '20%',
            data: [30, 110, 40, 70, 20, 110, 100, 50, 77, 81, 36, 14, 114, 139],
            itemStyle: {
              normal: {
                color: '#00CC00'
              }
            }
          }
        ]
      })
    }
  },
  created() {
    console.log(new Date().getFullYear())
    console.log(new Date().getMonth() + 1)
    console.log(new Date().getDate())
    let d = new Date()
    this.year = d.getFullYear()
    this.month = d.getMonth() + 1
    this.yearArr[0] = d.getFullYear()
    this.yearArr[1] = d.getFullYear() - 1
    this.yearArr[2] = d.getFullYear() - 2
  },
  mounted() {
    this.drawLine()
  }
}
</script>

<style lang="less" scoped>
  .page{
    padding: 17px 24px;
    .searchArea{
      margin-top:30px;
      .needFlex{
        display: flex;
        align-items: center;
        .item{
          display: flex;
          align-items: center;
          .title{
            width:100px;
            height:30px;
            text-align: center;
            line-height: 30px;
            font-size: 14px;
            color:rgba(51,51,51,1);
            background:rgba(245,245,245,1);
            margin : 0 5px;
          }
        }
      }
    }
    .showArea{
      margin-top:30px;
      .needFlex{
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        width:100%;
        padding: 0 400px;
        .item{
          width:200px;
          height:90px;
          border-radius: 10px;
          padding:10px 20px;
          box-sizing: border-box;
          color:#fff;
          .title{
            width:100%;
            font-size: 20px;
          }
          p{
            margin-top:10px;
            box-sizing: border-box;
            padding-right:10px;
            width:100%;
            font-size: 30px;
            text-align: right;
          }
        }
      }
    }
    .timeSelect{
      z-index:2;
      position: relative;
      margin:30px 200px 30px 0 ;
      float:right;
      display: flex;
      align-items: center;
      .el-icon-date{
        margin-left:10px;
        font-size: 28px;
        // color:rgba(158, 173, 193, 1)
      }
      .window{
        z-index:3;
        background: #fff;
        border: 1px solid rgba(158, 173, 193, 1);
        border-radius:10px;
        position: absolute;
        bottom:-200px;
        right:0;
        width:450px;
        height:200px;
        padding:20px;
        box-sizing: border-box;
        .needFlex{
          display: flex;
          justify-content: space-between;
        }
        .btnBox{
          margin-top:10px;
          width:100%;
          display: flex;
          justify-items: space-around;
          align-items: center;
        }
      }
    }
  }
</style>
