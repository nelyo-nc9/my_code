<template>
  <div class="grade">
    <label class="progress">
      <label class="progress-content" :style="{width:(parseInt(msLength)/600000*100)+'%'}">
        <!-- <label class="progress-end"></label> -->
        <label class="progress-end">
            <i class="el-icon-microphone"></i>
        </label>
      </label>
    </label>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      msLength: 0,
      ms: 0,
      s: 0,
      time: 0,
      timeLength: 0,
      endTimeLength: 0
    }
  },
  methods: {
    countdown() {
      this.ms = this.ms = 50
      this.msLength + this.ms
      if (this.ms >= 1000) {
        this.ms = 0
        this.s = this.s + 1
      }
      this.timeLength = this.toDub(this.s)
    },
    //  补0操作
    toDub(n) {
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    },
    //  调用时，清除定时器
    beginRecors() {
      clearInterval(this.time)
      this.timeLength = 0
      this.msLength = 0
      this.ms = 0
      this.s = 0
      this.time = setInterval(this.countdown, 50)
    },
    // 结束时  保存timeLength时长到endTimeLength
    overSoundRecord() {
      clearInterval(this.time)
       this.endTimeLength = this.timeLength
       this.msLength = 0
    }
  }
}
</script>

<style lang="less" scoped>
     .grade{
         display: flex;
         align-items: center;
         .progress{
             display: flex;
             align-items: center;
             position: relative;
             width: 215px;
             height:4px;
             background-color: #96daf9;
             border-radius: 5px;
             .progress-content{
                 position: absolute;
                 height: 10px;
                //  background-color: #29a1d9;
                 border-radius: 5px;
                 .progress-end{
                     z-index: 1;
                     position: absolute;
                     right: 0;
                     top:-12px;
                     font-size: 18px;
                    
                    //  background-color: #29a1d9;
                 }
             }
         }
     }
    
   
</style>
