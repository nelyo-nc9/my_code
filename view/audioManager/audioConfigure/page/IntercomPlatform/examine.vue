<template>
  <!-- 对讲平台 查看 -->
  <div class="main">
    <div class="left-tree">
      <orgTree style="width:290px" :lazyTreeApi="getAudioTreeApi" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi"  :treeType="treeType"  treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
    </div>
    <div class="form-box" v-if="activeCreate">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲平台管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="mini"  v-print="'#printJS_container'">打印</el-button>
          <el-button size="mini" @click="close">关闭</el-button>
        </div>
      </div>
      <div class="print-container" ref="printJS_container" id="printJS_container">
        <div class="form-top">对讲平台信息</div>
        <div class="form-content">
          <div class="form-group">
            <span class="label">所属机构</span>
            <span class="form-item">{{ formData.orgName }}</span>
          </div>
          <div class="form-group">
            <span class="label">所属重点部位</span>
            <span class="form-item">{{ formData.keyPartName }}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台名称</span>
            <span class="form-item">{{ formData.name }}</span>
          </div>
          <div class="form-group">
          </div>
          <div class="form-group">
            <span class="label">品牌</span>
            <span class="form-item">{{ formData.brand }}</span>
          </div>
          <div class="form-group">
            <span class="label">型号</span>
            <span class="form-item">{{ formData.modelNum }}</span>
          </div>
          
          <div class="form-group">
            <span class="label">接入协议</span>
            <span class="form-item">{{ formData.accessProtocol }}</span>
          </div>
          
          <div class="form-group">
            <span class="label">对讲平台IP地址</span>
            <span class="form-item">{{ formData.ip }}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台唯一ID</span>
            <span class="form-item">{{ formData.uniqueId }}</span>
          </div>
          <div class="form-group">
            <span class="label">服务器接收端口</span>
            <span class="form-item">{{ formData.cport }}</span>
          </div>
          <div class="form-group">
            <span class="label">终端接收端口</span>
            <span class="form-item">{{ formData.port }}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台用户名</span>
            <span class="form-item">{{ formData.username }}</span>
          </div>
          <div class="form-group">
            <span class="label">级联音频端口</span>
            <span class="form-item">{{ formData.dport }}</span>
          </div>
          <div class="form-group">
            <span class="label">资产编码</span>
            <span class="form-item">{{ formData.assetCode }}</span>
          </div>
          <!-- <div class="form-group">
            <span class="label">对讲平台密码</span>
            <span>{{ formData.password }}</span>
          </div> -->
          <div class="form-group" style="border:none">
            <span class="label">在线状态</span>
            <span class="form-item" v-if="formData.status == 2">在线</span>
            <span class="form-item" v-else-if="formData.status == 1">离线</span>
            <span class="form-item" v-else>未知</span>
          </div>
          <div class="form-group" style="border:none">
            <span class="label">接入服务器</span>
            <span class="form-item">{{ formData.accessService }}</span>
          </div>
        </div>

        <!-- 录入人 录入机构 录入时间 -->
        <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right">{{formData.updatedAt}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right">{{formData.updatedDept}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right">{{formData.updatedBy}}</div>
          </div>
        </div>

        <div class="bottom-box">
          <div style="width:100%;">
            <div class="box-title">
              <span class="pointer"
                    @click="toggleOpen('detector')">
                台麦列表
                <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.detector">
              <el-table 
                border
                size="mini"
                :data="tableDataa"
                @selection-change="handleSelectionChange"
                @select="select"
                stripe>
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column v-for="item in tableDatat"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                  :formatter="formatterTable"
                  align="center">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="bottom-box">
            <div style="width:100%;">
              <div class="box-title">
                <span class="pointer"
                      @click="talkbackbtn('detector')">
                  对讲主机列表
                  <i :class="talkback.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
              <div v-if="talkback.detector">
                <el-table 
                  border
                  size="mini"
                  stripe
                  :data="tableDatas"
                  @selection-change="handleSelectionChange"
                  @select="select">
                  <!-- <el-table-column type="selection"></el-table-column> -->
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column v-for="item in tableData"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    show-overflow-tooltip
                    :formatter="formatterTable"
                    align="center">
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>
        
        <el-dialog :title="modalTitle" :visible.sync="isAddMac" width="440px" :close-on-click-modal="false">
          <el-form v-model="inputDatat" size="mini" label-position="right" label-width="140px">
            <el-form-item label="台麦名称" required>
              <el-input v-model="inputDatat.name"></el-input>
            </el-form-item>
            <el-form-item label="台麦唯一ID" required>
              <el-input v-model="inputDatat.uniqueId"></el-input>
            </el-form-item>
            <el-form-item label="台麦ip" required>
              <el-input v-model="inputDatat.ip"></el-input>
            </el-form-item>
              <el-form-item label="台麦端口" required>
              <el-input v-model="inputDatat.port"></el-input>
            </el-form-item>
            <el-form-item label="在线状态" required>
              <!-- <el-input disabled v-model="inputDatat.status"></el-input> -->
              <el-select disabled  v-model="inputDatat.status">
                <el-option v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌">
              <el-input v-model="inputDatat.brand"></el-input>
            </el-form-item>
            <el-form-item label="型号">
              <el-input v-model="inputDatat.modelNum"></el-input>
            </el-form-item>
            <el-form-item label="资产编码" required>
              <el-input v-model="inputDatat.assetCode"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align:center;">
            <el-button size="mini" type="primary" @click="saveMac">保存</el-button>
            <el-button size="mini" @click="cancal">取消</el-button>
          </div>
        </el-dialog>
          <!--修改台麦-->
        <el-dialog :title="modalTitle" :visible.sync="isEditMac" width="440px" :close-on-click-modal="false">
            <el-form v-model="inputDatam" size="mini" label-position="right" label-width="140px">
              <el-form-item label="台麦名称" required>
                <el-input v-model="inputDatam.name"></el-input>
              </el-form-item>
              <el-form-item label="台麦唯一ID" required>
                <el-input v-model="inputDatam.uniqueId"></el-input>
              </el-form-item>
              <el-form-item label="台麦ip" required>
                <el-input v-model="inputDatam.ip"></el-input>
              </el-form-item>
                <el-form-item label="台麦端口" required>
                <el-input v-model="inputDatam.port"></el-input>
              </el-form-item>
              <el-form-item label="在线状态" required>
                <!-- <el-input disabled v-model="inputDatam.status"></el-input> -->
                <el-select disabled  v-model="inputDatam.status">
                  <el-option v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌">
                <el-input v-model="inputDatam.brand"></el-input>
              </el-form-item>
              <el-form-item label="型号">
                <el-input v-model="inputDatam.modelNum"></el-input>
              </el-form-item>
              <el-form-item label="资产编码" required>
                <el-input v-model="inputDatam.assetCode"></el-input>
              </el-form-item>
            </el-form>
          <div style="text-align:center;">
            <el-button size="mini" type="primary" @click="savexiuMac">保存</el-button>
            <el-button size="mini" @click="cancal">取消</el-button>
          </div>
        </el-dialog>
        <!--新增主机-->
        <el-dialog :title="modalTitle" :visible.sync="isEditAisle" width="440px" :close-on-click-modal="false">
            <el-form v-model="inputData" size="mini" label-position="right" label-width="140px">
              <el-form-item label="对讲主机名称" required>
                <el-input v-model="inputData.name"></el-input>
              </el-form-item>
              <el-form-item label="对讲主机唯一ID" required>
                <el-input v-model="inputData.uniqueId"></el-input>
              </el-form-item>
              <el-form-item label="对讲主机ip" required>
                <el-input v-model="inputData.ip"></el-input>
              </el-form-item>
                <el-form-item label="对讲主机端口" required>
                <el-input v-model="inputData.port"></el-input>
              </el-form-item>
              <el-form-item label="在线状态" required>
                <!-- <el-input disabled v-model="inputData.status"></el-input> -->
                <el-select disabled  v-model="inputData.status">
                  <el-option v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌">
                <el-input v-model="inputData.brand"></el-input>
              </el-form-item>
              <el-form-item label="型号">
                <el-input v-model="inputData.modelNum"></el-input>
              </el-form-item>
              <el-form-item label="资产编码" required>
                <el-input v-model="inputData.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="对讲通道数量" required>
                <el-input v-model="inputData.intercomNumber"></el-input>
              </el-form-item>
              <el-form-item label="输出通道数量" required>
                <el-input v-model="inputData.outputNumber"></el-input>
              </el-form-item>
            </el-form>
          <div style="text-align:center;">
            <el-button size="mini" type="primary" @click="save">保存</el-button>
            <el-button size="mini" @click="cancal">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="modalTitle" :visible.sync="isEditXiu" width="440px" :close-on-click-modal="false">
            <el-form v-model="inputDatae" size="mini" label-position="right" label-width="140px">
              <el-form-item label="对讲主机名称" required>
                <el-input v-model="inputDatae.name"></el-input>
              </el-form-item>
              <el-form-item label="对讲主机唯一ID" required>
                <el-input v-model="inputDatae.uniqueId"></el-input>
              </el-form-item>
              <el-form-item label="对讲主机ip" required>
                <el-input v-model="inputDatae.ip"></el-input>
              </el-form-item>
                <el-form-item label="对讲主机端口" required>
                <el-input v-model="inputDatae.port"></el-input>
              </el-form-item>
              <el-form-item label="在线状态" required>
                <!-- <el-input disabled v-model="inputDatae.status"></el-input> -->
                <el-select disabled  v-model="inputDatae.status">
                  <el-option v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌">
                <el-input v-model="inputDatae.brand"></el-input>
              </el-form-item>
              <el-form-item label="型号">
                <el-input v-model="inputDatae.modelNum"></el-input>
              </el-form-item>
              <el-form-item label="资产编码" required>
                <el-input v-model="inputDatae.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="对讲通道数量" required>
                <el-input v-model="inputDatae.intercomNumber"></el-input>
              </el-form-item>
              <el-form-item label="输出通道数量" required>
                <el-input v-model="inputDatae.outputNumber"></el-input>
              </el-form-item>
            </el-form>
          <div style="text-align:center;">
            <el-button size="mini" type="primary" @click="saveEdit">保存</el-button>
            <el-button size="mini" @click="cancal">取消</el-button>
          </div>
        </el-dialog>

      </div>
    </div>
  </div>
</template>
<script>
import {getTalkbackListApi,editHostListApi,deletHoststListApi,createHostApi} from "../../../../../http/audioManage/talkback.api"
import {mapMutations} from "vuex"
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
export default {
  components: {
   orgTree
  },
  // detailData 单项 详情信息
  props:['detailData'],  
  data() {
    return {
      treeType:2,  // tree treeType

      activeCreate: true,
      activePrint: false,
      isEditXiu:false,
      isEditMac:false,
      isAddMac:false,
      formData: {},
      inputDatae: {
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        port:"",
        type: 2
      },
       protocol:[
        { label: '北京分行', value: '北京分行' },
           
      ],
      brandList: [
        // 品牌
        { label: '全部', value: '全部' },
        { label: '海康', value: '海康' },
        { label: '大华', value: '大华' }
      ],
      protocolList:[
         { label: '建行协议', value: '建行协议' },
         { label: '私有协议', value: '私有协议' }
      ],

      statusList:[
        { label:'在线',value:"2",},
        { label:'离线',value:'1',},
        { label:'未知',value:'3',}
      ],
      modelList:[
        
      ],
      modalTitle:"",
      serverList:[
      ],
      dropdownStatus: {
        detector: true
      },
      talkback:{
        detector: true
      },
      tableDatat:[
        { prop: 'name', label: '台麦名称', width: '',sortable: true  },
        { prop: 'uniqueId', label: '台麦唯一ID', width: '',sortable: true  },
        { prop: 'ip', label: '台麦唯一Ip', width: '',sortable: true  },
        { prop: 'brand', label: '品牌', width: '',sortable: true  },
        { prop: 'modelNum', label: '型号', width: '',sortable: true  },
        { prop: 'assetCode', label: '资产编码', width: '',sortable: true  },
        { prop: 'status', label: '在线状态', width: '',sortable: true  },
        // { prop: 'status', label: '运行状态', width: '',sortable: true  },
      ],
      tableData: [
        { prop: 'name', label: '对讲主机名称', width: '',sortable: true  },
        { prop: 'uniqueId', label: '对讲主机唯一ID', width: '',sortable: true  },
        { prop: 'ip', label: '对讲主机唯一Ip', width: '',sortable: true  },
        { prop: 'brand', label: '品牌', width: '',sortable: true  },
        { prop: 'modelNum', label: '型号', width: '',sortable: true  },
        { prop: 'intercomNumber', label: '对讲通道数量', width: '',sortable: true  },
        { prop: 'outputNumber', label: '输出通道数量', width: '',sortable: true  },
        { prop: 'assetCode', label: '资产编码', width: '',sortable: true  },
        { prop: 'status', label: '在线状态', width: '',sortable: true  },
        // { prop: 'status', label: '运行状态', width: '',sortable: true  },
      ],
       inputData: {
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        type: 2
      },
      inputDatat:{
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        port:"",
        type: 2
      },
      inputDatam:{
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        port:"",
        type: 2
      },
      tableDataa:[],  // 台麦列表
      tableDatas:[],  // 对讲主机列表
      channels:[],
       isEditAisle:false,
       arr:[],
    }
  },
  methods: {
    // tree api
    getAudioTreeApi(params) {
      return getAudioTreeApi(params)
    },

    // 机构资源树 模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem : 4,     //子系统【1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙,8.消防】
        key: params.search
      }
      return fuzzySearchTreeApi(params)
    },

    // 点击机构返回重点部位的下拉，记录当前节点的信息
    onceClick(data, node) { 
    },

    // 获取机构下的重点部位
    getKeyPartSelect(oId, kId) { 
    },

    // 通过重点部位id，得到重点部位的名称
    getKeyPartName(id) { 
    },

    formatterTable(row, column, cellValue, index,fromData) {
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
          break
        case 'inputNumber':
        case 'outputNumber':
        case 'analogNumber':
        case 'audioNumber':
        case 'digitalNumber':
          params = cellValue === '' ? 0 : cellValue
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

    // 获取当前平台下的详情
    getchannelList(){
      let obj={
        id:this.detailData.id
      } 
      getTalkbackListApi(obj).then(res=>{
         console.log(res)

         this.formData=res.data.data.platform;
         //对讲主机列表
         this.tableDatas=res.data.data.intercomes;
        
        // 台麦列表
        this.tableDataa=res.data.data.taimaies;
      })
    },
    addt(){
       this.modalTitle = '新增台麦'
       this.isAddMac = true
    },
    add(){
      this.modalTitle = '新增主机'
      this.isEditAisle = true
    },
    cancal(){
        this.isEditAisle = false
        this.isEditMac = false
        this.isEditXiu=false
        this.isAddMac=false
    },
    //新增主机
    save(){
      console.log(this.detailData)
      let {brand,name,ip,assetCode,modelNum,uniqueId,intercomNumber,outputNumber,port} =this.inputData
      let obj={
          orgId:this.detailData.orgId,
          keyPartId:this.detailData.keyPartId,
          keyPartName:this.detailData.keyPartName, 
          keyPartType:"1",
          subSystem:"4",
          platformId:this.detailData.id,
          type:1,
          brand:brand,
          port:port,
          name:name,
          ip:ip,
          assetCode:assetCode,
          modelNum:modelNum,
          uniqueId:uniqueId,
          intercomNumber:intercomNumber,
          outputNumber:outputNumber,
      }
     createHostApi(obj).then(res=>{
            console.log(res)
         if(res.data.code===0){
            this.getchannelList()
          }
        }) 
       this.isEditAisle = false
       this.inputData=""
    },
    handleSelectionChange(val){   
      this.arr = [...val]
      console.log(val, '列表勾选')
    },
    select(s,row){
        this.channels = row
        this.id=row.id
        console.log(this.id)
        console.log(this.channels)
      },
      editmac(){
        if(this.arr.length===0){
         return this.$message("请勾选列表")
       }else{
         this.modalTitle = '修改台麦'
         this.isEditMac = true
         this.inputDatam=this.channels
       }
     },
    edit(){
       if(this.arr.length===0){
         return this.$message("请勾选列表")
       }else{
         this.modalTitle = '修改主机'
         this.isEditXiu = true
         this.inputDatae=this.channels
       }
    },
    //新增台麦
    saveMac(){
      console.log(this.detailData)
      let {brand,name,ip,assetCode,modelNum,uniqueId,port} =this.inputDatat
      let obj={
          orgId:this.detailData.orgId,
          keyPartId:this.detailData.keyPartId,
          keyPartName:this.detailData.keyPartName, 
          keyPartType:"1",
          subSystem:"4",
          platformId:this.detailData.id,
          type:2,
          brand:brand,
          port:port,
          name:name,
          ip:ip,
          assetCode:assetCode,
          modelNum:modelNum,
          uniqueId:uniqueId,
      }
      createHostApi(obj).then(res=>{
          console.log(res)
         if(res.data.code===0){
              this.getchannelList()
            }
        }) 
       this.isAddMac = false
       this.inputDatat=""
    },
    //修改台麦
    savexiuMac(){
       let {brand,accessProtocol,ip,name,assetCode,modelNum,uniqueId,accessService,status,} =this.inputDatam
         let obj={
           id:this.channels.id,
            brand:brand,//品牌
            accessProtocol:accessProtocol,//接入协议
            ip:ip,//对讲IP地址
            uniqueId:uniqueId,
            name:name,
            assetCode:assetCode,
            modelNum:modelNum,
            status:status,
        }
       editHostListApi(obj).then(res=>{
         console.log(res)
       })
       this.isEditMac=false
       this.$message("修改台麦成功")
     },
     //修改主机
    saveEdit(){
          let {brand,accessProtocol,ip,name,assetCode,modelNum,uniqueId,accessService,status,intercomNumber,outputNumber} =this.inputDatae
         let obj={
           id:this.channels.id,
            brand:brand,//品牌
            accessProtocol:accessProtocol,//接入协议
            ip:ip,//对讲IP地址
            uniqueId:uniqueId,
            name:name,
            assetCode:assetCode,
            modelNum:modelNum,
            outputNumber:outputNumber,
            intercomNumber:intercomNumber,
            status:status,
        }
       editHostListApi(obj).then(res=>{
         console.log(res)
       })
       this.isEditXiu=false
     },
     //删除
      del(){
        if(this.arr.length===0){
          return this.$message('请勾选编辑项')
        }else{
          
          let ids=this.arr.map(item=>{
            let {id}=item
            return id
          })

          console.log(ids)
          deletHoststListApi({ids}).then(res=>{
            if(res.data.code===0){
              this.getchannelList();
            }
          console.log(res)
        })
        }
      },
    //点击关闭回到列表
    close(){
        // this.$emit('createbtn')
        this.$emit('modelChange','List')
    },

    // 打印
    print() {
      printJS({ printable: 'printJS_container', type: 'html' })
    },
    reset(){},
    skipToList(){},
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    talkbackbtn(key){
      this.talkback[key] = !this.talkback[key]
    },
    // 新增/编辑主机(弹窗)的保存按钮
    dialogSave(val) {
      console.log(val)
      if (val == '新增停车主机') {
        this.parkHostList.push(this.detectorData)
      } else {
        this.editData = this.detectorData
      }
      this.isEditDetector = false
      this.detectorData = {}
    },
    
  },
  created(){
    this.getchannelList()
    if(this.formData.status===2){
      this.formData.status="在线"
    }else if(this.formData.status===1){
      this.formData.status="离线"
    }else{
      this.formData.status="未知"
    }
  },
  mounted(){
    console.log(this.detailData)

    // this.formData =  this.detailData
  }
}
</script>

<style lang="less" scoped>
  .main {
    min-height: 100%;
    display: flex;
    .left-tree {
      width: 290px;
    }
    .content-btn {
      margin: 10px 0;
    }
    .form-box {
      flex:1;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      padding: 6px 20px 15px;
      .button-box{
        padding:20px 0 10px;
        /deep/.el-button--mini{
          width:80px;
        }
      }
      .print-container{
        .form-top {
          width: 955px;
          line-height: 35px;
          text-align: center;
          font-size: 12px;
        }

        .form-content{
          width: 955px;
          color: #666;
          border: 1px solid #E1E1E1;
          overflow: hidden;
          .form-group {
            display: flex;
            width: 50%;
            float: left;
            height: 35px;
            line-height: 35px;
            border-bottom: 1px solid #E1E1E1;
            .label {
              width: 145px;
              background: #F5F5F5;
              padding-left: 34px;
            }
            .form-item {
              flex: 1;
              border-left: none;
              padding-left:16px;
            }
          }
        }

        .bottom-box{
          margin-top:35px;
          .box-title {
            // position: relative;
            height: 15px;
            line-height: 15px;
            color: #606266;
            margin: 20px 0;
            padding-left:10px;
            border-left:2px solid #2D71D3;
          }
        }

        .detail-bottom {
          width: 955px;
          height: 35px;
          color: #212121;
          line-height: 33px;
          border: 1px solid #E1E1E1;
          display: flex;
          flex-wrap: wrap;
          margin: 20px 0;
          .detail-item {
            display: flex;
            width: 33.3%;
            .item-left {
              width: 111px;
              background: #f5f5f5;
              text-align: center;
            }
            .item-right {
              flex: 1;
              border-left: none;
              text-align: center;
            }
          }
        }
      }
    }
  }
  @media print{
    .print-container{
      .form-top {
        width: 955px;
        line-height: 35px;
        text-align: center;
        font-size: 12px;
      }

      .form-content{
        width: 955px;
        color: #666;
        border: 1px solid #E1E1E1;
        overflow: hidden;
        .form-group {
          display: flex;
          width: 50%;
          float: left;
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid #E1E1E1;
          .label {
            width: 145px;
            background: #F5F5F5;
            text-align: center;
          }
          .form-item {
            flex: 1;
            border-left: none;
            padding-left:16px;
          }
        }
      }

      .bottom-box{
        margin-top:35px;
        .box-title {
          // position: relative;
          height: 15px;
          line-height: 15px;
          color: #606266;
          margin: 20px 0;
          padding-left:10px;
          border-left:2px solid #2D71D3;
          // i {
          //   position: absolute;
          //   top: 50%;
          //   left: 100px;
          //   transform: translateY(-50%);
          // }
          // &::after {
          //   display: block;
          //   content: '';
          //   border-top: 1px solid #e1e1e1;
          //   width: calc(~'100% - 120px');
          //   margin-left: 120px;
          //   margin-top: -12px;
          // }
        }
      }

      .detail-bottom {
        width: 955px;
        height: 35px;
        color: #212121;
        line-height: 33px;
        border: 1px solid #E1E1E1;
        display: flex;
        flex-wrap: wrap;
        margin: 30px 0;
        .detail-item {
          display: flex;
          width: 33.3%;
          .item-left {
            width: 111px;
            background: #f5f5f5;
            text-align: center;
          }
          .item-right {
            flex: 1;
            border-left: none;
            text-align: center;
          }
        }
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
