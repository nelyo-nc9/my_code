<template>
  <div id="alarm">
    <div class="alarm-item">
      <p>近7日报警设备</p>
      <div id="onLine"></div>
    </div>
    <div class="alarm-item">
      <p>近7日在线设备</p>
      <div id="errorOption"></div>
    </div>
    <!-- <div id="myecharts"></div> -->
  </div>
</template>
<style lang='less' scoped>
@media (min-width: 2000px) and(max-width: 4000px) {
  #alarm {
    font-size: 0.8rem;
  }
}
@media (min-width: 0px) and(max-width: 2000px) {
  #alarm {
    font-size: 0.6rem;
  }
}
@media (min-width: 4000px) {
  #alarm {
    font-size: 16px;
  }
}
#alarm {
  //   width: 999px;
  //   height: 290px;
  // background: rgb(6,45,86);
  color: rgb(142, 163, 200);
  width: 100%;
  height: 21%;
  display: flex;
  justify-content: space-between;
  .alarm-item {
    width: 49.2%;
    height: 100%;
    #onLine,
    #errorOption {
      width: 100%;
      height: 100%;
    }
    // background: rgb(6,45,86);

    background-repeat: no-repeat;
    background-size: contain;
    background-size: 100% 100%;
    background-image: url(../../../../static/bigData/alarm-bg.png);
  }

  margin: 0 auto;
  #myecharts {
    width: 100%;
    height: 100%;
  }
  p {
    text-align: center;
    position: relative;
    top: 2%;
    right: 1%;
    font-weight: 700;
    float: left;
    width: 100%;
    color:#DEF1FF;
    background: linear-gradient(to bottom,#FFFFFF,#37B3DC);
    -webkit-background-clip: text;
    color: transparent;
    text-fill-color: transparent;
  }
}
</style>

<script>
function fontSize(res) {
  let docEl = document.documentElement,
    clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}

// 获取指定xxx天前日期  -7/-1
function fun_data(aa) {
  var date1 = new Date(),
    time1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() //time1表示当前时间

  var date2 = new Date(date1)

  date2.setDate(date1.getDate() + aa)

  var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()

  return time2
}
import {
  equipmentStatus,
  getMap,
  rightAlarmStatistics,
  rightInspectionStatistics,
  ReaTimeAlarm,
  weeklyAlarm,
  weeklyOnline,
  weeklyEquipmen,
} from '../../../http/fireVisualization/fireControlHome'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data() {
    return {
      clearIterval: null,
      infoData: {
        error: 0,
        live: 0,
        offline: 0,
      },
      options: {
        wdith: '100%',
        height: '80%',
        grid: {
          left: '1%',
          right: '1%',
          top: '12%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            textStyle: {
              fontSize: fontSize(0.081),
            },
          },
          data: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
          data: [],
          axisLine: {
            lineStyle: {
              color: '#33ccff', //左边线的颜色
              width: '1', //坐标线的宽度
              fontSize: 1,
            },
          },
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              fontSize: fontSize(0.11),
            },
          },
          type: 'value',
          //网格样式
          splitLine: {
            show: false,
            fontSize: 3,
          },

          axisLine: {
            lineStyle: {
              color: '#33ccff', //左边线的颜色
              width: '1', //坐标线的宽度
            },
          },
        },
        series: [
          {
            color: ['rgb(32,244,248)'],

            // symbol: 'none', //关闭线段
            // data: [120, 832, 531, 934, 290, 1330, 20, 120, 832, 531, 934, 290, 1330, 20],
            data:[],
            type: 'line',
            smooth: true,
            areaStyle: {},
          },
        ],
      },
      errorOption: {
        wdith: '100%',
        height: '78%',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },

        grid: {
          left: '6%',
          right: '4%',
          top: '10%',
          // containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: [0, 0.01],
          axisLabel: {
            textStyle: {
              fontSize: fontSize(0.086),
            },
          }, 
          axisLine: {
            lineStyle: {
              show: false,
              color: '#33ccff', //左边线的颜色
            },
          },
          //网格样式
          splitLine: {
            show: false,
            fontSize: 3,
          },
          data: [fun_data(-7),fun_data(-6),fun_data(-5),fun_data(-4),fun_data(-3),fun_data(-2),fun_data(-1)],
        },
        yAxis: {
          axisLine: {
            textStyle: {
              fontSize: fontSize(0.111),
            },
            lineStyle: {
              show: false,
              color: '#33ccff', //左边线的颜色
            },
          },
          //网格样式
          splitLine: {
            show: false,
            fontSize: 3,
          },
          
        },
        series: [
          {
            barWidth: '55%', 
            type: 'bar',
            data: [0,0,0,0,0,0,0],
            // data: [19325, 23438, 31000, 121594, 134141, 681807],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#06B5D7' }, //柱图渐变色
                  { offset: 0.5, color: '#44C0C1' }, //柱图渐变色
                  { offset: 1, color: '#71C8B1' }, //柱图渐变色
                ]),
              },
            },
          },
        ],
      },
      echartsArr: [],
    }
  },
    beforeDestroy() {
    var _this = this
    if (_this.clearIterval) {
      clearInterval(_this.clearIterval)
    }
  },
  mounted() {
    var _this = this
    setTimeout(function () {
      _this.getWeeklyOnline()

      _this.getWeeklyEquipmen()
    }, 2000)
    _this.getHomeData();
    _this.drawLine()

  },
  methods: {

    // 定时拉去数据

    getHomeData() {
      var _this = this
      var setp = localStorage.getItem('interval') || 60000

      var clearIterval = setInterval(() => {
      _this.getWeeklyOnline()

      _this.getWeeklyEquipmen()
      }, setp)
      _this.clearIterval = clearIterval
    },
    // 拿到数据统一显示图表
    showEcharts() {
      this.echartsArr.forEach((item) => {
        item.hideLoading()
      })
    },
    // 获取每周设备统计

    getWeeklyEquipmen() {
      var _this = this
      _this.options.series[0].data = []
      _this.options.xAxis.data = []

      weeklyEquipmen().then(
        (res) => {
          if (res.data.code == 0) {
            res.data.data.count.forEach((item) => {
              _this.options.series[0].data.push(item.count)
              _this.options.xAxis.data.push(item.day)
            })
            _this.drawLine(true)
            _this.showEcharts()
          } else {
            _this.drawLine(true)
          }
        },
        (rej) => {
          _this.drawLine(true)
        }
      )
    },
    //// 获取底部右侧周在线信息
    getWeeklyOnline() {
      var _this = this
      var param = {
        startTime: fun_data(-7),
        endTime: fun_data(-1),
      }
         _this.errorOption.xAxis.data = [];
            _this.errorOption.series[0].data=[]
      weeklyOnline(param).then(
        (res) => {
          console.log('获取底部周在线信息res:',_this.errorOption)
          // 数据正常
          if (res.data.code == 0) {
            console.log('数据正常', res.data.data)
            for (const key in res.data.data) {
              console.log('item:', key, res.data.data[key])
              _this.errorOption.series[0].data.push(res.data.data[key].live)
            }
            res.data.data.forEach((item)=>{
              _this.errorOption.series[0].data.push(item.liveCount)
               _this.errorOption.xAxis.data.push(item.day)
            })
            _this.drawLine(true)
            _this.showEcharts()
            // _this.errorOption.series[0].data.push()
          } else {
            _this.drawLine(true)
          }
        },
        (rej) => {
          console.log('获取底部周在线信息rej:', rej)
          _this.drawLine(true)
        }
      )
    },
    getData() {
      var _this = this
      equipmentStatus({ isAll: true, hostType: item.typeArr }).then(
        (res) => {
          console.log(res, 'res.data')
          // console.log('type:'+type+"::", res.data.data[type])
          _this.infoData.error = res.data.data.error
          _this.infoData.live = res.data.data.live
          _this.infoData.offline = res.data.data.offline
        },
        function (rej) {
          console.log(rej, 'rej')
        }
      )
    },
    drawLine(isShow) {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('onLine'))
      let myChart1 = echarts.init(document.getElementById('errorOption'))
      // 绘制图表
      _this.echartsArr = []
      _this.echartsArr.push(myChart)
      _this.echartsArr.push(myChart1)
      myChart.setOption(_this.options)
      myChart1.setOption(_this.errorOption)
      if (isShow) {
        return
      }

      myChart.showLoading({
        // 此处需要传入一个对象
        text: '加载中',
        color: '#c23531',
        textColor: 'white',
        maskColor: 'rgba(0,39,103, 0.8)',
        zlevel: 0,
        backgroundColor: 'red',
        // 字体大小。从 `v4.8.0` 开始支持。
        fontSize: 12,
        color: '#3385ff',
      })
      myChart1.showLoading({
        // 此处需要传入一个对象
        text: '加载中',
        color: '#c23531',
        textColor: 'white',
        maskColor: 'rgba(0,39,103, 0.8)',
        zlevel: 0,
        backgroundColor: 'red',
        // 字体大小。从 `v4.8.0` 开始支持。
        fontSize: 12,
        color: '#3385ff',
      })
    },
  },
}
</script>