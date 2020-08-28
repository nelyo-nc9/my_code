<template >
  <div id="right">
    <div class="duty list">
      <p class="title">值班情况</p>
      <div class="content content_top">
        <div class="img_left">
          <!-- <img
            src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=411076978,3259038998&fm=26&gp=0.jpg"
            alt="值班人照片"
          />-->
          <div class="people"></div>
        </div>
        <div class="text-contont">姓名</div>
        <div class="info_right text-contont">
          <div>
            <p>
              <span class="tetx_left">职务</span>
              <span class="text_right">值班长</span>
            </p>
            <p>
              <span class="tetx_left">管理区域</span>
              <span class="text_right">xx营业网点、xx营业网点</span>
            </p>
            <p>
              <span class="tetx_left">值班时间</span>
              <span class="text_right">2020-3-25 08:00-12:00</span>
            </p>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="img_left">
          <div class="people"></div>
        </div>
        <div class="text-contont">姓名</div>
        <div class="info_right text-contont">
          <div>
            <p>
              <span class="tetx_left">职务</span>
              <span class="text_right">值班长</span>
            </p>
            <p>
              <span class="tetx_left">管理区域</span>
              <span class="text_right">xx营业网点、xx营业网点</span>
            </p>
            <p>
              <span class="tetx_left">值班时间</span>
              <span class="text_right">2020-3-25 08:00-12:00</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="equipment list">
      <p class="title">
        已入网设备资产统计
        <a @click="jump()">详情</a>
      </p>
      <div class="content" id="equipment">
        <div id="viedeo"></div>
        <div id="warning"></div>
      </div>
    </div>
    <div class="warning list">
      <p class="title">报警分类统计</p>
      <div id="error">
        <!-- <Pie :options="barOptions" :index="9"></Pie> -->
      </div>
    </div>
  </div>
</template>
<script>
// import Pie from '../subgroup/pie.vue'

import { rightAccessStatistics ,VideoCount,warnCount} from '../../../http/bigData/bigDataHome'
import thirlistsVue from '../../business/businesssystem/recognitionsystem/pushDirs/thirlists.vue'

// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

function fontSize(res) {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) {
    return
  }
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}

// 获取指定xxx天前日期  -7/-1
function fun_data(aa) {
  let date1 = new Date()
  // let  time1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() // time1表示当前时间

  var date2 = new Date(date1)

  date2.setDate(date1.getDate() + aa)

  var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' 00:00'

  return time2
}

export default {
  // components: {
  //   Pie
  // },
  data() {
    return {
      // pieOptions: {
      //   width: '120%',
      //   height: '70%',
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       // 坐标轴指示器，坐标轴触发有效
      //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      //     }
      //   },
      //   grid: {
      //     left: '-6%',
      //     right: '0%',
      //     bottom: '0%',
      //     containLabel: true
      //   }, // 标题配置信息
      //   textStyle: {
      //     fontFamily: 'Microsoft YaHei',
      //     color: '#fff',
      //     fontSize: fontSize(0.099)
      //   },

      //   xAxis: {
      //     type: 'category',

      //     data: ['入侵报警', '紧急报警', '门禁报警', '主机异常', '事件报警', '防护舱报警', '设备异常'],
      //     axisLabel: {
      //       textStyle: {
      //         fontSize: fontSize(0.1)
      //       }
      //     }
      //   },
      //   yAxis: {
      //     show: false,
      //     type: 'value'
      //   },
      //   series: [
      //     {
      //       wdith: '10%',
      //       height: '70%',
      //       data: [12, 200, 150, 80, 70, 110, 130],
      //       type: 'bar',
      //       barWidth: '20%',
      //       //  barWidth : 30,//柱图宽度
      //       barGap: 100, // 柱图间距
      //       itemStyle: {
      //         normal: {
      //           barBorderRadius: 30,
      //           // 每根柱子颜色设置
      //           color: function(params) {
      //             let colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622']
      //             return colorList[params.dataIndex]
      //           }
      //         }
      //       },
      //       // 柱状图上显示数据
      //       label: {
      //         show: 'true',
      //         position: 'top',
      //         color: '#FFF',
      //         fontWeight: 'bolder',
      //         // backgroundColor: "auto",
      //         fontSize: fontSize(0.12)
      //       }
      //       // //平均值
      //       // markLine: {
      //       //     data: [{ type: "average", name: "平均值" }]
      //       // }
      //     }
      //   ]
      // },
      options: {
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
          left: "10%",
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
            // color: '#33ccff',
            normal: {
              show: true, //展示
              position: 'outside', // outside表示文本显示位置为外部,
            },
            emphasis: {
              //文本样式
              show: true, //展示
              textStyle: {
                //文本样式
                 fontSize: fontSize(0.12),
                fontWeight: '400',
              },
            },
          },
        labelLine: {
          // 引导线设置
          normal: {
            show: true, // 引导线显示
            fontSize: fontSize(0.12),
          }
        },
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
              // 展示文本设置
              normal: {
                //  饼状图折线展示外部
                show: true, // 展示
                position: 'outside', // outside表示文本显示位置为外部
                fontSize: fontSize(0.1),
                formatter:function(v){
                    let text = v.name;
                    let value_format = v.value;
                    if (text.length <= 3) {
                      return `${text}`;
                    } else if (text.length > 3 && text.length <= 6) {
                      return text = `${text.slice(0, 3)}\n${text.slice(3)}`
                    } else if (text.length > 6 && text.length <= 9) {
                      return text = `${text.slice(0, 3)}\n${text.slice(3,6)}\n${text.slice(6)}`
                    } 
                  }
              },
              emphasis: {
                // 文本样式
                show: true, // 展示
                textStyle: {
                  // 文本样式
                  fontSize: fontSize(0.12),
                  fontWeight: '600'
                }
              }
            },
            labelLine: {
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
            emphasis: {
              label: {
                show: true,
                fontSize: fontSize(0.12),
                fontWeight: 'bold'
              }
            },

            data: [
              { value: 0, name: `视频主机`, itemStyle: { color: '#FD9C41' } },
              { value: 0, name: '摄像主机', itemStyle: { color: '#56FDA7' } },            
            ]
          }
        ]
      },
      optionsWarn: {
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
          left: "10%",
          axisLabel: {
            interval: 1,
          },

          textStyle: {
            fontSize: fontSize(0.12),
            color: 'white',
          },
        },
        label: {
          
          // 展示文本设置
          normal: {
            show: true, // 展示
            position: 'outside' ,// outside表示文本显示位置为外部
            formatter(v){
              console.log(v)
            }
          },
          emphasis: {
            // 文本样式
            show: true, // 展示
            textStyle: {
              // 文本样式
              fontSize: fontSize(0.12),
              fontWeight: '400'
            }
          }
        },

        labelLine: {
          // 引导线设置
          normal: {
            show: true, // 引导线显示
            fontSize: fontSize(0.12),
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            // 饼状图调整位置
            center: ['50%', '70%'],
            selectedMode: 'single',
            label: {
              // 展示文本设置
              normal: {
                //  饼状图折线展示外部
                show: true, // 展示
                position: 'outside', // outside表示文本显示位置为外部
                fontSize: fontSize(0.1)
              },
              emphasis: {
                // 文本样式
                show: true, // 展示
                textStyle: {
                  // 文本样式
                  fontSize: fontSize(0.12),
                  fontWeight: '600'
                }
              }
            },
            labelLine: {
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
            emphasis: {
              label: {
                show: true,
                fontSize: fontSize(0.12),
                fontWeight: 'bold'
              }
            },

            data: [
              { value: 0, name: '报警主机', itemStyle: { color: '#FC6343' } },    
            ]
          }
        ]
      },
      barOptions: {
        width: '100%',
        height: '90%',
        grid: {
          left: '-2%',
          right: '0%',
          top: '0%',
          bottom: '2%',
          containLabel: true
        }, // 标题配
        // 标题配置信息
        textStyle: {
          fontFamily: 'Microsoft YaHei',
          color: '#fff',
          fontSize: fontSize(0.11)
        },
        xAxis: {
          type: 'category',
          data: ['防护舱报警', '门禁报警	', '对讲报警', '入侵报警', '停车场报警', '出入口报警', '智能报警','视频报警'],
          padding: [15, -18, 5, 6],
          interval: 0,
          margin: 1,
          align: 'right',
          axisLabel: {
            textStyle: {
              fontSize: fontSize(0.1),
              interval: 'auto' // 0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
            },
            interval:0
          },
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [
          {
            wdith: '150%',
            height: '70%',
            data: [0, 0, 0, 0, 0, 0, 0 ,0],
            type: 'bar',
            barWidth: '20%',
            //  barWidth : 30,//柱图宽度
            barGap: 100, // 柱图间距
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                // 每根柱子颜色设置
                color: function(params) {
                  let colorList = ['#FC6343', '#F1D766', '#09C7AF', '#69A9FF', '#21DD61', '#09C7AF', '#FD9A3F','#0AFFFF']
                  return colorList[params.dataIndex]
                }
              }
            },
            // 柱状图上显示数据
            label: {
              show: 'true',
              position: 'top',
              color: '#FFF',
              fontWeight: 'bolder',
              // backgroundColor: "auto",
              fontSize: fontSize(0.11)
            }
            // //平均值
            // markLine: {
            //     data: [{ type: "average", name: "平均值" }]
            // }
          }
        ]
      }
    }
  },
  mounted() {
    this.getVideoCount()
    this.getRightAccessStatistics()
    this.getWaring()
  },
  methods: {
    getWaring(){
      let _that=this;
      warnCount()
      .then((res) => {
        console.log(res);
        _that.optionsWarn.series[0].data[0].value=res.data.data.states.total;
        _that.optionsWarn.series[0].data[0].name=`报警主机${res.data.data.states.total}台`;
        _that.drawLine()
      },function(rej){console.log(rej)})
    },
    // 获取右侧报警分类设备统计
    getVideoCount(){
      let _that=this;
      VideoCount()
      .then((res) => {
        _that.options.series[0].data[0].value=res.data.data.hostTotal;
        _that.options.series[0].data[1].value=res.data.data.cameraTotal;
        _that.options.series[0].data[0].name=`视频主机${res.data.data.hostTotal}台`;
        _that.options.series[0].data[1].name=`摄像主机${res.data.data.cameraTotal}台`;

        _that.drawLine()

      },function(rej){console.log(rej)})
    },
    getRightAccessStatistics() {
      // cabin  防护舱报警
      // guard   门禁报警
      // intercom 对讲报警
      //  intrusion 入侵报警
      // park 停车场报警
      // passageway 出入口报警
      // smart 智能报警
      // video 视频报警
      var stringName = {
        cabin: '防护舱报警',
        guard: '门禁报警',
        intrusion: '入侵报警',
        intercom: '对讲报警',
        park: '停车场报警',
        passageway: '出入口报警',
        smart: '智能报警',
        video: '视频报警'
      }
      // var _this = thirlistsVue
      var _this=this;
      rightAccessStatistics({
        startTime: Date.parse(new Date(fun_data(-7))),
        endTime: Date.parse(new Date(fun_data(1)))
      }).then(
        res => {
          console.log(res)
          if (res.data.code === 0) {
            console.log('right:', _this.barOptions)
            if (!_this.barOptions) {
              return
            }
            _this.barOptions.series[0].data = []
            _this.barOptions.xAxis.data = []

            console.log('获取右侧报警分类设备统计-数据成功', res.data.data.count)
            for (const key in res.data.data.count) {
              for(const item in stringName){
              // console.log(key + ':' + res.data.data.count[key], stringName[key])
                if(item === key){
                  _this.barOptions.series[0].data.push(res.data.data.count[key])
                  _this.barOptions.xAxis.data.push(stringName[key])
                }
              }
            }
            _this.drawBar()
          } else {
            console.log('获取右侧报警分类设备统计-没用数据', res)
          }
        },
        rej => {
          console.log('获取左侧设备统计获取右侧入网设备统计在线图表列表-请求错误', rej)
        }
      )
    },
    jump() {
      this.$router.push({ name: 'basicData', params: { title: '基础数据' } })
    },
    //   报警环形图
    drawLine() {
      var myChart = echarts.init(document.getElementById('viedeo'))
      var myChart1 = echarts.init(document.getElementById('warning'))
      myChart.setOption(this.options)
      myChart1.setOption(this.optionsWarn)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      window.addEventListener('resize', () => {
        myChart1.resize()
      })
    },
    // 柱状图
    drawBar() {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('error'))

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(_this.barOptions)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>
<style lang="less" scoped>
// @media (max-width: 2000px) {
//   .title {
//     font-size: 0.6rem;
//     font-weight: 700;
//   }
// }
#right {
  width: 100%;
  height: 100%;
  .list {
    width: 100%;
    height: 33%;
    line-height: 2.5;
    background-image: url(../../../../static/bigData/list-bg-right.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 4px;
    box-sizing: border-box;
    // padding: 0px 1.2rem 1.2rem 1.2rem;
    .title {
      text-align: center;
      position: relative;
      top: 3%;
      background: linear-gradient(to bottom,#FFFFFF,#37B3DC);
      -webkit-background-clip: text;
      color: transparent;
      text-fill-color: transparent;
      a {
        position: absolute;
        top: 0.7vw;
        z-index: 99;
      }
    }
  }
  .duty {
    .content {
      height: 31%;
      position: relative;
      top: 6%;
      margin: 2% auto 0 auto;
      width: 88%;
      background-image: url(../../../../static/bigData/people-info.png); //
      background-size: 100% 100%;
      display: grid;
      grid-template-rows: 100%;
      grid-template-columns: 23% 17% 60%;
      justify-items: center;
      align-items: center;
      .img_left {
        // float: left;
        width: 100%;
        height: 100%;
        display: grid;
        align-items: center;
        justify-items: center;
        .people {
          width: 80%;
          height: 80%;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: 100%;
          background-image: url(../../../../static/bigData/people.png); //

          // background-image: url('https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=411076978,3259038998&fm=26&gp=0.jpg');
        }
        // p {
        //   font-family: '微软雅黑';
        //   font-weight: 400;
        //   text-align: center;
        //   width: 50%;
        //   float: right;
        //   height: 50px;

        //   background: orange;
        //  background-image: url(../../../../static/bigData/line.png);
        // }
      }
      .info_right {
        font-size: 0.6rem;
        float: right;
        // width: 66%;
        width: 100%;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(222, 240, 255, 1);
        span {
          display: inline-block;
        }
        p {
          min-height: 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tetx_left {
          width: 26%;
          text-align: right;
        }
        .text_right {
          width: 70%;
          text-align: left;
          float: right;
          text-align: justify;
          text-justify: newspaper;
          word-break: break-all;
          color: #1ee6f1;
        }
      }
    }
    .content_top {
      margin: 7% auto 0 auto;
    }
  }
  a {
    float: right;
    color: #33ccff;
    position: absolute;
    cursor: pointer;
    right: 4%;
  }
  #equipment {
    height: 100%;
    display: flex;
    width: 100%;
    align-content: center;
    justify-content: center;
    margin-top: -10%;
    #viedeo {
      height: 100%;
      width: 50%;
      //   background: orange;
    }
    #warning {
      height: 100%;
      width: 50%;
      //   background: red;
    }
  }
  #error {
    width: 100%;
    // height: 100%;
    height: 95%;
  }
}
</style>
