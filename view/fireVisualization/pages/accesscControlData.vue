<template>
  <div id="detail-body">
    <div @click="isOpenPanel = !isOpenPanel" class="isShow" :style="{ left: isOpenPanel ? '270px' : '0' }">
      <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="tree-main" v-show="isOpenPanel" :style="{ minWidth: isOpenPanel ? '220px' : '28px' }">
      <div class="left-tree">
        <div class="tree-title">
          <span>机构树</span>
          <i class="refresh el-icon-refresh-right" @click="refresh" title="刷新"></i>
        </div>
        <orgTree
          ref="lazyTree"
          :lazyTreeApi="getTreeApi"
          :customizeQuery="customizeQuery"
          :treeType="2"
          iconToggle
          treeLazyToggle
          searchType="filter"
          @onceClick="onceClick"
          @rootId="rootId"
        ></orgTree>
      </div>
    </div>
    <div class="right-echarts" :style="{ maxWidth: isOpenPanel ? '89%' : '100%' }">
      <fireViewList :treeData="defaultParams" :id="type"></fireViewList>
      <div class="bottom" style="background-color: rgb(6, 45, 86);">
        <hostList :item="hostDatas" ref="pagebref" :index="2"></hostList>
      </div>
    </div>
  </div>
</template>

<script>
// 引入基本模板
// let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/pie')
// // 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
import { getSecurityBranchApi, getDayDataApi } from '@src/http/fireVisualization/fireDetail.api'
import hostList from '../subgroup/leftList.vue'
import fireViewList from '../fireViewList.vue'
import orgTree from '@src/components/tree/treeBox'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'VideoTree',
  components: {
    hostList,
    fireViewList,
    orgTree
  },
  data() {
    return {
      isOpenPanel: true, // 显示隐藏左侧菜单
      type: 1,
      customizeQuery: {
        keywords: ['isRoot', 'orgId', 'keyPartId']
      },
      keyWord: '',
      kepalina: '',
      tableType: 1, // 系统类型
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      hostDatas: {
        legend: {
          textStyle: {
            // 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontFamily: 'Microsoft YaHei',
            color: '#fff',
            fontSize: '12',
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          icon: 'circle',
          padding: [0, 20],
          top: 15,
          data: ['正常', '离线', '异常']
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          shadowColor: '#e1e1e1',
          padding: 10,
          // shadowColor: 'rgba(0, 0, 0, 0.5)',
          formatter: function(params, ticket, callback) {
            var htmlStr = ''
            console.log(params)
            for (var i = 0; i < params.length; i++) {
              var param = params[i]
              var xName = param.name // x轴的名称
              // 图例名称
              var value = param.value ? param.value : 0 // y轴值
              var color = param.color // 图例颜色
              var name = param.seriesName

              if (i === 0) {
                htmlStr += '时间：' + xName + '<br/>' // x轴的名称
                htmlStr += '<div>'
                // 为了保证和原来的效果一样，这里自己实现了一个点的效果
                htmlStr += `<span style="background:${color};display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;"></span>`
                // 圆点后面显示的文本
                htmlStr += name + '：' + value + '台'
                htmlStr += '</div>'
              } else {
                /*   htmlStr += xName + '<br/>';//x轴的名称 */
                htmlStr += '<div>'
                // 为了保证和原来的效果一样，这里自己实现了一个点的效果
                htmlStr += `<span style="background:${color};display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;"></span>`
                // 圆点后面显示的文本
                htmlStr += name + '：' + value + '台'
                htmlStr += '</div>'
              }
            }
            return htmlStr
          }
          // formatter: '{b0}<br />{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}'
        },
        xAxis: {
          type: 'category',
          gridIndex: 0,
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: '#083b6f',
              width: 0.2,
              type: 'solid',
              fontSize: 1
            }
          },
          data: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00'
            // '24:00'
          ]
        },
        yAxis: {
          type: 'value',
          name: '台',
          minInterval: 100,
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
            name: '正常',
            barWidth: '10%',
            data: [],
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#206dd1'
              }
            }
          },
          {
            type: 'bar',
            name: '离线',
            barWidth: '10%',
            data: [],
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#0f994d'
              }
            }
          },
          {
            type: 'bar',
            name: '异常',
            barWidth: '10%',
            data: [],
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: '#801414'
              }
            }
          }
        ]
      },
      defaultParams: {
        type: '',
        day: ''
      }
    }
  },
  mounted() {
    $('.container .nav').hide()
    //  document.getElementsByClassName('nav')[0].remove()
    //  修改默认的最小宽度，大数据达到自适应
    // document.getElementById('content').style.minWidth = '100%'

    setTimeout(() => {
      console.log('$(".container .nav")', $('.container .nav'))
      $('.container .nav').hide()
      $('.container .body').css('overflow-x', 'hiddent')
    }, 1000)
  },
  created() {
    // console.log(this.$route.params.id)
    console.log(this.id)
    if (this.$route.params.id) {
      sessionStorage.setItem('tableType', this.$route.params.id)
      this.tableType = this.$route.params.id
    } else {
      this.tableType = Number(sessionStorage.getItem('tableType'))
    }
    // console.log(this.tableType)
    switch (this.tableType) {
      case 1: // 水系统
        this.defaultParams.type = 1
        break
      case 2: // 火灾报警
        this.defaultParams.type = 2
        break
      case 3: // NB
        this.defaultParams.type = 3
        break
      default:
        break
    }
    let params = {
      day: this.timeFilter(),
      type: this.defaultParams.type,
      orgId: '' // 当前节点id
    }
    // console.log(this.hostDatas.series[0].data)
    getDayDataApi(params).then(res => {
      if (res.data.code === 0) {
        // this.hostDatas.dataset.source
        let data = res.data.data.deviceHoursStatus
        let hostList = this.$lodash.cloneDeep(this.hostDatas.series)
        hostList.map(item => {
          item.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        })
        data.map((item, index) => {
          // if (index === 3) {
          //   item.liveCount = 3
          //   item.offlineCount = 6
          //   item.errorCount = 9
          // }
          hostList[0].data[Number(item.hours)] = item.liveCount
          hostList[1].data[Number(item.hours)] = item.offlineCount
          hostList[2].data[Number(item.hours)] = item.errorCount
        })
        this.hostDatas.series.map((item, index) => {
          this.$set(item, 'data', hostList[index].data)
        })
      }
    })
  },
  computed: {
    ...mapState('security', { dataed: state => state.dataed })
  },
  watch: {
    id: function(val) {
      this.$set(this, 'type', val)
    }
  },
  methods: {
    ...mapActions('security', ['getTreeList']),
    // getTree(payload) {
    //   this.getTreeList(payload);
    // },
    timeFilter() {
      var date = new Date()
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() - 1 < 10 ? '0' + date.getDate() - 1 : date.getDate() - 1
      // 拼接
      return year + '-' + month + '-' + day
    },
    getTreeApi(params) {
      return getSecurityBranchApi(params)
    },
    // 左侧树
    onceClick(data, node) {
      // console.log(data, node)
      this.defaultParams = {}
      if (data.tierType === 'org') {
        this.$set(this.defaultParams, 'orgId', data.id)
      } else if (data.tierType === 'loc') {
        this.$set(this.defaultParams, 'orgId', node.parent.data.id)
        this.$set(this.defaultParams, 'keyPartId', data.keyPartId)
      }
    },
    // 刷新  机构树
    refresh() {
      this.$refs.tree.$refs.lazyTree.refresh()
    },
    rootId(id) {
      this.currentOrgId = id
    }
  }
}
</script>

<style lang="less" scoped>
@media (min-width: 2000px) and(max-width: 3800px) {
  .keppyre h2,
  .tree-title {
    font-size: 0.71vw;
    // color: red;
  }
  #right-list .text-contont,
  #right-list .text-contont p {
    font-size: 0.54vw !important;
    // color: red;
  }
  .bottom {
    font-size: 0.74vw !important;
    color: #15f1f3;
  }
  .group-title {
    font-size: 0.85vw !important;
    color: #15f1f3;
  }
}

@media (min-width: 0px) and(max-width: 2000px) {
  //  标题 2k
  .keppyre h2,
  .tree-title {
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
  .top {
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
}

#detail-body {
  width: 95%;
  margin: 0 auto;
  height: 95%;
  display: flex;
}
/deep/.body {
  overflow: hidden !important;
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
    height: 94%;
    width: 220px;
    margin-top: 20px;
    border: 1px solid #2a79c0;
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
    .tree-title {
      display: inline-block;
      width: 100%;
      height: 3vh;
      line-height: 3vh;
      text-align: center;
      background: none;
      color: #fff;
      font-size: 14px;
      // margin-bottom: 14px;
      font-weight: 400;
      position: relative;
    }
    .refresh {
      position: absolute;
      top: 1vh;
      right: 7px;
      z-index: 2;
      cursor: pointer;
    }
  }
  /deep/.treeBox {
    padding: 0 !important;
  }
  /deep/.tree {
    height: 90% !important;
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
}
.el-submenu__title {
  width: 100%;
}
/deep/.tree-main {
  width: 16%;
  height: 98%;
  width: 220px;
  /deep/.el-input__inner {
    background: none;
    border-radius: 0;
    font-size: 0.5rem;
    text-align: left;
    color: #fff;
    border: 1px solid #2a79c0;
  }
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

  /deep/.el-tree {
    border: none;
    background: none;
    border-radius: 0;
    height: 100%;
    /deep/ .el-tree-node__content {
      color: white;
      border-left: none;
      /deep/ .el-tree-node__expand-icon {
        color: #0fa6df;
      }
      /deep/.icon_span {
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

    .point_icon {
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
  flex: 1;
  max-width: 100%;
  height: 74%;
  padding: 1rem;
  padding-left: 2rem;
  .keppyre {
    position: relative;
    height: 90%;
    margin-bottom: 20px;
    padding: 10px 20px;
    background-color: #062d56;
    border: 1px solid #2a79c0;
  }
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
  /deep/.bottom {
    width: 100%;
    border: 1px solid #2a79c0;
    height: 40%;
    position: relative;
    // left: -1%;
    // margin-top: 20px;
    background-color: rgb(6, 45, 86);
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
.isShow {
  position: absolute;
  top: calc(~'50% - 31px');
  width: 36px;
  height: 62px;
  border-top: 18px solid transparent;
  border-right: 18px solid transparent;
  border-bottom: 18px solid transparent;
  border-left: 18px solid rgb(6, 45, 86);
  z-index: 10;
  cursor: pointer;
  i {
    color: #666;
    position: absolute;
    left: -15px;
    top: 6px;
  }
}
</style>
