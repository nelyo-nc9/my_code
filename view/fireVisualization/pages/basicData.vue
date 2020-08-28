<template>
  <div id="detail-body">
    <div class="tree-main">
      <div class="inputyead">
        <el-input
          v-model="kepalina"
          placeholder="请输入..."
          suffix-icon="el-icon-search"
          style="width:100%;height:40px !important"
        ></el-input>
      </div>
      <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
      <el-container style="height: 100%;background-color: #062d56;border:0.5px solid #2b7bc0">
        <el-aside width="101%">
          <el-menu
            router
            :default-active="$route.name"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="transparent"
            text-color="#fff"
            active-text-color="#000"
          >
            <el-submenu index="2">
              <template slot="title"> <i class="el-icon-document"></i>保定分行 </template>
              <el-menu-item index="list">分行1</el-menu-item>
              <el-menu-item index="list2">分行2</el-menu-item>
              <el-menu-item index="list3">分行3</el-menu-item>
              <el-submenu index="1-4">
                <template slot="title">分行4</template>
                <el-menu-item index="1-4-1">子分行1</el-menu-item>
              </el-submenu>
              <el-menu-item index="list4">分行5</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
      </el-container>
    </div>
    <div id="right-echarts">
      <div class="header-top">
        <ul class="header">
          <li>
            <img src alt />
            <div>
              <p>
                <big>1235</big>&nbsp;&nbsp;
                <span>件</span>
              </p>
              <p>
                <small>任务总数量</small>
              </p>
            </div>
          </li>
          <li>
            <img src alt />
            <div>
              <p>
                <big>38</big>&nbsp;&nbsp;
                <span>件</span>
              </p>
              <p>
                <small>每日任务</small>
              </p>
            </div>
          </li>
          <li>
            <img src alt />
            <div>
              <p>
                <big>256</big>&nbsp;&nbsp;
                <span>件</span>
              </p>
              <p>
                <small>每周任务</small>
              </p>
            </div>
          </li>
          <li>
            <img src alt />
            <div>
              <p>
                <big>321</big>&nbsp;&nbsp;
                <span>件</span>
              </p>
              <p>
                <small>每月任务</small>
              </p>
            </div>
          </li>
        </ul>
        <div class="content">
          <div class="table">
            <FullCalendara :options="calendarOptions"> </FullCalendara>
            <!-- <FullCalendar  :options='calendarOptions' /> -->
          </div>
          <div class="right-echarts">
            <div class="item">
              <p class="title">
                巡检任务完成统计
                <!-- <a @click="jump('fireVisualizationbasicData')">详情</a>
                -->
              </p>
              <Pie :options="options[3]" :index="0"></Pie>
            </div>
            <div class="item">
              <p class="title">
                巡检任务完成统计
                <!-- <a @click="jump('fireVisualizationbasicData')">详情</a> -->
              </p>
              <hostList :item="options[0]" :index="0"></hostList>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <detailsList></detailsList>
      </div>
    </div>
  </div>
</template>

<script>
/*
 */
// 必须引入pinj
import FullCalendar from '@fullcalendar/vue'
// // 必须引入
import interactionPlugin from '@fullcalendar/interaction'
// // // 必须引入，日月日程
import dayGridPlugin from '@fullcalendar/daygrid'
// // 列表展示、可实现周、天、列表展示线性列表展示（可选）
import timegrid from '@fullcalendar/timegrid'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import hostList from '../subgroup/leftList.vue'
import Pie from '../subgroup/pie.vue'
import FullCalendara from '../subgroup/FullCalendar.vue'
import detailsList from '../detailsList.vue'
export default {
  name: 'VideoTree',
  components: {
    hostList,
    Pie,
    detailsList,
    FullCalendara
  },
  props: ['title'],
  data() {
    return {
      monthData: [
        {
          title: 'eeeeeeeee', // 事件内容
          start: '2018-12-11', // 事件开始时间
          end: '2018-12-30', // 事件结束时间
          cssClass: 'red' // 事件的样式   class名（由后台返回数据）  red为自己定义的class名
        },
        {
          title: 'sssss',
          start: '2018-12-25',
          end: '2018-12-30',
          cssClass: 'blue'
        },
        {
          title: 'dddddddd',
          start: '2018-12-09',
          end: '2018-12-30',
          cssClass: 'blue'
        },
        {
          title: 'cccccc',
          start: '2018-12-20',
          end: '2018-12-30',
          cssClass: 'red'
        },
        {
          title: 'aaaaaa',
          start: '2018-12-01',
          end: '2018-12-30',
          cssClass: 'red'
        },
        {
          title: 'bbbbbb',
          start: '2018-12-05',
          end: '2019-1-10',
          cssClass: 'blue'
        }
      ],
      // 配置表头
      calendarOptions: {
        headerToolbar: {
          left: 'dayGridMonth,timeGridWeek,timeGridDay',
          center: 'title',
          right: 'prev,next'
        },
        // footerToolbar: {
        //   left: 'custom1,custom2',
        //   center: '',
        //   right: 'prev,next'
        // },
        // customButtons: {
        //   custom1: {
        //     text: 'custom 1',
        //     click: function() {
        //       alert('clicked custom button 1!');
        //     }
        //   },
        //   custom2: {
        //     text: 'custom 2',
        //     click: function() {
        //       alert('clicked custom button 2!');
        //     }
        //   }
        // },

        // header: {
        //   //头部设置

        //   left: 'title', //左边内容

        //   center: '', //中间显示

        //   left: 'prev,next,today,month,agendaWeek,agendaDay', //右边显示
        // },
        plugins: [dayGridPlugin, interactionPlugin, timegrid],
        initialView: 'dayGridMonth',
        height: '100%',
        buttonText: { today: '今日', dayGridMonth: '月', timeGridWeek: '周', timeGridDay: '日', prevYear: '去年' },
        locale: 'zh-cn',
        // editable: true, //是否允许修改事件
        // selectable: true,
        // eventLimit: 4, //事件个数
        // allDaySlot: true, //是否显示allDay
        // defaultView: 'month', //显示默认视图
        eventClick: this.eventClick, //点击事件
        dayClick: this.dayClick, //点击日程表上面某一天
        handleWindowResize: true, //是否随浏览器窗口大小变化而自动变化。
        events: [
          {
            title: '事件1', // 事件内容
            start: '2020-07-25 09:00:00', // 事件开始时间
            // end: '2020-05-20 09:00:00', // 事件结束时间
            durationEditable: false,
            color: '#ff9f89'
          },
          {
            rendering: 'background',
            title: '事件1', // 事件内容
            start: '2020-07-20 09:00:00', // 事件开始时间
            end: '2020-07-20 21:00:00', // 事件结束时间
            display: 'background',
            color: 'rgb(11,53,138)',
            durationEditable: false
          },
          {
            title: '事件3', // 事件内容
            start: '2020-07-28 11:00:00'
          },
          {
            title: '事件4', // 事件内容
            start: '2020-07-28 10:00:00', // 事件开始时间
            // end: '2020-05-20 11:00:00', // 事件结束时间
            textColor: 'red', // 事件的显示颜色
            durationEditable: false,
            resourceEditable: false,
            className: ['green', 'secondClass']
          },
          {
            title: 'Some title00000',
            start: '2020-07-10 09:00:00',
            allDay: false,
            editable: false,
            backgroundColor: '#SomeColor',
            borderColor: '#SomeColor'
          },
          {
            title: 'Some title2',
            start: new Date(2020, 8, 24, 10, 30),
            allDay: false,
            editable: false,
            backgroundColor: '#SomeColor2',
            borderColor: '#SomeColor2'
          }
        ]
      },

      options: [
        {
          name: '消防水系统设备运行状态统计',
          wdith: '80%',
          height: '80%',
          legend: {
            icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            // orient: 'vertical',
            itemHeight: 7,
            itemWidth: 7,
            itemGap: 15,
            wdith: '10px',
            top: 10,
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
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside' // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: 18,
                fontWeight: '400'
              }
            }
          },

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '访问来源1111',
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
                  fontSize: 10
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  wdith: '50px',
                  textStyle: {
                    //文本样式
                    fontSize: 10,
                    fontWeight: '600'
                  }
                }
              },
              labelLine: {
                lineStyle: {
                  color: 'white'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 10,
                  fontWeight: 'bold'
                }
              },

              data: [
                { value: 179, name: '火灾', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 335, name: '水灾', itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 679, name: '爆炸', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '地震', itemStyle: { color: 'rgb(220,70,30)' } }
              ]
            }
          ]
        },

        {
          name: '消防水系统设备运行状态统计',
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
              interval: 1
            },

            textStyle: {
              fontSize: 10,
              color: 'white',
              padding: [6, 0, 0, 0]
            }
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside' // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: 18,
                fontWeight: '400'
              }
            }
          },

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '访问来源1111',
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
                  fontSize: 10
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  wdith: '50px',
                  textStyle: {
                    //文本样式
                    fontSize: 10,
                    fontWeight: '600'
                  }
                }
              },
              labelLine: {
                lineStyle: {
                  color: 'white'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 10,
                  fontWeight: 'bold'
                }
              },

              data: [
                { value: 79, name: '火灾', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 335, name: '水灾', itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 79, name: '爆炸', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '地震', itemStyle: { color: 'rgb(220,70,30)' } }
              ]
            }
          ]
        },
        {
          name: '消防水系统设备运行状态统计',
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
              interval: 1
            },

            textStyle: {
              fontSize: 10,
              color: 'white',
              padding: [6, 0, 0, 0]
            }
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside' // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: 18,
                fontWeight: '400'
              }
            }
          },

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '访问来源1111',
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
                  fontSize: 10
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  wdith: '50px',
                  textStyle: {
                    //文本样式
                    fontSize: 10,
                    fontWeight: '600'
                  }
                }
              },
              labelLine: {
                lineStyle: {
                  color: 'white'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 10,
                  fontWeight: 'bold'
                }
              },

              data: [
                { value: 109, name: '火灾', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 15, name: '水灾', itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 19, name: '爆炸', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '地震', itemStyle: { color: 'rgb(220,70,30)' } }
              ]
            }
          ]
        },
        {
          tooltip: {
            show: true,
            formatter: '{b} {c}'
          },
          grid: {
            left: '2%',
            top: '22%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: {
            show: false,
            type: 'value',
            // 设置x轴显示几段
            min: 0,
            max: 100,

            splitLine: {
              show: false
            },
            interval: 50
          },
          yAxis: {
            show: true,
            type: 'category',
            data: ['每日巡检任务', '每周巡检任务', '每月巡检任务'],
            axisTick: { show: false },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'rgb(93,126,169)'
              }
            },
            splitLine: {
              show: false
            },
            inside: true,
            textStyle: {
              color: 'red'
            }
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
                  barBorderRadius: [15, 15, 15, 15] // 定义背景柱形的圆角
                }
              },
              barGap: '-100%', // 设置柱形重合的重要步骤
              data: [80, 80, 80, 80, 80, 80, 80],
              z: 0,
              silent: true,
              animation: true, // 关闭动画效果
              barWidth: 16
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

                  formatter: function(param) {
                    return param.value
                  },
                  textStyle: {
                    //这个地方颜色是支持回调函数的这种的，如果是一种颜色则可以写成： color :'#1089E7'
                    color: 'rgb(93,126,169)',
                    fontSize: '16'
                  }
                }
              },
              itemStyle: {
                normal: {
                  barBorderWidth: 2,
                  borderColor: 'rgb(5,47,88)',
                  barBorderRadius: 15,
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: 'rgb(230,51,52)'
                    },
                    {
                      offset: 1,
                      color: 'rgb(247,147,24)'
                    }
                  ]),
                  barBorderRadius: [15, 15, 15, 15] // 定义柱形的圆角
                }
              }
            }
          ]
        }
      ],
      kepalina: '',
      data: [
        {
          label: ['河北省分行'],
          children: [
            {
              label: '1保定分行'
            },
            {
              label: '2保定分行'
            },
            {
              label: '3保定分行'
            },
            {
              label: '4保定分行'
            }
          ]
        }
      ],
      hostDatas: {
        legend: {
          textStyle: {
            fontSize: 18,
            color: 'white'
          }
        },
        tooltip: {},
        dataset: {
          dimensions: ['product', '2015', '2016', '2017'],
          source: [
            { product: '1时', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
            { product: '2时', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
            { product: '4时', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
            { product: '6时', '2015': 72.4, '2016': 53.9, '2017': 39.1 },
            { product: '8时', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
            { product: '10时', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
            { product: '12时', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
            { product: '14时', '2015': 72.4, '2016': 53.9, '2017': 39.1 },
            { product: '16时', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
            { product: '18时', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
            { product: '20时', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
            { product: '22时', '2015': 72.4, '2016': 53.9, '2017': 39.1 },
            { product: '24时', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
          ]
        },
        xAxis: {
          type: 'category',
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: '#093f76',
              width: 0.2,
              type: 'solid',
              fontSize: 1
            }
          }
        },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#206dd1'
              }
            }
          },
          {
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#801414'
              }
            }
          },
          {
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#0f994d'
              }
            }
          }
        ]
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },

      value1: '',
      value2: ''
    }
  },
  created() {
    this.drawLine()
  },
  mounted() {
    // this.title = "啊啊啊啊啊啊"
    // this.$set(this.title,"ssssss")
  },
  methods: {
    // 选择月份
    changeMonth(start, end, current) {
      console.log('changeMonth', start.format(), end.format(), current.format())
    },
    // 点击事件
    eventClick(event, jsEvent, pos) {
      console.log('eventClick', event, jsEvent, pos)
    },
    // 点击当天
    dayClick(day, jsEvent) {
      console.log('dayClick', day, jsEvent)
    },
    // 查看更多
    moreClick(day, events, jsEvent) {
      console.log('moreCLick', day, events, jsEvent)
    },
    //   报警环形图
    drawLine() {
      var _this = this
      console.log($('#echartsviedeo'), '1111111111')
      var myChart = echarts.init(document.getElementById('echartsviedeo'))
      var myChart1 = echarts.init(document.getElementById('echartserror'))
      myChart.setOption(_this.options[3])
      myChart1.setOption(this.options[_this.keyWord])
      window.addEventListener('resize', () => {
        myChart.resize()
      })

      setInterval(function() {
        _this.options[3].series.forEach((element, index) => {
          _this.options[3].series[1].data.forEach((j, i) => {
            _this.options[3].series[1].data[i] = parseInt(Math.random() * 10 * Math.random() * 8)
          })
          // _this.options[3].series[1] = element
          myChart.setOption(_this.options[3])
        })
      }, 1100)
      window.addEventListener('resize', () => {
        myChart1.resize()
      })
    },
    peiclick(params) {
      // this.$refs.pagebref.funb();
      console.log('11111111111', params.dataIndex, this.hostDatas.series)
      this.hostDatas.series[0].data.forEach((element, index) => {
        this.hostDatas.series[0].data[index] = Math.random() * 1000 * (index + 1)
      })
      this.$set(this.hostDatas.series[0].data, this.hostDatas.series[0].data)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleOpen() {},
    handleClose() {},
    // drawLine() {
    //   var myChart = echarts.init(document.getElementById('pie'))
    //   // var myChart1 = echarts.init(document.getElementById('warning'))
    //   myChart.setOption(this.options)
    //   // myChart1.setOption(this.options)
    //   // window.addEventListener('resize', () => {
    //   //   myChart.resize()
    //   // })
    //   // window.addEventListener('resize', () => {
    //   //   myChart1.resize()
    //   // })
    // },
    // 柱状图
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('error'))
      var option = {
        //标题配置信息
        textStyle: {
          fontFamily: 'KaiTi',
          color: '#fff',
          fontSize: '10px'
        },
        xAxis: {
          show: true,
          type: 'category',
          data: ['入侵报警', '紧急报警', '门禁报警', '设备异常', '防护舱报警', '主机报警', '事件提']
        },
        yAxis: {
          show: false,
          type: 'value'
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
                color: function(params) {
                  let colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622']
                  return colorList[params.dataIndex]
                }
              }
            },
            //柱状图上显示数据
            label: {
              show: 'true',
              position: 'top',
              color: '#FFF',
              fontWeight: 'bolder',
              // backgroundColor: "auto",
              fontSize: '10'
            }
            // //平均值
            // markLine: {
            //     data: [{ type: "average", name: "平均值" }]
            // }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="less" scoped>
//用什么插件必须引入相应的样式表，否则不能正常显示
// @import '~@fullcalendar/core/main.css';
// @import '~@fullcalendar/daygrid/main.css';
#detail-body {
  width: 95%;
  margin: 0 auto;
  height: 94%;
  display: flex;
  justify-content: space-around;
}
.inputyead {
  margin-bottom: 12px;
}
.inputyead > .el-input > input {
  height: 40px;
}
.zr_0 {
  width: 100%;
  height: 100%;
}
.home,
.fillcontain {
  height: 100%;
}
.el-menu {
  border: 0;
}
.el-col {
  background-color: #eff2f7;
  height: 100%;
  overflow: auto;
}
.tree-main {
  /deep/ .el-submenu .el-menu-item {
    background-color: transparent !important;
    // background-color: #1f2d3d !important;
  }
  /deep/ .el-submenu__title:hover,
  .el-submenu .el-menu-item:hover {
    background-color: transparent !important;
    // background-color: #206dd1 !important;
  }
}
.el-submenu__title {
  width: 100%;
}
.tree-main {
  width: 16%;
  height: 100%;
  min-width: 200px;
  @media screen and (max-width: 2000px) {
    /deep/ .el-tree-node__content,
    /deep/ .el-input__inner {
      // color:red!important;

      .el-tree-node__label {
        font-size: 0.5rem;
      }
    }
  }
  @media screen and (max-width: 4000px) and (min-width: 2000px) {
    /deep/ .el-tree-node__content {
      // color:orange!important;
      height: 35px;
    }
  }
  .search-box {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: none;
    /deep/.el-input__inner {
      background: none;
      border-radius: 0;
      font-size: 0.5rem;
      border: 0.5px solid #385d7d;
    }
  }
  .el-tree {
    border: 0.5px solid #385d7d;
    background: none;
    border-radius: 0;
    height: 100%;
    /deep/ .el-tree-node__content {
      color: white;
    }
    /deep/ .el-tree-node__content:hover {
      background: rgb(47, 74, 107);
      // background:red;
      color: white;
    }
    /deep/ .el-tree-node:focus > .el-tree-node__content {
      background: rgb(47, 74, 107);
      // background:red;
      color: white;
    }
  }
}
#right-echarts {
  width: 82%;
  // height: 100%;
  // padding: 1rem;

  .top {
    width: 100%;
    height: 56%;
    display: flex;
    justify-content: space-between;

    p {
      text-align: center;
    }
    .itme {
      width: 33%;
      border: 0.5px solid #385d7d;
      height: 100%;
    }
  }
  .header-top {
    height: 50%;
    // min-height: 600px;
    color: rgb(82, 118, 152);
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    .header {
      width: 100%;
      list-style: none;
      padding: 0;
      height: 18%;
      display: flex;
      justify-content: space-between;
      li {
        width: 24.5%;
        // background: green;
        border: 0.5px solid #385d7d;
        background-color: #062d56;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1vw;
        big {
          font-size: 0.8vw;
          color: gainsboro;
        }
        img {
          width: 4vw;
          height: 4vw;
          background: rgb(11, 53, 138);
        }
        div {
          width: 40%;
          height: 40%;
          display: flex;
          padding: 1vw;
          justify-content: space-between;
          align-items: center;
          flex-direction: column;
          // background: rebeccapurple;
        }
      }
    }
    .content {
      height: 80%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: relative;
      top: 0.6vw;
      .table {
        width: 74.8%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 1vw 1vw 1vw;
        border: 0.5px solid #385d7d;
        background-color: #062d56;
      }
      .right-echarts {
        width: 24.4%;
        height: 100%;
        background: none;
        display: flex;
        flex-direction: column;
        padding: 0px;
        .title {
          position: relative;
          top: 4%;
          font-size: 0.8vw;
        }
        justify-content: space-between;
        .item {
          width: 100%;
          height: 49%;
          border: 0.5px solid #385d7d;
          background-color: #062d56;
          padding: 2%;
          box-sizing: border-box;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    // min-height: 600px;
    border: 0.5px solid #385d7d;
    height: 50%;
    position: relative;
    margin-top: 0;
    top: 0.6vw;
    // left: -1%;
    // margin-top: 3.4%;
    background-color: #062d56;
  }
}
.el-table th {
  text-align: center !important;
}
.el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
.el-table th,
.el-table tr {
  background-color: transparent;
}
// /deep/.secondClass{
//   background: blanchedalmond !important;
// }
/deep/.fc-event {
  border: 0px; /* default BORDER color */
  /*background-color: #3a87ad;  default BACKGROUND color */
  //  background:greenyellow;
  background: rgb(11, 53, 138);
  width: 100%;
  height: 100%;
  color: #fff; /* default TEXT color */
  font-size: 0.85em;
  cursor: default;
}
/deep/.fc-theme-standard td,
/deep/.fc-theme-standard th {
  /* border: 1px solid #ddd; */
  /* border: 1px solid var(--fc-border-color, #ddd); */
  border: solid 1px rgb(10, 67, 126);
}
/deep/.fc-theme-standard .fc-scrollgrid {
  /* border: solid 1px rgb(10,67,126); */
  border-top: solid 1px rgb(10, 67, 126);
  background: none;
  /* border: 1px solid var(--fc-border-color, #ddd); */
}
/deep/ .fc .fc-button-primary {
  border: solid 1px rgb(10, 67, 126);
  background: none;
  color: #527698;
}
/deep/ .fc .fc-button-primary:not(:disabled).fc-button-active {
  color: #fff;
  background: none;
  border: solid 1px rgb(10, 67, 126);
}
/deep/ .fc .fc-toolbar.fc-header-toolbar {
  /* margin-bottom: 1.5em; */
  padding: 1vw;
  margin: 0;
}
/deep/ .fc .fc-button-group > .fc-button {
  position: relative;
  flex: 1 1 auto;
  width: 4vw;
}

.container .body {
  height: auto;
  background: red;
  overflow: none;
}
.keppyre {
  padding: 1vw;
}
</style>
