<template>
  <div id="device" style="padding:10px;height:100%">
    <div class="deviceCon" style="height:100%">
      <div class="refs" ref="caleHeight">
        <div class="tabMenus">
          <!-- <tabMenu :tabList="tabList" /> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
            <!-- <el-breadcrumb-item>门禁管理</el-breadcrumb-item> -->
            <el-breadcrumb-item>门禁主机配置</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="deviceHeader">
          <el-collapse v-model="activeNames" @change="collClick">
            <el-collapse-item title="查询条件" name="1">
              <div class="alarm-log-inquire">
                <div class="form-content">
                  <el-form ref="searchModel" :model="formInline" :rules="rules">
                    <el-form-item label="所属机构" prop="orgName">
                      <el-autocomplete
                        class="inline-input"
                        size="mini"
                        v-model="formInline.orgName"
                        value-key="name"
                        :fetch-suggestions="
                          (val, callback) => {
                            querySearch('org', val, callback)
                          }
                        "
                        placeholder="请输入机构"
                        :trigger-on-focus="false"
                        @select="
                          val => {
                            selectItem('org', val)
                          }
                        "
                      ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="所属重点部位" prop="keyPartName">
                      <el-autocomplete
                        class="inline-input"
                        size="mini"
                        v-model="formInline.keyPartName"
                        value-key="name"
                        :fetch-suggestions="
                          (val, callback) => {
                            querySearch('kp', val, callback)
                          }
                        "
                        placeholder="请输入重点部位"
                        :trigger-on-focus="false"
                        @select="
                          val => {
                            selectItem('kp', val)
                          }
                        "
                      ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="门禁通道类型">
                      <el-select v-model="formInline.type" placeholder="请选择门禁通道类型" size="mini">
                        <el-option
                          v-for="(item, index) in CreatehostType"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="门禁通道名称" prop="name">
                      <el-input v-model="formInline.name" placeholder="请输入门禁通道名称"></el-input>
                    </el-form-item>
                    <el-form-item label="资产编码">
                      <el-input v-model="formInline.assetcode" placeholder="请输入资产编码"></el-input>
                    </el-form-item>
                    <el-form-item label="门禁通道ID">
                      <el-input size="mini" v-model="formInline.uniqueId" placeholder="请输入门禁通道ID"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌">
                      <el-input v-model="formInline.brand" placeholder="请输入品牌"></el-input>

                      <!-- <el-select v-model="formInline.brand" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item, index) in hostBrands"
                          :key="index"
                          :label="item.data"
                          :value="item.englishName || item.data"
                          @click.native="changeBrans(index)"
                        ></el-option>
                      </el-select> -->
                    </el-form-item>
                    <el-form-item label="型号">
                      <el-input v-model="formInline.modelNum" placeholder="请输入型号"></el-input>

                      <!-- <el-select v-model="formInline.modelNum" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item, index) in hostModelNums"
                          :key="index"
                          :label="item.data"
                          :value="item.data"
                        ></el-option>
                      </el-select> -->
                    </el-form-item>
                    <el-form-item label="关联视频通道">
                      <el-select v-model="formInline.isVideoLink" placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in RelatedVideo"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="关联对讲通道">
                      <el-select v-model="formInline.isAudioLink" placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in RelatedAudio"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="关联门禁通道">
                      <el-select v-model="formInline.isGuardLink" placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in RelatedAsdie"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="关联输出通道">
                      <el-select v-model="formInline.isOutputLink" placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in RelatedAsdieOutput"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="录入机构" prop="updatedDept">
                      <el-input v-model="formInline.updatedDept" placeholder="请输入录入机构"></el-input>
                    </el-form-item>
                    <el-form-item label="录入人" prop="updatedBy">
                      <el-input v-model="formInline.updatedBy" placeholder="请输入录入人"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <el-date-picker
                        v-model="startTime"
                        type="datetime"
                        :picker-options="eventPickerStartDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择开始时间"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                      <el-date-picker
                        v-model="endTime"
                        type="datetime"
                        :picker-options="eventPickerEndDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择结束时间"
                      ></el-date-picker>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="alarm-log-btn">
                  <el-button type="primary" @click="inquireClick(0)" size="mini">查询</el-button>
                  <el-button type="primary" @click="resetClick" size="mini">重置</el-button>
                  <el-button @click="exportClick" size="mini">导出</el-button>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <p style="font-size:14px">查询结果</p>
      <div class="deviceTable" style="padding:10px">
        <el-table
          :stripe="true"
          :data="tableData"
          @select="select"
          border
          style="width:100%"
          :height="tableHeight"
          ref="table"
          v-loading="loading"
          tooltip-effect="dark"
        >
          > >
          <el-table-column prop type="selection" width="80"></el-table-column>
          <el-table-column prop width="80" label="序号" type="index"></el-table-column>
          <el-table-column width="120" show-overflow-tooltip prop="orgName" label="所属机构" sortable></el-table-column>
          <el-table-column
            width="120"
            show-overflow-tooltip
            prop="keyPartName"
            label="所属重点部位"
            sortable
          ></el-table-column>
          <el-table-column
            width="120"
            show-overflow-tooltip
            prop="platformName"
            label="所属门禁平台"
            sortable
          ></el-table-column>
          <el-table-column
            width="120"
            show-overflow-tooltip
            prop="deviceName"
            label="所属门禁主机"
            sortable
          ></el-table-column>
          <el-table-column
            width="120"
            show-overflow-tooltip
            prop="name"
            label="门禁通道名称"
            sortable
          ></el-table-column>
          <el-table-column
            width="120"
            show-overflow-tooltip
            prop="uniqueId"
            label="门禁通道ID"
            sortable
          ></el-table-column>
          <el-table-column width="120" show-overflow-tooltip label="门禁通道类型">
            <template slot-scope="scope">
              <span v-show="scope.row.class == 1">金库门禁</span>
              <span v-show="scope.row.class == 2">普通门禁</span>
              <span v-show="scope.row.class == 3">互锁门门禁</span>
            </template>
          </el-table-column>
          <el-table-column width="120" show-overflow-tooltip prop="brand" label="品牌" sortable></el-table-column>
          <el-table-column width="120" show-overflow-tooltip prop="modelNum" label="型号" sortable></el-table-column>
          <el-table-column width="120" show-overflow-tooltip sortable label="关联摄像头">
            <template slot-scope="scope">
              <span v-if="scope.row.isVideoLink == 2">已关联</span>
              <span v-else>未关联</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="120" sortable label="关联对讲通道">
            <template slot-scope="scope">
              <span v-if="scope.row.isAudioLink == 2">已关联</span>
              <span v-else>未关联</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="120" sortable label="关联门禁通道">
            <template slot-scope="scope">
              <span v-if="scope.row.isGuardLink == 2">已关联</span>
              <span v-else>未关联</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip sortable label="关联输出通道" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.isOutputLink == 2">已关联</span>
              <span v-else>未关联</span>
            </template>
          </el-table-column>
          <el-table-column width="120" show-overflow-tooltip label="在线状态" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">关门</span>
              <span v-if="scope.row.status == 2">开门</span>
              <span v-if="scope.row.status == 3">未知</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <video-pagination
            ref="listPagination"
            :total="totalSize"
            @paginationConfChange="paginationConfChange"
          ></video-pagination>
          <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currpage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            :total="totalSize"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getAccessCommonList, getTreeApi } from '@src/http/access/accessMan'
import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
import { getServeId, brandOrModelNum } from '@src/http/access/getId'
import { getHostList } from '@src/http/access/host'
import { download } from '@src/common/download.js'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import accessRules from 'assets/rules/validation/security/access'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
export default {
  components: {
    tabMenu: () => import('../../components/tabMenu'),
    comTable: () => import('../../../components/comTable'),
    treeBox: () => import('@src/components/tree/treeBox'),
    VideoPagination
  },
  data() {
    return {
      eventPickerStartDate: {
        disabledDate: (time) => {
          if (!this.formInline.endTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return time.getTime() > new Date(this.endTime).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        },
      },
      eventPickerEndDate: {
        disabledDate: (time) => {
          if (!this.formInline.startTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return (
              time.getTime() < new Date(this.startTime).getTime() - 1 * 24 * 60 * 60 * 1000 ||
              time.getTime() > Date.now() - 8.64e6
            )
          }
        },
      },
      endTime: '',
      startTime: '',
      loading: false,
      messageEd: {},
      tableHeight: 200, //默认高度
      caleHeight: '',
      treeType: 3,
      nameLable: '',
      serchDerive: [],
      formInlineCopy: {}, //查询条件备份
      formInlineQuery: {}, //用于接口查询的参数
      formInline: {
        orgName: '',
        keyPartName: '',
        name: '', //主机名字
        assetcode: '', //资产编码
        orgId: '', //机构id
        keyPartId: '', // 重点部位id
        uniqueId: '', //主机id
        type: '全部', // 主机类型
        brand: '', //品牌
        modelNum: '', //型号
        isVideoLink: '',
        isAudioLink: '',
        isGuardLink: '', //门禁数量
        isOutputLink: '', //报警输出
        updatedBy: '', // 录入人
        updatedDept: '', //录入机构
        updatedAt: '', //录入时间
      },
      rules: accessRules.accessdevicesSearch,
      activeNames: ['1'],
      tabList: ['门禁管理', '门禁主机关联配置', '查询'],
      //以下是select框
      //所属机构
      orgNameSelect: [],
      //所属重点部位
      keyPartSelect: [],
      //所属子系统
      subsystemNameSelect: [],
      //门禁主机
      partData: [],
      hostBrands: [], //主机品牌
      hostModelNums: [], //主机型号
      CreatehostType: [],
      hostArr: [], //主机

      hostNameSelect: [
        { label: '金库门禁', value: '1' },
        { label: '普通门禁', value: '2' },
        { label: '互锁门门禁', value: '3' },
      ],
      //关联摄像机
      RelatedVideo: [
        { label: '全部', value: '' },
        { label: '已关联', value: '2' },
        { label: '未关联', value: '1' },
      ],
      //关联对讲通道
      RelatedAudio: [
        { label: '全部', value: '' },
        { label: '已关联', value: '2' },
        { label: '未关联', value: '1' },
      ],
      //关联门禁通道
      RelatedAsdie: [
        { label: '全部', value: '' },
        { label: '已关联', value: '2' },
        { label: '未关联', value: '1' },
      ],
      //关联输出通道
      RelatedAsdieOutput: [
        { label: '全部', value: '' },
        { label: '已关联', value: '2' },
        { label: '未关联', value: '1' },
      ],
      tableData: [],
      currpage: 1,
      pageSize: 25,
      totalSize: 0,
    }
  },
  props: {},
  mounted() {
    this.SizeTableHeight()
    // 门禁通道类型
    let brands = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '13' }]
    let queryList = brands
    brandOrModelNum({ queryList }).then((res) => {
      this.CreatehostType = res.data.data[0].attr
      this.CreatehostType.unshift({data:'全部',data:'全部'})
    })
    // this.formInlineCopy = JSON.parse(JSON.stringify(this.formInline))
    //门禁主机品牌
    let hostBrands = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '14' }]
    let HostBrandsType = hostBrands
    brandOrModelNum({ queryList: HostBrandsType }).then((res) => {
      this.hostBrands = res.data.data[0].attr
    })
    // this.caleHeight = document.body.offsetHeight - this.$refs.caleHeight.offsetHeight
  },
  methods: {
       paginationConfChange(data) {
      this.pageSize = data.limit
      this.currpage = data.page
      this.inquireClick(1,true)
    },
    deleteObjKey(Objects) {
      let newObj = {}
      for (let key in Objects) {
        if ((Objects[key] === 0 || Objects[key]) && Objects[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
          newObj[key] = Objects[key]
        }
      }
      return newObj
    },
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.formInline.orgId : undefined,
      }
      getSearchOrgApi(params)
        .then((res) => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch((err) => {
          console.log(err)
          callback([])
        })
    },
    selectItem(type, val) {
      if (type === 'org') {
        this.formInline.orgId = val.id
        this.formInline.orgName = val.name
      } else if (type === 'kp') {
        this.formInline.keyPartId = val.id
        this.formInline.keyPartName = val.name
      }
    },
    SizeTableHeight() {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 70
        let that = this
        window.onresize = function ()  {
          that.tableHeight = window.innerHeight - that.$refs.table.$el.offsetTop - 70
        }
      })
    },
    changeHost(id) {
      this.formInline.hostName = ''
      this.hostArr = []
      let obj = {
        limit: 1000,
        page: 1,
        rescusive: true,
        keyPartId: this.formInline.locName, // 携带重点部位id即可
      }
      // 请求主机列表
      getHostList(obj).then((res) => {
        this.hostArr = res.data.data.hosts
      })
    },
    getTree(params) {
      return getTreeApi(params)
    },
    playBackGetData(data) {
      this.messageEd = data
      this.nameLable = data.name
      if (data.tierType == 'org') {
        this.formInline.orgId = data.id
      }
      let obj = {
        type: 2,
        oId: data.serial,
      }
      this.partData = []
      this.formInline.keyPartId = ''
      getTreeApi(obj).then((res) => {
        if (res.data.data.nodes) {
          res.data.data.nodes.forEach((item) => {
            if (item.tierType === 'loc') {
              this.partData.push(item)
            }
          })
        }
      })
    },
    //通道型号
    changeBrans(index) {
      this.formInline.modelNum = ''
      let hostModelNumsTypea = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '15' }]
      let HostModelNumsType = hostModelNumsTypea
      brandOrModelNum({ queryList: HostModelNumsType }).then((res) => {
        this.hostModelNums = res.data.data[0].attr
        let brand = this.hostBrands
        this.AllmodelList = this.hostModelNums
        let modelList = this.hostModelNums
        let data1 = brand[index].data
        let arr = []
        modelList.filter((v) => {
          if (v.homeClass == data1) {
            arr.push(v)
          }
          this.hostModelNums = arr
        })
      })
    },
    // table 分页器
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.tableData = []
      this.currpage = 1 //防止查询内容超出实际内容
      this.inquireClick(1, true)
    },
    // table 当前页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currpage = val
      this.tableData = []
      this.inquireClick(1, true)
    },
    select(s, row) {
      this.serchDerive = s
    },
    collClick() {},
    resetClick() {
      for (let index in this.formInline) {
        this.formInline[index] = ''
      }
      this.formInline.type = '全部'
      this.nameLable = ''
      this.endTime = ''
      this.startTime = ''
      this.inquireClick()
    },
    exportClick() {
      if (this.serchDerive && this.serchDerive.length > 0) {
        const tHeader = [
          '所属机构',
          '所属重点部位',
          '所属门禁平台',
          '所属门禁主机',
          '门禁通道名称',
          '门禁通道ID',
          '门禁通道类型',
          '品牌',
          '型号',
          '关联摄像头',
          '关联对讲通道',
          '关联门禁通道',
          '关联输出通道',
          '在线状态',
        ]
        const filterVal = [
          'orgName',
          'keyPartName',
          'platformName',
          'deviceName',
          'name',
          'uniqueId',
          'class',
          'brand',
          'modelNum',
          'isVideoLink',
          'isAudioLink',
          'isGuardLink',
          'isOutputLink',
          'status',
        ]
        let list = []
        list = this.$lodash.cloneDeep(this.serchDerive)
        list.forEach((item) => {
          if (item.status == 1) {
            item.status = '离线'
          } else if (item.status == 2) {
            item.status = '在线'
          }
          if (item.type == 1) {
            item.type = '金库门禁'
          } else if (item.type == 2) {
            item.type = '普通门禁'
          } else if (item.type == 3) {
            item.type == '互锁门门禁'
          }else{
            item.type = ''
          }
          item.isVideoLink = item.isVideoLink == 2 ? '已关联' : '未关联'
          item.isAudioLink = item.isAudioLink == 2 ? '已关联' : '未关联'
          item.isGuardLink = item.isGuardLink == 2 ? '已关联' : '未关联'
          item.isOutputLink = item.isOutputLink == 2 ? '已关联' : '未关联'
        })
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '门禁设备')
      } else {
        if (this.SearchTimer) {
          clearTimeout(this.SearchTimer)
        }

          let result = this.deleteObjKey(this.formInline)
          let SearchObj = this.$lodash.cloneDeep(result)
          if (SearchObj.type == '金库门禁') {
            SearchObj.class = 1
          } else if (SearchObj.type == '普通门禁') {
            SearchObj.class = 2
          } else if (SearchObj.type == '联动互锁门') {
            SearchObj.class = 3
          }else{
            SearchObj.class = ''
          }
          delete SearchObj.orgName
          delete SearchObj.keyPartName
          delete SearchObj.type
        this.SearchTimer = setTimeout(() => {

          let body = {
            pattern: 'inquery',
            rescusive: this.showSubOrg,
             equal:SearchObj,
            like: SearchObj
          }
          if (this.status) {
            body['status'] = this.status
          }
          if (this.messageEd.tierType === 'loc') {
            body.keyPartId = this.messageEd.id
          } else if (this.messageEd.tierType === 'org') {
            body.orgId = this.messageEd.id
          }
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/guard/channel/linkage/download`
          let name = `门禁通道查询导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          download(
            url,
            name,
            () => {},
            () => {
              this.$message({ type: 'info', message: '导出文件下载失败！' })
            },
            () => {},
            'post',
            body
          )
        }, 500)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    // 查询按钮
    inquireClick(typeP, pageChange) {

      if (this.endTime !== '' && this.endTime !== null) {
        if (
          this.startTime !== '' &&
          this.startTime !== null &&
          this.$moment(this.endTime).valueOf() - this.$moment(this.startTime).valueOf() <= 0
        ) {
          this.$notify.error('结束时间不能小于开始时间')
                    this.tableData = []
            this.totalSize = 0
          return
        }
      }
      let SearchObj = this.$lodash.cloneDeep(this.formInline)
      if (SearchObj.type == '普通门禁') {
        SearchObj.class = 2
        SearchObj.type = 1
      } else if (SearchObj.type == '金库门禁') {
        SearchObj.class = 1
        SearchObj.type = 1
      } else if (SearchObj.type == '联动互锁门') {
        SearchObj.class = 3
        SearchObj.type = 1
      }else{
          SearchObj.class = ''
        SearchObj.type = ''
      }
      SearchObj.type = 1
      delete SearchObj.orgName
      delete SearchObj.keyPartName
      let body = {
        page: this.currpage,
        limit: this.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        target: 'channel',
        equal: SearchObj,
        link: SearchObj,
      }
      if(this.timer){
        clearTimeout(this.timer)
      }
      this.loading = true
      this.timer = setTimeout(() => {
        getAccessCommonList(body)
          .then((data) => {
            if (data.data.code == 0) {
                this.tableData = data.data.data.channels
                this.totalSize = data.data.data.count.total
                SearchObj = {}
              this.loading = false
              if (this.totalSize == 0) {
                this.$notify({
                  title: '成功',
                  message: '暂未匹配通道',
                  position: 'top-right',
                  type: 'success',
                })
              } else {
                if (pageChange == true) {
                  return
                }
                this.$notify({
                  title: '成功',
                  message: '查询成功',
                  position: 'top-right',
                  type: 'success',
                })
              }
            } else {
            this.tableData = []
            this.totalSize = 0
              this.loading = false
              this.$notify({
                title: '错误',
                message: '查询失败',
                position: 'top-right',
                type: 'error ',
              })
            }
          })
          .catch((err) => {})
      }, 500)
    },
  },
}
</script>

<style lang="less" scoped>
.deviceCon {
  // height: calc(~'100% - 40px');
  .tabMenus {
    margin: 10px 0;
  }
  .deviceHeader {
    margin-bottom: 10px;
    width: 100%;
    // height: 100%;
    // height: calc(~'100% - 40px');
    .alarm-log-inquire {
      height: 100%;
      margin: 10px 0;

      .form-content {
        width: 100%;
        background: rgba(245, 245, 245, 1);
        padding: 16px 16px 2px 16px;
        box-sizing: border-box;
        /deep/ .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            margin-right: 10px;
            display: inline-block;
            width: 19.23%;
            margin-bottom: 15px;
            display: flex;
            .el-form-item__label {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              // width: 96px;
            }
            .el-form-item__content {
              display: inline-block;
              width: calc(~'100% - 96px');
              .el-select {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                }
              }
              .el-autocomplete {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                }
              }
              .el-input {
                width: 100%;
                .el-input__inner {
                  width: 100%;
                  height: 35px;
                  border-radius: 0px;
                  font-size: 12px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: rgba(51, 51, 51, 1);
                }
              }
            }
            .el-form-item__label {
              width: 30%;
            }
            .el-form-item__content {
              flex: 1;
            }
          }
        }
      }
      .alarm-log-btn {
        width: 1438px;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
.block {
  text-align: right;
  margin-top: 10px;
}
.deviceTable {
  // height: 100%;
  box-shadow: 0 0 10px #ccc inset;
}
</style>
