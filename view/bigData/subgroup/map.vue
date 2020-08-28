<template>
  <div id="body">
    <div id="tips">
      <ul>
        <li>
          <div class="item-icon">
            <div class="icon zh"></div>
          </div>
          <div>
            <div class="test">总行</div>
            <div>
              <h3 class="title">1个</h3>
            </div>
          </div>
        </li>

        <li>
          <div class="item-icon">
            <div class="icon yiji"></div>
          </div>
          <div>
            <div class="test">一级分行</div>
            <div>
              <h3 class="title">12个</h3>
            </div>
          </div>
        </li>

        <li>
          <div class="item-icon">
            <div class="icon erji"></div>
          </div>
          <div>
            <div class="test">二级分行</div>
            <div>
              <h3 class="title">16个</h3>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div id="map-body">
      <div id="myChartChina"></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
#body {
  height: 66%;
  width: 100%;
 /deep/ #layer{ 
  height: auto !important;
  
    font-size:0.6vw!important;
    line-height: 1.1vw !important;
  p{
    font-size:0.6vw!important;
    line-height: 1.1vw !important;
    padding: 0.2vw !important;
  }
}
  position: relative;
  #tips {
    width: 55%;
    height: 16%;
    color: #15f1f3;
    background-image: url(../../../../static/bigData/map-info-bg.png);
    background-size: auto;
    position: absolute;
    background-size: 100% 100%;
    top: 2%;
    left: 2%;
    ul {
      list-style: none;
      width: 100%;
      height: 100%;
      li {
        width: 33%;
        height: 100%;
        float: left;
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
        justify-items: center;
        align-items: center;
        .item-icon {
          width: 100%;
          height: 100%;
          display: grid;
          align-items: center;
          justify-items: center;
          line-height: 24px;
          text-align: center;

          .icon {
            width: 100%;
            height: 50%;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url(../../../../static/bigData/zonghang-icon.png);
          }
          .erji {
            background-image: url(../../../../static/bigData/erji-icon.png);
          }
          .yiji {
            background-image: url(../../../../static/bigData/yiji-icon.png);
          }
        }
      }
    }
  }
  #map-body {
    height: 100%;
    width: 100%;
    #myChartChina {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
<script>
import {
  equipmentStatus,
  getMap,
  rightAlarmStatistics,
  rightInspectionStatistics,
  ReaTimeAlarm,
  weeklyAlarm,
  getMapId,
  weeklyOnline,
} from '../../../http/fireVisualization/fireControlHome'



function fontSize(res) {
  let docEl = document.documentElement,
    clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return
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
import 'echarts/map/js/province/shanxi1.js'
import 'echarts/map/js/province/sichuan.js'
import 'echarts/map/js/province/taiwan.js'
import 'echarts/map/js/province/tianjin.js'
import 'echarts/map/js/province/xianggang.js'
import 'echarts/map/js/province/xizang.js'
import 'echarts/map/js/province/xinjiang.js'
import 'echarts/map/js/province/yunnan.js'
import 'echarts/map/js/province/zhejiang.js'
import 'echarts/map/js/province/hunan.js'
import 'echarts/map/js/province/tianjin.js'

// import "echarts/map/province/china.js"
//  hunan
// 获取一级行统计数据 ID
async function getMapData() {
  getMapId().then(
    (res) => {
      console.log('请求成功获取一级行统计数据 id：', res)
    },
    (rej) => {
      console.log('请求成功获取一级行统计数据 id', rej)
    }
  )
  // 获取一级行统计数据
  var data = await getMap({ orgId: '5' }).then(
    (res) => {
      if (res.data.code == 0) {
        console.log('请求成功获取一级行统计数据：', res.data.data)
        return res.data.data
      }
    },
    (rej) => {
      console.log('请求失败获取一级行统计数据：', rej)
    }
  )

  return data
}
var iconRQ =
  'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNCRkRBMEJBQzgwRjExRUFBNUI0RTMyMThEN0UxMzFEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNCRkRBMEJCQzgwRjExRUFBNUI0RTMyMThEN0UxMzFEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0JGREEwQjhDODBGMTFFQUE1QjRFMzIxOEQ3RTEzMUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0JGREEwQjlDODBGMTFFQUE1QjRFMzIxOEQ3RTEzMUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5mT42iAAABQ0lEQVR42mL8LabOQCQIBOL1xChkItJAkLp+IBajpqFWQCwPxJ7UNDQCSgdQy1BmIA6Bsl2AmJMahjoAsTiUzQPETtQwNAKN709IAwvUayZQ/hcg/o0k/x6Ig9D0+ABxKJT9HYh/oMm/BBm6GYitgTgfiBmJcLkkEK/CIXcGiGNB3v8JxIVQF31gIA/8AeIWaNK7gRymG4BYH4hPkGjgXSC2A+JaWNChR9QjqIJeIP5PhIGzgdgAiI8Tin2QbSVAvIOAgROBOA0auUQlKV4gtidgqBGp6RSUFrmIKA/ESDEUPcGfBOIUIH6Lln29iTVUCIjdkJJKExDbAPFcqJdPEMpd2AwF5TBWaFKxBeJ6qOHIqaMbmjrcsBUw2AwNh7rKAEeaBaWOMiD2BeJvQOxOyFBuaFJJwZZU0MBWaHCIo0sABBgAetA4Jx5t/ToAAAAASUVORK5CYII='
var data = [
  { name: '北京', value: [116.24, 39.55, 100] },
  { name: '深圳', value: [114.271522, 22.753644] },
  { name: '重庆', value: [106.54, 29.59] },
  { name: '浙江', value: [120.19, 30.26] },
  { name: '上海', value: [121.4648, 31.2891] },
]
var LableData = [
  {
    name: '北京',
    coords: [
      [116.24, 39.55, 100],
      [120.24, 46.55, 100],
    ],
    value: [1021, 120],
  },
  {
    name: '深圳',
    coords: [
      [114.271522, 22.753644],
      [118.24, 18.55, 100],
    ],
    value: [1021, 120],
  },
  {
    name: '重庆',
    coords: [
      [106.54, 29.59],
      [104.24, 35.55],
    ],
    value: [1021, 120],
  },
  {
    name: '浙江',
    coords: [
      [120.19, 30.26],
      [125.24, 27.55, 100],
    ],
    value: [1021, 120],
  },
  {
    name: '上海1',
    coords: [
      [121.4648, 31.2891],
      [122.4648, 32.2891],
    ],
    value: [1201, 60],
  },
]
export default {
  data() {
    return {
      polar: {
        textStyle: {
          fontFamily: 'Microsoft YaHei',
        },

        tooltip: {
          // 提示框
          trigger: 'item',
          triggerOn: 'click',
          formatter: function (params) {
            // async await 修饰符 同步

            // console.log('提示框', params, params.name != '安徽')
            if (params.name != '安徽') {
              return '<p id="layer"  style="height:1vw;line-height:1vw" >暂无数据</p>'
            }
            var data = getMapData().then((res) => {
              var Html = '<p style="height:1vw;line-height:1vw" >重点部位总数</p>'

              res.forEach((item) => {
                Html += `<p style="height:1vw;line-height:1vw"> ${item.name} : ${item.total}</p>`
              })
              $('#layer').html(Html)
            })
            return `<div style="font-size:0.6vw" id="layer" > 
            <b> </b>
                <ul style="width: 6vw;
              font-size: 0.6vw;">
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
          },
        },
        geo: {
          map: 'tongren',
          aspectScale:1,
          layoutCenter: ['50%', '50%'],
          layoutSize: '100%',
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: fontSize(0.1),
                color: 'rgb(1,4,7)',
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: fontSize(0.1),
                color: 'white',
              },
            },
          },
          itemStyle: {
            normal: {
              borderColor: 'rgb(0,52,111)',
              // borderWidth: 5,
              areaColor: 'rgb(23,112,189)',
            },
            emphasis: {
              textStyle: {
                fontSize: 16,
                color: '#ccc',
              },
              areaColor: 'rgb(6,156,234)',
            },
          },
        },
        series: [
          {
            itemStyle: {
              normal: {
                opacity: 1, //图形透明度 0 - 1
                borderColor: 'rgb(18,131,203)', //图形的描边颜色
                borderWidth: 2, //描边线宽。为 0 时无描边。
                borderType: 'solid', //柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
                areaColor: 'rgba(11, 28, 63, 0.8)', //图形的颜色 #eee
                areaColor: 'rgb(13,66,120)', //图形的颜色 #eee
              },

              normal: {
                show: false,
                textStyle: {
                  fontSize: fontSize(0.1),
                  color: '#fff',
                },
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: fontSize(0.1),
                  color: '#fff',
                },
              },
              normal: {
                show: false, //是否显示地图省份得名称
                borderColor: 'rgb(0,160,232)',
                // borderWidth: 5,
                areaColor: 'rgb(0,77,164)',
                // fontWeightL: 700,
                // shadowBlur: 20,
                // shadowColor: '#fff',
                // shadowOffsetX: 0,
                // shadowOffsetY: 7,
                // opacity: 0.961,
              },
              emphasis: {
                areaColor: 'rgb(6,156,234)',
              },
            },

            roam: true,
            name: 'iphone5',
            type: 'map',
            mapType: 'china',
            label: {
              normal: {
                show: false,
                textStyle: {
                  fontSize: fontSize(0.1),
                  color: '#fff',
                },
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: fontSize(0.1),
                  color: '#fff',
                },
              },
            },
          },
        ],
      }, 
      myChartChina: null,
    }
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    // 双击返回全国地图
    dblclick(e) {},
    // 初始化地图
    drawLine() {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      var myChartContainer = document.getElementById('myChartChina')
      var myChartChina = echarts.init(myChartContainer)

      // 注册地图名字(tongren)和数据(china)
      echarts.registerMap('china', china)

      // h设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，ECharts 会合并新的参数和数据，然后刷新图表。
      myChartChina.setOption(_this.polar)
      _this.myChartChina = myChartChina
      // 单击进入省级地图
      window.addEventListener('resize', () => {
        myChartChina.resize()
      })
      myChartChina.on('dblclick', function (params) {
        // debugger
        console.log('当前地图点击效果', params, _this.polar.series)

        if (_this.polar.series[0].mapType == 'china') {
          
          _this.polar.series[0].mapType = params.name
          _this.polar.series[0].map = params.name
          myChartChina.setOption(   _this.polar)
        } else {

          _this.polar.series[0].mapType = 'china'
          _this.polar.series[0].map = 'china'
             myChartChina.setOption(   _this.polar)
          
        }

        // return
      })
    },
  },
}
</script>