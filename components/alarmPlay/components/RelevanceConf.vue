<template>
  <div class="relevance-config-box">
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
            <div class="transfer-box">
              <div class="tab-content">
                <div class="left-tree-box">
                  <div style="text-align:center;">源</div>
                  <div class="tree-box">
                    <treeBox ref="treebox"
                      :lazyTreeApi="getTreeApi"
                      searchType="filter"
                      :treeType="treeType"
                      @checkclick="checkclick"
                      :disabledTreeItem="disabledTreeItem"
                      treeLazyToggle iconToggle checkboxToggle
                      :customizeQuery="customizeQuery">
                    </treeBox>
                  </div>
                </div>
                <div class="icon-box">
                  <i class="el-icon-right" @click="addLinks"></i>
                  <i class="el-icon-back" @click="reduceLinks"></i>
                </div>
                <div style="flex:1">
                  <div style="text-align:center;">目标</div>
                  <div class="tree-box">
                    <el-tree ref="righttree" node-key="id" :data="targetData" :props="treeProps" @node-click="handleNodeClick" :current-node-key="currentNodeKey" highlight-current></el-tree>
                  </div>
                </div>
              </div>
              <div style="text-align:center;margin-top:24px">
                <el-button size="mini" type="primary" @click="save">保存</el-button>
                <el-button size="mini" @click="cancel">取消</el-button>
              </div>
            </div>
            <div class="gplot">
              <div style="text-align:center;">
                <gplot :gplotData="gplotData" ref="gplot"></gplot>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getLazyTreeApi } from '@src/http/video/videoPreview.api.js'
import { getMoreLinks, setMoreLinks } from '@src/http/video/videoConfig.api.js'
import treeBox from '@src/components/tree/treeBox'
import Gplot from './gplot'
export default {
  name: 'RelevanceConf',
  props: {
    configType: {
      type: String,
      required: true
    },
    orgId: {
      type: String,
      required: true
    },
    selectedData: { // 列表选中数据 不会发生变化
      type: Array,
      required: true
    }
  },
  components: {
    Gplot,
    treeBox
  },
  data() {
    return {
      treeType: 0,
      activeTabName: '1',
      tabs: [
        {label: '镜头通道', name: '1'},
        {label: '对讲通道', name: '2'},
        {label: '门禁通道', name: '3'},
        {label: '输出通道', name: '4'}
      ],
      targetData: [],
      treeProps: {
        label: 'name'
      },
      disabledData: [],
      leftSelectNode: '',
      rightSelectNode: '',
      rightSelectData: '',
      currentNodeKey: this.selectedData[0].id,
      allReqLinks: [], // 会发生变化
      gplotData: [], // 拓扑图关联的数据
      customizeQueryTree: {
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      }
    }
  },
  computed: {
    customizeQuery() {
      if (this.activeTabName === '3') {
        return {
          params: {
            type: 0,
            relOrgId: this.orgId,
            subSystem: '3',
            channleType: 1,
            resClass: 2
          }
        }
      } else if (this.activeTabName === '4') {
        return {
          params: {
            type: 0,
            relOrgId: this.orgId,
            subSystem: '10'
          }
        }
      } else if (this.activeTabName === '1') {
        return {
          params: {
            type: 0,
            relOrgId: this.orgId,
            subSystem: '1',
            channelType: 1
          }
        }
      } else {
        return {
          params: {
            type: 0,
            relOrgId: this.orgId,
            subSystem: '4',
            channelType: 1
          }
        }
      }
    }
  },
  created() {
    console.log(this.selectedData)
    let ids = []
    this.selectedData.forEach(item => {
      ids.push({
        id: item.id,
        ref: this.configType === '视频主机关联配置' ? 1 : 2
      })
    })
    getMoreLinks(ids).then(res => {
      this.allReqLinks = res.data.data
      console.log(this.allReqLinks)
      this.dealInitData(res.data.data)
    })
  },
  mounted() {
   
  },
  watch: {
    activeTabName(nv) {
      this.dealInitData(this.allReqLinks)
    }
  },
  methods: {
    dealInitData(reqData) {
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
        this.rightSelectNode = this.$refs.righttree[0].getNode(this.rightSelectData.id)
        console.log(this.rightSelectNode, this.rightSelectData)
      })

      this.createGplot(this.targetData[0])
      this.dealDisableData(this.targetData[0])
    },
    dealDisableData(reqData) { // reqData接受只是一个对象
      let disabledData = []
      reqData.children && reqData.children.forEach(item => {
        disabledData.push('res' + item.rcId)
      })
      this.disabledData = disabledData
    },
    getTreeApi(params) {
      return getLazyTreeApi(params)
    },
    tabClick(value) {
      this.activeTabName = value.name
    },
    goBackList() {
      this.$emit('changeComponent', 'List')
    },
    cancel() {
      this.$confirm('请确定放弃保存正在编辑的内容吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.goBackList()
      }).catch(() => {})
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
            id: i.id,
            name: i.name,
            type: 'vidicon'
          }
          gpData.push(obj)
        })
        reqLink.audio.forEach(i => {
          let obj = {
            id: i.id,
            name: i.name,
            type: 'talkback'
          }
          gpData.push(obj)
        })
        reqLink.guard.forEach(i => {
          let obj = {
            id: i.id,
            name: i.name,
            type: 'guard'
          }
          gpData.push(obj)
        })
        reqLink.output.forEach(i => {
          let obj = {
            id: i.id,
            name: i.name,
            type: 'alarm'
          }
          gpData.push(obj)
        })
      }
      this.gplotData = this.$lodash.cloneDeep(gpData)
      // 先销毁在生成
      await this.$refs.gplot[0].destroyedGplot()
      this.$nextTick(() => {
        this.$refs.gplot[0].init()
      })
    },
    checkclick(data) {
      this.leftSelectNode = data
    },
    disabledTreeItem(data) { // 默认复选框禁用
      let tierTypeData = ['loc', 'org', 'equ']
      return tierTypeData.includes(data['tierType']) || this.disabledData.includes(data['nodeKey'])
    },
    addLinks() { // 右移
      // if (!this.rightSelectData || !this.leftSelectNode || !this.rightSelectNode) { return '' }
      // if (this.rightSelectNode.data.tierType || this.rightSelectNode.data.rcId) {
      //   return ''
      // }
      if (!this.rightSelectData || !this.rightSelectNode) { return '' }
      if (this.rightSelectNode.data.tierType || this.rightSelectNode.data.rcId) {
        return ''
      }
       // 获取所有的勾选节点
      let data = this.$refs.treebox[0].getCheckedNodes()
      // 对节点过滤
      let newData = []
      data.map(item => {
        if(item.tierType === 'res') {
          newData.push(item)
        }
      })
      
      if (newData.length === 0) {return ''}
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
        this.disabledData.push('res' + item.id)
        this.$refs.righttree[0].append(item, this.rightSelectNode)
      })
      this.$refs.treebox[0].setCheckedKeys([])
      // 动态生成拓扑图
      this.createGplot()
    },
    reduceLinks() { // 左移
      if (this.rightSelectNode.data.tierType || this.rightSelectNode.data.rcId) {
        this.$refs.righttree[0].remove(this.rightSelectNode)
        let index = this.disabledData.findIndex(item => item === 'res' + this.rightSelectNode.data.id)
        this.disabledData.splice(index, 1)
        this.$refs.treebox[0].$refs.lazyTree.$refs.tree.setChecked(this.rightSelectNode.data, false)
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
    flex: 1;
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
