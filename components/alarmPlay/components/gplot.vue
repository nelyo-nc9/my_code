<template>
  <div class="gplot-box" id="gplot"></div>
</template>

<script>
export default {
  name: 'Gplot',
  props: {
    gplotData: {
      type: Array,
      default: () => {
        return []
        // return [
        //   {
        //     name: '01警号报警位01',
        //     type: 'alarm',
        //     id: '1'
        //   }, {
        //     name: '01警号报警位02',
        //     type: 'alarmHost',
        //     id: '2'
        //   }, {
        //     name: '摄像机',
        //     type: 'vidicon',
        //     id: '3',
        //     center: true // 用来标识中心元素
        //   }, {
        //     name: 'T1-对讲面板-自助1',
        //     type: 'talkbackHost',
        //     id: '4'
        //   }, {
        //     name: 'T1-对讲面板-自助2',
        //     type: 'talkback',
        //     id: '5'
        //   }, {
        //     name: 'D2门禁加钞间01',
        //     type: 'guard',
        //     id: '6'
        //   }, {
        //     name: 'D2门禁加钞间02',
        //     type: 'guardHost',
        //     id: '7'
        //   }
        // ]
      }
    }
  },
  data() {
    return {
      datas: [
        {
          position: 'left',
          index: 0,
          type: 'alarm',
          text: '01警号报警位01',
          icon: 'iconfont icon-alarm-admin'
        }, {
          position: 'left',
          type: 'alarm',
          index: 1,
          text: '01警号报警位02',
          icon: 'iconfont icon-alarm-admin'
        }, {
          type: 'center',
          text: '摄像机',
          icon: 'iconfont icon-paisheluxiang'
        }, {
          position: 'right',
          index: 0,
          type: 'sound',
          text: 'T1-对讲面板-自助1',
          icon: 'iconfont icon-sound'
        }, {
          position: 'right',
          index: 1,
          type: 'sound',
          text: 'T1-对讲面板-自助1',
          icon: 'iconfont icon-sound'
        }, {
          position: 'top',
          index: 0,
          type: 'door',
          text: 'D2门禁加钞间01',
          icon: 'iconfont-ccb ccbmenjiachaojian'
        }, {
          position: 'top',
          index: 1,
          type: 'door',
          text: 'D2门禁加钞间02',
          icon: 'iconfont-ccb ccbmenjiachaojian'
        }
      ],
      colors: {
        talkback: '#EABA13',
        talkbackHost: '#DF721F',
        alarm: '#F21C22',
        alarmHost: '#DF1683',
        guard: '#38BBBE',
        guardHost: '#389981',
        vidicon: '#33ACD6',
        opticFiber: '#7E7E7E',
        electronicFence: '#9357ED',
        tank: '#7696D5',
        detector: '#F21C22',
        videoHost: '#0E63DA'
      },
      gplotType: [
        'talkback',
        'talkbackHost',
        'alarm',
        'alarmHost',
        'guard',
        'guardHost',
        'vidicon',
        'opticFiber',
        'electronicFence',
        'tank',
        'detector',
        'videoHost'
      ],
      gplotChart: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let img1 = require('../../../assets/img/videoConf/yuyin.png')
      let img2 = require('../../../assets/img/videoConf/menjiachaojian.png')
      let img3 = require('../../../assets/img/videoConf/jingbao.png')
      let img4 = require('../../../assets/img/videoConf/shexiangj.png')
      let img5 = require('../../../assets/img/videoConf/shipinzhuji.png')
      let img6 = require('../../../assets/img/videoConf/duijiangzhuj.png')
      let img7 = require('../../../assets/img/videoConf/baojingzhuji.png')
      let img8 = require('../../../assets/img/videoConf/menjinzhuji.png')
      let img9 = require('../../../assets/img/videoConf/zhendonguangxian.png')
      let img10 = require('../../../assets/img/videoConf/baojingtanceqi.png')
      let img11 = require('../../../assets/img/videoConf/fanghucang.png')
      let img12 = require('../../../assets/img/videoConf/dianziweilan.png')
      let sportsIcon = {
        a: img1, // 对讲
        b: img2, // 门禁
        c: img3, // 报警
        d: img4, // 摄像机
        e: img5, // 视频主机
        f: img6, // 对讲主机
        g: img7, // 报警主机
        h: img8, // 门禁主机
        i: img9, // 震动光纤
        j: img10, // 报警探测器
        k: img11, // 防护舱
        l: img12 // 电子围栏
      }
      let colors = this.colors
      this.$nextTick(() => {
        let nodeData = this.$lodash.cloneDeep(this.gplotData)
        let links = this.getLinks(nodeData)

        this.gplotChart = this.$echarts.init(document.getElementById('gplot'))
        let option = {
          background: '#fff',
          series: [
            {
              width: 130,
              height: 50,
              legendHoverLink: false,
              type: 'graph', // 类型:关系图
              layout: 'force', // 图的布局，类型为力导图
              symbol: 'rect',
              symbolSize: [130, 50], // 调整节点的大小
              roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
              center: [376, 288],
              edgeSymbol: ['none', 'none'],
              edgeSymbolSize: [2, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 20
                  }
                }
              },
              force: {
                initLayout: 'circular',
                repulsion: 2500,
                edgeLength: 50,
                layoutAnimation: false
              },
              draggable: false,
              itemStyle: {
                color: function(params) {
                  return colors[params.data.type]
                }
              },
              lineStyle: {
                normal: {
                  width: 2,
                  color: '#4b565b'
                }
              },
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    var str = ''
                    switch (params.data.type) {
                      case 'vidicon':
                        str = '{d|}' + params.name
                        break
                      case 'alarm':
                        str = '{c|}' + params.name
                        break
                      case 'guard':
                        str = '{b|}' + params.name
                        break
                      case 'talkback':
                        str = '{a|}' + params.name
                        break
                      case 'videoHost':
                        str = '{e|}' + params.name
                        break
                      case 'talkbackHost':
                        str = '{f|}' + params.name
                        break
                      case 'guardHost':
                        str = '{h|}' + params.name
                        break
                      case 'alarmHost':
                        str = '{g|}' + params.name
                        break
                      case 'detector':
                        str = '{j|}' + params.name
                        break
                      case 'tank':
                        str = '{k|}' + params.name
                        break
                      case 'electronicFence':
                        str = '{l|}' + params.name
                        break
                      case 'opticFiber':
                        str = '{i|}' + params.name
                        break
                    }
                    return str
                  },
                  rich: {
                    a: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.a
                      }
                    },
                    b: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.b
                      }
                    },
                    c: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.c
                      }
                    },
                    d: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.d
                      }
                    },
                    e: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.e
                      }
                    },
                    f: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.f
                      }
                    },
                    g: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.g
                      }
                    },
                    h: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.h
                      }
                    },
                    i: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.i
                      }
                    },
                    j: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.j
                      }
                    },
                    k: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.k
                      }
                    },
                    l: {
                      width: 30,
                      height: 30,
                      align: 'center',
                      backgroundColor: {
                        image: sportsIcon.l
                      }
                    }
                  },
                  color: '#fff'
                },
                emphasis: {
                  show: false,
                  formatter: function(params) {
                    return params.name
                  }
                }
              },
              data: nodeData,
              links: links
            }
          ]
        }
        this.gplotChart.setOption(option)
      })
    },
    async destroyedGplot() {
      await this.gplotChart.dispose()
    },
    formatData() { // 处理格式的函数
      // todo 看真实接口返回时什么
    },
    getLinks(data) {
      let centerNode = this.$lodash.filter(data, (item) => {
        return item.center
      })[0]
      let links = []
      data.forEach((i) => {
        if (i.id !== centerNode.id) {
          links.push({
            source: centerNode.id,
            target: i.id
          })
        }
      })
      return links
    },
    computeStyle(pos, i) {
      if (pos === 'left') {
        return { 'top': `calc(50% - ${-70 * i}px)`, 'left': `calc(50% - 350px)` }
      } else if (pos === 'right') {
        return { 'top': `calc(50% - ${-70 * i}px)`, 'left': `calc(50% + 230px)` }
      } else if (pos === 'top') {
        return { 'top': 'calc(50% - 220px)', 'left': `calc(50% - ${150 * i}px)` }
      } else {
        return {}
      }
    }
  }
}
</script>
<style lang='less' scoped>
.gplot-box {
  position: relative;
  width: 100%;
  height: 576px;
  .gplot-item {
    position: absolute;
    width: 130px;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-width: 3px 2px 2px;
    border-style: solid;
    border-radius: 5px;
    text-align: center;
    &::after {
      content: '';
      position: absolute;
      left: 10px;
      top: 10px;
      width: 200px;
      height: 2px;
      border: 1px solid #333;
    }
  }
  .center {
    position: absolute;
    top: calc(~'50% - 25px');
    left: calc(~'50% - 65px');
    background: #33ACD6;
    color: #fff;
    box-shadow: 5px -5px 0px 1px #33ACD6;
  }
  .sound {
    color: #EABA13;
    border-color: #EABA13;
  }
  .alarm {
    color: #F21C22;
    border-color: #F21C22;
  }
  .door {
    color: #38BBBE;
    border-color: #38BBBE;
  }
}
</style>
