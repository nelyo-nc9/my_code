<template>
  <div id="detail-body">
    <div class="tree-main">
      <div class="left-tree">
        <p class="tree_title">
          机构树
          <i class="el-icon-refresh-right"></i>
        </p>
        <orgTree
          ref="tree"
          :lazyTreeApi="getTreeApis"
          :customizeQuery="customizeQuery"
          :treeType="treeType"
          iconToggle
          treeLazyToggle
          searchType="filter"
          @onceClick="onceClick"
          @rootId="rootId"
        ></orgTree>
      </div>
    </div>
    <div class="right-echarts">
      <div class="bottom">
        <div class="treead">
          <div class="img_box">
            <img src="../../../../static/bigData/warning.png" alt class="leday" />
          </div>

          <div>
            <span style="font-size:1rem">{{alarmNums.total}}</span>
            <span style="font-size:0.2rem">条</span>
            <h4 style="font-size: 0.1rem">报警总数量</h4>
          </div>
        </div>
        <div class="treead">
          <div class="img_box img_box_1">
            <img src="../../../../static/bigData/warning.png" alt class="leday" />
          </div>
          <div>
            <span style="font-size:1rem">{{alarmNums.level1}}</span>
            <span style="font-size:0.2rem">条</span>
            <h4 style="font-size: 0.1rem">一级报警</h4>
          </div>
        </div>
        <div class="treead">
          <div class="img_box img_box_2">
            <img src="../../../../static/bigData/warning.png" alt class="leday" />
          </div>
          <div>
            <span style="font-size:1rem">{{alarmNums.level2}}</span>
            <span style="font-size:0.2rem">条</span>
            <h4 style="font-size: 0.1rem">二级报警</h4>
          </div>
        </div>
      </div>
      <div class="centtar">
        <hostList :item="hostDatas[0]" ref="pagebref" :index="2"></hostList>
      </div>
      <div class="linehitk">
        <div class="keppyre">
          <detailsList :title="this_title" :tableData="table_data" :pages="thispage"></detailsList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/fireVisualization/fireDetail.api'
import hostList from '../subgroup/AlarmTable'
import orgTree from '@src/components/tree/treeBox'
import detailsList from '../subgroup/DataTable.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
export default {
  name: 'reamTime',
  components: {
    hostList,
    orgTree,
    detailsList
  },
  props: ['title'],
  data() {
    return {
      this_title: '报警数据',
      treeType: 2,
      customizeQuery: {
        // keywords: ['isRoot', 'orgId', 'keyPartId']
      },
      keyWord: '',
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
      hostDatas: [
        {
          title: {
            show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
            text: '每日实时报警数据分析', //主标题文本，'\n'指定换行
            link: '', //主标题文本超链接,默认值tru
            padding: 15, //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
            textStyle: {
              //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
              fontFamily: 'Arial, Verdana, sans...',
              color: '#fff',
              fontSize: '100%',
              fontStyle: 'normal',
              fontWeight: 'normal'
            }
          },
          grid: {
            left: '1%',
            top: '20%',
            right: '1%',
            containLabel: true
          },
          wdith: '100%',
          height: '75%',
          legend: {
            icon: 'circle',
            // orient: 'vertical',// 设置并排
            selectedMode: false,
            itemHeight: 10,
            itemWidth: 20,
            itemGap: 40,
            top: '5%',
            axisLabel: {
              interval: 1
            },
            data: ['一级', '二级'],
            textStyle: {
              fontSize: '120%',
              color: 'white'
            }
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              textStyle: {
                fontSize: 12
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['red'],
                  width: 1,
                  type: 'solid'
                }
              }
            },
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: '#0B4682',
                type: 'solid'
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
            ],
            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '1', //坐标线的宽度
                fontSize: 1
              },
              spiltLine: {
                show: true
              }
            }
          },
          yAxis: {
            axisLabel: {
              textStyle: {
                fontSize: 12
              },
              spiltLine: {
                show: true
              }
            },
            type: 'value',
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: '#0B4682',
                type: 'solid'
              }
            },

            axisLine: {
              lineStyle: {
                color: '#1b6b8f', //左边线的颜色
                width: '1' //坐标线的宽度
              }
            }
          },
          series: [
            {
              name: '一级',
              color: '#E04E59',
              data: [
                820,
                932,
                901,
                934,
                1290,
                1330,
                1320,
                200,
                120,
                232,
                901,
                334,
                70,
                257,
                890,
                400,
                600,
                850,
                300,
                265,
                149,
                960
              ],
              smooth: true,
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#E04E59', //#f18005
                width: 2
              }
            },
            {
              name: '二级',
              color: '#F6AB19', //
              data: [
                120,
                232,
                901,
                334,
                70,
                257,
                890,
                400,
                820,
                932,
                901,
                934,
                1290,
                1330,
                1320,
                200,
                500,
                850,
                695,
                1000,
                100,
                230,
                290,
                800
              ],
              type: 'line',
              smooth: true,
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#F6AB19', //
                width: 2
              }
            }
          ]
        }
      ],
      tableData: [
        {
          date: '1',
          date1: '融汇支行',
          data2: '融汇支行办公楼',
          address: '二楼会议室',
          nummgh: '液压传感器',
          kedy: 'HS12138',
          time: '2020-02-18 13:59:20',
          templay: '正常',
          shoulds: '0.4Mp'
        },
        {
          date: '2',
          date1: '融汇支行',
          data2: '融汇支行办公楼',
          address: '二楼会议室',
          nummgh: '液压传感器',
          kedy: 'HS12138',
          time: '2020-02-18 13:59:20',
          templay: '正常',
          shoulds: '0.4Mp'
        },
        {
          date: '3',
          date1: '融汇支行',
          data2: '融汇支行办公楼',
          address: '二楼会议室',
          nummgh: '液压传感器',
          kedy: 'HS12138',
          time: '2020-02-18 13:59:20',
          templay: '正常',
          shoulds: '0.4Mp'
        },
        {
          date: '4',
          date1: '融汇支行',
          data2: '融汇支行办公楼',
          address: '二楼会议室',
          nummgh: '液压传感器',
          kedy: 'HS12138',
          time: '2020-02-18 13:59:20',
          templay: '正常',
          shoulds: '0.4Mp'
        },
        {
          date: '5',
          date1: '融汇支行',
          data2: '融汇支行办公楼',
          address: '二楼会议室',
          nummgh: '液压传感器',
          kedy: 'HS12138',
          time: '2020-02-18 13:59:20',
          templay: '正常',
          shoulds: '0.4Mp'
        },
        {
          date: '6',
          date1: '融汇支行',
          data2: '融汇支行办公楼',
          address: '二楼会议室',
          nummgh: '液压传感器',
          kedy: 'HS12138',
          time: '2020-02-18 13:59:20',
          templay: '正常',
          shoulds: '0.4Mp'
        }
      ],
      userList: [],
      options: [
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
      value: ''
    }
  },
  created() {
    // this.getTreeApis({ type: 2 })
    // console.log('shuju::', this.$moment(new Date()).format('YYYY-MM-DD 00:00:00'))
    this.getHourCount()
    this.getAlarmFilter()
    // this.getAlarmCon();
  },
  mounted() {
    $('.container .nav').hide()
    // this.getDayCount({
    //   startTime: this.$moment(new Date()).format('YYYY-MM-DD 00:00:00'),
    //   endTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // })
    this.getDayCount()
  },
  updated() {
    this.hostDatas[0].xAxis.data = this.hourData.time
    this.hostDatas[0].series[0].data = this.hourData.level1Count
    this.hostDatas[0].series[1].data = this.hourData.level2Count
  },
  computed: {
    ...mapState('fireCount', {
      alarmNums: state => state.countNums,
      nums: state => state.nums,
      hourData: state => state.hourData,
      table_data: state => state.tableData,
      thispage: state => state.pageInfo
    })
  },
  methods: {
    ...mapActions('fireCount', ['getDayCount', 'getAlarmFilter', 'getHourCount', 'getAlarmCon']),
    ...mapMutations('fireCount', ['changeTreeOptions']),
    // 获取树机构根节点
    getTreeApis(params) {
      return getTreeApi(params)
    },
    // 左侧树
    onceClick(data, node) {
      const options = {
        startTime: this.$moment(new Date()).format('YYYY-MM-DD 00:00:00'),
        endTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      const treeOptios = {}
      if (data.tierType === 'org') {
        options.orgId = data.id
        treeOptios.type = 'orgId'
        treeOptios.id = data.id
        this.getHourCount({ orgId: data.id })
        this.getAlarmFilter({ orgId: data.id, pageNum: this.thispage.pageNum, pageSize: this.thispage.pageSize })
      } else if (data.tierType === 'loc') {
        options.locationId = data.id
        treeOptios.type = 'locationId'
        treeOptios.id = data.id
        this.getHourCount({ locationId: data.id })
        this.getAlarmFilter({ locationId: data.id, pageNum: this.thispage.pageNum, pageSize: this.thispage.pageSize })
      }
      this.getDayCount(options)

      this.changeTreeOptions(treeOptios)
    },
    rootId(id) {
      this.currentOrgId = id
    },
    handleOpen() {},
    handleClose() {},
    peiclick(params) {
      // this.$refs.pagebref.funb();
      console.log('11111111111', params.dataIndex, this.hostDatas.series)
      this.hostDatas.series[0].data.forEach((element, index) => {
        this.hostDatas.series[0].data[index] = Math.random() * 1000 * (index + 1)
      })
      this.$set(this.hostDatas.series[0].data, this.hostDatas.series[0].data)
    },
    // 设置表格行的样式
    tableRowStyle({ row, rowIndex }) {
      return 'line-height: 40px;height:40px'
    },
    handleUserList() {
      // this.$http.get('').then(res => {
      //   //这是数据接口，
      //   this.userList = res.body
      // })
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return ' background:#062d56;color:#7ba9d1'
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style lang="less" scoped>
#detail-body {
  width: 95%;
  margin: 0 auto;
  height: 92%;
  display: flex;
}
.inputyead > .el-input > input {
  height: 40px;
  background-color: aqua;
}
.linehitk {
  height: 52%;
  margin: 1.5rem 0 0;
  border: 1px solid #2a79c0;
  padding: 1rem;
}
.centtar {
  width: 100%;
  height: 30%;
  margin-top: 20px;
  border: 1px solid #2871bb;
}
.el-container {
  border: 1px solid aqua;
}

.treead {
  width: 29%;
  display: flex;
  background-color: #062d56;
  justify-content: left;
  align-items: center;
  border: 1px solid #2871bb;
  color: #a1cbea;
  // flex: 1;
  .img_box {
    width: 5vh;
    height: 5vh;
    border-radius: 50%;
    margin-right: 30%;
    margin-left: 15%;
    position: relative;
    background: #129fe5;
    .leday {
      width: 50%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
  }
  .img_box_1 {
    background: #e04e59;
  }
  .img_box_2 {
    background: #f6ab19;
  }
}
.treead h4 {
  margin-top: 4px;
  letter-spacing: 2px;
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
  text-align: left;
  height: 95%;
  .tree_title {
    height: 3vh;
    line-height: 3vh;
    text-align: center;
    position: relative;
    i {
      position: absolute;
      right: 0.8vw;
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
.el-submenu__title {
  width: 100%;
}
.tree-main {
  width: 16%;
  height: 95%;
  min-width: 200px;
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
  height: 95%;
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
    display: flex;
    height: 10%;
    border: none;
    justify-content: space-between;
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
.el-input__inner {
  background-color: #062d56 !important;
  color: #fff;
  border: 1px solid #385d7d !important;
  border-radius: 0px !important;
  text-align: center;
  border-radius: 0;
}

.el-table .warning-row {
  background: #0b4683;
  color: #0976ae;
}

.el-table .success-row {
  background: #062d56;
  color: #0976ae;
}
.el-table td {
  height: 37px;
  line-height: 37px;
}
.el-pager li:hover.active {
  color: #409eff !important;
}
.block {
  text-align: center;
}
.keppyre h2 {
  float: left;
  margin-top: 6px;
  width: 20%;
  font-size: 1.3rem;
  color: #7ba9d1;
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
    background-color: #1f2d3d !important;
  }
  /deep/ .el-submenu__title:hover,
  .el-submenu .el-menu-item:hover {
    background-color: #206dd1 !important;
  }
}
.el-submenu__title {
  width: 100%;
}
// .tree-main {
//   width: 16%;
//   min-width: 200px;
//   @media screen and (max-width: 2000px) {
//     /deep/ .el-tree-node__content,
//     /deep/ .el-input__inner {
//       // color:red!important;
//       height: 37px;
//       .el-tree-node__label {
//         font-size: 0.5rem;
//       }
//     }
//   }
//   @media screen and (max-width: 4000px) and (min-width: 2000px) {
//     /deep/ .el-tree-node__content {
//       // color:orange!important;
//       height: 35px;
//     }
//   }
//   .search-box {
//     width: 100%;
//     height: 40px;
//     line-height: 40px;
//     margin-top: 0.5rem;
//     background: none;
//     /deep/.el-input__inner {
//       background: none;
//       border-radius: 0;
//       font-size: 0.5rem;
//       border: 0.5px solid #385d7d;
//     }
//   }
//   .el-tree {
//     margin-top: 0.5rem;
//     border: 0.5px solid #385d7d;
//     background: none;
//     border-radius: 0;
//     height: 100%;
//     /deep/ .el-tree-node__content {
//       color: white;
//     }
//     /deep/ .el-tree-node__content:hover {
//       background: rgb(47, 74, 107);
//       // background:red;
//       color: white;
//     }
//     /deep/ .el-tree-node:focus > .el-tree-node__content {
//       background: rgb(47, 74, 107);
//       // background:red;
//       color: white;
//     }
//   }
// }
.top {
  width: 100%;
  height: 57%;
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
  width: 100%;
  // border: 0.5px solid #385d7d;
  height: 30%;
  position: relative;
  .plain {
    height: 100%;
  }
  .pie {
    width: 30%;
    height: 30%;
    position: absolute;
    top: 10%;
    right: -2%;
  }
}
.el-table th {
  text-align: center !important;
}

// .el-table th,
// .el-table tr {
//   border: 0 !important;
//   background-color: transparent !important;
// }

.el-table::before {
  height: 0;
}
.keppyre {
  height: 100%;
}
// .el-table,
// .el-table__expanded-cell {
//   background-color: transparent;
// }
.el-table td,
.el-table th.is-leaf {
  border-bottom: 0px;
}
.el-popper,
.optionsContent {
  color: #206dd1;
}
.el-table tbody tr:hover td {
  background-color: #000 !important;
}
// .el-select-dropdown {
//   background-color: #08164d;
//   margin: 0px;
//   border: 0px;
//   border-radius: 0px;
// }
//input背景色
.el-input__inner {
  background-color: #062d56;
  color: #fff;
  border: 1px solid #385d7d;
  border-radius: 0px;
  text-align: center;
}
.el-input__inner:hover {
  border: 1px solid #385d7d;
}
.select-popper {
  background-color: #2a5981;
  border-radius: 0.08rem;
  border: solid 0.02rem #1c395d;
  font-family: PingFangSC-Regular;
  width: 20%;
  .el-select-dropdown__item.selected {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: rgba(74, 141, 253, 1);
  }
  li {
    color: #fff;
    background: transparent;
    color: #fff;
    font-size: 16px;
  }
  .el-select-dropdown__item:hover,
  .el-select-dropdown__item.hover {
    background-color: rgba(110, 147, 206, 0.2);
    margin-right: 1px;
  }
  //   .popper__arrow::after {
  //     border-bottom-color: red;
  //   }
  //   .popper__arrow {
  //     border-bottom-color: yellow;
  //   }
  .el-select-dropdown__empty {
    padding: 0.2rem;
    font-size: 0.28rem;
  }
}
.body {
  background-image: url(/static/img/home-bg.2ce98b4.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.echarts > div,
.echarts > div > canvas {
  height: 100% !important;
}
.el-table {
  font-size: 14px;
}
.el-select .el-input.is-focus .el-input__inner,
.el-pagination__sizes .el-input .el-input__inner:hover,
.el-select .el-input__inner:focus {
  border-color: #2974b1 !important;
}
li.el-select-dropdown__item.selected {
  color: #7da4c4;
}
.el-input__inner {
  background-color: #062d56;
  border: 1px solid #385d7d;
  border-radius: 0px;
  text-align: center;
}
.el-pagination .el-input .el-input__inner {
  border: 1px solid #266fab;
  color: #8db7d6;
}
.el-dialog,
.el-pager li {
  background-color: transparent;
  color: #6d96b7;
}
.el-pager li.btn-quicknext,
.el-pager li.btn-quickprev {
  color: #6d96b7;
}
.el-pagination .btn-next,
.el-pagination .btn-prev {
  background: center center no-repeat #062d56;
  background-size: 16px;
  cursor: pointer;
  margin: 0;
  color: #a8d5f3;
}
.el-pagination .btn-prev,
.el-pagination .btn-next {
  border: 1px solid #266fab;
}
.el-pagination button:disabled {
  background-color: transparent;
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
.el-pagination__total,
.el-pagination__jump {
  color: #6d96b7;
}
</style>
