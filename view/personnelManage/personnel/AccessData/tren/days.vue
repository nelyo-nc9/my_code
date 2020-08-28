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
              tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    backgroundColor:'rgb(255,255,255,1)',
                        textStyle:{
                            color:"#585858",
                            fontSize:"12"
                        }
              },
              xAxis: [
                  {
                      type: 'category',
                      data: ['3-11', '3-12', '3-13', '3-14', '3-15', '3-16', '3-17',
                             '3-18', '3-19', '3-20', '3-21', '3-22', '3-23', '3-24',
                             '3-25',]
                      
                  }
              ],
              yAxis: [
                  {
                      type: 'value',
                      max:30,
                      interval:6,
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
                      type: 'line',
                      data: [16, 14, 17, 16, 25,15, 13,16, 25,15, 13,15, 13,28, 14],
                      itemStyle:{
                          normal:{
                              color:'#0099ff'
                          }
                      },
                  },
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