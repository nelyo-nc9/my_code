<template>
  <div id="myChartChina" @dblclick="dblclick"></div>
</template>
<style lang="less" scoped>
#myChartChina {
  height: 90%;
  width: 100%;
}
</style>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import 'echarts-gl'
// 引入 全国、省份地图数据
import china from 'echarts/map/json/china.json'

export default {
  data() {
    return {
      polar: {
        width: '90%',
        height: '100%',
        title: {
          // 标题
          top: '5%',

          // text: '中国地图',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#ccc'
          }
        },

        tooltip: {
          // 提示框
          trigger: 'item',
          formatter: function(params) {
            return `<div style="" id="layer" > 
            <b>${params.name}</b>
                <ul style="width: 6rem;
              font-size: 0.6rem;">
                  <li style=" 
                  line-height: 30%;">
                    <span class="left" style="float: left;
                    text-align: right;
                    display: block;
                    width: 50%;">重点部位总数</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">2323</span>
                  </li>
                 
                </ul>
              </div>`
            /* `<div style="height:310px;" id="layer" > 
            <h3>${params.name}</h3>
                <ul style="width: 229px;
              font-size: 18px;">
                  <li style=" height: 40px;
                  line-height: 40px;">
                    <span class="left" style="   float: left;
                    text-align: right;
                    display: block;
                    width: 50%;">重点部位总数</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">2323</span>
                  </li>
                  <li style=" height: 40px;
                  line-height: 40px;">
                    <span class="left" style="   float: left;
                    text-align: right;
                    display: block;
                    width: 50%;">营业网点</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">12</span>
                  </li>
                  <li style=" height: 40px;
                  line-height: 40px;">
                    <span class="left" style="   float: left;
                    text-align: right;
                    display: block;
                    width: 50%;">重点部位总数</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">2323</span>
                  </li>
                  <li style=" height: 40px;
                  line-height: 40px;">
                    <span class="left" style="   float: left;
                    text-align: right;
                    display: block;
                    width: 50%;"> 办公楼</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">3</span>
                  </li>
                  <li style=" height: 40px;
                  line-height: 40px;">
                    <span class="left" style="   float: left;
                    text-align: right;
                    display: block;
                    width: 50%;">计算机房</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">34</span>
                  </li>
                  <li style=" height: 40px;
                  line-height: 40px;">
                    <span class="left" style="   float: left;
                    text-align: right;
                    display: block;
                    width: 50%;">监控中心</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">788</span>
                  </li>
                <li style=" height: 40px;
                  line-height: 40px;">
                    <span class="left" style="   float: left;
                    text-align: right;
                    display: block;
                    width: 50%;">私人银行</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">12</span>
                  </li>
                <li style=" height: 40px;
                  line-height: 40px;">
                    <span class="left" style="   float: left;
                    text-align: right;
                    display: block;
                    width: 50%;">金库</span>
                    <span class="right" style=" float: right;
                    text-align: left;
                    display: block;
                    width: 30%;">56</span>
                  </li>
                </ul>
              </div>` */
          }
        },
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
            interval: 1
          },

          textStyle: {
            fontSize: 10,
            color: 'white',
            padding: [6, 0, 0, 0]
          }
        },
        //地理坐标系组件。地理坐标系组件用于地图的绘制，支持在地理坐标系上绘制散点图，线集。
        geo: {
          show: true,
          map: 'tongren',
          roam: true,
          top: 10,
          left: '2%',
          zoom: 1,
          aspectScale: 0.9,
          itemStyle: {
            normal: {
              opacity: 1, //图形透明度 0 - 1
              borderColor: '#0e3c6d', //图形的描边颜色
              borderWidth: 2, //描边线宽。为 0 时无描边。
              borderType: 'solid', //柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
              areaColor: 'rgba(11, 28, 63, 0.8)', //图形的颜色 #eee
              areaColor: '#0063cc' //图形的颜色 #eee
            }
          }
        },
        series: [
          {
            name: '离线',
            type: 'scatter',
            coordinateSystem: 'geo',
            map: 'tongren',
            symbol: 'pin', //气泡
            symbolSize: function(val) {
              return 50
            },
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return params.data.value[2]
                },
                textStyle: {
                  color: '#fff',
                  fontSize: 9
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'red' //标志颜色'#F62157'
              }
            },
            zlevel: 6,

            data: [{ name: '河南', value: [113.665412, 34.757975, ''] }]
          },

          {
            selectedMode: 'single',
            name: '在线',
            type: 'scatter',
            coordinateSystem: 'geo',
            map: 'tongren',
            symbol: 'pin', //气泡
            symbolSize: function(val) {
              return 30
            },

            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return params.data.value[2]
                },
                textStyle: {
                  color: '#fff',
                  fontSize: 9
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'yellow' //标志颜色'#F62157'
              }
            },
            zlevel: 6,
            markPoint: {
              symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
              itemStyle: {
                normal: {
                  borderColor: '#87cefa',
                  borderWidth: 0, // 标注边线线宽，单位px，默认为1
                  label: {
                    show: false
                  }
                },
                emphasis: {
                  borderColor: '#1e90ff',
                  borderWidth: 5,
                  label: {
                    show: false
                  }
                }
              }
            },
            //自定义图片的 路径(注：必须以image://开头)
            // symbol: `image://../../../../static/bigData/list-bg.png`,
            data: [{ name: '北京', value: [116.46899700000002, 40.25661520748841, ''] }]
          },
          {
            selectedMode: 'single',
            name: '设备总数',
            type: 'scatter',
            coordinateSystem: 'geo',
            map: 'tongren',
            symbol: 'pin', //气泡
            symbolSize: function(val) {
              return 30
            },

            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return params.data.value[2]
                },
                textStyle: {
                  color: '#fff',
                  fontSize: 9
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'orange' //标志颜色'#F62157'
              }
            },
            zlevel: 6,
            markPoint: {
              symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
              itemStyle: {
                normal: {
                  borderColor: '#87cefa',
                  borderWidth: 0, // 标注边线线宽，单位px，默认为1
                  label: {
                    show: false
                  }
                },
                emphasis: {
                  borderColor: '#1e90ff',
                  borderWidth: 5,
                  label: {
                    show: false
                  }
                }
              }
            },
            //自定义图片的 路径(注：必须以image://开头)
            // symbol: `image://../../../../static/bigData/list-bg.png`,
            data: [{ name: '张家口', value: [115.14495849609376, 40.863679665481676, ''] }]
          },
          {
            selectedMode: 'single',
            name: '网点分布总数量',
            type: 'scatter',
            coordinateSystem: 'geo',
            map: 'tongren',
            symbol: 'pin', //气泡
            symbolSize: function(val) {
              return 30
            },

            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return params.data.value[2]
                },
                textStyle: {
                  color: '#fff',
                  fontSize: 9
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'blue' //标志颜色'#F62157'
              }
            },
            zlevel: 6,
            markPoint: {
              symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
              itemStyle: {
                normal: {
                  borderColor: '#87cefa',
                  borderWidth: 0, // 标注边线线宽，单位px，默认为1
                  label: {
                    show: false
                  }
                },
                emphasis: {
                  borderColor: '#1e90ff',
                  borderWidth: 5,
                  label: {
                    show: false
                  }
                }
              }
            },
            //自定义图片的 路径(注：必须以image://开头)lat=&lng=&zoom=9
            // symbol: `image://../../../../static/bigData/list-bg.png`,
            data: [{ name: '周口', value: [114.8728005, 33.697287078755245, ''] }]
          },
          {
            selectedMode: 'single',
            name: '机构分布总数量',
            type: 'scatter',
            coordinateSystem: 'geo',
            map: 'tongren',
            symbol: 'pin', //气泡
            symbolSize: function(val) {
              return 30
            },

            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return params.data.value[2]
                },
                textStyle: {
                  color: '#fff',
                  fontSize: 9
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'green' //标志颜色'#F62157'
              }
            },
            zlevel: 6,
            markPoint: {
              symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
              itemStyle: {
                normal: {
                  borderColor: '#87cefa',
                  borderWidth: 0, // 标注边线线宽，单位px，默认为1
                  label: {
                    show: false
                  }
                },
                emphasis: {
                  borderColor: '#1e90ff',
                  borderWidth: 5,
                  label: {
                    show: false
                  }
                }
              }
            },
            //自定义图片的 路径(注：必须以image://开头)
            // symbol: `image://../../../../static/bigData/list-bg.png`,
            data: [{ name: '盘锦', value: [122.070714, 41.119997, ''] }]
          }
        ]
      },
      myChartChina: null
    }
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    // 双击返回全国地图
    dblclick(e) {
      this.myChartChina.clear()
      echarts.registerMap('tongren', china)
      this.polar.series[0].map = 'tongren'
      this.myChartChina.setOption(this.polar)
    },
    drawLine() {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      var myChartContainer = document.getElementById('myChartChina')
      var myChartChina = echarts.init(myChartContainer)

      // 注册地图名字(tongren)和数据(china)
      echarts.registerMap('tongren', china)
      _this.myChartChina = myChartChina
      // h设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，ECharts 会合并新的参数和数据，然后刷新图表。
      myChartChina.setOption(_this.polar)
      // 单击进入省级地图
      window.addEventListener('resize', () => {
        myChartChina.resize()
      })
    }
  }
}
</script>