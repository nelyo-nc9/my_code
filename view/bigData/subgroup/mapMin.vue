
<template>
  <div id="body">
    <div id="myChartChina"></div>
  </div>
</template>
<style lang="less" scoped>
#body {
  height: 100%;
  width: 100%;
  position: relative;
  #myChartChina {
    height: 100%;
    width: 100%;
  }
}
</style>
<script>
import 'echarts-gl'
// 引入 全国、省份地图数据
import china from 'echarts/map/json/china.json'
import 'echarts/map/js/province/anhui.js'
import 'echarts/map/js/province/aomen.js'
import 'echarts/map/js/province/beijing.js'
import 'echarts/map/js/province/chongqing.js'
import 'echarts/map/js/province/fujian.js'
import 'echarts/map/js/province/gansu.js'
import 'echarts/map/js/province/guangdong.js'
import 'echarts/map/js/province/guangxi.js'
import 'echarts/map/js/province/guizhou.js'
import 'echarts/map/js/province/hainan.js'
import 'echarts/map/js/province/hebei.js'
import 'echarts/map/js/province/heilongjiang.js'
import 'echarts/map/js/province/henan.js'
import 'echarts/map/js/province/jiangsu.js'
import 'echarts/map/js/province/jiangxi.js'
import 'echarts/map/js/province/jilin.js'
import 'echarts/map/js/province/liaoning.js'
import 'echarts/map/js/province/neimenggu.js'
import 'echarts/map/js/province/ningxia.js'
import 'echarts/map/js/province/qinghai.js'
import 'echarts/map/js/province/shandong.js'
import 'echarts/map/js/province/shanghai.js'
import 'echarts/map/js/province/shanxi.js'
import 'echarts/map/js/province/sichuan.js'
import 'echarts/map/js/province/taiwan.js'
import 'echarts/map/js/province/tianjin.js'
import 'echarts/map/js/province/xianggang.js'
import 'echarts/map/js/province/xizang.js'
import 'echarts/map/js/province/xinjiang.js'
import 'echarts/map/js/province/yunnan.js'
import 'echarts/map/js/province/zhejiang.js'
import 'echarts/map/js/province/hunan.js'

// import cities from 'echarts/map/json/china-cities.json'
// import cities from 'echarts/map/json/china-contour.json'
// const jsons = require('../../../../static/bigData/geoinfo-all.json')
// console.log(jsons)

import { getH5StaticJson } from './test'

// import { getMap, getMapId } from '../../../http/fireVisualization/fireControlHome'
function fontSize(res) {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) {
    return
  }
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}
// 引入基本模板
var echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

// import "echarts/map/province/china.js"
//  hunan
// 获取一级行统计数据 ID
// async function getMapData() {
//   getMapId().then(
//     res => {
//       console.log('请求成功获取一级行统计数据 id：', res)
//     },
//     rej => {
//       console.log('请求成功获取一级行统计数据 id', rej)
//     }
//   )
//   // 获取一级行统计数据
//   var data = await getMap({ orgId: '5' }).then(
//     res => {
//       if (res.data.code == 0) {
//         console.log('请求成功获取一级行统计数据：', res.data.data.keyPartHostTotalList)
//         return res.data.data.keyPartHostTotalList
//       }
//     },
//     rej => {
//       console.log('请求失败获取一级行统计数据：', rej)
//     }
//   )

//   return data
// }

export default {
  props: ['mapData'],
  data() {
    return {
      polar: {
        textStyle: {
          fontFamily: 'Microsoft YaHei'
        },

        tooltip: {
          // 提示框
          trigger: 'item',
          formatter: function(params) {
            return params.name + '分行' + params.value[2]
          }
        },
        geo: {
          map: 'tongren',
          aspectScale: 0.85,
          layoutCenter: ['50%', '50%'],
          layoutSize: '100%',
          zoom: 1.25,
          regionHeight: 25,
          boxHeight: 100,
          boxWidth: 400,
          type: 'map',
          mapType: 'china',
          name: 'tongren',
          map: 'china',
          roam: true,
          aspectScale: 0.85,
          label: {
            normal: {
              show: false,
              textStyle: {
                fontSize: fontSize(0.12),
                color: 'red'
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: fontSize(0.12),
                color: 'white'
              }
            }
          },
          itemStyle: {
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: fontSize(0.15),
                  color: 'orange'
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: fontSize(0.15),
                  color: 'white'
                }
              }
            },
            normal: {
              show: false, //是否显示地图省份得名称
              borderColor: '#0B1DD3',
              areaColor: '#07165A'
            },
            emphasis: {
              areaColor: 'rgb(6,156,234)'
            }
          }
        },
        series: [
          {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            map: 'tongren',
            symbol: 'pin', // 气泡
            symbolSize: function(val) {
              return 20
            },
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  if (params.name == '安徽') {
                    return '一级分行：' + params.data.value[2]
                  } else {
                    return ''
                  }
                },
                position: 'right',
                textStyle: {
                  color: '#fff',
                  fontSize: fontSize(0.15),
                  x: 20
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'red' // 标志颜色'#F62157'
              }
            },
            zlevel: 6,

            data: [{ name: '河南', value: [113.665412, 34.757975, '44'] }]
          }
          // {
          //   name: '点',
          //   type: 'scatter',
          //   coordinateSystem: 'geo',
          //   map: 'tongren',
          //   symbol: 'pin', //气泡
          //   symbolSize: function(val) {
          //     return 20
          //   },
          //   itemStyle: {
          //     normal: {
          //       // color: 'green' //标志颜色'#F62157'
          //       color: {
          //         type: 'linear',
          //         x: 0,
          //         y: 0,
          //         x2: 0,
          //         y2: 1,
          //         colorStops: [
          //           {
          //             offset: 0,
          //             color: 'rgba(255,255,255,0)' // 0% 处的颜色
          //           },
          //           {
          //             offset: 0.5,
          //             color: '#EDFE39' // 50% 处的颜色
          //           },
          //           {
          //             offset: 1,
          //             color: 'yellow' // 100% 处的颜色
          //           }
          //         ],
          //         globalCoord: false // 缺省为 false
          //       }
          //     }
          //   },
          //   data: [
          //     { name: '长沙', value: [113, 28.21, '44'] },
          //     { name: '丽水', value: [119.92, 28.45, 33] }
          //   ]
          // }
        ]
      },
      myChartChina: null,
      cityPoint: {},
      name: []
    }
  },
  async beforeCreate() {
    await getH5StaticJson().then(res => {
      console.log(res.data)
      res.data.forEach(item => {
        let name = ''
        if (item.name.indexOf('市') !== -1) {
          name = item.name.slice(0, 2)
        }
        if (item.name.indexOf('省') !== -1) {
          name = item.name.slice(0, -1)
        }
        if (item.name.indexOf('区') !== -1) {
          name = item.name.slice(0, 4)
        }
        this.name.push(name)
        this.cityPoint[name] = item.center.split(',')
      })
    })
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    // 初始化地图
    drawLine() {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      var myChartContainer = document.getElementById('myChartChina')
      var myChartChina = echarts.init(myChartContainer)
      // getH5StaticJson().then(res => {
      //   console.log(res.data)
      //   res.data.forEach(item => {
      //     this.cityPoint[item.name] = item.center.split(',')
      //   })
      //   console.log('1111::', this.cityPoint)
      //   echarts.registerMap('china', china)

      //   // h设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，ECharts 会合并新的参数和数据，然后刷新图表。
      //   myChartChina.setOption(_this.polar)
      // })
      echarts.registerMap('china', china)
      const newValue = this.mapData
      const dataArr = []
      for (let i = 0; i < newValue.length; i++) {
        for (let j = 0; j < this.name.length; j++) {
          if (newValue[i].name.indexOf(this.name[j]) !== -1) {
            this.cityPoint[this.name[j]].push(newValue[i].count)
            dataArr.push({ name: this.name[j], value: this.cityPoint[this.name[j]] })
          }
        }
      }
      this.polar.series[0].data = dataArr

      // h设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，ECharts 会合并新的参数和数据，然后刷新图表。
      myChartChina.setOption(_this.polar)
      _this.myChartChina = myChartChina
      // 单击进入省级地图
      window.addEventListener('resize', () => {
        myChartChina.resize()
      })
    }
  },
  watch: {
    mapData(newValue) {
      this.drawLine()
    }
  }
}
</script>
