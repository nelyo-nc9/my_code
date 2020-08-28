<template>
  <div class="emphasis-part-create">
    <!-- 重点部位--详情页面 -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>重点部位</el-breadcrumb-item>
            <el-breadcrumb-item>{{componentTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <div class="main-box">
          <div class="box-title">{{KeyPartDetailsTitle}}详情信息</div>
          <div class="main-box-center">
              <!-- <table cellspacing="0" cellpadding="0">
                <tr v-for='index in forTr' :key='index'>
                    <td class="box-cell-title" v-if="mainTable[(index - 1)*2]">
                      <span>{{mainTable[(index - 1)*2].label}}</span>
                    </td>
                    <td class="box-cell-input" v-if="mainTable[(index - 1)*2]">
                      {{tableObj[mainTable[(index - 1)*2].prop]}}
                    </td>
                    <td class="box-cell-title" v-if="mainTable[(index - 1)*2 + 1]">
                      <span>{{mainTable[(index - 1)*2 + 1].label}}</span>
                    </td>
                    <td class="box-cell-input" v-if="mainTable[(index - 1)*2 + 1]">
                      {{tableObj[mainTable[(index - 1)*2+1].prop]}}
                    </td>
                </tr>
            </table> -->
              <el-form class="main-form"   size="mini" :inline="true" :model="tableObj" label-position="right" label-width="145px">
              <div style="display: inline-block" v-for="(item, ind) in mainTable" :key="ind">
                <el-form-item :label="item.label" :prop="item.prop" :required="item.required">
                  <el-input v-model="tableObj['statusName']" readonly v-if="item.prop === 'statusName'"></el-input>
                  <el-input v-model="tableObj['oidName']" readonly v-else-if="item.prop === 'oidName'"></el-input>
                  <el-input v-model="tableObj['nearbyKeyPartTypeName']" readonly v-else-if="item.prop === 'nearbyKeyPartTypeName'"></el-input>
                  <el-input v-model="tableObj['nearbyKeyPartName']" readonly v-else-if="item.prop === 'nearbyKeyPartName'"></el-input>

                  <el-date-picker v-model="tableObj[item.prop]" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" style="width: 100%" v-else-if="item.prop === 'statusTime'"></el-date-picker>
                  <el-input class="form-input" readonly v-model="tableObj[item.prop]" v-else></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="main-box-footer">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">{{footerTable[0].label}}</td>
                <td class="box-cell-input">
                  <el-input v-model="tableObj[footerTable[0].prop]" disabled></el-input>
                </td>
                <td class="box-cell-title">{{footerTable[1].label}}</td>
                <td class="box-cell-input">
                  <el-input v-model="tableObj[footerTable[1].prop]" disabled></el-input>
                </td>
                <td class="box-cell-title">{{footerTable[2].label}}</td>
                <td class="box-cell-input">
                  <el-input v-model="tableObj[footerTable[2].prop]" disabled></el-input>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button size="small" @click='callBack'>返回</el-button>
        <!-- <el-button size="small" >重置</el-button>
        <el-button size="small" >取消</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { editKeyPartApi, getKeyPartListApi } from '@src/http/basicInfoManage/keyPart.api'
import { read } from '@src/storage/index.js'
import { dataRule } from '../common/validateRule'

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
    editData: {
      type: Object,
      default: () => {}
    },
    keyPartType: {
      type: Number,
      default: 1
    },
    KeyPartDetailsTitle: {
      type: String,
      default: ''
    },
     statusList:{
      type:Array,
      default:()=>{
         return []
      }
    }
  },
  data() {

    return {
      // partStatus: 1, // 部位状态
      readonly: true,
      statusList1: [
        // {label: '正常', value: 1},
        // {label: '撤销', value: 2},
        // {label: '合并', value: 3},
        // {label: '临时停业', value: 4}
      ],
      // selfVal: '', // 附近自助银行/自助设备
      selfAllList: [], // 获取所有附近自助银行/自助设备、自助银亭的列表
      // selfTypeVal: '', // 附近自助银行/自助设备类型
      selfTypeList: [
        {label: '无自助', value: ''},
        {label: '自助设备', value: 6},
        {label: '自助银亭', value: 7},
        {label: '自助银行', value: 5}
      ],
      mainTable: [],
      footerTable: [],
      forTr: 0,
      tableObj: {},
      orgId: '', // 所属机构id
      statusTimeVal: '', // 撤销、合并、临时停业时间
     
    }
  },
  watch: {
    componentTitle() {
      this.getTable()
    },
    KeyPartDetailsTitle(val){
      console.log(val)
    },
    // partStatus() {
    //   this.changeStatusName(this.partStatus)
    // }
    statusList:{
      handler(newV){
        this.statusList1=newV
      },
      deep:true
    }
  },
  created() {
    this.statusList1 = this.statusList
    this.getTable()
  },
  methods: {
    callBack(){
      this.$emit('changeComponent', 'List', this.componentTitle)
    },
    getTable() {
      let cpColumns = JSON.parse(JSON.stringify(this.columns))
      let userInfo = JSON.parse(read('user')) || {}
      this.footerTable = cpColumns.slice(-3)
      this.mainTable = cpColumns.slice(0, -3)
      this.forTr = Math.ceil(this.mainTable.length / 2)
      let cpEditData = JSON.parse(JSON.stringify(this.editData))
      console.log(this.editData,'cp')
      console.log(cpEditData, 'cpEditData')
      this.tableObj = cpEditData
      this.orgId = cpEditData.orgId
      let pStatus = cpEditData.status || cpEditData.keyPart.status
      this.$set(this.tableObj, 'statusName',cpEditData.statusName)
      let sTypeVal = cpEditData.nearbyKeyPart ? cpEditData.nearbyKeyPart.type : ''
      this.$set(this.tableObj, 'nearbyKeyPartTypeName', sTypeVal)
      let sfVal = cpEditData.nearbyKeyPart ? cpEditData.nearbyKeyPart.id : ''
      this.$set(this.tableObj, 'nearbyKeyPartName', sfVal)
      this.tableObj['updatedBy'] = userInfo.name || '' // 自动获取录入人，录入机构，录入时间
      this.tableObj['updatedDept'] = userInfo.orgName || ''
      this.tableObj['updatedAt'] = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
   
  }
}
</script>

<style lang="less" scoped>
  .emphasis-part-create {
    width: 100%;
    height: 100%;
    overflow: auto;
    .content {
      padding: 0 10px;
      width: 1090px;
      .el-button {
        width: 80px;
      }
      .top {
        .header {
          margin-bottom: 10px;
        }
      }
      .main {
        margin: 10px 0;
        width: 100%;
        .main-box {
          padding: 10px 20px;
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
                  border:1px solid #eee;
                  /deep/ .el-input__inner {
                    height: 36px!important;
                  }
                  .input-red {
                    /deep/ .el-input__inner {
                      border-color: red;
                    }
                  }
                }
              }
            }
            .main-form {
              padding: 18px 0px 0px 0px;
              background:rgba(245,245,245,1);
              /deep/.el-form-item__label {
                font-size:12px;
                line-height: 35px;
              }
              /deep/.el-input__inner {
                width: 356px;
                height: 35px;
                line-height: 35px;
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
                  /deep/ .el-input__inner {
                    height: 36px!important;
                  }
                }
              }
            }
          }
        }
      }
      .footer {
        text-align: center;
      }
    }
  }
</style>
