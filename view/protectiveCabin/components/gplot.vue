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
      },
    },
  },
  data() {
    return {
      datas: [
        {
          position: 'left',
          index: 0,
          type: 'alarm',
          text: '01警号报警位01',
          icon: 'iconfont icon-alarm-admin',
        },
        {
          position: 'left',
          type: 'alarm',
          index: 1,
          text: '01警号报警位02',
          icon: 'iconfont icon-alarm-admin',
        },
        {
          type: 'center',
          text: '摄像机',
          icon: 'iconfont icon-paisheluxiang',
        },
        {
          position: 'right',
          index: 0,
          type: 'sound',
          text: 'T1-对讲面板-自助1',
          icon: 'iconfont icon-sound',
        },
        {
          position: 'right',
          index: 1,
          type: 'sound',
          text: 'T1-对讲面板-自助1',
          icon: 'iconfont icon-sound',
        },
        {
          position: 'top',
          index: 0,
          type: 'door',
          text: 'D2门禁加钞间01',
          icon: 'iconfont-ccb ccbmenjiachaojian',
        },
        {
          position: 'top',
          index: 1,
          type: 'door',
          text: 'D2门禁加钞间02',
          icon: 'iconfont-ccb ccbmenjiachaojian',
        },
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
        videoHost: '#0E63DA',
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
        'videoHost',
        'cabin',
        'cabinHost',
      ],
      gplotChart: '',
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
        l: img12, // 电子围栏
      }
      let colors = this.colors
      this.$nextTick(() => {
        // 字符串字节长度判断
        function b(str) {
          let i = 0
          let c = 0.0
          let unicode = 0
          let len = 0
          if (str == '' || str == null) {
            return 0
          }
          len = str.length
          for (i = 0; i < len; i++) {
            unicode = str.charCodeAt(i)
            if (unicode < 127) {
              //判断是单字符还是双字符
              c += 1
            } else {
              //chinese
              c += 2
            }
          }
          return c
        }
        //
        let nodeData = this.$lodash.cloneDeep(this.gplotData)
        let links = this.getLinks(nodeData)

        this.gplotChart = this.$echarts.init(document.getElementById('gplot'))

        let option = {
          background: '#fff',
          tooltip: {
            formatter: function (param) {
              //判断返回值
              if (param.dataType != 'edge') {
                //如果触发节点
                return param.name //返回标签名
              } else {
                //这里时关系线的情况
              }
            },
          },
          series: [
            {
              legendHoverLink: true,
              type: 'graph', // 类型:关系图
              layout: 'force', // 图的布局，类型为力导图
              symbol: 'rect', //rect矩形  roundRect 圆角矩形  //关系图节点标记的图形。ECharts 提供的标记类型包括 'circle'(圆形), 'rect'（矩形）, 'roundRect'（圆角矩形）, 'triangle'（三角形）, 'diamond'（菱形）, 'pin'（大头针）, 'arrow'（箭头）  也可以通过 'image://url' 设置为图片，其中 url 为图片的链接。'path:// 这种方式可以任意改变颜色并且抗锯齿
              symbolSize: [130, 50], // 调整节点的大小
              roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
              // center: [376, 288], //中心位置
              edgeSymbol: ['none', 'none'],
              edgeSymbolSize: [2, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 20,
                  },
                },
              },
              force: {
                // initLayout: 'circular', //初始布局  （circular：旋转）
                repulsion: 2000,
                edgeLength: 100,
                // layoutAnimation: false  //禁止旋转等动画  导致中心偏移
              },
              // draggable: true,  //是否可拽 默认是false;
              draggable: true,
              itemStyle: {
                color: '#fff',
              },
              lineStyle: {
                normal: {
                  width: 0.8,
                  color: '#4b565b',
                  type: 'dashed',
                },
              },
              label: {
                normal: {
                  width: 130,
                  lineHeight: 50,
                  show: true,
                  formatter: function (params) {
                    console.log(params)
                    var str = ''
                    switch (params.data.type) {
                      case 'vidicon':
                        str =
                          '{dg|}' +
                          '{d|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'alarm':
                        str =
                          '{cg|}' +
                          '{c|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'guard':
                        str =
                          '{bg|}' +
                          '{b|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'talkback':
                        str =
                          '{ag|}' +
                          '{a|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'videoHost':
                        str =
                          '{eg|}' +
                          '{e|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'talkbackHost':
                        str =
                          '{fg|}' +
                          '{f|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'guardHost':
                        str =
                          '{hg|}' +
                          '{h|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'alarmHost':
                        str =
                          '{gg|}' +
                          '{g|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'detector':
                        str =
                          '{jg|}' +
                          '{j|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'tank':
                        str =
                          '{kg|}' +
                          '{k|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'electronicFence':
                        str =
                          '{lg|}' +
                          '{l|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                      case 'opticFiber':
                        str =
                          '{ig|}' +
                          '{i|' +
                          (params.name.length > 8 ? params.name.substring(0, 7) + '...' : params.name) +
                          '}'
                        break
                    }
                    return str
                  },
                  rich: {
                    a: {
                      width: 80,
                      height: 50,
                      fontSize: 12,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#EABA14',
                      backgroundColor: '#EABA14',
                      borderRadius: [0, 2, 2, 0],
                    },
                    ag: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#EABA14',
                      backgroundColor: {
                        image: sportsIcon.a,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    b: {
                      width: 80,
                      height: 50,
                      fontSize: 12,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#38BCBE',
                      backgroundColor: '#38BCBE',
                      borderRadius: [0, 2, 2, 0],
                    },
                    bg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#38BCBE',
                      backgroundColor: {
                        image: sportsIcon.b,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    c: {
                      width: 80,
                      height: 50,
                      fontSize: 12,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#FF2438',
                      backgroundColor: '#FF2438',
                      borderRadius: [0, 2, 2, 0],
                    },
                    cg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#FF2438',
                      backgroundColor: {
                        image: sportsIcon.c,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    d: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#34ACD6',
                      backgroundColor: '#34ACD6',
                      borderRadius: [0, 2, 2, 0],
                      shadowColor: '#20b6ea',
                      shadowOffsetX: 5,
                      shadowOffsetY: 5,
                      shadowBlur: 12,
                    },
                    dg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#34ACD6',
                      borderRadius: [2, 0, 0, 2],
                      backgroundColor: {
                        image: sportsIcon.d,
                      },
                      shadowColor: '#20b6ea',
                      shadowOffsetX: 5,
                      shadowOffsetY: 5,
                      shadowBlur: 12,
                    },
                    e: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#0E64DA',
                      backgroundColor: '#0E64DA',
                      borderRadius: [0, 2, 2, 0],
                    },
                    eg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#0E64DA',
                      backgroundColor: '#fff',
                      backgroundColor: {
                        image: sportsIcon.e,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    f: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#DF7220',
                      backgroundColor: '#DF7220',
                      borderRadius: [0, 2, 2, 0],
                    },
                    fg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#DF7220',
                      backgroundColor: '#fff',
                      backgroundColor: {
                        image: sportsIcon.f,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    g: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#DF1684',
                      backgroundColor: '#DF1684',
                     borderRadius: [0, 2, 2, 0],
                    },
                    gg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#DF1684',
                      backgroundColor: '#fff',
                      backgroundColor: {
                        image: sportsIcon.g,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    h: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#389A82',
                      backgroundColor: '#389A82',
                      borderRadius: [0, 2, 2, 0],
                    },
                    hg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#389A82',
                      backgroundColor: '#fff',
                      backgroundColor: {
                        image: sportsIcon.h,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    i: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#7E7E7E',
                      backgroundColor: '#7E7E7E',
                      borderRadius: [0, 2, 2, 0],
                    },
                    ig: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#7E7E7E',
                      backgroundColor: '#fff',
                      backgroundColor: {
                        image: sportsIcon.i,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    j: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#FF6C00',
                      backgroundColor: '#FF6C00',
                      borderRadius: [0, 2, 2, 0],
                    },
                    jg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#FF6C00',
                      backgroundColor: '#fff',
                      backgroundColor: {
                        image: sportsIcon.j,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    k: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#7696D6',
                      backgroundColor: '#7696D6',
                      borderRadius: [0, 2, 2, 0],
                    },
                    kg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#7696D6',
                      backgroundColor: '#fff',
                      backgroundColor: {
                        image: sportsIcon.k,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                    l: {
                      fontSize: 12,
                      width: 80,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      color: '#fff',
                      borderColor: '#9458ED',
                      backgroundColor: '#9458ED',
                      borderRadius: [0, 2, 2, 0],
                    },
                    lg: {
                      width: 50,
                      height: 50,
                      align: 'left',
                      borderWidth: 1,
                      borderColor: '#9458ED',
                      backgroundColor: '#fff',
                      backgroundColor: {
                        image: sportsIcon.l,
                      },
                      borderRadius: [2, 0, 0, 2],
                    },
                  },
                  color: '#fff',
                },
                emphasis: {
                  show: false,
                  formatter: function (params) {
                    return params.name
                  },
                },
              },
              data: nodeData,
              links: links,
            },
          ],
        }
        this.gplotChart.setOption(option)
      })
    },
    async destroyedGplot() {
      await this.gplotChart.dispose()
    },
    formatData() {
      // 处理格式的函数
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
            target: i.id,
          })
        }
      })
      return links
    },
    computeStyle(pos, i) {
      if (pos === 'left') {
        return { top: `calc(50% - ${-70 * i}px)`, left: `calc(50% - 350px)` }
      } else if (pos === 'right') {
        return { top: `calc(50% - ${-70 * i}px)`, left: `calc(50% + 230px)` }
      } else if (pos === 'top') {
        return { top: 'calc(50% - 220px)', left: `calc(50% - ${150 * i}px)` }
      } else {
        return {}
      }
    },
  },
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
    background: #33acd6;
    color: #fff;
    box-shadow: 5px -5px 0px 1px #33acd6;
  }
  .sound {
    color: #eaba13;
    border-color: #eaba13;
  }
  .alarm {
    color: #f21c22;
    border-color: #f21c22;
  }
  .door {
    color: #38bbbe;
    border-color: #38bbbe;
  }
}
</style>
