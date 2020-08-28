<template>
  <div class="relevance-box">
    <div class="collapses">
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('videoStatus')">
            系统设备列表
            <i :class="dropDownStatus.videoStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div class="table-box" v-show="dropDownStatus.videoStatus">
          <div style="margin:10px 0;padding-right:30px; text-align:right;" v-if="title !== '详情'">
            <i class="el-icon-circle-plus-outline" style="margin-right:10px;cursor: pointer;" @click="clickAdd"></i>
            <i class="el-icon-edit" style="margin-right:10px;cursor: pointer;" @click="clickEdit"></i>
            <i class="el-icon-delete" style="margin-right:10px;cursor: pointer;" @click="clickDelete"></i>
            <i class="el-icon-refresh" style="cursor: pointer;" @click="clickResh"></i>
          </div>
          <el-table
            stripe
            border
            size="medium"
            ref="tableList"
            :data="tableData"
            @selection-change="select"
            style="width: 100%"
            height="300"
          >
            <!-- 复选框 -->
            <el-table-column type="selection" width="55" align="center"> </el-table-column>
            <!-- 序号 -->
            <el-table-column label="序号" type="index" align="center" width="80"> </el-table-column>
            <template v-if="sidebarActiveId !== 11">
              <el-table-column
                v-for="(column, index) in videoColumns"
                :key="index"
                :prop="column.prop"
                :label="column.label"
                sortable
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row[column.prop] === 1 && column.prop === 'status'">离线</span>
                  <span v-if="scope.row[column.prop] === 2 && column.prop === 'status'">在线</span>
                  <span v-if="scope.row[column.prop] === 3 && column.prop === 'status'">故障</span>
                  <span v-if="scope.row[column.prop] === 4 && column.prop === 'status'">报警</span>
                  <span v-if="column.prop !== 'status'">{{ scope.row[column.prop] }}</span>
                </template>
              </el-table-column>
            </template>
            <template v-if="sidebarActiveId === 11">
              <el-table-column
                v-for="(column, index) in videoColumn"
                :key="index"
                :prop="column.prop"
                :label="column.label"
                sortable
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row[column.prop] === 1 && column.prop === 'status'">离线</span>
                  <span v-if="scope.row[column.prop] === 2 && column.prop === 'status'">在线</span>
                  <span v-if="scope.row[column.prop] === 3 && column.prop === 'status'">故障</span>
                  <span v-if="scope.row[column.prop] === 4 && column.prop === 'status'">报警</span>
                  <span v-if="column.prop !== 'status'">{{ scope.row[column.prop] }}</span>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <!-- 分页 -->
          <div style="text-align:right;margin:30px 30px 30px 0;">
            <el-pagination
              style="text-align:right;display:inline-block;"
              :page-sizes="[10, 25, 50, 100, 200]"
              :page-size="pageSize"
              :current-page="pageCurrents"
              layout="total, sizes,slot, prev"
              :total="total"
              @size-change="pageSizeChange"
              @current-change="pageSizeCurrent"
            >
              <el-button type="text" :disabled="pageCurrent === 1" @click="pagePrev">首页</el-button>
            </el-pagination>
            <el-pagination
              style="text-align:right;display:inline-block;"
              :page-sizes="[10, 25, 50, 100, 200]"
              :page-size="pageSize"
              :page-count="1"
              :total="total"
              :current-page="pageCurrents"
              @size-change="pageSizeChange"
              @current-change="pageSizeCurrent"
              layout="slot"
            >
              <span>{{ pageCurrents }}/{{ pageCounts }}</span>
            </el-pagination>
            <el-pagination
              style="text-align:right;display:inline-block;"
              :page-sizes="[10, 25, 50, 100, 200]"
              :page-size="pageSize"
              :current-page="pageCurrents"
              :total="total"
              @size-change="pageSizeChange"
              @current-change="pageSizeCurrent"
              layout="next,slot, jumper"
              ><el-button type="text" :disabled="pageCurrent === pageCounts" @click="pageNext"
                >末页</el-button
              ></el-pagination
            >
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="isShowTitle" :visible.sync="isShowAdd" width="60%" :close-on-click-modal="false">
      <el-form
        :inline="true"
        :model="formInline"
        :rules="rules"
        ref="formData"
        class="demo-form-inline"
        id="demo"
        size="small"
        label-width="150px"
      >
        <div class="flex-div">
          <el-form-item label="部件类型" prop="partsType">
            <el-select v-model="formInline.partsType" class="w-input">
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.data"
                :value="item.data"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部件名称" prop="name">
            <el-input v-model="formInline.name" class="w-input"></el-input
          ></el-form-item>
        </div>
        <div class="flex-div">
          <el-form-item label="部件品牌" prop="brand">
            <el-select v-model="formInline.brand" class="w-input" @change="changeBrand">
              <el-option
                v-for="(item, index) in brandList"
                :key="index"
                :label="item.data"
                :value="item.data"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部件型号" prop="partsModel">
            <el-select v-model="formInline.partsModel" class="w-input">
              <el-option
                v-for="(item, index) in modelList"
                :key="index"
                :label="item.data"
                :value="item.data"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="flex-div">
          <el-form-item label="部件区号" prop="areaCode" v-if="sidebarActiveId !== 1 && sidebarActiveId !== 11">
            <el-input v-model="formInline.areaCode" class="w-input"></el-input
          ></el-form-item>
          <el-form-item label="部件区号" prop="areaCode" v-if="sidebarActiveId === 1">
            <el-input v-model="formInline.areaCode" disabled class="w-input"></el-input
          ></el-form-item>
          <el-form-item label="部件通道号" prop="areaCode" v-if="sidebarActiveId === 11">
            <el-input v-model="formInline.areaCode" class="w-input"></el-input
          ></el-form-item>
          <el-form-item label="部件回路号" prop="loopCode" v-if="sidebarActiveId !== 11">
            <el-input v-model="formInline.loopCode" class="w-input"></el-input
          ></el-form-item>
          <el-form-item label="安装位置" v-if="sidebarActiveId === 11">
            <el-input v-model="formInline.address" class="w-input"></el-input
          ></el-form-item>
        </div>
        <div class="flex-div" v-if="sidebarActiveId !== 11">
          <el-form-item label="部件位号" prop="addressCode">
            <el-input v-model="formInline.addressCode" class="w-input"></el-input
          ></el-form-item>
          <el-form-item label="安装位置">
            <el-input v-model="formInline.address" class="w-input"></el-input
          ></el-form-item>
        </div>
        <div class="flex-div">
          <el-form-item label="状态描述">
            <el-input v-model="formInline.description" class="w-input"></el-input
          ></el-form-item>
          <el-form-item label="部件资产编码">
            <el-input v-model="formInline.assetsCode" class="w-input"></el-input
          ></el-form-item>
        </div>
        <template v-if="sidebarActiveId !== 1 && sidebarActiveId !== 2 && sidebarActiveId !== 11">
          <div class="flex-div">
            <el-form-item label="设备分类" prop="deviceType">
              <el-select v-model="formInline.deviceType" class="w-input" @change="changeTransClass">
                <el-option
                  v-for="(item, index) in transDevClassList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="formInline.deviceName" class="w-input"></el-input
            ></el-form-item>
          </div>
          <div class="flex-div">
            <el-form-item label="设备品牌" prop="deviceBrand">
              <el-select v-model="formInline.deviceBrand" class="w-input" @change="changeTransBrand">
                <el-option
                  v-for="(item, index) in transDevBrandList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备型号" prop="modelNum">
              <el-select v-model="formInline.modelNum" class="w-input">
                <el-option
                  v-for="(item, index) in transDevModelList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-div">
            <el-form-item label="通讯类型" prop="communicationType">
              <el-select v-model="formInline.communicationType" class="w-input">
                <el-option
                  label="内网"
                  value="内网"
                  v-if="formInline.deviceType === '用户信息传输装置' || formInline.deviceType === ''"
                ></el-option>
                <el-option
                  label="NB"
                  value="NB"
                  v-if="formInline.deviceType !== '用户信息传输装置' || formInline.deviceType === ''"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备IMEI">
              <el-input v-model="formInline.deviceImei" class="w-input"></el-input
            ></el-form-item>
          </div>
          <div class="flex-div">
            <el-form-item label="所属服务">
              <el-select v-model="formInline.service" class="w-input">
                <el-option v-for="item in serviceList" :key="item.index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备标签">
              <el-select v-model="formInline.deviceLabel" class="w-input">
                <el-option
                  v-for="(item, index) in devLabelList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-div">
            <el-form-item label="标签编码">
              <el-input v-model="formInline.labelCode" class="w-input"></el-input
            ></el-form-item>
            <el-form-item label="生产日期">
              <el-date-picker
                v-model="formInline.production"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                class="w-input"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="flex-div">
            <el-form-item label="设备有效期">
              <el-input v-model="formInline.deviceProduction" class="w-input"></el-input
            ></el-form-item>
            <el-form-item label="设备位置" prop="deviceAddress">
              <el-input v-model="formInline.deviceAddress" class="w-input"></el-input
            ></el-form-item>
          </div>
          <div class="flex-div">
            <el-form-item label="设备资产编码">
              <el-input v-model="formInline.deviceAssetsCode" class="w-input"></el-input
            ></el-form-item>
          </div>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clicCancel">取 消</el-button>
        <el-button type="primary" @click="clickSave('formData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fireInterface, selectQuety } from '@src/http/intelligentFire/equipmentManagement.js'
import { mapState, mapMutations } from 'vuex'
import systemManagement from '@src/assets/rules/validation/fire/systemManagement.js'
export default {
  name: 'RelevanceList',
  props: {
    showVideo: {
      type: Boolean,
      default: true
    },
    videoTableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    formFire: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isShowAdd: false, // 新建/编辑
      isShowTitle: '新增部件',
      total: 1, // 数据总条数
      pageSize: 10, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      selectData: '', // 选中数据
      modelList: [], // 部件型号下拉
      typeList: [], // 部件类型下拉
      brandList: [], // 部件品牌下拉
      transDevClassList: [], // 设备分类
      transDevBrandList: [], // 设备品牌
      transDevModelList: [], // 设备型号
      devLabelList: [], // 设备标签下拉
      serviceList: [], // 所属服务
      formInline: {
        // 表单字段
        partsType: '', // 部件类型
        name: '', // 部件名称
        brand: '', // 部件品牌
        partsModel: '', // 部件型号
        areaCode: '', // 部件区号
        loopCode: '', // 部件回路号
        addressCode: '', // 部件位号
        address: '', // 安装位置
        description: '', // 状态描述
        assetsCode: '', // 部件资产编码
        deviceType: '', // 设备分类
        deviceName: '', // 设备名称
        deviceBrand: '', // 设备品牌
        modelNum: '', // 设备型号
        communicationType: '', // 通讯类型
        deviceImei: '', // 设备IMEI
        service: '', // 所属服务
        deviceLabel: '', // 设备标签
        labelCode: '', // 标签编码
        production: '', // 生产日期,如2020-01-01
        deviceProduction: '', // 设备标签
        deviceAddress: '', // 设备位置
        deviceAssetsCode: '' // 设备资产编码
      },
      // rules: {
      //   partsType: [{ required: true, message: '部件类型不能为空' }],
      //   name: [{ required: true, message: '部件名称不能为空' }],
      //   brand: [{ required: true, message: '部件品牌不能为空' }],
      //   partsModel: [{ required: true, message: '部件型号不能为空' }],
      //   areaCode: [{ required: true, message: '部件区号不能为空' }],
      //   loopCode: [{ required: true, message: '部件回路号不能为空' }],
      //   addressCode: [{ required: true, message: '部件位号不能为空' }],
      //   deviceType: [{ required: true, message: '设备分类不能为空' }],
      //   deviceName: [{ required: true, message: '设备名称不能为空' }],
      //   deviceBrand: [{ required: true, message: '设备品牌不能为空' }],
      //   modelNum: [{ required: true, message: '设备型号不能为空' }],
      //   communicationType: [{ required: true, message: '通讯类型不能为空' }],
      //   deviceAddress: [{ required: true, message: '设备位置不能为空' }]
      // },
      rules: systemManagement.relevanceListRules,
      testList: [
        {
          label: '测试数据',
          value: '测试数据'
        }
      ],
      tableData: [
        // 列表数据
      ],
      dropDownStatus: {
        videoStatus: true
      },
      videoColumns: [
        // 表头
        { prop: 'name', label: '部件名称', width: '' },
        { prop: 'brand', label: '部件品牌', width: '' },
        { prop: 'partsModel', label: '部件型号', width: '' },
        { prop: 'partsType', label: '部件类型', width: '' },
        { prop: 'areaCode', label: '部件区号', width: '' },
        { prop: 'loopCode', label: '部件回路', width: '' },
        { prop: 'addressCode', label: '部件位号', width: '' },
        { prop: 'address', label: '安装位置', width: '' },
        { prop: 'description', label: '状态描述', width: '' },
        { prop: 'assetsCode', label: '部件资产编码', width: '' }
      ],
      videoColumn: [
        // 表头
        { prop: 'name', label: '部件名称', width: '' },
        { prop: 'brand', label: '部件品牌', width: '' },
        { prop: 'partsModel', label: '部件型号', width: '' },
        { prop: 'partsType', label: '部件类型', width: '' },
        { prop: 'areaCode', label: '部件通道号', width: '' },
        // { prop: 'loopCode', label: '部件回路', width: '' },
        // { prop: 'addressCode', label: '部件位号', width: '' },
        { prop: 'address', label: '安装位置', width: '' },
        { prop: 'description', label: '状态描述', width: '' },
        { prop: 'assetsCode', label: '部件资产编码', width: '' }
      ],
      defaultParams: {
        pageSize: 10, // 一页多少条数据
        page: 1 // 第几页
      }
    }
  },
  created() {
    // 获取数据字典
    this.SET_DATA_DIC_CHILD(this.dataDic[this.sidebarActiveField])

    // 部件品牌
    this.getSelectData(this.dataDicChild.childBrand).then(res => {
      this.brandList = res.data.data[0].attr
    })

    // 部件类型
    this.getSelectData(this.dataDicChild.childType).then(res => {
      this.typeList = res.data.data[0].attr
    })

    let id = [1, 2, 7, 8, 9, 10, 11, 12]
    if (!id.includes(this.sidebarActiveId)) {
      // 设备标签下拉
      this.getSelectData(this.dataDicChild.label).then(res => {
        this.devLabelList = res.data.data[0].attr
      })
      // 所属服务下拉
      this.getServiceData()
      // 传输设备分类
      let params = {
        dictId: this.dataDicChild.childTransDev.id // 字典参数
      }
      this.getDataDic(params, '3').then(res => {
        this.transDevClassList = res.data.data[0].attr
      })
    }
    this.pageCount = Math.ceil(this.total / this.pageSize)
    if (this.title === '详情' && this.formFire) {
      this.getQueryData({ id: this.formFire.hostId })
      this.defaultParams.id = this.formFire.hostId
    } else if (this.title === '编辑' && this.formFire) {
      this.getQueryData({ id: this.formFire.hostId })
      this.defaultParams.id = this.formFire.hostId
    } else {
      // 新建
      // for (var key in this.formFire) {
      this.defaultParams.id = this.formFire.hostId[0]
      // }
    }
    // 查询列表条件
    this.defaultParams.pageSize = this.pageSize
    this.defaultParams.page = this.pageCurrent
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActiveId: 'sidebarActiveId',
      dataDic: 'dataDic',
      dataDicChild: 'dataDicChild',
      sidebarActiveField: 'sidebarActiveField'
    }),
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      return this.pageCurrent
    },
    areaCode: function() {
      if (this.sidebarActiveId === 1) {
        return this.formInline.loopCode + '-' + this.formInline.addressCode
      } else {
        return false
      }
    }
  },
  watch: {
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.pageSize = this.pageSize
      this.getQueryData(this.defaultParams)
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.page = this.pageCurrents
      this.getQueryData(this.defaultParams)
    },
    areaCode: function() {
      this.formInline.areaCode = this.areaCode
    }
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_DATA_DIC_CHILD: 'SET_DATA_DIC_CHILD'
    }),
    // 显示隐藏列表
    toggleOpen(type) {
      this.dropDownStatus[type] = !this.dropDownStatus[type]
    },
    // 下拉请求
    getSelectData(val) {
      if (val) {
        let params = {
          dictId: val // 字典参数
        }
        return this.getDataDic(params)
      }
    },
    // 数据字典请求
    getDataDic(params, id) {
      return selectQuety.queryDataDictBasicInfo(params, id)
    },
    // 部件品牌选择
    changeBrand(val, id) {
      let params = {
        dictId: this.dataDicChild.childModel,
        homeClass: val
      }
      if (!id) {
        this.formInline.partsModel = '' // 清空部件型号
        this.modelList = [] // 清空部件型号数据
      }

      this.getDataDic(params).then(res => {
        this.modelList = res.data.data[0].attr
      })
    },
    // 设备分类
    changeTransClass(val, id) {
      let params = {
        dictId: this.dataDicChild.childTransDev[`${val}`].id
      }
      if (!id) {
        this.formInline.deviceBrand = '' // 清空设备品牌
        this.transDevBrandList = [] // 清空设备品牌数据
        this.formInline.modelNum = '' // 清空设备型号
        this.transDevModelList = [] // 清空设备型号数据
      }

      this.getDataDic(params, '3').then(res => {
        this.transDevBrandList = res.data.data[0].attr
      })
    },
    // 设备品牌
    changeTransBrand(val, id) {
      let params = {
        dictId: this.dataDicChild.childTransDev[`${this.formInline.deviceType}`].modelNumber,
        homeClass: val
      }
      if (!id) {
        this.formInline.modelNum = '' // 清空设备型号
        this.transDevModelList = [] // 清空设备型号数据
      }
      this.getDataDic(params, '3').then(res => {
        this.transDevModelList = res.data.data[0].attr
      })
    },
    // 所属服务下拉
    getServiceData() {
      selectQuety.serviceList().then(res => {
        this.serviceList = res.data.data
      })
    },
    // 获取部件列表
    getQueryData(params) {
      fireInterface.getHostParts(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.partsInfo
          // this.total = res.data.data.page.totalNumber || 1
        }
      })
    },
    // 取消
    clicCancel() {
      this.isShowAdd = false
      this.$refs.tableList.clearSelection()
      for (var key in this.formInline) {
        if (key !== 'hostId') {
          this.formInline[key] = ''
        }
      }
      this.$refs.formData.clearValidate() // 清除整个表单的校验
      // this.getQueryData({ id: this.formInline.hostId })
    },
    // 保存
    clickSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this

          let params = {}
          // 添加部件不为空的信息
          for (var key in this.formInline) {
            if (this.formInline[key]) {
              params[key] = this.formInline[key]
            }
          }
          // 添加主机信息
          for (var key in this.formFire) {
            params[key] = this.formFire[key]
          }
          params.hostType = params.type
          if (this.isShowTitle === '编辑部件') {
            fireInterface
              .updataHostParts(params)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify.success({
                    message: '系统部件编辑成功',
                    title: '成功'
                  })
                  this.getQueryData({ id: params.hostId })
                  this.clicCancel()
                }
              })
              .catch(_ => {
                this.$notify.error('系统部件编辑成功')
              })
          } else {
            fireInterface
              .addHostParts(params)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify.success({
                    message: '系统部件新增成功',
                    title: '成功'
                  })
                  this.getQueryData({ id: params.hostId })
                  this.clicCancel()
                }
              })
              .catch(_ => {
                this.$notify.error('系统部件新增失败')
              })
          }
        } else {
          // this.$message({
          //   message: '请填写信息',
          //   type: 'error',
          //   duration: 1000
          // })
          return false
        }
      })
    },
    // 选中数据
    select(val) {
      this.selectData = val
    },
    // 新建
    clickAdd() {
      // this.$refs.formData.resetFields()
      this.isShowAdd = true
      this.isShowTitle = '新增部件'
      this.$refs.formData.clearValidate() // 清除整个表单的校验
    },
    // 编辑
    clickEdit() {
      if (this.selectData && this.selectData.length > 0 && this.selectData.length === 1) {
        for (var key in this.selectData[0]) {
          this.formInline[key] = this.selectData[0][key]
        }
        // 部件品牌选择
        this.changeBrand(this.formInline.brand, 1)
        if (this.formInline.deviceType) {
          // 设备分类
          this.changeTransClass(this.formInline.deviceType, 1)
          // 设备品牌
          this.changeTransBrand(this.formInline.deviceBrand, 1)
        }

        this.isShowTitle = '编辑部件'
        this.isShowAdd = true
      } else {
        this.$notify.warning({
          message: '请选择一条需要编辑的数据',
          title: '警告'
        })
      }
    },
    // 删除
    clickDelete() {
      let params = []

      if (this.selectData && this.selectData.length > 0) {
        this.$confirm('确认删除信息？')
          .then(_ => {
            this.selectData.map(item => {
              params.push(item.id)
            })
            fireInterface
              .deleteHostParts(params)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify.success({
                    message: '删除成功',
                    title: '成功'
                  })
                  if (this.title === '编辑') {
                    this.getQueryData({ id: this.formFire.hostId })
                  } else {
                    this.getQueryData({ id: this.formFire.hostId[0] })
                  }
                }
              })
              .catch(_ => {
                this.$notify.error({
                  message: '删除失败!',
                  title: '失败'
                })
              })
          })
          .catch(_ => {})
      } else {
        this.$notify.warning({
          message: '请选择需要删除的数据',
          title: '警告'
        })
      }
    },
    // 刷新
    clickResh() {
      this.getQueryData(this.defaultParams)
      this.$notify.success({
        message: '列表刷新成功',
        title: '成功'
      })
    },
    // 改变pageSize
    pageSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCounts
    }
  }
}
</script>
<style lang="less" scoped>
.collapse-item {
  width: 100%;
  margin-bottom: 10px;
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
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
.demo-form-inline {
  background: #f5f5f5;
  padding: 30px 0;
}
.flex-div {
  display: flex;
  flex-direction: row;
  justify-content: left;
  width: 100%;
  height: 35px;
  margin-bottom: 14px;
  .w-input {
    width: 356px;
    height: 35px;
  }
}
</style>
