<!--
 * @Author: yanglei
 * @Date: 2020-06-06 11:21:50
 * @LastEditTime: 2020-08-07 16:04:53
 * @LastEditors: your name
 * @Description: 检查记录对话框
 * @FilePath: \ccb-client\client\src\view\coffersManage\remoteGuard\InspectionModal.vue
-->

<template>
  <div class="inspection-container">
    <el-dialog
      title="检查记录"
      :visible.sync="showInspectDialog"
      :before-close="closeInsDialog"
      :modal-append-to-body="needAppend"
      :close-on-click-modal="ableClose"
      width="950px">

      <!-- 对话框内容 -->
      <div class="inspect-content">
        <el-divider content-position="left">今日检查记录</el-divider>
        <!-- <p class="delete-btn"><span class="iconfont icon-delete" @click="batchDeleteHandler">删除</span></p> -->
        <!-- handleDelete -->
        <p class="delete-btn"><span class="iconfont icon-delete" @click="handleDelete('index', 'row', false)">删除</span></p>
        <!-- 检查记录表格 -->
        <el-table
          :data="inspectionTable"
          stripe
          height="300"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="organization" label="机构" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="keySite" label="重点部位" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="camera" label="镜头" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="inspectAction" label="检查动作"></el-table-column>
          <el-table-column prop="time" label="记录时间" width="180"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <!-- <span :title="scope.row.inspectAction === '录像' ? '查看录像' : '查看截图'" :class="scope.row.inspectAction === '录像' ? 'iconfont icon-play' : 'iconfont icon-image'" @click="handleLookover(scope.$index, scope.row)"></span> -->
              <span :title="scope.row.inspectAction === '截图' ? '查看截图' : '查看录像'" :class="scope.row.inspectAction === '截图' ? 'iconfont icon-image' : 'iconfont icon-play'" @click="handleLookover(scope.$index, scope.row)"></span>
              <span title="下载到本地" class="iconfont-ccb ccbdaoru" @click="handleDownload(scope.$index, scope.row)"></span>
              <span title="删除记录" class="iconfont icon-delete" @click="handleDelete(scope.$index, scope.row, true)"></span>
            </template>
          </el-table-column>
        </el-table>

        <el-divider content-position="left">记录处理</el-divider>
        <div class="form-container">
          <div class="form-row">
            <div class="form-item">
              <span class="input-label">值班员</span>
              <el-input v-model="watchmanInput" disabled placeholder="请输入内容"></el-input>
            </div>
            <div class="form-item">
              <span class="input-label right-item">检查类型</span>
              <el-select v-model="inspectTypeValue" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in inspectType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <span class="input-label">检查项目</span>
              <el-select v-model="inspectProjectValue" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in inspectProject"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <span class="input-label">内容描述</span>
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="descriptionContent">
              </el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <span class="input-label">填写单位</span>
              <el-input v-model="unitInput" disabled placeholder="自动获取值班员所属机构"></el-input>
            </div>
            <div class="form-item">
              <span class="input-label right-item">填写时间</span>
              <el-input v-model="timeInput" disabled placeholder="自动获取记录填写时服务器时间"></el-input>
            </div>
          </div>
        </div>

        <!-- 查看回放对话框 -->
        <PlaybackVideo v-if="showPlaybackVideoModal" :playbackParams="playbackParams" :showPlaybackVideo="showPlaybackVideoModal" @closePlayback="closeSubDialog"></PlaybackVideo>
        <!-- 查看截图对话框 -->
        <ShowCutImg v-if="showCutImgModal" :imgSrc="cutImgSrc" :showCutImg="showCutImgModal" @closeCutImg="closeSubDialog"></ShowCutImg>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendInspectFormData">确 定</el-button>
        <el-button @click="closeInsDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PlaybackVideo from '../components/PlaybackVideoModal'
import ShowCutImg from '../components/ShowCutimgModal'
// import { getInspectDataApi, removeInspectDataApi, getInspectFormDataApi, sendInspectFormDataApi, getCheckerCordApi, deleteCheckerCordApi, disposeCheckerCordApi } from '../../../http/coffersManage/remoteGuard.api.js'
import { getCheckerCordApi, deleteCheckerCordApi, disposeCheckerCordApi } from '../../../http/coffersManage/remoteGuard.api.js'
import common from '../components/common'

export default {
  name: 'InspectionModal',
  mixins: [common],
  components: {
    PlaybackVideo,
    ShowCutImg
  },
  props: {
    showInspectDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      needAppend: false,
      ableClose: false,
      inspectionTable: [],
      multipleSelection: [], // 表格数据选中项
      imgSrc: '', // 截图图片路径
      playbackParams: {}, // 回放视频参数
      watchmanInput: '', // 临时字段
      inspectType: [ // 检查类型数据
        {
          value: '选项1',
          label: '常规检查'
        }, {
          value: '选项2',
          label: '临时检查'
        }
      ],
      inspectTypeValue: '', // 检查类型值
      inspectProject: [ // 检查项目数据
        {
          value: '选项1',
          label: '柜员异常'
        },
        {
          value: '选项2',
          label: '员工异常'
        },
        {
          value: '选项3',
          label: '...'
        }
      ],
      inspectProjectValue: '', // 检查项目值
      descriptionContent: '', // 内容描述文本域
      unitInput: '', // 填写单位输入框
      timeInput: this.$moment().format('YYYY-MM-DD HH:mm:ss'), // 填写时间输入框
      inspectFormId: '', // 记录接口返回的表单ID
      showPlaybackVideoModal: false, // 显示视频回放对话框
      showCutImgModal: false, // 显示查看截图对话框

      userInfo: JSON.parse(window.sessionStorage.getItem('user')) || {}
    }
  },
  created() {
    this.getCheckerCordFun()
    this.watchmanInput = this.userInfo.name || ''
    this.unitInput = this.userInfo.units || ''
  },
  methods: {
    /**
     * @description: 获取检查记录表格数据
     * @param {type} 无
     * @return: 无
     */
    getCheckerCordFun() {
      getCheckerCordApi()
        .then(res => {
          res = res.data.data
          this.inspectionTable = []
          if (res && res.logs && res.logs.length !== 0) {
            res.logs.forEach(item => {
              let tableData = {
                id: item.id,
                organization: item.orgName,
                keySite: item.keyPartName,
                camera: item.channelName,
                inspectAction: item.action,
                time: item.CreatedAt
              }
              let extend = item.hasOwnProperty('extend') ? JSON.parse(item.extend) : {}
              if (item.action !== '截图') {
                tableData.channel = extend.serise
                tableData.dPort = extend.dport
                tableData.cPort = extend.cport
                tableData.devIp = item.ip
                tableData.sTime = item.beginTime
                tableData.eTime = item.endTime
              } else {
                tableData.imgSrc = item.attachment
              }
              this.inspectionTable.push(tableData)
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * @description: 表格多选框变化事件
     * @param {type} 无
     * @return: 无
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @description: 保存检查记录表单数据
     * @param {type} 无
     * @return: 无
     */
    sendInspectFormData() {
      if (this.multipleSelection.length === 0) {
        this.$messageError('请选择一条检查记录')
        return
      }
      if (this.inspectTypeValue === '') {
        this.$messageError('请选择检查类型')
        return
      }
      if (this.inspectProjectValue === '') {
        this.$messageError('请选择检查项目')
        return
      }
      let params = {
        recordHandleInfo: {
          action: this.inspectType.filter(item => item.value === this.inspectTypeValue)[0].label, // 检查类型
          project: this.inspectProject.filter(item => item.value === this.inspectProjectValue)[0].label, // 检查项目
          desc: this.descriptionContent, // 内容描述
          itemIds: this.multipleSelection.map(item => item.id)
        }
      }
      disposeCheckerCordApi(params)
        .then(res => {
          this.$messageSuccess('保存检查记录成功！', '成功')
          this.recordLogFun({ OperationType: '检查记录' })
          this.closeInsDialog()
        })
        .catch(() => {
          this.$messageError('保存检查记录失败，请稍后重试！', '错误')
        })
    },
    /**
     * @description: 关闭对话框
     * @param {type} 无
     * @return: 无
     */
    closeInsDialog() {
      this.$emit('closeDialog')
    },
    /**
     * @description: 查看回放录像或者图片
     * @param {type} ind: 点击项索引  data: 点击行数据
     * @return: 无
     */
    handleLookover(ind, data) {
      if (data.inspectAction === '截图') {
        this.cutImgSrc = data.imgSrc
        this.showCutImgModal = true
        this.showPlaybackVideoModal = false
      } else {
        this.playbackParams = {
          channel: data.channel,
          dPort: data.dPort,
          devIp: data.devIp,
          devPort: data.devPort,
          isCenter: data.isCenter,
          recordType: data.recordType,
          sTime: data.sTime,
          eTime: data.eTime,
          streamType: data.streamType
        }
        this.showPlaybackVideoModal = true
        this.showCutImgModal = false
      }
    },
    /**
     * @description: 表格内删除按钮图标点击事件
     * @param {type} ind: 点击项索引； data: 点击行数据
     * @return: 无
     */
    handleDelete(ind, data, mode) {
      if (!mode && this.multipleSelection.length === 0) {
        this.$messageError('请选择要删除的内容')
        return
      }
      deleteCheckerCordApi(mode ? data.id : {ids: this.multipleSelection.map(item => item.id)})
        .then(res => {
          if (res.data && res.data.code === 0) {
            this.getCheckerCordFun()
            this.$messageSuccess('删除成功！', '成功')
          } else {
            this.$messageError('删除失败，请稍后重试！', '错误')
          }
        })
        .catch(() => {
          this.$messageError('删除失败，请稍后重试！', '错误')
        })
    },
    /**
     * @description: 下载到本地按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    handleDownload(ind, data) {
      console.log('download icon click')
    },
    /**
     * @description: 关闭子组件
     * @param {type} 子组件传递过来的参数(关闭图片还是视频)
     * @return: 无
     */
    closeSubDialog(data) {
      if (data === 'video') {
        this.showPlaybackVideoModal = false
      }
      if (data === 'image') {
        this.showCutImgModal = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.inspection-container {
  .inspect-content {
    // 标题分割线样式
    .el-divider--horizontal {
      margin: 24px 0 10px 0;
      .el-divider__text {
        padding: 0 20px 0 0;
      }
      .el-divider__text.is-left {
        left: 0px;
      }
    }

    .delete-btn {
      line-height: 30px;
      span {
        float: right;
        margin-bottom: 5px;
      }
    }

    .form-container {
      padding-top: 20px;
      .form-row {
        width: 100%;
        padding: 10px 0;
        display: flex;
        .form-item {
          width: 50%;
          display: flex;
          .input-label {
            width: 100px;
            line-height: 40px;
          }
          .input-label.right-item {
            width: 150px;
            padding-left: 50px;
          }
        }
      }
    }
  }
}
</style>
