<template>
  <div class="main">
    <div class="top-box">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline"
             style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>报警管理</el-breadcrumb-item>
          <el-breadcrumb-item>报警主机关联配置</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
          <el-breadcrumb-item>关联配置</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
      <div class="button-box">
        <el-button size="mini"
                   @click="cancel">返回列表</el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="left-box">
        <el-tabs type="border-card"
                 style="height:590px;width:608px"
                 v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane label="视频通道"
                       name="1"></el-tab-pane>
          <el-tab-pane label="对讲通道"
                       name="2"></el-tab-pane>
          <el-tab-pane label="门禁通道"
                       name="3"></el-tab-pane>
          <el-tab-pane label="输出通道"
                       name="4"></el-tab-pane>
        </el-tabs>
        <div class="tab-content">
          <div class="left-tree-box">
            <div style="text-align:center;">源</div>
            <div class="tree-box">
              <treeBox ref="treebox"
                       :lazyTreeApi="getTreeApi"
                       :customizeQuery="customizeQuery"
                       @checkclick="onceClick"
                       treeLazyToggle
                       iconToggle
                       checkboxToggle
                       v-if="treeToogle"
                       :treeType="treeType"
                       :disabledTreeItem="disabledTreeItem"></treeBox>
            </div>
          </div>
          <div class="icon-box">
            <i class="el-icon-right"
               @click="rightPush"></i>
            <i class="el-icon-back"
               @click="back"></i>
          </div>
          <div style="flex:1">
            <div style="text-align:center;">目标</div>
            <div class="tree-box">
              <!-- <p class="active-style" :tabindex="item.channelId" v-for="item in resData" :key="item.name" @click="checkBack(item.channelId)">{{item.name}}</p> -->
              <el-tree ref="righttree"
                       v-if="elTree"
                       :data="targetData"
                       :props="treeProps"
                       default-expand-all
                       @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
        </div>
        <div style="text-align:center;margin-top:24px">
          <el-button size="mini"
                     type="primary"
                     @click="save">保存</el-button>
          <el-button size="mini"
                     @click="cancel">取消</el-button>
        </div>
      </div>
      <div class="gplot">
        <div style="text-align:center;">
          <Gplot :gplotData="gplotData"
                 v-if="isShowGplot"></Gplot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getLazyTreeApi } from '@src/http/video/videoPreview.api.js'
import Gplot from '../../../../videoManage/components/gplot'
export default {
  props: {
    isShowConfig: {
      type: Boolean
    },
    hostInfo: {
      type: Object
    },
    relatedType: {
      type: String
    }
  },
  components: {
    treeBox,
    Gplot
  },
  data() {
    return {
      elTree: true,
      targetData: [
        {
          id: 1,
          name: '一级 1',
          children: []
        }
      ],
      treeProps: {
        label: 'name'
      },
      gplotData: [],
      customizeQuery: {
        // 机构树传参
        params: {
          type: 0,
          relOrgId: this.hostInfo.orgId,
          subSystem: '1',
          channelType: '1', // 通道类别：1|视频,2对讲,3|门禁.4|输出
          isRecursion: '0',
          resClass: ''
        }
      },
      treeType: 0,
      resData: [],
      temp: {},
      backId: '',
      activeName: '1',
      treeToogle: true,
      isRight: false,
      isShowGplot: true,
      tempArr: {},
      disabledData: [],
      rightSelectNode: '',
      cureResTndex: 0,
      currTopeIndex: 0,
      updataBindArr: [],
      orginBindArr: []
    }
  },
  created() {
    this.targetData[0].name = this.relatedType === '1' ? this.hostInfo.name : this.hostInfo.name
    if (this.relatedType === '1') {
      this.getAlarmHostBind({ hostId: this.hostInfo.id }).then(res => {
        this.tempArr = res
        this.updataBindArr = JSON.parse(JSON.stringify(res.results))
        this.orginBindArr = JSON.parse(JSON.stringify(res.results))
        this.targetData[0].children = []
        if (this.activeName === '1') {
          if (res.video && res.video.length > 0) {
            this.targetData[0].children = res.video
          }
        }
        this.dealDisableData()
      })
      this.getHostTopoCommon()
    } else {
      this.getDetectorBind({ detectorId: this.hostInfo.id }).then(res => {
        this.tempArr = res.data
        this.targetData[0].children = []
        if (this.activeName === '1') {
          if (res.data.video && res.data.video.length > 0) {
            this.targetData[0].children = res.data.video
          }
        }
        this.dealDisableData()
      })
      this.getDetectorTopoCommon()
    }
  },
  methods: {
    ...mapActions(['addAlarmHostBind', 'updataAlarmHostBind', 'addDetectorBind', 'getAlarmHostBind', 'getDetectorBind']),
    dealDisableData() {
      let disabledData = []
      this.tempArr.video &&
        this.tempArr.video.forEach(i => {
          disabledData.push('res' + i.id)
        })
      this.tempArr.audio &&
        this.tempArr.audio.forEach(i => {
          disabledData.push('res' + i.id)
        })
      this.tempArr.guard &&
        this.tempArr.guard.forEach(i => {
          disabledData.push('res' + i.id)
        })
      this.tempArr.outChannel &&
        this.tempArr.outChannel.forEach(i => {
          disabledData.push('res' + i.id)
        })
      this.disabledData = disabledData
    },
    cancel() {
      this.$emit('update:isShowConfig', false)
      this.$emit('clearSelect')
    },
    disabledTreeItem(data) {
      // 默认复选框禁用
      let tierTypeData = ['loc', 'org', 'equ']
      return tierTypeData.includes(data['tierType']) || this.disabledData.includes(data['nodeKey'])
    },
    handleNodeClick(data, node) {
      if (!data.children) {
        if (data.id) {
          this.cureResTndex = this.targetData[0].children.findIndex(item => item.id === data.id)
        } else {
          this.cureResTndex = this.targetData[0].children.findIndex(item => item.channelId === data.channelId)
        }
        this.currTopeIndex = this.gplotData.findIndex(item => item.name === data.name)
      }
      if (!(data.rcId || data.tierType)) {
        // this.rightSelectData = data // 只能是目标
        // this.createGplot()
      }
      this.rightSelectNode = node // 节点可以是目标也可以添加的资源
    },
    getDetectorTopoCommon() {
      this.getDetectorBind({ detectorId: this.hostInfo.id })
        .then(res => {
          this.gplotData = []
          const result = res.data.results
          let center = {
            name: this.hostInfo.name,
            type: 'detector',
            id: '1',
            center: true // 用来标识中心元素
          }
          this.gplotData.push(center)
          for (let i = 0; i < result.length; i++) {
            let temp = {
              name: result[i].name,
              type:
                result[i].type === 1
                  ? 'vidicon'
                  : result[i].type === 4
                    ? 'alarmHost'
                    : result[i].type === 2
                      ? 'talkback'
                      : 'guardHost',
              id: String(i + 2)
            }
            this.gplotData.push(temp)
          }
          this.isShowGplot = false
          this.$nextTick(() => {
            this.isShowGplot = true
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getHostTopoCommon() {
      this.getAlarmHostBind({ hostId: this.hostInfo.id })
        .then(res => {
          this.gplotData = []
          const result = res.results
          let center = {
            name: this.hostInfo.name,
            type: 'alarmHost',
            id: '1',
            center: true // 用来标识中心元素
          }
          this.gplotData.push(center)
          for (let i = 0; i < result.length; i++) {
            let temp = {
              name: result[i].name,
              type:
                result[i].type === 1
                  ? 'vidicon'
                  : result[i].type === 4
                    ? 'alarmHost'
                    : result[i].type === 2
                      ? 'talkback'
                      : 'guardHost',
              id: String(i + 2)
            }
            this.gplotData.push(temp)
          }
          this.isShowGplot = false
          this.$nextTick(() => {
            this.isShowGplot = true
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    updataCommon(args, type) {
      let newArr = []
      let temp = JSON.parse(JSON.stringify(this.orginBindArr))
      for (let i = 0; i < args.length; i++) {
        if (!args[i].id) {
          newArr.push(args[i])
        } else {
          for (let j = 0; j < temp.length; j++) {
            if (temp[j].id === args[i].id) {
              temp.splice(j, 1)
            }
          }
        }
      }
      for (let i = 0; i < temp.length; i++) {
        newArr.push(temp[i])
      }
      for (let h = 0; h < newArr.length; h++) {
        if (String(newArr[h].type) !== this.activeName) {
          newArr.splice(h, 1)
          h--
        }
      }
      this.updataAlarmHostBind(newArr)
        .then(res => {
          this.$messageSuccess('配置关联成功', '成功')
          this.getHostTopoCommon()
          // if (this.relatedType === '1') {
          //   this.getAlarmHostBind({ hostId: this.hostInfo.id }).then(res => {
          //     this.tempArr = res
          //     this.updataBindArr = JSON.parse(JSON.stringify(res.results))
          //     this.orginBindArr = JSON.parse(JSON.stringify(res.results))
          //   })
          // }
          this.resData = []
        })
        .catch(err => {
          console.log(err)
        })
    },
    save() {
      if (this.relatedType === '1') {
        // this.addAlarmHostBind(this.resData)
        //   .then(res => {
        //     this.$messageSuccess('配置关联成功', '成功')
        //     this.getHostTopoCommon()
        //     this.resData = []
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
        if (this.activeName === '1') {
          let oneArr = this.updataBindArr.filter(item => {
            return item.type === 1
          })
          for (let i = 0; i < oneArr.length; i++) {
            oneArr[i].subSystem = 1
          }
          this.updataCommon(oneArr, 1)
        }
        if (this.activeName === '2') {
          let oneArr = this.updataBindArr.filter(item => {
            return item.type === 2
          })
          for (let i = 0; i < oneArr.length; i++) {
            oneArr[i].subSystem = 4
          }
          this.updataCommon(oneArr, 2)
        }
        if (this.activeName === '3') {
          let oneArr = this.updataBindArr.filter(item => {
            return item.type === 3
          })
          for (let i = 0; i < oneArr.length; i++) {
            oneArr[i].subSystem = 3
          }
          this.updataCommon(oneArr, 3)
        }
        if (this.activeName === '4') {
          let oneArr = this.updataBindArr.filter(item => {
            return item.type === 4
          })
          for (let i = 0; i < oneArr.length; i++) {
            oneArr[i].subSystem = 2
          }
          this.updataCommon(oneArr, 4)
        }
      } else {
        this.addDetectorBind(this.resData)
          .then(res => {
            this.$messageSuccess('配置关联成功', '成功')
            this.getDetectorTopoCommon()
            this.resData = []
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    getTreeApi(params) {
      return getLazyTreeApi(params)
    },
    onceClick(data, node) {
      // if (data.tierType === 'res') {
      //   if (this.relatedType === '1') {
      //     this.temp = {
      //       alarmHostId: this.hostInfo.id,
      //       name: data.name, // 设备名称
      //       type: Number(this.activeName), // 设备类型:1|视频，2|对讲，3|门禁，4|通道
      //       channelId: data.id,
      //       deviceId: data.dId
      //     }
      //   } else {
      //     this.temp = {
      //       detectorId: this.hostInfo.id,
      //       name: data.name, // 设备名称
      //       type: Number(this.activeName), // 设备类型:1|视频，2|对讲，3|门禁，4|通道
      //       channelId: data.id,
      //       deviceId: data.dId
      //     }
      //   }
      //   this.isRight = true
      //   if (this.activeName === '4') {
      //     this.temp.subSystem = data.subSystem
      //   }
      // } else {
      //   this.isRight = false
      // }
    },
    // rightCommon() {
    // },
    rightPush() {
      let data = this.$refs.treebox.getCheckedNodes()
      let newData = []
      data.map(item => {
        if (item.tierType === 'res') {
          newData.push(item)
        }
      })
      for (let i = 0; i < newData.length; i++) {
        let tempObj = {}
        if (this.relatedType === '1') {
          tempObj = {
            alarmHostId: this.hostInfo.id,
            name: newData[i].name, // 设备名称
            type: Number(this.activeName), // 设备类型:1|视频，2|对讲，3|门禁，4|通道
            channelId: newData[i].id,
            deviceId: newData[i].dId
          }
        } else {
          tempObj = {
            detectorId: this.hostInfo.id,
            name: newData[i].name, // 设备名称
            type: Number(this.activeName), // 设备类型:1|视频，2|对讲，3|门禁，4|通道
            channelId: newData[i].id,
            deviceId: newData[i].dId
          }
        }
        if (this.resData.indexOf(tempObj) === -1) {
          this.resData.push(tempObj)
          let newtempObj = JSON.parse(JSON.stringify(tempObj))
          if (this.activeName === '1') {
            newtempObj.subSystem = 1
            this.updataBindArr.push(newtempObj)
          }
          if (this.activeName === '2') {
            newtempObj.subSystem = 4
            this.updataBindArr.push(newtempObj)
          }
          if (this.activeName === '3') {
            newtempObj.subSystem = 3
            this.updataBindArr.push(newtempObj)
          }
          if (this.activeName === '4') {
            newtempObj.subSystem = 2
            this.updataBindArr.push(newtempObj)
          }
        }
        if (this.targetData[0].children.indexOf(tempObj) === -1) {
          this.targetData[0].children.push(tempObj)
        }
        // 将左边的节点复选框禁用
        this.disabledData.push('res' + tempObj.channelId)
        let tempTopo = {
          name: tempObj.name,
          type:
            tempObj.type === 1
              ? 'vidicon'
              : tempObj.type === 4
                ? 'alarmHost'
                : tempObj.type === 2
                  ? 'talkback'
                  : 'guardHost',
          id: String(this.gplotData.length + 1)
        }
        this.gplotData.push(tempTopo)
      }
      // if (this.isRight) {
      //   if (this.resData.indexOf(this.temp) === -1) {
      //     this.resData.push(this.temp)
      //   }
      // }
      // if (this.targetData[0].children.indexOf(this.temp) === -1) {
      //   this.targetData[0].children.push(this.temp)
      // }
      this.$refs.treebox.setCheckedKeys([])
      this.elTree = false
      this.$nextTick(() => {
        this.elTree = true
      })
      this.isShowGplot = false
      this.$nextTick(() => {
        this.isShowGplot = true
      })
    },
    back() {
      for (let i = 0; i < this.resData.length; i++) {
        if (this.resData[i].channelId === this.backId) {
          this.resData.splice(i, 1)
        }
      }
      // this.$refs.righttree[0].remove(this.rightSelectNode)
      let index = this.disabledData.findIndex(item => item === 'res' + this.backId)
      this.targetData[0].children.splice(this.cureResTndex, 1)
      if (this.activeName === '1') {
        // let index = this.updataBindArr.findIndex(item => this.resData[this.cureResTndex])
        this.updataBindArr.splice(this.cureResTndex, 1)
      }
      if (this.activeName === '2') {
        let index = this.updataBindArr.findIndex(item => this.resData[this.cureResTndex])
        this.updataBindArr.splice(index, 1)
      }
      if (this.activeName === '3') {
        let index = this.updataBindArr.findIndex(item => this.resData[this.cureResTndex])
        this.updataBindArr.splice(index, 1)
      }
      if (this.activeName === '4') {
        let index = this.updataBindArr.findIndex(item => this.resData[this.cureResTndex])
        this.updataBindArr.splice(index, 1)
      }
      this.disabledData.splice(index, 1)
      this.gplotData.splice(this.currTopeIndex, 1)
      this.isShowGplot = false
      this.$nextTick(() => {
        this.isShowGplot = true
      })
    },
    checkBack(id) {
      this.backId = id
    },
    handleClick(tab, event) {
      if (this.relatedType === '1') {
        this.getAlarmHostBind({ hostId: this.hostInfo.id }).then(res => {
          this.tempArr = res
          this.updataBindArr = JSON.parse(JSON.stringify(res.results))
          this.orginBindArr = JSON.parse(JSON.stringify(res.results))
        })
      } else {
        this.getDetectorBind({ detectorId: this.hostInfo.id }).then(res => {
          this.tempArr = res.data
        })
      }
      this.resData = []
      this.targetData[0].children = []
      if (tab.name === '1') {
        this.customizeQuery.params.subSystem = '1'
        this.customizeQuery.params.channelType = '1'
        this.customizeQuery.params.resClass = ''
        if (this.tempArr.video && this.tempArr.video.length > 0) {
          this.targetData[0].children = this.tempArr.video
        }
      }
      if (tab.name === '2') {
        this.customizeQuery.params.subSystem = '4'
        this.customizeQuery.params.channelType = '1'
        this.customizeQuery.params.resClass = ''
        if (this.tempArr.audio && this.tempArr.audio.length > 0) {
          this.targetData[0].children = this.tempArr.audio
        }
      }
      if (tab.name === '3') {
        this.customizeQuery.params.subSystem = '3'
        this.customizeQuery.params.channelType = '1'
        this.customizeQuery.params.resClass = '2'
        if (this.tempArr.guard && this.tempArr.guard.length > 0) {
          this.targetData[0].children = this.tempArr.guard
        }
      }
      if (tab.name === '4') {
        this.customizeQuery.params.subSystem = '2'
        this.customizeQuery.params.channelType = ''
        this.customizeQuery.params.resClass = ''
        if (this.tempArr.outChannel && this.tempArr.outChannel.length > 0) {
          this.targetData[0].children = this.tempArr.outChannel
        }
      }
      this.treeToogle = false
      this.$nextTick(() => {
        this.treeToogle = true
      })
      this.elTree = false
      this.$nextTick(() => {
        this.elTree = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.button-box {
  margin: 12px 0;
}
.content-box {
  width: 100%;
  display: flex;
  .left-box {
    position: relative;
    width: 610px;
    margin-right: 20px;
    .left-tree-box {
      flex: 1;
    }
    .tree-box {
      height: 500px;
      width: 276px;
      border: 1px solid #e1e1e1;
    }
  }
  .gplot {
    width: calc(~'100% - 510px');
    margin-left: 10px;
    border: 1px solid #e1e1e1;
    padding: 10px;
  }
  .icon-box {
    width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    i {
      cursor: pointer;
    }
  }
  .right-box {
    flex: 1;
  }
  .tab-content {
    width: 578px;
    height: 549px;
    display: flex;
    position: absolute;
    top: 54px;
    left: 15px;
    .active-style {
      cursor: pointer;
    }
    .active-style:focus {
      background: #f0f7ff;
      outline: none;
    }
  }
}
</style>
