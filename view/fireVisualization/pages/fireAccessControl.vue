<template>
  <div id="detail-body">
    <div class="tree-main">
      <!-- <div class="search-box">
        <el-input v-model="keyWord" placeholder="请输入..." suffix-icon="el-icon-search"></el-input>
      </div> -->
      <div class="left-tree">
        <orgTree
          ref="tree"
          :lazyTreeApi="getTreeApi"
          :customizeQuery="customizeQuery"
          :treeType="3"
          iconToggle
          treeLazyToggle
          searchType="filter"
          @onceClick="onceClick"
          @rootId="rootId"
        ></orgTree>
      </div>
    </div>
    <div class="right-echarts">
      <fireViewList :treeData="defaultParams"></fireViewList>
      <div class="bottom">
        <hostList :item="hostDatas" ref="pagebref" :index="2"></hostList>
      </div>
    </div>
  </div>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/pie')
// // 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
import { getSecurityBranchApi } from '@src/http/fireVisualization/fireDetail.api'
import hostList from '../subgroup/leftList.vue'
// import Pie from '../subgroup/pie.vue'
import fireViewList from '../fireViewList.vue'
import orgTree from '@src/components/tree/treeBox'
// import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'VideoTree',
  components: {
    hostList,
    orgTree
  },
  props: ['title'],
  data() {
    return {
      customizeQuery: {
        keywords: ['isRoot', 'orgId', 'keyPartId']
      },
      keyWord: '',
      kepalina: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
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
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: '#083b6f',
              width: 0.2,
              type: 'solid',
              fontSize: 1
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#083a6d'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: '10%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#206dd1'
              }
            }
          },
          {
            type: 'bar',
            barWidth: '10%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#801414'
              }
            }
          },
          {
            type: 'bar',
            barWidth: '10%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#0f994d'
              }
            }
          }
        ]
      },
      defaultParams: {}
    }
  },
  mounted() {
    $('.container .nav').hide()
    // 获取选择树列表
    // const options = {};
    // options.isRoot = true;
    // this.getTree(options)
  },
  computed: {
    ...mapState('security', { dataed: state => state.dataed })
  },
  methods: {
    ...mapActions('security', ['getTreeList']),
    // getTree(payload) {
    //   this.getTreeList(payload);
    // },
    getTreeApi(params) {
      return getSecurityBranchApi(params)
    },
    // 左侧树
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.defaultParams.orgId = data.id
        this.defaultParams.keyPartId = ''
      } else if (data.tierType === 'loc') {
        this.defaultParams.orgId = node.parent.data.id
        this.defaultParams.keyPartId = data.id
      }
    },
    rootId(id) {
      this.currentOrgId = id
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
      const options = {}
      options.isRoot = false
      options.orgId = data.id
      this.getTree(options)
    },
    handleOpen() {},
    handleClose() {},
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
        // 标题配置信息
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
                // 每根柱子颜色设置
                color: function(params) {
                  let colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622']
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
#detail-body {
  width: 95%;
  margin: 0 auto;
  height: 90%;
  display: flex;
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
/deep/.tree-main {
  text-align: left;
  height: 95%;
  /deep/.left-tree {
    height: 100%;
    border: 0.5px solid #385d7d;
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
    /deep/.el-input__inner {
      background: none;
      border-radius: 0;
      font-size: 0.5rem;
      border: 0.5px solid #385d7d;
    }
  }
  /deep/.tree {
    height: 95% !important;
  }
  /deep/ .el-submenu .el-menu-item {
    background-color: transparent !important;
    // background-color: #1f2d3d !important;
  }
  /deep/ .el-submenu__title:hover,
  /deep/.el-submenu .el-menu-item:hover {
    background-color: transparent !important;
    // background-color: #206dd1 !important;
  }
  /deep/ .el-tree-node__content {
    color: white;
    border-left: none;
  }
  /deep/ .el-tree-node__content:hover,
  /deep/.el-tree-node__content:active {
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
}
/deep/.el-submenu__title {
  width: 100%;
}
/deep/.tree-main {
  width: 16%;
  height: 95%;
  min-width: 200px;
  /deep/.el-input__inner {
    text-align: left;
  }
  @media screen and (max-width: 2000px) {
    /deep/ .el-tree-node__content,
    /deep/ .el-input__inner {
      // color:red!important;

      /deep/.el-tree-node__label {
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

  /deep/.el-tree {
    border: 0.5px solid #385d7d;
    background: none;
    border-radius: 0;
    height: 100%;
    /deep/ .el-tree-node__content {
      color: white;
      border-left: none;
      /deep/.el-tree-node__expand-icon {
        color: #0fa6df;
      }
      /deep/ .icon_span {
        color: white;
        i {
          color: #0fa6df;
          font-weight: 900;
        }
      }
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

    /deep/.point_icon {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #0fa6df;
      vertical-align: middle;
    }
    /deep/.el-tree-node__children .el-tree-node__expand-icon {
      display: none;
    }
  }
}
.right-echarts {
  width: 87%;
  height: 67%;
  padding: 1rem;
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
  .bottom {
    width: 102%;
    border: 0.5px solid #385d7d;
    height: 40%;
    position: relative;
    left: -1%;
    margin-top: 3.4%;
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
</style>
