<template>
  <div class="icon-box">
    <i class="icon iconfont-ccb ccbjianchajilu" :class="[!selectedObj.isPlay? 'disable': '']" title="检查记录" @click="checkRecode"></i>
    <el-dialog :visible.sync="recodeFocus" class="check-log-dialog" width="50%"
      :before-close="cancelSub"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      :modal="isNeedModal"
      :close-on-click-modal="false">
      <iframe v-if="recodeFocus" style="z-index:0;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
      <div slot="title" class="dialog-title" style="height:35px;line-height:35px;font-size:16px;">
        <div style="float:left">
          <span>检查记录</span>
        </div>
      </div>
      <div class="content-item">
        <div class="title">
          今日检查记录
        </div>
        <div class="batch-delete" @click="deleteSome" :class="{'disable': selectData.length === 0}">
          <i type="text" cornflowerblue  title="删除" class="el-icon-delete delete-icon"  size="medium"></i>
          <span>删除</span>
        </div>
        <el-table :data="tableData" max-height="250" stripe border style="width: 100%"
          @select="select"
          @select-all="select"
          >
          <el-table-column show-overflow-tooltip :resizable="false" type="selection" width="55" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip :resizable="false" type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip :resizable="false" prop="orgName" label="机构" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip :resizable="false" prop="keyPartName" label="重点部位" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip :resizable="false" prop="channelName" label="镜头" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip :resizable="false" prop="event" label="检查动作" width="80" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip :resizable="false" prop="time" label="记录时间" width="180" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip :resizable="false" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <i cornflowerblue @click="checkLogDetailsHandleClick(scope.row, scope.$index)" title="查看" :class="[scope.row.event === '截图' ? 'el-icon-picture-outline' : 'el-icon-video-camera']"></i>
              <i @click.stop="handleEdit(scope.$index, scope.row)" title="下载" class="icon iconfont icon-xiazai"></i>
              <i cornflowerblue @click="deleteCheckLogHandleClick(scope.row)"  title="删除" class="el-icon-delete" size="medium"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content-item">
        <div class="title">
          记录处理
        </div>
        <div class="record-processing">
          <el-form ref="form" :model="recordForm" label-width="80px" :rules="rules">
            <el-row>
              <el-col :span="11" style="margin-top:10px;">
                <el-form-item label="值班员">
                  <el-input v-model="recordForm.username" style="width:100%;" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col style="margin-top:10px;" :span="11">
                <el-form-item label="检查类型">
                  <el-select placeholder="请选择类型" v-model="recordForm.action" style="width:100%;">
                    <el-option v-for="item in checkTypeList" :label="item.data" :value="item.key" :key="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="检查项目">
                  <el-select placeholder="请选择项目" v-model="recordForm.project" style="width:100%;">
                    <el-option v-for="item in checkProjectList" :label="item.data" :value="item.key" :key="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" style="margin-bottom:10px;">
                <el-form-item label="内容描述" prop="desc">
                  <el-input type="textarea" resize="none" v-model="recordForm.desc" style="width:100%;" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="填写单位">
                  <el-input v-model="recordForm.orgName" style="width:100%;" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="填写时间">
                  <el-input v-model="recordForm.currentTime" style="width:100%;" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div slot="footer" style="position:relative">
        <el-button type="primary" size="mini" style="margin-right:24px;" @click="save" :disabled="selectData.length === 0" >保存</el-button>
        <el-button size="mini" @click="cancelSub">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="detailInfo" :before-close="cancelSubInfo"
      :close-on-click-modal="false"
      :modal="isNeedModal"
      :modal-append-to-body="false"
      >
      <div class="img-box" v-if="activeBox === 'img'">
        <img :src="path" alt="截图详情">
      </div>
      <div class="playback-box" v-show="activeBox === 'video'">
        <back-plugin ref="playBackPlugin" :defaultPane="defaultPane" :configuration="configuration"  :iconShow="iconShowParams">
          <div slot="download" class="right-btn">
            <i class="icon iconfont icon-xiazai" title="下载" @click="openDownload"></i>
          </div>
        </back-plugin>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckRecode, setCheckRecode, oneDelete, batchDelete, getDictBasicInfo } from '@src/http/video/videoPreview.api.js'
import { newDownloadDev } from '@src/components/videoPlugin/playback/common/plginInMethod'
import { download } from '@src/common/download'

export default {
  name: 'CheckRecode',
  inheritAttrs: false,
  data() {
    var checkDesc = (rule, value, callback) => {
      if (!value) {
        return callback()
      } else {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 512) {
          return callback(new Error('内容描述为0-512个字符或0-256中文'))
        } else {
          return callback()
        }
      }
    }

    return {
      selectData: [],
      recodeFocus: false,
      detailInfo: false,
      tableData: [],
      path: '',
      activeBox: '',
      recordForm: {
        currentTime: new Date().toLocaleString(),
        orgName: '',
        username: '',
        action: '',
        project: '',
        desc: ''
      },
      rules: {
        desc: [
          { validator: checkDesc, trigger: 'blur' }
        ]
      },
      checkTypeList: [],
      checkProjectList: [],
      configuration: {
        progressBar: {
          show: true,
          type: 'totaltime'
        },
        timeline: {
          show: false
        }
      },
      defaultPane: 1,
      iconShowParams: [
        {
          type: 'left',
          index: 0,
          name: 'Play'
        },
        {
          type: 'left',
          index: 1,
          name: 'Stop'
        },
        {
          type: 'left',
          index: 2,
          name: 'Volume'
        },
        {
          type: 'left', // 可选left、right 标识该按钮实在左边显示还是右边显示
          index: 3, // 下标，用于计算该按钮的位置 默认宽度是36px
          slotName: 'download', // 外部生成slot的名称 具名插槽
          width: '36'// 按钮所占的宽度
        },
        {
          type: 'left',
          index: 4,
          name: 'FullScreen'
        }
      ],
      selectInfo: {}
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isNeedModal: {
      type: Boolean,
      default: true
    }
  },
  beforeCreate() {
    this.$options.components.backPlugin = require('@src/view/videoManage/playback/playBackPlugin/playBackPlugin.vue').default
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem('user')) || {}
    this.recordForm.username = user.userName || ''
    this.recordForm.orgName = user.orgName || ''
  },
  methods: {
    checkRecode() {
      if (this.selectedObj.isPlay) {
        this.recodeFocus = true
        this.checkRecodeList()
        this.checkTypeOrProject()
      }
    },
    checkRecodeList() { // 检查记录表格请求方法
      getCheckRecode().then(res => {
        if (res.data.code === 0) {
          let tableData = res.data.data.logs || []
          tableData.forEach(i => {
            if (i.event === 'MANUALRECORD') {
              i.time = this.$moment(i.beginTime).format('YYYY-MM-DD HH:mm:ss') + '-' + this.$moment(i.endTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              i.time = i.CreatedAt
            }
            i.event = i.event === 'SCREENSHOT' ? '截图' : '录像'
          })
          this.tableData = tableData.reverse()
        }
      })
    },
    // 检查类型和检查项目
    checkTypeOrProject() {
      getDictBasicInfo({
        queryList: [
          {
            moduleId: '1', // 模块id 1=智慧安防 2=智慧消防
            childModuleId: '2', // 子模块id{1 = 报警管理  2 = 视频管理  3 = 音频管理  4 =门禁管理 5=联动互锁门 6=防护舱 7=安防设备管控  8=电视墙  9=金库远程管理  10=停车管理}
            dictId: '16' // 字典id  检查类型16 检查项目17
          },
          {
            moduleId: '1', // 模块id 1=智慧安防 2=智慧消防
            childModuleId: '2', // 子模块id{1 = 报警管理  2 = 视频管理  3 = 音频管理  4 =门禁管理 5=联动互锁门 6=防护舱 7=安防设备管控  8=电视墙  9=金库远程管理  10=停车管理}
            dictId: '17' // 字典id  检查类型16 检查项目17
          }
        ]
      }).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          data.forEach(item => {
            if (item.dictId === '16') {
              this.checkTypeList = item.attr
            } else if (item.dictId === '17') {
              this.checkProjectList = item.attr
            }
          })
        }
      })
    },
    select(s, row) {
      this.selectData = s
    },
    cancelSub() {
      this.recodeFocus = false
      this.recordForm.action = ''
      this.recordForm.project = ''
      this.recordForm.desc = ''
      // this.recordForm = {
      //   currentTime: '',
      //   orgName: '',
      //   username: '',
      //   action: '',
      //   project: '',
      //   desc: ''
      // }
    },
    cancelSubInfo() {
      this.detailInfo = false
      this.path = ''
    },
    save() {
      this.$refs.form.validate((valid) => {
        console.log('------------', valid)
        if (valid) {
          let itemIds = this.selectData.map(i => i.id)
          let params = {
            itemIds, // todo 有可能会发生变化
            action: this.recordForm.action,
            desc: this.recordForm.desc,
            project: this.recordForm.project
          }
          setCheckRecode(params).then(res => {
            if (res.data.code === 0) {
              this.cancelSub()
              this.checkRecodeList()
            } else {
              this.$messageError(res.data.message)
            }
          })
        } else {
          this.$messageError('请正确填写内容描述内容')
        }
      })
    },
    checkLogDetailsHandleClick(data, index) {
      this.detailInfo = true
      if (data.event === '截图') {
        this.path = location.origin + '/' + data.attachment
        this.activeBox = 'img'
      } else if (data.event === '录像') {
        this.activeBox = 'video'
        let channelInfo = data.extend1 && JSON.parse(data.extend1)
        if (!channelInfo) { return }
        let streams = ['main', 'sub1', 'sub2']
        let params = {
          channel: channelInfo.serise,
          devIp: data.ip,
          devPort: channelInfo.cport,
          devDport: channelInfo.dport,
          deviceType: data.deviceType,
          streamType: streams[channelInfo.streamType],
          name: data.channelName,
          startTime: new Date(data.endTime).getTime() / 1000,
          endTime: new Date(data.beginTime).getTime() / 1000
        }
        this.$nextTick(() => {
          this.$refs.playBackPlugin.openBackVideo(params)
        })
      }
      this.selectInfo = { // 记录查看的录像，用与下载
        data,
        index
      }
    },
    openDownload() {
      this.handleEdit(this.selectInfo.index, this.selectInfo.data)
    },
    deleteCheckLogHandleClick(data) { // 单个删除
      this.$confirm('此操作将删除该检查记录,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        oneDelete(data.id).then(res => {
          if (res.data.code === 0) {
            this.checkRecodeList()
          } else {
            this.$messageError(res.data.message)
          }
        })
      })
    },
    deleteSome() { // 批量删除
      this.$confirm('此操作将删除所选的检查记录,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = this.selectData.map(i => i.id)
        batchDelete({ ids }).then(res => {
          if (res.data.code === 0) {
            this.checkRecodeList()
          } else {
            this.$messageError(res.data.message)
          }
        })
      })
    },
    // 单击前端播放列表的下载按钮
    handleEdit(index, row) {
      if (row.event === '截图') {
        let pathUrl = location.origin + '/' + row.attachment
        download(pathUrl, row.channelName)
      } else if (row.event === '录像') {
        let path = this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100\\Download'
        let strFileDir = path + '\\' + 'download.txt'
        let creatDir = document.getElementById('global-plugin').SaveFileInfo(strFileDir, 'name')
        if (creatDir) {
          this.$message({
            message: '创建目录文件失败',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: `录像开始下载,下载路径为${path}`,
          type: 'warning'
        })
        const time = new Date().getTime()
        let extend1 = JSON.parse(row.extend1)
        let result = {
          devIp: row.ip, // 设备ip,
          devPort: extend1.cport, // 设备端口,
          channel: extend1.serise, // 通道号,
          recordType: row.operType, // 录像请求类型,
          startTime: this.$moment(row.beginTime).format('YYYY-MM-DD HH:mm:ss'), // 开始时间,
          endTime: this.$moment(row.endTime).format('YYYY-MM-DD HH:mm:ss'), // 结束时间,
          streamType: extend1.streamType, // 码流类型,
          devType: this.getDevType(row)
        }
        let record = {
          result: result,
          startTime: this.$moment(row.beginTime).format('YYYY-MM-DD HH:mm:ss'), // 开始时间,
          endTime: this.$moment(row.endTime).format('YYYY-MM-DD HH:mm:ss'), // 结束时间,
          fileName: row.channelName,
          fileSize: 0,
          fileType: row.operType
        }
        console.log('==下载传参==')
        console.log(record)
        newDownloadDev(record, time, path)
      }
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
  }
}

</script>
<style lang='less' scoped>
.icon-box {
  position: relative;
  display: inline-block;
  i {
    padding: 0 8px;
    font-size: 20px;
  }
  .disable {
    color: #878282;
    cursor: not-allowed;
  }
}
/deep/ .el-dialog__body {
  position: relative;
  padding: 15px  20px 0;
  .disable {
    color: #878282 !important;
    cursor: not-allowed !important;
    i{
     color: #878282 !important;
      cursor: not-allowed !important;
    }
    span{
      color: #878282 !important;
    }
  }
  .content-item {
    padding: 10px;
    .title {
      width: 120px;
      font-size: 16px;
      height: 34px;
      line-height: 34px;
    }
    .batch-delete{
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      position: relative;
      width: 80px;
      float: right;
      span{
        font-size: 16px;
      }
      .delete-icon {
        font-size: 18px;
        cursor: pointer;
        margin: 5px 5px 10px 0;
      }
      &:hover {
        color: cornflowerblue;
      }
    }
  }
  .cell {
    i {
      font-size: 18px;
      cursor: pointer;
      margin: 0 5px 0 0;
      &:hover {
        color: cornflowerblue;
      }
    }
  }
  
  
  .img-box {
    width: 100%;
    height: 100%;
    text-align: center;
    img {
      width: 100%;
    }
  }
  .playback-box {
    width: 100%;
    height: 500px;
  }
  .record-processing {
    .el-form-item {
      margin-bottom: 12px;
    }
  }
}

</style>
