<template>
  <div class="alarm-log-video">
    <el-dialog title='报警录像回放' :visible.sync="videoStatus" width="64%" @close="close" :close-on-click-modal="false">
        <div class="video-content">
          <div class="left-tree">
            <!-- <treeBox
              ref="treeDiv"
              :lazyTreeSearchApi="getTree"
              iconToggle
              :checkboxToggle="isShowCheckBox"
              @dblclick="doubleOpenplayBack"
            ></treeBox> -->
            <!---->
            <el-tree :data="dataTree"
                :node-key="nodeKey"
                accordion
                @node-click="doubleOpenplayBack"
                :default-checked-keys="[5]"
                :props="defaultProps">
                <div class="treeInfo" slot-scope="{ node, data }">
                  <span class="treeIcon leftIcon">
                    <i class="iconfont" :class="[getNodeIcon(data).class]" :title="getNodeIcon(data).title"></i>
                  </span>
                  <span class="treeText" :title="data | filterTitle">{{ node.label }}</span>
                </div>
            </el-tree>
          </div>
          <div class="right-video">
            <playBackPlugin
              ref="pluginP"
              :iconShow="iconShowParams"
              :defaultPane="4"
              :isCenterP="isCenter"
              :channelName="currentSelectObj.name"
              @transforFull='transforFull'
              :configuration="configuration"
            >
            </playBackPlugin>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getNodeIcon } from '@src/components/tree/iconMethods.js'
import treeBox from '@src/components/tree/treeBox'
import playBackPlugin from '@src/view/videoManage/playback/playBackPlugin/playBackPlugin'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import { getAlarmLoglinkTree } from '@src/http/alarm/alarmHostConfig.api.js'
export default {
  components: {
    playBackPlugin,
    treeBox
  },
  props: {
    videoControl: {
      type: Boolean,
      default: false
    },
    alarmModelData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    configuration:{
      type:Object,
      default:()=>{
        return {
          progressBar: {
            show: false, // 是否配置进度条
            type: '' // curtime代表显示当前播放时间 //totaltime：代表显示当时时间/总时间,""：代表只显示进度条不显示任何配置
          },
          timeline: {
            calcHeight:'50px',//时间轴高度差
            step:1,//当前时间周期
            show: true, // 是否配置时间轴
            syncTypeFlag: false, // 是否配置同步异步功能
            isNeedCenterTime: true, // 中心时间
            periodFlag: true, // 是否配置周期切换功能
            SliceFlag: true, // 是否配置切片功能
            passageName: true, // 是否配置通道名称功能
            
          },
          eventType:[{
            name: '事件录像',
            color: '#FF0000'
          }],
          buttos: []
          }
        }
      },
    },
  data() {
    return {
      dataTree: [],
      videoStatus: false,
      iconShowParams: [
        {
          type: 'left',
          index: 4,
          name: 'PlaySpeed'
        },
        // {
        //   type: 'left',
        //   index: 3,
        //   name: 'ZhuZhen'
        // },
        // { type: 'left', index: 6, name: 'Attention' },
        {
          type: 'left',
          index: 0,
          name: 'Play'
        },
        // {
        //   type: 'left',
        //   index: 7,
        //   name: 'CheckRecode'
        // },
        {
          type: 'left',
          index: 8,
          name: 'Volume'
        },
        {
          type: 'left',
          index: 1,
          name: 'Stop'
        },
        {
          type: 'left',
          index: 2,
          name: 'StopAll'
        },
        // {
        //   type: 'left',
        //   index: 0,
        //   slotName: 'Screen01',
        //   width: 0
        // },
        // {
        //   type: 'right',
        //   index: 7,
        //   name: 'SplitMode'
        // },
        {
          type: 'right',
          index: 6,
          name: 'CutDownload'
        },
        {
          type: 'right',
          index: 4,
          name: 'NiaoKan'
        },
        // {
        //   type: 'right',
        //   index: 3,
        //   name: 'TVWall'
        // },
        {
          type: 'right',
          index: 5,
          name: 'ScreenShot'
        },
        // {
        //   type: 'right',
        //   index: 5,
        //   name: 'Download'
        // },
        // {
        //   type: 'right',
        //   slotName: 'Screen01',
        //   width: 0,
        //   index: 3
        // },
        {
          type: 'right',
          name: 'ScreenMode',
          index: 2
        },
        {
          type: 'right',
          name: 'MultiScreen',
          index: 1
        },
        {
          type: 'right',
          index: 0,
          name: 'FullScreen'
        },
        {
          type: 'left',
          index: 5,
          name: 'Rewind'
        }
      ], // 需要配置的底部按钮数组
      isCenter: true, //   false：前端回放   true：中心回放
      currentSelectObj: {
        name: ''
      },
      isFullScreen: false,
      // customizeQuery: {
      //   params: {
      //     isRecursion: 0,
      //     subSystem: 1,
      //     channelType: 1
      //   }
      // },
      currentParentNode: {},
      isShowCheckBox: false, // 是否显示机构树的复选框
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      endTime: 0,
      startTime: 0,
      handleNodeKeys: [],
      treeId: ''
    }
  },
  watch: {},
  created() {
    this.nodeKey = this.treeId
    this.videoStatus = this.videoControl
    console.log('~~查看日志报警数据~~', this.alarmModelData)
    // this.$nextTick(() => {
    //   this.$refs.treeDiv.inputSearch()
    // })
  },
  methods: {
    // nodeClick(node) {
    //   if (node.tierType === 'res') {
    //     this.Preview(node)
    //   }
    // },
    // 节点样式配置
    // 左侧图标及title
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    nodeStyle(data) {
      if (['org', 'loc'].includes(data.tierType)) { return '' } // 过滤非资源节点
      if (this.handleNodeKeys.length && this.handleNodeKeys.includes(data[this.nodeKey])) {
        return 'highlight'
      } else {
        return data.status // online/offline
      }
    },
    Preview(val) {
      let data = {
        ...val,
        channel: Number(val.serise) || Number(val.channelNum),
        devIp: val.type === 4 ? val.ip : val.hostIp,
        devCport: val.type === 4 ? val.cport : val.hostPort,
        devDport: val.type === 4 ? val.dport : val.hostDport,
        streamType: val.streamType === 1 ? 'main' : val.streamType === 2 ? 'sub1' : 'sub2',
        detail: val
      }
      console.log(data)
      this.$refs.pluginP.openBackVideo(data)
    },
    getKeyPartVideoTreeFuc() {
      getAlarmLoglinkTree({linkInfo: this.alarmModelData.linkInfo, startTime: this.$moment(this.alarmModelData.startTime).unix()}).then(res => {
        if (res.data && res.data.code === 0) {
          ;[res.data.data].map(item => {
          })
          this.dataTree = [res.data.data.tree]
          this.startTime = res.data.data.startTime
          this.endTime = res.data.data.endTime
        }
      })
    },
    // 机构树 懒加载获取
    getTree(params) {
      return getAlarmLoglinkTree(params)
    },
    // 机构树 递归获取
    // lazyTreeCheckApi(pObj) {
    //   let params = {
    //     ...pObj,
    //     isRecursion: 1
    //   }
    //   return getTreeApi(params)
    // },
    // 双击节点开流
    async doubleOpenplayBack(data, node) {
      console.log(data, node, '===双击数据==')
      // this.currentSelectObj = data
      let streamTypeObj = {
        'main': 'main',
        'sub': 'sub1',
        'sub2': 'sub2',
        1: 'main',
        2: 'sub1',
        3: 'sub2'
      }
      this.currentSelectObj = {
        ...data,
        channel: Number(data.channel), // 设备通道
        devPort: data.devCport,
        streamType: streamTypeObj[data.streamType] || 'main' // 码流类型（main,sub）
      }
      this.currentSelectObj.devType = this.getDevType(data)
      this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
      if (data.tierType === 'res') {
        // var womod = this.checkedPane //如果需求改成需要在焦点窗口开流，就加这一条
        let parentData = node.parent.data
        this.currentParentNode = {
          devIp: parentData.ip,
          devPort: parentData.cPort,
          type: parentData.type
        }

        let param = {
          ...this.currentSelectObj,
          recordType: 'eventRecord',
          // devPort: data.devCport, // 设备端口，
          // channel: Number(data.channel), // 设备通道
          startTime: this.startTime, // 开始时间是当前日期0点
          endTime: this.endTime // 结束时间
          // streamType: streamTypeObj[data.streamType] || 'main' // 码流类型（main,sub）
        }
        // param.devType = this.getDevType(data)
        console.log(param, 'param36363636++++++')
        this.$refs.pluginP.openBackVideo(param)
      }
      // this.$refs.pluginP.getSyncStatus(this.isShowCheckBox)
    },
    getDevType(data) { // 获取镜头类型
      if (data.sipCode) {
        if (data.deviceType > 3) {
          return 4
        } else {
          return 2
        }
      } else {
        if (data.deviceType > 3) {
          return 3
        } else {
          return 1
        }
      }
    },
    // 确认关联控制
    sureLinkClick() {
      this.videoStatus = false
      this.$emit('sureClick', false)
    },
    close() {
      this.$emit('sureClick', false)
    },
    transforFull(isFullScreen) {
      this.isFullScreen = isFullScreen
    }
  },
  mounted() {
    this.getKeyPartVideoTreeFuc()
  },
  filters: {
    // 过滤节点名称
    filterTitle(val) {
      return val.name
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-log-video {
  .video-content {
    display: flex;
    height: 800px;
    .left-tree {
      width: 22%;
    }
    .right-video {
      width: 78%;
    }
  }
  /* 树的背景颜色 */
  background: transparent;
  /deep/ .el-tree {
    .is-current > .el-tree-node__content .treeInfo .treeText,
    .el-tree-node__content:hover {
      .treeText {
        color: #2d72d3;
      }
      .rightIcon i {
        color: #758ebb;
      }
    }
    .rightIcon > i:hover {
      color: #2d72d3 !important;
    }
  }
  // 机构树内容
  .treeInfo {
    width: calc(~'100% - 24px');
    height: 100%;
    line-height: 40px;
    position: relative;
    /deep/ .treeText {
      max-width: calc(~'100% - 20px');
    }
    // 机构树图标
    & > .treeIcon {
      // 机构树左图标
      // &.leftIcon {}
      // 机构树右图标
      &.rightIcon {
        position: absolute;
        right: 2px;
        // & > i:hover {
        //   color: #2d72d3;
        // }
      }
    }
    // 机构树文字信息
    .treeText {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: bottom;
    }
    // 高亮
    &.highlight {
      & > .leftIcon > i,
      .treeText {
        color: #2d72d3;
      }
    }
    // 离线
    &.offline {
      & > .leftIcon > i,
      .treeText {
        color: #c0c4cc;
      }
    }
  }
}
</style>
<style lang="less">
.alarm-log-video {
  .el-dialog__body {
    padding: 0px 20px !important;
  }
  .el-dialog__wrapper {
    // z-index: 200 !important;
  }
}
.v-modal {
  z-index: 999 !important;
}
</style>