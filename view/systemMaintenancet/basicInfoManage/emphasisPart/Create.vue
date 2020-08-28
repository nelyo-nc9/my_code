<template>
  <div class="emphasis-part-create">
    <!-- 重点部位--新建页面 -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>重点部位</el-breadcrumb-item>
            <el-breadcrumb-item>{{componentTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <!-- 机构信息 -->
        <div class="main-box">
          <div class="box-title">{{componentTitle}}信息</div>
          <div class="main-box-center">
            <!-- <table cellspacing="0" cellpadding="0">
              <tr v-for="index in forTr" :key="index">
                <td class="box-cell-title" v-if="mainTable[(index - 1)*2]">
                  <span>{{mainTable[(index - 1)*2].label}}</span>
                  <span v-if="index===1 || (mainTable[(index - 1)*2].label === '所属机构') || (mainTable[(index - 1)*2].label === '部位状态') || (mainTable[(index - 1)*2].label === '部位代码')" style="color: red">  *</span>
                </td>
                <td class="box-cell-input" v-if="mainTable[(index - 1)*2]">
                  <el-select v-model="partStatus" placeholder="请选择" style="width: 100%" v-if="mainTable[(index - 1)*2].label === '部位状态'">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input v-model="nodeData.name" disabled v-else-if="mainTable[(index - 1)*2].label === '所属机构'"></el-input>
                  <el-select v-model="selfTypeVal" :key="mainTable[(index - 1)*2].label" @change="changeSelfTypeVal" placeholder="请选择" style="width: 100%" v-else-if="mainTable[(index - 1)*2].label === '附近自助银行/自助设备'">
                    <el-option
                      v-for="item in selfTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="selfVal" placeholder="请选择" style="width: 100%" v-else-if="mainTable[(index - 1)*2].prop === 'nearbyKeyPartName'">
                    <el-option
                      v-for="item in selfAllList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-date-picker v-model="statusTimeVal" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" style="width: 100%" v-else-if="mainTable[(index - 1)*2].prop === 'statusTime'"></el-date-picker>
                  <el-input :class="{'input-red': mainTable[(index - 1)*2].ruleStauts}" v-model="tableObj[mainTable[(index - 1) * 2].prop]" @blur="changeInput((index - 1)*2, mainTable[(index - 1)*2].prop)" v-else></el-input>
                </td>
                <td class="box-cell-title" v-if="mainTable[(index - 1)*2 + 1]">
                  <span>{{mainTable[(index - 1)*2 + 1].label}}</span>
                  <span v-if="(mainTable[(index - 1)*2+1].label === '所属机构') || (mainTable[(index - 1)*2+1].label === '部位状态') || (mainTable[(index - 1)*2+1].label === '部位代码')" style="color: red">  *</span>
                </td>
                <td class="box-cell-input" v-if="mainTable[(index - 1)*2 + 1]">
                  <el-select v-model="partStatus" placeholder="请选择" style="width: 100%" v-if="mainTable[(index - 1)*2 + 1].label === '部位状态'">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input v-model="nodeData.name" disabled v-else-if="mainTable[(index - 1)*2 + 1].label === '所属机构'"></el-input>
                  <el-select v-model="selfTypeVal" :key="mainTable[(index - 1)*2 + 1].label" @change="changeSelfTypeVal" placeholder="请选择" style="width: 100%" v-else-if="mainTable[(index - 1)*2 + 1].label === '附近自助银行/自助设备'">
                    <el-option
                      v-for="item in selfTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="selfVal" placeholder="请选择" style="width: 100%" v-else-if="mainTable[(index - 1)*2 + 1].prop === 'nearbyKeyPartName'">
                    <el-option
                      v-for="item in selfAllList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-date-picker v-model="statusTimeVal" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" style="width: 100%" v-else-if="mainTable[(index - 1)*2+1].prop === 'statusTime'"></el-date-picker>
                  <el-input :class="{'input-red': mainTable[(index - 1)*2+1].ruleStauts}" v-model="tableObj[mainTable[(index - 1)*2+1].prop]" @blur="changeInput((index - 1)*2+1, mainTable[(index - 1)*2+1].prop)" v-else></el-input>
                </td>
              </tr>
            </table> -->
            <el-form class="main-form" :rules="rules" ref="mainForm1" size="mini" :inline="true" :model="tableObj" label-position="right" label-width="145px">
              <div style="display: inline-block" v-for="(item, ind) in mainTable" :key="ind">
                <el-form-item :label="item.label" :prop="item.prop" :required="item.required">
                  <el-select v-model="tableObj['statusName']" @change="changeStatusName" placeholder="请选择" style="width: 100%" v-if="item.prop === 'statusName'">
                    <el-option
                      v-for="item in statusList1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input v-model="tableObj['oidName']" disabled v-else-if="item.prop === 'oidName'"></el-input>
                  <el-select v-model="tableObj['nearbyKeyPartTypeName']" @change="changeSelfTypeVal" placeholder="请选择" style="width: 100%" v-else-if="item.prop === 'nearbyKeyPartTypeName'">
                    <el-option
                      v-for="item in selfTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="tableObj['nearbyKeyPartName']" placeholder="请选择" style="width: 100%" v-else-if="item.prop === 'nearbyKeyPartName'">
                    <el-option
                      v-for="item in selfAllList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-date-picker v-model="tableObj[item.prop]" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" style="width: 100%" v-else-if="item.prop === 'statusTime'"></el-date-picker>
                  <el-input class="form-input" v-model="tableObj[item.prop]" v-else></el-input>
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
        <el-button size="small" @click="createKeypart">保存</el-button>
        <el-button size="small" @click="reset">重置</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addKeyPartApi, getKeyPartListApi } from '@src/http/basicInfoManage/keyPart.api'
import { read } from '@src/storage/index.js'
import { dataRule } from '../common/validateRule'

export default {
  name: 'Create',
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
    keyPartType: {
      type: Number,
      default: 1
    },
    statusList:{
      type:Array,
      default:()=>{
         return []
      }
    }
  },
  data() {
    var telephoneRul = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('电话不能为空'))
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, '')
        // let len = 0
        // for (let i = 0; i < value.length; i++) {
        //   const code = Number(value[i].charCodeAt(0))
        //   if (code > 127) {
        //     len += 2
        //   } else {
        //     len++
        //   }
        // }
        if (value.length > 64) {
          return callback(new Error('不能超过64位'))
        }
        let test = /^[\d\-]+$/.test(value)
        if (test) {
          return callback()
        } else {
          callback(new Error('请输入数字或-'))
        }
      }
    }
    var serialRul = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('编号不能为空'))
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, '')
        // let len = 0
        // for (let i = 0; i < value.length; i++) {
        //   const code = Number(value[i].charCodeAt(0))
        //   if (code > 127) {
        //     len += 2
        //   } else {
        //     len++
        //   }
        // }
        if (value.length > 64) {
          return callback(new Error('不能超过64位'))
        }
        let test = /^[\d]+$/.test(value)
        if (test) {
          return callback()
        } else {
          return callback(new Error('请输入数字'))
        }
      }
    }
    return {
      // partStatus: 1, // 部位状态
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
      // forTr: 0,
      tableObj: {},
      // statusTimeVal: '', // 撤销、合并、临时停业时间
      rules: { // 校验规则
        name: [
          { required: true, message: '名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        oidName: [ { required: true, message: '所属机构不能为空' } ],
        telephone: [
          { validator: telephoneRul, trigger: ['blur', 'change'] }
        ],
        serial: [
          { validator: serialRul, trigger: ['blur', 'change'] }
        ],
        statusName: [
          { required: true, message: '部位状态不能为空', trigger: ['blur', 'change'] }
        ],
        principal1: [
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        principalPhone1: [
          { min: 1, max: 128, message: '长度在 1 到 128 个字符间', trigger: 'blur' }
        ],
        principal2: [
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        principalPhone2: [
          { min: 1, max: 128, message: '长度在 1 到 128 个字符间', trigger: 'blur' }
        ],
        principal3: [
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        principalPhone3: [
          { min: 1, max: 128, message: '长度在 1 到 128 个字符间', trigger: 'blur' }
        ],
        principal4: [
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        principalPhone4: [
          { min: 1, max: 128, message: '长度在 1 到 128 个字符间', trigger: 'blur' }
        ],
        principal5: [
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        principalPhone5: [
          { min: 1, max: 128, message: '长度在 1 到 128 个字符间', trigger: 'blur' }
        ],
        policeStation: [
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        policeTelephone: [
          { min: 1, max: 128, message: '长度在 1 到 128 个字符间', trigger: 'blur' }
        ],
        police: [
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        policeMobilePhone: [
          { min: 1, max: 128, message: '长度在 1 到 128 个字符间', trigger: 'blur' }
        ],
        remark: [
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    componentTitle() {
      this.getTable()
    },
    'nodeData.id': {
      handler() {
        this.$set(this.tableObj, 'nearbyKeyPartName', '')
        this.tableObj['oidName'] = this.nodeData.name
        this.getSelfAllList()
      },
      deep: true
    },
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
    this.ruleWarning = this.$lodash.debounce(this._ruleWarning, 500)
  },
  methods: {
    changeStatusName(val) { // 部位状态改变
      // this.tableObj['statusName'] = val
      this.tableObj.statusTimeVal = ''
      if (val !== 1) {
        let sName = ''
        this.statusList1.forEach(it => {
          if (it.value === val) {
            sName = it.label + '时间'
          }
        })
        this.mainTable.forEach((item, index) => {
          if (item.label === '部位状态') {
            let sTime = { prop: 'statusTime', sortable: true, label: sName, width: '100' }
            if (this.mainTable[index + 1]['prop'] === 'statusTime') {
              this.$set(this.mainTable, index + 1, sTime)
            } else {
              this.mainTable.splice(index + 1, 0, sTime)
            }
          }
        })
      } else {
        this.mainTable.forEach((item, index) => {
          if (item.prop === 'statusTime') {
            this.mainTable.splice(index, 1)
          }
        })
      }
      // this.forTr = Math.ceil(this.mainTable.length / 2)
    },
    changeInput(index, type) { // input值校验
      let res = dataRule(this.tableObj[type], type, this.ruleWarning)
      let cpItem = JSON.parse(JSON.stringify(this.mainTable[index]))
      if (!res) {
        cpItem.ruleStauts = true
      } else {
        cpItem.ruleStauts = false
      }
      this.$set(this.mainTable, index, cpItem)
    },
    _ruleWarning(val) { // 校验失败提示信息
      this.$messageWarn(val)
    },
    changeSelfTypeVal() {
      this.$set(this.tableObj, 'nearbyKeyPartName', '')
      this.showSelfName()
    },
    showSelfName() { // 判断显示自助银行的名称
      let selfName = ''
      this.selfTypeList.forEach(item => {
        if (item.value === this.tableObj['nearbyKeyPartTypeName']) {
          selfName = item.label + '名称'
        }
      })
      let hasNearby = false // 是否有附近自助银行/自助设备
      let nkpn = { prop: 'nearbyKeyPartName', sortable: true, label: selfName, width: '150' }
      this.mainTable.forEach((item, index) => {
        if (item.prop === 'nearbyKeyPartName') {
          hasNearby = true
        }
      })
      this.mainTable.forEach((item, index) => {
        if (item.prop === 'nearbyKeyPartTypeName') {
          if (!this.tableObj['nearbyKeyPartTypeName'] && hasNearby) {
            this.mainTable.splice(index + 1, 1)
          } else if (this.tableObj['nearbyKeyPartTypeName'] && hasNearby) {
            this.$set(this.mainTable, index + 1, nkpn)
          } else if (this.tableObj['nearbyKeyPartTypeName'] && !hasNearby) {
            this.mainTable.splice(index + 1, 0, nkpn)
          }
        }
      })
      this.getSelfAllList()
      // this.forTr = Math.ceil(this.mainTable.length / 2)
    },
    getSelfAllList() { // 获取自助银行、自助银亭或者自助设备的列表
      this.selfAllList = []
      if (!this.tableObj['nearbyKeyPartTypeName'] || !this.nodeData.id) { return }
      let param = {
        oid: this.nodeData.id,
        isRecursion: 1,
        type: this.tableObj['nearbyKeyPartTypeName'],
        page: 1,
        limit: 1000
      }
      getKeyPartListApi(param).then(res => {
        console.log(res, 'getSelfAllList-res')
        if (res.data.code === 0) {
          this.selfAllList = res.data.data.ketPartList.map(item => {
            item.id = item.keyPart.id
            item.name = item.keyPart.name
            return item
          })
        } else {
          console.log(res, '获取自助银行或者自助设备的列表错误')
        }
      }).catch(err => {
        console.log(err, '获取自助银行或者自助设备的列表错误')
      })
    },
    reset() {
      this.getTable()
    },
    cancel() {
      this.$emit('changeComponent', 'List', this.componentTitle)
    },
    getTable() {
      let cpColumns = JSON.parse(JSON.stringify(this.columns))
      let userInfo = JSON.parse(read('user')) || {}
      this.footerTable = cpColumns.slice(-3)
      this.mainTable = cpColumns.slice(0, -3)
      // this.forTr = Math.ceil(this.mainTable.length / 2)
      console.log(cpColumns, 'cpColumns')
      console.log(this.mainTable, 'this.mainTable')
      // console.log(this.forTr, 'this.forTr')
      this.tableObj = {}
      this.$set(this.tableObj, 'nearbyKeyPartTypeName', '')
      this.$set(this.tableObj, 'oidName', this.nodeData.name)
      this.$set(this.tableObj, 'statusName', this.tableObj['statusName'])
      // this.tableObj['updatedBy'] = userInfo.name || '' // 自动获取录入人，录入机构，录入时间
      // this.tableObj['updatedDept'] = userInfo.orgName || ''
      // this.tableObj['updatedAt'] = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
       this.tableObj['updatedBy'] ='' 
      this.tableObj['updatedDept'] = ''
      this.tableObj['updatedAt'] = ''
      this.showSelfName()
    },
    createKeypart() {
      // if (!this.tableObj.name) {
      //   this.ruleWarning('名称不能为空！')
      //   return
      // }
      // if (!this.nodeData.name) {
      //   this.ruleWarning('请选择所属机构！')
      //   return
      // }
      // if (!this.tableObj.serial) {
      //   this.ruleWarning('部位代码不能为空！')
      //   return
      // }
      // for (let i = 0; i < this.mainTable.length; i++) {
      //   if (this.mainTable[i].ruleStauts) {
      //     this.ruleWarning(`${this.mainTable[i].label}错误，请重新输入！`)
      //     return
      //   }
      // }
      this.$refs.mainForm1.validate(valid => {
        if (!valid) { return }
        let paramObj = {}
        this.columns.forEach(item => {
          paramObj[item.prop] = this.tableObj[item.prop] || ''
        })
        console.log(this.columns,777)
        paramObj.orgId = this.nodeData.id
        paramObj.type = this.keyPartType
        paramObj.status = this.tableObj['statusName']
        paramObj.nearbyKeyPartType = this.tableObj['nearbyKeyPartTypeName']
        if (this.tableObj['nearbyKeyPartTypeName']) {
          paramObj.nearbyKeyPartId = this.tableObj['nearbyKeyPartName']
        }
        let param = {
          keyPart: paramObj
        }
        console.log(param)
        // return
        addKeyPartApi(param).then(res => {
          if (res.data.code === 0) {
            this.$messageSuccess('重点部位添加成功！', '成功')
            //添加成功后刷新树结构
            this.$parent.orgTreeRefresh()
            this.cancel()
          } else {
            console.log(res.message, '重点部位添加失败')
            this.$messageError(`重点部位添加失败，原因：${res.data.message}`, '错误')
          }
        }).catch(err => {
          console.log(err.message, '重点部位添加失败')
          this.$messageError('重点部位添加失败，请稍后重试！', '错误')
        })
      })
    }
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
