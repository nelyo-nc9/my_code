<template>
  <div class="preview-box">
    <div class="left">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="机构" name="first">
          <treeBox :lazyTreeApi="getTreeApi" :lazyTreeSearchApi="getLazyTreeSearchApi" :customizeQuery="customizeQuery" subSystem="1" searchType="search" @dblclick="preview" ref="org"
          @searchVal="searchVal" @clickNode="clickNode" treeLazyToggle iconToggle v-if="activeName==='first'">
            <template  slot-scope="{data, node}">
              <i class="iconfont icon-bukong" title="一键展开" v-if="iconList.includes('expand') && filterIconEqu(data) && !flag" @click.stop="oncePreview(data, node)"></i>
              <i class="iconfont icon-edit" title="编辑" v-if="iconList.includes('edit') && filterIconEqu(data) && !flag" @click.stop="pollingEdit(data, node)"></i>
              <i class="iconfont-ccb ccbweilunxun" title="开启轮巡" v-if="iconList.includes('poll') && filterIconEqu(data) && !pollingStatus && !flag" @click.stop="openAllPreviewClick(data, node, true)"></i>
              <i class="iconfont-ccb ccblunxunzhong" title="关闭轮巡" v-if="iconList.includes('poll') && filterIconEqu(data) && pollingStatus && !flag" @click.stop="openAllPreviewClick(data, node, false)"></i>
              <i class="iconfont icon-collection" title="快速收藏" v-if="iconList.includes('collection') && filterIconRes(data) && !flag" @click.stop="fastCollect(data)"></i>
              <i class="iconfont icon-biaoqian" title="详细信息" v-if="iconList.includes('info') && !flag" @click.stop="clickInfo(data)"></i>
            </template>
          </treeBox>
        </el-tab-pane>
        <el-tab-pane label="收藏夹" name="second">
          <collectTree :getDataApi="getCollectApi" :postDataApi="postCollectApi" ref="fav" v-if="activeName==='second'" @clickNode="clickNode" @dblclick="preview">
            <template  slot-scope="{data, node}">
              <i class="iconfont icon-bukong" title="一键展开" v-if="iconList.includes('expand') && filterIconNode(data)" @click.stop="oncePreview(data, node)"></i>
              <i class="iconfont icon-edit" title="编辑" v-if="iconList.includes('edit') && filterIconNode(data)" @click.stop="collectEdit(data,node)"></i>
              <i class="iconfont-ccb ccbweilunxun" title="开启轮巡" v-if="iconList.includes('poll') && filterIconNode(data) && !pollingStatus" @click.stop="openAllPreviewClick(data, node, true)"></i>
              <i class="iconfont-ccb ccblunxunzhong" title="关闭轮巡" v-if="iconList.includes('poll') && filterIconNode(data) && pollingStatus" @click.stop="openAllPreviewClick(data, node, false)"></i>
              <i class="iconfont icon-delete" title="删除" v-if="iconList.includes('collection')" @click.stop="collectDelete(data,node)"></i>
            </template>
          </collectTree>
        </el-tab-pane>
      </el-tabs>
      <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
      <!-- <span class="refresh icon iconfont ccbicon" @click="shared" title="分享"></span> -->
    </div>
    <!-- 主视频画面 -->
    <div class="middle">
      <preview-plugin :defaultPane="defaultPane" :iconShow="iconShowParams" :moduleType="1" :isActiveEqu="isActiveEqu" ref="preview" @polling="clickPolling" @changeDefaultPane="changeDefaultPane">
      </preview-plugin>
    </div>
    <!-- 云台 -->
    <div class="right" v-show="showControl">
      <PreviewControler :plugin="plugin" :pluginStatus="pluginStatus"></PreviewControler>
    </div>
    <!-- 伸缩按钮 -->
    <div class="noControl" @click="showControl = !showControl" :class="{'noRight':!showControl}">
      <i class="el-icon-arrow-right" v-if='showControl'></i>
      <i class="el-icon-arrow-left" v-if='!showControl'></i>
    </div>
    <!-- 机构树节点详细信息 -->
    <dialog-info v-if="showDialogInfo" :showDialogInfo="showDialogInfo" :nodeData="orgData" @closeDialogInfo="closeDialogInfo"></dialog-info>
    <!-- 轮巡编辑 -->
    <el-dialog title="轮巡策略" :visible.sync="polling.isShow" width="600px" v-if="polling.isShow" :close-on-click-modal="false">
      <iframe v-if="polling.isShow"></iframe>
      <div class="content">
        <div class="editName">
          <table>名称</table>
          <el-input type="text" class="ivu-input editInput" v-model="polling.deviceName" disabled placeholder="请输入..." style="width: 200px;"></el-input>
        </div>
        <div class="editName">
          <table>轮巡时间间隔</table>
          <el-input type="text" class="ivu-input editInput" v-model="polling.turningTime" placeholder="请输入..." style="width: 200px;" @blur="validataTime">
          </el-input>
          <span style="padding:3px;">秒(10s~3600s)</span>
          <span class="error-box" v-if="timeError">{{timeError}}</span>
        </div>
      </div> 
      <div class="editBtnBox" slot="footer">
        <el-button size="small" type="primary" @click='savePolling'>保存</el-button>
        <el-button size="small" @click='canclePolling' type="ghost">取消</el-button>
      </div>
    </el-dialog>
    <!-- 分享弹窗 -->
    <!-- <div class="sharePanel" v-if="openSharePanel" @click.stop>
      <iframe v-if="openSharePanel"></iframe>
      <div class="sharePanelBox">
        <div class="header">
          <div class="title">共享收藏夹</div>
          <div class="flag" @click='cancel'>
            <Icon type="close"></Icon>
          </div>
        </div>
        <div class="content">
          <div class="item">
            <Select v-model="favoritesName" style="width:200px;float:left;" :disabled="favoritesList.length === 0">
              <Option v-for="item in favoritesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <table>分享给以下用户</table>
          </div>
          <div class="table">
            <Table :columns="userColumns" class="s-table" ref="table" :data="favoriteUserList" size="small" @on-selection-change="selectChange" height="192"></Table>
          </div>
        </div>
        <div class="shareBtnBox">
          <Button type="primary" @click='save' :disabled='selectList.length===0 || favoritesList.length === 0'>分享</Button>
          <Button @click='educe' type="ghost" :disabled="favoritesList.length === 0||favoritesName===''">导出</Button>
        </div>
      </div>
    </div> -->
    <!-- 收藏夹编辑 -->
    <edit-group :openEditGroup='openEditGroup' :groupData="groupData" @editSave="editSave" @editCancel="openEditGroup = false"></edit-group>
    <!-- 快速收藏 -->
    <fastCollect v-if="openselectFav" :videoStatusArr="videoStatusArr" :pushFavData="pushFavData" sourceType="tree" :openselectFav="openselectFav" @cancel="openselectFav = false;pushFavData= {}"></fastCollect>  </div>
</template>

<script>
import previewPlugin from './school/previewPlugin'
import PreviewControler from './yuntai/PreviewControler'
import treeBox from '@src/components/tree/treeBox'
import collectTree from '@src/components/collectTree'
import { getTreeApi, getCollectList, postCollect, updataCollect, deleteCollect, searchTree } from '@src/http/video/videoPreview.api.js'
import axios from 'axios'
import EditGroup from './EditGroup.vue'
import fastCollect from './iconComponents/fastCollect'
import DialogInfo from '../components/DialogInfo'

export default {
  name: 'Preview',
  components: {
    previewPlugin,
    PreviewControler,
    treeBox,
    collectTree,
    EditGroup,
    fastCollect,
    DialogInfo
  },
  data() {
    return {
      activeName: 'first',
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      showControl: true,
      iconShowParams: [
        {
          type: 'left',
          index: 0,
          name: 'ScreenShot'
        }, {
          type: 'left',
          index: 1,
          name: 'Videotape'
        }, {
          type: 'left',
          index: 2,
          name: 'Speech'
        }, {
          type: 'left',
          name: 'NiaoKan',
          index: 3
        }, {
          type: 'left',
          index: 4,
          name: 'Lunxun'
        }, {
          type: 'left',
          name: 'Attention',
          index: 5
        }, {
          type: 'left',
          name: 'checkRecode',
          index: 6
        }, {
          type: 'left',
          index: 7,
          name: 'Collect'
        }, {
          type: 'left',
          name: 'Volume',
          index: 8
        }, {
          type: 'right',
          name: 'FullScreen',
          index: 0
        }, {
          type: 'right',
          name: 'MultiScreen',
          index: 1
        }, {
          type: 'right',
          name: 'ViewPattern',
          index: 2
        }, {
          type: 'right',
          name: 'Stream',
          index: 3
        }, {
          type: 'right',
          name: 'StopAll',
          index: 4
        }, {
          type: 'right',
          name: 'Stop',
          index: 5
        }, {
          type: 'right',
          name: 'Page',
          index: 6
        }
      ],
      defaultPane: 4,
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0',
          channelType: '1'
        }
      },
      showDialogInfo: false, // 展示机构节点信息弹窗
      orgData: {}, // 机构节点信息
      deviceType: [],
      openEditGroup: false,
      groupData: {},
      openselectFav: false,
      pushFavData: {},
      videoStatusArr: [],
      polling: {
        isShow: false,
        deviceName: '',
        turningTime: localStorage.getItem('pollingTime') || '10'
      },
      plugin: null,
      pluginStatus: {},
      isActiveEqu: false,
      activeNode: {},
      activeNodeKey: '',
      timeError: '',
      flag: false
    }
  },
  created() {},
  computed: {
    pollingStatus() {
      let flag = false
      if (this.activeNode.data) {
        flag = this.activeNode.data.nodeKey === this.activeNodeKey
      }
      return flag && this.$refs.preview.pollingTimer
    }
  },
  watch: {
    'plugin.checkedPane'() {
      this.pluginStatus = this.plugin.videoStatusArr[this.plugin.checkedPane]
    }
  },
  mounted() {
    this.plugin = this.$refs.preview
    this.pluginStatus = this.plugin.videoStatusArr[this.plugin.checkedPane]
  },
  methods: {
    searchVal(val) {
      this.flag = val.length
    },
    validataTime(value) {
      value = value.target.value
      if (value.trim().length) {
        if (/^[1-9][0-9]*$/.test(value)) {
          if (Number(value) < 10 || Number(value) > 3600) {
            this.timeError = '请输入10s-3600s范围的数值'
          } else {
            this.timeError = ''
          }
        } else {
          this.timeError = '输入不是有效数字'
        }
      } else {
        this.timeError = '不能为空'
      }
    },
    changeDefaultPane(val) {
      this.defaultPane = val
    },
    clickInfo(data) { // 机构树详细信息
      this.orgData = data
      this.showDialogInfo = true
    },
    closeDialogInfo() {
      this.showDialogInfo = false
    },
    handleClick(val) {
      if (this.$refs.preview.pollingTimer) {
        this.$message('请停止当前正在轮巡中的任务！')
        return
      }
      this.activeName = val.name
    },
    clickNode(node) { // 判断节点是否有
      this.isActiveEqu = node.data && (node.data.tierType === 'equ' || node.data.tierType === 'node')
      this.activeNode = this.isActiveEqu ? node : {}
    },
    preview(val, node) {
      if (val.tierType === 'res') { // 双击的是资源才开流
        if (this.$refs.preview.pollingTimer) {
          this.$message('请停止当前正在轮巡中的任务！')
          return
        }
        this.$refs.preview.openPreview(val)
      }
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 1,
        key: params.search
      }
      return searchTree(params)
    },
    getCollectApi(params) {
      return getCollectList(params)
    },
    postCollectApi(params) {
      return postCollect(params)
    },
    // 设备按钮开关
    filterIconEqu(val) {
      return val.tierType === 'equ'
    },
    // 资源按钮开关
    filterIconRes(val) {
      return val.tierType === 'res'
    },
    filterIconNode(val) {
      return val.tierType === 'node'
    },
    oncePreview(data, node) { // 一键展开
      if (this.$refs.preview.pollingTimer) {
        this.$message('请停止当前正在轮巡中的任务！')
        return
      }
      let previewData = []
      node.childNodes.forEach(item => {
        previewData.push(item.data)
      })
      this.$refs.preview.openAll(previewData)
      // previewData.forEach(item => {
      //   this.$refs.preview.openPreview(item, null, 'opeanAll')
      // })
    },
    pollingEdit(data, node) { // 轮训策略的编辑
      if (this.$refs.preview.pollingTimer) {
        this.$message('请停止当前正在轮巡中的任务！')
        return
      }
      this.polling.deviceName = data.name
      this.polling.isShow = true
    },
    savePolling() { // 轮巡保存
      if (this.timeError) {
        this.$messageWarn('请检查输入，校验不合法')
        return
      }
      localStorage.setItem('pollingTime', this.polling.turningTime)
      this.polling.isShow = false
      this.$messageSuccess('轮巡时间设置成功')
    },
    canclePolling() { // 轮巡取消
      this.polling.deviceName = ''
      this.polling.isShow = false
    },
    clickPolling(flag) {
      this.openAllPreviewClick(null, this.activeNode, flag)
    },
    openAllPreviewClick(data, node, flag) { // 开启和关闭轮巡
      if (flag) { // 开启
        if (this.$refs.preview.pollingTimer) { // 当前有正在轮巡的任务
           this.$message('请停止当前正在轮巡中的任务！')
           return
        } else {
          // 获取节点下所有的镜头信息
          let pollingData = []
          node.childNodes.forEach(item => {
            pollingData.push(item.data)
          })
          this.$refs.preview.pollingFunc(pollingData)
        }
      } else { // 关闭
        this.$refs.preview.pollingStopFunc()
      }
      this.activeNodeKey = flag ? node.data.nodeKey :  ''
    },
    collectDelete(data, node) { // 删除
      if (this.$refs.preview.pollingTimer) {
        this.$message('请停止当前正在轮巡中的任务！')
        return
      }
      if (data.tierType === 'node') {
        this.deleteCol(data)
      } else if (data.tierType === 'res') {
        this.deleteRes(data, node)
      }
    },
    deleteCol (data) { // 收藏夹删除 
      this.$confirm(`此操作将删除该收藏夹组,是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCollect({
          ids: [data.id]
        }).then(res => {
          if (res.data.code === 0) {
            this.refresh()
          } else {
            this.$messageError(res.data.message)
          }
        })
      })
    },
    deleteRes (data, node) { // 资源删除
      let colName = node.parent.data.name || ''
      this.$confirm(`此操作将从收藏夹组${colName}删除该资源,是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parentData = node.parent.data
        let rIds = parentData.children.splice(parentData.children.findIndex(i => i.id === data.id), 1).map(i => i.id)
        updataCollect({
          id: parentData.id,
          name: parentData.name,
          isPolling: parentData.isPolling,
          pollingTime: parentData.pollingTime,
          rIds
        }).then(res => {
          if (res.data.code === 0) {
            this.refresh()
          } else {
            this.$messageError(res.data.message)
          }
        })
      })
    },
    collectEdit(data, node) { // 收藏夹编辑
      if (this.$refs.preview.pollingTimer) {
        this.$message('请停止当前正在轮巡中的任务！')
        return
      }
      this.openEditGroup = true
      this.groupData = data
    },
    editSave(node) { // 收藏夹编辑保存
      updataCollect(node)
        .then(res => {
          if (res.data.code === 0) {
            this.$messageSuccess('修改成功！')
            this.refresh()
          }
        })
        .catch(err => {
          this.$messageError('编辑失败！' + err.data.data.message)
        })
    },
    refresh() { // 刷新
      if (this.activeName === 'first') {
        this.$refs.org.$refs.lazyTree.refresh()
      } else if (this.activeName === 'second') {
        this.$refs.fav.refresh()
      }
    },
    fastCollect(data) { // 快速收藏
      if (this.$refs.preview.pollingTimer) {
        this.$message('请停止当前正在轮巡中的任务！')
        return
      }
      this.pushFavData = data
      this.openselectFav = true
    }
  }
}

</script>

<style lang='less' scoped>
.preview-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .left {
    position: relative;
    width: 280px;
    height: 100%;
    overflow: auto;
    /deep/ .treeBox .treeInfo {
      &[name='equ'] span.treeText {
        max-width: calc(~'100% - 94px');
      }
      &[name='res'] span.treeText {
        max-width: calc(~'100% - 58px');
      }
    }
    .refresh {
      position: absolute;
      top: 13px;
      right: 10px;
      z-index: 2;
    }
    /deep/ .el-tabs {
      height: 100%;
      .el-tabs__content {
        height: calc(~'100% - 56px');
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
  .middle {
    flex: 1;
    height: 100%;
    padding: 0 16px;
  }
  .right {
    width: 300px;
    height: 100%;
    position: relative;
    &.noRight {
      right: -284px;
    }
  }
  .noControl {
    position: absolute;
    right: 300px;
    top: calc(~'50% - 25px');
    width: 16px;
    height: 45px;
    margin-top: -15px;
    line-height: 45px;
    text-align: center;
    color: #2C2C2C;
    background: #E6E6E6;
    cursor: pointer;
    &.noRight {
      right: 0;
    }
  }
  .box {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    .left {
      width: 150px;
      height: 100%;
      border-right: 1px solid #ddd;
      span {
        width: 100%;
        height: 36px;
        line-height: 36px;
        display: inline-block;
        color: #ccc;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrapx;
        overflow: hidden;
      }
    }
    .right {
      flex: 1;
      height: 100%;
      span {
        width: 100%;
        height: 36px;
        line-height: 36px;
        display: inline-block;
        color: #333;
        text-indent: 20px;
        text-overflow: ellipsis;
        white-space: nowrapx;
        overflow: hidden;
        i {
          color: #409eff;
          cursor: pointer;
          margin-left: 15px;
        }
      }
    }
    .info-item {
      width: 50%;
      height: 40px;
      line-height: 40px;
      display: flex;
      .info-key {
        width: 120px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space:nowrap;
      }
      .info-value {
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space:nowrap;
      }
    }
  }
  .content {
    width: 100%;
    height: auto;
    padding: 15px 12px;
    .editName {
      margin: 0 0 20px;
      table {
        line-height: 26px;
        width: 85px;
        display: inline-block;
        &.disabled {
          color: #999;
        }
      }
      .editInput {
        height: 26px;
      }
      .error-box {
        font-size: 12px;
        color: #f56c6c;
        padding-right: 10px;
        display: block;
        margin: 10px 0 0 90px;
      }
    }
  }
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -2;
    top: 0;
    left: 0;
  }
}
</style>
