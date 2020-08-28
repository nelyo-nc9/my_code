## 预览

### previewPlugin

1. 路径  ccb-client\client\src\view\videoManage\preview\school\previewPlugin.vue

2. 底部按钮支持可配置

   1. isButton  boolean 是否显示底部按钮

   2. iconShow  Array 支持外部可配置

      ```javascript
      {
          type: 'left', // 可选left、right 标识该按钮实在左边显示还是右边显示
          index: 0, // 下标，用于计算该按钮的位置 默认宽度是36px
          name: 'ScreenShot' // 该图标的名称
      }
      // 外部自定义图标
      {
          type: 'left', // 可选left、right 标识该按钮实在左边显示还是右边显示
          index: 0, // 下标，用于计算该按钮的位置 默认宽度是36px
          slotName: 'ScreenShot', // 外部生成slot的名称 具名插槽
          width: ''// 按钮所占的宽度
      }
      ```

3. 内部自定义组件

   ```javascript
   ScreenShot, // 截图
   Videotape, // 录像
   Speech, // 对讲
   NiaoKan, // 鸟瞰
   Lunxun, // 轮巡
   Attention, // 重点关注
   Collect, // 收藏
   Volume, // 声音
   Stop, // 停止焦点窗口的预览
   StopAll, // 停止全部预览
   CheckRecode, // 检查记录
   Stream, // 码流切换
   ViewPattern, // 画面模式
   MultiScreen, // 画面分割
   FullScreen // 全屏=
   ```


#### 注意： 工具栏目前只支持内部自定义组件，如需拓展，请外部自己实现

### plugin

1. 路径  ccb-client\client\src\view\videoManage\preview\school\plugin.vue

   1. 底部按钮支持不支持可配置，暂不支持拓展和工具栏整体显示和隐藏

      1. pluginIconShow  boolean 单个窗格的按钮是否显示

         ```javascript
         {
          showBottomIcon: true, // 图标按钮条
          hidemenuIcon: true, // 隐藏
          previewStopIcon: true, // 关闭预览
          isRecordingIcon: true, // 录像类型
          streamChangeIcon: true, // 码流切换
          screenshot: true, // 截图
          muteIcon: true, // 开启伴音
          yuntaiIcon: true, // 云台
          speechIcon: true, // 对讲
          niaokanIcon: true, // 开启鸟瞰
          tvwallIcon: true, // 快速上墙
          quickRecodeIcon: true, // 快速回放
          videoCheckIcon: true, // 视频复核
          detailsIcon: true, // 详情
          quanpingfangdaIcon: true // 全屏
         }
         ```
   
2. 窗口内自定义按钮
    1. 窗口内上方按钮插槽（报警管理-事件提醒中窗口内上方按钮）
    ```
    <template v-slot:topEnd="{paneMark, paneMarkInfo}">
      <el-button @click="ceshi(paneMark, paneMarkInfo)">关注</el-button>
      <el-button @click="ceshi(paneMark, paneMarkInfo)">提示</el-button>
    </template>
    ```
    topEnd：插槽name；paneMarkInfo：窗口的播放信息；paneMark：窗口索引

    2. 窗口内下方按钮插槽（报警管理-事件提醒中窗口内下方按钮）
    ```
    <template v-slot:bottomEnd="{paneMark, paneMarkInfo}">
      <el-button @click="ceshi(paneMark, paneMarkInfo)">异常</el-button>
      <el-button @click="ceshi(paneMark, paneMarkInfo)">误报</el-button>
    </template>
    ```
    bottomEnd：插槽name；paneMarkInfo：窗口的播放信息；paneMark：窗口索引
    
    
    
### 开流接口

1.路径 ccb-client\client\src\view\videoManage\preview\school\previewReq.js

```javascript
ctl/video   调用北京的接口
{
    devIp: data.devIp, // 设备ip
    devPort: data.devPort, // 设备端口
    dport: '数据端口',
    channel: '通道号',
    streamType: '码流信息'
}
```

### 窗口按钮需要的参数

 1. 截图 

 2. 录像

 3. 快速上墙

 4. 组合收藏

    ```javascript
    通道的id， 传给组件内部的字段名称为 id
    ```


4. 对讲

    ```
    设备的id， 传给组件内部字段名称为 dId
    ```

5. 云台

   ```
   通道的类型，传给组件内部字段名称为 subType
   ```




### 注意： 上面功能各个模块用到才传，没有用到可以不传

凡是引用预览组件的需要传一个必要参数

```javascript
   moduleType: {
      type: Number, // 记录日志需要的字段
      default: 1,
      required: true
    }
    emnu: 1 = 视频模块 2 =   报警模块 3 = 门禁模块  4 =  音频模块  5 =  防护舱模块  6 = 停车场模块  7 = 电视墙模块  8 = 消防模块  9 = 金库模块 10 = 互锁门模块	
```

