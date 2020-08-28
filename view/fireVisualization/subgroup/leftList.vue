<template>
  <div :id="'echarts'+index || '1'" class="echarts"></div>
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
<script >
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
      echartsArr: [],
      msg: 'Welcome to Your Vue.js App',
    }
  },

  mounted() {
    this.drawLine()
  },
  methods: {
    // 拿到数据统一显示图表
    showEcharts() {
      this.echartsArr.forEach((item) => {
        item.hideLoading()
      })
    },

    funb(data) {
      alert('pageb方法被调用')
      //console.log("peiclick",data,  this.item.series.data )
      this.item.series.data = data
      this.drawLine()
    },
    drawLine(isShow) {
      var _this = this
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('echarts' + _this.index || '1'))
      // 绘制图表
      //console.log("_this.item",_this.item,_this.index || "1"  )
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      _this.echartsArr = []
     
      myChart.setOption(
        Object.assign(
          {
            textStyle: {
              fontFamily: 'KaiTi',
              color: '#fff',
            },
          },
          _this.item
        )
      )
       this.echartsArr.push(myChart)
      if (!isShow) {
        myChart.showLoading({
          // 此处需要传入一个对象

          text: '加载中',
          color: '#c23531',
          textColor: 'white',
          maskColor: 'rgba(0,39,103, 0.8)',
          zlevel: 0,
          backgroundColor: 'red',
          // 字体大小。从 `v4.8.0` 开始支持。
          fontSize: 12,
          color: '#3385ff',
        })
      }
    },
  },
  watch: {
    item: {
      handler(newValue, oldValue) {
        this.item = newValue
        console.log()
        this.drawLine()
      this.showEcharts()
      },
      deep: true,
    },
  },
  'item.series.data': {
    handler(newValue, oldValue) {
      //console.log('newValue111111111',newValue,oldValue)
      this.item.series.data = newValue
      this.drawLine()
    },
    deep: true,
    immediate: true,
  },
}
</script>