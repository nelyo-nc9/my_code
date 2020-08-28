<template>
  <div class="main">
    <div class="form-box">
      <div class="form-top">编辑对讲设备信息</div>

      <!-- 对讲设备表单信息 -->
      <div class="form-content">
        <el-form ref="intercom_equipment_info_rule_form" size="mini" :model="formData" label-position="right" label-width="130px" :rules="intercom_equipment_info_rule">
          <el-form-item label="所属机构" class="form-group">
            <el-input disabled v-model="formData.orgName"></el-input>
          </el-form-item>
          <el-form-item label="所属重点部位" class="form-group">
            <el-input v-model="formData.keyPartName" disabled></el-input>
          </el-form-item>

          <el-form-item label="所属对讲平台" prop="platformName" class="form-group">
            <el-input v-model="formData.platformName" disabled></el-input>
          </el-form-item>

          <el-form-item label="对讲设备名称" class="form-group" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="类型" class="form-group">
            <el-input value="主机" disabled v-model="formData.subSystemName"></el-input>
          </el-form-item>
          <!-- 对讲主机品牌型号 -->
          <el-form-item v-show="ishaha" label="品牌" prop="brand" class="form-group">
            <el-select v-model="formData.brand" class="brand" width="500px" @change="updatehostList(formData.brand)">
              <el-option v-for="(item,index) in brandhostList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="ishaha" label="型号" prop="modelNum" class="form-group">
            <el-select v-model="formData.modelNum" class="brand">
              <el-option v-for="(item,index) in modelhostList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"></el-option>
            </el-select>
          </el-form-item>
          <!-- 台麦品牌型号 -->
          <el-form-item label="品牌" v-show="!ishaha" prop="brand" class="form-group">
            <el-select v-model="formData.brand" class="brand" width="500px" @change="getMikeList(formData.brand)">
              <el-option v-for="(item,index) in brandMikeList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号" v-show="!ishaha" prop="modelNum" class="form-group">
            <el-select v-model="formData.modelNum" class="brand">
              <el-option v-for="(item,index) in modelMikeList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="对讲设备IP地址" prop="ip" class="form-group">
              <el-input v-model="formData.ip"></el-input>
          </el-form-item>
          <el-form-item label="端口号" class="form-group" prop="port">
              <el-input v-model="formData.port"></el-input>
          </el-form-item>

          <el-form-item label="对讲通道数量" v-show="ishaha" class="form-group">
            <el-input v-model="formData.intercomNumber"></el-input>
          </el-form-item>
          <el-form-item label="对讲设备唯一ID" prop="uniqueId" class="form-group">
            <el-input v-model="formData.uniqueId"></el-input>
          </el-form-item>

          <el-form-item label="资产编码" class="form-group">
            <el-input v-model="formData.assetCode"></el-input>
          </el-form-item>
          <el-form-item label="输出通道数量" v-show="ishaha" class="form-group">
            <el-input v-model="formData.outputNumber"></el-input>
          </el-form-item>

          <el-form-item label="在线状态" class="form-group">
              <el-select disabled  v-model="formData.status">
                <el-option v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <!-- <el-form-item label="运行状态" class="form-group">
            <el-input v-model="formData.runStatus"></el-input>
          </el-form-item> -->

        </el-form>
      </div>

      <!-- 录入时间 录入人 录入机构 -->
      <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right">{{ createdAt }}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right">{{ createdDept }}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right">{{ createdBy }}</div>
          </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-footer">
        <el-button type="primary" size="mini" @click="savePlatform">保存</el-button>
        <el-button size="mini" style="margin:0 24px" @click="resetForm">重置</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </div>
    </div>

    <!-- 通道管理  、事件管理 -->
    <div v-show="ishaha" class="wrap-bottom">
      <div class="tabs-container">
        <el-tabs type="border-card" v-model="editableTabsValue">
          <el-tab-pane label="通道管理" name="1"></el-tab-pane>
          <el-tab-pane label="事件管理" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="show" v-show="activeshow">
          <!-- 对讲通道  列表 添加（编辑）弹窗 -->
          <!-- 标题 -->
          <div class="wrap-oprate" v-show="editableTabsValue == '1'">
            <div class="form-title">
              <span class="title"
                    @click="dropdownStatus.detector = !dropdownStatus.detector">对讲通道列表</span>
              <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </div>
            <div class="list-header">
              <i class="el-icon-download" title="获取通道信息" @click="up"></i>
              <i
                class="el-icon-circle-plus-outline"
                title="新增"
                @click="add"
              ></i>
              <i class="el-icon-edit" title="编辑" @click="edit"></i>
              <i class="el-icon-delete" title="删除" @click="del"></i>
              <i class="el-icon-refresh-right" @click="getchannelList()" title="刷新"></i>
            </div>
          </div>
          <div class="bottom-box" v-show="editableTabsValue == '1'" style="margin-top:15px;">
            <div style="width:100%;">
                <div v-show="dropdownStatus.detector"
                     style="width:100%;">
                  <!-- 对讲通道列表 -->
                  <el-table 
                          border
                          style="width: 100%"
                          size="mini"
                          :data="tableDataa"
                          @selection-change="handleSelectionChange"
                          @select="select"
                          stripe>
                      <el-table-column type="selection"></el-table-column>
                      <el-table-column type="index"        
                                  label="序号">
                      </el-table-column>
                      <el-table-column v-for="item in taimaiColumn"
                                  :key="item.label"
                                  :prop="item.prop"
                                  :label="item.label"
                                  :formatter="formatterTable"
                                  show-overflow-tooltip
                                  align="center">
                      </el-table-column>
                  </el-table>
                </div>
            </div>
          </div>

          <!--添加/修改对讲通道 -->
          <el-dialog :title="modalTitle" :visible.sync = "intercomChannelModalVisible" :before-close="cancal"  width="440px" :close-on-click-modal="false">
            <el-form :model="inputDatae" :rules="IntercomChannel" size="mini" label-position="right" label-width="140px" ref="Intercom_channel_edit_form">
              <el-form-item label="对讲通道名称" prop="name">
                <el-input v-model="inputDatae.name"></el-input>
              </el-form-item>
              <el-form-item label="对讲通道号" prop="serise">
                <el-input v-model="inputDatae.serise" type='number'></el-input>
              </el-form-item>
              <el-form-item label="面板ID" prop="uniqueId">
                <el-input v-model="inputDatae.uniqueId"></el-input>
              </el-form-item>
              <el-form-item label="应用类型" prop="class1">
                <el-select v-model="inputDatae.class1" class="brand" width="500px">
                    <el-option v-for="(item,index) in classList"
                              :key="index"
                              :label="item.data"
                              :value="item.key"
                              ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="inputDatae.brand" class="brand" width="500px" @change="updateModelTalkList">
                    <el-option v-for="(item,index) in brandTalkList"
                              :key="index"
                              :label="item.data"
                              :value="item.data"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelNum">
                <el-select v-model="inputDatae.modelNum" class="brand">
                    <el-option v-for="(item,index) in modelTalkList"
                              :key="index"
                              :label="item.data"
                              :value="item.data"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="资产编码" prop="assetCode">
                <el-input v-model="inputDatae.assetCode"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align:center;">
              <el-button size="mini" type="primary" @click="saveIntercomChannel">保存</el-button>
              <el-button size="mini" @click="cancal">取消</el-button>
            </div>
          </el-dialog>

          <!-- 输出通道  列表 添加（编辑）弹窗 -->
          <!-- 标题 -->
          <div class="box-title" v-show="editableTabsValue == '1'">
            <div class="wrap-oprate">
              <div class="form-title">
                <span class="title"
                      @click="dropdownStatus.outputDetector = !dropdownStatus.outputDetector">输出通道列表</span>
                <i :class="dropdownStatus.outputDetector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </div>
              <div class="list-header">
                  <i class="el-icon-download" title="获取通道信息" @click="up"></i>
                  <i
                    class="el-icon-circle-plus-outline"
                    title="新增"
                    @click="edits('add')"
                  ></i>
                  <i class="el-icon-edit" title="编辑" @click="edits"></i>
                  <i class="el-icon-delete" title="删除" @click="del"></i>
                  <i class="el-icon-refresh-right" title="刷新" @click="getchannelLists()"></i>
              </div>
            </div>
          </div>
          <!-- 输出通道列表 -->
          <div class="bottom-box" v-show="editableTabsValue == '1'" style="margin-top:15px;">
            <div style="width:100%;">
                <div v-show="dropdownStatus.outputDetector"
                    style="width:100%;">
                    <el-table 
                            border
                            style="width: 100%"
                            size="mini"
                            @selection-change="handleSelectionChange"
                            @select="select"
                            :data="tableDatas"
                            stripe>
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column type="index"        
                                    label="序号">
                        </el-table-column>
                        <el-table-column v-for="item in goColumn"
                                    :key="item.label"
                                    :prop="item.prop"
                                    :label="item.label"
                                    :formatter="formatterTable"
                                    show-overflow-tooltip
                                    align="center">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
          </div>

          <!--添加修改输出通道  弹窗-->
          <el-dialog :title="modalTitle" :visible.sync="isEditShux" width="440px" :close-on-click-modal="false">
            <el-form :model="inputDatax" ref="inputDatax" size="mini" :rules="outputChannel1" label-position="right" label-width="140px">
              <el-form-item label="输出通道名称" prop="name">
                <el-input v-model="inputDatax.name"></el-input>
              </el-form-item>
              <el-form-item label="输出通道号" prop="serise">
                <el-input v-model="inputDatax.serise"></el-input>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="inputDatax.brand" class="brand" width="500px" @change="updateModelOutList">
                  <el-option v-for="(item,index) in brandOutList"
                              :key="index"
                              :label="item.data"
                              :value="item.data"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelNum">
                <el-select  v-model="inputDatax.modelNum" class="brand">
                    <el-option v-for="(item,index) in modelOutList"
                                :key="index"
                                :label="item.data"
                                :value="item.data"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="资产编码" prop="assetCode">
                <el-input v-model="inputDatax.assetCode"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align:center;">
              <el-button size="mini" type="primary" @click="saveShux">保存</el-button>
              <el-button size="mini" @click="cancal">取消</el-button>
            </div>
          </el-dialog>

          <div class="box-change" v-show="editableTabsValue == '2'">
              <el-button size="mini">异常设备</el-button>
              <div class="center">
                <p>异常类型</p>
                <div class="a1">
                    <el-select v-model="formData.keyPart" size="mini">
                      <el-option v-for="item in keyPart"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                      </el-option>
                    </el-select>
                </div>
                <div class="a2">
                    <el-checkbox v-model="checked">启用</el-checkbox>
                </div>
              </div>
              <div class="bottom" style="margin-top:20px">
                <el-button size="mini">保存</el-button>
                <el-button size="mini">取消</el-button>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import audioRules from 'assets/rules/validation/security/audio'
import {createAudioChannelApi,getAudioHostApi,getHostListChannelApi,getBrandModuleApi,deletChannelListApi,editHostListApi,editChannelListApi} from "../../../../../http/audioManage/talkback.api"
import { Carousel } from 'element-ui'
export default {
  components: {},
  props:["talklist"],
  data() {
    return {
      editableTabsValue: '1',
      IntercomChannel: {
        name: [
          { required: true, message: '请输入对讲通道名称', trigger: 'blur' }
        ],
        serise: [
          { required: true, message: '请输入对讲通道号', trigger: 'blur' }
        ],
        class1: [
          { required: true, message: '请选择应用类型', trigger: 'change' }
        ],
        uniqueId: [
          { required: true, message: '请输入面板ID', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '请选择品牌名', trigger: 'change' }
        ],
        modelNum: [
          { required: true, message: '请选择品牌型号', trigger: 'change' }
        ]
      },
      outputChannel: {
        name: [
          { required: true, message: '请输入输出通道名称', trigger: 'blur' }
        ],
        serise: [
          { required: true, message: '请输入输出通道号', trigger: 'blur' }
        ]
      },
      outputChannel1: {
        name: [
          { required: true, message: '请输入输出通道名称', trigger: 'change' }
        ],
        serise: [
          { required: true, message: '请输入输出通道号', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '请选择品牌名', trigger: 'change' }
        ],
        modelNum: [
          { required: true, message: '请选择品牌型号', trigger: 'change' }
        ]
      },
      // 对讲设备信息
      formData: {
        orgName: '',
        keyPartName: '',
        uniqueId: '',
        platformName:'',
        name:'',
        brand:'',
        intercomNumber:'',
        ip: '',
        port:'',
        assetCode:'',
        status:'',
        modelNum:'',
        outputNumber:'',
        createdAt: '',
        createdDept: '',
        createdBy: '',
      },
      statusList:[
        { label:'在线',value:2,},
        { label:'离线',value:1,},
        { label:'未知',value:3,}
      ],
      checked: null,
      // 对讲设备 表单信息验证
      intercom_equipment_info_rule:audioRules.intercomPlatformRules,
      intercomChannelModalVisible:false,  // 对讲通道弹窗 显示隐藏
      intercomChannelEdit:false,  // 对讲通道 添加 false/编辑true
      isEditShu:false,
      isEditShux:false,

      modalTitle:"",
      inputData: {
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        type: "1",
        class:""
      },
      inputDatae: {
        name: '',
        serise:'',
        class1:'',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        port:"",
        type: "1",
        class:""
      },  // 对讲通道表单 详情信息
      Intercom_channel_edit_form_rule:audioRules.intercomPlatformRules,
      inputDatas:{
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        port:"",
        type: "2",
        class:""  
      },
      inputDatax:{
        name: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        serise: '',
      },
      aisleList: [
        { label: '通道1', value: '通道1' },
        { label: '通道2', value: '通道2' }
      ],
      keyPart: [
        { label: '网络断开', value: '网络断开' },
        { label: '防拆报警', value: '防拆报警' }
      ],
      dropdownStatus: {
        detector: true,
        outputDetector: true
      },
      
      taimaiColumn: [
        // 台麦列表项
        { prop: 'name', label: '对讲通道名称', width: '',sortable: true },
        { prop: 'serise', label: '对讲通道号',  width: '',sortable: true },
        { prop: 'type', label: '应用类型',  width: '',sortable: true },
        { prop: 'brand', label: '品牌',  width: '',sortable: true },
        { prop: 'modelNum', label: '型号',  width: '',sortable: true },
        { prop: 'assetCode', label: '资产编码',  width: '',sortable: true },
        { prop: 'status', label: '在线状态',  width: '',sortable: true },
        // { prop: 'status', label: '运行状态',  width: '',sortable: true }
      ],
      goColumn: [
        // 台麦列表项
        { prop: 'name', label: '输出通道名称',  width: '',sortable: true },
        { prop: 'serise', label: '输出通道号',  width: '',sortable: true },
        { prop: 'brand', label: '输出设备品牌',  width: '',sortable: true },
        { prop: 'modelNum', label: '输出设备型号',  width: '',sortable: true },
        { prop: 'assetCode', label: '资产编码',  width: '',sortable: true },
        { prop: 'status', label: '在线状态',  width: '',sortable: true },
        // { prop: 'status', label: '运行状态',  width: '',sortable: true }
      ],
      activeList:true,
      activeshow:true,
      activeBtn:false,
      tableDataa:[],  // 对讲通道列表
      arr:[],
      channels:[],
      ishaha:true,
      brandhostList:[], // 对讲平台品牌列表
      modelhostList:[], // 对讲型号列表
      brandMikeList: [], // 话筒品牌列表
      modelMikeList: [], // 话筒型号列表
      brandTalkList: [], // 对讲通道品牌列表
      modelTalkList: [], // 对讲通道型号列表
      brandOutList: [], // 输出通道品牌列表
      modelOutList: [], // 输出通道筒型号列表
      classList:[],
      tableDatas:[],  // 输出通道列表
    }
  },

  computed:{
    // 录入时间
    createdAt(){
      if( this.formData.createdAt && this.formData.createdAt != '' ){
        return this.formData.createdAt;
      }else{
        return this.getNow();
      }
    },

    // 录入机构
    createdDept(){
      if( this.formData.createdDept && this.formData.createdDept != '' ){
        return this.formData.createdDept;
      }else{
        return JSON.parse(sessionStorage.getItem('user')).orgName;
      }
    },

    // 录入人
    createdBy(){
      if( this.formData.createdBy && this.formData.createdBy != '' ){
        return this.formData.createdBy;
      }else{
        return JSON.parse(sessionStorage.getItem('user')).name;
      }
    },
  },
  
  methods: {
    // 重置表单
    resetForm () {
      this.formData =  this.$lodash.cloneDeep(this.talklist)
    },
    // 处理表格数据
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
        case 'inputNumber':
        case 'outputNumber':
        case 'analogNumber':
        case 'audioNumber':
        case 'digitalNumber':
          params = cellValue === '' ? 0 : cellValue
          break
        case 'class':
          params = callValue === 2 ? '业务':"--"
          break
        case 'type':
          obj = {
            1: 'NVR',
            2: 'HDVR',
            3: 'DVR',
            4: 'IPC'
          }
          params = obj[cellValue] || ''
          break
        case 'protocol':
          obj = {
            1: 'TCP',
            2: 'UDP'
          }
          params = obj[cellValue] || ''
          break
        default:
          params = cellValue
          break
      }
      return params
    },

    // 获取对讲通道列表
    getchannelList(){
      let obj={
        id:this.talklist.id,
        type:1
      }
      getAudioHostApi(obj).then(res=>{
         console.log(res)
         if(res.data.code == 0){
          this.tableDataa=res.data.data;
          this.$notify({
            title: '提示',
            message: '获取对讲通道成功',
            position: 'top-right',
            type: 'success'
          });
         }
      })
    },

    // 获取输出通道列表
    getchannelLists(){
      let obj={
        id:this.talklist.id,
        type:2
      }
      getAudioHostApi(obj).then(res=>{
         console.log(res)
         if(res.data.code == 0){
          this.tableDatas=res.data.data;
          this.$notify({
            title: '提示',
            message: '获取输出通道成功',
            position: 'top-right',
            type: 'success'
          });
         }
      })
    },
    
    close(){
        this.$emit('closeEdit')
    },
    //修改主机
    savePlatform(){
      this.$refs['intercom_equipment_info_rule_form'].validate((valid) => {
        if (valid) {
          let obj = Object.assign({}, this.formData)
          editHostListApi(obj).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$notify({
                title: '提示',
                message: '修改成功',
                position: 'top-right',
                type: 'success'
              });
              this.$emit('closeEdit')
            }else{
              this.$notify({
                title: '提示',
                message: res.data.message,
                position: 'top-right',
                type: 'error'
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
        
    },
    handleSelectionChange(val){   
      this.arr = [...val]
    },
    select(s,row){
      row.class1 = row.class;
      this.channels = row
      this.id=row.id
      console.log(this.id)
      console.log(typeof this.channels.class)
    },
    
    edits(action){
      if (action === 'add') {
        this.action = 'add'
        this.modalTitle = '添加输出通道'
        for (let i in this.inputDatax) {
          this.inputDatax[i] = ''
        }
        this.isEditShux = true
        this.$nextTick(() => {
          this.$refs.inputDatax && this.$refs.inputDatax.clearValidate();
        })
        return
      }
      this.action = ''
      if(this.arr.length===0){
        this.$notify({
          title: '提示',
          message: '请勾选列表',
          position: 'top-right'
        });
      } else {
        this.modalTitle = '修改输出通道'
        this.isEditShux = true
        let obj = Object.assign(this.inputDatax, this.channels)
        this.inputDatax= this.$lodash.cloneDeep(obj)
        if (this.inputDatax.brand) {
          this.updateModelOutList(this.inputDatax.brand, true)
        }
      }
    },
     
    isconfig(){
      this.activeList=true
      this.activeBtn=false
    },
    ispage(){
        this.activeList=false
        this.activeBtn=true
    },
    up(){
      this.$notify({
        title: '提示',
        message: '获取失败',
        position: 'top-right',
        type: 'error'
      });
    },

    // 新增对讲通道
    add(){
      // 表单字段 初始化
      for (let key in this.inputDatae){
        this.inputDatae[key] = ''
      }
      // 将弹窗 置为 添加状态
      this.intercomChannelEdit = false;
      // 弹窗 标题
      this.modalTitle = '新增对讲通道'
      // 显示添加 弹窗
      this.intercomChannelModalVisible = true;
      this.$nextTick(() => {
        this.$refs.Intercom_channel_edit_form && this.$refs.Intercom_channel_edit_form.clearValidate()
      })
    },

    //编辑对讲通道
    edit(){
      if(this.arr.length===0){
        this.$notify({
          title: '提示',
          message: '请勾选列表',
          position: 'top-right'
        });
      } else {
        // 将弹窗 置为 编辑状态
        this.intercomChannelEdit = true;
        // 弹窗 标题
        this.modalTitle = '修改对讲通道'
        // 显示添加 弹窗
        this.intercomChannelModalVisible = true;
        let obj = Object.assign(this.inputDatae, this.channels)
        // 将当前列表所选的数据 赋给 当前弹窗
        this.inputDatae= this.$lodash.cloneDeep(obj)
        if (this.inputDatae.brand) {
          this.updateModelTalkList(this.inputDatae.brand, true)
        }
      }
    },

    //新增/修改对讲通道 提交
    saveIntercomChannel(){
       this.$refs['Intercom_channel_edit_form'].validate((valid) => {
          if (valid) {
            let { name,serise,brand, class1,accessProtocol,ip,assetCode,modelNum,uniqueId,accessService,} =this.inputDatae
            //  验证 对讲通道名称 和 对讲通道号重复
            // 思路：如果当前是编辑状态 需要验证除自身外跟其他项是否重复；
            // 如果是添加状态，需要验证跟其他项是否重复；
            var tableDataa = this.tableDataa;
            var flag1 = tableDataa.some( (item) => { 
              if(this.intercomChannelEdit){
                return item.id != this.inputDatae.id && item.name == this.inputDatae.name;
              }else{
                return item.name == this.inputDatae.name;
              }
            })
            var flag2 = tableDataa.some( (item) => { 
              if(this.intercomChannelEdit){
                return item.id != this.inputDatae.id && item.serise == this.inputDatae.serise;
              }else{
                return  item.serise == this.inputDatae.serise;
              }
            })
            if( flag1){
              this.$notify({
                title: '警告',
                message: '对讲通道名称不能重复',
                type: 'warning'
              });
              return false;
            }
            if( flag2){
              this.$notify({
                title: '警告',
                message: '对讲通道号不能重复',
                type: 'warning'
              });
              return false;
            }

            let obj={
              // id:this.channels.id,
              name:name,
              serise:serise,
              uniqueId:uniqueId,
              class:class1,
              brand:brand,//品牌
              modelNum:modelNum,
              assetCode:assetCode,
              deviceId:this.formData.id,  //主机主键id
              type:'1',  //通道类型,1|对讲通道,2|输出通道

              ip:ip,//对讲IP地址
              // status:status,
            }
            
            // 如果当前是编辑状态 赋值通道id
            if(this.intercomChannelEdit){
              obj.id = this.inputDatae.id;
              editChannelListApi(obj).then(res=>{
                if(res.data.code == 0){
                    this.$notify({
                      title: '提示',
                      message: '保存成功',
                      type: 'success'
                    });
                    this.getchannelList();
                    // 关闭弹窗
                    this.intercomChannelModalVisible=false;
                }else{
                  this.$notify({
                    title: '提示',
                    message: res.data.message,
                    type: 'error'
                  });
                }
              })
            }else{
              createAudioChannelApi(obj).then(res=>{
                console.log(res)
                if(res.data.code===0){
                  this.$notify({
                    title: '提示',
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getchannelList();
                  // 关闭弹窗
                  this.intercomChannelModalVisible=false;
                }else{
                  this.$notify({
                    title: '提示',
                    message: res.data.message,
                    type: 'error'
                  });
                }
              }) 
            }
            
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
    },

    // 对讲通道 取消提交
    cancal(){
      this.intercomChannelModalVisible=false 
      this.isEditShu=false
      this.isEditShux=false
    },
    
    // 获取 主机、台麦品牌列表
    gethostBrand(){
      let queryList = [
        { type: '2', moduleId: '1', childModuleId: '3', dictId: '3' }, // 主机品牌
        { type: '2', moduleId: '1', childModuleId: '3', dictId: '5' }, // 台麦品牌
        { type: '2', moduleId: '1', childModuleId: '3', dictId: '11' }, // 对讲通道品牌
        { type: '2', moduleId: '1', childModuleId: '3', dictId: '13' } // 输出通道品牌
      ]
      getBrandModuleApi({queryList}).then(res=>{
        this.brandhostList=res.data.data[0].attr
        this.brandMikeList=res.data.data[1].attr
        this.brandTalkList=res.data.data[2].attr
        this.brandOutList=res.data.data[3].attr
      })
    },
    // 获取主机品牌型号
    updatehostList(name, bool) {
      if (!bool) {
        this.formData.modelNum = ''
      }
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '4', homeClass: name }]
      getBrandModuleApi({queryList}).then(res=>{
        this.modelhostList=res.data.data[0].attr;
      })
    },

    // 获取台麦品牌型号列表
    getMikeList (name, bool) {
      if (!bool) {
        this.formData.modelNum = ''
      }
      
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '6', homeClass: name }]
      getBrandModuleApi({queryList}).then(res=>{
        this.modelMikeList=res.data.data[0].attr;
      })
    },

    // 获取对讲通道型号列表
    updateModelTalkList (name, bool) {
      if (!bool) {
        this.inputDatae.modelNum = ''
      }
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '12', homeClass: name }]
      getBrandModuleApi({queryList}).then(res=>{
        this.modelTalkList=res.data.data[0].attr;
      })
    },
    // 获取输出通道型号列表
    updateModelOutList (name, bool) {
      if (!bool) {
        this.inputDatax.modelNum = ''
      }
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '14', homeClass: name }]
      getBrandModuleApi({queryList}).then(res=>{
        this.modelOutList=res.data.data[0].attr;
      })
    },

    // 获取 通道 应用类型列表
    getClass(){
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '7' }]
       getBrandModuleApi({queryList}).then(res=>{
         if(res.data.code == 0){
           var list = res.data.data[0].attr;
           for(var i=0;i<list.length;i++){
             var s = parseInt(list[i].key);
             list[i].key = s;
           }
           this.classList = list;
         }
       })
    },
    
    handleSelectionChange(val){   
      this.arr = [...val]
      console.log(val, '列表勾选')
    },
      //创建输出通道
    saveShu(){
      this.$refs['inputDatax'].validate((valid) => {
        if (valid) {
          console.log(this.talklist)
          // let {brand,name,modelNum,serise,type,status,uniqueId,assetCode} =this.inputDatas
          let {brand,name,assetCode,modelNum,serise } =this.inputDatax
          let obj={
              deviceId:this.talklist.id,
              name:name,  // 通道名称
              type:2,
              class:2,
              brand:brand,
              modelNum:modelNum,
              assetCode:assetCode,
              serise: serise
          }
          createAudioChannelApi(obj).then(res=>{
              console.log(res)
              if(res.data.code===0){
                this.$notify({
                  title: '提示',
                  message: '添加成功',
                  type: 'success'
                });
                this.getchannelLists()
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                });
              }
              
          }) 
          this.isEditShux = false
        }
      })
    },
    //  编辑输出通道 保存
    saveShux(){
      if (this.action === 'add') {
        this.saveShu()
        return
      }
      this.$refs.inputDatax.validate((valid) => {
        if (valid) {
          let {brand,name,assetCode,modelNum,serise} =this.inputDatax
          let obj={
            id:this.channels.id,
            name:name, // 通道名
            serise: serise, // 输出通道号
            assetCode:assetCode, // 资产编码
            brand:brand,//品牌
            modelNum:modelNum // 型号
          }
          editChannelListApi(obj).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$notify({
                title: '提示',
                message: '修改成功',
                type: 'success'
              });
              this.getchannelLists()
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'error'
              });
            }
          })
          this.isEditShux=false
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },

    //删除通道
    del(){
      if(this.arr.length===0){
        this.$notify({
          title: '提示',
          message: '请勾选编辑项'
        });
        return
      }
      this.$confirm('确认删除选择项么', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids=this.arr.map(item=>{
          let {id}=item
          return id
        })
        console.log(ids)
        deletChannelListApi({ids}).then(res=>{
          if(res.data.code===0){
            this.getchannelList();
            this.getchannelLists();
          }
          console.log(res)
        })
      })
    },

    // 获取当前时间
    getNow(){
      var date=new Date();
      var year=date.getFullYear();  //年
      var month=date.getMonth()+1;  //月
      month = month<10 ? '0'+month : month;
      var day=date.getDate();  //日
      day = day<10 ? '0'+day : day;
      var hh=date.getHours();  //时
      hh = hh<10 ? '0'+hh : hh;
      var mm=date.getMinutes();  //分
      mm = mm<10 ? '0'+mm : mm;
      var ss=date.getSeconds();  //秒
      ss = ss<10 ? '0'+ss : ss;
      var rq=year+"-"+month+"-"+day+" "+hh+":"+mm+":"+ss;
      return rq;
    },
    
  },
  created(){
    this.gethostBrand(); // 获取主机台麦品牌
  },
  mounted(){
    console.log(this.talklist)
    this.formData =  this.$lodash.cloneDeep(this.talklist)
    if(this.talklist.type===2){
      this.ishaha=false
      this.getMikeList(this.talklist.brand)
    } else {
      this.updatehostList(this.talklist.brand, true) // 更新修改品牌下面得型号列表
      this.getchannelList(); // 获取通道列表
      this.getchannelLists(); // 获取输出通道列表
      this.getClass(); // 获取应用类型
    }
  },
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .el-dialog{
    .el-select{
      width: 100%;
    }
  }
  .wrap-bottom{
    padding-bottom: 20px;
  }
  .tabs-container {
    position: relative;
    .el-tabs--border-card {
      background: #ffffff;
      border: 0px;
      box-shadow: 0 0 0 0 #ffffff;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header {
      background-color: #ffffff;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
      &::after {
        content: '';
        display: block;
        width: 98px;
        height: 2px;
        background: #409eff;
        position: absolute;
        left: 0px;
        top: 0px;
      }
    }
    /deep/ .el-tabs__content {
      padding: 0;
    }
    .shrink-container {
      width: 46px;
      height: 36px;
      padding-left: 16px;
      position: absolute;
      top: 20px;
      right: 26px;
      background: #ffffff;
      .shrink-div {
        width: 36px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        font-size: 20px;
        border: 1px solid #9EADC1;
        border-radius: 2px;
        cursor: pointer;
        &:hover {
          border: 1px solid #3482F0;
        }
      }
    }
  }
  .box-change{
    width:440px;
    height: 200px;
    border: 1px solid #ccc;
    padding:10px;
    margin-top: 20px;
    .center{
      width:100%;
      height: 50px;
      margin-top:20px;
      line-height: 50px;
      p{
        float: left;
        margin-right:20px;
      }
      .a1{
        float: left;  
      }
      .a2{
        float: left;
        margin-left:50px;
      }
    }
  }
  .wrap-oprate{
    display: flex;
    justify-content: space-between;
    margin: 20px 0 10px;
    align-items: center;
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
      i {
        color: #333;
      }
    }
    .list-header {
      i {
        width: 35px;
        height: 28px;
        font-size: 16px;
        text-align: center;
        line-height: 28px;
        border-radius: 3px;
        border: 1px solid #E1E1E1;
        margin-left:5px;
        cursor: pointer;
      }
    }
  }
  .content-btn {
    margin: 10px 0;
  }
  .form-box {
    width:950px;
    // padding-top: 20px;
    .form-top {
      text-align: center;
      padding: 10px 0;
      font-size: 15px;
    }
    .form-content {
      overflow: hidden;
      padding: 16px 10px 0;
      font-size: 12px;
      border: 1px solid #f7f2f1;
      margin-bottom: 20px;
      background: #f5f5f5;
      .el-form{
        .el-select{
          width: 100%;
        }
      }
      .form-group{
        width: 50%;
        float: left;
      }
      .left-form {
        float: left;
        width: 400px;
        margin-right: 24px;
      }
      .right-form {
        float: left;
        width: 400px;
      }
    }
    .active-btn{
      margin-top:20px;
    }
    .buttom-box{
      width: 800px;
      height:300px;
    }
    .detail-bottom {
      color: #666;
      width: 950px;
      border: 1px solid #f2f2f2;
      display: flex;
      flex-wrap: wrap;
      margin-left: 0px;
      .detail-item {
        display: flex;
        width: 33.3%;
        height: 32px;
        line-height: 32px;
        .item-left {
          width: 145px;
          background: #f5f5f5;
          text-align: center;
        }
        .item-right {
          flex: 1;
          padding-left: 16px;
          border-left: none;
        }
      }
    }
    .form-footer {
      margin-top: 20px;
      text-align: center;
      padding-bottom: 20px;
    }
    .brand{
      width: 260px;
    }
  }
}
</style>
<style lang="less">
.main {
  .form-box {
    .left-form,
    .right-form {
      .el-form-item--mini.el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__label {
        border: 1px solid #fff;
      }
    }
  }
}
</style>
