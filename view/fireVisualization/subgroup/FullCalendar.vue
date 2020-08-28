<template>
  <div id="fullcalendar">
    {{calendarOptions}}
    <FullCalendars :options="options" />
  </div>
</template>
<script>
// 必须引入
import FullCalendars from '@fullcalendar/vue'
// 必须引入
import interactionPlugin from '@fullcalendar/interaction'
// // 必须引入，日月日程
import dayGridPlugin from '@fullcalendar/daygrid'
// 列表展示、可实现周、天、列表展示线性列表展示（可选）
import timegrid from '@fullcalendar/timegrid'
export default {
  name: '日程组件',
  components: {
    FullCalendars,
  },
  props: ['options'],
  data() {
    return {
      calendarOptionss: {
        headerToolbar: {
          left: 'dayGridMonth,timeGridWeek,timeGridDay',
          center: 'title',
          right: 'prev,next',
        },
        // footerToolbar: {
        //   left: 'custom1,custom2',
        //   center: '',
        //   right: 'prev,next'
        // },
        // customButtons: {
        //   custom1: {
        //     text: 'custom 1',
        //     click: function() {
        //       alert('clicked custom button 1!');
        //     }
        //   },
        //   custom2: {
        //     text: 'custom 2',
        //     click: function() {
        //       alert('clicked custom button 2!');
        //     }
        //   }
        // },

        // header: {
        //   //头部设置

        //   left: 'title', //左边内容

        //   center: '', //中间显示

        //   left: 'prev,next,today,month,agendaWeek,agendaDay', //右边显示
        // },
        plugins: [dayGridPlugin, interactionPlugin, timegrid],
        initialView: 'dayGridMonth',
        // eventBackgroundColor: 'red',
        height: '100%',
        buttonText: { today: '今日', dayGridMonth: '月', timeGridWeek: '周', timeGridDay: '日', prevYear: '去年' },
        locale: 'zh-cn',
        // editable: true, //是否允许修改事件
        // selectable: true,
        // eventLimit: 4, //事件个数
        // allDaySlot: true, //是否显示allDay
        // defaultView: 'month', //显示默认视图
        eventClick: this.eventClick, //点击事件
        dayClick: this.dayClick, //点击日程表上面某一天
        handleWindowResize: true, //是否随浏览器窗口大小变化而自动变化。
        events: [
          {
            title: '事件1', // 事件内容
            start: '2020-07-25 09:00:00', // 事件开始时间
            // end: '2020-05-20 09:00:00', // 事件结束时间
            durationEditable: false,
            color: '#ff9f89',
          },
          {
            rendering: 'background',
            title: '事件1', // 事件内容
            start: '2020-07-20 09:00:00', // 事件开始时间
            end: '2020-07-20 21:00:00', // 事件结束时间
            display: 'background',
            color: 'rgb(11,53,138)',
            durationEditable: false,
          },
          {
            title: '事件3', // 事件内容
            start: '2020-07-28 11:00:00',
          },
          {
            title: '事件4', // 事件内容
            start: '2020-07-28 10:00:00', // 事件开始时间
            // end: '2020-05-20 11:00:00', // 事件结束时间
            textColor: 'red', // 事件的显示颜色
            durationEditable: false,
            resourceEditable: false,
            className: ['green', 'secondClass'],
          },
          {
            title: 'Some title00000',
            start: '2020-07-10 09:00:00',
            allDay: false,
            editable: false,
            backgroundColor: '#SomeColor',
            borderColor: '#SomeColor',
          },
          {
            title: 'Some title2',
            start: new Date(2020, 8, 24, 10, 30),
            allDay: false,
            editable: false,
            backgroundColor: '#SomeColor2',
            borderColor: '#SomeColor2',
          },
        ],
      },
    }
  },
  methods: {
    changeMonth(start, end, current) {
      console.log('changeMonth', start.format(), end.format(), current.format())
    },
    // 点击事件
    eventClick(event, jsEvent, pos) {
      console.log('eventClick', event, jsEvent, pos)
    },
    // 点击当天
    dayClick(day, jsEvent) {
      console.log('dayClick', day, jsEvent)
    },
    // 查看更多
    moreClick(day, events, jsEvent) {
      console.log('moreCLick', day, events, jsEvent)
    },
  },
}
</script>

<style scoped type="less">
#fullcalendar {
  widows: 100%;
  height: 100%;
}
</style>