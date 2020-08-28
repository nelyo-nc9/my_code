<template>
  <div class="container" :style="{width:width + 'px'}">
    <div class="row">
      <div class="calendar" @click="calendarclick">
        <ul class="month">
          <li class="arrows left" v-on:click="pickPrey()">
            <span class="icon iconfont icon-shrink"></span>
          </li>
          <li class="mup arrows left" v-on:click="pickPre()">
            <span class="icon iconfont icon-jiantou-copy"></span>
          </li>
          <li class="year-month">
            <span class="choose-year" v-if="state!=='en'">
              <span @click="showyear">{{ currentYear }}年</span>
              <span @click="chooseoff('openMonth')">{{ currentMonth}}月</span>
            </span>
            <span class="choose-year" v-else>
              <span @click="chooseoff('openMonth')">{{ currentMonth}}</span> /
              <span @click="showyear">{{ currentYear }}</span>
            </span>
          </li>
          <li class="mdown arrows right" v-on:click="pickNext()">
            <span class="icon iconfont icon-jiantou-copy"></span>
          </li>
          <li class="arrows right" v-on:click="pickNexty()">
            <span class="icon iconfont icon-extend"></span>
          </li>
        </ul>

        <!-- 月份选择 -->
        <ul class="choosemonth" v-if="openMonth">
          <li
            v-for="(i,j) in months"
            :class="{active:j==date.getMonth()}"
            @click="chooseMonth(j)"
            :key="j"
          >{{i}}</li>
        </ul>
        <!-- 年份选择 -->
        <ul class="chooseyear" v-if="openYear">
          <li class="upyear" @click="upyear">
            <i class="icon iconfont icon-arrow-up2"></i>
          </li>
          <li
            v-for="(i,j) in years"
            :class="{active:i==date.getFullYear()}"
            @click="chooseYear(i)"
            :key="j"
          >{{i}}</li>
          <li class="downyear" @click="downyear">
            <i class="icon iconfont icon-arrow-down2"></i>
          </li>
        </ul>

        <ul class="weekdays">
          <li v-for="i in week" :key="i">{{i}}</li>
        </ul>
        <ul class="days">
          <li
            v-on:click="pick(day)"
            v-for="day in days"
            :key="day.getTime()"
            :class="{range: isRange(day), disabled: day.getTime() > dateLimit.maxTime}"
          >
            <span
              v-if="day.getMonth()+1 != currentMonth"
              class="other-month"
              :class="{active:isActive(day)}">{{ day.getDate() }}
            </span>
            <span v-else :class="{active:isActive(day)}">{{ day.getDate() }}</span>
            <span class="sign" v-if="getShowClass(day)&&curNode.ip" v-show="showSign">
              <span :class="[getShowClass(day)?'timed':'']"></span>
            </span>
          </li>
        </ul>
        <ul class="times" v-if="showtime">
          <li style="float:left;" class="timesleft">
            <input type="text" class="hours" v-model="hours" v-on:change="changehours" />
            <span>:</span>
            <input type="text" class="minutes" v-model="minutes" v-on:change="changeminutes" />
            <span>:</span>
            <input type="text" class="seconds" v-model="seconds" v-on:change="changeseconds" />
          </li>
          <li style="float:right;" class="timesrigth">
            <button class="confirms" v-on:click="nowtime">{{current}}</button>
            <button class="confirms" v-on:click="confirm">{{determine}}</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { QUERY_RECORD_CALENDAR } from '@src/http/video/videoPlayback.api.js'
//import { CancelToken } from 'axios'
var moment = require('moment')
moment().format()
export default {
  name: 'Calendar',
  props: {
    showtime: {
      // type: Boolean,
      default: false
    },
    showSign: {
      type: Boolean,
      default: true
    },
    isEmitTime: {
      default: false
    },
    hide: {},
    defaultdate: { type: String },
    timeLimit: {
      default() {
        return {
          minTime: '1900-01-01',
          maxTime: '2100-01-01'
        }
      }
    },
    timesback: {},
    width: {
      type: [Number, String],
      default: 258
    },
    //是否可以选择范围
    daterange: {
      type: Boolean,
      default: false
    },
    curNode: {
      type: Object,
      default: () => {
        return {
          chan: 0,
          ip: '',
        }
      }
    }
  },
  data() {
    return {
      date: '',
      week: [],
      years: [],
      months: [],
      hours: '00',
      minutes: '00',
      seconds: '00',
      current: '当前',
      determine: '确定',
      openMonth: false,
      openYear: false,
      recordObj: {},
      dateLimit: {
        minTime: '',
        maxTime: ''
      },
      state: 'zh_CN',
      isNewCalendarQuery: true,
      startDate: null,
      endDate: null,
      startRange: false,
      dateObj:{
        startTime: '',
        endTime: ''
      }
    }
  },
  watch: {
    'timesback.newTime'(val) {
      this.date = new Date(this.timesback.time.replace(/-/g, '/'))
      this.currentminutes()
      this.currentseconds()
      this.currenthours()
    },
    defaultdate(val) {
      this.date = new Date(val.slice(0, 10).replace(/-/g, '/'))
    },
    hours(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) {
        newval = 0
      }
      if (newval > 23) {
        newval = newval % 10
      }
      this.hours = newval < 10 ? '0' + newval : newval
    },
    minutes(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) {
        newval = 0
      }
      if (newval > 59) {
        newval = newval % 10
      }
      this.minutes = newval < 10 ? '0' + newval : newval
    },
    seconds(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) {
        newval = 0
      }
      if (newval > 59) {
        newval = newval % 10
      }
      this.seconds = newval < 10 ? '0' + newval : newval
    },
    curNode() {
      this.recordObj = {}
      console.log(this.curNode,'curNode')
      if (this.curNode && this.curNode.ip) {
        console.log("111")
        this.videoFilter()
      }
    },
    date(d) {
      if (!this.curNode) {
        return
      }
      if (this.queryDate) {
        const date = this.queryDate
        if (d.getMonth() !== date.getMonth() || d.getFullYear() !== date.getFullYear()) {
          this.videoFilter()
        }
      } else {
        this.videoFilter()
      }
    }
  },
  computed: {
    currentYear() {
      return this.date.getFullYear()
    },
    currentDay() {
      return this.date.getDate()
    },
    currentMonth() {
      const month = this.date.getMonth() + 1
      console.log(month,'month')
      if (month < 10) {
        return '0' + month
      }
      return month
    },
    currentWeek() {
      return this.date.getDay() + 1
    },
    currentNowWeek() {
      return Math.floor((this.currentDay + 6 - this.currentWeek) / 7)
    },
    days() {
      const dayArray = []
      // 今天是周日，放在第一行第7个位置，前面6个
      const center = this.currentNowWeek * 7 + this.currentWeek - 1
      for (let i = center; i >= 0; i--) {
        const d = new Date(this.date)
        d.setDate(d.getDate() - i)
        dayArray.push(d)
      }
      for (let j = 1; j <= 42 - center - 1; j++) {
        let setDay = new Date(this.date)
        setDay.setDate(setDay.getDate() + j)
        dayArray.push(setDay)
      }
      //console.log(dayArray, "dayArray")
      return dayArray
    }
  },
  methods: {
    format(val) {
      return val < 10 ? '0' + val : val
    },
    pick: function(date) {
      console.log(date,'pick date')
      if (date.getTime() > this.dateLimit.maxTime || date.getTime() < this.dateLimit.minTime) {
        return
      }
      if (this.daterange) {
        console.log('this.daterange true')
        this.pickRange(date)
      }
      else{
        //Date对象深拷贝，防止篡改传给父组件的值
        let start = new Date(JSON.parse(JSON.stringify(date)))
        console.log(start, 'start')
        this.dateObj.startTime=this.parseTime(start,1)
        this.dateObj.endTime=this.parseTime(start,this.getMonthDay(start))
      }
      this.date = date
      this.videoFilter()
    },
    //获取该月天数
    //date: Tue Jul 21 2020 13:00:08 GMT+0800 (中国标准时间) 
    getMonthDay(day) {
      let date = new Date(JSON.parse(JSON.stringify(day)))
      let newDate = new Date(parseInt(date.setMonth(date.getMonth() + 1) / 1000) * 1000)
      let dayCount = new Date(parseInt(newDate.setDate(0) / 1000) * 1000).getDate()
      return dayCount
    },
    //时间格式化,后台要求返回的都是00:00,不再获取时分秒
    parseTime(day,setDay=1) {
      let d=new Date(JSON.parse(JSON.stringify(day)))
      let date = new Date(parseInt(d.setDate(setDay) / 1000) * 1000)
      let month = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1)
      let dd = date.getDate() > 10 ? date.getDate() : '0'+date.getDate()
      const newDate = date.getFullYear() + '-' + month + '-' + dd + ' ' + '00:00:00'
                      //+ date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      return newDate;
    },
    /**
     * 范围选择
     */
    pickRange(date) {
      if (!this.startRange) {
        this.startDate = date
        this.endDate = null
        this.$emit('range', { startDate: this.startDate, endDate: this.startDate })
      } else {
        if (date.getTime() < this.startDate.getTime()) {
          this.endDate = this.startDate
          this.startDate = date
        } else {
          this.endDate = date
        }
        this.$emit('range', { startDate: this.startDate, endDate: this.endDate })
      }
      this.startRange = !this.startRange

      //Date对象深拷贝，防止篡改传给父组件的值
      let start = new Date(JSON.parse(JSON.stringify(this.startDate)))
      this.dateObj.startTime=this.parseTime(start,1)
      this.dateObj.endTime=this.parseTime(start,this.getMonthDay(start))
    },
    /**
     * 是否高亮
     */
    isActive(date) {
      // 是否是同一天
      const isSame = (preDate, nextDate) => {
        return (
          preDate.getFullYear() === nextDate.getFullYear() &&
          preDate.getMonth() === nextDate.getMonth() &&
          preDate.getDate() === nextDate.getDate()
        )
      }
      if (!this.daterange && isSame(date, this.date)) {
        return true
      } else if ((this.startDate && isSame(date, this.startDate)) || (this.endDate && isSame(date, this.endDate))) {
        return true
      }
      return false
    },
    /**
     * 是否在选择范围之内
     */
    isRange(date) {
      if (
        this.startDate &&
        this.endDate &&
        date.getTime() > this.startDate.getTime() &&
        date.getTime() < this.endDate.getTime()
      ) {
        return true
      }
      return false
    },
    pickPre: function() {
      let temp = new Date(this.date)
      temp.setDate(1)
      temp.setMonth(temp.getMonth() - 1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) {
        return
      }
      this.date = temp
      if (this.isEmitTime) {
        this.pick(this.date)
      }
      // this.videoFilter()
    },
    pickNext: function(year, month) {
      let temp = new Date(this.date)
      temp.setDate(1)
      temp.setMonth(temp.getMonth() + 1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) {
        return
      }
      this.date = temp
      if (this.isEmitTime) {
        this.pick(this.date)
      }
      // this.videoFilter()
    },
    pickPrey: function() {
      let temp = new Date(this.date)
      temp.setFullYear(temp.getFullYear() - 1)
      temp.setDate(1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) {
        return
      }
      this.date = temp
      this.years.pop()
      this.years.unshift(this.years[0] - 1)
      // this.showyear()
      if (this.isEmitTime) {
        this.pick(this.date)
      }
      // this.videoFilter()
    },
    pickNexty: function(year, month) {
      let temp = new Date(this.date)
      temp.setFullYear(temp.getFullYear() + 1)
      temp.setDate(1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) {
        return
      }
      this.date = temp
      this.years.shift()
      this.years.push(this.years[10] + 1)
      // this.showyear()
      if (this.isEmitTime) {
        this.pick(this.date)
      }
      // this.videoFilter()
    },
    changehours: function() {
      if (this.hours >= 0 && this.hours < 24) {
        this.date.setHours(this.hours)
      }
      this.currenthours()
    },
    changeminutes: function() {
      if (this.minutes >= 0 && this.minutes < 60) {
        this.date.setMinutes(this.minutes)
      }
      this.currentminutes()
    },
    changeseconds: function() {
      if (this.seconds >= 0 && this.seconds < 60) {
        this.date.setSeconds(this.seconds)
      }
      this.currentseconds()
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate: function(year, month, day) {
      const y = year
      let m = month
      if (m < 10) {
        m = '0' + m
      }
      let d = day
      if (d < 10) {
        d = '0' + d
      }
      return y + '-' + m + '-' + d
    },
    confirm: function() {
      const time =
        this.currentYear +
        '-' +
        this.currentMonth +
        '-' +
        (this.currentDay < 10 ? '0' + this.currentDay : this.currentDay) +
        ' ' +
        this.currenthours() +
        ':' +
        this.currentminutes() +
        ':' +
        this.currentseconds()
      this.$emit('checktimes', { time, f: this.hide.f, t: this.date })
      this.hide.f = false
      return time
    },
    nowtime: function() {
      this.date = new Date()
      this.currentminutes()
      this.currentseconds()
      this.currenthours()
    },
    currenthours() {
      this.hours = this.date.getHours() < 10 ? '0' + this.date.getHours() : this.date.getHours()
      return this.hours
    },
    currentminutes() {
      this.minutes = this.date.getMinutes() < 10 ? '0' + this.date.getMinutes() : this.date.getMinutes()
      return this.minutes
    },
    currentseconds() {
      this.seconds = this.date.getSeconds() < 10 ? '0' + this.date.getSeconds() : this.date.getSeconds()
      return this.seconds
    },
    calendarclick: function(e) {
      e.stopPropagation()
    },
    chooseMonth(i) {
      const temp = new Date(this.date)
      temp.setMonth(i)
      temp.setDate(1)
      this.date = temp
      const test = this.formatDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
      this.openMonth = false
    },
    chooseYear(i) {
      const temp = new Date(this.date)
      temp.setFullYear(i)
      temp.setDate(1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) {
        this.openYear = false
        return
      }
      this.date = temp
      const test = this.formatDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
      this.openYear = false
    },
    showyear() {
      this.years = []
      const nowyear = this.date.getFullYear()
      for (let i = 7; i > 0; i--) {
        this.years.push(nowyear - i)
      }
      for (let i = 0; i < 5; i++) {
        this.years.push(nowyear + i)
      }
      this.chooseoff('openYear')
    },
    downyear() {
      const oldyear = this.years[11]
      this.years = []
      for (let i = 1; i < 13; i++) {
        this.years.push(oldyear + i)
      }
    },
    upyear() {
      const oldyear = this.years[0]
      this.years = []
      for (let i = 12; i > 0; i--) {
        this.years.push(oldyear - i)
      }
    },
    chooseoff(i) {
      this.openMonth = false
      this.openYear = false
      if (i) {
        this[i] = true
      }
    },
    // IP转成整型
    ip2int(ip) {
      let num = 0
      ip = ip.split('.')
      num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3])
      num = num >>> 0
      return num
    },
    getMaxDate(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    },
    queryCalendarFlag() {
      // if (this.cancelToken) {
      //   this.cancelToken.cancel('cancel')
      // }
      let dateParam = []
      const date = new Date(this.date.getTime())
      const dateEnd = new Date(date)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      dateEnd.setHours(23)
      dateEnd.setMinutes(59)
      dateEnd.setSeconds(59)
      let maxDate = this.getMaxDate(date)
      while (maxDate !== 0) {
        date.setDate(maxDate)
        dateEnd.setDate(maxDate)
        dateParam.push({
          sTm: parseInt(date.getTime() / 1000),
          eTm: parseInt(dateEnd.getTime() / 1000)
        })
        maxDate--
      }
      dateParam = dateParam.reverse()
      const node = this.curNode
      //this.cancelToken = CancelToken.source()
      // 设备停用不能看日历上标记并且不能回放
      // if (node.eid.deviceStatus === 0) {
      //   return { data: {} }
      // }
      //请求报文
      // {
      // "ip”:"192.168.78.101"
      // "channel":1, //通道号
      // "startTime":"2020-07-20 00:00:00", //开始日期
      // "endTime":"2020-07-30 00:00:00" //结束时间
      // }

      // console.log({
      //     ip: node.ip,
      //     channel: node.channel,
      //     // devPort: node.eid.cport,
      //     // streamType: 'all',
      //     // timeRecord: dateParam,
      //     // eventRecord: dateParam,
      //     // manualRecord: dateParam,
      //     startTime: this.dateObj.startTime,
      //     endTime: this.dateObj.endTime
      //   },'发送查询参数')

      return QUERY_RECORD_CALENDAR(
        {
          ip: node.ip,
          channel: Number(node.channel),
          startTime: this.dateObj.startTime,
          endTime: this.dateObj.endTime
        }
      )

      // return QUERY_RECORD_CALENDAR(
      //   {
      //     ip: node.eid.ip,
      //     channel: node.chan,
      //     devPort: node.eid.cport,
      //     streamType: 'all',
      //     timeRecord: dateParam,
      //     eventRecord: dateParam,
      //     manualRecord: dateParam,
      //   },
      //   this.cancelToken
      // )
    },
    getParsedDate(datevalue) {
      return new Date(datevalue * 1000).getDate()
    },
    dealCalendarData(res) {
      const result = {}
      //事件录像段
      const eventList = res.eventRecord || []
      eventList.forEach(item => {
        if (item.event === 0) {
          return
        }
        const date = this.getParsedDate(item.sTm)
        result[date] = result[date] || {}
        result[date]['event'] = true
      })

      //定时录像段
      const timeList = res.timeRecord || []
      timeList.forEach(item => {
        if (item.event === 0) {
          return
        }
        const date = this.getParsedDate(item.sTm)
        result[date] = result[date] || {}
        result[date]['timed'] = true
      })

      //手工录像段
      // !!!!!!!!!!!后台接口还没有添加 --- manualRecord
      const manualList = res.manualRecord || []
      manualList.forEach(item => {
        if (item.event === 0) {
          return
        }
        const date = this.getParsedDate(item.sTm)
        result[date] = result[date] || {}
        result[date]['manual'] = true
      })

      //智能录像段
      const intelList = res.intelRecord || []
      intelList.forEach(item => {
        if (item.event === 0) {
          return
        }
        const date = this.getParsedDate(item.sTm)
        result[date] = result[date] || {}
        result[date]['intelligence'] = true
      })

      return result
    },
    //async newVideoFilter() {
    async newVideoFilter() {
      try {
        const res = await this.queryCalendarFlag()
        // let res = [{
        //     "dayIndex": "2020-07-01 00:00:00",
        //     "hasRecord": 1,
        //     "fileCount": 2,
        //     "timeType": 1,
        //     "eventType": 1,
        //     "manualType": 1,
        //     "intelType": 1
        //   },
        //   {
        //     "dayIndex": "2020-07-02 00:00:00",
        //     "hasRecord": 0,
        //     "fileCount": 2,
        //     "timeType": 1,
        //     "eventType": 1,
        //     "manualType": 1,
        //     "intelType": 1
        //   },
        //   {
        //     "dayIndex": "2020-07-03 00:00:00",
        //     "hasRecord": 1,
        //     "fileCount": 2,
        //     "timeType": 1,
        //     "eventType": 1,
        //     "manualType": 1,
        //     "intelType": 1
        //   },
        //   {
        //     "dayIndex": "2020-07-04 00:00:00",
        //     "hasRecord": 0,
        //     "fileCount": 2,
        //     "timeType": 1,
        //     "eventType": 1,
        //     "manualType": 1,
        //     "intelType": 1
        //   },
        //   {
        //     "dayIndex": "2020-07-05 00:00:00",
        //     "hasRecord": 1,
        //     "fileCount": 2,
        //     "timeType": 1,
        //     "eventType": 1,
        //     "manualType": 1,
        //     "intelType": 1
        //   }
        // ]
      
        // 应答报文
        // {
          // [
          //   {
          //   "dayIndex":"2020-07-20 00:00:00",
          //   "hasRecord":1, //是否有录像文件 0-否 1-是
          //       "fileCount":2, //这一天的录像文件个数
          //       "timeType":1,, //是否有定时录像 0-否 1-是
          //       "eventType":1, //是否有事件录像 0-否 1-是
          //       "manualType":1, //是否有手动录像 0-否 1-是
          //       "intelType":1, //是否有智能录像 0-否 1-是
          //   },
          //   ...
          // ]
        // }
        //console.log(res,'--res')
        //console.log(res.data,'--res.data')
        //const data = this.dealCalendarData(res.data)
        //console.log(data,'--data')
        //const data = this.dealCalendarData(res)
        let data = []
        res.forEach(item => {
          data[item.dayIndex] = item.hasRecord
        })
        this.recordObj = data
      } catch (e) {
          console.log(e.message)
      }
    },
    videoFilter() {
      //console.log('----videoFilter')
      this.recordObj = {}
      this.queryDate = this.date
      // if (!('eid' in this.curNode)) {
      //   return
      // }
      //console.log(this.isNewCalendarQuery,'---isNewCalendarQuery')
      if (this.isNewCalendarQuery) {
        //console.log('---isNewCalendarQuery')
        console.log('222')
        return this.newVideoFilter()
      }
    },
    getShowClass(date) {
      if(this.recordObj[this.parseTime(date,date.getDate())]){
        return true
      }else{
        return false
      }
    },
    isShow(day){
      let date = JSON.parse(JSON.stringify(day))
      let parse = this.parseTime(date,date.getDay())
      let has = this.recordObj[parse]
      let show = this.curNode.ip && has
      return show
    },
  },
  created: function() {
    const minlimit = this.timeLimit.minTime
    const maxlimit = this.timeLimit.maxTime
    this.dateLimit.minTime = new Date(minlimit.replace(/-/g, '/')).getTime()
    this.dateLimit.maxTime = new Date().getTime() + 24 * 60 * 60
    if (this.defaultdate) {
      let aa = this.defaultdate
      if (aa.length > 10) {
        this.date = new Date(
          aa.slice(0, 4),
          aa.slice(5, 7) - 1,
          aa.slice(8, 10),
          aa.slice(11, 13),
          aa.slice(14, 16),
          aa.slice(17, 19)
        )
      } else {
        this.date = new Date()
        this.date = new Date(
          aa.slice(0, 4),
          aa.slice(5, 7) - 1,
          aa.slice(8, 10),
          this.currenthours(),
          this.currentminutes(),
          this.currentseconds()
        )
      }
    } else {
      this.date = new Date()
    }
    if (this.state === 'zh_CN') {
    } else {
      this.current = 'now'
      this.determine = 'ok'
    }
    moment.locale(this.state)
    this.week = moment.weekdaysMin()
    this.months = moment.months()
    this.currentminutes()
    this.currentseconds()
    this.currenthours()
    this.onClickOutside = () => {
      this.chooseoff()
    }
    document.querySelector('body').addEventListener('click', this.onClickOutside, false)
  },
  beforeDestroy() {
    document.querySelector('body').removeEventListener('click', this.onClickOutside)
    delete this.onClickOutside
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0px;
  border: 0px;
  padding: 0px;
}

ul {
  list-style-type: none;
}

.container {
  width: 230px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.calendar {
  border-radius: 3px;
  margin: 0;
  padding: 0;
  color: #fff;
  width: 100%;
  height: auto;
  overflow: hidden;
  background: #fff;
  position: relative;
}

.choosemonth,
.chooseyear {
  background: #374f7b;
  top: 40px;
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 2;
}

.choosemonth li,
.chooseyear li {
  width: 16.6666%;
  margin: 8px 8.33%;
  text-align: center;
  line-height: 32px;
  float: left;
  cursor: default;
  font-size: 12px;
  color: #fff;
}

.chooseyear li {
  line-height: 26px;
}

.choosemonth li:hover,
.chooseyear li:hover {
  background: #4499f7;
}
.choosemonth li:active,
.chooseyear li:active {
  background: #287fe1;
}

.choosemonth li.active,
.chooseyear li.active {
  background: #4499f7;
  color: #fff;
}

.chooseyear li.upyear,
.chooseyear li.downyear {
  width: 100%;
  height: 12px;
  margin: 0;
  line-height: 12px;
}

.month {
  background: #ebebeb;
  margin: 0;
  padding: 0;
  color: #fff;
  height: 33px;
  font-size: 14px;
}

.year-month {
  flex-direction: column;
  align-items: center;
  cursor: default;
  margin: 0 auto;
  line-height: 33px;
  width: 50%;
  text-align: center;
  float: left;
}

.choose-year {
  color: #fff;
  font-size: 12px;
}

.choose-month {
  text-align: center;
}

.month li {
  color: #898989;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
}
.month li span {
  color: #333333;
}

.arrows {
  padding: 4px 4px;
  color: #fff;
  cursor: pointer;
  line-height: 24px;
  width: 15%;
  text-align: center;
}

.iconfont {
  font-size: 12px;
}

.arrows.left {
  float: left;
}

.arrows.right {
  float: left;
}

.mup {
  width: 10%;
}

.mdown {
  transform: rotate(180deg);
  width: 10%;
}

.weekdays {
  width: 100%;
  margin: 0;
  height: 36px;
  line-height: 36px;
  color: #333333;
  background: #fff;
}

.weekdays li {
  display: inline-block;
  width: 14.28%;
  text-align: center;
  cursor: default;
  float: left;
  font-size: 12px;
}

.days {
  padding: 0 0 5px 0;
  background: #fff;
  margin: 0;
  width: 100%;
  overflow: hidden;
}

.days li {
  width: 14.28%;
  height: 33px;
  text-align: center;
  color: #333333;
  font-size: 12px;
  cursor: pointer;
  float: left;
  line-height: 26px;
  position: relative;
}

.days li > span {
  /*padding: 5px 2px;*/
  display: inline-block;
  width: 23px;
  height: 23px;
  line-height: 23px;
  color: #333;
  margin: 0 auto;
}

.days li span.sign {
  position: absolute;
  width: 10px;
  height: 5px;
  bottom: 2px;
  right: calc(50% - 7px);
  text-align: center;
}
.days li span.sign span {
  /* display: inline-block;  */
  border-radius: 50%;
  float: left;
  width: 6px;
  height: 6px;
}
.days li span.sign span.event {
  background: #ff0000;
}
.days li span.sign span.manual {
  background: #ff6c00;
}

.days li span.sign span.timed {
  background: #32e285;
}
.days li span.sign span.intelligence {
  background: #0088ff;
}

.days li .other-month {
  color: #bbbec4;
}

.days li span:hover {
  background: rgba(40, 127, 225, 0.7);
  border-radius: 50%;
}
.days li span:active {
  background: #287fe1;
  border-radius: 50%;
}

.days li.range {
  background: rgba(40, 127, 225, 0.4);
}

.days li .active {
  border-radius: 50%;
  background: #2d72d3;
  color: #fff;
  display: inline-block;
}

.days li .active:hover {
  background: #66b1ff;
  color: #fff;
}

.days li.disabled,
.days li.disabled span:hover {
  cursor: not-allowed;
  background: #eee;
}

.glyphicon {
  font-size: 12px;
  color: #414141;
}

.times {
  background: #e2ebf4;
  height: 34px;
  padding: 5px;
  text-align: center;
}

.timesleft {
  width: 60%;
  float: left;
}

.timesrigth {
  width: 40%;
  float: right;
}

.times input {
  width: 24%;
  height: 24px;
  text-align: center;
}

.times span {
  margin: 0px 3px;
}

.confirms {
  height: 24px;
  width: 40%;
  background: #4499f7;
  color: #fff;
  font-size: 13px;
  border-radius: 2px;
}
</style>
