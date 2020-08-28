<!--
 * @Author: your name
 * @Date: 2020-08-11 14:44:10
 * @LastEditTime: 2020-08-11 17:03:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement\pages\ExamineServer.vue
-->
<template>
  <div class="examine-server-box">
    <div class="button">
      <el-button size="small"  icon="el-icon-plus" @click="creat">新建</el-button>
      <el-button size="small"  icon="el-icon-edit" @click="edit">编辑</el-button>
      <el-button size="small"  icon="el-icon-printer" v-print="'#contentinfo'">打印</el-button>
    </div>
    <div id="contentinfo">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">查看</div>
            <div class="p-creat-from">
              <el-form size="mini" label-position="right" label-width="100px" ref="serverForm" :model="form">
                <el-row>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="名称" prop="serverName">
                        <el-input  v-model="info.serverName" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="系统" prop="system">
                        <el-input  v-model="info.system" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="类型" prop="serverType">
                        <el-input  v-model="info.serverType"  readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="IP地址" prop="ipAddr">
                        <el-input  v-model="info.ipAddr"  readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="端口" prop="port">
                        <el-input  v-model="info.port" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="用户名" prop="username">
                        <el-input  v-model="info.username" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="info.password" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="机构" prop="orgName">
                        <el-input  v-model="info.orgName" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="重点部位" prop="keyPart">
                        <el-input v-model="info.keyPart" readonly></el-input>
                      </el-form-item>
                    </el-col>
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
                  <el-input v-model="info.entryTime" readonly></el-input>
                </el-col>
                <el-col :span=3>
                  <div class="item">
                    录入机构
                  </div>
                </el-col>
                <el-col :span=5>
                  <el-input v-model="info.entryOrganization" readonly></el-input>
                </el-col>
                <el-col :span=3>
                  <div class="item">
                    录入人
                  </div>
                </el-col>
                <el-col :span=5>
                  <el-input v-model="info.entryName" readonly></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  name: 'ExamineServer',
  data() {
    return {
      form: {
        system: '',
        serverType: '',
        keyPart: '',
        serverName: '',
        username: '',
        port: '',
        password: '',
        orgName: '',
        ipAddr: '',
        entryName: '',
        entryTime: '',
        entryOrganization: ''
      }
    }
  },
  computed: {
  },
  mounted() {
  },
  created() {
  },
  watch: {
  },
  methods: {
    creat() {
      this.$emit('creatServer')
    },
    edit() {
      this.$emit('editServer', this.info)
    }
  }
}
</script>

<style lang="less" scoped>
.examine-server-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction:column;
  .button {
    display: flex;
  }
  #contentinfo {
    width: 100%;
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        width: 100%;
        .main-box {
          padding: 0 20px 0 50px;
          .box-title {
            width: 60%;
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 18px;
          }
          .p-creat-from {
            border: 1px solid #ddd;
            padding: 10px 10px 10px 10px;
            width: 60%;
            .item {
              height: 40px;
              line-height: 40px;
              margin-right: 3px;
              text-align: center;
              background: #f2f2f2;
            }
            .details {
              height: 40px;
              line-height: 40px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
