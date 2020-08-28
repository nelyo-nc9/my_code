<!-- 设备巡检新建查看 -->
<template>
  <div>
    <!-- 编辑 -->
    <div v-if="isView">
      <div>
        <!-- 面包 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="margin:10px;">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
          <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
          <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{titleDa?titleDa:'创建'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 按钮组1 -->
        <div class="top-button">
          <el-button size="mini" @click="handleSaveValidator">保 存</el-button>
          <el-button size="mini" @click="handleReset">重 置</el-button>
          <el-button size="mini" v-print="'#printContent'">打 印</el-button>
        </div>
        <!-- 表单组 -->
        <div id="printContent" class="formTit">
          <div class="title-name">巡检任务{{titleDa?titleDa:'创建'}}</div>
          <div>
            <!--  ref="ruleForm" -->
            <el-form ref="addFrom" :model="addFrom" :rules="rules" size="mini" label-width="100px" border>
              <div class="form-content">
                <div class="form-left-container">
                  <el-form-item label="巡检计划名称" prop="inspectName">
                    <el-input size="mini" v-model="addFrom.inspectName" placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="子系统" prop="subSystemId">
                    <el-select size="mini" v-model="addFrom.subSystemId" placeholder="请选择">
                      <el-option v-for="item in subSystemOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="子系统" prop="subSystemId">
                    <el-select size="mini" v-model="addFrom.subSystemId" @change="subSystemChangeHandler" placeholder="请选择">
                      <el-option v-for="item in subSystemOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="巡检项" prop="inspectItem">
                    <el-checkbox label="在线" v-model="addFrom.isOnline" ></el-checkbox>
                    <el-checkbox v-if="addFrom.subSystemId === 1" label="硬盘" v-model="addFrom.isInspectDisk" ></el-checkbox>
                    <el-checkbox v-if="addFrom.subSystemId === 1" label="视频" v-model="addFrom.isInspectVideo"  ></el-checkbox>
                  </el-form-item>
                </div>
                <div class="form-right-container">
                  <el-form-item label="巡检周期" prop="inspectPeriod">
                    <el-select size="mini" v-model="addFrom.inspectPeriod" placeholder="请选择">
                      <el-option label="每一天" :value="1"></el-option>
                      <el-option label="每二天" :value="2"></el-option>
                      <el-option label="每三天" :value="3"></el-option>
                      <el-option label="每四天" :value="4"></el-option>
                      <el-option label="每五天" :value="5"></el-option>
                      <el-option label="每六天" :value="6"></el-option>
                      <el-option label="每七天" :value="7"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="设备类型" prop="deviceType">
                    <el-select size="mini" :value="addFrom.deviceType" v-model="addFrom.deviceType" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="设备类型" prop="deviceType">
                    <el-select size="mini" :value="addFrom.deviceType" v-model="addFrom.deviceType" @change="deviceTypeChangeHandler" placeholder="请选择">
                      <el-option v-for="item in subSystemOptions[addFrom.subSystemId - 1].sub" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="巡检时间" prop="inspectAt">
                    <el-time-picker value-format="HH:mm:ss" size="mini" v-model="addFrom.inspectAt" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="请选择">
                    </el-time-picker>
                  </el-form-item>
                </div>
              </div>
              <!-- 双树 -->
              <div class="box-title">
                <span class="pointer" @click="changeShow">
                  巡检对象
                  <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
              <div class="tree-two" v-if="isShow">
                <!-- <tree-transfer class="tree-content" :from_data='getTreeApi' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :mode='mode' filter openAll>
                </tree-transfer> -->
                <div class="left">
                  <treeBox @getCheckedNodes="getCheckedNodes" ref="tree" :treeType="1" show-checkbox :lazyTreeCheckApi="getTreeApi" checkRecursionToggle :checkboxToggle="true" :lazyTreeApi="getTreeApi" searchType="filter" @checkclick="checkclick1" :customizeQuery="customizeQuery" treeLazyToggle iconToggle></treeBox>
                </div>
                <div class="content">
                  <div><i class="el-icon-back" @click="handleBack"></i></div>
                  <div><i class="el-icon-right" @click="handleRihgh"></i></div>
                </div>
                <div class="right">
                  <el-table :data="tableData3" @select="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="name" label="设备名称" width="auto">
                    </el-table-column>
                  </el-table>
                  <!-- <treeBox :checkRecursionToggle="true" :checkboxToggle="true" :lazyTreeApi="toData"  searchType="toData"  treeLazyToggle iconToggle></treeBox> -->
                  <!-- <el-tree :data="toData" show-checkbox node-key="id" style="overflow:auto;"></el-tree> -->
                </div>
              </div>
            </el-form>

            <div class="people-infor">
              <div>
                <span class="title">录入时间</span>
                <span class="num">{{addFrom.updatedAt}}</span>
              </div>
              <div>
                <span class="title">录入机构</span>
                <span class="num">{{addFrom.updatedDept}}</span>
              </div>
              <div>
                <span class="title">录入人</span>
                <span class="num">{{addFrom.updatedBy}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看 -->
    <div v-if="!isView">
      <!-- 进度条 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="margin:10px;">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
        <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <!-- 按钮组1 -->
        <div class="top-button">
          <el-button size="mini" @click="switchPage">新 建</el-button>
          <el-button size="mini" @click="handleEditor">编 辑</el-button>
          <el-button size="mini" @click="showConfirmDialog = true">删 除</el-button>
          <el-button size="mini" v-print="'#printContent2'">打印</el-button>
        </div>
        <!-- 表单组 -->
        <div class="formTit" id="printContent2">
          <div class="title-name">巡检任务查看</div>
          <div>
            <div class="info-detail">
              <div class="info-detail-item">
                <div class="info-detail-label">巡检计划名称</div>
                <div class="info-detail-value">{{ addFrom.inspectName }}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-detail-label">巡检周期</div>
                <div class="info-detail-value">{{ `每${['', '一', '二', '三', '四', '五', '六', '七'][addFrom.inspectPeriod]}天` }}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-detail-label">子系统</div>
                <div class="info-detail-value">{{ subSystemOptions.find(item => item.key === addFrom.subSystemId).label }}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-detail-label">设备类型</div>
                <div class="info-detail-value">{{ subSystemOptions[addFrom.subSystemId - 1].sub.find(item => item.key === addFrom.deviceType).label }}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-detail-label">巡检项</div>
                <div class="info-detail-value">{{ addFrom.isOnline ? '在线' : '' }}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-detail-label">巡检时间</div>
                <div class="info-detail-value">{{ addFrom.inspectAt }}</div>
              </div>
            </div>

            <!-- 显示隐藏 -->
            <div class="box-title">
              <span class="pointer" @click="changeShow">
                巡检对象
                <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>

            <!-- 表格  -->
            <div class="table-sty" v-if="isShow">
              <el-table
                :data="tableData3"
                border
                size="mini"
                stripe
                :height="'37vh'"

              >
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column
                  v-for="item in tableColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
              </el-table>
            </div>

            <div class="people-infor">
              <div>
                <span class="title">录入时间</span>
                <span class="num">{{addFrom.updatedAt}}</span>
              </div>
              <div>
                <span class="title">录入机构</span>
                <span class="num">{{addFrom.updatedDept}}</span>
              </div>
              <div>
                <span class="title">录入人</span>
                <span class="num">{{addFrom.updatedBy}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认删除对话框 -->
    <el-dialog
      title="确认删除"
      :visible.sync="showConfirmDialog"
      width="450px">
      <span>请确认是否删除当前巡检任务</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirmDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addTask, putTask, removeTask, getTreeApi, getOneItem } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
import treeBox from '@src/components/tree/treeBox'
// import taskView from './taskView'
export default {
  name: 'NewTask',
  components: { treeBox },
  props: {
    titleDa: {
      type: String,
      default: '新建'
    },
    isViews: {
      type: Boolean,
      default: false
    },
    isData: {
      type: Object,
      default() {
        return {
          inspectName: '',
          subSystemId: '',
          deviceType: '',
          inspectPeriod: '',
          inspectAt: '',
          status: '',
          updatedBy: '',
          updatedDept: '',
          updatedAt: '',
          isOnline: '',
          isInspectVideo: '',
          isInspectDisk: ''
        }
      }
    },
    isIds: {
      type: String,
      default: ''
    }
  },
  data() {
    const inspectNameValidator = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('巡检计划名称不能为空'))
      } else {
        let len = 0
        for (let i = 0; i < value.length; i++) {
          value.charCodeAt(i) > 255 ? len += 2 : len++
        }
        return len > 128 ? callback(new Error('不能超过128个字符或64个汉字')) : callback()
      }
    }
    const inspectItemValidator = (rule, value, callback) => {
      if (this.addFrom.isOnline === '' && this.addFrom.isInspectDisk === '' && this.addFrom.inspectPeriod === '') {
        return callback(new Error('请选择巡检项'))
      } else {
        return callback()
      }
    }
    // inspectName
    return {
      ids: '',
      isId: [],
      treeHostType: '',
      tableData2: [],
      tableData3: [],
      options: [],
      childId: '',
      tableData: [],
      addFrom: this.$lodash.cloneDeep(this.isData),
      rules: {
        inspectName: [{ required: true, validator: inspectNameValidator, trigger: 'blur' }],
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        subSystemId: [{ required: true, message: '请选择子系统', trigger: 'blur' }],
        inspectPeriod: [{ required: true, message: '请选择巡检周期', trigger: 'blur' }],
        inspectItem: [{ required: true, validator: inspectItemValidator, trigger: 'blur' }],
        inspectAt: [{ required: true, message: '请选择巡检时间', trigger: 'blur' }]
      },
      // 树的数据
      mode: 'transfer',
      title: [],
      toData: [],
      // // 表头数据
      tableColumn: [
        { prop: 'orgName', label: '所属机构', width: 'auto', sortable: true },
        { prop: 'keyPartName', label: '所属重点部位', width: 'auto', sortable: true },
        { prop: 'deviceName', label: '设备名称', width: 'auto', sortable: true },
        { prop: 'brand', label: '品牌', width: 'auto', sortable: true },
        { prop: 'modelNo', label: '型号', width: 'auto', sortable: true },
        { prop: 'assetCode', label: '资产编码', width: 'auto', sortable: true }
      ],
      // 控制显示于隐藏
      isShow: true,
      isView: false,

      newTitle: '',
      subSystemOptions: [
        {
          key: 1,
          label: '视频子系统',
          sub: [
            { key: 1, label: 'NVR' },
            { key: 2, label: 'HDVR' },
            { key: 3, label: 'DVR' },
            { key: 4, label: 'IPC' }
          ]
        },
        {
          key: 2,
          label: '报警子系统',
          sub: [
            { key: 1, label: '电话报警主机' },
            { key: 2, label: '网络报警主机' },
            { key: 3, label: '电子围栏总线报警主机' },
            { key: 4, label: '振动光纤报警主机' }
          ]
        },
        {
          key: 3,
          label: '门禁子系统',
          sub: [
            { key: 1, label: '普通门禁' },
            { key: 2, label: '联动互锁门' },
            { key: 3, label: '金库门禁' }
          ]
        },
        {
          key: 4,
          label: '对讲子系统',
          sub: [
            { key: 1, label: '对讲主机列表' },
            { key: 2, label: '话筒列表' }
          ]
        },
        {
          key: 5,
          label: '防护舱子系统',
          sub: [
            { key: 1, label: '防护舱' }
          ]
        },
        {
          key: 6,
          label: '停车场子系统',
          sub: [
            { key: 1, label: '停车场' }
          ]
        },
        {
          key: 7,
          label: '电视子系统',
          sub: [
            { key: 1, label: '解码器' },
            { key: 2, label: '解码拼控一体机' },
            { key: 3, label: 'LED设备' }
          ]
        }
      ],
      customizeQuery: { // 机构数参数
        keywords: [], // 关键字
        params: {
          subSystem: 1,
          hostType: 1
        } // 静态参数
      },
      isDataChange: {},
      showConfirmDialog: false // 确认对话框显隐
    }
  },
  created() {
    this.ids = this.isIds
    this.tableData3 = this.isData.inspectObject && this.isData.inspectObject.map(item => {
      item['name'] = item['deviceName']
      item['id'] = item['deviceId']
      return item
    })

    if (this.addFrom.inspectObject) {
      this.tableData = this.addFrom.inspectObject
    } else {
      // this.tableData = [{},{},{},{},{},{}]
    }
    this.isView = this.isViews
  },
  mounted() {
  },
  methods: {
    subSystemChangeHandler(val) {
      this.customizeQuery.params.subSystem = val
      this.customizeQuery.params.hostType = 1
      this.addFrom.deviceType = 1
      this.$refs.tree.refresh()

      this.tableData3 = []
    },
    deviceTypeChangeHandler(val) {
      this.customizeQuery.params.hostType = val
      this.$refs.tree.refresh()

      this.tableData3 = []
    },
    // 巡检周期格式化
    conversion(count) {
      let nums = ['零', '一', '二', '三', '四', '五', '六', '七']
      return `每${nums[count]}天`
    },

    handleBack() {
      this.tableData3 = this.tableData3.filter((v) => {
        return !this.isId.includes(v.id)
      })
    },
    handleRihgh() {
      this.tableData3 = this.tableData2
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
      this.isId = this.selectData.map(item => item.id)
      console.log(this.isId)
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    checkclick1(data, node, status) {
      console.log(data, 'data')
      console.log(node, 'node')
      console.log(status, 'status')
      console.log(this.$refs.tree.getCheckedNodes(true), '!!!')
      this.tableData2 = []
      let data1 = this.$refs.tree.getCheckedNodes(true)
      data1.forEach(v => {
        if (v.tierType === 'equ') {
          this.tableData2.push(v)
        }
      })
      console.log(data1)
      // this.tableData2 =data1
    },
    changeShow() {
      this.isShow = !this.isShow
    },
    getCheckedNodes(val) {
      console.log(val, '098901')
    },
    handleSaveValidator() {
      this.$refs['addFrom'].validate((valid) => {
        if (valid) {
          this.handleSave()
        } else {
          return false
        }
      })
    },
    // 保存
    handleSave() {
      let params = {
        inspectName: this.addFrom.inspectName,
        subSystemId: this.addFrom.subSystemId,
        // deviceType: this.addFrom.deviceType,
        inspectPeriod: this.addFrom.inspectPeriod,
        inspectAt: this.addFrom.inspectAt,
        isOnline: this.addFrom.isOnline === 'T' || this.addFrom.isOnline === true ? 'T' : 'F',
        isInspectDisk: this.addFrom.isInspectDisk === 'T' || this.addFrom.isInspectDisk === 'true' ? 'T' : 'F',
        isInspectVideo: this.addFrom.isInspectVideo === 'T' || this.addFrom.isInspectVideo === true ? 'T' : 'F'
      }
      params['dIds'] = this.tableData3 && this.tableData3.map(item => {
        return item.id
      })

      if (this.addFrom.subSystemId !== 5 && this.addFrom.subSystemId !== 6) {
        params['deviceType'] = this.addFrom.deviceType
      }

      if (!params.dIds) {
        this.$messageError('请选择巡检对象')
        return
      }

      if (this.titleDa === '修改') {
        putTask(this.isData.id, params).then(res => {
          let result = res.data
          this.$messageSuccess(result.message)
          this.isView = false // 切换查看
          this.getDetailInfo(this.isData.id) // 查询数据
        })
      } else {
        addTask(params).then(res => {
          let result = res.data
          if (result.message.code === 1) {
            this.$messageError('巡检计划名称已存在')
            return
          }
          if (result.code === 0) {
            let result = res.data
            this.$messageSuccess(result.message)
            this.ids = result.data.id
            this.getDetailInfo(this.ids)
            this.isView = false
          }
        })
      }
    },
    /**
     * @description: 查看 获取单条巡检任务详细信息
     * @param {type} 无
     * @return {type} 无
     */
    getDetailInfo(data) {
      getOneItem(data).then(res => {
        let result = res.data.data
        this.addFrom = result.task
        this.addFrom['isInspectVideo'] = result.task.isInspectVideo === 'T'
        this.addFrom['isInspectDisk'] = result.task.isInspectDisk === 'T'
        this.addFrom['isOnline'] = result.task.isOnline === 'T'

        this.tableData3 = result.task.inspectObject
      })
    },
    // 重置
    handleReset() {
      this.addFrom = {
        inspectName: '',
        subSystemId: '',
        deviceType: '',
        inspectPeriod: '',
        inspectAt: '',
        isOnline: false,
        isInspectDisk: false,
        isInspectVideo: false
      }
      this.tableData3 = []
      this.tableData2 = []
    },
    // 新建
    switchPage() {
      this.handleReset()
      this.isView = !this.isView
      this.tableData3 = []
      this.tableData2 = []
      this.titleDa = '新建'
    },
    // 编辑
    handleEditor() {
      this.$emit('giveValue', '修改', true, {}, this.ids)
      this.$parent.titleDa = '修改'
      this.isView = !this.isView
    },
    // 删除
    handleDel() {
      let params = {
        ids: [this.ids]
      }
      removeTask(params).then(res => {
        if (res.data && res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.showConfirmDialog = false
          this.$parent.changeList('TaskList')
        }
      })
    },
    // 树的事件
    changeMode() {
      if (this.mode === 'transfer') {
        this.mode = 'addressList'
      } else {
        this.mode = 'transfer'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin: 10px;
}
.top-button {
  margin: 10px 0 10px 10px;
}
.title-name {
  margin: 0 0 10px 560px;
  font-size: 14px;
  font-weight: 600;
}
.form-content {
  border: 1px solid #e1e1e1;
  width: 800px;
  // height: 140px;
  height: 180px;
  margin-left: 200px;
  padding: 15px 15px 10px 0;
  background: #f5f5f5;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  display: flex;
  .form-left-container {
    width: 50%;
    /deep/ .el-form-item__content {
      line-height: 35px;
    }
  }
  .form-right-container {
    width: 50%;
  }
  .el-select, .el-date-editor {
    width: 100%;
  }
}

// 查看详细信息样式
.info-detail {
  width: 800px;
  height: 114px;
  margin-left: 200px;
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  .info-detail-item {
    width: 50%;
    height: 38px;
    display: flex;
    line-height: 38px;
    .info-detail-label {
      flex: 1;
      text-align: center;
      background: #f5f5f5;
    }
    .info-detail-value {
      text-indent: 32px;
      flex: 2;
    }
  }
}

.box-title {
  position: relative;
  height: 24px;
  line-height: 24px;
  color: #606266;

  i {
    position: absolute;
    top: 50%;
    left: 85px;
    transform: translateY(-50%);
  }
  &::after {
    display: block;
    content: '';
    border-top: 1px solid #e1e1e1;
    width: calc(~'100% - 120px');
    margin-left: 100px;
    margin-top: -12px;
  }
}
.tree-two {
  width: 800px;
  height: 500px;
  margin: 0 0 50px 300px;
  position: relative;
  .left {
    width: 300px;
    height: 100%;
    display: inline-block;
  }
  .content {
    width: 80px;
    height: 100%;
    display: inline-block;
    position: relative;
    i {
      position: absolute;
      font-size: 35px;
      cursor: pointer;
      left: 20px;
    }
    .el-icon-back {
      top: 230px;
    }
    .el-icon-right {
      top: 270px;
    }
  }
  .right {
    position: absolute;
    width: 300px;
    height: 100%;
    display: inline-block;
    .el-table {
      height: 100%;
      width: 100%;
      overflow: auto;
      text-align: center;
    }
  }
  .tree-content {
    margin: 10px 0 0 200px;
    /deep/.transfer-center {
      .transfer-center-item {
        .el-button {
          width: 100px;
          border-radius: 20px;
          background-color: #2d71d3;
          i {
            font-style: 14px;
          }
        }
      }
    }
  }
}
.el-tree-node__label {
  font-size: 12px;
}
.people-infor {
  width: 800px;
  height: 30px;
  margin: 0px 0 10px 200px;
  font-size: 12px;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  div {
    float: left;
    width: 33.33%;
    height: 100%;
    display: flex;
    .title {
      flex: 3;
      background-color: #e1e1e1;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ffffff;
    }
    .num {
      flex: 7;
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  }
}
.table-sty {
  margin: 0 0 12px 200px;
  width: 800px;
}
@media print {
  .formTit {
    width: 1040px;
    height: 1000px;
    margin-top: 400px;
    .title-name {
      margin: 0 0 10px 560px;
      font-size: 14px;
      font-weight: 600;
    }
    .form-content {
      border: 1px solid #e1e1e1;
      width: 800px;
      height: 140px;
      margin-left: 200px;
      box-sizing: border-box;
      padding: 2px;
      .form-inner {
        display: flex;
        width: 100%;
        height: 25%;
        .form-item {
          display: flex;
          width: 50%;
          height: 100%;
          .bg-c {
            display: inline-block;
            width: 120px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: #e1e1e1;
          }
          span {
            display: inline-block;
            width: 270px;
            text-align: center;
            font-size: 12px;
          }
          .el-input {
            width: 270px;
            height: 30px;
          }
          .el-select {
            width: 270px;
            height: 30px;
          }
          .el-checkbox-group {
            display: inline-block;
            width: 270px;
            height: 30px;
          }
        }
      }
    }

    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      margin-left: 150px;

      i {
        position: absolute;
        top: 50%;
        left: 85px;
        transform: translateY(-50%);
      }
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-left: 100px;
        margin-top: -12px;
      }
    }
    .tree-two {
      width: 800px;
      height: 350px;
      .tree-content {
        margin: 10px 0 0 200px;
      }
    }
    .el-tree-node__label {
      font-size: 12px;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 0px 0 10px 200px;
      font-size: 12px;
      border: 1px solid #e1e1e1;
      box-sizing: border-box;
      div {
        float: left;
        width: 33.33%;
        height: 100%;
        display: flex;
        .title {
          flex: 3;
          background-color: #e1e1e1;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ffffff;
        }
        .num {
          flex: 7;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
