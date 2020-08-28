<template>
  <div class="timer">
    <span ref="startTimer">00:00:00</span>
  </div>
</template>
<script>
export default {
  name: 'Timer',
  props: {
    time: {
      type: Number,
    },
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      timer: '',
      hour: 0,
      minutes: 0,
      seconds: 0,
      cr: '',
    }
  },
  created() {
    // this.timer = setInterval(this.startTimer, 1000);
  },
  methods: {
    startTimer() {
      // console.log(this.seconds)
      this.seconds += 1
      if (this.seconds >= 60) {
        this.seconds = 0
        this.minutes = this.minutes + 1
      }

      if (this.minutes >= 60) {
        this.minutes = 0
        this.hour = this.hour + 1
      }
      // console.log(this.hour)
      // console.log(this.minutes)
      // console.log(this.seconds)
      this.$refs.startTimer.innerHTML =
        (this.hour < 10 ? '0' + this.hour : this.hour) +
        ':' +
        (this.minutes < 10 ? '0' + this.minutes : this.minutes) +
        ':' +
        (this.seconds < 10 ? '0' + this.seconds : this.seconds)
      this.cr = this.seconds
      // console.log( this.$refs.startTimer.innerHTML)
    },
    stop() {
      this.endDate = new Date()
      // console.log(this.startDate)
      // console.log(this.endDate)
      clearInterval(this.timer)
      this.hour = 0
      this.minutes = 0
      this.seconds = 0
      this.$refs.startTimer.innerHTML = '00:00:00'
    },
    start() {
      console.log('开始计时')
      this.startDate = new Date()
      // console.log( this.startDate)
      this.timer = setInterval(this.startTimer, 1000)
    },
    format(date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        'H+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      return fmt
    },
    getTimeInfo() {
      // console.log(this.startDate)
      // let startTime = this.startDate.getTime()
      // let endTime = this.endDate.getTime()
      // return {
      //   duration: Math.round((endTime - startTime) / 1000),
      //   endTime: this.format(this.startDate, 'yyyy-MM-dd HH:mm:ss'),
      //   startTime: this.format(this.endDate, 'yyyy-MM-dd HH:mm:ss'),
      // }
    },
  },
  beforeDestroy(){
    // if(this.startTimer){
    //   clearInterval(this.startTimer);
    // }
  },
}
</script>
