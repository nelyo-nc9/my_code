<!-- 树节点详细信息弹窗 -->
<template>
  <el-dialog :visible.sync="showDialogInfo"
             width="580px"
             center
             :before-close="closeModal"
             :show-close="false"
             :close-on-click-modal="false">
    <iframe v-if="showDialogInfo"
            style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; border: 0;"></iframe>
    <div slot="title">
      <span class="title-span">{{nodeTypeObj[nodeType]}}</span>
      <i class="el-icon-close close-icon"
         @click="closeModal"></i>
    </div>
    <!-- 设备详情 -->
    <div class="box"
         v-if="nodeType==='equ'">
      <div class="left">
        <span>所属机构</span>
        <span>所属重点部位</span>
        <span>设备名称</span>
        <span>设备品牌</span>
        <span>设备型号</span>
        <span>设备类型</span>
        <span>资产编码</span>
        <span>IP地址</span>
        <span>备注</span>
      </div>
      <div class="right">
        <span :title="equInfo.orgName">{{equInfo.orgName}}</span>
        <span :title="equInfo.locName">{{equInfo.locName}}</span>
        <span :title="equInfo.name">{{equInfo.name}}</span>
        <span>{{equInfo.brand}}</span>
        <span>{{equInfo.deviceModel}}</span>
        <span>{{equInfo.deviceType}}</span>
        <span>{{equInfo.code}}</span>
        <span>{{equInfo.ip}} <i v-show="equInfo.ip"
             @click="pingFunc(equInfo.ip)">ping</i><i v-show="ipStatusObj[ipStatusVal]"
             :class="[ipStatusVal===1 ? 'green-color' : 'red-color']">{{ipStatusObj[ipStatusVal]}}</i> </span>
        <span :title="equInfo.remark">{{equInfo.remark}}</span>
      </div>
    </div>
    <!-- 通道详情 -->
    <div class="box"
         v-if="nodeType==='res'">
      <div class="left">
        <span>所属子系统</span>
        <span>所属机构</span>
        <span>所属重点部位</span>
        <span>所属设备</span>
        <span>设备品牌</span>
        <span>设备类型</span>
        <span>设备型号</span>
        <span>资源名称</span>
        <span>通道号</span>
        <span>IP地址</span>
        <span>序列号</span>
        <span>资产编码</span>
        <span>备注</span>
      </div>
      <div class="right">
        <span :title="resInfo.subSystemName">{{resInfo.subSystemName}}</span>
        <span :title="resInfo.orgName">{{resInfo.orgName}}</span>
        <span :title="resInfo.keyPartName">{{resInfo.keyPartName}}</span>
        <span :title="resInfo.deviceName">{{resInfo.deviceName}}</span>
        <span>{{resInfo.brand}}</span>
        <span>{{resInfo.deviceType}}</span>
        <span>{{resInfo.modelNum}}</span>
        <span :title="resInfo.name">{{resInfo.name}}</span>
        <span>{{resInfo.serise}}</span>
        <span>{{resInfo.ip}} <i v-show="resInfo.ip"
             @click="pingFunc(resInfo.ip)">ping</i><i v-show="ipStatusObj[ipStatusVal]"
             :class="[ipStatusVal===1 ? 'green-color' : 'red-color']">{{ipStatusObj[ipStatusVal]}}</i> </span>
        <span>{{resInfo.uniqueId}}</span>
        <span>{{resInfo.assetCode}}</span>
        <span :title="resInfo.remark">{{resInfo.remark}}</span>
      </div>
    </div>
    <!-- 重点部位详情 -->
    <div class="box"
         v-if="nodeType==='loc'">
      <div class="info-item"
           v-for="(item,index) in locLabels"
           :key="item.props + '_' + index">
        <div class="info-key">{{item.label}}</div>
        <div class="info-value"
             :title="locInfo[item.prop] || '---'">{{locInfo[item.prop] || '---'}}</div>
      </div>
    </div>
    <!-- 机构详情 -->
    <div class="box"
         v-if="nodeType==='org'">
      <div class="info-item"
           v-for="(item,index) in orgLables"
           :key="item.props + '_' + index">
        <div class="info-key">{{item.label}}</div>
        <div class="info-value"
             :title="orgInfo[item.prop] || '---'">{{orgInfo[item.prop] || '---'}}</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import axios from 'axios'
import {
  getResourceInfoApi,
  getDeviceInfoApi,
  getLocOrOrgInfoApi,
  getIpIspingApi,
} from '@src/http/video/videoConfig.api.js'
import { getDictBasicInfo } from '@src/http/video/videoPreview.api.js'
import { getalrmHostListQueryApi } from '@src/http/alarm/alarmHostManage.api.js'
export default {
  name: 'Slider',
  props: {
    showDialogInfo: {
      // 是否展示机构树节点信息弹窗
      type: Boolean,
      default: false,
    },
    nodeData: {
      // 机构树节点数据
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.nodeType = this.nodeData.tierType
     this.getDetailInfo(this.nodeData)
      this.equInfo = this.nodeData
  },
  data() {
    return {
      nodeType: 'org',
      nodeTypeObj: {
        org: '机构详情',
        loc: '重点部位详情',
        equ: '设备详情',
        res: '资源详情',
      },
      deviceType: [],
      resInfo: {},
      equInfo: {},
      locInfo: {},
      locLabels: [],
      orgInfo: {},
      orgLables: [
        { prop: 'serial', label: '机构编号' },
        { prop: 'name', label: '机构中文简称' },
        { prop: 'kindName', label: '机构类别' },
        { prop: 'telephone', label: '固定电话' },
        { prop: 'mobile', label: '移动电话' },
        { prop: 'email', label: '电子邮件' },
        { prop: 'address', label: '机构地址' },
        { prop: 'businessHours', label: '开始营业时间' },
        { prop: 'statusName', label: '机构状态' },
        { prop: 'closeBusiness', label: '关闭日期' },
        { prop: 'startBusiness', label: '开业日期' },
        { prop: 'parentName', label: '上级机构名称' },
        { prop: 'functionary', label: '机构负责人' },
        { prop: 'parentSerial', label: '上级机构编号' },
      ],
      statusCh: ['', '正常', '已撤销', '已合并', '临时停业'],
      kindArr: ['', '总行', '一级分行', '二级分行', '直管行', '县级行', '园区'],
      ipStatusObj: {
        1: '通',
        2: '不通',
      },
      ipStatusVal: 0,
    }
  },
  mounted() {},
  beforeDestroy() {},
  computed: {},
  watch: {},
  methods: {
    // 请求设备信息
    getDeviceSelectConf() {
      let _this = this
      let obj = {
        queryList: [
          {
            moduleId: '1',
            childModuleId: '2',
            dictId: '1',
            type: '1',
          },
        ],
      }
      getDictBasicInfo(obj).then((res) => {
        if (res.data.code === 0) {
          _this.deviceType = res.data.data[0].attr.map((i) => {
            return {
              key: i.key,
              name: i.data,
            }
          })
        }
      })
    },
    pingFunc(ip) {
      // ping功能
      let param = {
        ipAddr: ip,
      }
      getIpIspingApi(param)
        .then((res) => {
          if (res.data.code === 0) {
            this.ipStatusVal = res.data.data.status
          } else {
            this.ipStatusVal = 0
            this.$messageError(`ping失败，失败原因${res.data.message}！`)
          }
        })
        .catch((err) => {
          this.ipStatusVal = 0
          this.$messageError('ping失败')
        })
    },
    closeModal() {
      this.$emit('closeDialogInfo')
    },
    initInfo(type) {
      let infoData = [
        {
          key: 1,
          data: [
            { prop: 'name', label: '营业网点名称' },
            { prop: 'address', label: '营业网点地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '营业网点电话' },
            { prop: 'principal1', label: '营业网点负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '营业网点负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '营业网点安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '营业网点安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' },
          ],
        },
        {
          key: 2,
          data: [
            { prop: 'name', label: '金库名称' },
            { prop: 'address', label: '金库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '守护室电话' },
            { prop: 'principal1', label: '金库常务副主任' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '金库副主任' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 3,
          data: [
            { prop: 'name', label: '机房名称' },
            { prop: 'address', label: '机房地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '机房负责人' },
            { prop: 'principalPhone1', label: '负责人电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'telephone', label: '机房值班电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 4,
          data: [
            { prop: 'name', label: '办公楼名称' },
            { prop: 'address', label: '办公楼地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '值班电话' },
            { prop: 'principalPhone2', label: '消防控制室电话' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal1', label: '办公楼联系人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'updatedBy', label: '录入人' },
            { prop: 'updatedDept', label: '录入机构' },
            { prop: 'updatedAt', label: '录入时间' },
          ],
        },
        {
          key: 5,
          data: [
            { prop: 'name', label: '自助银行名称' },
            { prop: 'address', label: '自助银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助银行负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 6,
          data: [
            { prop: 'name', label: '自助设备名称' },
            { prop: 'address', label: '自助设备地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助设备负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 7,
          data: [
            { prop: 'name', label: '自助银亭名称' },
            { prop: 'address', label: '自助银亭地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助银亭负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 8,
          data: [
            { prop: 'name', label: '私人银行名称' },
            { prop: 'address', label: '私人银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '私人银行电话' },
            { prop: 'principal1', label: '私人银行负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '私人银行负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '私人银行安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '私人银行安全员一' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' },
          ],
        },
        {
          key: 9,
          data: [
            { prop: 'name', label: '保管箱库名称' },
            { prop: 'address', label: '保管箱库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '保管箱库负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 10,
          data: [
            { prop: 'name', label: '档案库名称' },
            { prop: 'address', label: '档案库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '档案库电话' },
            { prop: 'principal1', label: '档案库负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 11,
          data: [
            { prop: 'name', label: '远程监控中心名称' },
            { prop: 'address', label: '远程监控中心地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '中心值班电话' },
            { prop: 'principal1', label: '远程监控中心负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 12,
          data: [
            { prop: 'name', label: '5G+智能银行名称' },
            { prop: 'address', label: '5G+智能银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '5G+智能银行电话' },
            { prop: 'principal1', label: '5G+智能银行负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '5G+智能银行负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '5G+智能银行安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '5G+智能银行安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' },
          ],
        },
        {
          key: 13,
          data: [
            { prop: 'name', label: '财富中心名称' },
            { prop: 'address', label: '财富中心地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '财富中心电话' },
            { prop: 'principal1', label: '财富中心负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '财富中心负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '财富中心安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '财富中心安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' },
          ],
        },
        {
          key: 14,
          data: [
            { prop: 'name', label: '部位名称' },
            { prop: '', label: '部位类型' },
            { prop: 'address', label: '部位地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '部位电话' },
            { prop: 'principal1', label: '部位负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '部位安全员' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 15,
          data: [
            { prop: 'name', label: '部位名称' },
            { prop: 'address', label: '部位地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '部位负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'serial', label: '部位代码' },
          ],
        },
      ]
      return infoData.find((item) => item.key === type).data
    },
    getDetailInfo(data) {
       
      // 获取详细信息
      if (data.tierType === 'equ') {
        this.getDeviceSelectConf()
        getalrmHostListQueryApi({hostId:data.id})
          .then((res) => {  
            if (res.data.code === 0) {
              this.equInfo = res.data.data.results[0]
              this.equInfo.type = this.deviceType.find((i) => i.key / 1 === this.equInfo.type).name
            } else {
              this.$messageError(res.data.data)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (data.tierType === 'res') {
        this.getDeviceSelectConf()
        getResourceInfoApi(data.id)
          .then((res) => {
            if (res.data.code === 0) {
              this.resInfo = res.data.data
              this.resInfo.deviceType = this.deviceType.find((i) => i.key / 1 === this.resInfo.deviceType).name
            } else {
              this.$messageError(res.data.data)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (data.tierType === 'loc') {
        this.locLabels = this.initInfo(data.keyPartType)
        getLocOrOrgInfoApi({
          ids: [data.id],
          type: 2,
        })
          .then((res) => {
             
            if (res.data.code === 0) {
              this.locInfo = res.data.data.keyParts[0]
              this.locInfo.status = this.statusCh[this.locInfo.status]
            } else {
              this.$messageError(res.data.data)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (data.tierType === 'org') {
        getLocOrOrgInfoApi({
          ids: [data.id],
          type: 1,
        })
          .then((res) => {
            if (res.data.code === 0) {
              this.orgInfo = res.data.data.orgs[0]
              this.orgInfo.status = this.statusCh[this.orgInfo.status]
              this.orgInfo.kindName = this.kindArr[Number(this.orgInfo.kind)]
            } else {
              this.$messageError(res.data.data)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
  },
}
</script>

<style lang='less' scoped>
/deep/.el-dialog__header {
  position: relative;
  z-index: 1;
}
.title-span {
  font-size: 18px;
}
.close-icon {
  float: right;
  font-size: 18px;
  cursor: pointer;
}
.box {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  .left {
    width: 150px;
    height: 100%;
    border-right: 1px solid #ddd;
    span {
      width: 100%;
      height: 36px;
      line-height: 36px;
      display: inline-block;
      color: #ccc;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrapx;
      overflow: hidden;
    }
  }
  .right {
    flex: 1;
    height: 100%;
    span {
      width: 100%;
      height: 36px;
      line-height: 36px;
      display: inline-block;
      color: #333;
      text-indent: 20px;
      text-overflow: ellipsis;
      white-space: nowrapx;
      overflow: hidden;
      i {
        color: #409eff;
        cursor: pointer;
        margin-left: 15px;
      }
      .green-color {
        color: #32e285;
        cursor: default;
      }
      .red-color {
        color: red;
        cursor: default;
      }
    }
  }
  .info-item {
    width: 50%;
    height: 40px;
    line-height: 40px;
    display: flex;
    padding-left: 10px;
    .info-key {
      width: 110px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .info-value {
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
