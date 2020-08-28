<template>
  <div id="alarm">
    <p>重点部位实时报警监测</p>
    <div id="myecharts"></div>
  </div>
</template>
<style lang='less' scoped>
@media (min-width: 2000px) and(max-width: 4000px) {
  #alarm {
    width: 96%;
    height: 34%;
    // font-size: 0.8rem;
  }
}
@media (min-width: 0px) and(max-width: 2000px) {
  #alarm {
    width: 96%;
    height: 34%;
    // font-size: 0.6rem;
  }
}
@media (min-width: 4000px) {
  #alarm {
    width: 96%;
    height: 34%;
    // font-size: 16px;
  }
}
#alarm {
  //   width: 999px;
  //   height: 290px;
  background-image: url(../../../../static/bigData/alarm-bg.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-size: 100% 100%;
  margin: 0 auto;
  #myecharts {
    width: 100%;
    height: 100%;
  }
  p {
    text-align: center;
    position: relative;
    top: 3%;
    // font-weight: 700;
    float: left;
    width: 100%;
    background: linear-gradient(to bottom, #ffffff, #37b3dc);
    -webkit-background-clip: text;
    color: transparent;
    text-fill-color: transparent;
  }
}
</style>

<script>
import { alarmOnTimeCountApi } from '@http/alarmBigData/alarmDataApi'

function fontSize(res) {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) {
    return
  }
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

const xData = (start, num) => {
  const arr = []
  for (let i = 0; i < start / num; i++) {
    if (i === 0) {
      arr.push(`${start}秒`)
    } else if (i === start / num - 1) {
      arr.push('0秒')
    } else {
      arr.push('')
    }
  }
  console.log(arr)
  return arr
}

export default {
  data() {
    return {
      options: {
        wdith: '60%',
        height: '80%',
        textStyle: {
          fontFamily: 'Microsoft YaHei',
          color: '#fff',
          background: '#fff'
        },
        grid: {
          top: '10%',
          left: '5%',
          bottom: '0%',
          containLabel: true
        },
        legend: {
          bottom: '4%',
          icon: 'rect',
          // orient: 'vertical',// 设置并排
          itemHeight: fontSize(0.1),
          itemWidth: fontSize(0.1),
          itemGap: fontSize(0.1),
          // bottom: -2,
          textStyle: {
            color: '#ffffff',
            fontSize: fontSize(0.11)
          },
          data: ['双鉴探测器', '红外幕帘探测器', '震动探测器', '门磁', '紧急按钮']
        },
        tooltip: {},
        xAxis: {
          name: '0秒',
          nameTextStyle: {
            padding: [0, -30, 0, -10] // 四个数字分别为上右下左与原位置距离
          },
          type: 'category',
          boundaryGap: false,
          // min: 'dataMax',
          // splitNumber: 36,
          // data: ['0秒', '周二', '周三', '周四', '周五', '周六', '180秒'],
          data: xData(180, 5),
          axisLabel: {
            textStyle: {
              fontSize: fontSize(0.11)
            }
          },
          axisTick: {
            // y轴刻度线
            show: false
          }
        },
        yAxis: {
          type: 'value',
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(228,230,241,0.46)'],
              width: 0.2
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: fontSize(0.11)
            }
          }
        },
        series: [
          {
            name: '双鉴探测器',
            type: 'line',
            // stack: '总量',
            data: [],
            smooth: true,
            symbol: 'none', // 去除原点'
            lineStyle: {
              color: '#4392FF', // #f18005
              width: 2
            },
            color: '#4392FF' // #f18005
          },
          {
            name: '红外幕帘探测器',
            type: 'line',
            // stack: '总量',
            color: '#FF2337', // #f18005
            data: [],
            smooth: true,
            symbol: 'none', // 去除原点
            lineStyle: {
              color: '#FF2337', // #f18005
              width: 2
            }
          },
          {
            symbol: 'none', // 去除原点
            color: '#00DA71', // #f18005
            lineStyle: {
              color: '#00DA71', // #f18005
              width: 2
            },
            name: '震动探测器',
            type: 'line',
            // stack: '总量',
            data: [],
            smooth: true
          },
          {
            symbol: 'none', // 去除原点

            name: '门磁',
            type: 'line',
            // stack: '总量',
            color: '#ECBA21', // #f18005
            data: [],
            smooth: true,
            lineStyle: {
              color: '#ECBA21', // #f18005
              width: 2
            }
          },
          {
            symbol: 'none', // 去除原点
            lineStyle: {
              color: '#43EDFC', // #f18005
              width: 2
            },
            color: '#43EDFC', // #f18005
            name: '紧急按钮',
            type: 'line',
            // stack: '总量',
            data: [],
            smooth: true
          }
        ]
      },
      setTimer: null
    }
  },
  created() {
    // clearInterval(this.setTimer)
    this.getTimeData()
  },
  mounted() {
    // this.drawLine()
    // eslint-disable-next-line space-before-function-paren
    this.setTimer = setInterval(async () => {
      await this.getTimeData(true)
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.setTimer)
    window.removeEventListener('beforeunload', e => clearInterval(this.setTimer))
    this.setTimer = null
  },
  methods: {
    drawLine() {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myecharts'))
      // 绘制图表

      // var arr = [1, 2, 2, 2, 2, 2, 2, 2]
      myChart.setOption(_this.options)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      //   模拟后台实时数据，有真实数据后此段代码无用
      // setInterval(() => {
      //   _this.options.series.forEach((element, index) => {
      //     element.data = []
      //     _this.options.series[index] = element
      //     arr.forEach((j, i) => {
      //       element.data.push(Math.random() * 500 * Math.random() * 300)
      //     })
      //     _this.options.series[index] = element
      //   })
      //   myChart.setOption(_this.options)
      //   window.addEventListener('resize', () => {
      //     myChart.resize()
      //   })
      // }, 2100)
    },
    getTimeData(flag) {
      return alarmOnTimeCountApi().then(res => {
        if (res.data.code === 0) {
          const resData = res.data.data
          const newObj = {}
          Object.keys(resData).forEach(item => {
            switch (item) {
              case '双鉴':
                newObj['双鉴探测器'] = resData[item]
                break
              case '紧急按钮':
                newObj['紧急按钮'] = resData[item]
                break
              case '红外幕帘':
                newObj['红外幕帘探测器'] = resData[item]
                break
              case '门磁':
                newObj['门磁'] = resData[item]
                break
              case '震动':
                newObj['震动探测器'] = resData[item]
                break
              default:
                break
            }
          })
          var length = this.options.xAxis.data.length

          this.options.series.forEach(item => {
            if (flag) {
              item.data.push(newObj[item.name])
              item.data.shift()
            } else {
              for (let i = 0; i < length; i++) {
                item.data[i] = 0
              }
              item.data[length - 1] = newObj[item.name]
            }
          })
          console.log(this.options.series)
          this.drawLine()
        }
      })
    }
  }
}
</script>
