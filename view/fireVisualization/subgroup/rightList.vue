<template >
  <div id="right">
    <div class="duty list">
      <p class="title">报警事件分类</p>
      <p class="info">
        {{options3[keyWord].label}} &nbsp;&nbsp;&nbsp;
        <b>共</b>&nbsp;&nbsp;
        <b class="big">{{alarmCount}}</b> &nbsp;&nbsp;
        <b>件</b>
      </p>
      <div class="right-select">
        <div class="search-box">
          <!-- <el-input v-model="keyWord" placeholder="请输入..." suffix-icon="el-icon-search"></el-input> -->

          <el-select
            v-model="keyWord"
            filterable
            placeholder="请选择"
            @change="getAlarmStatisticsData()"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div id="warning"></div>
    </div>
    <!-- <div class="equipment list">
      <p class="title">
        巡检任务完成统计
        <a @click="jump('fireVisualizationbasicData')">详情</a>
      </p>
      <div class="content" id="equipment">
        <div id="viedeo"></div>
        
      </div>
    </div>-->
    <div class="warning list" @click="jump('fireVisualizationreamTime')">
      <p class="title">实时报警信息</p>
      <div class="btns">
        <button size="mini">已处理&nbsp;&nbsp;{{alarmInofData.done}}</button>
        <button size="mini">待处理 &nbsp;&nbsp;{{alarmInofData.toDo}}</button>
      </div>

      <div id="error">
        <el-table
          :data="tableData"
          mix-height="100%"
          size="medium"
          :row-style="changeCss"
          stripe

          style="width: 100%"
          :header-row-class-name="changeCssName"
        >
          <el-table-column prop="orgName" label="机构" width="100" height="30"></el-table-column>
          <el-table-column prop="deviceName" label="设备" width="130" height="30"></el-table-column>
          <el-table-column prop="alarmLocation" label="地点" width="50" height="30"></el-table-column>
          <el-table-column prop="startTime" label="时间" width="130" height="30"></el-table-column>
          <el-table-column prop="dealPerson" label="联系人" width="50" height="30"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
function fontSize(res) {
  let docEl = document.documentElement,
    clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}
var data = [17]
var xMax = 100

var now = new Date() //当前日期
var nowDayOfWeek = now.getDay() //今天本周的第几天
var nowDay = now.getDate() //当前日
var nowMonth = now.getMonth() //当前月
var nowYear = now.getYear() //当前年
nowYear += nowYear < 2000 ? 1900 : 0 //
var lastMonthDate = new Date() //上月日期
lastMonthDate.setDate(1)
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
var lastYear = lastMonthDate.getYear()
var lastMonth = lastMonthDate.getMonth()
//格式化日期：yyyy-MM-dd
function formatDate(date) {
  // 年
  var year = date.getFullYear()
  // 月
  var month = date.getMonth() + 1
  // 日
  var day = date.getDate()

  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day
  }

  var dateString = year + '-' + month + '-' + day

  return dateString
}
//获得某月的天数
function getMonthDays(myMonth) {
  var monthStartDate = new Date(nowYear, myMonth, 1)
  var monthEndDate = new Date(nowYear, myMonth + 1, 1)
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
  return days
}

// getDays 获取当前天

function fun_data(aa) {
  var date1 = new Date(),
    time1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() //time1表示当前时间

  var date2 = new Date(date1)

  date2.setDate(date1.getDate() + aa)

  var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()

  return time2
}
//获得本周的开始日期
function getWeekStartDate() {
  // 按周日为一周的最后一天计算
  var date = new Date()

  // 今天是这周的第几天
  var today = date.getDay()

  //上周日距离今天的天数（负数表示）
  var stepSunDay = -today + 1

  // 如果今天是周日
  if (today == 0) {
    stepSunDay = -7
  }

  // 周一距离今天的天数（负数表示）

  var stepMonday = 7 - today

  var time = date.getTime()

  var monday = new Date(time + stepSunDay * 24 * 3600 * 1000)

  var sunday = new Date(time + stepMonday * 24 * 3600 * 1000)
  // 本周一的日期 （起始日期）
  var startDate = formatDate(monday) // 日期变换 2018-11-10

  // 本周日的日期 （结束日期）
  var endDate = formatDate(sunday) // 日期变换  2018-11-10

  // var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
  return startDate
}
//获得本周的结束日期
function getWeekEndDate() {
  // 按周日为一周的最后一天计算
  var date = new Date()

  // 今天是这周的第几天
  var today = date.getDay()

  //上周日距离今天的天数（负数表示）
  var stepSunDay = -today + 1

  // 如果今天是周日
  if (today == 0) {
    stepSunDay = -7
  }

  // 周一距离今天的天数（负数表示）

  var stepMonday = 7 - today

  var time = date.getTime()

  var monday = new Date(time + stepSunDay * 24 * 3600 * 1000)

  var sunday = new Date(time + stepMonday * 24 * 3600 * 1000)
  // 本周一的日期 （起始日期）
  var startDate = formatDate(monday) // 日期变换 2018-11-10

  // 本周日的日期 （结束日期）
  var endDate = formatDate(sunday) // 日期变换  2018-11-10
  return endDate
}

//获得本月的开始日期
function getMonthStartDate() {
  var monthStartDate = new Date(nowYear, nowMonth, 1)
  return formatDate(monthStartDate)
}
//获得本月的结束日期
function getMonthEndDate() {
  var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
  return formatDate(monthEndDate)
}

import {
  equipmentStatus,
  getMap,
  getMapId,
  rightAlarmStatistics,
  rightInspectionStatistics,
  ReaTimeAlarm,
  weeklyAlarm,
  weeklyOnline,
} from '../../../http/fireVisualization/fireControlHome'
export default {
  data() {
    return {
      echartsArr: [],
      alarmCount: 0,
      alarmInofData: {
        done: 0, //已处理
        toDo: 1, // 待处理
      },
      tableData: [],
      keyWord: 0,
      options3: [
        {
          value: 0,
          label: '本日统计情况',
        },
        {
          value: 1,
          label: '本周统计情况',
        },
        {
          value: 2,
          label: '本月统计情况',
        },
      ],
      optionsActive: {
        name: '消防水系统设备运行状态',
        wdith: '80%',
        height: '80%',
        legend: {
          icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
          // orient: 'vertical',
          itemHeight: fontSize(0.1),
          itemWidth: fontSize(0.1),
          itemGap: fontSize(0.1),
          wdith: fontSize(0.1),
          top: "14%",
          borderRadius: 0,
          right: "10%",
          axisLabel: {
            interval: 1,
          },

          textStyle: {
            fontSize: fontSize(0.12),
            color: 'white',
            padding: [6, 0, 0, 0],
          },
        },
        label: {
          //展示文本设置
          color: '#33ccff',
          normal: {
            show: true, //展示
            position: 'outside', // outside表示文本显示位置为外部,
            // color:'red'
          },
          emphasis: {
            //文本样式
            show: true, //展示
            textStyle: {
              //文本样式
              fontSize: 18,
              fontWeight: '400',
            },
          },
        },

        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b}: {c} ({d}%)',
        // },
        series: [
          {
            // name: '访问来源1111',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            // 饼状图调整位置
            center: ['50%', '70%'],
            selectedMode: 'single',
            label: {
              //展示文本设置
              normal: {
                //  饼状图折线展示外部
                show: true, //展示
                position: 'outside', // outside表示文本显示位置为外部
                fontSize: fontSize(0.12),
              },
              emphasis: {
                //文本样式
                show: true, //展示
                wdith: '50px',
                textStyle: {
                  //文本样式
                  fontSize: fontSize(0.12),
                  fontWeight: '600',
                },
              },
            },
            labelLine: {
              lineStyle: {
                color: 'white',
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: fontSize(0.12),
                fontWeight: 'bold',
              },
            },

            data: [],
          },
        ],
      },
      options: [
        {
          name: '消防水系统设备运行状态',
          wdith: '80%',
          height: '80%',
          legend: {
            icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            // orient: 'vertical',
            itemHeight: 7,
            itemWidth: 7,
            itemGap: 15,
            wdith: '10px',
            top: 60,
            borderRadius: 0,
            right: 10,
            axisLabel: {
              interval: 1,
            },

            textStyle: {
              fontSize: fontSize(0.12),
              color: 'white',
              padding: [6, 0, 0, 0],
            },
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside', // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: 18,
                fontWeight: '400',
              },
            },
          },

          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b}: {c} ({d}%)',
          // },
          series: [
            {
              // name: '访问来源1111',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              // 饼状图调整位置
              center: ['50%', '70%'],
              selectedMode: 'single',
              label: {
                //展示文本设置
                normal: {
                  //  饼状图折线展示外部
                  show: true, //展示
                  position: 'outside', // outside表示文本显示位置为外部
                  fontSize: fontSize(0.12),
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  wdith: '50px',
                  textStyle: {
                    //文本样式
                    fontSize: fontSize(0.12),
                    fontWeight: '600',
                  },
                },
              },
              labelLine: {
                lineStyle: {
                  color: 'white',
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: fontSize(0.12),
                  fontWeight: 'bold',
                },
              },

              data: [
                { value: 179, name: '火灾', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 335, name: '水灾', itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 679, name: '爆炸', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '地震', itemStyle: { color: 'rgb(220,70,30)' } },
              ],
            },
          ],
        },

        {
          name: '消防水系统设备运行状态',
          wdith: '80%',
          height: '80%',
          legend: {
            icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            // orient: 'vertical',
            itemHeight: 7,
            itemWidth: 7,
            itemGap: 15,
            wdith: '10px',
            top: 60,
            borderRadius: 0,
            right: 10,
            axisLabel: {
              interval: 1,
            },

            textStyle: {
              fontSize: fontSize(0.12),
              color: 'white',
              padding: [6, 0, 0, 0],
            },
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside', // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: 18,
                fontWeight: '400',
              },
            },
          },

          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b}: {c} ({d}%)',
          // },
          series: [
            {
              // name: '访问来源1111',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              // 饼状图调整位置
              center: ['50%', '70%'],
              selectedMode: 'single',
              label: {
                //展示文本设置
                normal: {
                  //  饼状图折线展示外部
                  show: true, //展示
                  position: 'outside', // outside表示文本显示位置为外部
                  fontSize: fontSize(0.12),
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  wdith: '50px',
                  textStyle: {
                    //文本样式
                    fontSize: fontSize(0.12),
                    fontWeight: '600',
                  },
                },
              },
              labelLine: {
                lineStyle: {
                  color: 'white',
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: fontSize(0.12),
                  fontWeight: 'bold',
                },
              },

              data: [
                { value: 79, name: '火灾', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 335, name: '水灾', itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 79, name: '爆炸', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '地震', itemStyle: { color: 'rgb(220,70,30)' } },
              ],
            },
          ],
        },
        {
          name: '消防水系统设备运行状态',
          wdith: '80%',
          height: '80%',
          legend: {
            icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            // orient: 'vertical',
            itemHeight: 7,
            itemWidth: 7,
            itemGap: 15,
            wdith: '10px',
            top: 60,
            borderRadius: 0,
            right: 10,
            axisLabel: {
              interval: 1,
            },

            textStyle: {
              fontSize: fontSize(0.12),
              color: 'white',
              padding: [6, 0, 0, 0],
            },
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside', // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: 18,
                fontWeight: '400',
              },
            },
          },

          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b}: {c} ({d}%)',
          // },
          series: [
            {
              // name: '访问来源1111',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              // 饼状图调整位置
              center: ['50%', '70%'],
              selectedMode: 'single',
              label: {
                //展示文本设置
                normal: {
                  //  饼状图折线展示外部
                  show: true, //展示
                  position: 'outside', // outside表示文本显示位置为外部
                  fontSize: fontSize(0.12),
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  wdith: '50px',
                  textStyle: {
                    //文本样式
                    fontSize: fontSize(0.12),
                    fontWeight: '600',
                  },
                },
              },
              labelLine: {
                lineStyle: {
                  color: 'white',
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: fontSize(0.12),
                  fontWeight: 'bold',
                },
              },

              data: [
                { value: 109, name: '火灾', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 15, name: '水灾', itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 19, name: '爆炸', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '地震', itemStyle: { color: 'rgb(220,70,30)' } },
              ],
            },
          ],
        },
        {
          tooltip: {
            show: true,
            formatter: '{b} {c}',
          },
          grid: {
            left: '2%',
            top: '22%',
            right: '2%',
            bottom: '2%',
            containLabel: true,
          },
          xAxis: {
            show: false,
            type: 'value',
            // 设置x轴显示几段
            min: 0,
            max: 100,

            splitLine: {
              show: false,
            },
            interval: 50,
          },
          yAxis: {
            show: true,
            type: 'category',
            data: ['每日巡检任务', '每周巡检任务', '每月巡检任务'],
            axisTick: { show: false },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'rgb(93,126,169)',
              },
            },
            splitLine: {
              show: false,
            },
            inside: true,
            textStyle: {
              color: 'red',
            },
          },

          series: [
            {
              type: 'bar',
              itemStyle: {
                normal: {
                  barBorderRadius: 15,
                  barBorderWidth: 1,
                  borderColor: 'rgb(142, 163, 200)',
                  color: 'rgb(5,47,88)', // 定义柱形的背景色
                  barBorderRadius: [15, 15, 15, 15], // 定义背景柱形的圆角
                },
              },
              barGap: '-100%', // 设置柱形重合的重要步骤
              data: [80, 80, 80, 80, 80, 80, 80],
              z: 0,
              silent: true,
              animation: true, // 关闭动画效果
              barWidth: 16,
            },
            {
              type: 'bar',
              data: [50, 50, 50, 50, 50, 50, 50],
              barWidth: 14,
              barGap: '-93%', // 设置柱形重合的重要步骤
              label: {
                normal: {
                  show: true, //是否显现，不显示的话设置成false
                  position: 'right', //显示的位置
                  distance: 100, //距离侄子的值 // label要显示的值比如： 20%

                  formatter: function (param) {
                    return param.value
                  },
                  textStyle: {
                    //这个地方颜色是支持回调函数的这种的，如果是一种颜色则可以写成： color :'#1089E7'
                    color: 'rgb(93,126,169)',
                    fontSize: '16',
                  },
                },
              },
              itemStyle: {
                normal: {
                  barBorderWidth: 2,
                  borderColor: 'rgb(5,47,88)',
                  barBorderRadius: 15,
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: 'rgb(230,51,52)',
                    },
                    {
                      offset: 1,
                      color: 'rgb(247,147,24)',
                    },
                  ]),
                  barBorderRadius: [15, 15, 15, 15], // 定义柱形的圆角
                },
              },
            },
          ],
        },
      ],
    }
  },
  mounted() {
    this.getAlarmStatisticsData()

    this.getWeeklyAlarmData()
    this.getReaTimeAlarmNumber()
    // this.getMapData()
  },
  methods: {
    //警事件分类统计
    getAlarmStatisticsData() {
      var _this = this
      _this.drawLine()
      var parmes = { startTime: '2020-12-10 12:12:12', endTime: '2020-12-10  23:59:59' }
      if (this.keyWord == 0) {
        // 当天
        parmes.startTime = fun_data(0) + ' 00:00:00'
        parmes.endTime = fun_data(0) + ' 23:59:59'
      } else if (this.keyWord == 1) {
        // 本周
        parmes.startTime = getWeekStartDate() + ' 00:00:00'
        parmes.endTime = getWeekEndDate() + ' 23:59:59'
      } else {
        // 本月
        parmes.startTime = getMonthStartDate() + ' 00:00:00'
        parmes.endTime = getMonthEndDate() + ' 23:59:59'
      }
      console.log('getAlarmStatisticsData', parmes)
      _this.alarmCount = 0
      // console.log('报警事件分类统计数据请求成功:', resData)
      rightAlarmStatistics(parmes).then(
        (resData) => {
          // 返回参数：
          if (resData.data.code == 0) {
            var countData = JSON.parse(resData.data.data.count)
            console.log('报警事件分类统计数据请求成功', countData, countData['报警总数'])
            for (const key1 in countData) {
              console.log('key1', key1)
            }
            if (!countData['报警总数']) {
              _this.optionsActive.series[0].data = []
              var r = Math.floor(Math.random() * 256)
              var g = Math.floor(Math.random() * 256)
              var b = Math.floor(Math.random() * 256)
              _this.optionsActive.series[0].data.push({
                value: +0,
                name: '暂无数据',
                itemStyle: { color: 'rgb(' + r + ',' + g + ',' + b + ')' },
              })
            } else {
              _this.optionsActive.series[0].data = []

              for (const key in countData) {
                var r = Math.floor(Math.random() * 256)
                var g = Math.floor(Math.random() * 256)
                var b = Math.floor(Math.random() * 256)
                // console.log(key + ':' + resData.data.count[key])
                if (key != '报警总数') {
                  console.log('key:' + key)
                  _this.optionsActive.series[0].data.push({
                    value: +countData[key],
                    name: key,
                    itemStyle: { color: 'rgb(' + r + ',' + g + ',' + b + ')' },
                  })
                } else {
                  //报警总数
                  _this.alarmCount = countData[key]
                }
              }
            }

            _this.drawBar(true)
            _this.drawLine(true)
            _this.showEcharts()
          } else {
            console.log('报警事件分类统计数据请求失败:', resData.data.data)
            _this.drawBar()
            _this.optionsActive.series[0].data = []
            var r = Math.floor(Math.random() * 256)
            var g = Math.floor(Math.random() * 256)
            var b = Math.floor(Math.random() * 256)
            _this.optionsActive.series[0].data.push({
              value: +0,
              name: '暂无数据',
              itemStyle: { color: 'rgb(' + r + ',' + g + ',' + b + ')' },
            })
            _this.drawLine()
          }
          // resData = JSON.parse(resData)
        },
        (rej) => {
          console.log('报警事件分类统计数据请求失败:', rej)
        }
      )
    },
    // 获取实时报警待处理，已处理
    getReaTimeAlarmNumber() {
      ReaTimeAlarm().then((res) => {
        console.log('ReaTimeAlarm 实时报警待处理，已处理：', JSON.parse(res.data.data.count).done)
        this.alarmInofData.done = JSON.parse(res.data.data.count).done
        this.alarmInofData.toDo = JSON.parse(res.data.data.count).toDo
        // done: 已处理
        // toDo: 待处理
      })
    },
    // 拿到数据统一显示图表
    showEcharts() {
      this.echartsArr.forEach((item) => {
        item.hideLoading()
      })
    },
    // 获取报警列表数据
    getWeeklyAlarmData() {
      var _this = this
      weeklyAlarm().then(
        (res) => {
          console.log('获取报警列表数据 res :', res.data.data)
          if (res.data.data.results) {
            console.log('报警列表数据', res.data.data.results)
            _this.tableData = res.data.data.results
          } else {
            _this.tableData = []
          }
        },
        (rej) => {
          console.log('获取报警列表数据 rej', rej)
          _this.tableData = []
        }
      )
    },

    jump(name) {
      this.$router.push({ name: name, params: { title: '基础数据' } })
    },
    changeCss({ row, rowIndex }) {
      // 定义changeCss函数，这样当表格中的相应行满足自己设定的条件是就可以将该行css样式改变

      return 'background:yellow'
    },
     changeCssName({ row, rowIndex }) {
      // 定义changeCss函数，这样当表格中的相应行满足自己设定的条件是就可以将该行css样式改变

      return 'xf-table-header'
    },
    //   报警环形图
    drawLine(isShow) {
      var _this = this
      // console.log($('#viedeo'))
      _this.echartsArr = []
      var myChart1 = echarts.init(document.getElementById('warning'))
      myChart1.setOption(this.optionsActive)
      _this.echartsArr.push(myChart1)
      if (!isShow) {
        myChart1.showLoading({
          // 此处需要传入一个对象
          text: '加载中',
          color: '#c23531',
          textColor: 'white',
          maskColor: 'rgba(0,39,103, 0.8)',
          zlevel: 0,
        })
      }
      window.addEventListener('resize', () => {
        myChart1.resize()
      })
    },
    // 柱状图
    drawBar() {
      return
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('error'))
      var option = {
        grid: {
          textStyle: {
            fontFamily: 'Microsoft YaHei',
          },
          bottom: '20%',
          containLabel: true,
        },
        //标题配置信息
        textStyle: {
          fontFamily: 'KaiTi',
          color: '#fff',
          fontSize: '10px',
        },
        xAxis: {
          show: true,
          type: 'category',
          data: ['入侵报警', '紧急报警', '门禁报警', '设备异常', '防护舱报警', '主机报警', '事件提'],
        },
        yAxis: {
          show: false,
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                //每根柱子颜色设置
                color: function (params) {
                  let colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622']
                  return colorList[params.dataIndex]
                },
              },
            },
            //柱状图上显示数据
            label: {
              show: 'true',
              position: 'top',
              color: '#FFF',
              fontWeight: 'bolder',
              // backgroundColor: "auto",
              fontSize: '10',
            },
            // //平均值
            // markLine: {
            //     data: [{ type: "average", name: "平均值" }]
            // }
          },
        ],
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
  },
  watch: {
    keyWord(val) {
      console.log(val)
      this.drawLine()
    },
  },
}
</script>
<style lang="less" scoped>
@media (max-width: 2000px) {
  .title {
    font-size: 0.6rem;
    font-weight: 700;
  }
}
#right {
  /deep/ .xf-table-header{
        display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    grid-template-rows: 100%;
    width: 24vw; 
    height: 2vw; 
  }
  .btns {
    width: 100%;
    height: auto;
    top: 1vw;
    display: grid;
    grid-template-columns: 20% 20%;
    justify-content: right;
    position: relative;
    right: 4%;
  }
  .warning {
    button {
      float: right;
      background: rgb(7, 37, 72);
      border: none;
      font-size: 0.5vw;
      color: rgb(142, 163, 200);
      padding: 2px 10px;
      margin-left: 10px;
      position: relative;
      top: 0.6vw;
      right: 0.1vw;
    }
  }
  color: rgb(142, 163, 200);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  /* justify-items: left; */
  flex-direction: column;
  justify-content: space-between;
  .list {
    width: 100%;
    height: 44%;
    position: relative;
    background-image: url(../../../../static/bigData/list-bg-right.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // margin-bottom: 4px;
    box-sizing: border-box;
    padding: 0px 1.2rem 1.2rem 1.2rem;
    .title {
      text-align: center;
      position: relative;
      top: 4%;
      font-size: 0.6vw;
      color:#DEF1FF;
      background: linear-gradient(to bottom,#FFFFFF,#37B3DC);
      -webkit-background-clip: text;
      color: transparent;
      text-fill-color: transparent;
      a {
        position: relative;
        top: 1vw;
        z-index: 1100000;
      }
    }

    .info {
      position: relative;
      top: 12%;
      color: white;
      font-size: 0.6vw;
      b {
        color: rgb(124, 136, 158);
      }
      .big {
        color: rgb(203, 47, 57);
        font-size: 0.96vw;
      }
    }
    .right-select {
      position: absolute;
      right: 3%;
      top: 12%;
      z-index: 1000000;
      width: 9vw;
      .search-box {
        width: 100%;
        height: 2vw;
        line-height: 2vw;
        margin-top: 0.5vw;
        margin-top: 0.5rem;
        background: none;

        /deep/.el-select-dropdown {
          background: rgb(6, 45, 86) !important;
          border: 1px solid #385d7d;

          /deep/.popper__arrow {
            border-bottom-color: #385d7d;
          }

          /deep/.el-select-dropdown__list {
            background: rgb(6, 45, 86);
          }
          /deep/.el-select-dropdown__item.hover,
          .el-select-dropdown__item:hover {
            color: white;
            background: rgb(6, 45, 86);
          }
          //.el-select-dropdown__list {

          /deep/.popper__arrow::after {
            // background:#385d7d;
            border-bottom-color: rgb(6, 45, 86);
          }
        }
        /deep/ .el-select-dropdown__wrap {
          max-height: 500px;
        }
        /deep/ .el-select-dropdown__item {
          height: 1.2vw;
          line-height: 1.2vw;
          font-size: 0.8vw;
          padding: 0 1vw;
          margin-top: 0.5vw;
        }
        /deep/.el-input__inner {
          background: none;
          border-radius: 0;
          font-size: 0.7vw;
          border: 0.5px solid #385d7d;
          color: white;
          height: 2vw !important;
          padding: 0 1vw;
        }

        /deep/.el-select {
          display: inline-block;
          position: relative;
          width: 100%;
        }
      }
    }
  }

  .warning {
    padding: 0;
  }
  .list:nth-of-type(3) {
    //  background: red;
    padding: 0;
    .title {
      padding: 0px 1.2rem 0px 1.2rem;
    }
  }
  .duty {
    #warning {
      height: 100%;
      width: 100%;
      //   background: red;
    }
    height: 48%;
    .content {
      height: 45%;
      position: relative;
      top: 12%;

      .img_left {
        float: left;
        width: 34%;
        img {
          width: 50%;
          height: 70%;
        }
        p {
          font-family: '微软雅黑';
          font-weight: 400;
          text-align: center;
          width: 50%;
          float: right;
          height: 50px;

          //   background: orange;
          //  background-image: url(../../../../static/bigData/line.png);
        }
      }
      .info_right {
        font-size: 0.6rem;
        float: right;
        width: 66%;
        span {
          display: inline-block;
        }
        p {
          min-height: 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tetx_left {
          width: 30%;
          text-align: right;
        }
        .text_right {
          width: 60%;
          text-align: left;
          float: right;
          text-align: justify;
          text-justify: newspaper;
          word-break: break-all;
        }
      }
    }
  }
  a {
    float: right;
    color: #33ccff;
    position: absolute;
    cursor: pointer;
    right: 2%;
  }
  #equipment {
    height: 100%;
    display: flex;
    width: 100%;
    #viedeo {
      height: 100%;
      width: 100%;
      //   background: orange;
    }
  }
  #error {
    width: 100%;
    height: 80%;
    position: relative;
    top: 8%;
    padding: 0.6vw 0.6vw 0.6vw 0.6vw;
    /deep/.el-table {
      height: 100%;
      width: 100%;
      color: #343434;
      font-size: 0.5vw !important;
    }

    /deep/ table {
      width: 100% !important ;
      height: 100%;
    }
    /deep/.el-table th {
      background: rgb(11, 70, 130) !important;
      border: none;
      
    height: 100%;
    }
    /deep/.el-table {
      background: rgb(6, 45, 86) !important;
    }
    /deep/.el-table__row {
      background: rgb(6, 45, 86) !important;
      border: none !important;
    }
    /deep/.el-table tr {
      background: rgb(6, 45, 86);
      color: white;
      border: none !important;
    }

    /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: black;
    }
    /deep/.el-table td,
    .el-table th.is-leaf {
      border-bottom: none;
    }

   

    /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
      background: rgb(11, 70, 130) !important;
      color: rgb(142, 163, 200);
      border: none;
    }
    /deep/ .el-table .cell{
      height: 2vw;
      line-height: 2vw;
    }
    /deep/ .el-table td {
      height: auto;
      line-height: 2vw;
    }
    /deep/.el-table__body tr,
    .el-table__body td {
      padding: 0;
      height: 1.3vw;
      background: yellow;
    }
  }
}
/deep/.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: none !important;
}
</style>