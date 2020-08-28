<!-- 对讲主机关联配置  查询 -->
<template>
  <div class="Serarch-box">
      <header>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲主机关联配置</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="top-box">
              <div style="width:100%;">
                <div class="form-title">
                  <span class="title"
                        @click="fliterBoxVisible = !fliterBoxVisible">查询条件</span>
                  <i :class="fliterBoxVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </div>
                <!-- 查询条件 -->
                <el-collapse-transition>
                  <div class="form-container" v-show="fliterBoxVisible">
                    <el-form ref="queryForm" size="mini" :model="formData" 
                                            label-position="right" label-width="140px" 
                                            class="form-content"  :rules="rules">
                      <el-form-item label="所属机构" prop="orgName" class="form-group">
                        <el-autocomplete
                          class="inline-input inp1"
                          size="mini"
                          v-model="formData.orgName"
                          value-key="name"
                          :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                          placeholder="请输入机构"
                          @blur="bulrChange('org')"
                          :trigger-on-focus="false"
                          @select="val=>{selectTreeItem('org', val)}"
                        ></el-autocomplete>
                      </el-form-item>
                      <el-form-item label="所属重点部位" prop="keyPartName" class="form-group">
                        <el-autocomplete
                          class="inp1"
                          size="mini"
                          v-model="formData.keyPartName"
                          value-key="name"
                          :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"
                          placeholder="请输入重点部位"
                          :trigger-on-focus="false"
                          @blur="bulrChange('kp')"
                          @select="val=>{selectTreeItem('kp', val)}"
                        ></el-autocomplete>
                      </el-form-item>
                      <el-form-item label="对讲平台名称" prop="platformName" class="form-group">
                        <!-- <el-input v-model="formData.platformName" class="inp1"></el-input> -->
                        <el-autocomplete
                        class="inp1"
                        size="mini"
                        v-model="formData.platformName"
                        value-key="name"
                        :fetch-suggestions="(val, callback)=>{querySearch2(val,callback)}"
                        placeholder="请输入对讲平台名称"
                        :trigger-on-focus="false"
                        @blur="bulrChange('platform')"
                        @select="val=>{selectTreeItem('platform', val)}"
                      ></el-autocomplete>
                      </el-form-item>

                      <el-form-item label="对讲主机" class="form-group" prop='name'>
                        <el-input v-model="formData.name" class="inp1"></el-input>
                      </el-form-item>

                      <el-form-item label="品牌" prop="brand" class="form-group">
                        <el-select v-model="formData.brand" class="brand" width="500px" @change="getModelBrandList">
                          <el-option label="全部" value=""></el-option>
                          <el-option v-for="(item,index) in brandList"
                            :key="index"
                            :label="item.data"
                            :value="item.data">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="型号" class="form-group">
                        <el-select v-model="formData.modelNum" class="brand">
                          <el-option label="全部" value=""></el-option>
                          <el-option v-for="(item,index) in modelList"
                            :key="index"
                            :label="item.data"
                            :value="item.data">
                          </el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="关联视频通道" class="form-group">
                        <el-select  v-model="formData.isVideoLink">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="未关联" value="1"></el-option>
                          <el-option label="已关联" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="关联对讲通道 " class="form-group">
                        <el-select  v-model="formData.isAudioLink">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="未关联" value="1"></el-option>
                          <el-option label="已关联" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="关联门禁通道" class="form-group">
                        <el-select  v-model="formData.isGuardLink">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="未关联" value="1"></el-option>
                          <el-option label="已关联" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="关联输出通道" class="form-group">
                        <el-select  v-model="formData.isOutputLink">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="未关联" value="1"></el-option>
                          <el-option label="已关联" value="2"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="资产编码" class="form-group">
                        <el-input v-model="formData.assetCode" class="inp1"></el-input>
                      </el-form-item>

                      <el-form-item label="在线状态" class="form-group">
                        <el-select  v-model="formData.status">
                          <el-option label="在线" value="2"></el-option>
                          <el-option label="离线" value="1"></el-option>
                          <el-option label="全部" value=""></el-option>
                        </el-select>
                      </el-form-item>
                      <!-- <el-form-item label="运行状态" class="form-group">
                        runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
                        <el-select v-model="formData.runStatus">
                          <el-option label="离线 " value="1"></el-option>
                          <el-option label="空闲" value="2"></el-option>
                          <el-option label="呼出" value="3"></el-option>
                          <el-option label="响铃" value="4"></el-option>
                          <el-option label="对讲中" value="5"></el-option>
                          <el-option label="广播中" value="6"></el-option>
                          <el-option label="全部" value=""></el-option>
                        </el-select>
                      </el-form-item> -->
                      <el-form-item label="录入人" class="form-group" prop="updatedBy">
                        <el-input v-model="formData.updatedBy" class="inp1"></el-input>
                      </el-form-item>
                      <el-form-item label="录入机构" class="form-group" prop="updatedDept">
                        <el-input v-model="formData.updatedDept" class="inp1"></el-input>
                      </el-form-item>
                      <el-form-item label="录入时间" class="form-group">
                        <!-- <el-date-picker
                          class="inp1"
                          v-model="formData.updatedAt"
                          type="datetime"
                          placeholder="选择日期时间">
                        </el-date-picker> -->
                        <el-date-picker
                          class="inp1"
                          v-model="formData.updatedAt"
                          type="datetimerange"
                          range-separator=""
                          value-format="yyyy-MM-dd HH:mm:ss"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                        
                      </el-form-item>
                    </el-form>
                    <!-- 查询按钮 -->
                    <div class="form-footer">
                      <el-button type="primary" size="mini" @click="search">查询</el-button>
                      <el-button size="mini" style="margin:0 6px 0 16px" @click="reset">重置</el-button>
                      <el-button size="mini" @click="exportFile">导出</el-button>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>

              <!-- 查询结果 -->
              <div class="form-table">
                <div class="form-title">
                  <span class="title">查询结果</span>
                </div>
                <el-table :row-style="{height:'10px'}"
                      :cell-style="{padding:'0px'}"
                      style="font-size: 12px"
                      stripe
                      border
                      height="100%"
                      max-height="340"
                      :data="tableData"
                      @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
                    <el-table-column :row-style="{height:'10px'}"
                      :cell-style="{padding:'0px'}"
                      style="font-size: 10px"
                        v-for="(column, index) in columns" :key="index"
                        :prop="column.prop"
                        :label="column.label"
                        :width="column.width"
                        :sortable="column.sortable"
                        show-overflow-tooltip
                        align="center"
                        :formatter="formatterTable">
                    </el-table-column>
                </el-table>
                <audio-Paination ref="listPagination" class="pagination" :total="total" @paginationConfChange="paginationConfChange"></audio-Paination>
              </div>
           </div>
      </div>
</template>
<script>

import AudioPaination from "../../../components/AudioPagination"  // 分页组件

import { getBrandModuleApi, searchApi, platformListApi } from "@src/http/audioManage/talkback.api.js"  // 音频 通用查询接口
import { getTreeApi } from '@src/http/access/accessMan'
import { download } from '@src/common/download.js'
import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
import searchRules from 'assets/rules/validation/security/audio'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
export default {
  name: '',
  components: {
    AudioPaination,
    treeBox: () => import('@src/components/tree/treeBox'),
  },
  data() {
    return {
      treeType: 3,  // 机构树 treeType
      messageEd: {},

      // 查询表单
      formData: {
        // 表单数据
        orgName:"",  // 所属机构 
        orgId:'',   // 所属机构 id
        keyPartId:"",  // 所属部位id
        platformName:"", //  对讲平台 名称
        platformId:'',
        name:"", //  对讲主机 名称
        
        brand:"",//品牌
        modelNum:'',//型号
        uniqueId:"",//对讲平台唯一ID
        isVideoLink:'',  // 关联视频通道
        isAudioLink:'',  //  关联对讲通道 
        isGuardLink:'',  // 关联门禁通道
        isOutputLink:'',  // 关联输出通道

        assetCode:'',//资产编码
        status:"",//在线状态
        // runStatus:'',//运行状态
        
        updatedBy: "",   // 录入人
        updatedDept: "",  // 录入机构
        updatedAt: "",  // 录入时间
      },

      keyParts:[],  // 重点部位 列表
      brandList: [],  //品牌列表
      keyPart: [],  // 所属重点部位
      protocolList:[
         { label: '建行协议', value: '建行协议' },
         { label: '私有协议', value: '私有协议' }
      ],  // 接入协议
      modelList:[],  // 型号

      tableData:[],  //  列表数据
      columns: [
        { prop: 'orgName', sortable: false, label: '所属机构', width: '110',sortable: true },
        { prop: 'keyPartName', sortable: false, label: '所属重点部位', width: '150',sortable: true },
        { prop: 'platformName', sortable: false, label: '所属对讲平台', width: '120',sortable: true },
        { prop: 'name', sortable: false, label: '对讲主机', width: '110',sortable: true },
        { prop: 'brand', sortable: false, label: '品牌', width: '110',sortable: true },
        { prop: 'modelNum', sortable: false, label: '型号', width: '110',sortable: true },
        { prop: 'uniqueId', sortable: false, label: '对讲主机唯一ID', width: '130',sortable: true },
        { prop: 'isVideoLink', sortable: false, label: '关联视频通道', width: '120',sortable: true },
        { prop: 'isAudioLink', sortable: false, label: '关联对讲通道 ', width: '130',sortable: true },
        { prop: 'isGuardLink', sortable: false, label: '关联门禁通道', width: '130',sortable: true },
        { prop: 'isOutputLink', sortable: false, label: '关联输出通道', width: '130',sortable: true },
        { prop: 'assetCode', sortable: false, label: '资产编码', width: '110',sortable: true },
        { prop: 'status', label: '在线状态', width: '110',sortable: true},
        // { prop: 'runStatus', label: '运行状态', width: '110',sortable: true},
        { prop: 'updatedDept', label: '录入机构', width: '110',sortable: true },
        { prop: 'updatedBy', label: '录入人', width: '110',sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '150',sortable: true }
      ],
      rules:searchRules.intercomPlatformSearch,
      total: 0,
      page:1,
      limit:25,
      selectItem:[],  // 列表选中数据
      fliterBoxVisible : true, // 查询条件 模块显示隐藏
      copyKeyPartName: '', // 复制选择重点部位名称
      copyOrgName: '', // 复制选择机构名称
      copyPlatName: '', // 复制选择机构名称
      
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 机构部位（平台名称）失焦判断是否为空 清空对应id
    bulrChange (val) {
      if (val === 'org') {
        if (!this.formData.orgName) {
          this.formData.orgId = ''
        }
        if (this.formData.orgName !== this.copyOrgName) {
          this.formData.orgName = ''
          this.formData.orgId = ''
        }
      } else if (val === 'kp') {
        if (!this.formData.keyPartName) {
          this.formData.keyPartId = ''
        }
        if (this.formData.keyPartName !== this.copyKeyPartName) {
          this.formData.keyPartName = ''
          this.formData.keyPartId = ''
        }
      } else if (val === 'platform') {
        if (!this.formData.platformName) {
          this.formData.platformId = ''
        }
        if (this.formData.platformName !== this.copyPlatName) {
          this.formData.platformName = ''
          this.formData.platformId = ''
        }
      }
    },
    // 远程搜索机构部位
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.formData.orgId : undefined,
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

    // 平台列表
    querySearch2(value, callback) {
      const params = {}
      platformListApi(params)
        .then((res) => {
          if (!res.data.data.code) {
            callback(res.data.data || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch((err) => {
          console.log(err)
          callback([])
        })
    },
    // 选择机构部位赋对应值
    selectTreeItem(type, val) {
      if (type === 'org') {
        this.formData.orgId = val.id
        this.formData.orgName = val.name
        this.copyOrgName = val.name
      } else if (type === 'kp') {
        this.formData.keyPartId = val.id
        this.formData.keyPartName = val.name
        this.copyKeyPartName = val.name
      } else if (type === 'platform') {
        this.formData.platformId = val.id
        this.formData.platformName = val.name
        this.copyPlatName = val.name
      }
    },

    // 获取 机构树 api
    getTree(params) {
      return getTreeApi(params)
    },

    // 机构树 点击获取
    playBackGetData(node) {
      console.log(node)
      this.messageEd = node;
      this.formData.orgName = node.name;
      if (node.tierType == 'org') {
        this.formData.orgId = node.id;
      }
      let obj = {
        type: 2,
        oId: node.serial,
      }
      this.keyParts = [];  // 重点部位 集合
      this.formData.keyPartId = '';
      getTreeApi(obj).then((res) => {
        if (res.data.data.nodes) {
          res.data.data.nodes.forEach((item) => {
            if (item.tierType === 'loc') {
              this.keyParts.push(item)
            }
          })
        }
      })
    },

    // 获取品牌/型号字典列表
    // 获取品牌列表
    getBrandList(){
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '3' }]
      console.log(queryList)
       getBrandModuleApi({queryList}).then(res=>{
         console.log(res)
        this.brandList=res.data.data[0].attr
       })
    },

    getModelBrandList(index) {
      this.formData.modelNum = ''
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '4', homeClass: this.formData.brand }]
       getBrandModuleApi({queryList}).then(res=>{
          this.modelList=res.data.data[0].attr
       })
    },
    // 触发查询
    search(){
      // 将分页子组件置为第一页
      this.$refs.listPagination.page = 1
      this.getList();
    },

    // 重置
    reset(){
      this.formData = {
        // 表单数据
        orgName:"",  // 所属机构 
        orgId:'',   // 所属机构 id
        keyPartId:"",  // 所属部位id
        platformName:"", //  对讲平台 名称
        platformId:'',
        name:"", //  对讲主机 名称
        
        brand:"",//品牌
        modelNum:'',//型号
        uniqueId:"",//对讲平台唯一ID
        isVideoLink:'',  // 关联视频通道
        isAudioLink:'',  //  关联对讲通道 
        isGuardLink:'',  // 关联门禁通道
        isOutputLink:'',  // 关联输出通道

        assetCode:'',//资产编码
        status:"",//在线状态
        // runStatus:'',//运行状态
        
        updatedBy: "",   // 录入人
        updatedDept: "",  // 录入机构
        updatedAt: "",  // 录入时间;
      };
      this.value = []
    },

    // 获取列表
    getList(){
      let { orgName,orgId,keyPartId,platformId,name,brand,modelNum,uniqueId,isVideoLink,isAudioLink,isGuardLink,isOutputLink,assetCode,status,updatedBy,updatedDept,updatedAt } = this.formData;
      var params = {
        target:'host',   // platform:平台查询，host:主机查询，channel通道查询
        page:this.page,
        limit:this.limit,
        startTime:updatedAt?updatedAt[0]:'',
        endTime:updatedAt?updatedAt[1]:'',
        like:{
          name:name,
          uniqueId:uniqueId,
          assetCode:assetCode,
          updatedBy:updatedBy,
          updatedDept:updatedDept,
          // updatedAt:updatedAt,
        },    // 模糊查询字段描述
        equal:{
          // orgName:orgName,
          orgId:orgId,
          keyPartId:keyPartId,
          platformId:platformId,
          brand:brand,
          modelNum:modelNum,
          isVideoLink:isVideoLink,
          isAudioLink:isAudioLink,
          isGuardLink:isGuardLink,
          isOutputLink:isOutputLink,
          status:status,
          // runStatus:runStatus,
        },    // 等值查询字段描述(精准匹配)
      }
      searchApi(params).then( res => {
        console.log(res)
        if(res.data.code == 0){
          this.tableData = res.data.data.hosts;
          this.tableData.forEach( (item,index) => {
            item.index = index+1;
          })
          this.total = res.data.data.count.total || 0;
        }
      }).catch( error => {

      });
    },
    
    paginationConfChange(obj) {
      this.page = obj.page
      this.limit = obj.limit
      this.getList()
    },

    // 表格数据处理
    formatterTable(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'status':
          if(cellValue == 2){
            params = '在线';
          }else if(cellValue == 1){
            params = '离线';
          }else{
            params = '未知';
          }
          break
        
        // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
        // case 'runStatus':
        //   if(cellValue == 1){
        //     params = '离线';
        //   }else if(cellValue == 2){
        //     params = '空闲';
        //   }else if(cellValue == 3){
        //     params = '呼出';
        //   }else if(cellValue == 4){
        //     params = '响铃';
        //   }else if(cellValue == 5){
        //     params = '对讲中';
        //   }else if(cellValue == 6){
        //     params = '广播中';
        //   }else{
        //     params = '未知';
        //   }
        //   break
        case 'isVideoLink':
          params = cellValue === 2 ? '已关联' : ' '
          break
        case 'isAudioLink':
          params = cellValue === 2 ? '已关联' : ' '
          break
        case 'isGuardLink':
          params = cellValue === 2 ? '已关联' : ' '
          break
        case 'isOutputLink':
          params = cellValue === 2 ? '已关联' : ' '
          break
        // case 'type':
        //   obj = {
        //     1: 'NVR',
        //     2: 'HDVR',
        //     3: 'DVR',
        //     4: 'IPC'
        //   }
        //   params = obj[cellValue] || ''
        //   break
        // case 'protocol':
        //   obj = {
        //     1: 'TCP',
        //     2: 'UDP'
        //   }
        //   params = obj[cellValue] || ''
        //   break
        default:
          params = cellValue
          break
      }
      return params
    },

    // 依据数组对象某一个属性进行排序
    compare(prop){
      return function(a,b){
        var value1 = a[prop];
        var value2 = b[prop];
        return value1 - value2;
      }
    },

    // 单选
    select(s, row) {
      console.log(s, row, '单选')
    },

    // 选中事件（多选）
    handleSelectionChange(selection) {
      var list = [...selection];
      list.sort(this.compare('index'));
      this.selectItem = list;
    },

    //导出 
    exportFile() {
      if (this.selectItem && this.selectItem.length > 0) {
        const tHeader = [
          '序号',
          '所属机构',
          '所属重点部位',
          '所属对讲平台',
          '对讲主机',
          '品牌',
          '型号',
          '对讲平台唯一ID',
          '关联视频通道',
          '关联对讲通道 ',
          '关联门禁通道',
          '关联输出通道',
          '资产编码',
          '在线状态',
          // '运行状态',
          '录入机构',
          '录入人',
          '录入时间',
        ]
        const filterVal = [
          'index',
          'orgName',
          'keyPartName',
          'platformName',
          'name',
          'brand',
          'modelNum',
          'uniqueId',
          'isVideoLink',
          'isAudioLink',
          'isGuardLink',
          'isOutputLink',
          'assetCode',
          
          'status',
          // 'runStatus',
          'updatedDept',
          'updatedBy',
          'updatedAt',
        ]
        let list = []
        list = this.$lodash.cloneDeep(this.selectItem)
        list.forEach((item,index) => {
          // item.index = index+1;
          if (item.status == 2) {
            item.status = '在线'
          } else if (item.status == 1) {
            item.status = '离线'
          }else{
            item.status = '未知'
          }
          item.isVideoLink = item.isVideoLink == 1 ? ' ' : '已关联';
          item.isAudioLink = item.isAudioLink == 1 ? ' ' : '已关联';
          item.isGuardLink = item.isGuardLink == 1 ? ' ' : '已关联';
          item.isOutputLink = item.isOutputLink == 1 ? ' ' : '已关联';
        })
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '对讲主机关联配置')
      } else {
        let { orgName,orgId,keyPartId,platformId,name,brand,modelNum,uniqueId,isVideoLink,isGuardLink,isOutputLink,assetCode,status,updatedBy,updatedDept,updatedAt } = this.formData;
        var params = {
          pattern: "query",
          startTime:updatedAt?updatedAt[0]:'',
          endTime:updatedAt?updatedAt[1]:'',
          like:{
            name:name,
            uniqueId:uniqueId,
            assetCode:assetCode,
            updatedBy:updatedBy,
            updatedDept:updatedDept,
          },    // 模糊查询字段描述
          equal:{
            // orgName:orgName,
            orgId:orgId,
            keyPartId:keyPartId,
            platformId:platformId,
            brand:brand,
            modelNum:modelNum,
            isVideoLink:isVideoLink,
            isGuardLink:isGuardLink,
            isOutputLink:isOutputLink,
            status:status,
            // runStatus:runStatus,
          },    // 等值查询字段描述(精准匹配)
        };
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/audio/host/linkage/download`
        let title = `对讲主机关联配置${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          title,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'post',
          params
        )
      }
    },
     // 导出第二步
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  },
  created() {
    this.getBrandList();
  },
  mounted(){
    this.$refs.listPagination.setTotal(this.limit)
  },
  beforeDestroy(){},
  
}
</script>
<style lang="less" scoped>
    .Serarch-box{
      padding:0 20px;
    }
      header{
        margin-top:20px;
      }
     .top-box{
        margin-top:20px;
        height:100px;
        .title {
          margin-left: 7px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          position: relative;
          cursor: pointer;
        }
        .title::before {
          content: '';
          width: 2px;
          height: 12px;
          display: block;
          background: #2d72d3;
          position: absolute;
          left: -7px;
          top: 2.5px;
        }
        .form-title {
          margin-bottom: 15px;
          i {
            color: #333;
          }
        }
      }
    .box-title {
      position: relative;
      width: 80%;
      height: 24px;
      line-height: 24px;
      color: #606266;
      margin-bottom: 10px;
      i {
        position: absolute;
        top: 50%;
        left: 80px;
        transform: translateY(-50%);
      }
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-left: 120px;
        margin-top: -12px;
      }
    }
    .form-content {
      font-size: 12px;
      display: flex;
      flex-wrap: wrap;
      padding: 16px 12px 0;
      border: 1px solid #f7f2f1;
      background: #F5F5F5;
      /deep/.el-select {
        // width: 280px;
        width:100%;
      }
      /deep/.el-form-item__label{
        font-size: 12px;
      }
      .form-group{
        width:25%;
        margin-bottom:15px;
      }
      .inp1{
        // width: 280px;
        width:100%;
      }
    }
    .form-footer {
      text-align: center;
      margin-top: 20px;
    }
    .form-table{
      height:310px;
      padding:10px 0px;
      .box-title {
        position: relative;
        width: 100%;
        height: 24px;
        line-height: 24px;
        color: #606266;
        i {
          position: absolute;
          top: 50%;
          left: 80px;
          transform: translateY(-50%);
        }
        &::after {
          display: block;
          content: '';
          border-top: 1px solid #e1e1e1;
          width: calc(~'100% - 120px');
          margin-left: 120px;
          margin-top: -12px;
        }
      }
    }
</style>