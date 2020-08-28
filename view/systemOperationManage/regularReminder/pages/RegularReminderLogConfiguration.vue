<!--
 * @Author: your name
 * @Date: 2020-06-27 08:51:17
 * @LastEditTime: 2020-06-27 16:58:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\regularReminder\pages\RegularReminderConfiguration.vue
-->
<template>
  <div class="regular-reminder-box">
    <div class="content">
      <div class="main">
      <p style="width:100%;margin: 10px auto;font-size:18px;text-align:center;">定时提醒配置</p>
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" icon="el-icon-edit" @click="edit">编辑</el-button>
          <el-button size="small" icon="el-icon-printer" v-print="'#contentinfo'">打印</el-button>
        </div>
      </div>
      <div id="contentinfo">
        <el-form size="mini" label-position="center" label-width="140px" class="config-form" ref="configForm" :model="form" :rules="configRules" :inline-message="true">
          <el-row>
            <el-col :span=4 v-if="!isEdit">
              <div class="title">
                检查时间间隔
              </div>
            </el-col>
            <el-col :span=20 v-if="!isEdit">
              <el-input v-model="form.reminderPlan" disabled></el-input>
            </el-col>
            <el-col :span=24  v-if="isEdit">
              <el-form-item label="提醒计划" prop="reminderPlan">
                <el-select v-model="form.reminderPlan" style="width: 100%;" @change="changePlan" :disabled="!isEdit">
                  <el-option v-for="(item,index) in reminderPlanArray" :key="index" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:1px;">
            <el-col :span=4 v-if="!isEdit">
              <div class="title">
                提醒间隔
              </div>
            </el-col>
            <el-col :span=20 v-if="!isEdit">
              <el-input v-model="form.timeInterval" disabled></el-input>
            </el-col>
            <el-col :span=24  v-if="isEdit">
              <el-form-item label="提醒间隔" prop="timeInterval">
                <el-input v-model.number="form.timeInterval" :disabled="!isEdit"></el-input>
              </el-form-item>
            </el-col>
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
                  <div class="content-title">启用定时提醒配置&nbsp;&nbsp;&nbsp;<el-checkbox :disabled="!isEdit" v-model="form.start"></el-checkbox></div>
                </el-col>
                <el-col :span=12>
                  <div class="content-title">启用客户端声音提醒&nbsp;&nbsp;&nbsp;<el-checkbox :disabled="!isEdit" v-model="form.localVoice"></el-checkbox></div>
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
                        <el-input size="small" style="margin-left:5px;" v-model="outPut" disabled></el-input>
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
              <div v-if="isEdit" style="height:40px;">
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
                        action="/api/systemOpsManager/v1/systemOpsManager/upload?type=2"
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
                <div class="bottom-title" :style=" isEdit ? 'line-height:0px;' : 'line-height:40px;' ">监控中心值班坐席</div>
                <el-row>
                  <el-col :span=11>
                    <div class="bottom-left">
                      <div style="overflow:hidden;height:40px;line-height:40px;">
                        <div style="float:left;">IP地址绑定</div>
                        <div style="float:right;" v-if="isEdit">
                          <el-button size="mini" @click="addIpClick" icon="el-icon-plus">添加</el-button>
                          <el-button size="mini" @click="deleteIpClick" icon="el-icon-delete">删除</el-button>
                        </div>
                      </div>
                      <div class="ip">
                        <ul>
                          <li class="ip-add" :class="{isActive: index === ipActiveIndex }" v-for="(item,index) in ipAddr" :key="index" @click="ipActiveIndex = index">{{item}}</li>
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
                          <el-button size="mini" @click="deleteMacClick" icon="el-icon-delete">删除</el-button>
                        </div>
                      </div>
                      <div class="ip">
                        <ul>
                          <li class="ip-add" :class="{isActive: index === macActiveIndex }" v-for="(item,index) in macAddr" :key="index" @click="macActiveIndex = index">{{item}}</li>
                        </ul>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
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
import { getRegularlyRemindedConfigApi, setRegularlyRemindedConfigApi } from '@src/http/systemOperationManage/regularReminder.api'
import { getTimeTemplateListApi } from '@src/http/systemOperationManage/timeTemplate.api.js'
export default {
  name: 'RegularReminderLogConfiguration',
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
        reminderPlan: [
          { required: true, message: '提醒计划不能为空' }
        ],
        timeInterval: [
          { required: true, message: '提醒时间不能为空' },
          { type: 'number', min: 1, max: 300, message: '请填写1~300时间范围' }
        ]
      },
      fileName: '',
      KeyPart: '',
      keyPartId: '',
      form: {
        orgName: '',
        orgId: '',
        reminderPlan: '',
        timeInterval: '',
        start: false, // 是否启动防定时提醒
        localVoice: false, // 是否启动本地声音提醒
        addIp: '', // 添加的IP
        addMac: '',
        templateId: ''
      },
      updatedById: '',
      updatedAt: '',
      updatedBy: '',
      updatedDept: '',
      updatedDeptId: '',
      macAddr: [],
      ipAddr: [],
      addMacDialogVisible: false,
      addIpDialogVisible: false,
      isEdit: false,
      outPut: '', // 联动输出
      ipActiveIndex: -1,
      macActiveIndex: -1,
      reminderPlanArray: [
      ],
      showOrgTree: false,
      timer: ''
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getTreeApiFuc()
    this.getState()
    this.getTimeTemplateListApiFuc()
  },
  methods: {
    getTreeApiFuc() {
      let param = {
        type: 0
      }
      getTreeApi(param).then(res => {
        if (res.data.code === 0) {
          this.form.orgId = res.data.data && String(res.data.data.nodes[0].id)
          this.form.orgName = res.data.data && res.data.data.nodes[0].name
          this.getRegularlyRemindedConfigApiFuc()
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
    clickNode(node) {
      this.outPut = node.name
    },
    changePlan(value) {
      this.reminderPlanArray.forEach(item => {
        if (value === item.value) {
          this.form.templateId = item.id
        }
      })
    },
    beforeUpload(file) {
      this.fileName = file.name
    },
    // uploadRadioApiFuc() { // 暂时不需要下载音频接口，访问服务器地址
    //   uploadRadioApi().then(res => {
    //     console.log(res)
    //   })
    // },
    getState() {
      this.updatedById = JSON.parse(sessionStorage.user).id
      this.updatedBy = JSON.parse(sessionStorage.user).name
      this.updatedDept = JSON.parse(sessionStorage.user).orgName
      this.updatedDeptId = JSON.parse(sessionStorage.user).org
      this.timer = setInterval(_ => {
        this.updatedAt = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    },
    getTreeApi(param) {
      return getTreeApi(param)
    },
    addIpClick() {
      this.addIpDialogVisible = true
    },
    addMacClick() {
      this.addMacDialogVisible = true
    },
    getRegularlyRemindedConfigApiFuc() {
      let param = {
        orgId: this.form.orgId
      }
      getRegularlyRemindedConfigApi(param).then(res => {
        if (res.data.code === 0) {
          this.form = {
            ...this.form,
            start: res.data.data.start === 1,
            localVoice: res.data.data.localVoice === 1,
            templateId: res.data.data.plan.templateId,
            reminderPlan: res.data.data.plan.templateName
          }
          this.ipAddr = res.data.data.ipAddr || []
          this.macAddr = res.data.data.macAddr || []
        }
      })
        .catch(err => {
          console.log(err)
        })
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
    addIpClose() {
      this.addIpDialogVisible = false
      this.$refs.ipForm.resetFields()
    },
    addMacClose() {
      this.addMacDialogVisible = false
      this.$refs.macForm.resetFields()
    },
    setRegularlyRemindedConfigApiFuc(param) {
      setRegularlyRemindedConfigApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('设置成功')
        } else {
          this.$messageSuccess('设置失败')
        }
        this.getRegularlyRemindedConfigApiFuc()
      })
        .catch(err => {
          this.getRegularlyRemindedConfigApiFuc()
          this.$messageSuccess('设置失败')
          console.log(err)
        })
    },
    // 获取时间模板的配置
    getTimeTemplateListApiFuc() {
      getTimeTemplateListApi().then(res => {
        if (res.data.code === 0) {
          res.data.data && res.data.data.forEach((item, index) => {
            this.reminderPlanArray.push(
              {value: item.templateName, label: item.templateName, id: item.id}
            )
          })
        }
      })
    },
    //   编辑
    edit() {
      this.isEdit = true
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
            plan: {
              templateId: this.form.templateId,
              templateName: this.form.reminderPlan
            },
            timeInterval: Number(this.form.timeInterval),
            orgId: String(this.form.orgId),
            orgName: this.form.orgName,
            keyPart: this.keyPart,
            keyPartId: String(this.keyPartId),
            start: this.form.start ? 1 : 2,
            localVoice: this.form.localVoice ? 1 : 2,
            outLinkage: [],
            ipAddr: this.ipAddr,
            macAddr: this.macAddr,
            updatedAt: String(new Date(this.updatedAt).getTime()),
            updatedBy: this.updatedBy,
            updatedById: this.updatedById,
            updatedDept: this.updatedDept,
            updatedDeptId: this.updatedDeptId
          }
          this.setRegularlyRemindedConfigApiFuc(param)
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
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除定时器
    }
  }
}
</script>

<style lang="less" scoped>
.regular-reminder-box {
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
        margin-right: 3px;
        text-align: center;
        background: #f2f2f2;
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
        top:-33px;
      }
      .content-bottom {
        height: 100%;
        width: 100%;
        border: 1px solid #ccc;
      }
      .bottom-title {
        height: 40px;
        line-height: 40px;
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
        height: 230px;
        min-height: 230px;
        width: 100%;
        border: 1px solid #ccc;
        overflow: auto;
        .ip-add {
          width: 50%;
          height: 30px;
          line-height: 30px;
          margin: 10px 30px;
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
        background:#F5F5F5;
        .item {
          height: 35px;
          line-height: 35px;
          margin-right: 3px;
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
/deep/.el-upload-list {
  display: none;
}
/deep/.el-form-item {
  margin-bottom: 0;
}
</style>
