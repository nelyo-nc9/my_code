<!--
 * @Author: your name
 * @Date: 2020-06-17 11:06:07
 * @LastEditTime: 2020-06-23 09:21:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement\pages\ServerManageCreat.vue
-->
<template>
  <div class="server-manage-creat-box">
    <div class="content" v-if="!isExamine">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">{{isEdit ? '编辑服务器' : '新建服务器'}}</div>
            <div class="p-creat-from">
              <el-form size="mini" label-position="right" label-width="100px" ref="serverForm" :model="form">
                <el-row>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="名称" prop="serverName"
                      :rules="[{ required: true, message: '必填', trigger: 'change' },{ min: 0, max: 128, message: '最多可输入128个字符' }]">
                        <el-input  v-model="form.serverName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="系统" prop="system"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                        <el-input  v-model="form.system" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="类型" prop="serverType"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                        <el-input  v-model="form.serverType" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="IP地址" prop="ipAddr"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                        <el-input  v-model="form.ipAddr" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="端口" prop="port"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                        <el-input  v-model="form.port" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="用户名" prop="username"
                      :rules="[{ required: true, message: '必填', trigger: 'change' },{ min: 0, max: 128, message: '最多可输入128个字符' }]">
                        <el-input  v-model="form.username"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="密码" prop="password"
                      :rules="[{ required: true, message: '必填', trigger: 'change' },{ min: 0, max: 64, message: '最多可输入64个字符' }]">
                        <el-input type="password" v-model="form.password"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="机构" prop="orgName"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                        <el-input  v-model="form.orgName" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="重点部位" prop="keyPart"
                      :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                        <el-input v-model="form.keyPart" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="p-creat-from1" style="margin-top:15px;">
              <el-row>
                <el-col :span=3>
                  <div class="item">
                    录入时间
                  </div>
                </el-col>
                <el-col :span=5>
                  <div disabled class="input-info">{{form.entryTime}}</div>
                </el-col>
                <el-col :span=3>
                  <div class="item">
                    录入机构
                  </div>
                </el-col>
                <el-col :span=5>
                  <div disabled class="input-info">{{form.entryOrganization}}</div>
                </el-col>
                <el-col :span=3>
                  <div class="item">
                    录入人
                  </div>
                </el-col>
                <el-col :span=5>
                  <div disabled class="input-info">{{form.entryName}}</div>
                </el-col>
              </el-row>
            </div>
            <div class="p-creat-footer">
              <el-button  @click="onSubmit" :loading="creatLoaing" size="small">保存</el-button>
              <el-button  size="small"  @click="reset">重置</el-button>
              <el-button  size="small"  @click="cancel">关闭</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div style="margin-bottom:5px;font-size:16px;">已注册服务器列表</div>
        <div class="list-box-table">
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @cell-dblclick="dblclickTable" ref="Table" height="100%" max-height="360" style="width: 100%">
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <ExamineServer :info="form" @creatServer="creatServer" @editServer="editServer" v-if="isExamine"></ExamineServer>
  </div>
</template>

<script>
import Bus from './Bus'
import {
  getTreeApi,
  creatServerApi,
  getKeyPartByTypeApi,
  getAlreadyRegisteredServerListApi,
  updateServerInfoApi } from '@src/http/systemOperationManage/serverManagement.api'
import ExamineServer from './ExamineServer.vue'
export default {
  components: {
    ExamineServer
  },
  props: {
    defaultMenu: {
      type: String
    }
  },
  name: 'ServerManageCreat',
  data() {
    return {
      timer: '',
      isExamine: false, // 查看新建的服务器
      creatLoaing: false,
      resizable: false,
      columns: [
        { prop: 'system', sortable: true, label: '系统', width: '' },
        { prop: 'serverType', sortable: true, label: '类型', width: '' },
        { prop: 'status', sortable: true, label: '状态', width: '' },
        { prop: 'ipAddr', sortable: true, label: 'IP地址', width: '' },
        { prop: 'port', sortable: true, label: '端口', width: '' },
        { prop: 'userName', sortable: true, label: '用户名', width: '' }
        // { prop: 'password', sortable: true, label: '密码', width: '' }
      ],
      tableData: [
      ],
      selectData: [],
      obj: {},
      form: {
        id: '',
        system: '',
        serverType: '',
        KeyPartId: '3',
        keyPart: '',
        orgId: '', // ceshi
        serverName: '',
        username: '',
        port: '',
        onlineStatus: 1,
        password: '',
        orgName: '',
        ipAddr: '',
        hostIp: window.location.hostname, // 测试用
        entryName: '',
        entryTime: '',
        entryOrganization: ''
      },
      creatForm: {},
      isEdit: false
    }
  },
  computed: {
  },
  mounted() {
  },
  created() {
    this.getState()
    this.getAlreadyRegisteredServerListApiFuc()
    Bus.$on('edit', (data, flag) => {
      this.form = JSON.parse(JSON.stringify(data[0]))
      this.isEdit = flag
      this.getState()
    })
    Bus.$on('creat', flag => {
      this.form = {}
      this.isEdit = false
      this.getTreeApiFuc()
      this.getState()
    })
  },
  watch: {
  },
  methods: {
    select(val) {
      console.log(val)
    },
    creatServer() {
      this.isExamine = false
      this.getState()
    },
    editServer(data) {
      this.form = data
      this.isExamine = false
      this.isEdit = true
      this.getState()
    },
    getState() {
      this.form.entryOrganization = JSON.parse(sessionStorage.user).orgName
      this.form.entryName = JSON.parse(sessionStorage.user).name
      this.timer = setInterval(_ => {
        this.form.entryTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    },
    dataFormat() {
      this.creatForm = JSON.parse(JSON.stringify(this.form))
      if (this.creatForm.system === 'Linux') {
        this.creatForm.system = 1
      } else if (this.creatForm.system === 'Windows') {
        this.creatForm.system = 2
      }
      if (this.creatForm.serverType === '管理服务器') {
        this.creatForm.serverType = 1
      } else if (this.creatForm.serverType === 'DA接入服务器') {
        this.creatForm.serverType = 2
      } else if (this.creatForm.serverType === '存储服务器') {
        this.creatForm.serverType = 3
      } else if (this.creatForm.serverType === 'PYDA接入服务器') {
        this.creatForm.serverType = 4
      }
      if (this.creatForm.status === '在线') {
        this.creatForm.onlineStatus = 1
      } else if (this.creatForm.status === '离线') {
        this.creatForm.onlineStatus = 2
      }
    },
    // 获取机构和重点部位
    getTreeApiFuc() {
      let param = {
        type: 2
      }
      getTreeApi(param).then(res => {
        if (res.data.code === 0) {
          this.form.orgId = res.data.data.nodes[0].id
          this.$set(this.form, 'orgName', res.data.data.nodes[0].name)
          this.$set(this.form, 'entryOrganization', res.data.data.nodes[0].name)
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
            this.form.KeyPartId = res.data.data.ketPartList[0].keyPart.id
            this.$set(this.form, 'keyPart', res.data.data.ketPartList[0].keyPart.name)
          }
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    dblclickTable(row, col, cell, event) {
      if (this.isEdit) {
        return
      }
      this.form = {
        ...this.form,
        ...JSON.parse(JSON.stringify(row)),
        username: row.userName
      }
    },
    // 获取已注册服务器列表
    getAlreadyRegisteredServerListApiFuc() {
      let param = {
        hostIp: window.location.hostname
        // hostIp: '192.168.110.229'
      }
      getAlreadyRegisteredServerListApi(param).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data || []
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存
    onSubmit() {
      this.$refs['serverForm'].validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            this.creatLoaing = true
            this.dataFormat()
            let param = {
              serverName: this.creatForm.serverName,
              system: this.creatForm.system,
              serverType: this.creatForm.serverType,
              ipAddr: this.creatForm.ipAddr,
              port: this.creatForm.port,
              username: this.creatForm.username,
              password: this.creatForm.password,
              orgId: String(this.creatForm.orgId),
              KeyPartId: String(this.creatForm.KeyPartId),
              onlineStatus: this.creatForm.onlineStatus,
              hostIp: this.creatForm.hostIp
              // hostIp: '192.168.110.229'
            }
            creatServerApi(param).then(res => {
              if (res.data.code === 0) {
                this.creatLoaing = false
                this.isExamine = true
                this.form.id = res.data.data
                this.$messageSuccess(res.data.message)
              } else {
                this.creatLoaing = false
                this.$messageError(res.data.message)
              }
            })
              .catch(err => {
                this.creatLoaing = false
                this.$messageError('创建失败')
                console.log(err)
              })
          } else {
            this.dataFormat()
            let param = {
              id: this.creatForm.id,
              serverName: this.creatForm.serverName,
              ipAddr: this.creatForm.ipAddr,
              port: this.creatForm.port,
              username: this.creatForm.username,
              password: this.creatForm.password,
              onlineStatus: this.creatForm.onlineStatus,
              serverType: this.creatForm.serverType,
              system: this.creatForm.system
            }
            updateServerInfoApi(param).then(res => {
              if (res.data.code === 0) {
                this.$messageSuccess('修改成功')
              } else {
                this.$messageError('修改失败')
              }
            })
              .catch(err => {
                console.log(err + '修改失败')
              })
            this.$emit('changeMenu', 'list')
          }
        }
      })
    },
    // 重置
    reset() {
      this.form.serverName = ''
      this.form.username = ''
      this.form.password = ''
    },
    // 关闭
    cancel() {
      this.$confirm('确认退出当前操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('changeMenu', 'list')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
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
.server-manage-creat-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        width: 100%;
        .main-box {
          padding: 0 20px 20px 0;
          .box-title {
            width: 70%;
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 18px;
          }
          .p-creat-from {
            border: 1px solid #ddd;
            padding: 10px 10px 10px 10px;
            margin-left: 70px;
            background: #F5F5F5;
            width: 60%;
            .details {
              height: 40px;
              line-height: 40px;
              text-align: center;
            }
          }
          .p-creat-from1 {
            border: 1px solid #ddd;
            margin-left: 70px;
            width: 60%;
            .item {
              height: 35px;
              line-height: 35px;
              margin-right: 3px;
              text-align: center;
              background: #F5F5F5;
            }
            .input-info {
              height: 35px;
              line-height: 35px;
              text-align: center;
            }
          }
          .p-creat-footer {
            width: 70%;
            padding-top: 20px;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 435px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: 100%;
      }
    }
  }
}
</style>
