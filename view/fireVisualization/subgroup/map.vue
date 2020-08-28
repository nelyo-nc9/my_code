<template>
  <div id="body">
    <!-- <div id="right-serach">
      <div class="search-box">
        <el-input v-model="keyWord" placeholder="请输入..." suffix-icon="el-icon-search"></el-input>
     
        <el-select v-model="keyWord" filterable placeholder="请选择" :popper-append-to-body="false">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>-->
    <div id="tips">
      <ul>
        <li>
          <div>
            <img src="../../../../static/bigData/icon.png" />

            <span class="group-title">设备总数量</span>
          </div>
          <b class="number">{{infoData.live + infoData.offline}}</b>
        </li>
        <li>
          <div>
            <img src="../../../../static/bigData/icon.png" />

            <span class="group-title">设备在线数量</span>
          </div>
          <b class="number">{{infoData.live}}</b>
        </li>
        <li>
          <div>
            <img src="../../../../static/bigData/icon.png" />
            <span class="group-title">设备离线数量</span>
          </div>
          <b class="number">{{infoData.offline}}</b>
        </li>
        <li>
          <div>
            <img src="../../../../static/bigData/icon.png" />

            <span class="group-title">机构分布数量</span>
          </div>
          <b class="number">{{infoData.organization}}</b>
        </li>
        <li>
          <div>
            <img src="../../../../static/bigData/icon.png" />
            <span class="group-title">网点分布数量</span>
          </div>
          <b class="number">{{infoData.outlets}}</b>
        </li>
      </ul>
    </div>
    <div id="myChartChina"></div>
  </div>
</template>
<style lang="less" scoped>
#body {
  height: 78%;
  width: 100%;
  // background: rgb(6, 45, 86);
  position: relative;
  /deep/ #layer {
    height: auto !important;

    font-size: 0.6vw !important;
    line-height: 1.1vw !important;
    p {
      font-size: 0.6vw !important;
      line-height: 1.1vw !important;
      padding: 0.2vw !important;
    }
  }
  #right-serach {
    width: 18%;
    position: absolute;
    z-index: 10000;
    right: 10px;
    .search-box {
      width: 100%;
      height: 40px;
      line-height: 40px;
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
      /deep/.el-input__inner {
        background: none;
        border-radius: 0;
        font-size: 0.7rem;
        border: 0.5px solid #385d7d;
        color: white;
      }

      /deep/.el-select {
        display: inline-block;
        position: relative;
        width: 100%;
      }
    }
  }
  #tips {
    width: 100%;
    height: 10%;
    z-index: 10000;
    background-size: auto;
    position: absolute;

    top: 2%;
    left: 2%;
    ul {
      list-style: none;
      width: 100%;
      height: 100%;
      li:nth-child(1) b {
        color: red;
      }
      li:nth-child(2) b {
        color: brown;
      }
      li:nth-child(3) b {
        color: orange;
      }
      li:nth-child(4) b {
        color: yellow;
      }
      li:nth-child(5) b {
        color: green;
      }
      li {
        width: 17%;
        height: 100%;
        margin: 0 3% 3% 0;
        font-size: 0.8vw;
        background-image: url(../../../../static/bigData/tips-bg.png);
        background-size: 100% 100%;
        float: left;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      }
    }
  }

  #myChartChina {
    height: 100%;
    width: 100%;
  }
}
</style>
<script>
//  hunan
var iconRQ =
  'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNCRkRBMEJBQzgwRjExRUFBNUI0RTMyMThEN0UxMzFEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNCRkRBMEJCQzgwRjExRUFBNUI0RTMyMThEN0UxMzFEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0JGREEwQjhDODBGMTFFQUE1QjRFMzIxOEQ3RTEzMUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0JGREEwQjlDODBGMTFFQUE1QjRFMzIxOEQ3RTEzMUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5mT42iAAABQ0lEQVR42mL8LabOQCQIBOL1xChkItJAkLp+IBajpqFWQCwPxJ7UNDQCSgdQy1BmIA6Bsl2AmJMahjoAsTiUzQPETtQwNAKN709IAwvUayZQ/hcg/o0k/x6Ig9D0+ABxKJT9HYh/oMm/BBm6GYitgTgfiBmJcLkkEK/CIXcGiGNB3v8JxIVQF31gIA/8AeIWaNK7gRymG4BYH4hPkGjgXSC2A+JaWNChR9QjqIJeIP5PhIGzgdgAiI8Tin2QbSVAvIOAgROBOA0auUQlKV4gtidgqBGp6RSUFrmIKA/ESDEUPcGfBOIUIH6Lln29iTVUCIjdkJJKExDbAPFcqJdPEMpd2AwF5TBWaFKxBeJ6qOHIqaMbmjrcsBUw2AwNh7rKAEeaBaWOMiD2BeJvQOxOyFBuaFJJwZZU0MBWaHCIo0sABBgAetA4Jx5t/ToAAAAASUVORK5CYII='

import {
  equipmentStatus,
  getOrganization,
  getMap,
  rightAlarmStatistics,
  rightInspectionStatistics,
  ReaTimeAlarm,
  weeklyAlarm,
  getMapId,
  weeklyOnline,
} from '../../../http/fireVisualization/fireControlHome'
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

function getDays() {
  return nowYear + '-' + nowMonth + '-' + nowDay
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

//获得上周的开始日期
function getLastWeekStartDate() {
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7)
  return formatDate(weekStartDate)
}
//获得上周的结束日期
function getLastWeekEndDate() {
  var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1)
  return formatDate(weekEndDate)
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
// 获取指定xxx天前日期  -7/-1
function fun_data(aa) {
  var date1 = new Date(),
    time1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() //time1表示当前时间

  var date2 = new Date(date1)

  date2.setDate(date1.getDate() + aa)

  var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()

  return time2
}
// 引入基本模板
function fontSize(res) {
  let docEl = document.documentElement,
    clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}

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
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import 'echarts-gl'
// 引入 全国、省份地图数据
import chinaJson from 'echarts/map/json/china.json'
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
import { recordUserLog } from '../../../http/video/videoPlayback.api'
// import "echarts/map/province/china.js"

export default {
  data() {
    return {
      infoData: {
        error: 0,
        live: 0,
        offline: 0,
        organization:0,
        outlets:0,
      },
      keyWord: '',
      options3: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],

      mapData: {
        width: '80%',
        height: '80%',
        textStyle: {
          fontFamily: 'Microsoft YaHei',
          color: '#fff',
          fontSize: fontSize(0.09),
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
                show: false,
                textStyle: {
                  fontSize: fontSize(0.1),
                  color: '#fff',
                },
              },
              emphasis: {
                show: false,
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
    this.getData()
    this.getWeeklyOnline()
  },
  methods: {
    getData() {
      var _this = this
      equipmentStatus({ isAll: true }).then(
        (res) => {
          console.log(res, 'res.data ({ isAll: true}')
          // console.log('type:'+type+"::", res.data.data[type])
          _this.infoData.error = res.data.data.error
          _this.infoData.live = res.data.data.live
          _this.infoData.offline = res.data.data.offline
          return getOrganization();
        })
        .then((response) => {
          _this.infoData.organization=response.data.data.orgCont.count;
          _this.infoData.outlets=response.data.data.keyPart.count;
          console.log(response)
        },function(rej){console.log('rej'+rej)})
    },
    // 双击返回全国地图

    drawLine() {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      echarts.registerMap('china', chinaJson)
      var chart = echarts.init(document.getElementById('myChartChina'))
      chart.setOption(_this.mapData)
      // 注册地图名字(tongren)和数据(china)
      echarts.registerMap('china', chinaJson)

      window.addEventListener('resize', () => {
        chart.resize()
      })
      chart.on('dblclick', function (params) {
        // debugger
        console.log('当前地图点击效果', params, _this.mapData.series)

        if (_this.mapData.series[0].mapType == 'china') {
          
          _this.mapData.series[0].mapType = params.name
          _this.mapData.series[0].map = params.name
          chart.setOption(   _this.mapData)
        } else {

          _this.mapData.series[0].mapType = 'china'
          _this.mapData.series[0].map = 'china'
             chart.setOption(   _this.mapData)
          
        }

        // return
      })
      chart.showLoading({
        // 此处需要传入一个对象
        text: '加载中',
        color: '#c23531',
        textColor: '#000',
        maskColor: 'rgba(0,39,103, 0.8)',
        zlevel: 0,
        backgroundColor: 'red',
        // 字体大小。从 `v4.8.0` 开始支持。
        fontSize: 12,
        color: '#3385ff',
      })

      setTimeout(() => {
        chart.hideLoading()
      }, 700)
    },
    //// 获取底部周在线信息
    getWeeklyOnline() {
      var param = {
        startTime: fun_data(-7),
        endTime: fun_data(-1),
      }

      weeklyOnline(param).then(
        (res) => {
          console.log('获取底部周在线信息res:', res)
          // 数据正常
          if (res.data.code == 0) {
          } else {
          }
        },
        (rej) => {
          console.log('获取底部周在线信息rej:', rej)
        }
      )
    },
  },
}
</script>