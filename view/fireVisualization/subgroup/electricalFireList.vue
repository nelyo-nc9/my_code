<template>
  <div :id="'echarts' + index || '1'" class="echarts"></div>
</template>
<style lang="less" scoped>
div {
  // background: blueviolet;
  width: 100%;
  height: 100%;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'hello',
  props: ['item', 'index'],
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },

  mounted() {
    this.drawLine()
  },
  methods: {
    funb(data) {
      alert('pageb方法被调用')
      // console.log("peiclick",data,  this.item.series.data )
      this.item.series.data = data
      this.drawLine()
    },
    drawLine() {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('echarts' + _this.index || '1'))
      if (this.item.series[0].type == 'custom') {
        var MyCubeRect = echarts.graphic.extendShape({
          shape: {
            x: 0,
            y: 0,
            width: 12, //柱宽
            zWidth: 4, //阴影折角宽
            zHeight: 2 //阴影折角高
          },
          buildPath: function(ctx, shape) {
            const api = shape.api
            const xAxisPoint = api.coord([shape.xValue, 0])
            const p0 = [shape.x, shape.y]
            const p1 = [shape.x - 12, shape.y]
            const p4 = [shape.x + 12, shape.y]
            const p2 = [xAxisPoint[0] - 12, xAxisPoint[1]]
            const p3 = [xAxisPoint[0] + 12, xAxisPoint[1]]

            ctx.moveTo(p0[0], p0[1]) //0
            ctx.lineTo(p1[0], p1[1]) //1
            ctx.lineTo(p2[0], p2[1]) //2
            ctx.lineTo(p3[0], p3[1]) //3
            ctx.lineTo(p4[0], p4[1]) //4
            ctx.lineTo(p0[0], p0[1]) //0
            ctx.closePath()
          }
        })
        var MyCubeShadow = echarts.graphic.extendShape({
          shape: {
            x: 0,
            y: 0,
            width: 24,
            zWidth: 4,
            zHeight: 2
          },
          buildPath: function(ctx, shape) {
            const api = shape.api
            const xAxisPoint = api.coord([shape.xValue, 0])
            const p0 = [shape.x, shape.y]
            const p1 = [shape.x - 12, shape.y]
            const p4 = [shape.x + 12, shape.y]
            const p6 = [shape.x + 12 + 4, shape.y - 2]
            const p7 = [shape.x - 12 + 4, shape.y - 2]
            const p3 = [xAxisPoint[0] + 12, xAxisPoint[1]]
            const p5 = [xAxisPoint[0] + 12 + 4, xAxisPoint[1] - 2]

            ctx.moveTo(p4[0], p4[1]) //4
            ctx.lineTo(p3[0], p3[1]) //3
            ctx.lineTo(p5[0], p5[1]) //5
            ctx.lineTo(p6[0], p6[1]) //6
            ctx.lineTo(p4[0], p4[1]) //4

            ctx.moveTo(p4[0], p4[1]) //4
            ctx.lineTo(p6[0], p6[1]) //6
            ctx.lineTo(p7[0], p7[1]) //7
            ctx.lineTo(p1[0], p1[1]) //1
            ctx.lineTo(p4[0], p4[1]) //4
            ctx.closePath()
          }
        })
        echarts.graphic.registerShape('MyCubeRect', MyCubeRect)
        echarts.graphic.registerShape('MyCubeShadow', MyCubeShadow)
      }
      // 绘制图表
      // console.log("_this.item",_this.item,_this.index || "1"  )
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      myChart.setOption(
        Object.assign(
          {
            textStyle: {
              fontFamily: 'KaiTi',
              color: '#fff'
            }
          },
          _this.item
        )
      )
    }
  },
  watch: {
    item: {
      handler(newValue, oldValue) {
        this.item = newValue
        this.drawLine()
      },
      deep: true
    }
  },
  'item.series.data': {
    handler(newValue, oldValue) {
      // console.log('newValue111111111',newValue,oldValue)
      this.item.series.data = newValue
      this.drawLine()
    },
    deep: true,
    immediate: true
  }
}
</script>
