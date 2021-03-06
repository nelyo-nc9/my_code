<template>
  <div class="relevance-config-box">
    <!-- 中间树 摄像机关联配置列表-->
    <div class="tree-content">
      <treeBox :lazyTreeApi="getLazyTreeApi"
        searchType="filter"
        :treeType="treeType"
        :customizeQuery="customizeQuerys"
        treeLazyToggle iconToggle></treeBox>
    </div>
    <div class="content">
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>视频管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{configType}}</el-breadcrumb-item>
            <el-breadcrumb-item class="active">关联配置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" @click="goBackList">返回列表</el-button>
        </div>
      </div>
      <el-tabs type="border-card" v-model="activeTabName" @tab-click="tabClick">
        <el-tab-pane v-for="(tab, index) in tabs" :key="tab.name + '_' + index" :label="tab.label" :name="tab.name">
          <div class="tab-content" v-if="activeTabName === tab.name">
            <relevance-comm
              ref="relevanceComm"
              :customizeQuery="customizeQuery"
              :gplotData="gplotData"
              :targetData="targetData"
              :disabledTreeItem="disabledTreeItem"
              @createGplot="createGplot"
              @handleNodeClick="handleNodeClick"
              @save="save"
              @cancel="cancel"
              @addLinks="addLinks"
              @reduceLinks="reduceLinks"
            ></relevance-comm>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getMoreLinks, setMoreLinks } from '@src/http/video/videoConfig.api.js'
import RelevanceComm from './RelevanceComm'
import { getLazyTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
export default {
  name: 'RelevanceConf',
  props: {
    configType: {
      type: String,
      required: true
    },
    orgId: { // orgId废弃  因为在otherList中接收到的orgId在直接点击其他机构下的重点部位或者设备时没有更新orgId  本页面直接拿被选数据中的orgId
      type: String,
      required: true
    },
    selectedData: { // 列表选中数据 不会发生变化
      type: Array,
      required: true
    }
  },
  components: {
    RelevanceComm,
    treeBox
  },
  data() {
    return {
      // 树的属性
      treeType: 1,
      customizeQuerys: {
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      // 关联配置的组件
      activeTabName: '1',
      tabs: [
        {label: '视频通道', name: '1'},
        {label: '对讲通道', name: '2'},
        {label: '门禁通道', name: '3'},
        {label: '输出通道', name: '4'}
      ],
      targetData: [],
      disabledData: [],
      rightSelectNode: '',
      rightSelectData: '',
      allReqLinks: [], // 会发生变化
      gplotData: [] // 拓扑图关联的数据
    }
  },
  computed: {
    customizeQuery() { // 点击tab选项时的传递接口参数
      if (this.activeTabName === '3') {
        return {
          params: {
            type: 0,
            relOrgId: this.selectedData[0].orgId, // 直接从被选数据中选取orgId
            resClass: 2,
            hostType: 2,
            subSystem: '3',
            channelType: 1
          }
        }
      } else if (this.activeTabName === '4') {
        return {
          params: {
            type: 0,
            relOrgId: this.selectedData[0].orgId, // 直接从被选数据中选取orgId
            subSystem: '10'
          },
          keywords: ['subSysForRes']
        }
      } else if (this.activeTabName === '1') {
        return {
          params: {
            type: 0,
            relOrgId: this.selectedData[0].orgId, // 直接从被选数据中选取orgId
            subSystem: '1',
            channelType: 1
          }
        }
      } else {
        return {
          params: {
            type: 0,
            relOrgId: this.selectedData[0].orgId, // 直接从被选数据中选取orgId
            subSystem: '4',
            channelType: 1,
            hostType: 1
          }
        }
      }
    }
  },
  created() {
    let ids = []
    this.selectedData.forEach(item => {
      ids.push({
        id: item.id,
        ref: this.configType === '视频主机关联配置' ? 1 : 2
      })
    })
    // 根据列表页选中的设备或者通道拿到id 去获取关联配置页面的目标列的数据
    getMoreLinks(ids).then(res => {
      this.allReqLinks = res.data.data
      this.dealInitData(res.data.data)
    })
  },
  watch: {
    activeTabName(nv) {
      this.dealInitData(this.allReqLinks)
    }
  },
  methods: {
    // 机构树
    getLazyTreeApi(params) {
      return getLazyTreeApi(params)
    },
    dealInitData(reqData) { // 把接口数据处理成结构树需要的数据结构
      this.targetData = []
      this.selectedData.forEach(item => {
        let id = item.id
        let obj = {
          name: item.name,
          id
        }

        if (reqData.length > 0) {
          let data = reqData.filter(item => {
            return item.id === id
          })[0]
          if (data) {
            let children = ''
            if (this.activeTabName === '1') {
              if (data.video.length > 0) {
                children = data.video
              }
            } else if (this.activeTabName === '2') {
              if (data.audio.length > 0) {
                children = data.audio
              }
            } else if (this.activeTabName === '3') {
              if (data.guard.length > 0) {
                children = data.guard
              }
            } else if (this.activeTabName === '4') {
              if (data.output.length > 0) {
                children = data.output
              }
            }
            children && (obj.children = children)
          }
        }
        this.targetData.push(obj)
      })
      this.$nextTick(() => {
        this.rightSelectData = this.targetData[0]
        this.rightSelectNode = this.$refs.relevanceComm[0].$refs.righttree.getNode(this.rightSelectData.id)
      })
    console.log(this.targetData[0])
      this.createGplot(this.targetData[0])
      this.dealDisableData(this.targetData[0])
    },
    dealDisableData(reqData) { // reqData接受只是一个对象
      let disabledData = []
      disabledData.push('res' + reqData.id)
      reqData.children && reqData.children.forEach(item => {
        disabledData.push('res' + (item.rcId || item.id) + '_' + this.activeTabName)
      })
      this.disabledData = disabledData
    },
    tabClick(value) {
      this.activeTabName = value.name
    },
    goBackList() {
      this.$emit('changeComponent', 'List')
    },
    cancel() {
      this.$confirm('请确定放弃正在编辑的内容吗', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        type: 'warning'
      }).then(() => {}).catch(() => {
        this.goBackList()
      })
    },
    save() {
      let sendData = []
      this.selectedData.forEach(i => {
        let obj = {
          id: i.id,
          type: this.configType === '视频主机关联配置' ? 1 : 2
        }
        let linkages = {}
        let hasLinks = this.allReqLinks.filter(item => item.id === i.id)[0]
        if (hasLinks) {
          linkages.video = hasLinks.video.map(x => x.rcId || x.id)
          linkages.audio = hasLinks.audio.map(x => x.rcId || x.id)
          linkages.guard = hasLinks.guard.map(x => x.rcId || x.id)
          linkages.output = hasLinks.output.map(x => {
            return {
              id: x.rcId || x.id,
              subSystem: x.subSystem
            }
          })
          obj.linkages = linkages
          sendData.push(obj)
        }
      })
      setMoreLinks(sendData).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('关联关系设置成功')
        }
      })
    },
    handleNodeClick(data, node) { // 目标树点击事件
      if (!(data.rcId || data.tierType)) {
        this.rightSelectData = data // 只能是目标
        this.createGplot()
        this.dealDisableData(data)
      }
      this.rightSelectNode = node // 节点可以是目标也可以添加的资源
    },
    async createGplot(data) {
      // 处理拓扑图数据
      let id = data ? data.id : this.rightSelectData.id
      let reqLink = this.allReqLinks.filter(item => item.id === id)[0]
      if (reqLink) {
        if (this.activeTabName === '1') {
          reqLink.video = (data ? data.children : this.rightSelectData.children) || []
        } else if (this.activeTabName === '2') {
          reqLink.audio = (data ? data.children : this.rightSelectData.children) || []
        } else if (this.activeTabName === '3') {
          reqLink.guard = (data ? data.children : this.rightSelectData.children) || []
        } else {
          reqLink.output = (data ? data.children : this.rightSelectData.children) || []
        }
      }
      let gpData = [
        {
          id: (reqLink && reqLink.id) || id,
          center: true,
          name: (reqLink && reqLink.name) || ((data && data.name) || this.rightSelectData.name),
          type: this.configType === '视频主机关联配置' ? 'videoHost' : (this.configType === '摄像机关联配置' ? 'vidicon' : 'alarm')
        }
      ]
      if (reqLink) {
        reqLink.video.forEach(i => {
          let obj = {
            id: i.subSystem + '-' + i.id,
            name: i.name,
            type: 'vidicon'
          }
          gpData.push(obj)
        })
        reqLink.audio.forEach(i => {
          let obj = {
            id: i.subSystem + '-' + i.id,
            name: i.name,
            type: 'talkback'
          }
          gpData.push(obj)
        })
        reqLink.guard.forEach(i => {
          let obj = {
            id: i.subSystem + '-' + i.id,
            name: i.name,
            type: 'guard'
          }
          gpData.push(obj)
        })
        reqLink.output.forEach(i => {
          let obj = {
            id: i.subSystem + '-' + i.id,
            name: i.name,
            type: 'alarm'
          }
          gpData.push(obj)
        })
      }
      this.gplotData = this.$lodash.cloneDeep(gpData)
      // 先销毁在生成
      await this.$refs.relevanceComm[0].$refs.gplot.destroyedGplot()
      this.$nextTick(() => {
        this.$refs.relevanceComm[0].$refs.gplot.init()
      })
    },
    disabledTreeItem(data) { // 默认复选框禁用
      let tierTypeData = ['loc', 'org', 'equ']
      let viSRoot = this.disabledData.filter(i => !(i.includes('_')))
      let child = this.disabledData.filter(i => (i.includes('_')))
      if (tierTypeData.includes(data['tierType'])) {
        return true
      } else {
        if (this.activeTabName === '1') {
          if (viSRoot.includes(data['nodeKey'])) {
            if (child.some(i => i.split('_')[0] === data['nodeKey'])) {
              return true
            } else {
              return false
            }
          } else {
            if (child.some(i => i.split('_')[0] === data['nodeKey'])) {
              return true
            } else {
              return false
            }
          }
        } else {
          if (child.some(i => i.split('_')[0] === data['nodeKey'])) {
            return true
          } else {
            return false
          }
        }
      }
      // return tierTypeData.includes(data['tierType']) || this.disabledData.includes(data['nodeKey'])
    },
    addLinks() { // 右移
      if (!this.rightSelectData || !this.rightSelectNode) { return '' }
      if (this.rightSelectNode.data.tierType || this.rightSelectNode.data.rcId) {
        return ''
      }
      // 获取所有的勾选节点
      let data = this.$refs.relevanceComm[0].$refs.treebox.getCheckedNodes()
      // 对节点过滤
      let newData = []
      data.map(item => {
        if (item.tierType === 'res') {
          newData.push(item)
        }
      })

      if (newData.length === 0) { return '' }
      // 修改源数据中的关联关系
      let index = this.allReqLinks.findIndex(item => item.id === this.rightSelectData.id)
      let updateData = this.allReqLinks[index]
      if (!updateData) {
        updateData = {
          id: this.rightSelectData.id,
          video: [],
          audio: [],
          guard: [],
          output: []
        }
        if (this.activeTabName === '1') {
          updateData.video = newData
        } else if (this.activeTabName === '2') {
          updateData.audio = newData
        } else if (this.activeTabName === '3') {
          updateData.guard = newData
        } else if (this.activeTabName === '4') {
          updateData.output = newData
        }
        index === -1 ? (this.allReqLinks.push(updateData)) : (this.allReqLinks[index] = updateData)
      }

      // 修改targetData数据
      newData.forEach(item => {
        this.disabledData.push('res' + item.id + '_' + this.activeTabName)
        this.$refs.relevanceComm[0].$refs.righttree.append(item, this.rightSelectNode)
      })
      this.$refs.relevanceComm[0].$refs.treebox.setCheckedKeys([])
      // 动态生成拓扑图
      this.createGplot()
    },
    reduceLinks() { // 左移
      if (this.rightSelectNode.data.tierType || this.rightSelectNode.data.rcId) {
        this.$refs.relevanceComm[0].$refs.righttree.remove(this.rightSelectNode)
        let index = this.disabledData.findIndex(item => item === 'res' + this.rightSelectNode.data.id)
        this.disabledData.splice(index, 1)
        this.$refs.relevanceComm[0].$refs.treebox.$refs.lazyTree.$refs.tree.setChecked(this.rightSelectNode.data, false)
        // 动态生成拓扑图
        this.createGplot()
      }
    }
  }
}

</script>

<style lang='less' scoped>
.relevance-config-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-content {
    width: 280px;
  }
  .content {
    width: calc(~'100% - 280px');
    // flex: 1;
    padding-left: 22px;
    .top {
      .header {
        color: #333333;
        margin: 23px 0;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2d72d3;
            }
          }
        }
      }
      .button-box {
        margin-bottom: 10px;
      }
    }
    .tab-content {
      width: 100%;
      height: 100%;
      display: flex;
      .transfer-box {
        width: 600px;
        height: 100%;
        padding: 10px;
        border: 1px solid #333;
          .tab-content {
            width: 100%;
            height: 100%;
            .left-tree-box {
              flex: 1;
            }
            .tree-box {
              width: 276px;
              height: 500px;
              overflow: auto;
              border: 1px solid #E1E1E1;
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
          }
      }
      .gplot {
        width: calc(~'100% - 600px');
        margin-left: 10px;
        border: 1px solid #333;
        padding: 10px;
      }
    }
  }
}
</style>
