<template>
  <div class="emphasis-part-search">
    <!-- 重点部位-查询界面 -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>重点部位</el-breadcrumb-item>
            <el-breadcrumb-item>{{componentTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-main">
        <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">{{componentTitle}}查询</div>
            <div class="main-box-center">
              <!-- <table cellspacing="0" cellpadding="0">
                <tr v-for="index in forTr" :key="index">
                  <td class="box-cell-title" v-if="mainTable[(index - 1)*2]">{{mainTable[(index - 1)*2].label}}</td>
                  <td class="box-cell-input" v-if="mainTable[(index - 1)*2]">
                    <el-select v-model="partStatus" placeholder="请选择" style="width: 100%" v-if="mainTable[(index - 1)*2].label === '部位状态'">
                      <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="org-box" @click="clickOwerOrg" @mouseleave="showOrgTree=false" v-else-if="mainTable[(index - 1)*2].label === '所属机构'">
                      <el-input v-model="orgName" readonly></el-input>
                      <div class="org-tree-box" v-show="showOrgTree">
                        <orgTree :lazyTreeApi="getTreeApi" treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
                      </div>
                    </div>
                    <el-select v-model="selfTypeVal" @change="changeSelfTypeVal" placeholder="请选择" style="width: 100%" v-else-if="mainTable[(index - 1)*2].label === '附近自助银行/自助设备'">
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
                    <el-date-picker v-else-if="mainTable[(index - 1)*2].prop === 'updatedAt'"
                      v-model="updatedAt"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                    <el-input v-model="tableObj[mainTable[(index - 1)*2].prop]" v-else></el-input>
                  </td>
                  <td class="box-cell-title" v-if="mainTable[(index - 1)*2 + 1]">{{mainTable[(index - 1)*2 + 1].label}}</td>
                  <td class="box-cell-input" v-if="mainTable[(index - 1)*2 + 1]">
                    <el-select v-model="partStatus" placeholder="请选择" style="width: 100%" v-if="mainTable[(index - 1)*2 + 1].label === '部位状态'">
                      <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="org-box" @click="clickOwerOrg" @mouseleave="showOrgTree=false" v-else-if="mainTable[(index - 1)*2+1].label === '所属机构'">
                      <el-input v-model="orgName" readonly></el-input>
                      <div class="org-tree-box" v-show="showOrgTree">
                        <orgTree :lazyTreeApi="getTreeApi" treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
                      </div>
                    </div>
                    <el-select v-model="selfTypeVal" @change="changeSelfTypeVal" placeholder="请选择" style="width: 100%" v-else-if="mainTable[(index - 1)*2 + 1].label === '附近自助银行/自助设备'">
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
                    <el-date-picker v-else-if="mainTable[(index - 1)*2 + 1].prop === 'updatedAt'"
                      v-model="updatedAt"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                    <el-input v-model="tableObj[mainTable[(index - 1)*2+1].prop]" v-else></el-input>
                  </td>
                </tr>
              </table> -->
              <el-form class="main-form" :rules="rules" ref="mainForm3" size="mini" :inline="true" :model="tableObj" label-position="right" label-width="145px">
              <div style="display: inline-block" v-for="(item, ind) in mainTable" :key="ind">
                <el-form-item :label="item.label" :prop="item.prop" :rules="[{ min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: ['blur', 'change']}]">
                  <el-select v-model="tableObj['status']" placeholder="请选择" style="width: 100%" v-if="item.prop === 'statusName'">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div class="org-box" @click="clickOwerOrg" @mouseleave="showOrgTree=false" v-else-if="item.prop === 'oidName'">
                    <el-input v-model="orgName" readonly></el-input>
                    <div class="org-tree-box" v-show="showOrgTree">
                      <orgTree :lazyTreeApi="getTreeApi" treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
                    </div>
                  </div>
                  <el-select v-model="tableObj['nearbyKeyPartType']" @change="changeSelfTypeVal" placeholder="请选择" style="width: 100%" v-else-if="item.prop === 'nearbyKeyPartTypeName'">
                    <el-option
                      v-for="item in selfTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="tableObj['nearbyKeyPartId']" placeholder="请选择" style="width: 100%" v-else-if="item.prop === 'nearbyKeyPartName'">
                    <el-option
                      v-for="item in selfAllList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.prop === 'updatedAt'" v-model="updatedAt" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                  <el-input class="form-input" v-model="tableObj[item.prop]" v-else></el-input>
                </el-form-item>
              </div>
            </el-form>
            </div>
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" @click="clickSearch">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
          <el-button size="small" @click="clickExport">导出</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table" ref="main">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            @select="select"
            @row-click="rowDbClick"
            height="100%"
            style="width: 100%">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
            <el-table-column
              v-for="(column, index) in columns" :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :page-sizes="[25, 50, 100, 200]"
          :page-size.sync="limit"
          :current-page.sync="page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { queryKeyPartListApi, getKeyPartListApi } from '@src/http/basicInfoManage/keyPart.api'
import orgTree from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/basicInfoManage/orgManage.api'
import { download } from '@src/common/download.js'

export default {
  name: 'Search',
  components: {
    orgTree
  },
  props: {
    componentTitle: {
      type: String,
      default: ''
    },
    orgRootId: {
      type: Number,
      default: 0
    },
    columns: {
      type: Array,
      default: () => []
    },
    nodeData: { // 所属机构信息
      type: Object,
      default: () => {}
    },
    keyPartType: { // 重点部位的类型
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      resizable: true,
      tableData: [],
      total: 0,
      // partStatus: 0,
      statusList: [
        {label: '全部', value: 0},
        {label: '正常', value: 1},
        {label: '撤销', value: 2},
        {label: '合并', value: 3},
        {label: '临时停业', value: 4}
      ],
      orgId: '', // 所属机构
      orgName: '全部', // 所属机构名称
      owerOrgList: [
        {label: '全部', value: ''}
      ],
      // selfVal: '', // 附近自助银行/自助设备
      selfAllList: [], // 获取所有附近自助银行/自助设备、自助银亭的列表
      // selfTypeVal: '全部',
      selfTypeList: [
        {label: '全部', value: '全部'},
        {label: '无自助', value: ''},
        {label: '自助设备', value: 6},
        {label: '自助银亭', value: 7},
        {label: '自助银行', value: 5}
      ],
      mainTable: [], // 查询内容项
      // mainHeight: 420, // main的高度
      updatedAt: '', // 录入时间
      page: 1,
      limit: 100,
      tableObj: {},
      showOrgTree: false,
      rules: {} // 校验规则
    }
  },
  watch: {
    componentTitle() {
      this.getMainTable()
      // this.getMainHeight()
    },
    orgId() {
      // this.selfVal = ''
      this.$set(this.tableObj, 'nearbyKeyPartId', '')
      this.getSelfAllList()
    }
  },
  created() {
    // this.getMainHeight()
    // this.getMainTable()
    this.reset()
    this.getSelfAllList()
  },
  methods: {
    onceClick(node) { // 机构树点击
      this.orgId = node.id
      // this.$set(this.tableObj, 'orgId', node.id)
      this.orgName = node.name
    },
    getTreeApi(params) { // 机构树接口
      return getTreeApi(params)
    },
    clickOwerOrg() {
      this.showOrgTree = true
    },
    // getMainHeight() {
    //   this.$nextTick(() => {
    //     this.mainHeight = this.$refs['main'].offsetHeight
    //   })
    // },
    sizeChange() { // 每页条数改变
      this.getTableList()
    },
    currentChange() { // 当前页改变
      this.getTableList()
    },
    clickSearch() {
      this.page = 1
      this.getTableList('查询')
    },
    getTableList(val) { // 查询请求表格数据方法
      console.log(this.tableObj, 'this.tableObj')
      // if (this.partStatus) {
      //   this.tableObj.status = this.partStatus
      // } else {
      //   delete this.tableObj.status
      // }
      // if (this.selfTypeVal) {
      //   // this.tableObj.nearbyKeyPartType = this.selfTypeVal
      //   // this.tableObj.nearbyKeyPartId = this.selfVal
      //   if (this.selfTypeVal === '全部') {
      //     delete this.tableObj.nearbyKeyPartType
      //   }
      // } else {
      //   delete this.tableObj.nearbyKeyPartType
      // }
      this.$refs.mainForm3.validate(valid => {
        if (!valid) { return }
        let cpTableObj = JSON.parse(JSON.stringify(this.tableObj))
        delete cpTableObj.updatedAt
        if (cpTableObj.nearbyKeyPartType === '全部') {
          delete cpTableObj.nearbyKeyPartType
        }
        let param = {
          ...cpTableObj,
          orgId: this.orgId,
          type: this.keyPartType,
          page: this.page,
          limit: this.limit,
          startUpdatedAt: this.updatedAt ? this.updatedAt[0] : '',
          endUpdatedAt: this.updatedAt ? this.updatedAt[1] : ''
        }
        for (let key in param) {
          if (!param[key]) {
            delete param[key]
          }
        }
        console.log(param, 'param')
        queryKeyPartListApi(param).then(res => {
          console.log(res, 'res')
          if (res.data.code === 0) {
            let statusArr = ['', '正常', '已撤销', '已合并', '临时停业']
            this.tableData = res.data.data.ketPartList.map(item => {
              item.name = item.keyPart.name
              item.address = item.keyPart.address
              item.oidName = item.oid.name
              item.telephone = item.keyPart.telephone
              item.principal1 = item.keyPart.principal1
              item.principalPhone1 = item.keyPart.principalPhone1
              item.principal2 = item.keyPart.principal2
              item.principalPhone2 = item.keyPart.principalPhone2
              item.principal3 = item.keyPart.principal3
              item.principalPhone3 = item.keyPart.principalPhone3
              item.principal4 = item.keyPart.principal4
              item.principalPhone4 = item.keyPart.principalPhone4
              item.principal5 = item.keyPart.principal5
              item.principalPhone5 = item.keyPart.principalPhone5
              item.policeStation = item.keyPart.policeStation
              item.policeTelephone = item.keyPart.policeTelephone
              item.police = item.keyPart.police
              item.policeMobilePhone = item.keyPart.policeMobilePhone
              item.serial = item.keyPart.serial
              item.remark = item.keyPart.remark
              item.statusName = statusArr[item.keyPart.status]
              item.nearbyKeyPartType = item.nearbyKeyPart.type
              item.nearbyKeyPartName = item.nearbyKeyPart.name
              item.updatedBy = item.keyPart.updatedBy
              item.updatedDept = item.keyPart.updatedDept
              item.updatedAt = item.keyPart.updatedAt
              return item
            })
            this.total = res.data.data.count
            val && this.$messageSuccess(`${val}重点部位成功！`, '成功')
          } else {
            console.log(res.message, 'err')
            this.tableData = []
            val && this.$messageError(`${val}重点部位失败，请稍后重试！`, '错误')
          }
        }).catch(err => {
          console.log(err, 'err')
          this.tableData = []
          val && this.$messageError(`${val}重点部位失败，请稍后重试！`, '错误')
        })
      })
    },
    changeSelfTypeVal() {
      // this.selfVal = ''
      this.$set(this.tableObj, 'nearbyKeyPartId', '')
      this.showSelfName()
    },
    showSelfName() { // 判断显示自助银行的名称
      let selfName = ''
      this.selfTypeList.forEach(item => {
        if (item.value === this.tableObj.nearbyKeyPartType) {
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
      let hasSelfTypeVal = false // 是否有附近自助银行/自助设备类型值
      if (this.tableObj.nearbyKeyPartType && this.tableObj.nearbyKeyPartType !== '全部') {
        hasSelfTypeVal = true
      } else {
        hasSelfTypeVal = false
      }
      this.mainTable.forEach((item, index) => {
        if (item.prop === 'nearbyKeyPartTypeName') {
          if (!hasSelfTypeVal && hasNearby) {
            this.mainTable.splice(index + 1, 1)
          } else if (hasSelfTypeVal && hasNearby) {
            this.$set(this.mainTable, index + 1, nkpn)
          } else if (hasSelfTypeVal && !hasNearby) {
            this.mainTable.splice(index + 1, 0, nkpn)
          }
        }
      })
      this.getSelfAllList()
      // this.forTr = Math.ceil(this.mainTable.length / 2)
    },
    getSelfAllList() { // 获取自助银行、自助银亭或者自助设备的列表
      this.selfAllList = []
      if (!this.tableObj.nearbyKeyPartType || ![5, 6, 7].includes(this.tableObj.nearbyKeyPartType)) { // 无自助
        return
      }
      let paramArr = []
      let param = {
        oid: this.orgId || this.orgRootId,
        isRecursion: 1,
        type: this.tableObj.nearbyKeyPartType || 5,
        page: 1,
        limit: 1000
      }
      for (let key in param) {
        if (!param[key]) {
          delete param[key]
        }
      }
      // if (this.selfTypeVal === '全部') {
      //   let param1 = JSON.parse(JSON.stringify(param))
      //   let param2 = JSON.parse(JSON.stringify(param))
      //   let param3 = JSON.parse(JSON.stringify(param))
      //   param1.type = 5
      //   param2.type = 6
      //   param3.type = 7
      //   paramArr[0] = getKeyPartListApi(param1)
      //   paramArr[1] = getKeyPartListApi(param2)
      //   paramArr[2] = getKeyPartListApi(param3)
      // } else {
      //   paramArr[0] = getKeyPartListApi(param)
      // }
      paramArr[0] = getKeyPartListApi(param)
      Promise.all(paramArr).then(res => {
        console.log(res, 'getSelfAllList-res333')
        res.forEach(ite => {
          if (ite.data.code === 0) {
            ite.data.data.ketPartList.forEach(it => {
              let itObj = {
                id: it.keyPart.id,
                type: it.keyPart.type,
                name: it.keyPart.name
              }
              this.selfAllList.push(itObj)
            })
          } else {
            console.log(ite, '获取自助银行或者自助设备的列表错误')
          }
        })
        console.log(this.selfAllList, 'this.selfAllList999999')
      }).catch(err => {
        console.log(err, '获取自助银行或者自助设备的列表错误')
      })
    },
    reset() { // 重置
      this.getMainTable()
      this.orgId = ''
      this.orgName = '全部'
      // this.partStatus = 0
      this.$set(this.tableObj, 'status', 0)
      // this.selfVal = ''
      this.$set(this.tableObj, 'nearbyKeyPartId', '')
      // this.selfTypeVal = '全部'
      this.$set(this.tableObj, 'nearbyKeyPartType', '全部')
      this.updatedAt = []
      this.getSelfAllList()
    },
    select() {
    },
    rowDbClick(row) {
      console.log(row,333)
    },
    getMainTable() { // 获取表单内的查询项
      let cpColumns = JSON.parse(JSON.stringify(this.columns))
      this.mainTable = cpColumns.filter((item) => {
        return item.label.indexOf('电话') === -1 && item.label !== '部位代码' && item.label !== '备注' && item.label !== '附近自助银行名称'
      })
      // this.forTr = Math.ceil(this.mainTable.length / 2)
      this.tableObj = {}
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    clickExport() {
      // if (this.partStatus) {
      //   this.tableObj.status = this.partStatus
      // } else {
      //   delete this.tableObj.status
      // }
      // if (this.selfTypeVal) {
      //   this.tableObj.nearbyKeyPartType = this.selfTypeVal
      //   // this.tableObj.nearbyKeyPartId = this.selfVal
      //   if (this.selfTypeVal === '全部') {
      //     delete this.tableObj.nearbyKeyPartType
      //   }
      // } else {
      //   delete this.tableObj.nearbyKeyPartType
      // }
      this.$refs.mainForm3.validate(valid => {
        if (!valid) { return }
        let cpTableObj = JSON.parse(JSON.stringify(this.tableObj))
        delete cpTableObj.updatedAt
        if (cpTableObj.nearbyKeyPartType === '全部') {
          delete cpTableObj.nearbyKeyPartType
        }
        let paramObj = {
          ...cpTableObj,
          orgId: this.orgId || this.orgRootId,
          type: this.keyPartType,
          startUpdatedAt: this.updatedAt ? this.updatedAt[0] : '',
          endUpdatedAt: this.updatedAt ? this.updatedAt[1] : ''
        }
        //如果所属机构为全部，导出不传orgId
        if(this.orgName==='全部'||this.orgId===''){
           delete paramObj.orgId
        }
        for (let key in paramObj) {
          if (!paramObj[key]) {
            delete paramObj[key]
          }
        }
        let params = {
          type: 3,
          queryCondition: {
            ...paramObj
          }
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/organizational/v1/key-part/export`
        let name = `重点部位导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'post', params)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .emphasis-part-search {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: auto;
    .content {
      width: 100%;
      min-height: 800px;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      .top {
        width: 1110px;
        .header {
          margin-bottom: 10px;
        }
        .top-main {
          margin: 10px 0;
          width: 100%;
          .main-box {
            padding: 0 20px;
            .box-title {
              height: 40px;
              text-align: center;
              line-height: 40px;
              font-size: 18px;
            }
            .main-box-center {
              border: 1px solid #ddd;
              padding: 10px 20px;
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
                    .org-box {
                      position: relative;
                      width: 100%;
                      .org-tree-box {
                        border: 1px solid #ddd;
                        position: absolute;
                        left: 0px;
                        top: 35px;
                        z-index: 99;
                        height: 300px;
                        width: 100%;
                        background: #fff;
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
                .org-box {
                  position: relative;
                  width: 100%;
                  .org-tree-box {
                    border: 1px solid #ddd;
                    position: absolute;
                    left: 0px;
                    top: 36px;
                    z-index: 99;
                    height: 300px;
                    width: 100%;
                    background: #fff;
                  }
                }
              }
            }
          }
        }
        .button-box {
          text-align: center;
          margin-bottom: 20px;
          .el-button {
            width: 80px;
          }
        }
      }
      .main {
        width: 100%;
        height: 100%;
        flex: 1;
        overflow: hidden;
        .list-box-table {
          width: 100%;
          height: 100%;
        }
      }
      .footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
</style>
