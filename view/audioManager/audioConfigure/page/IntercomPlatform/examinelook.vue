<template>
  <div class="main">
    <div class="left-tree">
      <orgTree style="width:290px" :lazyTreeApi="getAudioTreeApi" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi"  :treeType="treeType"  treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
    </div>
    <div class="form-box">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲管理平台</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
            <el-breadcrumb-item v-if="showPrintTypePage">打印</el-breadcrumb-item>
            <el-breadcrumb-item v-else>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>

      <!-- 操作按钮 -->
      <div class="button-box" v-if="showPrintTypePage">
        <el-button size="mini" v-print="'#printJS_container'">
          <i class="el-icon-printer"></i>
          <span>打印</span>
        </el-button>
        <el-button size="mini" @click="showPrintTypePage = false">取消</el-button>
      </div>
      <div class="button-box" v-else>
        <el-button size="mini" @click="linkToCreatePage">
          <i class="el-icon-plus"></i>
          <span>新建</span>
        </el-button>
        <el-button size="mini" @click="linkToEditPage">
          <i class="el-icon-edit"></i>
          <span>编辑</span>
        </el-button>
        <el-button size="mini" @click="delPlatform">
          <i class="el-icon-delete"></i>
          <span>删除</span>
        </el-button>
        <el-button size="mini" @click="getSourceEquipment">
          <i class="icon el-icon-circle-check"></i>
          <span>获取</span>
        </el-button>
        <el-button size="mini" @click='copyInfo'>
          <i class="el-icon-copy-document"></i>
          <span>复制</span>
        </el-button>
        <el-button size="mini" @click='movePlatform'>
          <i class="icon el-icon-rank"></i>
          <span>迁移</span>
        </el-button>
        <el-button size="mini" @click="sortPlatform">
          <i class="icon el-icon-sort"></i>
          <span>排序</span>
        </el-button>
        <el-button size="mini" @click="changePageTypeToPrint">
          <i class="el-icon-printer"></i>
          <span>打印</span>
        </el-button>
      </div>

      <!-- 打印内容 -->
      <div class="print-container" ref="printJS_container" id="printJS_container">
        <div class="form-top">对讲平台信息</div>
        <div class="form-content">
          <div class="form-group">
            <span class="label">所属机构</span>
            <span class="form-item">{{platform_info.orgName}}</span>
          </div>
          <div class="form-group">
            <span class="label">所属重点部位</span>
            <span class="form-item">{{platform_info.keyPartName}}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台名称</span>
            <span class="form-item">{{platform_info.name}}</span>
          </div>
          <div class="form-group">
            <span class="label">品牌</span>
            <span class="form-item">{{platform_info.brand}}</span>
          </div>
          <div class="form-group">
            <span class="label">型号</span>
            <span class="form-item">{{platform_info.modelNum}}</span>
          </div>
          <div class="form-group">
            <span class="label">接入协议</span>
            <span class="form-item">{{platform_info.accessProtocol}}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台唯一ID</span>
            <span class="form-item">{{platform_info.uniqueId}}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台IP地址</span>
            <span class="form-item">{{platform_info.ip}}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台端口</span>
            <span class="form-item">{{platform_info.port}}</span>
          </div>
          <div class="form-group">
            <span class="label">服务器接收端口</span>
            <span class="form-item">{{platform_info.cport}}</span>
          </div>
          <div class="form-group">
            <span class="label">级联音频端口</span>
            <span class="form-item">{{platform_info.dport}}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台用户名</span>
            <span class="form-item">{{platform_info.username}}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲平台密码</span>
            <span class="form-item">{{platform_info.password}}</span>
          </div>
          <div class="form-group">
            <span class="label">资产编码</span>
            <span class="form-item">{{platform_info.assetCode}}</span>
          </div>
          <div class="form-group" style="border:none">
            <span class="label">接入服务器</span>
            <span class="form-item">{{platform_info.accessService}}</span>
          </div>
          <div class="form-group" style="border:none">
            <span class="label">在线状态</span>
            <span class="form-item" v-if="platform_info.status == 1">离线</span>
            <span class="form-item" v-else-if="platform_info.status == 2">在线</span>
            <span class="form-item" v-else>未知</span>
          </div>
          
        </div>
        <!-- 录入人 ，录入时间，录入机构 -->
        <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right">{{ platform_info.updatedAt }}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right">{{ platform_info.updatedDept }}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right">{{ platform_info.updatedBy }}</div>
          </div>
        </div>

        <!--台麦列表-->
        <div class="bottom-box">
            <div style="width:100%;">
              <div class="box-title">
                <span class="pointer" @click="toggleOpen('detector')">
                  <span>台麦列表</span>
                  <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
                <div class="list-header" v-if="!showPrintTypePage">
                  <i class="el-icon-download" title="获取通道信息" @click="getSourceEquipment"></i>
                  <i class="el-icon-circle-plus-outline" title="新增" @click="addt" ></i>
                  <i class="el-icon-edit" title="编辑" @click="editmac"></i>
                  <i class="el-icon-delete" title="删除" @click="delMike"></i>
                  <i class="el-icon-refresh-right" title="刷新"></i>
                </div>
              </div>
              <div v-if="dropdownStatus.detector" style="width:100%;">
                  
                <el-table 
                  border
                  size="mini"
                  :data="p_mike_list"
                  @selection-change="handleSelectionChange1"
                  @select="select1"
                  stripe>
                  <!-- <el-table-column type="selection"></el-table-column> -->
                  <el-table-column type="index" label="序号"> </el-table-column>
                  <el-table-column v-for="item in p_mikeTableCulmn"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    show-overflow-tooltip
                    align="center">
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>

        <!--主机列表-->
        <div class="bottom-box">
            <div style="width:100%;">
              <div class="box-title">
                <span class="pointer"
                      @click="talkbackbtn('detector')">
                  对讲主机列表
                  <i :class="talkback.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
                <div class="list-header" v-if="!showPrintTypePage">
                  <i class="el-icon-download" title="获取通道信息"  @click="getSourceEquipment"></i>
                  <i  class="el-icon-circle-plus-outline" title="新增" @click="add"></i>
                  <i class="el-icon-edit" title="编辑" @click="edit"></i>
                  <i class="el-icon-delete" title="删除" @click="delHost"></i>
                  <i class="el-icon-refresh-right" title="刷新" @click="good"></i>
                </div>
              </div>
              <div v-if="talkback.detector" style="width:100%;">
                <el-table 
                  border
                  size="mini"
                  :data="p_host_list"
                  @selection-change="handleSelectionChange2"
                  @select="select2"
                  stripe>
                  <!-- <el-table-column type="selection"></el-table-column> -->
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column v-for="item in p_hostTableCulmn"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>

      </div>
        
      <!--添加(编辑)台麦-->
      <el-dialog :title="modalTitle" :visible.sync="isAddMac" width="440px" :close-on-click-modal="false">
          <el-form :model="p_mike_info" size="mini" label-position="right" label-width="140px" :rules="mikeRules" ref="add_p_mike">
            <el-form-item label="台麦名称" prop="name">
              <el-input v-model="p_mike_info.name"></el-input>
            </el-form-item>
            <el-form-item label="台麦唯一ID" prop="uniqueId">
              <el-input v-model="p_mike_info.uniqueId"></el-input>
            </el-form-item>
            <el-form-item label="台麦ip" prop="ip">
              <el-input v-model="p_mike_info.ip"></el-input>
            </el-form-item>
              <el-form-item label="台麦端口" prop="port">
              <el-input v-model="p_mike_info.port"></el-input>
            </el-form-item>
            <el-form-item label="在线状态">
              <el-select disabled v-model="p_mike_info.status" class="brand">
                <el-option v-for="item in stlist" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌">
              <el-select v-model="p_mike_info.brand" class="brand">
                  <el-option v-for="(item,index) in brandtaiList"
                              :key="index"
                              :label="item.data"
                              :value="item.data"
                              @click.native="updatetaiList(index)"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="型号">
              <el-select v-model="p_mike_info.modelNum" class="brand">
                  <el-option v-for="(item,index) in modeltaiList"
                              :key="index"
                              :label="item.data"
                              :value="item.data"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资产编码" required>
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
            <el-form-item label="台麦名称"  prop="name">
              <el-input v-model="p_mike_edit_info.name"></el-input>
            </el-form-item>
            <el-form-item label="台麦唯一ID"  prop="uniqueId">
              <el-input v-model="p_mike_edit_info.uniqueId"></el-input>
            </el-form-item>
            <el-form-item label="台麦ip"  prop="ip">
              <el-input v-model="p_mike_edit_info.ip"></el-input>
            </el-form-item>
              <el-form-item label="台麦端口"  prop="port">
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
            <el-form-item label="品牌">
                <el-select v-model="p_mike_edit_info.brand" class="brand">
                  <el-option v-for="(item,index) in brandtaiList"
                              :key="index"
                              :label="item.data"
                              :value="item.data"
                              @click.native="updatetaiList(index)"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="型号">
              <el-select v-model="p_mike_edit_info.modelNum" class="brand">
                  <el-option v-for="(item,index) in modeltaiList"
                              :key="index"
                              :label="item.data"
                              :value="item.data"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资产编码" required>
              <el-input v-model="p_mike_edit_info.assetCode"></el-input>
            </el-form-item>
          </el-form>
        <div style="text-align:center;">
          <el-button size="mini" type="primary" @click="savexiuMac">保存</el-button>
          <el-button size="mini" @click="cancal">取消</el-button>
        </div>
      </el-dialog>

        <!--添加主机-->
      <el-dialog :title="modalTitle" :visible.sync="isEditAisle" width="440px" :close-on-click-modal="false">
        <el-form :model="p_host_info" size="mini" label-position="right" label-width="140px" :rules="hostRules" ref="add_p_host">
          <el-form-item label="对讲主机名称" prop="name">
            <el-input v-model="p_host_info.name"></el-input>
          </el-form-item>
          <el-form-item label="对讲主机唯一ID" prop="uniqueId">
            <el-input v-model="p_host_info.uniqueId"></el-input>
          </el-form-item>
          <el-form-item label="对讲主机ip"  prop="ip">
            <el-input v-model="p_host_info.ip"></el-input>
          </el-form-item>
            <el-form-item label="对讲主机端口"  prop="port">
            <el-input v-model="p_host_info.port"></el-input>
          </el-form-item>
          <el-form-item label="在线状态" >
            <el-select disabled v-model="p_host_info.status" class="brand">
              <el-option v-for="item in stlist" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌">
            <el-select v-model="p_host_info.brand" class="brand" width="500px">
              <el-option v-for="(item,index) in brandhostList" :key="index" :label="item.data" :value="item.data" @click.native="updatehostList(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号">
            <el-select v-model="p_host_info.modelNum" class="brand">
              <el-option v-for="(item,index) in modelhostList" :key="index" :label="item.data" :value="item.data"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产编码" required>
            <el-input v-model="p_host_info.assetCode"></el-input>
          </el-form-item>
          <el-form-item label="对讲通道数量" required>
            <el-input v-model="p_host_info.intercomNumber"></el-input>
          </el-form-item>
          <el-form-item label="输出通道数量" required>
            <el-input v-model="p_host_info.outputNumber"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align:center;">
          <el-button size="mini" type="primary" @click="save">保存</el-button>
          <el-button size="mini" @click="cancal">取消</el-button>
        </div>    
      </el-dialog>

      <!--修改主机-->
      <el-dialog :title="modalTitle" :visible.sync="isEditXiu" width="440px" :close-on-click-modal="false">
        <el-form :model="p_host_edit_info" size="mini" label-position="right" label-width="140px" :rules="hostRules" ref="edit_p_host">
          <el-form-item label="对讲主机名称" prop="name">
            <el-input v-model="p_host_edit_info.name"></el-input>
          </el-form-item>
          <el-form-item label="对讲主机唯一ID"  prop="uniqueId">
            <el-input v-model="p_host_edit_info.uniqueId"></el-input>
          </el-form-item>
          <el-form-item label="对讲主机ip"  prop="ip">
            <el-input v-model="p_host_edit_info.ip"></el-input>
          </el-form-item>
            <el-form-item label="对讲主机端口"  prop="port">
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
          <el-form-item label="品牌">
            <el-select v-model="p_host_edit_info.brand" class="brand" width="500px">
                <el-option v-for="(item,index) in brandhostList"
                            :key="index"
                            :label="item.data"
                            :value="item.data"
                            @click.native="updatehostList(index)"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="型号">
            <el-select v-model="p_host_edit_info.modelNum" class="brand">
                <el-option v-for="(item,index) in modelhostList"
                            :key="index"
                            :label="item.data"
                            :value="item.data"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="资产编码" required>
            <el-input v-model="p_host_edit_info.assetCode"></el-input>
          </el-form-item>
          <el-form-item label="对讲通道数量" required>
            <el-input v-model="p_host_edit_info.intercomNumber"></el-input>
          </el-form-item>
          <el-form-item label="输出通道数量" required>
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
import { mapActions, mapState, mapMutations } from 'vuex'
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import audioRules from '@src/assets/rules/validation/security/audio'

import {createHostApi,getHostListApi,getTalkbackListApi,talkbackListApi,
       editTalkbackListApi,deletHoststListApi,editHostListApi,getAudioHostlistApi,
       getAudioSyncHostlistApi,getBrandModuleApi} from "../../../../../http/audioManage/talkback.api"
export default {
  components: {
   orgTree
  },
  props:["detailData"],
  data() {
    return {
      treeType:2,
      showPrintTypePage:false,  //点击页头 打印按钮 页面变成打印状态 

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

      stlist:[
        { label:'在线',value:"2",},
        { label:'离线',value:'1',}
      ],
      
      brandList: [],
      modelList: [],
      protocolList:[
         { label: '建行协议', value: '建行协议' },
         { label: '私有协议', value: '私有协议' }
      ],
      serverList:[ ],

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
      mikeRules:audioRules.mikeRules,

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

      // 添加 主机 formRule
      hostRules:audioRules.hostRules,

      modalTitle:"",  // 弹框标题
      
      dropdownStatus: {
        detector: true
      },
      talkback:{
        detector: true
      },

      // 平台下 台麦列表表格字段
      p_mikeTableCulmn:[
        { prop: 'name', label: '台麦名称', width: '',sortable: true  },
        { prop: 'uniqueId', label: '台麦唯一ID', width: '',sortable: true  },
        { prop: 'ip', label: '台麦唯一Ip', width: '',sortable: true  },
        { prop: 'brand', label: '品牌', width: '',sortable: true  },
        { prop: 'modelNum', label: '型号', width: '',sortable: true  },
        { prop: 'assetCode', label: '资产编码', width: '',sortable: true  },
        { prop: 'status', label: '在线状态', width: '',sortable: true  },
        // { prop: 'status', label: '运行状态', width: '',sortable: true  },
      ],

      // 平台下 主机列表表格字段
      p_hostTableCulmn: [
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
      p_host_list:[],  // 平台下 的主机列表
      p_mike_list:[],   // 平台下 的台麦列表

      selectData1:[],  // 平台下台麦 选中数据（多选）
      checkedData1:[],  // 平台下台麦 选中数据（单选）

       selectData2:[],  // 平台下主机 选中数据（多选）
      checkedData2:[],  // 平台下主机 选中数据（单选）

      brandhostList:[],   //平台下主机 品牌数据列表
      modelhostList:[],  //平台下主机 型号数据列表
      brandtaiList:[],    //平台下台麦 品牌数据列表
      modeltaiList:[],    //平台下台麦 型号数据列表
    }
  },
  methods: {
    ...mapActions('talkback', {
      talkbackList: 'talkbackList',
      deletTalkbackList: "deletTalkbackList"
    }),

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

    // 获取平台详情
    getchannelList(){
      let obj={
        id:this.detailData.id
      } 
      getAudioHostlistApi(obj).then(res=>{
         console.log(res);
         this.p_mike_list=res.data.data.taimaies;
         this.p_host_list=res.data.data.intercomes;
         this.platform_info=res.data.data.platform;
      })
    },
    getBrand(){
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '1' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.brandList=res.data.data[0].attr
       })
    },

    updateList(index) {
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '2' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.modelList=res.data.data[0].attr
          let brand=this.brandList;
          this.AllmodelList=this.modelList
          let modelList= this.modelList;
          let data1=brand[index].data;
            
          let arr=[]
          modelList.filter((v)=>{
          if(v.homeClass==data1){  
            arr.push(v);
          }
          this.modelList=arr;
         })
       })
    },

    list(){
      let obj={
        page:1,
        limit:100,
      }
      talkbackListApi(obj).then( res => {
        let {data}=res.data;
        this.p_hostTableCulmn=data.platforms;
        this.total = data.count.total
        console.log(this.total)
      })
    },

    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    
    talkbackbtn(key){
      this.talkback[key] = !this.talkback[key]
    },

    // 新增/编辑主机(弹窗)的保存按钮
    up(){
      // this.getchannelList()
      let obj={
        id:this.detailData.id,
        type:1
      }
      getAudioSyncHostlistApi(obj).then(res=>{
         console.log(res)
      })
    },
    

    gethostBrand(){
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '3' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.brandhostList=res.data.data[0].attr
       })
    },

    updatehostList(index) {
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '4' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.modelhostList=res.data.data[0].attr
              let brand=this.brandhostList;
         this.AllmodelhostList=this.modelhostList
          let modelhostList= this.modelhostList;
          console.log(brand[index],"yyyyyyyyyyyyyyyyyyyyyyyyyy")
          let data1=brand[index].data;
            
            let arr=[]
            modelhostList.filter((v)=>{
            if(v.homeClass==data1){  
              arr.push(v);
            }
          console.log("fdsfsdfsfsdfsd",arr)
          this.modelhostList=arr;
         })
       })
    },

    gettaiBrand(){
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '5' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.brandtaiList=res.data.data[0].attr
       })
    },

    updatetaiList(index) {
      let queryList = [{ type: '2', moduleId: '1', childModuleId: '3', dictId: '6' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.modeltaiList=res.data.data[0].attr
              let brand=this.brandtaiList;
         this.AllmodeltaiList=this.modeltaiList
          let modeltaiList= this.modeltaiList;
          let data1=brand[index].data;
            
            let arr=[]
            modeltaiList.filter((v)=>{
            if(v.homeClass==data1){  
              arr.push(v);
            }
          console.log("fdsfsdfsfsdfsd",arr)
          this.modeltaiList=arr;
         })
       })
    },

    // 台麦列表选中（单选）
    select1(s,row){
      this.checkedData1 = row
      // this.id=row.id
    },

    // 台麦列表选中 （多选）
    handleSelectionChange1(val){   
      this.selectData1 = [...val]
    },

    // 触发 新增台麦 
    addt(){
      for (let key in this.p_host_info){
        this.p_mike_info[key] = ''
      }
       this.modalTitle = '新增台麦'
      this.isAddMac = true
      this.gettaiBrand()
    },

    //添加台麦 提交
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
              orgId:this.platform_info.orgId,
              keyPartId:this.platform_info.keyPartId,
              keyPartName:this.platform_info.keyPartName, 
              keyPartType:"1",
              subSystem:"4",
              platformId:this.platform_info.id,
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
              this.getchannelList()
              this.isAddMac = false
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

    // 触发 修改台麦
    editmac(){
      if(this.selectData1.length===0){
        return this.$message("请勾选列表")
      }else if(this.selectData1.length>1){
        this.$message('只能勾选一项')
      }else{
        this.modalTitle = '修改台麦'
        this.isEditMac = true
        this.p_mike_edit_info = this.$lodash.cloneDeep(this.checkedData1);
      }
    },

    //修改台麦  提交
    savexiuMac(){
      this.$refs.edit_p_mike.validate((valid) => {
        if (valid) {
          let {brand,accessProtocol,ip,name,assetCode,modelNum,uniqueId,accessService,status,} =this.p_mike_edit_info
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
          }
          editHostListApi(obj).then(res=>{
            if(res.data.code===0){
              this.isEditMac=false
              this.$message({
                message: '修改台麦成功',
                type: 'success'
              });
              this.getchannelList();  // 获取台麦列表
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
        console.log(res)
        })
      })
    },

    // 主机列表选中（多选）
    handleSelectionChange2(val){   
      this.selectData2 = [...val]
      console.log(val, '列表勾选')
    },
    // 主机列表选中（单选）
    select2(s,row){
      this.checkedData2 = row
      // this.id=row.id
    },

    // 触发  新增主机 弹窗
    add(){
      for (let key in this.p_host_info){
        this.p_host_info[key] = ''
      }
      this.modalTitle = '新增主机'
      this.isEditAisle = true
      this.gethostBrand()
    },

    //添加主机 提交
    save(){
      this.$refs.add_p_host.validate((valid) => {
        if (valid) {
          let { name,uniqueId,ip,port,status,value,brand,modelNum,assetCode,intercomNumber,outputNumber } =this.p_host_info
          // 验证ip地址是否正确
          if(!this.isValidIP(ip)){
            this.$message.error('ip地址不合法，请重新填写');
            return false;
          }
          let obj={
            orgId:this.platform_info.orgId,
            keyPartId:this.platform_info.keyPartId,
            keyPartName:this.platform_info.keyPartName, 
            keyPartType:"1",
            subSystem:"4",
            platformId:this.platform_info.id,
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

    // 触发 修改主机
    edit(){
      if(this.selectData2.length===0){
        return this.$message("请勾选列表")
      }else if(this.selectData2.length>1){
        this.$message('只能勾选一项')
      }else{
        this.modalTitle = '修改主机'
        this.isEditXiu = true
        this.p_host_edit_info =this.$lodash.cloneDeep(this.checkedData2);
        this.gethostBrand()
      }
    },
    
     //修改主机 提交
    saveEdit(){
      this.$refs.edit_p_host.validate((valid) => {
        if (valid) {
          let {brand,accessProtocol,ip,name,assetCode,modelNum,uniqueId,accessService,status,intercomNumber,outputNumber} =this.p_host_edit_info
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
          }
          editHostListApi(obj).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$message({
                message: '修改主机成功',
                type: 'success'
              });
              this.getchannelList();
              this.isEditXiu=false
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

     //删除主机
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
        console.log(res)
        })
      })
    },

    // 取消 （添加 （编辑） 台麦 或者 主机 ）
    cancal(){
      this.isEditAisle = false
      this.isEditMac = false
      this.isEditXiu=false
      this.isAddMac=false
    },

    good(){
      this.getchannelList()
    },

    // 表单按钮 操作 
    // 跳转新建界面
    linkToCreatePage(){
      this.$emit('modelChange','Create');
    },

    // 跳转 编辑 界面
    linkToEditPage(){
      this.$emit('modelChange','edit',this.detailData);
    },
      
    // 删除本对讲平台
    delPlatform(){
      this.$confirm('请确定要删除此对讲平台吗?', '删除平台', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = [];
          var id = this.detailData.id;
          ids.push(id);
          // var params = {
          //   ids:ids
          // }
          this.deletTalkbackList({ ids }).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

              // 跳转 新建页面
              this.linkToCreatePage();

            }

          })     
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });     
          
        });
    },

    // 获取 平台下 已经配置的 设备（需要世邦提供底层接口，暂不支持）
    getSourceEquipment(){
      this.$message.error('获取失败');
    },

    // 复制本对讲平台信息并跳转到新建页面
    copyInfo(){
      this.$emit('modelChange','Create',this.platform_info,[],'examinelook');
    },

    // 迁移本对讲平台信息-- 跳转至迁移页面
    movePlatform(){
      this.$emit('modelChange','migtate',{},[this.platform_info],'examinelook');
    },

    // 跳转至排序页面
    sortPlatform(){
      this.$emit('modelChange','sort',this.platform_info,[],'examinelook');
    },

    // 改变页面 为 打印状态
    changePageTypeToPrint(){
      this.showPrintTypePage = true;
    },

    // 打印本平台信息
    Toprint(){ 
      this.showPrintTypePage = true;
    },

    // 验证ip地址
    isValidIP(ip) {
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      return reg.test(ip);
    }, 
    
  },        
  created(){
    this.getBrand()
    this.getchannelList()
  },            
  mounted(){
    console.log(this.detailData)
  }
}
</script>

<style lang="less" scoped>
  .main {
    width: 100%;
    box-sizing:border-box;
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */
    min-height: 100%;
    display: flex;
    .left-tree {
      width: 290px;
    }
    .content-btn {
      margin: 10px 0;
    }
    .form-box {
      width: 100%;
      box-sizing:border-box;
      -moz-box-sizing:border-box; /* Firefox */
      -webkit-box-sizing:border-box; /* Safari */
      padding: 3px 20px 15px;
      .button-box{
        margin:10px 0;
        /deep/.el-button--mini{
          width:80px;
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
            padding-left:32px;
          }
        }
      }
      .box-title {
        // position: relative;
        height: 15px;
        line-height: 15px;
        color: #606266;
        margin: 20px 0;
        padding-left:10px;
        border-left:2px solid #2D71D3;
        i {
          // position: absolute;
          // top: 50%;
          // left: 100px;
          // transform: translateY(-50%);
        }
        &::after {
          // display: block;
          // content: '';
          // border-top: 1px solid #e1e1e1;
          // width: calc(~'100% - 120px');
          // margin-left: 120px;
          // margin-top: -12px;
        }
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
      /deep/.el-input__inner{
        text-overflow:ellipsis; white-space:nowrap; overflow:hidden;
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
        margin-top: 12px;
        width: 846px;
        text-align: center;
      }
      .brand{
        width: 260px;
      }
      .bottom-box{
        padding:35px 20px 10px 0;
      }
    }      
  }

@media print {
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
          padding-left:15px;
        }
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
    
    .buttom-box{
      height:300px;
      margin-top:20px;
      .box-title {
        height: 15px;
        line-height: 15px;
        color: #606266;
        margin: 20px 0;
        padding-left:10px;
        border-left:2px solid #2D71D3;
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
