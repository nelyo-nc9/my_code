<template>
  <div id="contents-bigData">
    <div id="left-list">
      <div class="item-list" v-for="(item, index) in hostData" :key="index">
        <p>
          {{item.name}}
          <a @click="jump(index)">详情</a>
          <!-- <a href=""></a> //使用a 标签做导航 要删除href 熟悉 -->
        </p>
        <hostList :item="item" :index="index"></hostList>
      </div>
    </div>
    <div id="map">
      <mapComponet></mapComponet>
      <importantAlarm></importantAlarm>
    </div>
    <div id="right-list">
      <rightList></rightList>
    </div>
  </div>
</template>

<style lang="less" >
@media (min-width: 2000px) and(max-width: 3800px) {
  #contents-bigData .item-list p,
  #alarm p,
  #right-list .title {
    font-size: 0.71vw;
    // color: red;
    font-weight: 700;
  }
  #right-list .text-contont,
  #right-list .text-contont p {
    font-size: 0.54vw !important;
    // color: red;
  }
  #map #tips {
    .test {
      font-size: 0.54vw !important;
      color: #16F1F3;
    }
    .title {
      font-size: 0.71vw !important;
      color: #16F1F3;
    }
  }
}
@media (min-width: 0px) and(max-width: 2000px) {
  #contents-bigData .item-list p,
  #alarm p,
  #right-list .title {
    //  font-size: 0.92vw;
    // font-size: 0.74vw !important;
    font-size: 14px;
    color: rgba(222, 240, 255, 1);
    position: relative;
    // top: -2%;
    // color: red;
    // color:green;
    font-weight: 700;
  }

  #right-list #right .duty .content {
    width: 80% !important;
    position: relative;
    top: 1%;
  }
  #right-list .text-contont,
  #right-list .text-contont p {
    font-size: 0.64vw !important;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(222, 240, 255, 1);
    // color: red;
    // color: green;
  }

  #map #tips {
    .test {
      font-size: 16px !important;
      // font-size: 1vw !important;

      color: white;
    }
    .title {
      font-size: 26px !important;
      // font-size: 0.85vw !important;
      color: #15f1f3;
    }
  }

  #contents-bigData #left-list .item-list p {
    position: relative;
    top: 0%;
  }
}
@media (min-width: 3800px) {
  //  首页大标题
  .bigDataHome nav {
    .homeTitle {
      font-size: 64px !important;
      line-height: 100%;
      // color: orange;
    }
    .logo p {
      font-size: 48px !important;
    }
  }

  // 一级标题
  #contents-bigData .item-list p,
  #alarm p,
  #right-list .title {
    font-size: 0.74vw;
    font-size: 48px;
    // color: orange;
    font-weight: 700;
  }
  // 文本内容
  #right-list .text-contont,
  #right-list .text-contont p,
  #layer p {
    font-size: 0.68vw !important;
    font-size: 24px;
    // color: orange;
    font-weight: 400;
  }
  // 地图标识 中级
  #map #tips {
    .test {
      font-size: 28px !important;
      color: white;
    }
    .title {
      font-size: 44px !important;
      color: #15f1f3;
    }
  }
  #contents-bigData #left-list .item-list p {
    position: relative;
    top: 2%;
  }
}

#contents-bigData {
  width: 99vw;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  // padding: 10px 30px;
  // less 中 calc属性失效 加入上 ~ 效果正常
  height: calc(~'100% - 2.27vw');
  display: flex;
  #left-list {
    width: 25.5%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* justify-items: left; */
    flex-direction: column;
    .item-list {
      width: 100%;
      height: 25%;
      background-image: url(../../../static/bigData/list-bg.png);
      background-repeat: no-repeat;
      background-size: 100% 102%;
      margin-top: 10px;
      box-sizing: border-box;
      padding: 4px;
      width: 100%;
      height: 100%;
      .echarts {
        width: 100%;
        height: 100%;
      }
      p {
        text-align: center;
        position: relative;
        z-index: 10000;
        float: left;
        width: 100%;
        letter-spacing: 0.5px;
        line-height: 210%;
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
        color: #DEF1FF;
        background: linear-gradient(to bottom,#FFFFFF,#37B3DC);
        -webkit-background-clip: text;
        color: transparent;
        text-fill-color: transparent;
        background-image: -webkit-linear-gradient(top,#FFFFFF,#37B3DC);
        -webkit-background-clip: text;
        -webkit-text-fill-color:transparent;
        a {
          float: right;
          color: #33ccff;
          position: absolute;
          cursor: pointer;
          right: 3%;
          top: 0.6vw;
        }
      }
    }
  }
  #right-list {
    width: 25.5%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* justify-items: left; */
    flex-direction: column;
  }
  #map {
    width: 49%;
    height: 100%;
  }
}
</style>

<script>
// 动态配置echarts 字体大小
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

  var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' 00:00'

  return time2
}
import hostList from './subgroup/leftList.vue'
import mapComponet from './subgroup/map.vue'
import importantAlarm from './subgroup/ImportantAlarm.vue'
import rightList from './subgroup/rightList'
import {
  doorLineApi, // 门禁半小时
  audioLineApi, // 对讲半小时
  getNowDayCount, // 视频半小时
  alarmStatistics,
} from '../../http/alarmBigData/bigDataDetail.api.js'

import {
  equipmentStatus,
  getMap,
  rightDutyInformation,
  rightAlarmStatistics,
  keyAlarmStatistics,
  VideoStatus,
  VideoCount,
} from '../../http/bigData/bigDataHome'
export default {
  data() {
    return {
      // 模拟主机报价数据
      hostData: [
        {
          name: '视频主机运行状态  ',
          textStyle: {
            fontFamily: 'Microsoft YaHei',
          },
          fontStyle: {},
          grid: {
            left: '1%',
            top: '16%',
            width: '98%',
            containLabel: true,
          },
          wdith: '98%%',
          height: '76%',
          legend: {
            icon: 'rect',
            // orient: 'vertical',// 设置并排';'
            itemHeight: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemGap: fontSize(0.1),
            top: '92%',
            bottom: '0%',
            axisLabel: {
              interval: 1,
            },
            data: ['离线', '在线'],
            textStyle: {
              fontSize: fontSize(0.11),
              fontFamily: 'Microsoft YaHei',
              color: 'white',
            },
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              textStyle: {
                fontSize: fontSize(0.11),
                fontFamily: 'Microsoft YaHei',
                color: 'white',
              },
            },
            data: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '0', //坐标线的宽度
                fontSize: fontSize(0.11),
                fontFamily: 'Microsoft YaHei',
                show: false,
              },
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
          },
          yAxis: {
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(228,230,241,0.46)'],
                width: 0.2,
                // type: 'solid'
              },
            },
            axisLabel: {
              interval: 0,
              margin: 4,
              align: 'right',
              padding: [15, -18, 5, 6],
              textStyle: {
                fontSize: fontSize(0.11),
                fontFamily: 'Microsoft YaHei',
                // show: true,
                color: 'white',
              },
            },
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '0', //坐标线的宽度
                show: false,
              },
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
          },
          series: [
            {
              type: 'line',
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#E6E929', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              name: '离线',
              color: '#E6E929', //
              data: [120, 232, 901, 334, 70, 257, 890],
              type: 'line',
              smooth: 0.6,

              lineStyle: {
                color: '#E6E929', //

                width: 2,
              },
            },
            {
              //smooth: true,
              name: '在线',
              areaStyle: {
                normal: {
                  width: 3, //折线宽度
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#2390FE', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              color: '#2390FE',
              data: [820, 932, 901, 934, 1290, 130, 1320],
              smooth: 0.6,
              type: 'line',
              lineStyle: {
                color: '#2390FE',
                width: 2,
              },
            },
          ],
        },
        {
          name: '门禁主机运行状态  ',
          textStyle: {
            fontFamily: 'Microsoft YaHei',
          },
          grid: {
            left: '1%',
            top: '16%',
            width: '98%',
            containLabel: true,
          },
          width: '98%',
          height: '76%',
          legend: {
            icon: 'rect',
            // orient: 'vertical',// 设置并排
            itemHeight: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemGap: fontSize(0.1),
            bottom: '0%',
            top: '92%',
            axisLabel: {
              interval: 1,
            },
            data: ['离线', '在线'],
            textStyle: {
              fontSize: fontSize(0.11),
              color: 'white',
            },
          },
          xAxis: {
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
            type: 'category',
            axisLabel: {
              textStyle: {
                fontSize: fontSize(0.11),
                color: 'white',
              },
            },
            data: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '0', //坐标线的宽度
                fontSize: 1,
                show: false,
              },
            },
          },
          yAxis: {
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
            axisLabel: {
              textStyle: {
                fontSize: fontSize(0.11),
                color: 'white',
                padding: [15, -18, 5, 6],
              },
            },
            type: 'value',
            //网格样式
            splitLine: {
              show: false,
              fontSize: fontSize(0.11),
            },

            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '0', //坐标线的宽度
                show: false,
              },
            },
          },
          series: [
            
            {
              type: 'line',
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#E6E929', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              smooth: true,
              name: '离线',
              color: '#E6E929', //
              data: [120, 232, 901, 334, 70, 257, 890],
              type: 'line',
              smooth: true,
              type: 'line',
              smooth: 0.6,

              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#E6E929', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
            },
            {
              type: 'line',
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#2390FE', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              smooth: true,
              name: '在线',
              color: '#2390FE',
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true,
              type: 'line',
              smooth: 0.6,

              lineStyle: {
                color: '#2390FE', //#f18005
                width: 2,
              },
            },
          ],
        },
        {
          name: '对讲主机运行状态  ',

          textStyle: {
            fontFamily: 'Microsoft YaHei',
            color: 'white',
          },
          grid: {
            left: '1%',
            top: '16%',
            width: '98%',
            containLabel: true,
          },
          width: '98%',
          height: '76%',
          legend: {
            icon: 'rect',
            // orient: 'vertical',// 设置并排
            itemHeight: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemGap: fontSize(0.1),
            bottom: '0%',
            top: '92%',
            axisLabel: {
              interval: 1,
            },
            data: ['离线', '在线'],
            textStyle: {
              fontSize: fontSize(0.11),
              color: 'white',
            },
          },
          xAxis: {
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
            type: 'category',
            axisLabel: {
              textStyle: {
                color: 'white',
                fontSize: fontSize(0.11),
              },
            },
            data: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '0', //坐标线的宽度
                fontSize: 1,
                show: false,
              },
            },
          },
          yAxis: {
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
            axisLabel: {
              textStyle: {
                fontSize: fontSize(0.11),
                padding: [15, -18, 5, 6],
              },
            },
            type: 'value',
            //网格样式
            splitLine: {
              show: false,
              fontSize: 1,
            },

            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '0', //坐标线的宽度
                show: false,
              },
            },
          },
          series: [
            
            {
              type: 'line',
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#E6E929', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              smooth: true,
              name: '离线',
              color: '#E6E929', //
              data: [120, 232, 901, 334, 70, 257, 890],
              type: 'line',
              smooth: true,
              type: 'line',
              smooth: 0.6,

              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#E6E929', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
            },
            {
              type: 'line',
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#2390FE', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              smooth: true,
              name: '在线',
              color: '#2390FE',
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true,
              type: 'line',
              smooth: 0.6,

              lineStyle: {
                color: '#2390FE', //#f18005
                width: 2,
              },
            },
          ],
        },
        {
          name: '报警主机运行状态  ',
          textStyle: {
            fontFamily: 'Microsoft YaHei',
            color: 'white',
          },
          grid: {
            left: '1%',
            top: '16%',
            width: '98%',
            containLabel: true,
          },
          width: '98%',
          height: '76%',
          legend: {
            icon: 'rect',
            // orient: 'vertical',// 设置并排
            itemHeight: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemGap: fontSize(0.1),
            bottom: '0%',
            top: '92%',
            axisLabel: {
              interval: 1,
            },
            data: ['离线', '在线'],
            textStyle: {
              fontSize: fontSize(0.11),
              color: 'white',
            },
          },
          xAxis: {
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
            type: 'category',
            axisLabel: {
              textStyle: {
                fontSize: fontSize(0.11),
              },
            },
            data: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '0', //坐标线的宽度
                fontSize: 1,
                show: false,
              },
            },
          },
          yAxis: {
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
            axisLabel: {
              textStyle: {
                fontSize: fontSize(0.11),
                padding: [15, -18, 5, 6],
              },
            },
            type: 'value',
            //网格样式
            splitLine: {
              show: false,
              fontSize: 1,
            },

            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '0', //坐标线的宽度
                show: false,
              },
            },
          },
          series: [
            
            {
              type: 'line',
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#E6E929', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              smooth: true,
              name: '离线',
              color: '#E6E929', //
              data: [120, 232, 901, 334, 70, 257, 890],
              type: 'line',
              smooth: true,
              type: 'line',
              smooth: 0.6,

              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#E6E929', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
            },
            {
              type: 'line',
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear', //设置线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#2390FE', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'white', // 100% 处的颜色
                      },
                    ],

                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              smooth: true,
              name: '在线',
              color: '#2390FE',
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true,
              type: 'line',
              smooth: 0.6,

              lineStyle: {
                color: '#2390FE', //#f18005
                width: 2,
              },
            },
          ],
        },
      ],
    }
  },
  components: {
    hostList,
    mapComponet,
    importantAlarm,
    rightList,
  },
  created() {
    this.getLeftVideoStatus()
    this.getRightVideoCount()
    this.getNowDayCountFun()
    this.getDoorEventHourCount() 
    this.getAudioEventHourCount()
    this.getAlarmStatistics()
  },
  methods: {
    // 获取左侧 门禁
    getDoorEventHourCount() {
       var _this = this;
      doorLineApi().then((res)=>{
        console.log(' 获取左侧 门禁',res)
        if(res.data.code ==0){
              _this.hostData[1].series[0].data =  res.data.data.offline
          _this.hostData[1].series[1].data =  res.data.data.online
          _this.hostData[1].xAxis.data = res.data.data.time
          console.log("数据正常",res.data.data)
        }else{
          console.log('数据无效')
        }
      })
    },
    // 左侧报警主机 运行状态
    getAlarmStatistics() {
       var _this = this;
       alarmStatistics().then((res)=>{
        console.log(' 左侧报警主机 ',res)
        if(res.data.code ==0){
          // alert()
              _this.hostData[3].series[0].data =  res.data.data.offline
          _this.hostData[3].series[1].data =  res.data.data.online
          _this.hostData[3].xAxis.data = res.data.data.time
          console.log("数据正常",res.data.data)
        }else{
          console.log('数据无效')
        }
      })
    },
    //对讲半小时
    getAudioEventHourCount() {
       var _this = this;
      audioLineApi().then((res)=>{
        console.log(' 对讲半小时',res)
        if(res.data.code ==0){
              _this.hostData[2].series[0].data =  res.data.data.offline
          _this.hostData[2].series[1].data =  res.data.data.online
          _this.hostData[2].xAxis.data = res.data.data.time
          console.log("数据正常",res.data.data)
        }else{
          console.log('数据无效')
        }
      })
    },
    // 视频半小时
    getNowDayCountFun() {
      var _this = this;
       getNowDayCount().then((res)=>{
        console.log(' 视频半小时',res)
        if(res.data.code ==0){
          console.log("数据正常",res.data.data)
          //  res.data.data.offline
          // res.data.data.online
          // res.data.data.time
          _this.hostData[0].series[0].data =  res.data.data.offline
          _this.hostData[0].series[1].data =  res.data.data.online
          _this.hostData[0].xAxis.data = res.data.data.time
        }else{
          console.log('数据无效')
        }

      })
    },
    // 获取左侧视频主机在线离线状态
    getLeftVideoStatus() {
      VideoStatus().then(
        (res) => {
          console.log('获取左侧设备  图表列表-数据', res)
        },
        (rej) => {
          console.log('获取左侧设备  图表列表-请求错误', rej)
        }
      )
    },
    //   视频主机总数
    getRightVideoCount() {
      VideoCount().then(
        (res) => {
          console.log('  视频主机总数-数据', res)
        },
        (rej) => {
          console.log('  视频主机总数-请求错误', rej)
        }
      )
    },
    jump(index) {
      switch (index) {
        case 0:
          this.$router.push({ name: 'accesscControlData', params: { title: '视频数据' } })
          break
        case 1:
          this.$router.push({ name: 'accesscControlData', params: { title: '门禁数据' } })

          break
        case 2:
          // this.$router.push('/bigData/basicData/')

          this.$router.push({ name: 'accesscControlData', params: { title: '对讲数据' } })
          break
        case 3:
          this.$router.push({ name: 'warningData', params: { title: '报警数据' } })
          break
      }
    },
  },
}
</script>
