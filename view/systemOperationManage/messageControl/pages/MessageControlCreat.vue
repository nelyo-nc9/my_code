<!--
 * @Author: your name
 * @Date: 2020-08-03 15:30:04
 * @LastEditTime: 2020-08-03 20:33:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\messageControl\pages\MessageControlCreat.vue
-->
<template>
  <div class="message-control-creat-box">
    <div class="content">
      <div class="directory">
        <div class="directory-item">
          <span class="el-icon-location-outline"></span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统运维管理</el-breadcrumb-item>
          <el-breadcrumb-item>短信管理</el-breadcrumb-item>
          <el-breadcrumb-item>新建短信</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 顶部操作栏 -->
      <div class="top" id="contentinfo">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="p-search-from">
              <el-form size="mini" label-position="center" label-width="200px" ref="messageForm" :model="form">
                <el-row>
                  <el-col :span=24 class="box">
                    <el-form-item label="接收者" prop="receiver"
                    :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                      <el-input v-model="receiver" type="textarea" :rows="4" resize="none" readonly></el-input>
                      <i class="el-icon-plus el-input__icon add" @click="handleIconClick"></i>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=24 class="box">
                    <el-form-item label="短信内容" prop="content"
                    :rules="[{ required: true, message: '必填', trigger: 'change' },{ min: 0, max: 128, message: '最多可输入128个字符' }]">
                      <el-input v-model="form.content" type="textarea" :rows="4" resize="none"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=24 class="box1">
                    <el-form-item label="发送方式" prop="mode"
                    :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                      <el-select v-model="form.mode" style="width: 100%;">
                        <el-option v-for="(item,index) in sendTypeArray" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=24 class="box1">
                    <el-form-item label="发送时间" prop="time"
                    :rules="form.mode === 2 ? [{ required: true, message: '必填', trigger: 'change' }] :
                    [{ required: false, message: '', trigger: 'change' }]">
                      <el-date-picker
                        style="width:100%"
                        v-model="form.time"
                        :disabled="form.mode===1"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="请选择发送时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=24 class="box1">
                    <el-form-item label="发送状态" prop="status"
                    :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                      <el-select v-model="form.status" style="width: 100%;" disabled>
                        <el-option v-for="(item,index) in sendStatusArray" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="p-search-con">
              <el-row>
                <el-col :span=24>
                  <el-col :span=3>
                    <div class="items">录入时间</div>
                  </el-col>
                  <el-col :span=5>
                    <div disabled class="input-info">{{form.createdAt}}</div>
                    </el-input>
                  </el-col>
                  <el-col :span=3>
                    <div class="items">录入机构</div>
                  </el-col>
                  <el-col :span=5>
                    <div disabled class="input-info">{{form.updatedDept}}</div>
                    </el-input>
                  </el-col>
                  <el-col :span=3>
                    <div class="items">录入人</div>
                  </el-col>
                  <el-col :span=5>
                    <div disabled class="input-info">{{form.updatedBy}}</div>
                    </el-input>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <div class="p-search-footer">
              <el-button  size="small" type="primary"  @click="onSubmit">保存</el-button>
              <el-button  size="small" v-print="'#contentinfo'">打印</el-button>
              <el-button  size="small" @click="close">关闭</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="addDialogVisible">
      <addPeopleModel :addDialogVisible="addDialogVisible" :alreadyPeo="addPeopleArray" @dialogVisible="dialogVisible" @addPeople="addPeople"></addPeopleModel>
    </div>
  </div>
</template>

<script>
import { creatShortMessageApi, sendMessageApi } from '@src/http/systemOperationManage/messageControl.api'
import { getTreeApi } from '@src/http/systemOperationManage/serverManagement.api'
import addPeopleModel from './addPeopleModel'
export default {
  name: 'MessageControlCreat',
  components: {
    addPeopleModel
  },
  data() {
    return {
      timer: '',
      addDialogVisible: false,
      sendTypeArray: [
        {value: 1, label: '立即发送'},
        {value: 2, label: '定时发送'}
      ],
      sendStatusArray: [
        {value: 1, label: '新建'},
        {value: 2, label: '已发送'}
      ],
      total: 0,
      orgId: '',
      addPeopleArray: [],
      selectData: [],
      receiver: '',
      form: {
        receiver: [
        ],
        time: '', // 发送时间
        content: '', // 短信内容
        mode: 1, // 发送方式
        status: 1, // 发送状态
        updatedDept: '', // 录入部门
        createdAt: '', // 录入时间
        updatedBy: '', // 录入人
        updatedById: '', // 录入人ID
        updatedDeptId: ''// 录入部门ID
      }
    }
  },
  computed: {
  },
  created() {
    this.getState()
    this.getTreeApiFuc()
  },
  watch: {
  },
  methods: {
    getTreeApiFuc() {
      let param = {
        type: 0
      }
      getTreeApi(param).then(res => {
        if (res.data.code === 0) {
          this.orgId = res.data.data && String(res.data.data.nodes[0].serial)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    getState() {
      this.form.updatedDept = JSON.parse(sessionStorage.user).orgName
      this.form.updatedDeptId = JSON.parse(sessionStorage.user).org
      this.form.updatedBy = JSON.parse(sessionStorage.user).name
      this.form.updatedById = JSON.parse(sessionStorage.user).uid
      this.timer = setInterval(_ => {
        this.form.createdAt = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    },
    // 新建短信
    newCreateSmsManagerApiFuc(param) {
      creatShortMessageApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess(res.data.message)
          this.sendMessageFuc()
          this.$emit('changeMenu', 'list')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    sendMessageFuc() {
      let params = {
        MSG_SMS_MBLPH_NO: String(this.form.receiver[0].phoneNumber), // 手机号
        MSG_SMS_CNTNT_LEN: String(this.form.content.length), // 内容长度
        MSG_SMS_CNTNT: this.form.content, // 短信内容
        MSG_SMS_REALTM_IND: 'XXX', // 实时通知标志
        MSG_SMS_SNDR: String(this.orgId)// 本条短信所属机构，9位一级行行号
      }
      sendMessageApi(params).then(res => {
        console.log(res)
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击添加小图标
    handleIconClick() {
      this.addDialogVisible = true
    },
    addPeople(data) {
      this.addPeopleArray = JSON.parse(JSON.stringify(data))
      let content = []
      data && data.forEach(item => {
        content.push(item.name + '(' + item.mobilePhone + ')')
      })
      this.receiver = content.join(';')
      this.addPeopleArray.forEach(item => {
        this.form.receiver.push(
          {
            orgId: item.org,
            orgName: item.orgName,
            keyPartId: '',
            keyPart: '',
            receiver: item.name,
            receiverId: item.uid,
            phoneNumber: item.mobilePhone

          }
        )
      })
    },
    // 新建
    onSubmit() {
      this.$refs['messageForm'].validate(valid => {
        if (valid) {
          this.form.time = this.form.mode === 1 ? 0 : this.form.time
          this.newCreateSmsManagerApiFuc(this.form)
        }
      })
    },
    dialogVisible() {
      this.addDialogVisible = false
    },
    close() {
      this.$emit('changeMenu', 'list')
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
.message-control-creat-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .directory {
      overflow: hidden;
      .directory-item {
        float: left;
        font-size: 18px;
        margin-right: 3px;
      }
    }
    .breadcrumb {
      float:left;
      margin-top:4px;
    }
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        width: 100%;
        .main-box {
          padding: 10px 20px 10px 0;
          .p-search-from {
            border: 1px solid #ddd;
            background: #F5F5F5;
            padding: 10px 10px 0 0;
            width: 60%;
            margin: 0 auto;
            position: relative;
            .box /deep/.el-input__inner {
              height: 84px;
            }
            .box .add {
              position: absolute;
              top: 30px;
              right: 0;
              cursor: pointer;
              font-size: 18px;
            }
          }
          .p-search-con {
            border: 1px solid #ddd;
            width: 60%;
            margin: 40px auto 0;
            .items {
              background: #F5F5F5;
              text-align: center;
              line-height: 35px;
            }
            .input-info {
              height: 35px;
              line-height: 35px;
              text-align: center;
            }
          }
          .p-search-footer {
            width: 60%;
            margin: 0 auto;
            padding-top: 20px;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 440px');
    }
  }
}
.box /deep/.el-form-item__label {
  text-align: center;
  height: 84px;
  line-height: 84px!important;
}
.box1 /deep/.el-form-item__label {
  text-align: center;
}
</style>
