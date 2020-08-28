
<template>
  <div id="detail-body">
    <div class="tree_btn" @click="closeTree">
      <img :src="treeBack" alt />
    </div>
    <div class="tree-main" ref="treeMain" :style="'width:'+ treeWidth">
      <div class="left-tree">
        <p class="tree_title">
          机构树
          <i class="el-icon-refresh-right" v-show="false"></i>
        </p>
        <orgTree
          ref="tree"
          :lazyTreeApi="getTreeApis"
          :customizeQuery="customizeQuery"
          :treeType="treeType"
          iconToggle
          treeLazyToggle
          :checkRecursionToggle="false"
          searchType="filter"
          @onceClick="onceClick"
          @rootId="rootId"
        ></orgTree>
      </div>
    </div>
    <div class="right-echarts" ref="rightBox" :style="'width:'+ rightWidth">
      <div class="top">
        <div class="itme font_size" id="pie">
          <p>{{name}}数量重点部位统计</p>
          <Pie :options="options" :index="0" ref="pieCount"></Pie>
        </div>
        <div v-for="(item, index) in hostData" :key="index" class="itme font_size">
          <p v-if="index == 0">{{name}}在线运行状态</p>
          <p v-else>{{name}}在线运行状态同比分析</p>
          <hostList :item="item" :index="index" :key="index" ref="refData"></hostList>
        </div>
      </div>
      <div class="bottom">
        <div :class="btn_box" @click="openClose">
          <!-- <i :class="btn_class"></i> -->
          <img src="../../../../static/bigData/pie_icon.png" alt />
        </div>
        <!-- <p>门禁主机在线运行状态分析</p> -->
        <!-- 兄弟组件之间传值 -->
        <div class="plain" id="plain3">
          <p>{{name}}事件统计分析</p>
          <hostList :item="hostDatas" ref="pagebref" :index="2"></hostList>
        </div>
        <div class="pie" v-show="showPie">
          <Pie :options="options2" :index="1" @peiclick="peiclick" ref="eventPie"></Pie>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hostList from '../subgroup/leftList.vue'
import Pie from '../subgroup/pie.vue'
import orgTree from '@src/components/tree/treeBox'
import { mapState, mapMutations, mapActions } from 'vuex'
import { getTreeApi } from '@src/http/alarmBigData/bigDataDetail.api'
import { save, read } from '../../../storage/index'

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

export default {
  name: 'VideoTree',
  components: {
    hostList,
    Pie,
    orgTree
  },
  props: ['title'],
  data() {
    return {
      name: '',
      pieTitle: '',
      treeType: 3,
      subSystem: 1,
      isGetCount: true,
      customizeQuery: {},
      hostDatas: {
        wdith: '100%',
        height: '70%',
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontFamily: 'Microsoft YaHei'
          }
        },
        // title: {
        //   text: '视频主机事件统计分析',
        //   left: 'center',
        //   padding: [10, 20],
        //   textStyle: {
        //     //标题颜色
        //     color: '#fff',
        //     fontSize: 18,
        //     fontFamily: 'Microsoft YaHei',
        //     fontWeight: 800
        //   }
        // },
        legend: {
          // top: 'bottom',
          bottom: '2%',
          data: ['IO输入', '设备异常', '视频丢失'],
          textStyle: {
            // 图例文字的样式
            color: 'rgba(222, 241, 255, 1)',
            fontFamily: 'Microsoft YaHei',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '-1%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#2F5682', // 左边线的颜色
              width: '1', // 坐标线的宽度
              fontSize: 1
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            }
          },
          data: [
            '00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00',
            '03:30',
            '04:00',
            '04:30',
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30'
          ]
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#2F5682', // 左边线的颜色
              width: '1', // 坐标线的宽度
              fontSize: 1
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            }
          },
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(228,230,241,0.46)'],
              width: 0.2,
              type: 'solid'
            }
          }
        },
        series: [
          {
            color: ['#e2953c'],
            name: 'IO输入',
            smooth: true,
            symbol: 'none',
            data: [],
            type: 'line'
          },
          {
            color: ['#6dc23e'],
            name: '设备异常',
            smooth: true,
            symbol: 'none',
            data: [],
            // areaStyle: {},
            type: 'line'
          },
          {
            color: ['#7accfd'],
            name: '视频丢失',
            smooth: true,
            symbol: 'none',
            data: [],
            type: 'line'
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      keyWord: '',
      options2: {
        label: {
          // 展示文本设置
          normal: {
            show: true, // 展示
            position: 'outside' // outside表示文本显示位置为外部
          },
          emphasis: {
            // 文本样式
            show: true, // 展示
            textStyle: {
              // 文本样式
              fontSize: '14',
              fontWeight: '600'
            }
          }
        },
        labelLine: {
          // 引导线设置
          normal: {
            show: true // 引导线显示
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          textStyle: {
            fontFamily: 'Microsoft YaHei'
          }
        },
        graphic: [
          {
            // 图形中间文字
            type: 'text',
            left: 'center',
            top: '37%',
            style: {
              text: '总数',
              textAlign: 'center',
              fill: '#fff',
              fontSize: fontSize(0.16),
              fontFamily: 'Microsoft YaHei'
            }
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: '0',
              textAlign: 'center',
              fill: '#fff',
              fontSize: fontSize(0.24),
              fontWeight: 800,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: true,
            center: ['50%', '50%'],
            label: {
              // 展示文本设置
              normal: {
                //  饼状图折线展示外部
                show: true, // 展示
                position: 'outside', // outside表示文本显示位置为外部
                formatter: '{b} {d}%'
              },
              emphasis: {
                // 文本样式
                show: true, // 展示
                textStyle: {
                  // 文本样式
                  fontSize: '14',
                  fontWeight: '600',
                  fontFamily: 'Microsoft YaHei'
                }
              }
            },
            labelLine: {
              // 引导线设置
              normal: {
                show: true // 引导线显示
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
                fontFamily: 'Microsoft YaHei'
              }
            },
            data: [0]
          }
        ]
      },
      options: {
        color: ['#c43e2a', '#93c92b', '#d57f17', '#008D89', '#e4a45f', '#905ec7', '#327331', '#d3d3d3', '#b71c69'],
        title: {
          show: true,
          left: 'center',
          padding: [10, 20],
          textStyle: {
            color: '#fff',
            // fontSize: fontSize(),
            fontWeight: 900,
            fontFamily: 'Microsoft YaHei'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          textStyle: {
            fontFamily: 'Microsoft YaHei'
          }
        },
        graphic: [
          {
            // 图形中间文字
            type: 'text',
            left: 'center',
            top: '50%',
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
            top: '60%',
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
            radius: ['40%', '60%'],
            avoidLabelOverlap: true, // 防止标签重叠
            center: ['50%', '60%'],
            label: {
              // 展示文本设置
              normal: {
                //  饼状图折线展示外部
                show: true, // 展示
                position: 'outside' // outside表示文本显示位置为外部
              },
              emphasis: {
                // 文本样式
                show: true, // 展示
                textStyle: {
                  // 文本样式
                  fontSize: '14',
                  fontWeight: '600'
                }
              }
            },
            labelLine: {
              // 引导线设置
              normal: {
                show: true // 引导线显示
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            data: [0]
          }
        ]
      },
      hostData: [
        {
          grid: {
            left: '1%',
            top: '18%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          },
          wdith: '80%',
          height: '70%',
          legend: {
            icon: 'rect',
            // orient: 'vertical',// 设置并排
            selectedMode: false,
            itemHeight: 10,
            itemWidth: 10,
            itemGap: 3,
            bottom: '0%',
            axisLabel: {
              interval: 1
            },
            data: ['离线', '在线'],
            textStyle: {
              fontSize: 12,
              color: 'white',
              fontFamily: 'Microsoft YaHei'
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            },
            data: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', // 左边线的颜色
                width: '1', // 坐标线的宽度
                fontSize: 1
              }
            }
          },
          yAxis: {
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            },
            type: 'value',
            // 网格样式
            splitLine: {
              show: false,
              fontSize: 12
            },

            axisLine: {
              lineStyle: {
                color: '#1b6b8f', // 左边线的颜色
                width: '1' // 坐标线的宽度
              }
            }
          },
          series: [
            {
              name: '离线',
              color: '#f18005',
              data: [],
              // smooth: true,
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#f18005', // #0082f9
                width: 2
              }
            },
            {
              name: '在线',
              color: '#0082f9', //
              data: [],
              // type: 'line',
              // smooth: true,
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#0082f9', //
                width: 2
              }
            }
          ]
        },
        {
          grid: {
            left: '1%',
            top: '18%',
            containLabel: true
          },
          wdith: '80%',
          height: '70%',
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          },
          legend: {
            icon: 'rect',
            // orient: 'vertical',// 设置并排
            itemHeight: 10,
            itemWidth: 10,
            itemGap: 3,
            bottom: '0%',
            selectedMode: false,
            axisLabel: {
              interval: 1
            },
            data: ['昨日', '今日'],
            textStyle: {
              fontSize: 12,
              color: 'white',
              fontFamily: 'Microsoft YaHei'
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            },
            data: [],
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', // 左边线的颜色
                width: '1', // 坐标线的宽度
                fontSize: 1
              }
            }
          },
          yAxis: {
            type: 'value',
            // 网格样式
            splitLine: {
              show: false,
              fontSize: 1
            },
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', // 左边线的颜色
                width: '1' // 坐标线的宽度
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(222, 241, 255, 1)',
                fontFamily: 'Microsoft YaHei'
              }
            }
          },
          series: [
            {
              name: '昨日',
              type: 'line',
              color: '#E26D13',
              data: [],
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#E26D13', // #f18005
                width: 2
              }
            },
            {
              name: '今日',
              color: 'rgb(106,161,78)', //
              data: [],
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: 'rgb(106,161,78)', //
                width: 2
              }
            }
          ]
        }
      ],
      showPie: true,
      btn_class: 'el-icon-open',
      btn_box: 'open_btn',
      treeShow: true,
      treeBack: '../../../../static/bigData/back_icon.png',
      timer: 0,
      treeWidth: '15%',
      rightWidth: '85%'
    }
  },
  beforeCreate() {
    console.log('before:', this.allCount)
  },
  created() {
    let thisName = ''

    if (this.$route.params.title) {
      if (this.$route.params.title === '视频数据') {
        this.subSystem = 1
        thisName = '视频主机'
        this.baseVideoData()
      } else if (this.$route.params.title === '门禁数据') {
        this.subSystem = 3
        thisName = '门禁主机'
        this.baseDoorData()
      } else if (this.$route.params.title === '对讲数据') {
        this.subSystem = 4
        thisName = '对讲主机'
        this.baseAudioData()
      }
      save('titleName', thisName)
      this.changeTitle({ titleName: thisName })
    } else {
      thisName = read('titleName')
      if (thisName === '视频主机') {
        this.subSystem = 1
        this.baseVideoData()
      } else if (thisName === '门禁主机') {
        this.subSystem = 3
        this.baseDoorData()
      } else if (thisName === '对讲主机') {
        this.subSystem = 4
        this.baseAudioData()
      }
    }

    // this.pieTitle = `${thisName}数量重点部位统计`
    this.name = thisName
  },
  mounted() {},
  computed: {
    ...mapState('alarmBigData', {
      titleName: state => state.titleName,
      allCount: state => state.allCount,
      tvTotal: state => state.tvTotal,
      dayNowCount: state => state.dayNowCount,
      dayNowAndTos: state => state.dayNowAndTos,
      tvBranchCount: state => state.tvBranchCount,
      eventCounts: state => state.eventCount,
      doorLineCount: state => state.doorLineCount,
      doorDayYesCount: state => state.doorDayYesCount,
      doorBranchCount: state => state.doorBranchCount,
      doorBranchEventCount: state => state.doorBranchEventCount,
      doorEventCount: state => state.doorEventCount,
      audioLineCount: state => state.audioLineCount,
      audioDayYesCount: state => state.audioDayYesCount,
      audioBranchCount: state => state.audioBranchCount,
      audioBranchEventCount: state => state.audioBranchEventCount,
      audioEventCount: state => state.audioEventCount
    })
  },
  methods: {
    ...mapMutations('alarmBigData', [
      'changeTitle',
      'changeCountList',
      'totalEveryCount',
      'dayCountNow',
      'dayNowAndTo',
      'tvCount',
      'eventCount'
    ]),
    ...mapActions('alarmBigData', [
      'getAllcount',
      'getEveryCount',
      'getDayNowCounts',
      'getDayAndTomCounts',
      'getTvEventCount',
      'getEventCount',
      'getDoorLineState',
      'getDoorDayAndYer',
      'getDoorBranchCount',
      'getDoorBranchEventCount',
      'getDoorHourCount',
      'getAudioLineState',
      'getAudioDayAndYer',
      'getAudioBranchCount',
      'getAudioBranchEventCount',
      'getAudioHourCount'
    ]),
    // 获取树机构根节点
    getTreeApis(params) {
      params.subSystem = this.subSystem
      // console.log('params::', params)
      return getTreeApi(params)
    },
    // 左侧树
    onceClick(data, node) {
      console.log(data)
      const options = {
        startTime: this.$moment(new Date()).format('YYYY-MM-DD 00:00:00'),
        endTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      if (data.tierType === 'org') {
        options.orgId = data.id
      } else if (data.tierType === 'loc') {
        options.locationId = data.id
      }
      // this.getDayCount(options)
    },
    rootId(id) {
      this.currentOrgId = id
    },
    async peiclick(params) {
      if (this.name == '视频主机') {
        if (params.componentType == 'graphic') {
          await this.getEventCount({
            testObj: [
              {
                input: { name: '03:30', total: 0 },
                miss: { name: '03:30', total: 4 },
                exception: { name: '03:30', total: 8 }
              },
              {
                input: { name: '04:00', total: 30 },
                miss: { name: '04:00', total: 45 },
                exception: { name: '04:00', total: 35 }
              }
            ]
          })
          setTimeout(() => {
            this.hostDatas.series[0].data = this.eventCount.input
            this.hostDatas.series[1].data = this.eventCount.exception
            this.hostDatas.series[2].data = this.eventCount.miss
          }, 100)
        }
      }

      // this.hostDatas.series[0].data.forEach((element, index) => {
      //   this.hostDatas.series[0].data[index] = Math.random() * 1000 * (index + 1)
      // })
      // this.$set(this.hostDatas.series[0].data, this.hostDatas.series[0].data)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    openClose() {
      this.showPie = !this.showPie
    },
    beforeunloadHandler() {
      window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('alarm_bigdata_store', JSON.stringify(this.$store.state))
      })
    },
    baseVideoData() {
      console.log('加载：', this.allCount)
      // this.getAllcount() // 获取主机总数
      this.options.graphic[1].style.text = this.allCount

      this.getEveryCount() // 获取分布主机统计数
      this.options.series[0].data = this.tvTotal.length > 0 ? this.tvTotal : [0]

      this.getDayNowCounts() // 今日在线离线统计
      this.getDayAndTomCounts() // 昨日今日对比

      this.getTvEventCount() // 获取事件分布数量

      this.getEventCount() // 事件统计分析
    },
    baseDoorData() {
      this.getDoorBranchCount() // 获取分布主机统计数
      this.options.graphic[1].style.text = this.allCount
      this.getDoorLineState()
      this.getDoorDayAndYer()

      this.getDoorBranchEventCount()

      this.getDoorHourCount()
    },
    baseAudioData() {
      this.getAudioBranchCount() // 获取分布主机统计数
      this.options.series[0].data = this.audioBranchCount
      this.options.graphic[1].style.text = this.allCount
      this.getAudioLineState() // 今日在线离线统计
      this.getAudioDayAndYer() // 昨日今日对比

      this.getAudioBranchEventCount() // 获取事件分布数量

      this.getAudioHourCount() // 获取事件每半小时分布
    },
    closeTree() {
      this.treeShow = !this.treeShow
      if (this.treeShow) {
        this.treeBack = '../../../../static/bigData/back_icon.png'
        this.speedAddWidth(0)
        // const width = treeMain.style.width
      } else {
        this.treeBack = '../../../../static/bigData/open_icon.png'
        this.speedSubWidth(15)
      }
    },
    speedSubWidth(num) {
      clearInterval(this.timer)
      let width = 85
      this.timer = setInterval(() => {
        num--
        width++
        this.rightWidth = `${width}%`
        this.treeWidth = `${num}%`

        if (num <= 0) {
          clearInterval(this.timer)
          this.drawMore()
        }
      }, 30)
    },
    speedAddWidth(num) {
      clearInterval(this.timer)
      let width = 100
      this.timer = setInterval(() => {
        num++
        width--
        this.rightWidth = `${width}%`
        this.treeWidth = `${num}%`
        if (num >= 15) {
          clearInterval(this.timer)
          this.drawMore()
        }
      }, 30)
    },
    drawMore() {
      this.$refs.pieCount.drawLine(this.options)
      this.$refs.eventPie.drawLine(this.options2)
      this.$refs.pagebref.drawLine(this.hostDatas)
      this.$nextTick(() => {
        this.$refs.refData.forEach((item, index) => {
          item.drawLine(this.hostData[index])
        })
      })
    }
  },
  watch: {
    keyWord(val) {
      console.log(val)
    },
    allCount(val) {
      this.options.graphic[1].style.text = this.allCount
      this.$refs.pieCount.drawLine(this.options)
    },
    tvTotal(val) {
      this.options.series[0].data = this.tvTotal.length > 0 ? this.tvTotal : [0]
      this.$refs.pieCount.drawLine(this.options)
    },
    dayNowCount(val) {
      this.hostData[0].xAxis.data = this.dayNowCount.time
      this.hostData[0].series[0].data = this.dayNowCount.offline
      this.hostData[0].series[1].data = this.dayNowCount.online
      this.drawMore()
    },
    dayNowAndTos(val) {
      this.hostData[1].xAxis.data = this.dayNowAndTos.time
      this.hostData[1].series[0].data = this.dayNowAndTos.yesterday
      this.hostData[1].series[1].data = this.dayNowAndTos.day
      this.drawMore()
    },
    tvBranchCount(val) {
      this.options2.series[0].data = this.tvBranchCount.data
      this.options2.graphic[1].style.text = this.tvBranchCount.total
      this.$refs.eventPie.drawLine(this.options2)
    },
    eventCounts() {
      this.hostDatas.series[0].data = this.eventCounts.input
      this.hostDatas.series[1].data = this.eventCounts.exception
      this.hostDatas.series[2].data = this.eventCounts.miss
      this.drawMore()
    },
    doorBranchCount() {
      this.options.series[0].data = this.doorBranchCount.length > 0 ? this.doorBranchCount : [0]
      this.$refs.pieCount.drawLine(this.options)
    },
    doorLineCount() {
      this.hostData[0].xAxis.data = this.doorLineCount.time
      this.hostData[0].series[0].data = this.doorLineCount.offline
      this.hostData[0].series[1].data = this.doorLineCount.online
      this.drawMore()
    },
    doorDayYesCount() {
      this.hostData[1].xAxis.data = this.doorDayYesCount.time
      this.hostData[1].series[0].data = this.doorDayYesCount.yesterday
      this.hostData[1].series[1].data = this.doorDayYesCount.day
      this.drawMore()
    },
    doorBranchEventCount() {
      this.options2.series[0].data = this.doorBranchEventCount.data
      this.options2.graphic[1].style.text = this.doorBranchEventCount.total
      this.options.graphic[1].style.text = this.allCount
      this.drawMore()
    },
    doorEventCount() {
      this.hostDatas.height = '75%'
      this.hostDatas.legend.show = false
      this.hostDatas.series = [
        {
          color: ['#8AC9F9'],
          name: '开关门事件',
          smooth: true,
          symbol: 'none',
          data: [120],
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(138,201,249,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(138,201,249,0)'
                }
              ])
            }
          },
          type: 'line'
        }
      ]
      this.hostDatas.series[0].data = this.doorEventCount.input
      this.drawMore()
    },
    audioBranchCount() {
      this.options.series[0].data = this.audioBranchCount.length > 0 ? this.audioBranchCount : [0]
      this.$refs.pieCount.drawLine(this.options)
    },
    audioLineCount() {
      this.hostData[0].xAxis.data = this.audioLineCount.time
      this.hostData[0].series[0].data = this.audioLineCount.offline
      this.hostData[0].series[1].data = this.audioLineCount.online
      this.drawMore()
    },
    audioDayYesCount() {
      this.hostData[1].xAxis.data = this.audioDayYesCount.time
      this.hostData[1].series[0].data = this.audioDayYesCount.yesterday
      this.hostData[1].series[1].data = this.audioDayYesCount.day
      this.drawMore()
    },
    audioBranchEventCount() {
      this.options2.series[0].data = this.audioBranchEventCount.data
      this.options2.graphic[1].style.text = this.audioBranchEventCount.total
      this.options.graphic[1].style.text = this.allCount
      this.drawMore()
    },
    audioEventCount() {
      this.hostDatas.height = '75%'
      this.hostDatas.legend.show = false
      this.hostDatas.series = [
        {
          color: ['#E49436'],
          name: '对讲请求事件',
          smooth: true,
          symbol: 'none',
          data: [120, 832, 531],
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(228,148,54,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(228,148,54,0)'
                }
              ])
            }
          },
          type: 'line'
        }
      ]
      this.hostDatas.series[0].data = this.audioEventCount.input
      this.drawMore()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ * {
  font-family: '微软雅黑';
}
#detail-body {
  width: 96%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  margin-top: 1rem;
  position: relative;
  .tree_btn {
    position: absolute;
    top: 50%;
    left: -2%;
    transform: translateY(-100%);
    cursor: pointer;
  }
}
.tree-main {
  text-align: left;
  height: 95%;
  .tree_title {
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    position: relative;
    i {
      position: absolute;
      right: 1vw;
      top: 1vh;
      cursor: pointer;
    }
  }
  @media screen and (max-width: 4000px) {
    .tree_title {
      font-size: 0.38vw;
      font-family: 'Microsoft YaHei';
      font-weight: bold;
      color: rgba(222, 241, 255, 1);
    }
  }
  @media screen and (min-width: 4000px) {
    .tree_title {
      font-size: 0.76vw;
      font-family: 'Microsoft YaHei';
      font-weight: bold;
      color: rgba(222, 241, 255, 1);
    }
  }
  /deep/.left-tree {
    height: 96.5%;
    border: 0.5px solid #385d7d;
    /deep/.el-input__inner {
      color: white;
    }
    /*定义滚动条样式（高宽及背景）*/
    /deep/::-webkit-scrollbar {
      width: 6px; /* 滚动条宽度， width：对应竖滚动条的宽度  height：对应横滚动条的高度*/
      background: rgb(47, 74, 107);
    }
    /*定义滚动条轨道（凹槽）样式*/
    /deep/::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); /* 较少使用 */
      border-radius: 3px;
    }
    /*定义滑块 样式*/
    /deep/::-webkit-scrollbar-thumb {
      border-radius: 3px;
      height: 100px; /* 滚动条滑块长度 */
      background-color: #007acc;
    }
  }
  /deep/.treeBox {
    padding: 0 !important;
  }
  /deep/.tree {
    height: 95.8% !important;
  }
  /deep/ .el-submenu .el-menu-item {
    background-color: transparent !important;
    // background-color: #1f2d3d !important;
  }
  /deep/ .el-submenu__title:hover,
  .el-submenu .el-menu-item:hover {
    background-color: transparent !important;
    // background-color: #206dd1 !important;
  }
  /deep/ .el-tree-node__content {
    color: white;
    border-left: none;
  }
  /deep/ .el-tree-node__content:hover,
  .el-tree-node__content:active {
    background: rgb(47, 74, 107);
    // background:red;
    color: white;
  }
  /deep/ .el-tree-node:focus > .el-tree-node__content,
  /deep/.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: rgb(47, 74, 107);
    // background:red;
    color: white;
  }
  /deep/.treeText {
    color: white !important;
  }
  /deep/.el-input__inner {
    background: none;
    border-radius: 0;
    font-size: 0.5rem;
    border: 0.5px solid #385d7d;
    text-align: left;
  }
  /deep/.treeLazy .treeInfo {
    height: 40px;
  }
}

.tree-main {
  width: 16%;
  height: 95%;
  // min-width: 200px;
  overflow: hidden;
  @media screen and (max-width: 2000px) {
    /deep/ .el-tree-node__content,
    /deep/ .el-input__inner {
      // color:red!important;
      height: 30px;
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
    margin-top: 0.5rem;
    background: none;
    /deep/.el-input__inner {
      background: none;
      border-radius: 0;
      font-size: 0.5rem;
      border: 0.5px solid #385d7d;
    }
  }
  /deep/.el-tree {
    margin-top: 0.5rem;
    // border: 0.5px solid #385d7d;
    border: none !important;
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

.right-echarts {
  width: 87%;
  height: 100%;
  padding: 0 1rem;
  .top {
    width: 100%;
    height: 30%;
    display: flex;
    justify-content: space-between;
    p {
      text-align: center;
    }
    .itme {
      width: 33%;
      border: 1.5px solid #2d507d;
      height: 100%;
      position: relative;
      p {
        width: 100%;
        text-align: center;
        font-size: 18px;
        margin-top: 0.3rem;
        position: absolute;
      }
    }
    @media screen and (max-width: 4000px) {
      .font_size p {
        font-size: 0.38vw;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        color: rgba(222, 241, 255, 1);
      }
    }
    @media screen and (min-width: 4000px) {
      .font_size p {
        font-size: 0.76vw;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        color: rgba(222, 241, 255, 1);
      }
    }
  }
  .bottom {
    width: 100%;
    border: 1.5px solid #2d507d;
    height: 61%;
    margin-top: 0.5%;
    position: relative;
    .open_btn {
      width: 1.5vw;
      height: 1.5vw;
      position: absolute;
      right: 1vw;
      top: 1vh;
      z-index: 99;
      color: white;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .plain {
      height: 100%;
      p {
        width: 100%;
        text-align: center;
        font-size: 18px;
        margin-top: 0.3rem;
        position: absolute;
      }
      @media screen and (max-width: 4000px) {
        p {
          font-size: 0.38vw;
          font-family: 'Microsoft YaHei';
          font-weight: bold;
          color: rgba(222, 241, 255, 1);
        }
      }
      @media screen and (min-width: 4000px) {
        p {
          font-size: 0.76vw;
          font-family: 'Microsoft YaHei';
          font-weight: bold;
          color: rgba(222, 241, 255, 1);
        }
      }
    }
    .pie {
      width: 30%;
      height: 30%;
      position: absolute;
      top: 5%;
      right: 2%;
    }
  }
}
</style>
