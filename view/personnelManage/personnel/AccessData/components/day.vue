<!--  -->
<template>
   <div id="echarts"></div>
</template>
<script>
export default {
  name: '',
  components: {
    
  },
  data() {
    return {
      
    }
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echarts'))
        // 绘制图表
        myChart.setOption({
              color: ['#3398DB'],
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  },
                  backgroundColor:'rgb(255,255,255,1)',
                  textStyle:{
                      color:"#585858",
                      fontSize:"12"
                  }
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: [
                  {
                      type: 'category',
                      data: ['3-11', '3-12', '3-13', '3-14', '3-15', '3-16', '3-17','3-18','3-19','3-20','3-21','3-22'],
                      axisTick: {
                          alignWithLabel: true
                      }
                  }
              ],
              yAxis: [
                  {
                      type: 'value',
                      splitLine:{
                         show:true,
                         lineStyle:{
                            type:'dashed'
                         }
                      },
                      axisLine:{       //y轴
                        "show":false
                      },
                      axisTick:{       //y轴刻度线
                        "show":false
                      },
                  }
              ],
              series: [
                  {
                      name: 'number',
                      type: 'bar',
                      barWidth: '40%',
                      data: [10, 52, 200, 334, 390, 330,200, 334,52, 200, 33,66]
                  }
              ]
          });
     }
  },
  mounted(){
     this.drawLine()
  },
  created() {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
  
</style>