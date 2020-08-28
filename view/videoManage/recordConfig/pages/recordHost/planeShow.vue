<template>
  <div class="planeShow">
    <div class="leftTree">
      <treeBox
        :lazyTreeApi="getTreeApi"
        searchType="search"
        :treeType="patternBoolean ? 2 : 0"
        :customizeQuery="customizeQuery"
        treeLazyToggle
      ></treeBox>
    </div>
    <div class="content">
      <div class="top">
        <!-- 面包屑 -->
        <breadcrumb
          :breadcrumbItem="['视频管理', '中心录像计划配置', `${changeComponent.data ? '编辑' : '新建'}录像计划`]"
        ></breadcrumb>
        <!-- 操作按钮 -->
        <div v-if="this.changeComponent.from != 'recordPlaneList'">
          <el-button size="small" @click="changComponent(1)">新建</el-button>
          <el-button size="small" @click="changComponent()">编辑</el-button>
          <el-button size="small" @click="deleteDevice">删除</el-button>
          <el-button size="small" @click="printing">打印</el-button>
        </div>
        <div v-else>
          <el-button size="small" @click="printing">打印</el-button>
          <el-button size="small" @click="goback">关闭</el-button>
        </div>
      </div>
      <div class="main" id="planeShow">
        <div class="options">
          <div class="item">
            <span>录像计划名称</span><span>{{ options.name }}</span>
          </div>
          <div class="item">
            <span>录像计划</span><span>{{ filterData('planTemplateId', options.planTemplateId) }}</span>
          </div>
          <div class="item">
            <span>录像状态</span><span>{{ filterData('status', options.status) }}</span>
          </div>
          <div class="item">
            <span>录像码流</span><span>{{ filterData('streamType', options.streamType) }}</span>
          </div>
          <div class="item">
            <!-- 会有多个存储位置 -->
            <span>存储位置</span><span>{{ filterData('storageServerId', options.storageServerId) }}</span>
          </div>
        </div>
        <div class="table">
          <el-table
            stripe
            size="small"
            :data="tableData"
            height="341"
            style="width: 100%"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            empty-text
          >
            <el-table-column label="序号" type="index" width="60" align="center"> </el-table-column>
            <el-table-column
              v-for="e of columns"
              :key="e.prop"
              :prop="e.prop"
              :label="e.label"
              :width="e.width"
              align="center"
              show-overflow-tooltip
              :formatter="formatter"
            ></el-table-column>
          </el-table>
        </div>
        <div class="options baseoptions">
          <div class="item">
            <span>录入时间</span><span :title="options.updatedAt">{{ options.updatedAt }}</span>
          </div>
          <div class="item">
            <span>录入机构</span><span :title="options.updatedBy">{{ options.updatedBy }}</span>
          </div>
          <div class="item">
            <span>录入人</span><span :title="options.updatedDept">{{ options.updatedDept }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../common/breadcrumb.vue'
import treeBox from '@src/components/tree/treeBox'
import common from '../common'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import {
  deleteRecordPlanApi, // 删除录像计划（定时/事件）
  getRecordPlanDetailApi
} from '@src/http/video/recordConfig.api.js'
import { mapMutations, mapGetters } from 'vuex'
const NOTIFY = {
  TITLE: {
    SUCCESS: '成功',
    FAIL: '失败',
    ERROR: '错误',
    WARNING: '警告'
  },
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
  }
}
export default {
  name: 'planeShow',
  mixins: [common],
  components: {
    breadcrumb,
    treeBox
  },
  created() {
    // console.log(this.channelClass.video)
    this.getDatalist(this.changeComponent.data)
  },
  data() {
    return {
      resReviewData: {}, // 详情数据
      columns: [
        { prop: 'orgName', label: '所属机构', width: '220' },
        { prop: 'keyPartName', label: '所属重点部位', width: '220' },
        { prop: 'deviceName', label: '所属设备', width: '220' },
        { prop: 'channelName', label: '资源名称', width: '220' },
        { prop: 'ip', label: 'IP', width: '120' },
        { prop: 'class', label: '资源类型', width: '80' }
      ],
      customizeQuery: {
        // 机构树传参
        params: {
          subSystem: 1,
          channelType: 1
        }
      },
      tableData: [], // 表格参数
      options: {
        name: '', // 录像计划名称
        planTemplateId: '', // 录像计划id
        streamType: '', // 录像码流类型 1主码流，2子码流，3.第三码流
        status: '', // 1启用，2停用
        storageServerId: '', // 存储位置id
        planTaskType: 1, // 录像性质:1定时，2事件
        configType: '', // 添加方式：1 按资源  2 按组织
        updatedAt: '', // 录入时间
        updatedBy: '', // 录入机构
        updatedDept: '' // 录入人
      } // 其他参数
    }
  },
  computed: {
    ...mapGetters('videoManage', {
      channelClass: 'channelClass',
      patternBoolean: 'patternBoolean' // 查看类型 Boolean 按资源查看-false 按组织查看-true
    })
    // ...mapState('videoManage', {
    //   deviceTypeOption: ({ recordConfig }) => recordConfig.deviceTypeOption, // 设备启用停用备选项
    //   recordCodeOption: ({ recordConfig }) => recordConfig.recordCodeOption, // 录像码流备选项
    //   recordPlanOption: ({ recordConfig }) => recordConfig.recordPlanOption, // 录像计划
    //   storageLocOption: ({ recordConfig }) => recordConfig.storageLocOption // 存储位置
    // })
  },
  methods: {
    ...mapMutations('videoManage', ['SET_PATTERN']),
    // 获取当前事件data
    getDatalist(id) {
      // 获取预览数据
      getRecordPlanDetailApi(id)
        .then(res => {
          if (!res.data.code) {
            let data = res.data.data
            // 数据处理
            let resList = res.data.data.channelList
            let storageServerIds = Array.from(new Set(resList.map(vm => vm.storageServerId)))
            this.options = {
              name: data.name, // 录像计划名称
              planTemplateId: data.planTemplateId, // 录像计划id
              streamType: data.streamType, // 录像码流类型 1主码流，2子码流，3.第三码流
              status: data.status, // 1启用，2停用
              storageServerId: storageServerIds, // 存储位置id
              planTaskType: data.planTaskType, // 录像性质:1定时，2事件
              configType: data.configType, // 添加方式：1 按资源  2 按组织
              updatedAt: data.updatedAt, // 录入时间
              updatedBy: data.updatedBy, // 录入机构
              updatedDept: data.updatedDept // 录入人
            }
            this.resReviewData = data
            this.tableData = data.channelList
          } else {
            throw res.data.message
          }
        })
        .catch(err => {
    
             this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: '详情获取失败',
              type: NOTIFY.TYPE.ERROR
            })
        })
    },
    // 新建 / 编辑
    changComponent(val) {
      // 1-新建 0-编辑
      if (val) {
        this.skipModal(this.changeComponent.from, this.changeComponent.to)
        this.$emit('modelChange')
      } else {
        this.skipModal(this.changeComponent.from, this.changeComponent.to, this.changeComponent.data)
        this.$emit('modelChange')
      }
    },
    goback() {
      this.skipModal(this.changeComponent.from, this.changeComponent.to)
    },
    // 删除
    deleteDevice() {
      // const ids = this.getIds(this.tableData)
      // let obj = {}
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          deleteRecordPlanApi({ ids: [this.changeComponent.data], isForceDel: true })
            .then(res => {
              let { code, data } = res.data
              if (code === 0) {
                if (data && data.code === 1) {
                  this.$notify({ title: '', message: data.msg, type: 'success', offset: 100, position: 'bottom-right' })
                }
              } else {
                throw data && data.msg
              }
            })
            .catch(err => {
              this.$notify({
                title: '删除失败',
                message: err + '请稍后重试!',
                type: 'error',
                offset: 100,
                position: 'bottom-right'
              })
            })
        })
        .then(_ => {
          setTimeout(_ => {
            this.skipModal(this.changeComponent.from, this.changeComponent.to)
            this.$emit('modelChange')
          }, 2000)
        })
        .catch(_ => {
          this.$notify({ title: '', message: '已取消删除', type: 'info', offset: 100, position: 'bottom-right' })
        })
    },
    formatter(row, column) {
      let classindex = row.class
      if (column.property === 'class') {
        let a = this.channelClass.video.filter(i => {
          return i.value === classindex
        })
        console.log(a)
        return a && a.length ? a[0].label : ''
      }
      return row[column.property]
      //  if(column)
    },
    // 打印
    printing() {
      // printJS({printable:'planeShow',type:'html'});
      let list = this.tableData.map(item => {
        return {
          name: this.options.name,
          planTemplateId: this.options.planTemplateId,
          status: this.filterData('status', this.options.status),
          streamType: this.filterData('streamType', this.options.streamType),
          storageServerId: this.options.storageServerId,
          orgName: item.orgName || '',
          keyPartName: item.keyPartName || '',
          deviceName: item.deviceName || '',
          channelName: item.channelName || '',
          ip: item.ip || '',
          class: this.filterData('class', item.class) || '',
          updatedDept: this.options.updatedDept || '',
          updatedBy: this.options.updatedBy || '',
          updatedAt: this.options.updatedAt || ''
        }
      })
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'name', displayName: '录像计划名称' },
          { field: 'planTemplateId', displayName: '录像计划' },
          { field: 'status', displayName: '录像状态' },
          { field: 'streamType', displayName: '录像码流' },
          { field: 'storageServerId', displayName: '存储位置' },
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'deviceName', displayName: '所属设备' },
          { field: 'channelName', displayName: '资源名称' },
          { field: 'ip', displayName: 'IP' },
          { field: 'class', displayName: '资源类型' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom"></p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
      })
      // let key = [
      //   { field: 'name', displayName: '录像计划名称' },
      //   { field: 'planTemplateId', displayName: '录像计划' },
      //   { field: 'status', displayName: '录像状态' },
      //   { field: 'streamType', displayName: '录像码流' },
      //   { field: 'storageServerId', displayName: '存储位置' },
      //   { field: 'orgName', displayName: '所属机构' },
      //   { field: 'keyPartName', displayName: '所属重点部位' },
      //   { field: 'deviceName', displayName: '所属设备' },
      //   { field: 'channelName', displayName: '资源名称' },
      //   { field: 'ip', displayName: 'IP' },
      //   { field: 'class', displayName: '资源类型' },
      //   { field: 'updatedDept', displayName: '录入机构' },
      //   { field: 'updatedBy', displayName: '录入人' },
      //   { field: 'updatedAt', displayName: '录入时间' }
      // ]
      // let params = [{
      //   'name': this.options.name,
      //   'planTemplateId': this.options.planTemplateId,
      //   'status': this.filterData('status', this.options.status),
      //   'streamType': this.filterData('streamType', this.options.streamType),
      //   'storageServerId': this.options.storageServerId,
      //   'orgName': this.tableData.orgName || '',
      //   'keyPartName': this.tableData.keyPartName || '',
      //   'deviceName': this.tableData.deviceName || '',
      //   'channelName': this.tableData.channelName || '',
      //   'ip': this.options.ip,
      //   'class': this.options.class || '',
      //   'updatedDept': this.options.updatedDept || '',
      //   'updatedBy': this.options.updatedBy || '',
      //   'updatedAt': this.options.updatedAt || ''
      // }]
      // console.log(params)
      // this.printFun(`录像计划配置`, key, params)
      // 以上注释的是调用表格前端打印   params没做循环 只有一行    现在使用vue插件打印,没有央视
    },
    // 懒加载树接口
    getTreeApi(params) {
      return getTreeApi(params)
    }
  }
}
</script>

<style lang="less" scoped>
.planeShow {
  width: 100%;
  height: calc(~'100% - 10px');
  display: flex;
  .leftTree {
    width: 280px;
    height: 100%;
  }
  .content {
    width: calc(~'100% - 280px');
    padding-left: 10px;
    .top {
      margin-bottom: 10px;
    }
    .main {
      height: calc(~'100% - 72px');
      overflow: hidden;
      .table,
      .options {
        border: 1px solid #ebeef5;
        padding: 9px 8px;
        margin-bottom: 16px;
      }
      .table {
        max-width: 1160px;
        & > div {
          margin-top: 6px;
        }
        /deep/ .el-table::before {
          background-color: inherit;
        }
      }
      .options {
        width: 800px;
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 50%;
          flex: auto;
          display: flex;
          > span {
            display: inline-block;
            line-height: 30px;
            height: 30px;
            border-bottom: 1px solid;
          }
          span:first-child {
            width: 85px;
            text-align: center;
            background-color: #f8f8f8;
            border-bottom-color: #fff;
          }
          span + span {
            max-width: calc(~'100% - 85px');
            width: 100%;
            cursor: default;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 12px;
            border-bottom-color: #f8f8f8;
          }
        }
      }
      .options.baseoptions {
        padding: 0 5px;
        .item {
          display: inline-block;
          width: calc(~'(100% - 12px) / 12*5');
          height: 30px;
          margin: 0;
        }
        span {
          cursor: default;
          display: inline-block;
          max-width: calc(~'100% - 80px');
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          & + span {
            width: auto;
            max-width: calc(~'100% - 104px');
            background: none;
          }
        }
        .item:first-child {
          width: calc(~'(100% - 12px) / 3');
        }
        .item:last-child {
          width: calc(~'(100% - 12px) / 4');
        }
      }
    }
  }
}
</style>
