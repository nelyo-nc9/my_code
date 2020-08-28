<template>
  <div class="org-manage-create-modify-box">
    <!-- 机构管理--新建/编辑弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>访客管理</el-breadcrumb-item>
        <el-breadcrumb-item>访客入园申请</el-breadcrumb-item>
        <el-breadcrumb-item>申请列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.addTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="check-log">
      <div style="margin:10px 0 0 20px;">
        <div style="width:100%;">
          查询条件
          <i style="cursor: pointer;" @click="searchConditionsDis" :class="checkLogSearchConditionsIsShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
          <hr style="color:#ccc;position:relative;top:-8px;left:85px;width:100%">
        </div>
      </div>
      <div class="check-log-top" v-if="checkLogSearchConditionsIsShow">
        <p>安全检查结果单</p>
        <div class="check-log-inquire">
          <div class="check-log-select">
            <ul>
              <li style="width:100%">
                  <i>检查名称</i>
                  <el-autocomplete class="inline-input" size="mini" v-model="formInline.orgName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
              </li>
              <!-- <li></li> -->
              <li>
                  <i>检查机构</i>
                  <el-autocomplete class="inline-input" size="mini"  v-model="formInline.keyPartName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位" :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
              </li>
               <li>
                  <i>被检机构</i>
                  <el-autocomplete class="inline-input" size="mini"  v-model="formInline.keyPartName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位" :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
              </li>
               <li>
                  <i>检查时间</i>
                  <el-date-picker
                    v-model="value1"
                     type="datetime"
                     placeholder="选择日期时间">
              </el-date-picker>
              </li>
               <li>
                  <i>检查方式</i>
                  <el-input v-model="formInline.fillingUnit" size="mini"></el-input>
              </li>
              <li style="width:100%;">
                  <i>检测人员</i>
                  <el-input v-model="formInline.channelName" class="camera" placeholder="" size="mini"></el-input>
              </li>
              <li>
                  <i>检查动作</i>
                  <el-select v-model="formInline.action" placeholder="" size="mini">
                      <el-option v-for="(item,index) in checkActionArray" :key="index" :label="item.label" :value="item.value">{{item.label}}</el-option>
                  </el-select>
              </li>
              <li>
                  <i>记录事件</i>
                  <el-input v-model="formInline.eventType" size="mini"></el-input>
              </li>
              <li>
                  <i>检查类型</i>
                  <el-select v-model="formInline.event" size="mini">
                      <el-option v-for="(item,index) in checkTypeArray" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </li>
              <li>
                  <i>检查项目</i>
                  <el-select v-model="formInline.project" size="mini">
                      <el-option v-for="(item,index) in checkProjectsArray" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </li>
              <li>
                  <i>值班员</i>
                  <el-input v-model="formInline.username" size="mini"></el-input>
              </li>
              <li>
                  <i>填写单位</i>
                  <el-input v-model="formInline.fillingUnit" size="mini"></el-input>
              </li>
              <li class="time">
                  <i>填写时间</i>
                  <!-- <el-input v-model="fillingTime" placeholder="请输入" size="mini"></el-input> -->
                  <el-date-picker
                    size="mini"
                    v-model="fillingTime"
                    type="daterange"
                    value-format="timestamp"
                    range-separator="-"
                    start-placeholder="开始"
                    end-placeholder="结束">
                  </el-date-picker>
              </li>
              <li>
                  <i>关键字</i>
                  <el-input v-model="formInline.key" placeholder="请输入" size="mini"></el-input>
              </li>
            </ul>
          </div>
          <div class="check-log-btn">
              <el-button type="primary" icon="el-icon-search" @click="inquireClick" size="small">查询</el-button>
              <el-button @click="resetClick" size="small">重置</el-button>
          </div>
        </div>
      </div>
      <div style="margin:10px 0 10px 20px;">
        <div style="width:100%;">
          查询结果
          <hr style="color:#ccc;position:relative;top:-8px;left:85px;width:100%">
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <div style="margin-bottom:20px;font-size:16px;">
            <el-button  size="small" @click="exportFile">导出</el-button>
            <el-button  size="small" icon="el-icon-printer" @click="print">打印</el-button>
            <el-button  size="small" icon="el-icon-delete" @click="checkLogDelete">删除</el-button>
          </div>
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="300" max-height="300" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
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
        <div class="main-footer">
          <VideoPagination ref="listPagination"
          :total="total"
          @paginationConfChange="paginationConfChange"></VideoPagination>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { download } from '@src/common/download.js'
import { checklogApi, deleteChecklogApi } from '@src/http/dutyManagement/dutyManagement.api'
import { getSearchOrgApi } from '@src/http/systemOperationManage/serverManagement.api'
import VideoPagination from '../../../videoManage/components/VideoPagination'
export default {
  props: {
    //显隐
    isShowAdd: {
      type: Boolean
    },
    //标题
    addTitle: {
      type: String
    }
  },
  components: {
    VideoPagination
  },
  name: 'checkLogSearch',
  data() {
    return {
      // 表格数据
      tableData: [
        {
          org: 'XXX',
          keyPartName: 'XXX',
          channelName: 'XXX',
          action: 'XXX',
          time: 'XXX',
          username: 'XXX',
          event: 'XXX',
          project: 'XXX',
          desc: 'XXX',
          updatedDept: 'XXX',
          updatedAt: 'XXX'
        },
        {
          org: 'XXX',
          keyPartName: 'XXX',
          channelName: 'XXX',
          action: 'XXX',
          time: 'XXX',
          username: 'XXX',
          event: 'XXX',
          project: 'XXX',
          desc: 'XXX',
          updatedDept: 'XXX',
          updatedAt: 'XXX'
        }
      ],
      columns: [
        { prop: 'org', sortable: true, label: '隐患问题', width: '' },
        { prop: 'keyPartName', sortable: true, label: '安全检查部位', width: '' },
        { prop: 'channelName', sortable: true, label: '重点部位名称', width: '' },
        { prop: 'action', sortable: true, label: '防范类别', width: '' },
        { prop: 'time', sortable: true, label: '风险级别', width: '' },
        { prop: 'username', sortable: true, label: '隐患编码', width: '' },
        { prop: 'event', sortable: true, label: '备注', width: '' },
     
      ],
      //日期选择器
       pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        value1: '',
       
      
      fillingTime: [],
      formInline: {
        orgId: '', // 机构ID
        orgName: '', // 机构名称
        keyPartId: '', // 重点部位ID
        keyPartName: '', // 重点部位名称
        channelName: '', // 镜头
        eventType: '', // 记录事件
        event: '全部', // 检查类型
        action: '全部', // 检查动作
        project: '全部', // 检查项目
        username: '', // 值班员
        updatedDept: '', // 填写单位
        startTime: '', // 填写时间
        endTime: '', // 填写时间
        key: '' // 关键字
      },

      selectData: [], // 选中数据
      resizable: false,
      // 检查动作
      checkActionArray: [
        { value: '全部', label: '全部' },
        { value: '截图', label: '截图' },
        { value: '录像', label: '录像' }
      ],
      // 检查类型
      checkTypeArray: [
        { value: '全部', label: '全部' },
        { value: '常规检查', label: '常规检查' },
        { value: '临时检查', label: '临时检查' }
      ],
      checkProjectsArray: [
        { value: '全部', label: '全部' },
        { value: '柜员异常', label: '柜员异常' },
        { value: '员工异常', label: '员工异常' }
      ],
      total: 0,
      checkLogSearchConditionsIsShow: true, // 查询条件是否显示
      paginationConfig: {
        limit: 100,
        page: 1
      }
    }
  },
  created() {},
  methods: {
    // 确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.$emit('update:isShowAdd', false)
    },
    //保存
    deposit() {
      this.$emit('update:isShowAdd', false)
    },
    //提交
    submit() {
      this.$emit('update:isShowAdd', false)
    },

    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.formInline.orgId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        this.formInline.orgId = val.id
        this.formInline.orgName = val.name
      } else if (type === 'kp') {
        this.formInline.keyPartId = val.id
        this.formInline.keyPartName = val.name
      }
    },
    // 分页组件方法
    paginationConfChange(obj) {
      this.paginationConfig = obj
    },
    /**
     * @description:  事件记录查询按钮
     * @param {无}
     * @return: 无
     */
    inquireClick() {
      this.formInline.startTime = this.fillingTime.length ? String(this.fillingTime[0]) : ''
      this.formInline.endTime = this.fillingTime.length ? String(this.fillingTime[1]) : ''
      let param = JSON.parse(JSON.stringify(this.formInline))
      delete param.keyPartName
      delete param.orgName
      checklogApi(param).then(res => {
        console.log(res)
      })
    },
    /**
     * @description:  事件记录查询重置按钮
     * @param {无}
     * @return: 无
     */
    resetClick() {
      this.formInline = {
        orgId: '',
        orgName: '',
        keyPartId: '',
        keyPartName: '',
        channelName: '',
        eventType: '',
        event: '',
        action: '',
        project: '',
        username: '',
        updatedDept: '',
        startTime: '',
        endTime: '',
        key: ''
      }
      this.fillingTime = []
    },
    /**
     * @description:  列表勾选
     * @param {无}
     * @return: 无
     */
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    /**
     * @description:  表格排序
     * @param {无}
     * @return: 无
     */
    sortChange(a) {
      console.log(a)
    },
    /**
     * @description:  列表导出
     * @param {无}
     * @return: 无
     */
    progressFn(val) {
      // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    // 导出
    exportFile() {
      if (this.selectData.length === 0) {
        let url = `${window.location.protocol}//${window.location.hostname}:${
          window.location.port
        }/api/daily/v1/duty/checklog/explode`
        let name = `检查记录查询结果导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          this.progressFn,
          'get',
          ''
        )
      } else {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = [
          '机构',
          '重点部位',
          '镜头',
          '检查动作',
          '记录时间',
          '值班员',
          '检查类型',
          '检查项目',
          '内容描述',
          '填写单位',
          '填写时间'
        ]
        const filterVal = [
          'org',
          'keyPartName',
          'channelName',
          'action',
          'time',
          'username',
          'event',
          'project',
          'desc',
          'updatedDept',
          'updatedAt'
        ]
        const data = this.formatJson(filterVal, this.selectData)
        export_json_to_excel(tHeader, data, '检查记录列表')
      }
    },
    /**
     * @description:  列表打印
     * @param {无}
     * @return: 无
     */
    print() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,

        // field 表格内容  displayName：表头名
        properties: [
          { field: 'org', displayName: '机构' },
          { field: 'keyPartName', displayName: '重点部位' },
          { field: 'channelName', displayName: '镜头' },
          { field: 'action', displayName: '检查动作' },
          { field: 'time', displayName: '记录时间' },
          { field: 'username', displayName: '值班员' },
          { field: 'event', displayName: '检查类型' },
          { field: 'project', displayName: '检查项目' },
          { field: 'desc', displayName: '内容描述' },
          { field: 'updatedDept', displayName: '填写单位' },
          { field: 'updatedAt', displayName: '填写时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">检查记录查询列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    /**
     * @description:  列表删除
     * @param {无}
     * @return: 无
     */
    checkLogDelete() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = []
          this.selectData.forEach(item => {
            ids.push(item.id)
          })
          let param = {
            ids: ids.join(',')
          }
          this.deleteChecklogApiFuc(param)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteChecklogApiFuc(ids) {
      deleteChecklogApi(ids)
        .then(res => {
          if (res.data.code === 0) {
            this.$messageSuccess('删除成功')
            this.checklogApiFuc()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchConditionsDis() {
      this.checkLogSearchConditionsIsShow = !this.checkLogSearchConditionsIsShow
    }
  }
}
</script>

<style scoped lang="less">
.check-log {
  padding: 5px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .check-log-top {
    width: 870px;
    margin: 0 auto;
    p {
      padding: 10px 0;
      font-size: 16px;
      text-align: center;
    }
  }
  .main {
    width: 100%;
    height: 67%;
    margin: 20px 0 0 10px;
    .list-box-table {
      width: 100%;
      overflow: auto;
      height: 100%;
    }
    .main-footer {
      height: 40px;
      width: 500px;
      margin: 0 auto;
      // display: flex;
      // justify-content: center;
      // align-items: flex-end;
    }
  }
  .host-header {
    margin-bottom: 15px;
  }
  .check-log-inquire {
    width: 100%;
    margin: 10px 0;
    .check-log-select {
      width: 100%;
      overflow: hidden;
      // border: 1px solid #bcbcbc;
      ul {
        overflow: hidden;
        margin: 10px;
        li {
          float: left;
          width: 420px;
          margin: 0 2px 10px 0;
          // padding: 4px 0;
          // height: 38px;
          i {
            float: left;
            width: 136px;
            line-height: 32px;
            text-align: center;
            // background: #f2f2f2;
            margin-right: 4px;
          }
          .el-input:not(.camera) {
            width: 270px !important;
            margin-top: 2px;
          }
          .el-input,
          [class='camera'] {
            width: 692px !important;
            margin-top: 2px;
          }
          .el-select {
            width: 270px !important;
            margin-top: 2px;
          }
        }
      }
    }
    .check-log-btn {
      width: 866px;
      text-align: center;
      margin-top: 10px;
    }
  }
  .zone-header {
    overflow: hidden;
    line-height: 20px;
    margin-bottom: 10px;
    i {
      float: left;
      width: 4%;
      font-size: 14px;
    }
    .zone-header-line {
      float: right;
      width: 96%;
      border-top: 1px solid #bcbcbc;
      margin-top: 10px;
    }
  }
}
/deep/ .el-autocomplete {
  width: 64%;
  height: 32px;
  .el-input {
    height: 95%;
    input {
      height: 100%;
    }
  }
}
.time /deep/.el-input__inner {
  width: 270px;
}
</style>
<style lang="less">
.check-log .el-form--inline .el-form-item__label {
  width: 100px !important;
}
.check-log .el-form--inline .el-form-item__content {
  width: 200px !important;
}
</style>
