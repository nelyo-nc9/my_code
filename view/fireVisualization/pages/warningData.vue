<template>
  <div id="warningData">
    <!-- <div class="select">
      <div class="select-count">
        <el-select v-model="value" filterable placeholder="请选择">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="value" filterable placeholder="请选择">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div> -->
    <div class="tree-main">
      <div class="search-box">
        <el-input v-model="keyWord" placeholder="请输入..." suffix-icon="el-icon-search"></el-input>
      </div>
      <el-tree :data="data" :props="defaultProps" node-key="id" ref="sortTree" @node-click="handleNodeClick" icon-class="el-icon-arrow-right">
        <span class="custom-tree-node" slot-scope="{ node }">
          <span class="icon_span">
            <i class="el-icon-office-building" :ids="node.id"></i>{{ node.label }}
          </span>
        </span>
      </el-tree>
    </div>
    <div class="warningInfo">
      <ul>
        <li>
          <div class="left">
            <p>一级报警</p>
          </div>
          <div class="right grey">36</div>
        </li>
        <li>
          <div class="left" s>
            <p>一级报警</p>
          </div>
          <div class="right grey">36</div>
        </li>
        <li>
          <div class="left">
            <p>一级报警</p>
          </div>
          <div class="right grey">36</div>
        </li>
        <li>
          <div class="left">
            <p>一级报警</p>
          </div>
          <div class="right grey">36</div>
        </li>
        <li>
          <div class="left">
            <p>一级报警</p>
          </div>
          <div class="right grey">36</div>
        </li>
      </ul>
      <div id="toral">
        <div class="item grey">
          <span>报警总数</span>
          <span>3323条</span>
        </div>
        <div class="item grey">
          <span>报警处置率</span>
          <span>3323条</span>
        </div>
      </div>
    </div>
    <div class="waringTotal">
      <div class="Total">
        <p>报警总数统计分析</p>
        <div class="button-list">
          <button @click="toggle(0)">当天</button>
          <button @click="toggle(1)">七月</button>
          <button @click="toggle(2)">当月</button>
        </div>
        <hostList :item.sync="hostDatas"></hostList>
      </div>
      <div class="totalpie">
        <Pie :options="options" :index="0"></Pie>
      </div>
    </div>
    <div class="contrast">
      <div v-for="(item,index) in hostData" class="itme-list">
        <p>重点部位报警统计分析</p>
        <hostList :item="item" :index="index" :key="index"></hostList>
      </div>
    </div>
  </div>
</template>
<script>
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
export default {
  name: 'VideoTree',
  components: {
    hostList,
    Pie
  },
  data() {
    return {
      data: [
        {
          label: '河北省分行',
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
            },
            {
              label: '5保定分行'
            },
            {
              label: '6保定分行'
            },
            {
              label: '7保定分行'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      keyWord: '',
      options: {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '门禁数量重点部位统计', //主标题文本，'\n'指定换行
          link: '', //主标题文本超链接,默认值true
          target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          subtext: '', //副标题文本，'\n'指定换行
          sublink: '', //副标题文本超链接
          subtarget: null, //指定窗口打开副标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          x: 'center', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          y: 'top', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          textAlign: null, //水平对齐方式，默认根据x设置自动调整，可选为： left' | 'right' | 'center
          backgroundColor: 'rgba(0,0,0,0)', //标题背景颜色，默认'rgba(0,0,0,0)'透明
          borderColor: '#fff', //标题边框颜色,默认'#ccc'
          borderWidth: 0, //标题边框线宽，单位px，默认为0（无边框）
          padding: 5, //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
          itemGap: 10, //主副标题纵向间隔，单位px，默认为10
          textStyle: {
            //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontFamily: 'Arial, Verdana, sans...',
            color: '#ccc',
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },
        label: {
          //展示文本设置
          normal: {
            show: true, //展示
            position: 'outside' // outside表示文本显示位置为外部
          },
          emphasis: {
            //文本样式
            show: true, //展示
            textStyle: {
              //文本样式
              fontSize: '14',
              fontWeight: '600'
            }
          }
        },
        labelLine: {
          //引导线设置
          normal: {
            show: true //引导线显示
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            selectedMode: 'single',
            name: '访问来源',
            symbol: 'none',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['50%', '50%'],
            label: {
              //展示文本设置
              normal: {
                //  饼状图折线展示外部
                show: true, //展示
                position: 'outside' // outside表示文本显示位置为外部
              },
              emphasis: {
                //文本样式
                show: true, //展示
                textStyle: {
                  //文本样式
                  fontSize: '14',
                  fontWeight: '600'
                }
              }
            },
            labelLine: {
              //引导线设置
              normal: {
                show: true //引导线显示
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },

            data: [
              { value: 335, name: '数据1', itemStyle: { color: '#8ec060' } },
              { value: 679, name: '数据2', itemStyle: { color: '#47A474' } },
              { value: 158, name: '数据3', itemStyle: { color: '#008D89' } }
            ]
          }
        ]
      },
      options2: {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: '门禁数量重点部位统计', //主标题文本，'\n'指定换行
          link: '', //主标题文本超链接,默认值true
          target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          subtext: '', //副标题文本，'\n'指定换行
          sublink: '', //副标题文本超链接
          subtarget: null, //指定窗口打开副标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
          x: 'center', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          y: 'top', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          textAlign: null, //水平对齐方式，默认根据x设置自动调整，可选为： left' | 'right' | 'center
          backgroundColor: 'rgba(0,0,0,0)', //标题背景颜色，默认'rgba(0,0,0,0)'透明
          borderColor: '#fff', //标题边框颜色,默认'#ccc'
          borderWidth: 0, //标题边框线宽，单位px，默认为0（无边框）
          padding: 5, //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
          itemGap: 10, //主副标题纵向间隔，单位px，默认为10
          textStyle: {
            //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontFamily: 'Arial, Verdana, sans...',
            color: '#ccc',
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },
        label: {
          //展示文本设置
          normal: {
            show: true, //展示
            position: 'outside' // outside表示文本显示位置为外部
          },
          emphasis: {
            //文本样式
            show: true, //展示
            textStyle: {
              //文本样式
              fontSize: '14',
              fontWeight: '600'
            }
          }
        },
        labelLine: {
          //引导线设置
          normal: {
            show: true //引导线显示
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            selectedMode: 'single',
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['50%', '50%'],
            label: {
              //展示文本设置
              normal: {
                //  饼状图折线展示外部
                show: true, //展示
                position: 'outside' // outside表示文本显示位置为外部
              },
              emphasis: {
                //文本样式
                show: true, //展示
                textStyle: {
                  //文本样式
                  fontSize: '14',
                  fontWeight: '600'
                }
              }
            },
            labelLine: {
              //引导线设置
              normal: {
                show: true //引导线显示
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },

            data: [
              { value: 335, name: '数据1', itemStyle: { color: '#8ec060' } },
              { value: 679, name: '数据2', itemStyle: { color: '#47A474' } },
              { value: 158, name: '数据3', itemStyle: { color: '#008D89' } }
            ]
          }
        ]
      },
      options3: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      hostDatas: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          //网格样式
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
            color: ['rgba(47,84,126,0.66)'],
            smooth: true,
            symbol: 'none',
            data: [120, 832, 531, 934, 290, 1330, 20, 120, 832, 531, 934, 290, 1330, 20],
            type: 'line',
            areaStyle: {}
          }
        ]
      },
      hostData: [
        {
          color: ['#3398DB'],

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line', // 默认为直线，可选为：'line' | 'shadow',
              color: 'red'
            }
          },

          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: {
              textStyle: {
                fontSize: 8
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                fontSize: 8
              }
            },
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(228,230,241,0.46)'],
                width: 0.2,
                type: 'solid',
                fontSize: 1
              }
            }
          },
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '10%',
              data: [10, 52, 200, 334, 390, 330, 220]
            }
          ]
        },
        {
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
              color: 'white'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line', // 默认为直线，可选为：'line' | 'shadow',
              color: 'red'
            }
          },
          dataset: {
            source: [
              ['周一', '2015', '2016', '2017'],
              ['周一 Latte', 43.3, 85.8, 93.7, 77],
              ['周一 Tea', 83.1, 73.4, 55.1, 45],
              ['周一 Cocoa', 86.4, 65.2, 82.5, 23],
              ['周一 Brownie', 72.4, 53.9, 39.1, 89],
              ['周一 123', 72.4, 53.9, 39.1, 89]
            ]
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              textStyle: {
                fontSize: 8
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                fontSize: 8
              }
            },
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(228,230,241,0.46)'],
                width: 0.2,
                type: 'solid',
                fontSize: 1
              }
            }
          },
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
            {
              type: 'bar',
              barWidth: '8%'
            },
            {
              type: 'bar',
              barWidth: '8%'
            },
            {
              type: 'bar',
              barWidth: '10%'
            },
            {
              name: '最新成交价',
              type: 'line',
              data: (function () {
                var res = [];
                var len = 0;
                while (len < 10) {
                  res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                  len++;
                }
                return res;
              })()
            }
          ]
        },
        {
          grid: {

            bottom: '20%',
            containLabel: true
          },
          //标题配置信息
          textStyle: {
            fontFamily: 'KaiTi',
            color: '#fff',
            fontSize: "10px"
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
                  color: function (params) {
                    let colorList = [
                      '#c23531',
                      '#2f4554',
                      '#61a0a8',
                      '#d48265',
                      '#91c7ae',
                      '#749f83',
                      '#ca8622',

                    ]
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
      ]
    }
  },
  mounted() { },
  methods: {
    toggle(index) {
      this.hostDatas = this.hostData[index]

      console.log(this.hostDatas.series[0].data)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    drawLine() {
      var myChart = echarts.init(document.getElementById('pie'))
      // var myChart1 = echarts.init(document.getElementById('warning'))
      myChart.setOption(this.options)
      // myChart1.setOption(this.options)
      // window.addEventListener('resize', () => {
      //   myChart.resize()
      // })
      // window.addEventListener('resize', () => {
      //   myChart1.resize()
      // })
    },
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
            symbol: 'none',
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                //每根柱子颜色设置
                color: function (params) {
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
.select {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-top: 0.5rem;
  background: none;
  display: flex;
  justify-content: flex-end;
  .select-count {
    width: 24%;
    float: right;
    display: flex;
    justify-content: space-between;
  }
  /deep/.el-input__inner {
    background: none;
    border-radius: 0;
    font-size: 0.5rem;
    height: 2vw;
    border: 0.5px solid #ddd;

    font-size: 0.9vw;
    font-weight: 700;
    color: #a8a1b4;
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
      font-size: 1.5vw;
    }
  }
  .select {
    height: 5%;
    // border: 1px solid rgb(56,93,125);
  }
  .warningInfo {
    height: 11%;
    //  border: 1px solid rgb(56,93,125);
    display: flex;
    color: #99a0b2;

    ul {
      width: 65%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    li:nth-of-type(1) .left {
      background: red;
    }
    li:nth-of-type(2) .left {
      background: #e16666;
    }
    li:nth-of-type(3) .left {
      background: #e8993c;
    }
    li:nth-of-type(4) .left {
      background: #f2cc41;
    }
    li:nth-of-type(5) .left {
      background: #f299fc;
    }
    ul li {
      float: left;
      border: 1px solid rgb(56, 93, 125);
      width: 19%;
      height: 100%;
      display: flex;
      .left,
      .right {
        display: flex;
        justify-content: center;
        align-items: center;

        p {
          color: white;
        }
      }
      .left {
        width: 33%;
        line-height: 100%;
        text-align: center;
      }

      .right {
        width: 67%;
      }
    }
    #toral {
      width: 40%;
      display: flex;

      justify-content: space-around;
      .item {
        width: 40%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        span:nth-child(2) {
          color: #e16666;
        }
        p {
          width: 50%;
        }
      }
    }
  }
  .waringTotal {
    height: 35%;

    display: flex;
    div {
      height: 100%;
    }
    .Total {
      width: 70%;
      border: 1px solid rgb(56, 93, 125);
      position: relative;
      .button-list {
        position: absolute;
        right: 2%;
        top: 6%;
        font-size: 0.9vw;
        font-weight: 700;
        button {
          color: #a8a1b4;
          background: #3766b5;
          border: 1px solid rgb(56, 93, 125);
          padding: 0.4%;
        }
      }
    }
    .totalpie {
      width: 30%;
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
      border: 1px solid rgb(56, 93, 125);
      // padding-top: 1vw;
    }
  }
}
</style>