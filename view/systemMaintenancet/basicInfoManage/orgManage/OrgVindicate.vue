<template>
  <div class="org-vindicate-box">
    <!-- 机构管理--机构维护页面 -->
    <div class="content">
      <div class="top-header">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>基础信息</el-breadcrumb-item>
          <el-breadcrumb-item>机构管理</el-breadcrumb-item>
          <el-breadcrumb-item>机构维护</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 顶部操作栏 -->
      <div class="top-button">
        <el-button size="small" style="width: 100px" icon="el-icon-refresh" @click="clickSync()" v-if="isBtn('机构同步')">机构同步</el-button>
        <el-button size="small" icon="el-icon-printer" :disabled="!id" @click="clickPrint()">打印</el-button>
        <el-button size="small" :disabled="!id" @click="clickCancelSync()" v-if="isBtn('取消同步')">取消同步</el-button>
        <el-button size="small" icon="el-icon-plus" @click="clickCreate()" v-if="isBtn('新建')">新建</el-button>
        <el-button size="small" icon="el-icon-edit-outline" :disabled="!id || isCcbOrg" @click="clickModify()" v-if="isBtn('编辑')">编辑</el-button>
        <el-button size="small" icon="el-icon-delete" :disabled="!id || isCcbOrg" @click="clickDelete()" v-if="isBtn('删除')">删除</el-button>
        <el-button size="small" icon="icon iconfont-ccb ccbqianyi el-icon-" :disabled="!id || isCcbOrg" @click="clickTransfer()" v-if="isBtn('迁移')">迁移</el-button>
        <el-button size="small" @click="clickRank()" v-if="isBtn('排序')">排序</el-button>
      </div>
      <div class="main">
        <!-- 机构信息 -->
        <div class="main-box">
          <div class="box-title">机构信息</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">机构编号</td>
                <td class="box-cell-input"><el-input v-model="serial" readonly></el-input></td>
                <td class="box-cell-title">机构中文简称</td>
                <td class="box-cell-input"><el-input v-model="name" readonly></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">机构类别</td>
                <td class="box-cell-input"><el-input v-model="kindName" readonly></el-input></td>
                <td class="box-cell-title">固定电话</td>
                <td class="box-cell-input"><el-input v-model="telephone" readonly></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">移动电话</td>
                <td class="box-cell-input"><el-input v-model="mobile" readonly></el-input></td>
                <td class="box-cell-title">电子邮件</td>
                <td class="box-cell-input"><el-input v-model="email" readonly></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">机构地址</td>
                <td class="box-cell-input" colspan="3"><el-input v-model="address" readonly></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">机构状态</td>
                <td class="box-cell-input"><el-input v-model="status" readonly></el-input></td>
                <td class="box-cell-title">开始营业时间</td>
                <td class="box-cell-input"><el-input v-model="businessHours" readonly></el-input></td>
              </tr>
               <tr>
                <td class="box-cell-title">开业日期</td>
                <td class="box-cell-input"><el-input v-model="startBusiness" readonly></el-input></td>
                <td class="box-cell-title">关闭日期</td>
                <td class="box-cell-input"><el-input v-model="closeBusiness" readonly></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">机构负责人名称</td>
                <td class="box-cell-input"><el-input v-model="functionary" readonly></el-input></td>
                <td class="box-cell-title">上级机构名称</td>
                <td class="box-cell-input"><el-input v-model="parentName" readonly></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">上级机构编码</td>
                <td class="box-cell-input"><el-input v-model="parentSerial" readonly></el-input></td>
                <td class="box-cell-title"></td>
                <td class="box-cell-input"></td>
              </tr>
            </table>
          </div>
          <div class="main-box-footer">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">录入时间</td>
                <td class="box-cell-input"><el-input v-model="updatedAt" readonly></el-input></td>
                <td class="box-cell-title">录入机构</td>
                <td class="box-cell-input"><el-input v-model="updatedDept" readonly></el-input></td>
                <td class="box-cell-title">录入人</td>
                <td class="box-cell-input"><el-input v-model="updatedBy" readonly></el-input></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orgSyncApi, orgDeleteApi } from '@src/http/basicInfoManage/orgManage.api'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgVindicate',
  props: {
    nodeData: {
      type: Object,
      default: () => {}
    },
    parentData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      serial: '',
      name: '',
      kindName: '',
      telephone: '',
      mobile: '',
      email: '',
      address: '',
      status: '',
      businessHours: '',
      startBusiness: '',
      closeBusiness: '',
      functionary: '',
      parentName: '',
      parentSerial: '',
      id: '',
      updatedAt: '',
      updatedDept: '',
      updatedBy: '',
      isCcbOrg: true // 是否是建行机构，建行机构不能删除，编辑，迁移
    }
  },
  created() {
    this.getTableList()
  },
  watch: {
    'nodeData.id': {
      handler() {
        this.getTableList()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
  },
  methods: {
    clickCreate() {
      this.$emit('changeComponent', 'OrgCreateModify', '新建机构')
    },
    clickCancelSync() { // 取消同步
      if (!this.serial) { return }
      let idArr = []
      idArr[0] = this.serial
      let param = {
        oids: idArr,
        type: 2
      }
      let sName = '取消同步'
      orgSyncApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess(`${sName}成功！`, '成功')
          this.$emit('orgTreeRefresh')
          this.getTableList()
        } else {
          console.log(res, `${sName}失败`)
          this.$messageError(`${sName}失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError(`${sName}失败，请稍后重试！`, '错误')
      })
    },
    clickModify() {
      let cpNode = JSON.parse(JSON.stringify(this.nodeData))
      let cpParent = JSON.parse(JSON.stringify(this.parentData))
      let params = {
        ...cpNode,
        pid: cpParent
      }
      this.$emit('changeComponent', 'OrgCreateModify', '编辑机构', params)
    },
    clickDelete() {
      if (!this.id) { return }
      let idArr = []
      idArr[0] = this.id
      let param = {
        ids: idArr
      }
      orgDeleteApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          console.log('删除成功')
          this.$messageSuccess('机构删除成功！', '成功')
          this.$emit('orgTreeRefresh')
          this.getTableList()
        } else {
          console.log(res, '机构删除失败')
          this.$messageError(`机构删除失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError('机构删除失败，请稍后重试！', '错误')
      })
    },
    clickTransfer() {
      let cpNode = JSON.parse(JSON.stringify(this.nodeData))
      let cpParent = JSON.parse(JSON.stringify(this.parentData))
      let params = {
        ...cpNode,
        pid: cpParent
      }
      this.$emit('changeComponent', 'TransferDialog', '机构迁移', params)
    },
    clickRank() {
      this.$emit('changeComponent', 'RankDialog', '机构排序')
    },
    clickPrint() {
      this.$emit('changeComponent', 'PrintDialog', '机构打印')
    },
    clickSync() {
      this.$emit('changeComponent', 'SyncOrg', '机构同步')
    },
    getTableList() { // 请求表格数据方法
      let cpNode = JSON.parse(JSON.stringify(this.nodeData))
      let cpParent = JSON.parse(JSON.stringify(this.parentData))
      let statusArr = ['', '正常营业', '撤销', '合并', '临时停业']
      let kindArr = ['', '总行', '一级分行', '二级分行', '直管行', '县级行', '园区']
      this.serial = cpNode.serial
      this.name = cpNode.name
      this.kindName = kindArr[cpNode.kind] || ''
      this.telephone = cpNode.telephone
      this.mobile = cpNode.mobile
      this.email = cpNode.email
      this.address = cpNode.address
      this.status = statusArr[cpNode.status]
      this.businessHours = cpNode.businessHours
      this.startBusiness = cpNode.startBusiness
      this.closeBusiness = cpNode.closeBusiness
      this.functionary = cpNode.functionary
      this.parentName = cpParent.name || ''
      this.parentSerial = cpParent.serial || ''
      this.id = cpNode.id
      this.updatedAt = cpNode.updatedAt
      this.updatedDept = cpNode.updatedDept
      this.updatedBy = cpNode.updatedBy
      this.isCcbOrg = cpNode.type ? (cpNode.type === 0) : true
      console.log(this.nodeData, 'this.nodeData999999999999999999999')
    },
    reset() { // 重置表单
      this.serial = ''
      this.name = ''
      this.kindName = ''
      this.telephone = ''
      this.mobile = ''
      this.email = ''
      this.address = ''
      this.status = ''
      this.businessHours = ''
      this.startBusiness = ''
      this.closeBusiness = ''
      this.functionary = ''
      this.parentName = ''
      this.parentSerial = ''
      this.id = ''
      this.updatedAt = ''
      this.updatedDept = ''
      this.updatedBy = ''
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-button--small, .el-button--small.is-round{
  padding:10px;
}
  .org-vindicate-box {
    width: 100%;
    height: 100%;
    .content {
      padding: 0 10px;
      width: 800px;
      .el-button {
        // width: 80px;
      }
      .top-header {
        margin-bottom: 10px;
      }
      .main {
        margin: 10px 0;
        width: 100%;
        height: 500px;
        border: 1px solid #ddd;
        .main-box {
          padding: 20px;
          .box-title {
            height: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 18px;
          }
          .main-box-center {
            border: 1px solid #ddd;
            padding: 1px;
            width: 100%;
            table {
              width: 100%;
              height: 100%;
              tr {
                .box-cell-title {
                  // height: 40px;
                  width: 15%;
                  background: #eee;
                  text-align: center;
                  border: 0.5px solid #ddd;
                }
                .box-cell-input {
                  width: 35%;
                  // height: 40px;
                  /deep/ .el-input__inner {
                    height: 36px!important;
                  }
                  // input {
                  //   border: 0.5px solid #ddd;
                  //   width: 100%;
                  //   height: 100%;
                  //   line-height: 40p;
                  //   padding: 0 5px;
                  // }
                }
              }
            }
          }
          .main-box-footer {
            padding: 1px;
            margin-top: 10px;
            border: 1px solid #ddd;
            table {
              width: 100%;
              height: 100%;
              tr {
                .box-cell-title {
                  // height: 40px;
                  width: 10%;
                  background: #eee;
                  text-align: center;
                  border: 0.5px solid #ddd;
                }
                .box-cell-input {
                  width: 23.3%;
                  // height: 40px;
                  /deep/ .el-input__inner {
                    height: 36px!important;
                  }
                  // input {
                  //   border: 0.5px solid #ddd;
                  //   width: 100%;
                  //   height: 100%;
                  //   line-height: 40p;
                  //   padding: 0 5px;
                  // }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
