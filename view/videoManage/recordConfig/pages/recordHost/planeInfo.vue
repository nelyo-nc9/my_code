<template>
  <!-- 录像计划配置页面 -->
  <div class="planeInfo">
    <div class="leftTree">
      <div class="treeTop">
        <switchBox
          :disabledToggle="switchToggle"
          activeText="按资源添加"
          :activeValue="1"
          inactiveText="按组织添加"
          :inactiveValue="2"
          :value="pattern"
          @change="switchChange"
        ></switchBox>
        <!-- 筛选栏 -->
        <i class="iconfont icon-gongneng" @click="() => (listBoxToggle = !listBoxToggle)"></i>
        <div class="listBox" v-show="listBoxToggle" @mouseleave="() => (this.listBoxToggle = false)">
          <el-checkbox
            :indeterminate="checkGroupStatus.indeterminate"
            v-model="checkGroupStatus.checkAll"
            @change="handleCheckAllChange"
            >全部</el-checkbox
          >
          <el-checkbox-group v-model="checkedItem" @change="handleCheckSingleChange">
            <el-checkbox v-for="e of deviceClass" :label="e.value" :key="e.value">{{ e.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 机构树 -->
      <treeBox
        ref="treeBox"
        :key="pattern"
        :defaultExpandedKeys="defaultNodeKeys"
        :lazyTreeApi="getTreeApi"
        :treeType="patternBoolean ? 2 : 0"
        :lazyTreeCheckApi="lazyTreeCheckApi"
        :customizeQuery="customizeQuery"
        searchType="filter"
        @checkclick="checkclick"
        treeLazyToggle
        checkboxToggle
      ></treeBox>
    </div>
    <div class="content">
      <!-- 面包屑 -->
      <breadcrumb
        class="header"
        :breadcrumbItem="['视频管理', '中心录像计划配置', `${changeComponent.data ? '编辑' : '新建'}录像计划`]"
      ></breadcrumb>
      <div class="main">
        <p class="title form-content-title">按{{ patternBoolean ? '组织' : '资源' }}配置定录像计划</p>
        <!-- 配置项 -->

        <div class="condition-box">
          <div class="query-form">
            <el-form :rules="checkForm" ref="options" :model="options">
              <el-form-item label="录像计划名称" prop="name">
                <el-input
                  v-model="options.name"
                  placeholder="请输入录像计划名称"
                  :maxlength="32"
                  size="mini"
                  :disabled="eventStatus"
                ></el-input
              ></el-form-item>
              <el-form-item label="录像计划" prop="planTemplateId">
                <el-select v-model="options.planTemplateId" size="small">
                  <el-option v-for="(e, i) of recordPlanOption" :label="e.label" :value="e.value" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="录像码流" prop="streamType">
                <el-select v-model="options.streamType" size="small">
                  <el-option
                    v-for="(e, i) of recordCodeOption"
                    :label="e.label"
                    :value="e.value"
                    :key="i"
                  ></el-option> </el-select
              ></el-form-item>
              <el-form-item label="录像状态" prop="status">
                <el-radio-group v-model="options.status">
                  <el-radio :label="e.value" v-for="e of deviceTypeOption" :key="e.value">{{ e.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="options form-content-options" v-if="false">
          <div class="item">
            <span>录像计划名称</span>
            <el-input
              v-model="options.name"
              placeholder="请输入录像计划名称"
              :maxlength="32"
              size="mini"
              :disabled="eventStatus"
            ></el-input>
          </div>
          <div class="item">
            <span>录像计划</span>
            <el-select v-model="options.planTemplateId" size="small">
              <el-option v-for="(e, i) of recordPlanOption" :label="e.label" :value="e.value" :key="i"></el-option>
            </el-select>
          </div>
          <div class="item">
            <span>录像码流</span>
            <el-select v-model="options.streamType" size="small">
              <el-option v-for="(e, i) of recordCodeOption" :label="e.label" :value="e.value" :key="i"></el-option>
            </el-select>
          </div>
          <div class="item">
            <span>录像状态</span>
            <el-radio-group v-model="options.status">
              <el-radio :label="e.value" v-for="e of deviceTypeOption" :key="e.value">{{ e.label }}</el-radio>
            </el-radio-group>
          </div>
          <!-- <div class="item">
            <span>存储位置</span>
            <el-select v-model="options.storageServerId" size="small">
              <el-option v-for="(e,i) of storageLocOption" :label="e.label" :value="e.value" :key="i"></el-option>
            </el-select>
          </div>
          <div class="item">
            <span>录像性质</span>
            <template>定时</template>
          </div> -->
        </div>
        <!-- 已选资源 -->
        <div class="table" v-if="!patternBoolean">
          <span>已选资源</span>
          <el-table
            stripe
            size="small"
            :data="resData"
            height="341"
            style="width: 100%"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            empty-text
          >
            <el-table-column label="序号" type="index" width="60" align="center"> </el-table-column>
            <el-table-column
              v-for="e of resColumns"
              :key="e.prop"
              :prop="e.prop"
              :label="e.label"
              :width="e.width"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" width="60" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="deleteFun(scope.$index, scope.row)"
                  icon="el-icon-close"
                  type="text"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 已选组织 -->
        <div class="tableBox" v-else>
          <div class="table">
            <span>已选组织</span>
            <el-table
              stripe
              size="small"
              :data="orgData"
              height="341"
              style="width: 100%"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
              empty-text
              :row-class-name="
                ({ row, rowIndex }) => {
                  row.index = rowIndex
                }
              "
              @row-click="getchanelsByKeyPartId"
            >
              <el-table-column label="序号" type="index" width="60" align="center"> </el-table-column>
              <el-table-column
                v-for="e of orgColumns"
                :key="e.prop"
                :prop="e.prop"
                :label="e.label"
                :width="e.width"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作" width="60" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click.stop="deleteFun(scope.$index, scope.row)"
                    icon="el-icon-close"
                    type="text"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table">
            <span>组织所对应的资源</span>
            <el-table
              stripe
              size="small"
              :data="org2ResData"
              height="341"
              style="width: 100%"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
              empty-text
            >
              <el-table-column label="序号" type="index" width="60" align="center"> </el-table-column>
              <el-table-column
                v-for="e of org2ResColumns"
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
        </div>
        <!-- 录入时间项 -->
        <div class="form-content-bottom">
          <div class="form-item">
            <div class="form-item-label">录入时间</div>
            <div class="form-item-value">{{ options.updatedAt }}</div>
          </div>
          <div class="form-item">
            <div class="form-item-label">录入机构</div>
            <div class="form-item-value">{{ options.updatedDept }}</div>
          </div>
          <div class="form-item">
            <div class="form-item-label">录入人</div>
            <div class="form-item-value">{{ options.updatedBy }}</div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="btn">
          <el-button @click="save" size="small" type="primary" :disabled="disabledBtn">保存</el-button>
          <el-button @click="cancel" size="small">取消</el-button>
          <el-button @click="reset" size="small">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../common/breadcrumb.vue'
import treeBox from '@src/components/tree/treeBox'
import switchBox from '../common/switchBox'
import { getTreeApi, getLazyTreeApi } from '@src/http/video/videoPreview.api.js'
import {
  postRecordPlanApi, // 添加录像计划（定时/事件）
  putRecordPlanApi, // 编辑录像计划（定时/事件）
  getRecordPlanDetailApi
} from '@src/http/video/recordConfig.api.js'
import common from '../common'
import { mapState, mapMutations, mapGetters } from 'vuex'
import create from '@src/assets/rules/validation/security/video/video_save.js'
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
  name: 'PlaneInfo',
  mixins: [common],
  components: {
    switchBox,
    treeBox,
    breadcrumb
  },
  created() {
    this.checkGroupStatus.checkAll = true
    this.checkedItem = this.deviceClass.map(e => e.value)
    this.customizeQuery.params.hostType = this.checkedItem.toString()
    // this.eventStatus  true 是编辑    ，false是新建
    // this.pattern, // 添加方式：1 按资源  2 按组织
    // 若为编辑
    if (this.eventStatus) {
      /**
       * 编辑时
       * 禁止编辑 按组织添加 或 按资源添加 选项
       * 根据当前所使用的类型显示
       */
      this.defaultNodeKeys = []
      this.switchToggle = false // 是否显示开关
      this.switchChange(this.pattern)
      this.getDatalist(this.changeComponent.data)
    } else {
      this.options.planTemplateId = (this.recordPlanOption[0] && this.recordPlanOption[0].value) || ''
    }
    // this.testFunction()
  },
  mounted() {},
  data() {
    return {
      filterTreeItem: null, // 机构数右上角过滤选项定时器
      defaultNodeKeys: [], // 默认展开的机构数nodeKey
      resReviewData: {}, // 从预览页面点击编辑获取到的数据
      orgIds: [], // 按组织 被选组织内所有资源id
      switchToggle: true, // 是否显示 switch 组件
      tableData: [], // 表格数据
      resColumns: [
        // 所选资源表
        { prop: 'orgName', label: '所属机构', width: '220' },
        { prop: 'keyPartName', label: '所属重点部位', width: '220' },
        { prop: 'deviceName', label: '所属设备', width: '220' },
        { prop: 'name', label: '资源名称', width: '220' },
        { prop: 'ip', label: 'IP', width: '120' }
      ],
      orgColumns: [
        // 所选组织表
        { prop: 'orgName', label: '所属机构', width: '220' },
        { prop: 'keyPartName', label: '所属重点部位', width: '220' },
        { prop: 'resNum', label: '资源数量', width: '80' }
      ],
      org2ResColumns: [
        // 所选组织对应资源表
        { prop: 'deviceName', label: '所属设备', width: '220' },
        { prop: 'name', label: '资源名称', width: '220' },
        { prop: 'ip', label: 'IP', width: '120' },
        { prop: 'subType', label: '资源类型', width: '80' }
      ],
      options: {
        name: '', // 录像计划名称
        streamType: 1, // 录像码流
        planTemplateId: '', // 录像计划
        status: 1, // 录像状态
        updatedAt: '', // 录入时间
        updatedBy: '', // 录入人
        updatedDept: '' // 录入机构
        // storageServerId:'' //存储位置id
      },
      customizeQuery: {
        // 机构树传参
        params: {
          isRecursion: 1,
          subSystem: 1,
          channelType: 1
        }
      },
      checkGroupStatus: {
        // 全选组 状态
        indeterminate: false, // 复选框不确定状态
        checkAll: false // 机构树筛选选中项
      },
      // deviceClass:
      // // [ // 机构树筛选备选项
      // //   { value: 1, label: 'NVR' },
      // //   { value: 2, label: 'HDVR' },
      // //   { value: 3, label: 'DVR' },
      // //   { value: 4, label: 'IPC' },
      // //   { value: 165, label: 'Vnvr' }
      // // ]
      // this.deviceClass
      // ,
      checkedItem: [], // 机构树筛选 选中项
      listBoxToggle: false, // 过滤栏 显隐性
      resData: [], // 资源data
      orgData: [], // 组织data
      org2ResData: [],
      checkForm: create.saveCheck // 表单校验
    }
  },
  computed: {
    ...mapState('videoManage', {
      deviceTypeOption: ({ recordConfig }) => recordConfig.deviceTypeOption, // 设备启用停用备选项
      recordCodeOption: ({ recordConfig }) => recordConfig.recordCodeOption, // 录像码流备选项
      recordPlanOption: ({ recordConfig }) => recordConfig.recordPlanOption, // 录像计划
      storageLocOption: ({ recordConfig }) => recordConfig.storageLocOption, // 存储位置
      pattern: ({ recordConfig }) => recordConfig.pattern // 按资源查看-1 按组织查看-2
    }),
    ...mapGetters('videoManage', {
      channelClass: 'channelClass',
      deviceClass: 'deviceClass', // 从vuex拿设备类型
      patternBoolean: 'patternBoolean' // 查看类型 Boolean 按资源查看-false 按组织查看-true
    }),
    // 复选框禁用选项
    // checkboxDisabled: function() {
    //   return { type: this.eventStatus ? 'tierType' : '', data: ['org', 'loc', 'equ', 'res'] }
    // },
    // 事件类型 编辑-true 新建-false
    eventStatus: function() {
      return Boolean(this.changeComponent.data)
    },
    // 保存按钮禁用
    disabledBtn: function() {
      // return (!this.resData.length && !this.orgData.length) || !this.options.name || !this.options.recordPlan
      return false
    }
  },
  watch: {
    orgData() {
      // 监听orgData变化获取所有资源id
      this.orgIds = []
      this.orgData.forEach(item => {
        this.orgGetAllchannelId(item)
      })
    }
  },
  methods: {
    ...mapMutations('videoManage', ['SET_PATTERN']),
    formatter(row, column) {
      let classindex = row.subType
      if (column.property == 'subType') {
        let a = this.channelClass.video.filter(i => {
          return i.value == classindex
        })
        console.log(a)
        return a && a.length ? a[0].label : ''
      }
      return row[column.property]
      //  if(column)
    },
    // 获取当前事件data
    getDatalist(id) {
      // 获取预览数据
      getRecordPlanDetailApi(id)
        .then(res => {
          if (!res.data.code) {
            let data = res.data.data
            // 数据处理
            this.options = {
              name: data.name, // 录像计划名称
              planTemplateId: data.planTemplateId, // 录像计划id
              streamType: data.streamType, // 录像码流类型 1主码流，2子码流，3.第三码流
              status: data.status, // 1启用，2停用
              // storageServerId: data.storageServerId, // 存储位置id
              planTaskType: data.planTaskType, // 录像性质:1定时，2事件
              configType: data.configType, // 添加方式：1 按资源  2 按组织
              updatedAt: data.updatedAt, // 录入时间
              updatedBy: data.updatedBy, // 录入机构
              updatedDept: data.updatedDept // 录入人
            }
            this.resReviewData = this.$lodash.cloneDeep(data) //
            // 不论时组织添加的还是按资源添加的 编辑时统一附给按资源添加时的table表格上
            if (this.pattern == 1) {
              // 按资源
              data.channelList.forEach(itm => {
                itm.id = itm.channelId
                itm.name = itm.channelName
              })
              this.resData = data.channelList
              let s = this.resData.map(it => {
                this.defaultNodeKeys.push(`org${it.orgId}`)
                this.defaultNodeKeys.push(`loc${it.keyPartId}`)
                this.defaultNodeKeys.push(`equ${it.deviceId}`)
                return `res${it.channelId}`
              })
              this.setCheckedKeys(s) // 默认选中机构树的结点
            } else if (this.pattern == 2) {
              // 按组织
              // this.orgData=data.channelList;
              // 分离出重要部位
              // this.filterkeyPartId(data.channelList);
              this.orgData = []
              data.channelList.forEach((fl, index) => {
                if (!this.orgData.length) {
                  this.orgData.push({
                    keyPartId: fl.keyPartId,
                    keyPartName: fl.keyPartName,
                    orgName: fl.orgName,
                    orgId: fl.orgId
                  })
                } else {
                  for (let i = 0; i < this.orgData.length; i++) {
                    let orgDataitem = this.orgData[i]
                    if (fl.keyPartId == orgDataitem.keyPartId) {
                      return
                    }
                    if (i == this.orgData.length - 1) {
                      this.orgData.push({
                        keyPartId: fl.keyPartId,
                        keyPartName: fl.keyPartName,
                        orgName: fl.orgName,
                        orgId: fl.orgId
                      })
                    }
                  }
                }
              })
              let s = this.orgData.map(it => {
                this.defaultNodeKeys.push(`org${it.orgId}`)
                return `loc${it.keyPartId}`
              })
              this.setCheckedKeys(s) // 默认选中机构树的结点
            }
          } else {
            throw res.data.message
          }
        })
        .catch(err => {
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: '数据获取失败',
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    // 去重kayPartId
    // filterkeyPartId(channelList) {
    //       // let keyPartIds=Array.from(new Set(channelList.map((m)=>m.keyPartId))); //过滤去重kayPartId
    // },
    // 保存
    save() {
      this.$refs['options'].validate((valid) => {
        if (valid) {
          // this.$emit('modelChange')
          // this.skipModal('recordPlaneShow', 'recordPlaneInfo', '1')
          // return
          let param = {
            name: this.options.name, // 录像计划名称
            planTemplateId: this.options.planTemplateId.toString(), // 录像计划id
            streamType: this.options.streamType, // 录像码流类型 1主码流，2子码流，3.第三码流
            status: this.options.status, // 1启用，2停用
            // storageServerId: this.options.storageServerId, // 存储位置id
            planTaskType: 1, // 录像性质:1定时，2事件
            configType: this.pattern, // 添加方式：1 按资源  2 按组织
            rIds: this.orgIds
          }
          // 按资源查看-false 按组织查看-true
          if (this.patternBoolean) {
            // 按组织查看
          } else {
            param.rIds = this.resData.map(e => e.id).filter(e => e)
          }
          if (this.pattern == 2 && !this.orgIds.length) {
            // 新建时必须添加组织

            this.$notify({
              title: NOTIFY.TITLE.WARNING,
              message: '请选择要添加的组织',
              type: NOTIFY.TYPE.WARNING
            })
            return
          }
          this.queryFunciton(param).then(res => {
            if (!res.data.code) {
              this.$notify({
                title: NOTIFY.TITLE.SUCCESS,
                message: `${this.eventStatus ? '编辑' : '创建'}成功`,
                type: NOTIFY.TYPE.SUCCESS
              })
              if (this.changeComponent.from == 'recordPlaneList') {
                this.skipModal(this.changeComponent.from, this.changeComponent.to)
              } else {
                this.skipModal(
                  'recordPlaneShow',
                  'recordPlaneInfo',
                  this.eventStatus ? this.resReviewData.id : res.data.data.id
                )
              }
              this.$emit('modelChange')
            } else {
              throw res.data.message
            }
          }).catch(err => {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: `${this.eventStatus ? '编辑' : '创建'}失败，${err.includes('资源rIds数组不能为空') ? '资源选择不能为空' : ''}`,
              type: NOTIFY.TYPE.ERROR
            })
          })
        }
      })
    },
    // 请求方法
    queryFunciton(params) {
      if (this.eventStatus) {
        // true-编辑 false-新建
        // let param = []
        // params.rIds.forEach(e => {
        //   param.push({
        //     id: e,
        //     name: params.name, //录像计划名称
        //     planTemplateId: params.planTemplateId,
        //     streamType: params.streamType,
        //     status: params.status,
        //     planTaskType: 1,
        //     configType: this.pattern
        //   })
        // })
        params.id = this.resReviewData.id
        // delete params.rIds;
        return putRecordPlanApi(params)
      } else {
        return postRecordPlanApi(params)
      }
    },
    // 取消
    cancel() {
      this.skipModal('recordPlaneList')
      this.$emit('modelChange')
    },
    // 重置
    reset() {
      if (this.eventStatus) {
        // this.resReviewData
        this.options.streamType = this.resReviewData.streamType // 录像码流
        this.options.planTemplateId = this.resReviewData.planTemplateId // 录像计划
        this.options.status = this.resReviewData.status // 录像状态
      } else {
        this.options.name = ''
        this.options.streamType = 1
        this.options.planTemplateId = (this.recordPlanOption[0] && this.recordPlanOption[0].value) || ''
        this.options.status = 1
      }
    },
    // 删除
    deleteFun(index, row) {
      this.org2ResData = []
      if (this.patternBoolean) {
        this.orgData.splice(index, 1)
      } else {
        this.resData.splice(index, 1)
      }
    },
    // switch 开关改变
    switchChange(val) {
      this.SET_PATTERN(val)
      this.orgData = []
      this.org2ResData = []
      this.resData = []
      this.orgIds = []
    },
    // 获取机构树节点 node
    getNode(id) {
      return this.$refs.treeBox.getNode(id)
    },
    // 默认选中机构数节点
    setCheckedKeys(arr) {
      return this.$refs.treeBox.setCheckedKeys(arr)
    },
    // 懒加载机构树接口
    getTreeApi(params) {
      return getLazyTreeApi(params)
    },
    // 懒加载递归机构树接口
    lazyTreeCheckApi(params) {
      return getTreeApi(params)
    },
    // 勾选机构树
    checkclick(data, node, status) {
      /**
       * 如果按资源配置，且所选为资源 patternBoolean-false
       * 如果按组织配置，且所选为重点部位 patternBoolean-true
       */
      // if (this.eventStatus) { return }
      this.orgData = []
      this.resData = []
      status.checkedNodes.map(e => {
        const node = this.getNode(e.nodeKey)
        if (node && this.patternBoolean && e.tierType === 'loc') {
          // 按组织
          this.orgData.push({
            ...e,
            orgId: node.level !== 1 && node.parent.data.id,
            orgName: node.level !== 1 && node.parent.data.name,
            keyPartId: e.id,
            keyPartName: e.name
          })
        } else if (node && !this.patternBoolean && e.tierType === 'res') {
          // 按资源
          this.resData.push({
            ...e,
            orgId:
              node.level !== 1 &&
              node.parent.level !== 1 &&
              node.parent.parent.level !== 1 &&
              node.parent.parent.parent.data.id,
            orgName:
              node.level !== 1 &&
              node.parent.level !== 1 &&
              node.parent.parent.level !== 1 &&
              node.parent.parent.parent.data.name,
            keyPartId:
              node.level !== 1 &&
              node.parent.level !== 1 &&
              node.parent.parent.level !== 1 &&
              node.parent.parent.data.id,
            keyPartName:
              node.level !== 1 &&
              node.parent.level !== 1 &&
              node.parent.parent.level !== 1 &&
              node.parent.parent.data.name,
            deviceName:
              node.level !== 1 && node.parent.level !== 1 && node.parent.parent.level !== 1 && node.parent.data.name
            // resId: e.id,
            // resName: e.name
          })
        }
      })
    },
    // 机构树过滤方法
    filterNode(data) {
      return true
    },
    // 机构树过滤功能
    treeFilter() {
      // this.checkedItem
      // this.$refs.treeBox.filterText()
    },
    // 全选
    handleCheckAllChange(val) {
      if (val) {
        this.checkGroupStatus.indeterminate = false
        this.checkedItem = this.deviceClass.map(e => e.value)
      } else {
        this.checkedItem = []
      }
      this.customizeQuery.params.hostType = this.checkedItem.toString()
      this.$refs.treeBox.refresh()
      // this.treeFilter()
    },
    // 单选
    handleCheckSingleChange(val) {
      // let selCount = this.checkedItem.length
      // let allCount = this.deviceClass.length
      // this.checkGroupStatus.indeterminate = selCount !== allCount && !!selCount
      // this.checkGroupStatus.checkAll = selCount === allCount
      // this.treeFilter()
      this.customizeQuery.params.hostType = val.toString()
      clearTimeout(this.filterTreeItem)
      this.filterTreeItem = setTimeout(() => {
        this.$refs.treeBox.refresh()
      }, 800)
    },
    // 单击表格
    getchanelsByKeyPartId(row, column, event) {
      // this.org2ResData = this.orgData[row.index].children || []
      this.org2ResData = []
      let keyPart = {
        kpId: row.keyPartId,
        type: 0,
        isRecursion: 1,
        subSystem: 1,
        channelType: 1
      }
      this.lazyTreeCheckApi(keyPart).then(res => {
        if (!res.data.code) {
          if (res.data.data && res.data.data.tree) {
            res.data.data.tree.forEach(item => {
              if (item.children.length) {
                item.children.forEach(r => {
                  r.deviceName = item.name
                })
                this.org2ResData = [...this.org2ResData, ...item.children]
              }
            })
          }
        } else {
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: '资源数据获取失败',
            type: NOTIFY.TYPE.ERROR
          })
        }
      })
    },
    orgGetAllchannelId(row) {
      let keyPart = {
        kpId: row.keyPartId,
        type: 0,
        isRecursion: 1,
        subSystem: 1,
        channelType: 1
      }
      this.lazyTreeCheckApi(keyPart).then(res => {
        if (!res.data.code) {
          if (res.data.data && res.data.data.tree) {
            res.data.data.tree.forEach(item => {
              if (item.children.length) {
                this.orgIds = [...this.orgIds, ...item.children.map(e => e.id).filter(e => e)]
              }
            })
          }
        } else {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.planeInfo {
  width: 100%;
  height: 100%;
  display: flex;
  .leftTree {
    width: 280px;
    height: 100%;
    .treeTop {
      display: flex;
      justify-content: space-between;
      padding: 0 6px;
      position: relative;
      .switch {
        width: 168px;
      }
      i {
        height: 30px;
        line-height: 30px;
        width: 20px;
        cursor: pointer;
        text-align: center;
      }
      .listBox {
        width: 80px;
        padding: 5px;
        position: absolute;
        background: #fff;
        box-shadow: 0px 0px 8px 5px #ccc;
        right: 0;
        top: 24px;
        z-index: 1;
        /deep/ span {
          font-size: 0.8em;
        }
      }
    }
    .treeTop + .treeBox {
      height: calc(~'100% - 30px');
    }
  }
  .content {
    width: calc(~'100% - 280px');
    padding-left: 10px;
    .header {
      margin-bottom: 10px;
    }
    .main {
      height: calc(~'100% - 71px');
      overflow: auto;
      .form-content-title {
        width: 1120px;
        text-align: center;
        font-size: 16px;
        padding: 10px 0;
      }
      .table,
      .options {
        border: 1px solid #ebeef5;
        margin-bottom: 16px;
        padding: 8px;
      }
      .tableBox {
        width: 1430px;
      }
      .table {
        display: inline-block;
        & > div {
          margin-top: 6px;
        }
        /deep/ .el-table::before {
          background-color: inherit;
        }
        /deep/ button {
          padding: 0;
          min-width: unset;
        }
        /deep/ .el-icon-close {
          border: 1px solid #000;
          border-radius: 4px;
          font-weight: bold;
          padding: 1px;
          color: #000;
        }
      }
      // 上方选择栏
      .form-content-options {
        width: 1120px;
        display: flex;
        flex-wrap: wrap;
        background: rgba(245, 245, 245, 1);
        .item {
          width: 33.3%;
          flex: auto;
          padding-bottom: 20px;
          & > span {
            display: inline-block;
            width: 85px;
            text-align: center;
            margin-right: 12px;
            background-color: #f8f8f8;
            height: 30px;
            line-height: 30px;
          }
          /deep/ .el-select,
          /deep/ .el-input {
            width: 220px;
          }
        }
      }
      // 下方 录入人/时间/机构
      .form-content-bottom {
        width: 1120px;
        display: flex;
        height: 36px;
        font-size: 12px;
        background: rgba(245, 245, 245, 1);
        border: 1px solid rgba(225, 225, 225, 1);
        margin-top: 10px;
        .form-item {
          flex: 1;
          display: flex;
          .form-item-label {
            width: 45%;
            line-height: 34px;
            text-align: center;
          }
          .form-item-value {
            width: 55%;
            line-height: 34px;
            text-align: center;
            background: white;
          }
        }
      }
      .btn {
        width: 1120px;
        text-align: center;
        margin-top: 16px;
        button {
          margin: 0 16px;
        }
      }
    }
  }
}
//
.condition-box {
  width: 100%;
  max-width: 1360px;
  margin-bottom: 10px;
  .query-form {
    width: 100%;
    background: rgba(245, 245, 245, 1);
    padding: 16px 16px 2px 16px;
    box-sizing: border-box;
    /deep/ .el-form {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 33%;
        display: flex;
        // margin-left: 3%;
        /deep/ .el-form-item__label {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          width: 150px;
        }
        .el-form-item__content {
          width: 100%;
          .el-select {
            width: 100%;
          }
        }
      }
    }
  }
  .opt-button {
    text-align: center;
    margin-top: 30px;
  }
}
//
</style>
