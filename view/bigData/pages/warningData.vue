<template>
  <div id="warningData">
    <div class="select">
      <div class="select-count">
        <el-cascader clearable :props="selectProp"></el-cascader>
      </div>
    </div>
    <div class="warningInfo">
      <ul>
        <li>
          <div class="left">
            <img src="../../../../static/bigData/warning.png" alt />
            <p>一级报警</p>
          </div>
          <div class="right grey">
            <p>{{alarmCount.level1}}</p>
          </div>
        </li>
        <li>
          <div class="left">
            <img src="../../../../static/bigData/warning.png" alt />
            <p>二级报警</p>
          </div>
          <div class="right grey">
            <p>{{alarmCount.level2}}</p>
          </div>
        </li>
        <li>
          <div class="left">
            <img src="../../../../static/bigData/warning.png" alt />
            <p>三级报警</p>
          </div>
          <div class="right grey">
            <p>{{alarmCount.level3}}</p>
          </div>
        </li>
        <li>
          <div class="left">
            <img src="../../../../static/bigData/warning.png" alt />
            <p>四级报警</p>
          </div>
          <div class="right grey">
            <p>{{alarmCount.level4}}</p>
          </div>
        </li>
        <li>
          <div class="left">
            <img src="../../../../static/bigData/warning.png" alt />
            <p>五级报警</p>
          </div>
          <div class="right grey">
            <p>{{alarmCount.level5}}</p>
          </div>
        </li>
        <li>
          <div id="toral">
            <div class="item grey">
              <span>报警总数</span>
              {{alarmCount.alarmInfoTotal}}条
            </div>
            <div class="item grey">
              <span>报警处置率</span>
              {{alarmCount.percentage}}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="waringTotal">
      <div class="Total">
        <p class="line-title">报警总数统计分析</p>
        <div class="button-list">
          <button :class="clickIndex == 1 ? 'active' : ''" @click="toggle(1)">当天</button>
          <button :class="clickIndex == 2 ? 'active' : ''" @click="toggle(2)">七天</button>
          <button :class="clickIndex == 3 ? 'active' : ''" @click="toggle(3)">当月</button>
        </div>
        <hostList :item.sync="hostDatas"></hostList>
      </div>
      <div class="totalpie">
        <Pie :options="options" :index="0" ref="total_pie"></Pie>
      </div>
    </div>
    <div class="contrast">
      <div v-for="(item,index) in hostData" :key="index" class="itme-list">
        <p v-if="index == 0">重点部位报警统计对比分析</p>
        <p v-else-if="index == 1">报警种类数量同比分析</p>
        <p v-else>报警数量发生区域分布对比</p>
        <hostList v-if="index < 2" :item="item" :index="index" :key="index" ref="refDataAlarm"></hostList>
        <hostList v-if="index==2" :item="newOptions" :index="index" :key="index"></hostList>
        <div v-if="index == 0" v-show="btn1>0" class="left_btn" @click="moveLeft">
          <i class="el-icon-d-arrow-left"></i>
        </div>
        <div
          v-if="index == 0"
          v-show="btn1<countPortant.count.length - 6"
          class="right_btn"
          @click="moveRight"
        >
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <div v-if="index == 2" v-show="btn2>0" class="left_btn" @click="moveLeftbtn">
          <i class="el-icon-d-arrow-left"></i>
        </div>
        <div
          v-if="index == 2"
          v-show="btn2<countAddress.count.length - 6"
          class="right_btn"
          @click="moveRightbtn"
        >
          <i class="el-icon-d-arrow-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import hostList from '../subgroup/leftList.vue'
import Pie from '../subgroup/pie.vue'
import { mapState, mapActions } from 'vuex'
import { getTreeApi } from '@src/http/alarmBigData/bigDataDetail.api'
import { alarmAllCountApi } from '@src/http/alarmBigData/alarmDataApi'

// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

function fontSize(res) {
  // let docEl = document.documentElement
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) {
    return
  }
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}

let computeTime = showlong => {
  const arr = []
  let flag = 0
  for (let i = 0; i < 48; i++) {
    if (showlong && i > 12) {
      return arr
    }
    if (i % 2 === 0) {
      if (i / 2 < 10) {
        arr.push(`0${i / 2}:00`)
      } else {
        arr.push(`${i / 2}:00`)
      }
      flag = i / 2
    } else {
      if (i / 2 < 10) {
        arr.push(`0${flag}:30`)
      } else {
        arr.push(`${flag}:30`)
      }
    }
  }
  return arr
}

export default {
  name: 'VideoTree',
  components: {
    hostList,
    Pie
  },
  data() {
    return {
      treeType: 3,
      subSystem: 2,
      clickIndex: 1,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      keyWord: '',
      options: {
        wdith: '100%',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          fontSize: fontSize(0.12),
          textStyle: {
            fontFamily: 'Microsoft YaHei'
          }
        },
        graphic: [
          {
            // 图形中间文字
            type: 'text',
            left: 'center',
            top: '42%',
            style: {
              text: '总数',
              textAlign: 'center',
              fill: '#fff',
              fontSize: fontSize(0.2),
              fontFamily: 'Microsoft YaHei'
            }
          },
          {
            type: 'text',
            left: 'center',
            top: '52%',
            style: {
              text: '886',
              textAlign: 'center',
              fill: '#fff',
              fontSize: fontSize(0.35),
              fontWeight: 800,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],
        series: [
          {
            selectedMode: 'single',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              // 展示文本设置
              normal: {
                //  饼状图折线展示外部
                show: true, // 展示
                position: 'top', // outside表示文本显示位置为外部
                formatter: '{font|{b}}{num|{c}}{font|条}',
                rich: {
                  num: {
                    color: 'white',
                    fontSize: fontSize(0.24),
                    fontWeight: 'bold',
                    fontFamily: 'Microsoft YaHei'
                  },
                  font: {
                    color: '#00AEEF',
                    fontSize: fontSize(0.24),
                    fontWeight: 'bold',
                    fontFamily: 'Microsoft YaHei'
                  },
                  x: {
                    color: '#00AEEF',
                    fontSize: fontSize(0.24),
                    fontWeight: 'bold',
                    fontFamily: 'Microsoft YaHei'
                  }
                }
              }
            },

            data: [
              {
                value: 679,
                name: '已处理',
                itemStyle: { color: '#F87E2D' },
                label: { normal: { show: false, position: 'center' } },
                labelLine: { show: false }
              },
              { value: 335, name: '待处理', itemStyle: { color: '#00AEEF' } }
            ]
          }
        ]
      },
      value: '',
      hostDatas: {
        wdith: '100%',
        height: '70%',
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontFamily: 'Microsoft YaHei'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: computeTime(),
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            }
          },
          axisTick: {
            // y轴刻度线
            show: false
          }
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '-1%',
          top: '10%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(159,231,255,0.3)'],
              type: 'solid'
            }
          },
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            }
          },
          axisTick: {
            // y轴刻度线
            show: false
          }
        },
        series: [
          {
            color: '#00FFA2',
            smooth: true,
            // symbol: 'none',
            symbolSize: 10,
            data: [0],
            type: 'line',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(0,255,162,1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,255,162,0)'
                  }
                ])
              }
            }
          }
        ]
      },
      hostData: [
        {
          wdith: '100%',
          height: '70%',
          color: ['#3398DB'],
          grid: {
            left: '3%',
            right: '6%',
            bottom: '-1%',
            top: '10%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            },
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'none', // 默认为直线，可选为：'line' | 'shadow',
              color: 'red'
            }
          },
          // dataZoom: [{
          //   type: 'inside',
          //   start: 0,
          //   end: 50,
          //   height: 5,
          //   show: false
          // }, {
          //   start: 0,
          //   end: 100,
          //   show: false,
          // }],

          xAxis: {
            type: 'category',
            data: ['总行'],
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            axisLabel: {
              // interval: 0,
              // rotate: 30,
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              },
              formatter: function(params) {
                let newParamsName = ''
                let paramsNameNumber = params.length
                let provideNumber = 5 // 一行显示几个字
                let rowNumber = Math.ceil(paramsNameNumber / provideNumber)
                if (paramsNameNumber > provideNumber) {
                  for (let p = 0; p < rowNumber; p++) {
                    let tempStr = ''
                    let start = p * provideNumber
                    let end = start + provideNumber
                    if (p === rowNumber - 1) {
                      tempStr = params.substring(start, paramsNameNumber)
                    } else {
                      tempStr = params.substring(start, end) + '\n'
                    }
                    newParamsName += tempStr
                  }
                } else {
                  newParamsName = params
                }
                return newParamsName
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
                color: ['rgba(159,231,255,0.3)'],
                type: 'solid'
              }
            },
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            },
            axisTick: {
              // y轴刻度线
              show: false
            }
          },
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
            {
              name: '',
              type: 'bar',
              barWidth: '10%',
              color: '#00AEEF',
              itemStyle: {
                barBorderRadius: [5, 5, 0, 0]
              },
              data: [0]
            }
          ]
        },
        {
          wdith: '100%',
          height: '70%',
          grid: {
            left: '3%',
            right: '6%',
            bottom: '-1%',
            top: '10%',
            containLabel: true
          },
          legend: {
            icon: 'rect',
            orient: 'vertical',
            itemHeight: 10,
            itemWidth: 10,
            itemGap: 3,
            top: 0,
            borderRadius: 0,
            right: 10,
            axisLabel: {
              interval: 1
            },
            textStyle: {
              fontSize: 7,
              color: 'white',
              fontFamily: 'Microsoft YaHei'
            },
            selectedMode: false
          },
          tooltip: {
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          },
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  width: 0
                }
              },
              // min: -1,
              boundaryGap: false,
              axisLabel: {
                // interval: 0,
                // rotate: 40,
                show: true,
                textStyle: {
                  color: 'rgba(222, 241, 255, 1)',
                  fontFamily: 'Microsoft YaHei'
                },
                formatter: function(params) {
                  let newParamsName = ''
                  let paramsNameNumber = params.length
                  let provideNumber = 4 // 一行显示几个字
                  let rowNumber = Math.ceil(paramsNameNumber / provideNumber)
                  if (paramsNameNumber > provideNumber) {
                    for (let p = 0; p < rowNumber; p++) {
                      let tempStr = ''
                      let start = p * provideNumber
                      let end = start + provideNumber
                      if (p === rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber)
                      } else {
                        tempStr = params.substring(start, end) + '\n'
                      }
                      newParamsName += tempStr
                    }
                  } else {
                    newParamsName = params
                  }
                  return newParamsName
                }
              },
              axisTick: {
                // y轴刻度线
                show: false
              },
              data: ['sdf', 'fgh', 'rty', 'dfg', 'ert']
            },
            { type: 'value' }
          ],
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            },
            axisTick: {
              // y轴刻度线
              show: false
            },
            // 网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(159,231,255,0.3)'],
                type: 'solid'
              }
            }
          },
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
            {
              type: 'bar',
              barWidth: '8%',
              name: '今日',
              color: '#FF522A',
              barGap: 0,
              textStyle: {
                fontFamily: 'Microsoft YaHei'
              },
              itemStyle: {
                barBorderRadius: [5, 5, 0, 0]
              },
              data: [12, 73, 34, 45, 56]
            },
            {
              type: 'bar',
              barWidth: '8%',
              name: '昨日',
              color: '#FFCA2A',
              textStyle: {
                fontFamily: 'Microsoft YaHei'
              },
              itemStyle: {
                barBorderRadius: [5, 5, 0, 0]
              },
              data: [34, 54, 37, 45, 50]
            },
            {
              type: 'line',
              color: '#FF522A',
              // xAxisIndex: 1,
              data: [12, 73, 34, 45, 56],
              tooltip: {
                show: false
              },
              markPoint: {
                symbol:
                  'image://http://img30.360buyimg.com/poprx/jfs/t23662/172/668395134/12944/5653b1ff/5b3c2737N3d867c2f.png',
                symbolSize: [30, 20], // 容器大小
                symbolOffset: [0, -15], // 位置偏移
                tooltip: {
                  show: false
                },
                data: [{ coord: [27, 12] }, { coord: [55.5, 73] }, { coord: [84, 34] }, { coord: [112.5, 45] }],
                label: {
                  offset: [0, -2],
                  color: '#ffffff',
                  formatter: function(value) {
                    return value.data.coord[1]
                  }
                }
              }
            }
          ]
        },
        {
          wdith: '100%',
          height: '70%',
          grid: {
            left: '3%',
            right: '6%',
            bottom: '-1%',
            top: '10%',
            containLabel: true
          },
          // 标题配置信息
          textStyle: {
            fontFamily: 'Microsoft YaHei',
            color: '#fff',
            fontSize: '10px'
          },
          xAxis: {
            show: true,
            type: 'category',
            data: ['入侵报警', '紧急报警', '门禁报警', '设备异常', '防护舱报警', '主机报警', '事件提'],
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            },
            axisTick: {
              // y轴刻度线
              show: false,
              length: 50
            }
          },
          yAxis: {
            show: true,
            type: 'value',
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            },
            axisTick: {
              // y轴刻度线
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(159,231,255,0.3)'],
                type: 'solid'
              }
            }
          },
          // //柱状图上显示数据

          tooltip: {
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'custom',
              label: {
                normal: {
                  //   show: true,
                  position: 'top',
                  color: '#000',
                  //   fontWeight: 'bolder',
                  // backgroundColor: "auto",
                  //   fontSize: '10',
                  formatter: '123'
                }
              },
              encode: {
                x: 0, // 表示维度 映射到 x 轴。
                y: 1, // 表示维度  映射到 y 轴。
                tooltip: 0 // 表示维度  会在 tooltip 中显示。
              },
              renderItem: function(params, api) {
                let location = api.coord([api.value(0), api.value(1)])
                return {
                  type: 'group',
                  children: [
                    {
                      type: 'MyCubeRect',
                      shape: {
                        api,
                        xValue: api.value(0),
                        yValue: api.value(1),
                        x: location[0],
                        y: location[1]
                      },
                      style: {
                        fill: '#5AD8A6'
                      }
                    },
                    {
                      type: 'MyCubeShadow',
                      shape: {
                        api,
                        xValue: api.value(0),
                        yValue: api.value(1),
                        x: location[0],
                        y: location[1]
                      },
                      style: {
                        fill: '#2DCF8E'
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      ],
      selectProp: {
        lazy: true,
        // checkStrictly: true,
        lazyLoad: this.getSelect
      },
      btn1: 0, // 重点部位统计分析
      btn2: 0, // 区域统计分析
      newOptions: {
        roam: false, // 禁止滚轮事件
        tooltip: {
          // show: false,
        },
        wdith: '100%',
        height: '70%',
        grid: {
          left: '3%',
          right: '6%',
          bottom: '-1%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLabel: {
            show: true,
            // interval: 0,
            // rotate: 40,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            },
            formatter: function(params) {
              let newParamsName = ''
              let paramsNameNumber = params.length
              let provideNumber = 5 // 一行显示几个字
              let rowNumber = Math.ceil(paramsNameNumber / provideNumber)
              if (paramsNameNumber > provideNumber) {
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = ''
                  let start = p * provideNumber
                  let end = start + provideNumber
                  if (p === rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr
                }
              } else {
                newParamsName = params
              }
              return newParamsName
            }
          },
          axisTick: {
            // y轴刻度线
            show: false
          },
          // 网格样式
          splitLine: {
            show: false,
            lineStyle: {
              color: ['rgba(159,231,255,0.3)'],
              type: 'solid'
            }
          },
          data: []
        },
        yAxis: {
          show: true,
          type: 'value',
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            }
          },
          axisTick: {
            // y轴刻度线
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(159,231,255,0.3)'],
              type: 'solid'
            }
          }
        },

        series: [
          {
            data: [],
            type: 'bar',
            // barWidth: 10,
            // barGap: 200,
            barCategoryGap: 200,
            tooltip: {
              show: true
            },
            label: {
              show: true, // 柱子顶部的数值
              position: 'top',
              top: 0,
              fontSize: 12,
              offset: [0, 0],
              fontFamily: 'Microsoft YaHei',
              color: 'white'
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: '#1C4E64' // 0% 处的颜色
                    },
                    {
                      offset: 0.5,
                      color: '#2297A1' // 50% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#28D4D5' // 100% 处的颜色
                    }
                  ],
                  false
                )
              }
            },
            barGap: 0
          },
          {
            type: 'bar',
            barWidth: 4,
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: '#1C4E64' // 0% 处的颜色
                    },
                    {
                      offset: 0.5,
                      color: '#2297A1' // 50% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#28D4D5' // 100% 处的颜色
                    }
                  ],
                  false
                )
              }
            },
            // barGap: 0,
            data: []
          },
          {
            tooltip: {
              show: false
            },
            type: 'pictorialBar',
            itemStyle: {
              borderWidth: 0,
              borderColor: '#47A6FF',
              color: '#28D4D5',
              fontFamily: 'Microsoft YaHei'
            },
            symbol: 'path://M 0,0 l 120,0 l -30,60 l -120,0 z',
            symbolSize: ['13', '3'],
            symbolOffset: ['-1', '-2'], // 左右 ，上下
            symbolRotate: 0,
            symbolPosition: 'end',
            data: [],
            z: 3
          }
        ]
      }
    }
  },
  async created() {
    // const timeData = {
    //   startTime: this.$moment(new Date()).format('YYYY-MM-DD 00:00:00'),
    //   endTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // }
    const timeData = {
      startTime: new Date(new Date().toLocaleDateString()).getTime() / 1000,
      endTime: parseInt(new Date().getTime() / 1000)
    }

    // 报警数量
    await this.getAlarmCount(timeData)

    // 重点部位报警统计分析
    await this.getAlarmPortantCount(timeData)

    // 报警种类同比数量分析
    await this.getAlarmDayAndYestCount()

    // 报警区域对比
    await this.getAlarmAddressCount(timeData)

    await this.getAlarmAllCount({ type: 1 }).then(res => {
      console.log(res)
      this.hostDatas.series[0].data = res.data.data.tt
      if (res.data.data.tt.length < 12) {
        this.hostDatas.xAxis.data = computeTime(true)
      } else {
        this.hostDatas.xAxis.data = res.data.data.time
      }
    })
  },
  mounted() {
    this.hostData[1].xAxis[1] = {
      type: 'value',
      max: this.hostData[1].xAxis[0].data.length * 28.5,
      show: false
    }
    this.hostData[1].series[2].data = this.hostData[1].series[2].data.map((x, i) => [27 + i * 28.5, x])
  },
  updated() {},
  watch: {
    alarmCount() {
      this.options.graphic[1].style.text = this.alarmCount.alarmInfoTotal

      this.options.series[0].data[0].value = this.alarmCount.done
      this.options.series[0].data[1].value = this.alarmCount.toDo

      this.$refs.total_pie.drawLine(this.options)
    },
    countPortant() {
      this.hostData[0].xAxis.data = this.sliceArr(this.countPortant.name, 0, 6)
      this.hostData[0].series[0].data = this.sliceArr(this.countPortant.count, 0, 6)
    },
    countDayAndYesterday() {
      const pointAarr = []
      this.countDayAndYesterday.todayCount.forEach((item, index) => {
        pointAarr.push({
          value: item,
          xAxis: this.countDayAndYesterday.nameArr[index],
          yAxis: item
        })
      })

      const options = {
        wdith: '100%',
        height: '70%',
        grid: {
          left: '3%',
          right: '6%',
          bottom: '-1%',
          top: '10%',
          containLabel: true
        },
        legend: {
          icon: 'rect',
          orient: 'vertical',
          itemHeight: 10,
          itemWidth: 10,
          itemGap: 3,
          top: 0,
          borderRadius: 0,
          right: 10,
          axisLabel: {
            interval: 1
          },
          textStyle: {
            fontSize: 7,
            color: 'white',
            fontFamily: 'Microsoft YaHei'
          },
          selectedMode: false
        },
        tooltip: {
          textStyle: {
            fontFamily: 'Microsoft YaHei'
          }
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            // min: -1,
            boundaryGap: false,
            axisLabel: {
              interval: 0,
              rotate: 40,
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            },
            axisTick: {
              // y轴刻度线
              show: false
            },
            data: this.countDayAndYesterday.nameArr
          },
          { type: 'value' }
        ],
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            }
          },
          axisTick: {
            // y轴刻度线
            show: false
          },
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(159,231,255,0.3)'],
              type: 'solid'
            }
          }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barWidth: '8%',
            barGap: 0,
            name: '今日',
            color: '#FF522A',
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            },
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            },
            data: this.countDayAndYesterday.todayCount
          },
          {
            type: 'bar',
            barWidth: '8%',
            name: '昨日',
            color: '#FFCA2A',
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            },
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            },
            data: this.countDayAndYesterday.yesterdayCount
          },
          {
            type: 'line',
            color: '#FF522A',
            data: this.countDayAndYesterday.todayCount,
            tooltip: {
              show: false
            },
            markPoint: {
              symbol:
                'image://http://img30.360buyimg.com/poprx/jfs/t23662/172/668395134/12944/5653b1ff/5b3c2737N3d867c2f.png',
              // symbolSize: [30, 20], // 容器大小
              symbolSize: (value, params) => {
                if (value.toString().length > 4) {
                  return [(value.toString().length - 4) * 10 + 30, 20]
                }
                return [30, 20]
              },
              symbolOffset: [0, -15], // 位置偏移
              tooltip: {
                show: true,
                trigger: 'axis'
                // formatter: '{a}\n{c}'
              },
              data: pointAarr,
              label: {
                offset: [0, -2],
                color: '#ffffff',
                formatter: function(value) {
                  return value.data.coord[1]
                }
              }
            }
          }
        ]
      }

      this.$nextTick(() => {
        this.$refs.refDataAlarm.forEach((item, index) => {
          if (index === 1) {
            item.drawLine(options)
          }
        })
      })
    },
    countAddress() {
      this.newOptions.xAxis.data =
        this.sliceArr(this.countAddress.name, 0, 6).length > 0 ? this.sliceArr(this.countAddress.name, 0, 6) : ['总行']
      this.newOptions.series[0].data =
        this.sliceArr(this.countAddress.count, 0, 6).length > 0 ? this.sliceArr(this.countAddress.count, 0, 6) : [0]
      this.newOptions.series[1].data = this.sliceArr(
        this.countAddress.count.map(item => (item === 0 ? 0 : item + 0.5)),
        0,
        6
      )
      this.newOptions.series[2].data =
        this.sliceArr(this.countAddress.count, 0, 6).length > 0 ? this.sliceArr(this.countAddress.count, 0, 6) : [0]
    }
  },
  computed: {
    ...mapState('bigAlarmData', {
      alarmCount: state => state.countObj,
      countPortant: state => state.countPortant,
      countDayAndYesterday: state => state.countDayAndYesterday,
      countAddress: state => state.countAddress
    })
  },
  methods: {
    ...mapActions('bigAlarmData', [
      'getAlarmCount',
      'getAlarmPortantCount',
      'getAlarmDayAndYestCount',
      'getAlarmAddressCount'
    ]),
    getSelect(node, resolve) {
      const payload = {
        type: this.treeType,
        subSystem: this.subSystem
      }
      if (node.data) {
        payload.oId = node.data.value
      }
      getTreeApi(payload).then(res => {
        const nodes = res.data.data.nodes
        const resObj = nodes.map(item => ({
          value: item.id,
          label: item.name
        }))
        resolve(resObj)
      })
    },
    getAlarmAllCount(params) {
      return alarmAllCountApi(params)
    },
    toggle(index) {
      this.clickIndex = index
      this.getAlarmAllCount({ type: index }).then(res => {
        this.hostDatas.series[0].data = res.data.data.tt
        if (index >= 2) {
          this.hostDatas.xAxis.data = res.data.data.time
        } else {
          if (res.data.data.tt.length < 12) {
            this.hostDatas.xAxis.data = computeTime(true)
          } else {
            this.hostDatas.xAxis.data = res.data.data.time
          }
        }
      })
    },
    handleNodeClick(data) {
      console.log(data)
    },
    sliceArr(arr, start, value) {
      const Xdata = []
      arr.forEach((item, index) => {
        if (index < start + value && index >= start) {
          Xdata.push(item)
        }
      })
      return Xdata
    },
    moveLeft() {
      if (this.btn1 > 0) {
        this.btn1--
        this.hostData[0].xAxis.data = this.sliceArr(this.countPortant.name, this.btn1, 6)
        this.hostData[0].series[0].data = this.sliceArr(this.countPortant.count, this.btn1, 6)
      }
    },
    moveRight() {
      const arrlength = this.countPortant.name.length
      if (arrlength > 6 + this.btn1) {
        this.btn1++
        this.hostData[0].xAxis.data = this.sliceArr(this.countPortant.name, this.btn1, 6)
        this.hostData[0].series[0].data = this.sliceArr(this.countPortant.count, this.btn1, 6)
      }
    },
    moveLeftbtn() {
      if (this.btn2 > 0) {
        this.btn2--
        this.newOptions.xAxis.data = this.sliceArr(this.countAddress.name, this.btn2, 6)
        this.newOptions.series[0].data = this.sliceArr(this.countAddress.count, this.btn2, 6)
        this.newOptions.series[1].data = this.sliceArr(
          this.countAddress.count.map(item => (item === 0 ? 0 : item + 0.5)),
          this.btn2,
          6
        )
        this.newOptions.series[2].data = this.sliceArr(this.countAddress.count, this.btn2, 6)
      }
    },
    moveRightbtn() {
      const arrlength = this.countAddress.name.length
      if (arrlength > 6 + this.btn2) {
        this.btn2++
        this.newOptions.xAxis.data = this.sliceArr(this.countAddress.name, this.btn2, 6)
        this.newOptions.series[0].data = this.sliceArr(this.countAddress.count, this.btn2, 6)
        this.newOptions.series[1].data = this.sliceArr(
          this.countAddress.count.map(item => (item === 0 ? 0 : item + 0.5)),
          this.btn2,
          6
        )
        this.newOptions.series[2].data = this.sliceArr(this.countAddress.count, this.btn2, 6)
      }
    },
    beforeunloadHandler() {}
  }
}
</script>
<style lang="less" scoped>
/deep/ * {
  font-family: '微软雅黑';
}
.select {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-top: 0.5rem;
  background: none;
  display: flex;
  justify-content: flex-end;
  .select-count {
    // width: 24%;
    float: right;
    display: flex;
    justify-content: space-between;
    /deep/.el-select .el-input .el-select__caret {
      color: #68a7fd;
    }
  }
  .search-box {
    margin-left: 1vw;
    /deep/.el-input .el-input__suffix {
      color: #68a7fd;
    }
  }

  /deep/.el-input__inner {
    background: none;
    border-radius: 0;
    height: 2vw;
    border: 1px solid rgba(105, 169, 255, 1);

    font-size: 0.9vw;
    font-weight: 400;
    color: #ffffff;
    &::placeholder {
      font-style: italic;
      color: #68a7fd;
    }

    &::-webkit-input-placeholder {
      /* WebKit browsers 适配谷歌 */
      font-style: italic;
      color: #68a7fd;
    }

    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 适配火狐 */
      font-style: italic;
      color: #68a7fd;
    }

    &::-moz-placeholder {
      /* Mozilla Firefox 19+ 适配火狐 */
      font-style: italic;
      color: #68a7fd;
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10+  适配ie*/
      font-style: italic;
      color: #68a7fd;
    }
  }
}
#warningData {
  width: 100%;
  height: calc(~'100% - 70px');
  padding: 0 2rem;
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  flex-direction: column;
  p {
    font-size: 0.9vw;
    text-align: center;
    line-height: 2.4vw;
  }
  .grey {
    font-size: 1.5vw;
    font-weight: 700;
    color: #a8a1b4;
    span {
      font-size: 1.2vw;
    }
    .big-red {
      font-size: 2vw;
    }
  }
  .select {
    height: 5%;
    // border: 1px solid rgb(56,93,125);
  }
  .warningInfo {
    height: 7.36%;
    //  border: 1px solid rgb(56,93,125);
    display: flex;
    color: #99a0b2;

    ul {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    li:nth-of-type(1) .left {
      background: #ff2337;
    }
    li:nth-of-type(2) .left {
      background: #ff7800;
    }
    li:nth-of-type(3) .left {
      background: #ecba21;
    }
    li:nth-of-type(4) .left {
      background: #2d72d3;
    }
    li:nth-of-type(5) .left {
      background: rgba(172, 91, 218, 1);
    }
    li:nth-of-type(6) {
      width: 42.2%;
      border: none;
    }
    ul li {
      float: left;
      border: 1px solid rgba(18, 87, 201, 1);
      // box-shadow: 0px 0px 2px 1px rgba(105, 169, 255, 0.9);
      width: 9.77%;
      height: 100%;
      text-align: center;

      .right {
        float: left;
        font-size: 0;
        height: 100%;
        line-height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        p {
          width: 100%;
          color: white;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          font-size: 1.49vw;
        }
        @media screen and (min-width: 4000px) {
          p {
            font-size: 1.49vw;
          }
        }
      }
      .left {
        float: left;
        width: 33%;
        height: 100%;
        line-height: 100%;
        text-align: center;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        img {
          width: 28.88%;
          margin-top: 20%;
        }
        p {
          font-family: 'Microsoft YaHei';
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          font-size: 0.34vw;
          display: block;
          line-height: 100%;
          margin-top: 10%;
        }
        @media screen and (min-width: 4000px) {
          p {
            font-size: 0.68vw;
          }
        }
      }

      .right {
        width: 67%;
      }
    }
    #toral {
      width: 100%;
      display: flex;
      height: 100%;
      line-height: 100%;
      justify-content: space-around;
      .item {
        width: 45%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ff2337;
        font-size: 1.92vw;
        font-weight: bold;
        span {
          color: #ffffff;
          font-size: 0.69vw;
          font-weight: bold;
          margin-right: 1rem;
        }
      }

      @media screen and (min-width: 4000px) {
        .item {
          font-size: 1.92vw;
          span {
            font-size: 1.38vw;
          }
        }
      }
    }
  }
  .waringTotal {
    height: 36.5%;

    display: flex;
    div {
      height: 100%;
    }
    .Total {
      width: 66%;
      border: 1px solid rgba(255, 255, 255, 0.5);
      position: relative;
      .line-title {
        font-size: 0.38vw;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        color: rgba(222, 241, 255, 1);
      }
      @media screen and (min-width: 4000px) {
        p {
          font-size: 0.77vw;
        }
      }
      .button-list {
        position: absolute;
        right: 2%;
        top: 6%;
        height: 8.5%;
        width: 10.68%;
        font-size: 0;
        font-weight: 700;
        overflow: hidden;
        border-radius: 2px;
        z-index: 99;
        button {
          background: rgba(228, 11, 11, 0);
          border: 1px solid rgba(105, 169, 255, 1);
          padding: 0.4%;
          height: 100%;
          width: 33.3%;
          font-size: 0.51vw;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
        }
        button.active {
          background: rgba(45, 114, 211, 1);
        }
      }
    }
    .totalpie {
      width: 32%;
      margin-left: 2%;
      // border: 1px solid rgba(255, 255, 255, 0.5);
    }
  }
  .contrast {
    height: 40%;
    // border: 1px solid rgb(56,93,125);
    display: flex;
    justify-content: space-between;

    .itme-list {
      width: 32%;
      height: 100%;
      border: 1px solid rgba(255, 255, 255, 0.5);
      position: relative;
      // padding-top: 1vw;
      p {
        font-size: 0.38vw;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        color: rgba(222, 241, 255, 1);
      }
      @media screen and (min-width: 4000px) {
        p {
          font-size: 0.76vw;
        }
      }
      .left_btn {
        width: 2.15vw;
        max-width: 46px;
        height: 1.5vh;
        line-height: 1.5vh;
        font-size: 1.5vh;
        background: rgba(255, 255, 255, 0);
        border: 1px solid rgba(105, 169, 255, 1);
        border-radius: 2px;
        position: absolute;
        z-index: 99;
        bottom: 2.6vh;
        left: 1%;
        color: rgba(105, 169, 255, 1);
        text-align: center;
        cursor: pointer;
      }
      .right_btn {
        width: 2.15vw;
        max-width: 46px;
        height: 1.5vh;
        line-height: 1.5vh;
        font-size: 1.5vh;
        background: rgba(255, 255, 255, 0);
        border: 1px solid rgba(105, 169, 255, 1);
        border-radius: 2px;
        position: absolute;
        z-index: 99;
        bottom: 2.6vh;
        right: 1%;
        color: rgba(105, 169, 255, 1);
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
