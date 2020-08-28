<template>
  <div id="detail-body">
    <div @click="isOpenPanel = !isOpenPanel" class="isShow" :style="{ left: isOpenPanel ? '260px' : '0' }">
      <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="tree-main" v-show="isOpenPanel" :style="{ minWidth: isOpenPanel ? '220px' : '28px' }">
      <div class="left-tree">
        <div class="tree-title">
          <span>机构树</span>
          <i class="refresh el-icon-refresh-right" @click="refresh" title="刷新"></i>
        </div>
        <orgTree
          ref="tree"
          :lazyTreeApi="getTreeApi"
          :customizeQuery="customizeQuery"
          :treeType="1"
          iconToggle
          treeLazyToggle
          searchType="filter"
          @onceClick="onceClick"
        ></orgTree>
      </div>
    </div>
    <div class="right-echarts" :style="{ maxWidth: isOpenPanel ? '95%' : '100%' }">
      <div class="top_div">
        <p>电气火灾检测设备</p>
        <ul>
          <li v-for="(list, index) in listData" :key="'list' + index">
            <p class="title_p"><i class="list.color"></i>{{ list.title }}</p>
            <div class="detail_box">
              <div class="detail_item" v-for="(item, itemIndex) in list.arr" :key="itemIndex">
                <p class="detail_item_title">{{ item.title }}</p>
                <p class="datail_data">{{ item.num }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="bottom">
        <hostList :item="hostDatas[0]" ref="pagebref" :index="2"></hostList>
      </div>
    </div>
  </div>
</template>

<script>
// 引入基本模板
// let echarts = require('echarts/lib/echarts')
// 引入柱状图相件
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/pie')
// // 引入提示框和title相件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
import hostList from '../subgroup/electricalFireList.vue'
// import Pie from '../subgroup/pie.vue'
// import { mapState, mapGetters, mapMutations } from 'vuex'
// import { save, read } from '../../../storage/index'
import { getSecurityBranchApi, countDeviceParameter } from '@src/http/fireVisualization/fireDetail.api'
import orgTree from '@src/components/tree/treeBox'
export default {
  name: 'VideoTree',
  components: {
    hostList,
    orgTree
  },
  props: ['title'],
  data() {
    return {
      isOpenPanel: true, // 显示隐藏左侧菜单
      customizeQuery: {
        params: {
          hostType: [11]
        },
        keywords: ['isRoot', 'orgId', 'keyPartId']
      },
      name: '',
      pieTitle: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: '', // 数据
      listData: [
        {
          title: '电压',
          color: 'green',
          arr: [
            {
              title: 'A相',
              num: '0V'
            },
            {
              title: 'B相',
              num: '0V'
            },
            {
              title: 'C相',
              num: '0V'
            }
          ]
        },
        {
          title: '电流',
          color: '',
          arr: [
            {
              title: 'A相',
              num: '0A'
            },
            {
              title: 'B相',
              num: '0A'
            },
            {
              title: 'C相',
              num: '0A'
            }
          ]
        },
        {
          title: '有功功率',
          color: 'purple',
          arr: [
            {
              title: 'A相',
              num: '0W'
            },
            {
              title: 'B相',
              num: '0W'
            },
            {
              title: 'C相',
              num: '0W'
            }
          ]
        },
        {
          title: '无功功率',
          color: 'red',
          arr: [
            {
              title: 'A相',
              num: '0Var'
            },
            {
              title: 'B相',
              num: '0Var'
            },
            {
              title: 'C相',
              num: '0Var'
            }
          ]
        }
      ],
      hostDatas: [
        {
          grid: {
            left: '1%',
            top: '12%',
            containLabel: true
          },
          wdith: '100%',
          height: '80%',
          legend: {
            // icon: 'rect',
            // orient: 'vertical',// 设置并排
            itemHeight: 15,
            itemWidth: 30,
            itemGap: 10,
            top: 10,
            selectedMode: 'single',
            axisLabel: {
              interval: 1
            },
            data: ['电压', '电流', '有功功率', '无功功率'],
            textStyle: {
              // 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
              fontFamily: 'Microsoft YaHei',
              color: '#fff',
              fontSize: '12',
              fontStyle: 'normal',
              fontWeight: 'normal'
            }
          },
          toolbox: {
            show: true,
            feature: {
              magicType: { show: true, type: ['stack', 'tiled'] },
              saveAsImage: { show: true }
            }
          },
          tooltip: {
            trigger: 'axis',
            shadowColor: '#e1e1e1',
            padding: 10,
            // shadowColor: 'rgba(0, 0, 0, 0.5)',
            formatter: function(params, ticket, callback) {
              var htmlStr = ''
              var seriesName = ['A相', 'B相', 'C相']
              for (var i = 0; i < params.length; i++) {
                var param = params[i]
                var xName = param.name // x轴的名称
                // 图例名称
                var value = param.value // y轴值
                var color = param.color // 图例颜色
                var name = param.seriesName
                let nameCode = ''
                switch (name) {
                  case '电压':
                    nameCode = 'V'
                    break
                  case '电流':
                    nameCode = 'A'
                    break
                  case '有功功率':
                    nameCode = 'W'
                    break
                  case '无功功率':
                    nameCode = 'Var'
                    break
                  default:
                    break
                }
                if (i === 0) {
                  htmlStr += '时间：' + xName + '<br/>' // x轴的名称
                  htmlStr += '<div>'
                  // 为了保证和原来的效果一样，这里自己实现了一个点的效果
                  htmlStr += `<span style="background:${color};display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;"></span>`
                  // 圆点后面显示的文本
                  htmlStr += seriesName[0] + '：' + value + nameCode
                  htmlStr += '</div>'
                } else {
                  /*   htmlStr += xName + '<br/>';//x轴的名称 */
                  htmlStr += '<div>'
                  // 为了保证和原来的效果一样，这里自己实现了一个点的效果
                  htmlStr += `<span style="background:${color};display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;"></span>`
                  // 圆点后面显示的文本
                  htmlStr += seriesName[i] + '：' + value + nameCode
                  htmlStr += '</div>'
                }
              }
              return htmlStr
            }
            // formatter: '{b0}<br />{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}'
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
            minInterval: 100,
            // 网格样式
            splitLine: {
              show: true,
              fontSize: 1
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
              name: '电压',
              color: '#218FFD',
              data: [],
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#218FFD', //#f18005
                width: 2
              }
            },
            {
              name: '电压',
              color: '#F35D23', //
              data: [],
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#F35D23', //
                width: 2
              }
            },
            {
              name: '电压',
              color: '#00B3B1', //
              data: [],
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#00B3B1', //
                width: 2
              }
            },
            {
              name: '电流',
              color: '#218FFD',
              data: [],
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#218FFD', //#f18005
                width: 2
              }
            },
            {
              name: '电流',
              color: '#F35D23', //
              data: [],
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#F35D23', //
                width: 2
              }
            },
            {
              name: '电流',
              color: '#00B3B1', //
              data: [],
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#00B3B1', //
                width: 2
              }
            },
            {
              name: '有功功率',
              color: '#218FFD',
              data: [],
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#218FFD', //#f18005
                width: 2
              }
            },
            {
              name: '有功功率',
              color: '#F35D23', //
              data: [],
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#F35D23', //
                width: 2
              }
            },
            {
              name: '有功功率',
              color: '#00B3B1', //
              data: [],
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#00B3B1', //
                width: 2
              }
            },
            {
              name: '无功功率',
              color: '#218FFD',
              data: [],
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#218FFD', //#f18005
                width: 2
              }
            },
            {
              name: '无功功率',
              color: '#F35D23', //
              data: [],
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#F35D23', //
                width: 2
              }
            },
            {
              name: '无功功率',
              color: '#00B3B1', //
              data: [],
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#00B3B1', //
                width: 2
              }
            }
          ]
        }
      ]
    }
  },

  methods: {
    // 获取时间
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
    // 机构树
    getTreeApi(params) {
      return getSecurityBranchApi(params)
    },
    // 左侧树
    onceClick(data, node) {
      if (data.tierType === 'org') {
        // this.defaultParams.orgId = data.id
        // this.defaultParams.keyPartId = ''
      } else if (data.tierType === 'loc') {
        // this.defaultParams.orgId = node.parent.data.id
        // this.defaultParams.keyPartId = data.id
      } else {
        let hostItem = this.$lodash.cloneDeep(this.hostDatas[0].series)
        hostItem.map((item, index) => {
          item.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        })
        console.log(data)
        let params = {
          hostId: data.id,
          day: this.timeFilter(),
          orgId: '' // 当前节点id
        }
        countDeviceParameter(params).then(res => {
          if (res.data.code === 0) {
            this.listData[0].arr[0].num = res.data.data.hostData.va ? res.data.data.hostData.va + 'V' : '0V'
            this.listData[0].arr[1].num = res.data.data.hostData.vb ? res.data.data.hostData.vb + 'V' : '0V'
            this.listData[0].arr[2].num = res.data.data.hostData.vc ? res.data.data.hostData.vc + 'V' : '0V'

            this.listData[1].arr[0].num = res.data.data.hostData.ia ? res.data.data.hostData.ia + 'A' : '0A'
            this.listData[1].arr[1].num = res.data.data.hostData.ib ? res.data.data.hostData.ib + 'A' : '0A'
            this.listData[1].arr[2].num = res.data.data.hostData.ic ? res.data.data.hostData.ic + 'A' : '0A'

            this.listData[2].arr[0].num = res.data.data.hostData.pa ? res.data.data.hostData.pa + 'W' : '0W'
            this.listData[2].arr[1].num = res.data.data.hostData.pb ? res.data.data.hostData.pb + 'W' : '0W'
            this.listData[2].arr[2].num = res.data.data.hostData.pc ? res.data.data.hostData.pc + 'W' : '0W'

            this.listData[3].arr[0].num = res.data.data.hostData.qa ? res.data.data.hostData.qa + 'Var' : '0Var'
            this.listData[3].arr[1].num = res.data.data.hostData.qb ? res.data.data.hostData.qb + 'Var' : '0Var'
            this.listData[3].arr[2].num = res.data.data.hostData.qc ? res.data.data.hostData.qc + 'Var' : '0Var'

            if (res.data.data.list.length > 0) {
              res.data.data.list.map((item, index) => {
                this.$set(hostItem[0], `data[${item.hours}]`, item.va)
                this.$set(hostItem[1], `data[${item.hours}]`, item.vb)
                this.$set(hostItem[2], `data[${item.hours}]`, item.vc)
                hostItem[0].data[item.hours] = item.va
                hostItem[1].data[item.hours] = item.vb
                hostItem[2].data[item.hours] = item.vc

                hostItem[3].data[item.hours] = item.ia
                hostItem[4].data[item.hours] = item.ib
                hostItem[5].data[item.hours] = item.ic

                hostItem[6].data[item.hours] = item.pa
                hostItem[7].data[item.hours] = item.pb
                hostItem[8].data[item.hours] = item.pc

                hostItem[9].data[item.hours] = item.qa
                hostItem[10].data[item.hours] = item.qb
                hostItem[11].data[item.hours] = item.qc
              })
            }

            console.log(hostItem)
            this.hostDatas[0].series.map((item, index) => {
              this.$set(item, 'data', hostItem[index].data)
            })
            this.$notify.success({
              message: '查询成功',
              title: '成功'
            })
          }
        })
      }
    },
    // 刷新  机构树
    refresh() {
      this.$refs.tree.$refs.lazyTree.refresh()
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
  }
}
</script>

<style lang="less" scoped>
@media (min-width: 2000px) and(max-width: 3800px) {
  .keppyre h2 {
    font-size: 0.71vw;
    // color: red;
  }
  .top_div {
    font-size: 0.54vw !important;
    // color: red;
  }
  .bottom {
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
  .keppyre h2 {
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
  .top_div .title_p {
    // font-size: 0.781vw !important;
    font-size: 12px !important;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(222, 240, 255, 1);
    // color: blue;
  }

  .bottom {
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
  width: 96%;
  margin: 0 auto;
  height: 92%;
  display: flex;
  margin-top: 1rem;
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
}
/deep/.tree-main {
  text-align: left;
  height: 95%;
  width: 220px;
  /deep/.left-tree {
    height: 100%;
    margin-top: 20px;
    border: 0.5px solid #385d7d;
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
      top: 9px;
      right: 7px;
      z-index: 2;
      cursor: pointer;
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
    /deep/.el-input__inner {
      background: none;
      border-radius: 0;
      font-size: 0.5rem;
      border: 1px solid #2a79c0;
    }
  }
  /deep/.tree {
    height: 90% !important;
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
/deep/.tree-main {
  width: 220px;
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
    border: none;
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
  flex: 1;
  height: 100%;
  padding: 1rem;
  padding-left: 2rem;
  .top_div {
    width: 100%;
    height: 45%;
    padding: 1rem;
    border: 1px solid #2a79c0;
    background: #062d56;
    ul {
      width: 100%;
      height: calc(100% - 1rem);
      li {
        width: 49%;
        height: 45%;
        float: left;
        margin-bottom: 1%;
        .title_p {
          width: 100%;
          height: 4vh;
          margin-bottom: 1%;
          line-height: 4vh;
          background: #0e5196;
          padding-left: 1rem;
          font-size: 1rem;
          i {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            // background: greenyellow;
            vertical-align: middle;
            margin-right: 1rem;
          }
          i.green {
            background: #2bce99;
          }
          i.yellow {
            background: #ffce65;
          }
          i.purple {
            background: #bf3bff;
          }
          i.red {
            background: #ff505f;
          }
        }
        .detail_box {
          width: 100%;
          height: 10vh;
          .detail_item {
            width: 32%;
            height: 100%;
            float: left;

            p {
              width: 100%;
              text-align: center;
            }
            p.detail_item_title {
              height: 4vh;
              line-height: 4vh;
              background: #0b4683;
            }
            p.datail_data {
              height: 6vh;
              line-height: 6vh;
              margin-top: 2px;
              background: #093e75;
            }
          }
          .detail_item:nth-child(2) {
            margin: 0 2%;
          }
        }
      }
      li:nth-child(even) {
        margin-left: 2%;
      }
    }
  }
  .top_div > p {
    height: 2rem;
    line-height: 1rem;
  }

  .bottom {
    width: 100%;
    border: 1px solid #2a79c0;
    height: 52%;
    margin-top: 0.5%;
    padding-left: 30px;
    position: relative;
    .plain {
      height: 100%;
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
