<!--
 * @Author: your name
 * @Date: 2020-06-26 08:51:17
 * @LastEditTime: 2020-06-26 18:58:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\preventDrowsy\pages\PreventDrowsyRemindConfiguration.vue
-->
<template>
  <div class="prevent-drowsy-list-box">
    <div class="content">
      <div class="main">
        <p style="width:100%;margin: 10px auto;font-size:18px;text-align:center;">防瞌睡提醒配置</p>
        <!-- 顶部操作栏 -->
        <div class="top">
        <!-- 操作按钮 -->
          <div class="button-box">
            <el-button size="small" icon="el-icon-edit" @click="edit">编辑</el-button>
            <el-button size="small" icon="el-icon-printer" v-print="'#contentinfo'">打印</el-button>
          </div>
        </div>
      <div id="contentinfo">
        <el-form size="mini" label-position="right" label-width="140px" ref="configForm" :model="form" :rules="configRules" :inline-message="true">
          <el-row>
            <el-col :span=4 v-if="!isEdit">
              <div class="title">
                检查时间间隔
              </div>
            </el-col>
            <div v-if="!isEdit" class="input">
              <el-col :span=20>
                <el-input v-model="form.timeInterval" disabled></el-input>
              </el-col>
            </div>
            <div v-if="isEdit" class="time-input">
              <el-col :span=14>
                <el-form-item label="检查时间间隔" prop="timeInterval">
                  <el-input v-model.number="form.timeInterval"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span=2>
                <div style="height:40px;line-height:40px;font-size:16px;">分钟</div>
              </el-col>
            </div>
          </el-row>
          <el-row style="margin-top:1px;">
            <el-col :span=4 v-if="!isEdit">
              <div class="title">
                未输入/错误次数
              </div>
            </el-col>
            <div v-if="!isEdit" class="input">
              <el-col :span=20>
                <el-input v-model="form.errorTimes" disabled></el-input>
              </el-col>
            </div>
            <div v-if="isEdit" class="time-input">
              <el-col :span=14>
                <el-form-item label="未输入/错误次数" prop="errorTimes">
                  <el-input v-model.number="form.errorTimes"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span=2>
                <div style="height:40px;line-height:40px;font-size:16px;">次</div>
              </el-col>
            </div>
          </el-row>
          <el-row style="margin-top:1px;">
            <el-col :span=4>
            <div class="main-title">
              {{KeyPart}}
            </div>
            </el-col>
            <el-col :span=20>
            <el-row>
              <el-col :span=12>
                <div class="content-title">启用防瞌睡配置&nbsp;&nbsp;&nbsp;<el-checkbox :disabled="!isEdit" v-model="form.start"></el-checkbox></div>
              </el-col>
              <el-col :span=12>
                <div class="content-title">启动客户端声音提醒&nbsp;&nbsp;&nbsp;<el-checkbox :disabled="!isEdit" v-model="form.localAudio"></el-checkbox></div>
              </el-col>
            </el-row>
            <div v-if="!isEdit">
              <el-row>
                <el-col :span=12>
                  <el-col :span="4">
                    <div class="content-title">
                    联动输出
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <el-input size="small" v-model="outPut" disabled></el-input>
                  </el-col>
                </el-col>
                <el-col :span=12>
                  <el-col :span="4">
                    <div class="content-title">
                    上传声音文件
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <el-input size="small" disabled></el-input>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <div v-if="isEdit"  style="height:40px;">
              <el-row>
                <el-col :span=12 v-if="isEdit">
                  <el-col :span=3>
                     <div style="height:40px;line-height:40px;padding:0 5px;">联动输出</div>
                  </el-col>
                  <el-col :span=12>
                    <div class="org-box" @click="showOrgTree=true"  @mouseleave="showOrgTree=false" v-if="isEdit">
                      <el-input v-model="outPut"></el-input>
                      <div class="org-tree-box" v-show="showOrgTree">
                        <orgTree :lazyTreeApi="getTreeApi" @onceClick="clickNode" treeLazyToggle iconToggle></orgTree>
                      </div>
                    </div>
                  </el-col>
                </el-col>
                <el-col :span=12 v-if="isEdit">
                  <el-col :span=4>
                     <div style="height:40px;line-height:40px;padding:0 5px;">上传声音文件</div>
                  </el-col>
                  <el-col :span=12>
                    <el-upload class="upload-demo"
                        action="/api/systemOpsManager/v1/systemOpsManager/upload?type=1"
                        :limit="1"
                        :beforeUpload="beforeUpload"
                        accept=".mp3"
                        :disabled="!isEdit">
                      <el-input size="small" v-model="fileName" disabled></el-input>
                      <el-button class="uploadBtn" size="small" icon="el-icon-upload" plain :disabled="!isEdit">选择文件</el-button>
                    </el-upload>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <div class="content-bottom">
              <div class="bottom-title" :style="isEdit ? 'line-height:0px;' :'line-height:40px;' " >监控中心值班坐席</div>
              <el-row>
                <el-col :span=11>
                  <div class="bottom-left">
                    <div style="overflow:hidden;height:40px;line-height:40px;">
                      <div style="float:left;">IP地址绑定</div>
                      <div style="float:right;" v-if="isEdit">
                        <el-button size="mini" @click="addIpClick" icon="el-icon-plus">添加</el-button>
                        <el-button size="mini" @click="deleteIpClick"  icon="el-icon-delete">删除</el-button>
                      </div>
                    </div>
                    <div class="ip">
                      <ul>
                        <li class="ip-add" :class="{isActive: index === ipActiveIndex }" v-for="(item,index) in ipAddr" :key="index" @click.stop="ipActiveIndex = index">{{item}}</li>
                      </ul>
                    </div>
                  </div>
                </el-col>
                <el-col :span=11>
                  <div class="bottom-right">
                    <div style="overflow:hidden;height:40px;line-height:40px;">
                      <div style="float:left;">MAC地址绑定</div>
                      <div style="float:right;" v-if="isEdit">
                        <el-button size="mini" @click="addMacClick" icon="el-icon-plus">添加</el-button>
                        <el-button size="mini" @click="deleteMacClick"  icon="el-icon-delete">删除</el-button>
                      </div>
                    </div>
                    <div class="ip">
                      <ul>
                        <li class="ip-add" :class="{isActive: index === macActiveIndex }" v-for="(item,index) in macAddr" :key="index" @click.stop="macActiveIndex = index">{{item}}</li>
                      </ul>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="p-creat-from" style="margin-top:15px;">
          <el-row>
            <el-col :span=3>
              <div class="item">
                录入时间
              </div>
            </el-col>
            <el-col :span=5>
              <div disabled class="input-info">{{updatedAt}}</div>
            </el-col>
            <el-col :span=3>
              <div class="item">
                录入机构
              </div>
            </el-col>
            <el-col :span=5>
              <div disabled class="input-info">{{updatedDept}}</div>
            </el-col>
            <el-col :span=3>
              <div class="item">
                录入人
              </div>
            </el-col>
            <el-col :span=5>
              <div disabled class="input-info">{{updatedBy}}</div>
            </el-col>
          </el-row>
          </div>
        </div>
        </div>
        <div class="footer" v-if="isEdit">
          <el-button size="small" @click="onSubmit">保存</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </div>
      </div>
    <el-dialog
      title="添加IP"
      :visible.sync="addIpDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      :before-close="addIpClose">
      <el-form size="mini" label-position="right" label-width="40px" ref="ipForm" :rules="formRule" :model="form">
        <el-form-item label="IP" prop="addIp" >
          <div style="display:flex;">
            <el-input size="small" v-model="form.addIp"></el-input>
            <i class="el-icon-plus" style="margin:8px;font-size:16px;cursor:pointer;" @click="addIpSubmit"></i>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="添加MAC"
      :visible.sync="addMacDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      :before-close="addMacClose">
      <el-form size="mini" label-position="right" label-width="60px" ref="macForm" :rules="formRule" :model="form">
        <el-form-item label="MAC" prop="addMac" >
          <div style="display:flex;">
            <el-input size="small" v-model="form.addMac"></el-input>
            <i class="el-icon-plus" style="margin:8px;font-size:16px;cursor:pointer;" @click="addMacSubmit"></i>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import orgTree from '@src/components/tree/treeBox'
import { getTreeApi, getKeyPartByTypeApi } from '@src/http/systemOperationManage/serverManagement.api'
import { getPreventSleepyConfigApi, setPreventSleepyConfigApi } from '@src/http/systemOperationManage/preventDrowsy.api'
export default {
  name: 'PreventDrowsyRemindConfiguration',
  components: {
    orgTree
  },
  data() {
    // ip格式验证
    var validateEquipmentIp = (rule, value, callback) => {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        return callback(new Error('不能输入汉字！'))
      }
      let pattern = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
      if (!pattern.test(value)) {
        return callback(new Error('ip格式不对，请重填！'))
      } else {
        callback()
      }
    }
    // 空格校验
    var noSpace = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('MAC地址不能为空'))
      }
      let r = /\s+/g
      if (r.test(value)) {
        return callback(new Error('不可以输入空格！'))
      } else {
        callback()
      }
    }
    // mac
    var validateMacConfig = (rule, value, callback) => {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        return callback(new Error('不能输入汉字！'))
      } else {
        callback()
      }
    }
    return {
      formRule: {
        addIp: [
          { validator: validateEquipmentIp, trigger: 'blur' }
        ],
        addMac: [
          { validator: validateMacConfig, trigger: 'blur' },
          { validator: noSpace, trigger: 'blur' }
        ]
      },
      configRules: {
        timeInterval: [
          { required: true, message: '检查时间不能为空' },
          { type: 'number', min: 1, max: 300, message: '请填写1~300分钟范围时间' }
        ],
        errorTimes: [
          { required: true, message: '错误次数不能为空' },
          { type: 'number', min: 1, max: 3, message: '请填写1~3次范围次数' }
        ]
      },
      form: {
        orgId: '',
        orgName: '',
        timeInterval: '',
        errorTimes: '',
        addIp: '',
        addMac: '',
        start: false,
        localAudio: false // 是否启动本地声音提醒
      },
      updatedAt: '',
      updatedBy: '',
      updatedById: '',
      updatedDept: '',
      updatedDeptId: '',
      KeyPart: '',
      keyPartId: '',
      ipAddr: [],
      macAddr: [],
      addMacDialogVisible: false,
      addIpDialogVisible: false,
      isEdit: false,
      ipActiveIndex: -1,
      macActiveIndex: -1,
      outPut: '', // 联动输出
      showOrgTree: false,
      fileName: '' // 上传的声音文件名
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.getState()
    this.getTreeApiFuc()
  },
  methods: {
    getTreeApiFuc() {
      let param = {
        type: 0
      }
      getTreeApi(param).then(res => {
        if (res.data.code === 0) {
          this.form.orgId = res.data.data && res.data.data.nodes[0].id
          this.form.orgName = res.data.data && res.data.data.nodes[0].name
          this.getPreventSleepyConfigApiFuc()
          let param = {
            page: 1,
            limit: 100,
            type: 11,
            oId: res.data.data.nodes[0].serial
          }
          this.getKeyPartByTypeApiFuc(param)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 通过机构获取重点部位
    getKeyPartByTypeApiFuc(param) {
      getKeyPartByTypeApi(param).then(res => {
        if (res.data.code === 0) {
          if (res.data.data.ketPartList.length !== 0) {
            this.KeyPart = res.data.data.ketPartList[0].keyPart.name
            this.keyPartId = res.data.data.ketPartList[0].keyPart.id
          }
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    getState() {
      this.updatedDeptId = JSON.parse(sessionStorage.user).orgId
      this.updatedDept = JSON.parse(sessionStorage.user).orgName
      this.updatedById = JSON.parse(sessionStorage.user).id
      this.updatedBy = JSON.parse(sessionStorage.user).name
      this.updatedAt = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },
    clickNode(node) {
      this.outPut = node.name
    },
    getTreeApi(param) {
      return getTreeApi(param)
    },
    // 声音文件上传
    beforeUpload(file) {
      this.fileName = file.name
    },
    addIpClick() {
      this.addIpDialogVisible = true
    },
    addMacClick() {
      this.addMacDialogVisible = true
    },
    // 删除已添加的ip
    deleteIpClick() {
      if (this.ipActiveIndex === -1) {
        return this.$messageError('请选择要删除的IP')
      }
      this.ipAddr.splice(this.ipActiveIndex, 1)
      this.ipActiveIndex = -1
    },
    deleteMacClick() {
      if (this.macActiveIndex === -1) {
        return this.$messageError('请选择要删除的MAC地址')
      }
      this.macAddr.splice(this.macActiveIndex, 1)
      this.macActiveIndex = -1
    },
    // 添加IP确定按钮
    addIpSubmit() {
      this.$refs.ipForm.validate(valid => {
        if (valid) {
          if (this.ipAddr.includes(this.form.addIp)) {
            return this.$messageError('请勿添加重复IP')
          }
          this.ipAddr.push(this.form.addIp)
          this.addIpDialogVisible = false
          this.$refs.ipForm.resetFields()
        }
      })
    },
    addMacSubmit() {
      this.$refs.macForm.validate(valid => {
        if (valid) {
          if (this.macAddr.includes(this.form.addMac)) {
            return this.$messageError('请勿添加重复MAC地址')
          }
          this.macAddr.push(this.form.addMac)
          this.addMacDialogVisible = false
          this.$refs.macForm.resetFields()
        }
      })
    },
    addIpClose() {
      this.addIpDialogVisible = false
      this.$refs.ipForm.resetFields()
    },
    addMacClose() {
      this.addMacDialogVisible = false
      this.$refs.macForm.resetFields()
    },
    getPreventSleepyConfigApiFuc() {
      let param = {
        orgId: this.form.orgId
      }
      getPreventSleepyConfigApi(param).then(res => {
        if (res.data.code === 0) {
          this.form = {
            ...this.form,
            timeInterval: res.data.data.timeInterval,
            errorTimes: res.data.data.errorTimes,
            start: res.data.data.start === 1,
            localAudio: res.data.data.localAudio === 1
          }
          this.ipAddr = res.data.data.ipAddr || []
          this.macAddr = res.data.data.macAddr || []
        }
      })
    },
    //   编辑
    edit() {
      this.isEdit = true
      return this.$message('编辑')
    },
    // 保存
    onSubmit() {
      this.$refs.configForm.validate(valid => {
        if (valid) {
          if (!this.ipAddr.length && !this.macAddr.length) {
            return this.$messageError('请至少填写一个IP/MAC地址')
          }
          this.isEdit = false
          let param = {
            timeInterval: Number(this.form.timeInterval),
            errorTimes: Number(this.form.errorTimes),
            orgId: String(this.form.orgId),
            orgName: this.form.orgName,
            keyPart: this.keyPart,
            keyPartId: String(this.keyPartId),
            start: this.form.start ? 1 : 2,
            localAudio: this.form.localAudio ? 1 : 2,
            outLinkage: [],
            ipAddr: this.ipAddr,
            macAddr: this.macAddr,
            updatedAt: String(new Date(this.updatedAt).getTime()),
            updatedBy: this.updatedBy,
            updatedById: this.updatedById,
            updatedDept: this.updatedDept,
            updatedDeptId: this.updatedDeptId
          }
          setPreventSleepyConfigApi(param).then(res => {
            if (res.data.code === 0) {
              this.$messageSuccess('设置成功')
              this.getPreventSleepyConfigApiFuc()
            }
          })
            .catch(err => {
              console.log(err)
            })
          this.ipActiveIndex = -1
          this.macActiveIndex = -1
        }
      })
    },
    // 取消
    cancel() {
      this.isEdit = false
      return this.$message('取消')
    }
  }
}
</script>

<style lang="less" scoped>
.prevent-drowsy-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .top {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main {
      width:calc(~'100% - 300px');
      border: 1px solid #ccc;
      padding: 5px;
      .org-box {
        position: relative;
        width: 100%;
        .org-tree-box {
          border: 1px solid #ddd;
          position: absolute;
          left: 0px;
          top: 40px;
          z-index: 99;
          height: 300px;
          width: 100%;
          background: #fff;
        }
      }
      .title {
        height: 35px;
        line-height: 35px;
        margin: 5px 3px 0 2px;
        text-align: center;
      }
      .input {
        width:100;
        height:45px;
        margin-top: 3px;
        padding-top:2px;
      }
      .time-input {
        width:100;
        height:45px;
        padding-top:4px;
        border: 1px solid #ccc;
      }
      .main-content {
        margin-left: 10px;
        height: 40px;
        line-height: 40px;
      }
      .main-title {
        height: 400px;
        line-height: 400px;
        margin-right: 3px;
        text-align: center;
        border: 1px solid #ccc;
      }
      .content-title {
        height: 40px;
        line-height: 40px;
        margin-left:20px;
      }
      .uploadBtn {
        position: relative;
        right:-204px;
        top:-38px;
      }
      .content-bottom {
        height: 100%;
        width: 100%;
        border: 1px solid #ccc;
      }
      .bottom-title {
        height: 40px;
        text-align: center;
      }
      .bottom-left {
        height: 100%;
        width: 100%;
        margin: 5px 20px 5px 10px;
      }
      .bottom-right {
        height: 100%;
        width: 100%;
        margin: 5px 10px 5px 65px;
      }
      .ip {
        height: 228px;
        min-height: 228px;
        width: 100%;
        border: 1px solid #ccc;
        overflow: auto;
        .ip-add {
          width: 50%;
          height: 30px;
          line-height: 30px;
          margin: 5px 30px;
          cursor: pointer;
        }
        .isActive {
          background: #FFF;
        }
      }
      .p-creat-from {
        border: 1px solid #ddd;
        padding: 10px;
        width: 100%;
        .item {
          height: 35px;
          line-height: 35px;
          margin-right: 2px 3px 0 0;
          text-align: center;
          background: #f2f2f2;
        }
        .input-info {
          height: 35px;
          line-height: 35px;
          text-align: center;
          border: 1px solid #ddd;
        }
      }
    }
    #contentinfo {
      background: #F5F5F5;
    }
    .footer {
      width: calc(~'100% - 300px');
      text-align:center;
      margin-top: 50px;
    }
  }
}
/deep/.el-dialog__header {
  padding: 15px 15px 35px;
}
/deep/.el-form-item {
  margin-bottom: 0;
}
/deep/.el-upload-list {
  display: none;
}
</style>
