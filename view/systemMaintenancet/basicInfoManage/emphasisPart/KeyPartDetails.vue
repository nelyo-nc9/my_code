<template>
  <div class="emphasis-part-details">
    <!-- 重点部位--重点部位概览页面 -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>重点部位</el-breadcrumb-item>
            <el-breadcrumb-item>重点部位概览</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="button-box">
        <el-button size="small" :disabled="!tableObj.id" @click="clickPrint">打印</el-button>
        <el-button size="small" :disabled="!tableObj.id" @click="clickModify"  v-if="isBtn('编辑')">编辑</el-button>
        <el-button size="small" :disabled="!tableObj.id" @click="deleteKeyPart"  v-if="isBtn('删除')">删除</el-button>
        <el-button size="small" :disabled="!tableObj.id" @click="clickTransfer"  v-if="isBtn('迁移')">迁移</el-button>
        <el-button size="small" @click="clickRank"  v-if="isBtn('排序')">排序</el-button>
      </div>
      <div class="main"  id="printJS-keyPart-info">
        <div class="main-box">
          <div class="box-title">{{KeyPartDetailsTitle}}信息</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr v-for="index in forTr" :key="index">
                <td class="box-cell-title" v-if="mainTable[(index - 1)*2]">
                  <span>{{mainTable[(index - 1)*2].label}}</span>
                </td>
                <td class="box-cell-input" v-if="mainTable[(index - 1)*2]">
                  {{tableObj[mainTable[(index - 1)*2].prop]}}
                  <!-- <el-input v-model="tableObj[mainTable[(index - 1)*2].prop]" disabled></el-input> -->
                </td>
                <td class="box-cell-title" v-if="mainTable[(index - 1)*2 + 1]">
                  <span>{{mainTable[(index - 1)*2 + 1].label}}</span>
                </td>
                <td class="box-cell-input" v-if="mainTable[(index - 1)*2 + 1]">
                  {{tableObj[mainTable[(index - 1)*2+1].prop]}}
                  <!-- <el-input v-model="tableObj[mainTable[(index - 1)*2+1].prop]" disabled></el-input> -->
                </td>
              </tr>
            </table>
          </div>
          <div class="main-box-footer">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">{{footerTable[0].label}}</td>
                <td class="box-cell-input">
                  {{tableObj[footerTable[0].prop]}}
                  <!-- <el-input v-model="tableObj[footerTable[0].prop]" disabled></el-input> -->
                </td>
                <td class="box-cell-title">{{footerTable[1].label}}</td>
                <td class="box-cell-input">
                  {{tableObj[footerTable[1].prop]}}
                  <!-- <el-input v-model="tableObj[footerTable[1].prop]" disabled></el-input> -->
                </td>
                <td class="box-cell-title">{{footerTable[2].label}}</td>
                <td class="box-cell-input">
                  {{tableObj[footerTable[2].prop]}}
                  <!-- <el-input v-model="tableObj[footerTable[2].prop]" disabled></el-input> -->
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteKeyPartApi } from '@src/http/basicInfoManage/keyPart.api'
import { getOrgKeyPartInfoApi } from '@src/http/basicInfoManage/orgManage.api'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'Edit',
  props: {
    componentTitle: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    nodeData: { // 所属机构信息
      type: Object,
      default: () => {}
    },
    editData: {
      type: Object,
      default: () => {}
    },
    KeyPartDetailsTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mainTable: [],
      footerTable: [],
      forTr: 0,
      tableObj: {}
    }
  },
  watch: {
    'nodeData.id': {
      handler() {
        this.getTable()
      },
      deep: true
    }
  },
  created() {
    this.getTable()
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
  },
  methods: {
    getNearbyKeyPart(val) {
      let ids = []
      ids[0] = val
      let param = {
        ids: ids,
        type: 2
      }
      getOrgKeyPartInfoApi(param).then(res => {
        if (res.data.code === 0) {
          let nearbyKeyPartTypeObj = {
            5: '自助银行',
            6: '自助设备',
            7: '自助银亭'
          }
          let cptObj = JSON.parse(JSON.stringify(this.tableObj))
          cptObj.nearbyKeyPart = {}
          cptObj.nearbyKeyPart.type = res.data.data.keyParts[0].type
          cptObj.nearbyKeyPart.id = res.data.data.keyParts[0].id
          cptObj.nearbyKeyPart.name = res.data.data.keyParts[0].name
          cptObj.nearbyKeyPartTypeName = nearbyKeyPartTypeObj[cptObj.nearbyKeyPart.type]
          cptObj.nearbyKeyPartName = cptObj.nearbyKeyPart.name
          this.tableObj = cptObj
        } else {
          console.log(res, 'res')
        }
      }).catch(err => {
        console.log(err, 'err')
      })
    },
    getTable() {
      let cpColumns = JSON.parse(JSON.stringify(this.columns))
      this.footerTable = cpColumns.slice(-3)
      this.mainTable = cpColumns.slice(0, -3)
      this.forTr = Math.ceil(this.mainTable.length / 2)
      console.log(cpColumns, 'cpColumns')
      let cpEditData = JSON.parse(JSON.stringify(this.editData))
      console.log(cpEditData, 'cpEditData')
      this.tableObj = cpEditData
      if (this.tableObj.nearbyKeyPartId) {
        this.getNearbyKeyPart(this.tableObj.nearbyKeyPartId)
      }
    },
    clickPrint() {
      printJS({
        printable: 'printJS-keyPart-info',
        type: 'html',
        targetStyles: ['*']
      })
    },
    clickModify() {
      if (!this.tableObj.id) {
        return
      }
      this.$emit('changeComponent', 'Edit', this.componentTitle, this.tableObj)
    },
    deleteKeyPart() {
      console.log(this.tableObj, 'this.tableObj55555555555555555')
      if (!this.tableObj.id) {
        return
      }
      let idArr = []
      idArr[0] = this.tableObj.id
      let param = {
        ids: idArr
      }
      deleteKeyPartApi(param).then(res => {
        console.log(res, 'res')
        if (res.data.code === 0) {
          console.log('删除成功')
          this.$messageSuccess('重点部位删除成功！', '成功')
          this.$emit('orgTreeRefresh')
        } else {
          console.log(res, '重点部位删除失败')
          this.$messageError(`重点部位删除失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError('重点部位删除失败，请稍后重试！', '错误')
      })
    },
    clickTransfer() {
      if (!this.tableObj.id) {
        return
      }
      this.$emit('changeComponent', 'TransferDialog', this.componentTitle, this.tableObj)
    },
    clickRank() {
      if (!this.tableObj.id) {
        return
      }
      this.$emit('changeComponent', 'RankDialog', this.componentTitle, this.tableObj)
    }
  }
}
</script>

<style lang="less" scoped>
  .emphasis-part-details {
    width: 100%;
    height: 100%;
    .content {
      padding: 0 10px;
      width: 1000px;
      .el-button {
        width: 80px;
      }
      .top {
        .header {
          margin-bottom: 10px;
        }
      }
      .button-box {
        margin-bottom: 10px;
        .el-button {
          width: 80px;
        }
      }
      .main {
        margin: 10px 0px;
        width: 100%;
        .main-box {
          padding: 30px 20px 40px 20px;
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
                  height: 36px;
                  width: 15%;
                  background: #eee;
                  text-align: center;
                  border: 0.5px solid #ddd;
                }
                .box-cell-input {
                  width: 35%;
                  height: 36px;
                  border: 0.5px solid #ddd;
                  padding: 0 5px;
                  // /deep/ .el-input__inner {
                  //   height: 36px!important;
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
                  height: 36px;
                  width: 10%;
                  background: #eee;
                  text-align: center;
                  border: 0.5px solid #ddd;
                }
                .box-cell-input {
                  width: 23.3%;
                  height: 36px;
                  border: 0.5px solid #ddd;
                  padding: 0 5px;
                  // /deep/ .el-input__inner {
                  //   height: 36px!important;
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
