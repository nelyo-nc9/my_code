## 回放组件 说明文档

![maven](https://img.shields.io/badge/Vue-2.4.4-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Lodash-4.17.4-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/moment-2.25.3-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Less-2.7.3-brightgreen?&style=plastic)
![maven](https://img.shields.io/badge/Author-Song-blueviolet?style=plastic&color=E60012)
![maven](https://img.shields.io/badge/Version-V1.00-blue?&style=plastic)

- [简述](#简述)
- [组件结构](#组件结构)
- [传参](#传参)
- [事件](#事件)
- [方法](#方法)
- [其他](#其他)
  - [未完成功能](#未完成功能)

---

### 简述

该组件为对原有回放组件进行整理优化完成。

支持：
+ 同步回放
+ 异步回放
+ 中心回放
+ 前端回放

该组件为回放组件的基础功能组件。  
基于模块化思想。  
可使用该组件根据需求进行二次开发。减少开发人员开发成本。

---

### 组件结构
```
│  index.vue // 回放组件 基类
│  README.md // 说明文档
├─async // 同步回放业务逻辑
├─common // 公共方法
│  │  playback.js
│  │  timelineCalc.js
│  └─css // 公共样式
│          slider.less
├─components // 公共组件
│  │  BScalendar.vue // 日历
│  │  BStimePicker.vue // 时间轴组件
│  │  playBackPlugin.vue
│  │  QuickToWall.vue // 快速上墙
│  │  Slider.vue // 进度条组件
│  │  timeProgress.vue // 新时间轴组件
│  │  videoHierarchy.vue // 全屏组件
│  ├─bsvue
│  │  │  index.js
│  │  │
│  │  └─components
│  │      └─scroll // 滚动轴
│  │              scroll.vue
│  │              scrollBar.vue
│  │              scrollForSelect.vue
│  │              tinyscrollbar.css
│  │              tinyscrollbar.js
│  └─iconComponents // 按钮组件
│          Attention.vue
│          CutDownload.vue
│          Download.vue
│          FullScreen.vue
│          MultiScreen.vue
│          NiaoKan.vue
│          Play.vue
│          PlaySpeed.vue
│          Rewind.vue
│          ScreenMode.vue
│          ScreenShot.vue
│          SplitMode.vue
│          Stop.vue
│          StopAll.vue
│          TVWall.vue
│          Volume.vue
│          ZhuZhen.vue
└─sync // 异步回放业务逻辑
```




---

### 传参

---

### 事件

---

### 其他

#### 未完成功能

---