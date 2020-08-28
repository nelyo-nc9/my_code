<template>
  <div class="main">
    <div class="left-tree">
      <orgTree style="width:290px" :lazyTreeApi="getAudioTreeApi" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi"  :treeType="treeType"  treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
    </div>
    <div class="form-box" v-if="activeCreate">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲管理平台</el-breadcrumb-item>
            <el-breadcrumb-item v-if="create_look">新建</el-breadcrumb-item>
            <el-breadcrumb-item v-else>列表</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-top">对讲平台信息</div>
      <div class="form-content">
        <el-form ref="addForm"
            size="mini"
            :model="platform_info"
            label-position="right"
            :rules="platform_info_rules"
            label-width="140px">
          <el-form-item label="所属机构" class="form-group">
            <el-input disabled v-model="platform_info.orgName"></el-input>
          </el-form-item>
          <el-form-item label="所属重点部位" prop="keyPartId" class="form-group">
            <el-select v-model="platform_info.keyPartId" @change="keyPartChange">
                <el-option
                  v-for="(item,index) in keyParts"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="对讲平台名称*" prop="name" class="form-group">
            <el-input v-model="platform_info.name"></el-input>
          </el-form-item>
          
          <el-form-item label="品牌*" prop="brand" class="form-group">
            <el-select v-model="platform_info.brand" @change="getModelNumList(platform_info.brand)">
              <el-option v-for="(item,index) in brandList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号*" prop="modelNum" class="form-group">
            <el-select v-model="platform_info.modelNum" @change="changeModelNums">
              <el-option v-for="(item,index) in modelList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接入协议*" prop="accessProtocol" class="form-group">
            <el-select v-model="platform_info.accessProtocol">
              <el-option v-for="(item,index) in protocolList"
                          :key="index"
                          :label="item.label"
                          :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对讲平台唯一ID" prop="uniqueId" class="form-group">
            <el-input type="number" v-model="platform_info.uniqueId"></el-input>
          </el-form-item>

          <el-form-item label="对讲平台IP地址*" prop="ip" class="form-group">
            <el-input placeholder=""
                      v-model="platform_info.ip"></el-input>
          </el-form-item>
          <el-form-item label="终端接收端口" prop="port" class="form-group">
            <el-input type="number" v-model="platform_info.port"></el-input>
          </el-form-item>
          <el-form-item label="服务器接收端口" class="form-group" prop="cport">
            <el-input type="number" placeholder=""
                      v-model="platform_info.cport"></el-input>
          </el-form-item>
          <el-form-item label="级联音频端口" class="form-group" prop="dport">
            <el-input type="number" v-model="platform_info.dport"></el-input>
          </el-form-item>

          <el-form-item label="对讲平台用户名" prop="username" class="form-group">
            <el-input placeholder=""
                      v-model="platform_info.username"></el-input>
          </el-form-item>
          <el-form-item label="对讲平台密码" prop="password" class="form-group">
            <el-input type="password" v-model="platform_info.password" autocomplete="new-password"></el-input></el-form-item>

          <el-form-item label="资产编码" class="form-group">
            <el-input placeholder=""
                      v-model="platform_info.assetCode"></el-input>
          </el-form-item>
          <el-form-item label="接入服务器*" prop="accessService" class="form-group">
            <el-select v-model="platform_info.accessService" value-key="service">
              <el-option v-for="(item,index) in DA_serverList"
                          :key="index"
                          :label="item.service"
                          :value="item.service"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="在线状态" class="form-group">
            <el-select disabled  v-model="platform_info.status">
              <el-option v-for="item in stlist"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="运行状态" class="form-group">
            <el-input disabled v-model="platform_info.status"></el-input>
          </el-form-item> -->
        </el-form>
      </div>

      <div class="bottom-btn">
        <el-button type="primary"
                    size="mini"
                    @click="savePlatform">保存</el-button>
        <el-button size="mini"
                    @click="skipToList">取消</el-button>
        <el-button size="mini"
                    @click="reset">重置</el-button>
      </div>

      <!--台麦列表-->
      <div class="bottom-box">
          <div style="width:100%;">
            <div class="box-title">
              <span class="pointer" @click="toggleOpen('detector')">
                台麦列表
                <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
              <div class="list-header">
                <i class="el-icon-download" title="获取通道信息" @click="getSourceEquipment"></i>
                <i class="el-icon-circle-plus-outline" title="新增" @click="addt"></i>
                <i class="el-icon-edit" title="编辑" @click="editmac"></i>
                <i class="el-icon-delete" title="删除" @click="delMike"></i>
                <i class="el-icon-refresh-right" title="刷新" @click="goodt"></i>
              </div>
            </div>
            <div v-if="dropdownStatus.detector" style="width:100%;">
              <el-table 
                border
                style="width: 100%"
                size="mini"
                :data="p_mike_list"
                  @selection-change="handleSelectionChange1"
                @select="select1"
                stripe>
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column v-for="item in p_mikeTableCulmn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  :sortable="p_mikeTableCulmn.sortable"
                  show-overflow-tooltip
                  :formatter="formatterTable"
                  align="center">
                </el-table-column>
              </el-table>
            </div>
          </div>
      </div>

        <!--添加台麦-->
        <el-dialog :title="modalTitle" :visible.sync="isAddMac" width="440px" :close-on-click-modal="false">
            <el-form :model="p_mike_info" size="mini" label-position="right" label-width="140px" :rules="mikeRules" ref="add_p_mike">
              <el-form-item label="台麦名称"  prop="name">
                <el-input v-model="p_mike_info.name"></el-input>
              </el-form-item>
              <el-form-item label="台麦唯一ID"  prop="uniqueId">
                <el-input v-model="p_mike_info.uniqueId"></el-input>
              </el-form-item>
              <el-form-item label="台麦ip"  prop="ip">
                <el-input v-model="p_mike_info.ip"></el-input>
              </el-form-item>
               <el-form-item label="台麦端口" prop="port">
                <el-input v-model="p_mike_info.port"></el-input>
              </el-form-item>
              <el-form-item label="在线状态">
                <el-select disabled v-model="p_mike_info.status" class="brand">
                    <el-option v-for="item in stlist"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="p_mike_info.brand" class="brand" @change="updatetaiList('p_mike_info')">
                    <el-option v-for="(item,index) in brandtaiList"
                               :key="index"
                               :label="item.data"
                               :value="item.data"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelNum">
                <el-select v-model="p_mike_info.modelNum" class="brand">
                    <el-option v-for="(item,index) in modeltaiList"
                               :key="index"
                               :label="item.data"
                               :value="item.data"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="资产编码">
                <el-input v-model="p_mike_info.assetCode"></el-input>
              </el-form-item>
            </el-form>
          <div style="text-align:center;">
            <el-button size="mini" type="primary" @click="saveMac">保存</el-button>
            <el-button size="mini" @click="cancal">取消</el-button>
          </div>
        </el-dialog>

        <!--修改台麦-->
        <el-dialog :title="modalTitle" :visible.sync="isEditMac" width="440px" :close-on-click-modal="false">
            <el-form :model="p_mike_edit_info" size="mini" label-position="right" label-width="140px" :rules="mikeRules" ref="edit_p_mike">
              <el-form-item label="台麦名称"   prop="name">
                <el-input v-model="p_mike_edit_info.name"></el-input>
              </el-form-item>
              <el-form-item label="台麦唯一ID"   prop="uniqueId">
                <el-input v-model="p_mike_edit_info.uniqueId"></el-input>
              </el-form-item>
              <el-form-item label="台麦ip"   prop="ip">
                <el-input v-model="p_mike_edit_info.ip"></el-input>
              </el-form-item>
               <el-form-item label="台麦端口" prop="port">
                <el-input v-model="p_mike_edit_info.port"></el-input>
              </el-form-item>
              <el-form-item label="在线状态">
                <el-select disabled v-model="p_mike_edit_info.status" class="brand">
                    <el-option v-for="item in stlist"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                 <el-select v-model="p_mike_edit_info.brand" class="brand" @change="updatetaiList('p_mike_edit_info')">
                    <el-option v-for="(item,index) in brandtaiList"
                               :key="index"
                               :label="item.data"
                               :value="item.data"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelNum">
                <el-select v-model="p_mike_edit_info.modelNum" class="brand">
                    <el-option v-for="(item,index) in modeltaiList"
                               :key="index"
                               :label="item.data"
                               :value="item.data"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="资产编码">
                <el-input v-model="p_mike_edit_info.assetCode"></el-input>
              </el-form-item>
            </el-form>
          <div style="text-align:center;">
            <el-button size="mini" type="primary" @click="savexiuMac">保存</el-button>
            <el-button size="mini" @click="cancal">取消</el-button>
          </div>
        </el-dialog>

        <!--主机列表-->
        <div class="bottom-box bottom-box1">
            <div style="width:100%;">
              <div class="box-title">
                <span class="pointer" @click="talkbackbtn('detector')">
                  对讲主机列表
                  <i :class="talkback.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
                <div class="list-header">
                  <i class="el-icon-download" title="获取通道信息" @click="getSourceEquipment"></i>
                  <i class="el-icon-circle-plus-outline" title="新增" @click="add" ></i>
                  <i class="el-icon-edit" title="编辑" @click="edit"></i>
                  <i class="el-icon-delete" title="删除" @click="delHost"></i>
                  <i class="el-icon-refresh-right" title="刷新" @click="good"></i>
                </div>
              </div>
              <div v-if="talkback.detector" style="width:100%;">
                <el-table 
                  border
                  style="width: 100%"
                  size="mini"
                  :data="p_host_list"
                  @selection-change="handleSelectionChange2"
                  @select="select2"
                  stripe>
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column v-for="item in p_hostTableCulmn"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    :sortable="p_hostTableCulmn.sortable"
                    show-overflow-tooltip
                    align="center"
                    :formatter="formatterTable">
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>

        <!--添加主机 弹框-->
        <el-dialog :title="modalTitle" :visible.sync="isEditAisle" width="440px" :close-on-click-modal="false">
          <el-form :model="p_host_info" size="mini" label-position="right" label-width="140px" :rules="hostRules" ref="add_p_host">
            <el-form-item label="对讲主机名称"  prop="name">
              <el-input v-model="p_host_info.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="对讲主机唯一ID"  prop="uniqueId">
              <el-input v-model="p_host_info.uniqueId" clearable></el-input>
            </el-form-item>
            <el-form-item label="对讲主机ip" prop="ip">
              <el-input v-model="p_host_info.ip" clearable></el-input>
            </el-form-item>
              <el-form-item label="对讲主机端口" prop="port">
              <el-input v-model="p_host_info.port" clearable></el-input>
            </el-form-item>
            <el-form-item label="在线状态">
              <el-select disabled v-model="p_host_info.status" class="brand">
                <el-option v-for="item in stlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="p_host_info.brand" class="brand" width="500px" @change="updatehostList('p_host_info')">
                  <el-option v-for="(item,index) in brandhostList"
                    :key="index"
                    :label="item.data"
                    :value="item.data"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="型号" prop="modelNum">
              <el-select v-model="p_host_info.modelNum" class="brand">
                  <el-option v-for="(item,index) in modelhostList"
                    :key="index"
                    :label="item.data"
                    :value="item.data"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资产编码">
              <el-input v-model="p_host_info.assetCode" clearable></el-input>
            </el-form-item>
            <el-form-item label="对讲通道数量" prop="intercomNumber">
              <el-input v-model="p_host_info.intercomNumber"></el-input>
            </el-form-item>
            <el-form-item label="输出通道数量" prop="outputNumber">
              <el-input v-model="p_host_info.outputNumber"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align:center;">
            <el-button size="mini" type="primary" @click="save">保存</el-button>
            <el-button size="mini" @click="cancal">取消</el-button>
          </div>    
        </el-dialog>

        <!--修改主机 弹框-->
        <el-dialog :title="modalTitle" :visible.sync="isEditXiu" width="440px" :close-on-click-modal="false">
          <el-form :model="p_host_edit_info" size="mini" label-position="right" label-width="140px" :rules="hostRules" ref="edit_p_host">
            <el-form-item label="对讲主机名称" prop="name">
              <el-input v-model="p_host_edit_info.name"></el-input>
            </el-form-item>
            <el-form-item label="对讲主机唯一ID" prop="uniqueId">
              <el-input v-model="p_host_edit_info.uniqueId"></el-input>
            </el-form-item>
            <el-form-item label="对讲主机ip" prop="ip">
              <el-input v-model="p_host_edit_info.ip"></el-input>
            </el-form-item>
              <el-form-item label="对讲主机端口" prop="port">
              <el-input v-model="p_host_edit_info.port"></el-input>
            </el-form-item>
            <el-form-item label="在线状态">
              <el-select disabled v-model="p_host_edit_info.status" class="brand">
                  <el-option v-for="item in stlist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="p_host_edit_info.brand" class="brand" width="500px" @click.native="updatehostList('p_host_edit_info')">
                <el-option v-for="(item,index) in brandhostList"
                  :key="index"
                  :label="item.data"
                  :value="item.data"
                  ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="型号" prop="modelNum">
              <el-select v-model="p_host_edit_info.modelNum" class="brand">
                  <el-option v-for="(item,index) in modelhostList"
                              :key="index"
                              :label="item.data"
                              :value="item.data"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资产编码">
              <el-input v-model="p_host_edit_info.assetCode"></el-input>
            </el-form-item>
            <el-form-item label="对讲通道数量" prop="intercomNumber">
              <el-input v-model="p_host_edit_info.intercomNumber"></el-input>
            </el-form-item>
            <el-form-item label="输出通道数量" prop="outputNumber">
              <el-input v-model="p_host_edit_info.outputNumber"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align:center;">
            <el-button size="mini" type="primary" @click="saveEdit">保存</el-button>
            <el-button size="mini" @click="cancal">取消</el-button>
          </div>
        </el-dialog>
     </div>
  </div>
</template>
<script>
import audioRules from '@src/assets/rules/validation/security/audio'
import {mapMutations} from "vuex"
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import {createHostApi,getHostListApi,getTalkbackListApi,talkbackListApi,
       editTalkbackListApi,deletHoststListApi,editHostListApi,getAudioHostlistApi,
       getAudioSyncHostlistApi,getBrandModuleApi,getServerListallApi,getServerListApi } from "../../../../../http/audioManage/talkback.api"
export default {
  components: {
   orgTree
  },
  props:["detailData",'pagetype'],
  data() {
    return {
      create_look:false,  // 当新建-查看页面跳转过来的时候为true
      resetFormData: {}, // 重置所需数据
      treeType:2,  // tree treeType
      activeCreate: true,
      activePrint: false,
      isEditAisle:false,
      isEditMac:false,
      isEditXiu:false,
      isAddMac:false,

      // 平台详情
      platform_info: {
        // 表单数据
        orgName: '',
        // subSystemName:"",//所属子系统
        brand:"",//品牌
        accessProtocol:'',//接入协议
        ip:"",//对讲IP地址
        port:'',//服务器接收端口
        userName:'',//对讲用户名
        assetCode:'',//资产编码
        status:"",//在线状态
        keyPartName:'',//所属重点单位
        name:"",//
        modelNum:'',//型号
        sdk:'',  // 型号所对应的 sdk
        uniqueId:"",//对讲平台唯一ID
        dport:"",//终端接收端口
        cport:'',//级联音频端口
        password:"",//对讲平台密码
        server:'',//接入服务器
        // status:'',//运行状态
        port:""
      },

      // 平台信息 验证规则
      platform_info_rules : audioRules.intercomPlatformRules,

      brandList: [],  // 对讲平台 品牌列表
      modelList: [],  // 对讲平台 型号列表
      protocolList:[
         { label: '建行协议', value: '建行协议' },
         { label: '私有协议', value: '私有协议' }
      ],  // 对讲平台 协议 列表
      serverList:[],  // 对讲平台 接入服务 列表
      
      keyParts:[],  // 所属重点部位 数据集合
      // 在线离线状态 
      stlist:[
        { label:'在线',value:2,},
        { label:'离线',value:1,},
        { label:'未知',value:3,}
      ],

      // 平台下 台麦列表表格字段
      p_mikeTableCulmn:[
        { prop: 'name', label: '台麦名称', width: '',sortable: true  },
        { prop: 'uniqueId', label: '台麦唯一ID', width: '' ,sortable: true },
        { prop: 'ip', label: '台麦唯一Ip', width: '',sortable: true  },
        { prop: 'brand', label: '品牌', width: '',sortable: true  },
        { prop: 'modelNum', label: '型号', width: '' ,sortable: true },
        { prop: 'assetCode', label: '资产编码', width: '',sortable: true  },
        { prop: 'status', label: '在线状态', width: '',sortable: true  },
        // { prop: 'status', label: '运行状态', width: '',sortable: true  },
      ],

      // 平台下 主机列表表格字段
      p_hostTableCulmn: [
        { prop: 'name', label: '对讲主机名称', width: '',sortable: true  },
        { prop: 'uniqueId', label: '对讲主机唯一ID', width: '140',sortable: true  },
        { prop: 'ip', label: '对讲主机唯一Ip', width: '140',sortable: true  },
        { prop: 'brand', label: '品牌', width: '',sortable: true  },
        { prop: 'modelNum', label: '型号', width: '',sortable: true  },
        { prop: 'intercomNumber', label: '对讲通道数量', width: '120',sortable: true  },
        { prop: 'outputNumber', label: '输出通道数量', width: '120',sortable: true  },
        { prop: 'assetCode', label: '资产编码', width: '',sortable: true  },
        { prop: 'status', label: '在线状态', width: '',sortable: true  },
        // { prop: 'status', label: '运行状态', width: '',sortable: true  },
      ],

      // 显示 隐藏 台麦列表
      dropdownStatus: {
        detector: true
      },
      // 显示 隐藏 主机列表
      talkback:{
        detector: true
      },

      p_host_list:[],  // 平台下 的主机列表
      p_mike_list:[],  // 平台下 的台麦列表

      selectData1:[],  // 平台下 台麦 列表选中项
      checkedData1:[],  // 平台下 台麦 列表选中行（单选）

      selectData2:[],  // 平台下 主机 列表选中项
      checkedData2:[],  // 平台下 主机 列表选中行（单选）

      brandhostList:[],   //平台下主机 品牌数据列表
      modelhostList:[],  //平台下主机 型号数据列表
      brandtaiList:[],    //平台下台麦 品牌数据列表
      modeltaiList:[],    //平台下台麦 型号数据列表

      // 平台下 台麦详情(添加表单)
      p_mike_info:{
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        port:"",
        type: 2
      },

      // 平台下 台麦详情(编辑表单)
      p_mike_edit_info:{
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        port:"",
        type: 2
      },

      // 平台下 台麦详情 表单验证规则
      mikeRules : audioRules.mikeRules,

      // 平台下 主机详情(添加表单)
      p_host_info: {
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        intercomNumber:"",
        outputNumber:"",
        port:'',
        type: 1
      },

      // 平台下 主机详情(编辑表单)
      p_host_edit_info: {
        name: '',
        uniqueId: '',
        status: '',
        brand: '',
        modelNum: '',
        assetCode: '',
        port:"",
        type: 2
      },
      // 平台下 主机详情 表单验证规则
      hostRules : audioRules.hostRules,
      
      modalTitle:"",  // 弹框标题
    }
  },
  computed:{
    DA_serverList(){
      var list = JSON.parse(JSON.stringify(this.serverList));
      var list2 = [];
      list.forEach( (item) => {
        if(item.talkBackId && item.talkBackId != ''){
          list2.push(item);
        }
      })
      return list2;
    },
  },
  methods: {

    // 机构树 api
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
      if (data.tierType === 'org') {
        this.platform_info.orgId = data.id;
        this.platform_info.orgName = data.name;
        this.platform_info.keyPartId = '';

        this.getKeyPartSelect(data.serial) // 请求机构的关系，现在需要换成serial字段，todo，不清楚修改后对配置的影响
      } else {
        let parentNode = node.parent
        if (!parentNode) { return }
        this.platform_info.orgId = (parentNode.data && node.parent.data.id) || '';
        this.platform_info.orgName = (parentNode.data && node.parent.data.name) || '';
        this.getKeyPartSelect(parentNode.data.serial, data.id)
      }
    },

    // 获取机构下的重点部位
    getKeyPartSelect(oId, kId) { 
      this.keyParts = []
      let params = {
        type: 2,
        oId: oId,
        subSystem: "4",
        isRecursion:"0"
      }
      this.getAudioTreeApi(params).then((res) => {
        if (res.data.code === 0) {
          if (kId) {
            this.platform_info.keyPartId = kId
          }
          let data = res.data.data.nodes
          if(data){
            data.forEach((item) => {
              if (item.tierType === 'loc') {
                this.keyParts.push({
                  label: item.name,
                  value: item.id,
                  type: item.keyPartType
                })
              }
            })

            // 判断当前重点部位是否有已选的部位（可能已被删除）
            var is_exist = this.keyParts.some(item=>{
              return item.value == kId;
            })
            if(!is_exist){
              this.keyParts.push({
                label: this.detailData.keyPartName,
                value: this.detailData.keyPartId,
              })
            }
          }else{
            this.keyParts.push({
              label: this.detailData.keyPartName,
              value: this.detailData.keyPartId,
            })
          }

        }
      })

    },

    // 通过重点部位id，得到重点部位的名称
    getKeyPartName(id) { 
    },

    // 获取 平台详情和 平台下的设备
    getchannelList(){
      let obj={
        id:this.detailData.id
      } 
      getAudioHostlistApi(obj).then(res=>{
         console.log(res)
         this.p_mike_list=res.data.data.taimaies;  // 台麦列表
         this.p_host_list=res.data.data.intercomes;  // 平台下 主机列表
         this.platform_info=res.data.data.platform;  // 平台详情

         this.resetFormData = this.$lodash.cloneDeep(res.data.data.platform) // 重置需要数据
        //  this.$messageSuccess('获取台麦下通道',"成功")
        this.$notify({
          title: '提示',
          message: '查询成功',
          position: 'top-right',
          type: 'success'
        });
      })
    },

    // 获取 平台下 已经配置的 设备（需要世邦提供底层接口，暂不支持）
    getSourceEquipment(){
      this.$message.error('获取失败');
    },

    // 表格数据处理
    formatterTable(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'status':
          if(cellValue === 2){
            params= '在线';
          }else if(cellValue === 1){
            params= '离线';
          }else{
            params= '未知';
          }
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

    // 获取重点部位并赋值
    keyPartChange(data) {
      let selectData = this.keyParts.filter(i => i.value === data)[0]
       this.$forceUpdate()
      this.platform_info.keyPartType = selectData.type
    },

    // 获取服务器列表
    getserver(){
      let _this = this
      getServerListallApi().then(res => {
        let tabData = res.data.map(item => {
          return { service: item, id: '', talkBackId: '' }
        })
        getServerListApi().then(res => {
          let seveData = res.data.data
          seveData.reverse()
          for (let v of tabData) {
            let index = seveData.findIndex(value => value.service == v.service)
            if (index > -1) {
              if(seveData[index].talkBackId && seveData[index].talkBackId != ''){
                v.service = seveData[index].service
                v.id = seveData[index].id
                v.talkBackId = seveData[index].talkBackId
              }
            }
          }
          _this.serverList = tabData;
        })
      })
    },

    // 获取品牌列表
    getBrand(){
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '1' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.brandList=res.data.data[0].attr
       })
    },

    // 根据品牌 获取相应的型号
    getModelNumList(brandName) {
      this.platform_info.modelNum = ''
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '2', homeClass: brandName }]
      getBrandModuleApi({queryList}).then(res=>{
        this.modelList=res.data.data[0].attr;
      })
    },

    // 根据型号获取相应的 sdk
    changeModelNums(index) {
      this.modelList.forEach(item => {
        if (index == item.data) {
          this.platform_info.sdk = item.sdkName || ''
        }
      })
    },

    // 获取主机品牌
    gethostBrand(){
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '3' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.brandhostList=res.data.data[0].attr
       })
    },

    // 获取主机品牌型号
    updatehostList(name, bool) {
      if (!bool) {
        this[name].modelNum = ''
      }
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '4', homeClass:  this[name].brand }]
       getBrandModuleApi({queryList}).then(res=>{
          this.modelhostList=res.data.data[0].attr
       })
    },

    // 获取台麦品牌
    gettaiBrand(){
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '5' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.brandtaiList=res.data.data[0].attr
       })
    },

    // 获取主机台麦型号
    updatetaiList(name, bool) {
      if (!bool) {
        this[name].modelNum = ''
      }
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '6', homeClass: this[name].brand }]
      getBrandModuleApi({queryList}).then(res=>{
        this.modeltaiList=res.data.data[0].attr
      })
    },

    //平台 信息 保存
    savePlatform(){
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let {brand,username,orgId,keyPartId,orgName,name,keyPartName,accessProtocol,ip,cport,assetCode,modelNum,sdk,uniqueId,port,dport,password,accessService} =this.platform_info;
          // console.log(accessService);return false;
          // 对讲平台修改非必填项（服务器接收端口）超过65535验证
          if(cport>65535){
            this.$message.error('服务器接收端口不能大于65535');
            return false;
          }
          // 对讲平台修改非必填项（终端接收端口）超过65535验证
          if(port>65535){
            this.$message.error('终端接收端口不能大于65535');
            return false;
          }

          // 对讲平台修改非必填项（级联音频端口）超过65535验证
          if(dport>65535){
            this.$message.error('级联音频端口不能大于65535');
            return false;
          }

          // 验证ip地址是否正确
          if(!this.isValidIP(ip)){
            this.$message.error('ip地址不合法，请重新填写');
            return false;
          }

          let obj={
            id:this.detailData.id,
            orgId:orgId,
            orgName:orgName,
            keyPartId:keyPartId,
            keyPartIdType:"1",
            brand:brand,//品牌
            accessProtocol:accessProtocol,//接入协议
            ip:ip,//对讲IP地址
            cport:cport,//服务器接收端口
            username:username,//对讲用户名
            keyPartName:this.detailData.keyPartName,
            assetCode:assetCode,//资产编码
            status:status,//在线状态
            // keyUnit:'监控中心',//所属重点单位
            name:name,//
            modelNum:modelNum,//型号
            sdk:sdk,  // 型号所对应的 sdk
            uniqueId:uniqueId,//对讲平台唯一ID
            accessServiceId:this.accessServiceId,
            port:port,//终端接收端口
            dport:dport,//级联音频端口
            password:password,//对讲平台密码
            accessService:accessService,
          }
          editTalkbackListApi(obj).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              // 判断 如果是 新建-查看 跳转过来的 需要 跳转回去
              if(this.create_look){
                this.$emit('modelChange','examinelook',this.detailData)
              }else{
                this.$emit('modelChange','List')
              }
              
            }else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          })
        
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 验证ip地址
    isValidIP(ip) {
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      return reg.test(ip);
    }, 

    // 重置
    reset(){
      this.platform_info = this.$lodash.cloneDeep(this.resetFormData)
      this.value = []
    },

    // 页面跳转交互逻辑处理
    skipToList(){
       // 判断 如果是 新建-查看 跳转过来的 需要 跳转回去
      if(this.create_look){
        this.$emit('modelChange','examinelook',this.detailData)
      }else{
        this.$emit('modelChange','List')
      }
    },

    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    talkbackbtn(key){
      this.talkback[key] = !this.talkback[key]
    },
    

    // 台麦 列表 选中
    handleSelectionChange1(val){   
      this.selectData1 = [...val]
    },
    select1(s,row){
      this.checkedData1 = row
      // this.id=row.id
    },

    // 触发 添加台麦
    addt(){
      for (let key in this.p_mike_info){
        this.p_mike_info[key] = ''
      }
      this.modalTitle = '新增台麦'
      this.isAddMac = true
    },

    //添加台麦  提交
    saveMac(){
      this.$refs.add_p_mike.validate((valid) => {
        if (valid) {
          let {brand,name,ip,assetCode,modelNum,uniqueId,port} =this.p_mike_info;

          // 验证ip地址是否正确
          if(!this.isValidIP(ip)){
            this.$message.error('ip地址不合法，请重新填写');
            return false;
          }
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
            if(res.data.code===0){
              this.$message({
                message: '添加台麦成功',
                type: 'success'
              });
              this.getchannelList();
              this.isAddMac = false;
            }else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          }) 
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //触发 修改台麦
    editmac(){
      if(this.selectData1.length===0){
        this.$message("请勾选列表")
      }else if(this.selectData1.length>1){
        this.$message('只能勾选一项')
      }else{
        this.modalTitle = '修改台麦'
        this.isEditMac = true
        let obj = Object.assign({}, this.p_mike_edit_info, this.checkedData1)
        this.p_mike_edit_info=this.$lodash.cloneDeep(obj);
        this.updatetaiList('p_mike_edit_info', true);
      }
    },

    //修改台麦  提交
    savexiuMac(){
      this.$refs.edit_p_mike.validate((valid) => {
        if (valid) {
          let {brand,accessProtocol,ip,name,assetCode,modelNum,uniqueId,accessService,status,port} =this.p_mike_edit_info;

          // 验证ip地址是否正确
          if(!this.isValidIP(ip)){
            this.$message.error('ip地址不合法，请重新填写');
            return false;
          }
          let obj={
            id:this.checkedData1.id,
            brand:brand,//品牌
            accessProtocol:accessProtocol,//接入协议
            ip:ip,//对讲IP地址
            uniqueId:uniqueId,
            name:name,
            assetCode:assetCode,
            modelNum:modelNum,
            status:status,
            port:port,
          }
          editHostListApi(obj).then(res=>{
            if(res.data.code===0){
              this.$message({
                message: '修改台麦成功',
                type: 'success'
              });
              this.getchannelList();
              this.isEditMac = false;
            }else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          })
        
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },

    //删除 台麦
    delMike(){
      if(this.selectData1.length===0){
        return this.$message('请勾选编辑项')
      }
      this.$confirm('确认删除选择项么', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids=this.selectData1.map(item=>{
          let {id}=item
          return id
        })
        deletHoststListApi({ids}).then(res=>{
          if(res.data.code===0){
            this.getchannelList();
          }
        })
      })
    },

    // 取消 添加（编辑）台麦
    cancal(){
        this.isEditAisle = false
        this.isEditMac = false
        this.isEditXiu = false
        this.isAddMac = false
        for (let key in this.p_host_info){
          this.p_host_info[key] = ''
        }
        for (let key in this.p_mike_info){
          this.p_mike_info[key] = ''
        }
    },
    
    // 主机 列表 选中
    handleSelectionChange2(val){   
      this.selectData2 = [...val]
    },
    select2(s,row){
      this.checkedData2 = row
      // this.id=row.id
    },

    //触发 添加主机
    add(){
      for (let key in this.p_host_info){
        this.p_host_info[key] = ''
      }
      this.modalTitle = '新增主机'
      this.isEditAisle = true
    },

     //添加主机  提交
    save(){
      this.$refs.add_p_host.validate((valid) => {
        if (valid) {
          let {brand,name,ip,assetCode,modelNum,uniqueId,intercomNumber,outputNumber,port} =this.p_host_info;
          // 验证ip地址是否正确
          if(!this.isValidIP(ip)){
            this.$message.error('ip地址不合法，请重新填写');
            return false;
          }
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
            if(res.data.code===0){
              this.$message({
                message: '添加主机成功',
                type: 'success'
              });
              this.getchannelList();
              this.isEditAisle = false;
            }else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }

          }) 
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //触发 修改主机
    edit(){
      if(this.selectData2.length===0){
         return this.$message("请勾选列表");
      }else if(this.selectData2.length>1){
        this.$message('只能勾选一项')
      }else{
         this.modalTitle = '修改主机'
         this.isEditXiu = true;
         this.p_host_edit_info = this.$lodash.cloneDeep(this.checkedData2);
         this.updatehostList('p_host_edit_info', true);
      }
    },
    
     //修改主机  提交
    saveEdit(){
      this.$refs.edit_p_host.validate((valid) => {
        if (valid) {
          let {brand,accessProtocol,ip,name,assetCode,modelNum,uniqueId,accessService,status,intercomNumber,port,outputNumber} =this.p_host_edit_info;
          // 验证ip地址是否正确
          if(!this.isValidIP(ip)){
            this.$message.error('ip地址不合法，请重新填写');
            return false;
          }
          let obj={
            id:this.checkedData2.id,
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
            port:port
          }
          editHostListApi(obj).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$message({
                message: '修改主机成功',
                type: 'success'
              });
              this.getchannelList();
              this.isEditXiu = false;
            }else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

     //删除 主机
    delHost(){
      if(this.selectData2.length===0){
        return this.$message('请勾选编辑项')
      }
      this.$confirm('确认删除选择项么', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids=this.selectData2.map(item=>{
          let {id}=item
          return id
        })
        deletHoststListApi({ids}).then(res=>{
          if(res.data.code===0){

            this.getchannelList();
          }
        })
      })
    },

    good(){
      this.getchannelList()
      this.$messageSuccess("刷新列表")
    },

    goodt(){
      this.getchannelList()
      this.$messageSuccess("刷新列表")
    }

  },
    
  created(){
    this.getBrand();
    this.getserver();
    this.getModelNumList(this.detailData.brand)
    this.gethostBrand() // 获取主机品牌列表
    this.gettaiBrand() // 获取台麦品牌列表
    // 判断如果是 新建-查看 页面 跳转过来 的 需要 在页头 显示新建
    if(this.pagetype && this.pagetype == 'examinelook'){
      this.create_look = true;
    }
    this.getKeyPartSelect(this.detailData.updatedDeptId,this.detailData.keyPartId)
  },
  mounted(){
    this.getchannelList();
    console.log(this.detailData)
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  .left-tree {
    width: 290px;
    // border-right: 1px solid #e1e1e1;
  }
  .content-btn {
    margin: 10px 0;
  }
  .form-box {
    flex:1;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    padding: 6px 20px;
    .button-box{
      margin-top:10px;
    }
    .form-top {
      width: 952px;
      font-size: 12px;
      line-height: 35px;
      text-align: center;
      margin-top: 10px;
    }
    .form-content {
      width: 952px;
      overflow: hidden;
      padding: 12px 12px 5px;
      font-size: 12px;
      // border: 1px solid #f7f2f1;
      background:rgba(245,245,245,1);
      /deep/.el-select {
        width: 100%;
      }
      /deep/.el-select > .el-input {
        width: 100%;
      }
      .form-group{
        width: 50%;
        float:left;
        margin-bottom: 14px;
      }
    }
  }
  /deep/.el-input__inner{
    text-overflow:ellipsis; white-space:nowrap; overflow:hidden;
  }
  .bottom-box1{
    padding-bottom: 20px;
  }
  .bottom-box{
    margin-top: 35px;
    .box-title {
      height: 28px;
      line-height: 28px;
      color: #606266;
      margin: 16px 0;
      span{
        margin-left: 7px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        position: relative;
        cursor: pointer;
      }
      span::before{
        content: '';
        width: 2px;
        height: 12px;
        display: block;
        background: #2d72d3;
        position: absolute;
        left: -7px;
        top: 2.5px;
      }

      .list-header {
        float: right;
        text-align: right;
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
  }
  
  
  .buttom-box{
    height:300px;
    margin-top:20px;
  }
  .create-host{
    width: 300px;
    height: 400px;
    border: 1px solid #ccc;
      background: white !important;
  }
  .bottom-btn {
    margin-top: 20px;
    width: 952px;
    text-align: center;
    /deep/.el-button--mini{
      width:93px;
    }
  }
  .brand{
    width: 260px;
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
