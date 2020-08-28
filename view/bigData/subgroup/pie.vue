



<template>
  <div>
    <div class="pie" :id="'pie' + index"></div>
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
export default {
  data() {
    return {}
  },
  props: ['options', 'index', 'titles'],
  mounted() {
    this.drawLine(this.options)
  },
  methods: {
    drawLine(option) {
      var myChart = echarts.init(document.getElementById('pie' + this.index))
      // var myChart1 = echarts.init(document.getElementById('warning'))
      if (this.titles) {
        option.title.text = this.titles
      }

      // console.log('myChart', option)
      myChart.setOption(option)
      // myChart1.setOption(this.options)
      // window.addEventListener('resize', () => {
      //   myChart.resize()
      // })
      var _this = this
      myChart.on('click', function(params) {
        // 在用户点击后控制台打印数据的名称
        // console.log(params)
        _this.$emit('peiclick', params)
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      myChart.resize()
    }
  }
}
</script>
<style lang= "less" scoped>
div {
  width: 100%;
  height: 100%;
  .pie {
    width: 100%;
    height: 100%;
  }
}
</style>