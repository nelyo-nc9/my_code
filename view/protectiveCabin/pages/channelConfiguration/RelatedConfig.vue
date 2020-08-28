<template>
  <div class="main">
    <div class="top-box">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline"
             style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
          <el-breadcrumb-item>防护舱通道关联配置</el-breadcrumb-item>
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
          <el-tab-pane label="防护舱通道"
                       name="3"></el-tab-pane>
          <el-tab-pane label="输出通道"
                       name="4"></el-tab-pane>
        </el-tabs>
        <div class="tab-content">
          <div class="left-tree-box">
            <div style="text-align:center;">源</div>
            <div class="tree-box">
              <treeBox ref="treeBox"
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
// import Gplot from '../../../../videoManage/components/gplot'
import Gplot from '../../../../view/videoManage/components/gplot'
export default {
  props: {
    isShowConfig: {
      type: Boolean,
    },
    hostInfo: {
      type: Object,
    },
    relatedType: {
      type: String,
    },
  },
  components: {
    treeBox,
    Gplot,
  },
  data() {
    return {
      elTree: true,
      targetData: [
        {
          id: 1,
          name: '一级 1',
          children: [],
        },
      ],
      treeProps: {
        label: 'name',
      },
      gplotData: [],
      customizeQuery: {
        // 机构树传参
        params: {
          type: 0,
          relOrgId: this.hostInfo.orgId,
          subSystem: '1',
          // channelType: '1', // 通道类别：1|视频,2对讲,3|门禁.4|输出
          // isRecursion: '0',
          // resClass: '',
        },
      },
      onesubSystem: '',
      treeType: 0,
      resData: [],
      temp: {},
      tempss: '',
      backId: '',
      activeName: '1',
      treeToogle: true,
      isRight: false,
      isShowGplot: true,
      tempArr: {},
      disabledData: [],
      rightSelectNode: '',
      objArr: [],
    }
  },
  created() {
    this.targetData[0].name = this.relatedType === '1' ? this.hostInfo.name : this.hostInfo.name
    this.linkHost({ id: this.hostInfo.id, type: { ref: 2 } }).then((res) => {
      this.tempArr = res.data.data
      this.targetData[0].children = []
      if (this.activeName === '1') {
        if (res.data.data && res.data.data.video && res.data.data.video.length > 0) {
          this.targetData[0].children = res.data.data.video
        }
      }
      this.dealDisableData()
    })
    this.getHostTopoCommon()
  },
  methods: {
    ...mapActions(['linkage', 'addDetectorBind', 'getDetectorBind', 'linkHost']),
    getHostTopoCommon() {
      this.linkHost({ id: this.hostInfo.id, type: { ref: 2 } }).then((res) => {
        this.gplotData = []
        let result = res.data.data.video.concat(res.data.data.cabin, res.data.data.audio, res.data.data.output)
        let center = {
          name: this.hostInfo.name,
          type: 'alarmHost',
          id: '1',
          center: true, // 用来标识中心元素
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
                : 'cabinHost',
            id: String(i + 2),
          }
          this.gplotData.push(temp)
        }
        this.isShowGplot = false
        this.$nextTick(() => {
          this.isShowGplot = true
        })
      })
    },
    dealDisableData() {
      let disabledData = []
      this.tempArr.video &&
        this.tempArr.video.forEach((i) => {
          disabledData.push('res' + i.id)
        })
      this.tempArr.audio &&
        this.tempArr.audio.forEach((i) => {
          disabledData.push('res' + i.id)
        })
      this.tempArr.cabin &&
        this.tempArr.cabin.forEach((i) => {
          disabledData.push('res' + i.id)
        })
      this.tempArr.output &&
        this.tempArr.output.forEach((i) => {
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
      if (!(data.rcId || data.tierType)) {
        // this.rightSelectData = data // 只能是目标
        // this.createGplot()
      }
      this.rightSelectNode = node // 节点可以是目标也可以添加的资源
    },
    cancel() {
      this.$emit('update:isShowConfig', false)
      this.$emit('clearSelect')
    },
    save() {
      if (this.relatedType === '1') {
        let res = this.resData.map((item) => item.channelId)
        this.linkHost({ id: this.hostInfo.id, type: { ref: 2 } }).then((item) => {
          let body = {
            id: this.hostInfo.id, // 主机/ 通道 id
            type: 2, // 主键类型 1 主机 2 通道
            linkages: {
              video: item.data.data ? item.data.data.video.map((items) => items.id) : [], // 视频联动
              audio: item.data.data ? item.data.data.audio.map((items) => items.id) : [], // 音频联动
              cabin: item.data.data ? item.data.data.cabin.map((items) => items.id) : [], // 门禁联动
              output: [], // 报警出联动
            },
          }
          if (item.data.data) {
            item.data.data.output.forEach((i) => {
              body.linkages.output.push({ id: i.id, subSystem: i.subSystem })
            })
          }
          if (this.activeName == 1) {
            body.linkages.video.push(...res)
          } else if (this.activeName == 2) {
            body.linkages.audio.push(...res)
          } else if (this.activeName == 3) {
            body.linkages.cabin.push(...res)
          } else {
            res.forEach((item) => {
              let obj = {
                id: item,
                subSystem: this.tempss,
              }
              body.linkages.output.push(obj)
            })
          }
          this.linkage(body)
            .then((res) => {
              this.$messageSuccess('配置关联成功', '成功')
              this.getHostTopoCommon()
            })
            .catch((err) => {
              console.log(err)
            })
        })
      }
    },
    getTreeApi(params) {
      return getLazyTreeApi(params)
    },
    onceClick(data, node) {
      if (data.tierType === 'res') {
        if (this.relatedType === '1') {
          this.tempss = data.subSystem
          this.temp = {
            alarmHostId: this.hostInfo.id,
            name: data.name, // 设备名称
            type: Number(this.activeName), // 设备类型:1|视频，2|对讲，3|门禁，4|通道
            channelId: data.id,
            deviceId: data.dId,
            // subSystem: data.subSystem,
          }
          this.objArr.push(this.temp)
        } else {
          this.temp = {
            detectorId: this.hostInfo.id,
            name: data.name, // 设备名称
            type: Number(this.activeName), // 设备类型:1|视频，2|对讲，3|门禁，4|通道
            channelId: data.id,
            deviceId: data.dId,
          }
        }
        this.isRight = true
      } else {
        this.isRight = false
      }
    },
    rightPush() {
      for (let i = 0; i < this.objArr.length; i++) {
        if (this.isRight && JSON.stringify(this.objArr[i]) !== '{}') {
          this.resData.push(this.objArr[i])
        }
        if (JSON.stringify(this.objArr[i]) !== '{}') {
          this.targetData[0].children.push(this.objArr[i])
        }
        this.elTree = false
        this.$nextTick(() => {
          this.elTree = true
        })
        console.log(this.resData, 'this.resData=====')
        // 将左边的节点复选框禁用
        this.disabledData.push('res' + this.objArr[i].channelId)
      }
      this.objArr = []
      this.temp = {}
    },
    back() {
      for (let i = 0; i < this.resData.length; i++) {
        if (this.resData[i].channelId === this.backId) {
          this.resData.splice(i, 1)
        }
      }
      // this.$refs.righttree[0].remove(this.rightSelectNode)
      let index = this.disabledData.findIndex((item) => item === 'res' + this.backId)
      this.targetData[0].children.splice(index, 1)
      this.disabledData.splice(index, 1)
    },
    checkBack(id) {
      console.log(id, '选中的目标节点id')
      this.backId = id
    },
    handleClick(tab, event) {
      this.linkHost({ id: this.hostInfo.id, type: { ref: 2 } }).then((res) => {
        this.tempArr = res.data.data
      })
      this.resData = []
      this.targetData[0].children = []
      if (tab.name === '1') {
        this.customizeQuery.params.subSystem = '1'
        this.customizeQuery.params.channelType = '1'
        this.customizeQuery.params.resClass = ''
        if (this.tempArr && this.tempArr.video && this.tempArr.video.length > 0) {
          this.targetData[0].children = this.tempArr.video
        }
      }
      if (tab.name === '2') {
        // this.customizeQuery.params.subSystem = '4'
        // this.customizeQuery.params.channelType = '1'
        // this.customizeQuery.params.resClass = ''
        this.customizeQuery.params = {
          subSystem: '4',
        }
        if (this.tempArr && this.tempArr.audio && this.tempArr.audio.length > 0) {
          this.targetData[0].children = this.tempArr.audio
        }
      }
      if (tab.name === '3') {
        this.customizeQuery.params.subSystem = '5'
        this.customizeQuery.params.channelType = '1'
        this.customizeQuery.params.resClass = '2'
        if (this.tempArr && this.tempArr.cabin && this.tempArr.cabin.length > 0) {
          this.targetData[0].children = this.tempArr.cabin
        }
      }
      if (tab.name === '4') {
        this.customizeQuery.params.subSystem = '10'
        this.customizeQuery.params.channelType = ''
        this.customizeQuery.params.resClass = ''
        if (this.tempArr && this.tempArr.output && this.tempArr.output.length > 0) {
          this.targetData[0].children = this.tempArr.output
        }
      }
      this.treeToogle = false
      this.$nextTick(() => {
        this.treeToogle = true
      })
      console.log(this.targetData, 'this.targetData=====')
      this.elTree = false
      this.$nextTick(() => {
        this.elTree = true
      })
      // this.isShowGplot = false
      // this.$nextTick(() => {
      //   this.isShowGplot = true
      // })
    },
  },
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
