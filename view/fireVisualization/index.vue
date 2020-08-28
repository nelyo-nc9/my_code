<template>
  <div id="contents-xf">
    <div>
    
    </div>
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

<style lang="less"  >
@media (min-width: 2000px) and(max-width: 3800px) {
  #contents-bigData .item-list p,
  #alarm p,
  #left-list p,
  #right-list .title ,.logo-tile p {
    font-size: 0.71vw;
    // color: red;
  }
  #right-list .text-contont,
  #right-list .text-contont p {
    font-size: 0.54vw !important;
    // color: red;
  }
  #map #tips {
    .number {
      font-size: 0.74vw !important;
      color: #15f1f3;
    }
    .group-title {
      font-size: 0.85vw !important;
      color: #15f1f3;
    }
  }
}
@media (min-width: 0px) and(max-width: 2000px) {
  //  标题 2k 
  #contents-bigData .item-list p,
  #alarm p,
  #left-list p,.logo-tile,
  #right-list .title {
    //  font-size: 0.92vw;
    // font-size: 0.68vw !important;
    font-size: 14px !important;
    color: rgba(222, 240, 255, 1);
    position: relative;
    top: -2%;
    font-weight: 700;
    // color:green !important;
  }

  #right-list #right .duty .content {
    width: 98% !important;
  }
  //  文本内容
  #right-list .text-contont,
  #right-list .text-contont p {
    // font-size: 0.781vw !important;
  font-size: 12px !important;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(222, 240, 255, 1);
    // color: blue;
  }

  #map #tips {
    .number {
      font-size: 0.74vw !important;
      color: #15f1f3;
    }
    .group-title {
      font-size: 0.85vw !important;
      // color: #15f1f3;
    }
  }
}
@media (min-width: 3800px) {

   //  首页大标题
  .bigDataHome nav {
    .homeTitle {
      font-size: 64px !important;
      line-height: 100%;
      font-weight: 700;
      // color: orange;
    }
    .logo p {
      font-size: 48px !important;
    }
  }
  


//一级标题
  
  #contents-bigData .item-list p,
  #alarm p,
  #left-list p,
  #right-list .title {
    font-size: 0.74vw;
      font-size: 48px;
    // color: orange;
    font-weight: 700;
    // color: orange;
  }

  // 文本内容
  #right-list .text-contont,
  #right-list .text-contont p,.logo-tile {
     font-size: 0.68vw !important;
       font-size: 24px;
    // color: orange;
    font-weight: 400;
    // color: orange;
  }
  #map #tips {
    .number {
      font-size: 38px !important;
      color: #15f1f3;
    }
    .group-title {
      font-size: 48px !important;
      // color: #15f1f3;
    }
  }
}

#contents-xf {
  width: 99%;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  // padding: 10px 30px;
  // less 中 calc属性失效 加入上 ~ 效果正常
  height: calc(~'100% - 2.27vw');
  display: flex;
  justify-content: space-between;

  #left-list {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* justify-items: left; */
    //  background: rgb(6,45,86);
    flex-direction: column;
    .item-list {
      width: 100%;
      height: 18%;
      background-image: url(../../../static/bigData/list-bg.png);

      background-repeat: no-repeat;
      background-size: 100% 100%;
      // margin-top: 10px;
      box-sizing: border-box;
      // padding: 4px;
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
        top: 4%;
        color:#DEF1FF;
        background: linear-gradient(to bottom,#FFFFFF,#37B3DC);
        -webkit-background-clip: text;
        color: transparent;
        text-fill-color: transparent;
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
        a {
          float: right;
          color: #33ccff;
          position: absolute;
          cursor: pointer;
          right: 4%;
          top: 0.7vw;
        }
      }
    }
  }
  #right-list {
    width: 25%;
    // background: rgb(6,45,86);
    display: flex;

    align-items: center;
    /* justify-items: left; */
    flex-direction: column;
    justify-content: space-between;
  }
  #map {
    width: 49%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>

<script>
// 消防水设备：3467
//火灾 12
// 电气 11
//12
function fontSize(res) {
  let docEl = document.documentElement,
    clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}
import hostList from './subgroup/leftList.vue'
import mapComponet from './subgroup/map.vue'
import importantAlarm from './subgroup/ImportantAlarm.vue'
import rightList from './subgroup/rightList'
import {
  equipmentStatus,
  getMap,
  rightAlarmStatistics,
  rightInspectionStatistics,
  ReaTimeAlarm,
  weeklyAlarm,
  weeklyOnline,
} from '../../http/fireVisualization/fireControlHome'
export default {
  data() {
    return {
      clearIterval: null,
      // 模拟主机报价数据
      hostData: [
        {
          textStyle: {
            fontFamily: 'Microsoft YaHei',
          },
          name: '消防水系统设备运行状态 ',
          wdith: '80%',
          height: '80%',
          isWater: true,
          typeArr: [3, 4, 5, 6],
             typeArrS:'[3, 4, 5, 6]',
          legend: {
            icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            orient: 'vertical',
            itemHeight: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemGap: 4,
            bottom: "4%",
            borderRadius: 0,
            left: "4%",
            axisLabel: {
              interval: 1,
            },

            textStyle: {
              fontSize: fontSize(0.12),
              color: 'white',
            },
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside', // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: '10',
                fontWeight: '400',
              },
            },
          },

          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b}: {c} ({d}%)',
          // },
          series: [
            {
              // name: '访问来源1111',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              // 饼状图调整位置
              center: ['50%', '70%'],
              selectedMode: 'single',
              label: {
                //展示文本设置

                // color:"red",
                normal: {
                  //  饼状图折线展示外部
                  show: true, //展示
                  position: 'outside', // outside表示文本显示位置为外部
                  fontSize: fontSize(0.12),
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  textStyle: {
                    //文本样式
                    fontSize: fontSize(0.12),
                    fontWeight: '600',
                  },
                },
              },
              labelLine: {
                lineStyle: {
                  color: 'white',
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: fontSize(0.12),
                  fontWeight: 'bold',
                },
              },

              data: [
                { value: 0, name: `运行异常设备数${this.value}台`, itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 0, name: '停用设备数25台', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 0, name: '正常运行设备数15台', itemStyle: { color: 'rgb(220,70,30)' } },
              ],
            },
          ],
        },
        {
          textStyle: {
            fontFamily: 'Microsoft YaHei',
          },
          typeArr: [10],
          typeArrS:"[10]",
          name: '火灾报警系统设备运行状态 ',
          wdith: '80%',
          height: '80%',
          isWater: true,
          legend: {
            icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            orient: 'vertical',
             itemHeight: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemGap: 4,
            bottom: "4%",
            borderRadius: 0,
            left: "4%",
            axisLabel: {
              interval: 1,
            },

            textStyle: {
              fontSize: fontSize(0.12),
              color: 'white',
            },
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside', // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: '10',
                fontWeight: '400',
              },
            },
          },

          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b}: {c} ({d}%)',
          // },
          series: [
            {
              // name: '访问来源1111',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              // 饼状图调整位置
              center: ['50%', '70%'],
              selectedMode: 'single',
              label: {
                //展示文本设置

                // color:"red",
                normal: {
                  //  饼状图折线展示外部
                  show: true, //展示
                  position: 'outside', // outside表示文本显示位置为外部
                  fontSize: fontSize(0.12),
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  textStyle: {
                    //文本样式
                    fontSize: fontSize(0.12),
                    fontWeight: '600',
                  },
                },
              },
              labelLine: {
                lineStyle: {
                  color: 'white',
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: fontSize(0.12),
                  fontWeight: 'bold',
                },
              },

              data: [
                { value: 335, name: `运行异常设备数${this.value}台`, itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 679, name: '停用设备数25台', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '正常运行设备数15台', itemStyle: { color: 'rgb(220,70,30)' } },
              ],
            },
          ],
        },
        {
          typeArr: [11],
          typeArrS: '[11]',
          textStyle: {
            fontFamily: 'Microsoft YaHei',
          },
          name: '电气火灾报警设备运行状态 ',
          wdith: '80%',
          height: '80%',
          legend: {
            icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            orient: 'vertical',
            itemHeight: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemGap: 4,
            bottom: "4%",
            borderRadius: 0,
            left: "4%",
            axisLabel: {
              interval: 1,
            },

            textStyle: {
              fontSize: fontSize(0.12),
              color: 'white',
            },
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside', // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: '10',
                fontWeight: '400',
              },
            },
          },

          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b}: {c} ({d}%)',
          // },
          series: [
            {
              // name: '访问来源1111',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              // 饼状图调整位置
              center: ['50%', '70%'],
              selectedMode: 'single',
              label: {
                //展示文本设置

                // color:"red",
                normal: {
                  //  饼状图折线展示外部
                  show: true, //展示
                  position: 'outside', // outside表示文本显示位置为外部
                  fontSize: fontSize(0.12),
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  textStyle: {
                    //文本样式
                    fontSize: fontSize(0.12),
                    fontWeight: '600',
                  },
                },
              },
              labelLine: {
                lineStyle: {
                  color: 'white',
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: fontSize(0.12),
                  fontWeight: 'bold',
                },
              },

              data: [
                { value: 335, name: `运行异常设备数${this.value}台`, itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 679, name: '停用设备数25台', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '正常运行设备数15台', itemStyle: { color: 'rgb(220,70,30)' } },
              ],
            },
          ],
        },
        {
          typeArr: [12],
          typeArrS: '[12]',
          textStyle: {
            fontFamily: 'Microsoft YaHei',
          },
          name: '烟感独立设备运行状态 ',
          wdith: '80%',
          height: '80%',
          legend: {
            icon: 'circle', //ECharts 提供的标记类型有 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            orient: 'vertical',
             itemHeight: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemGap: 4,
            bottom: "4%",
            borderRadius: 0,
            left: "4%",
            axisLabel: {
              interval: 1,
            },

            textStyle: {
              fontSize: fontSize(0.12),
              color: 'white',
            },
          },
          label: {
            //展示文本设置
            color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside', // outside表示文本显示位置为外部,
              // color:'red'
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                fontSize: '10',
                fontWeight: '400',
              },
            },
          },

          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b}: {c} ({d}%)',
          // },
          series: [
            {
              // name: '访问来源1111',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              // 饼状图调整位置
              center: ['50%', '70%'],
              selectedMode: 'single',
              label: {
                //展示文本设置

                // color:"red",
                normal: {
                  //  饼状图折线展示外部
                  show: true, //展示
                  position: 'outside', // outside表示文本显示位置为外部
                  fontSize: fontSize(0.12),
                },
                emphasis: {
                  //文本样式
                  show: true, //展示
                  textStyle: {
                    //文本样式
                    fontSize: fontSize(0.12),
                    fontWeight: '600',
                  },
                },
              },
              labelLine: {
                lineStyle: {
                  color: 'white',
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: fontSize(0.12),
                  fontWeight: 'bold',
                },
              },

              data: [
                { value: 335, name: `运行异常设备数${this.value}台`, itemStyle: { color: 'rgb(59,192,104)' } },
                { value: 679, name: '停用设备数25台', itemStyle: { color: 'rgb(253,160,27)' } },
                { value: 158, name: '正常运行设备数15台', itemStyle: { color: 'rgb(220,70,30)' } },
              ],
            },
          ],
        },
      ],
    }
  },
  created() {
    this.initLeftData()
    this.getHomeData() 
      console.log('$(".container .nav")',$(".container .nav"))
      $(".container .nav").hide() 
  },
  mounted(){ 
      console.log('$(".container .nav")',$(".container .nav"))
      $(".container .nav").hide() 
  },
  beforeDestroy() {
    var _this = this
    if (_this.clearIterval) {
      clearInterval(_this.clearIterval)
    }
  },
  components: {
    hostList,
    mapComponet,
    importantAlarm,
    rightList,
  },
  methods: {
    // 定时拉去数据

    getHomeData() {
      var _this = this
      var setp = localStorage.getItem('interval') || 60000

      var clearIterval = setInterval(() => {
        this.initLeftData()
      }, setp)
      _this.clearIterval = clearIterval
    },
    initLeftData() {
      var _this = this
      _this.hostData.forEach((item) => {
        item.series.forEach((items) => {
          _this.getData(item, items)
        })
      })
    },
    getData(item, items, index) {
      var _this = this
      var params = { isAll: false, hostType: item.typeArrS }
      // 水系统  请求另外参数
      if (item.isWater) {
        params.isWater = true
      }
      equipmentStatus(params).then(
        (res) => {
          console.log(res, 'res.data')
          // console.log('type:'+type+"::", res.data.data[type])
          items.data[0].value = res.data.data.error
          items.data[1].value = res.data.data.live
          items.data[2].value = res.data.data.offline
          items.data[0].name = `运行设备异常数${res.data.data.error} 台`
          items.data[1].name = `停用设备数 ${res.data.data.live} 台`
          items.data[2].name = `正常运行设备数${res.data.data.offline} 台`
          console.log('item:', res.data.data.offline)
        },
        function (rej) {
          console.log(rej, 'rej')
        }
      )
    },
    jump(index) {
      switch (index) {
        case 0:
          // 消防 
          this.$router.push({ name: 'accesscControlDataaccesscControlData', params: { title: '视频数据',id:1} })
          break
        case 1:
          // 火灾
          this.$router.push({ name: 'accesscControlDataaccesscControlData', params: { title: '门禁数据',id:2 } })

          break
        case 2:
          // this.$router.push('/bigData/basicData/')

          this.$router.push({ name: 'fireVisualizationwarningData', params: { title: '对讲数据' ,id:4} })
          break
        case 3:
          this.$router.push({ name: 'accesscControlDataaccesscControlData', params: { title: '报警数据',id:3 } })
          break
      }
    },
  },
}
</script>
