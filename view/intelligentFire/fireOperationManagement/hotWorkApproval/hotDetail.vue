<template>
    <div class="content">
        <div class="left-tree">
            <OrgTree></OrgTree>
        </div>
        <div class="right-content">
            <div class="top-box">
                <header>
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                        <el-breadcrumb-item>消防运行管理</el-breadcrumb-item>
                        <el-breadcrumb-item>动火申请管理</el-breadcrumb-item>
                        <el-breadcrumb-item>动火申请</el-breadcrumb-item>
                        <el-breadcrumb-item>查看</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
            </div>
            <div class="bodyBox">
                <div class="button-box">
                    <el-button size="mini"  v-print="'#hotprintDom'">打印</el-button>
                    <el-button size="mini" @click="lookChange">查看流程</el-button>
                    <el-button size="mini" @click="printingHot">打印动火证</el-button>
                    <el-button size="mini" @click="goBlackLIst">关闭</el-button>
                </div>
                <div class="form-box" id="hotprintDom">
                    <div class="form-content">
                        <h3 class="box-title">动火申请单</h3>
                       <table class="hotTable">
                            <tr>
                                <td>所属机构</td>
                                <td>保定分行</td>
                                <td>所属重点部位</td>
                                <td>总行白楼（示例）</td>
                                <td>申请编号</td>
                                <td>202005231500</td>
                            </tr>
                            <tr>
                                <td>申请单位</td>
                                <td>科技部</td>
                                <td>申请人</td>
                                <td>张三</td>
                                <td>申请日期</td>
                                <td>2020-05-23 15:00:00</td>
                            </tr>
                            <tr>
                                <td>动火单位</td>
                                <td>***工程装修装饰有限公司</td>
                                <td>施工负责人</td>
                                <td>李四</td>
                                <td>工程类型</td>
                                <td>装饰、装修</td>
                            </tr>
                            <tr>
                                <td>动火方式</td>
                                <td>电气焊作业</td>
                                <td>开始时间</td>
                                <td>2020.05.25 15:30</td>
                                <td>结束时间</td>
                                <td>2020.05.25 18:30</td>
                            </tr>
                             <tr>
                                <td>施工时间</td>
                                <td>3</td>
                                <td>监护人</td>
                                <td>赵六</td>
                                <td colspan="2"></td>
                            </tr>
                            <tr>
                                <td>防火措施</td>
                                <td colspan="5">灭火器、防火挡板</td>
                            </tr>
                            <tr>
                                <td>动火部位</td>
                                <td colspan="5">二楼会议室</td>
                            </tr>
                            <tr>
                                <td>动火原因</td>
                                <td colspan="5">二楼装修、需要动电、动火</td>
                            </tr>
                            <tr>
                                <td>附件</td>
                                <td colspan="5">
                                    <div>
                                        <i class="el-icon-tickets"></i>
                                        <p>附件一</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>动火人员</td>
                                <td colspan="5">
                                    <div class="imgGroup">
                                        <img src="" />
                                        <img src="" />
                                        <img src="" />
                                    </div>
                                    <table class="hotPersonnelMes">
                                        <tr>
                                            <td>人员姓名</td>
                                            <td>李四</td>
                                            <td>张三</td>
                                            <td>赵六</td>
                                        </tr>
                                        <tr>
                                            <td>身份证号</td>
                                            <td>11010819901008****</td>
                                            <td>11010819901008****</td>
                                            <td>11010819901008****</td>
                                        </tr>
                                         <tr>
                                            <td>联系电话</td>
                                            <td>13800138000</td>
                                            <td>13800138000</td>
                                            <td>13800138000</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>审批意见</td>
                                <td colspan="5">
                                    <span v-if="!selectType">同意</span>
                                    <el-input
                                        v-else
                                        class="tableTextarea"
                                        type="textarea"
                                        :rows="2"
                                        placeholder="请输入内容"
                                        v-model="approvalOpinion">
                                    </el-input>
                                </td>
                            </tr>
                            <tr v-if="selectType">
                                <td>审批操作</td>
                                <td colspan="5">
                                    <el-button type="primary" size="mini" @click="rejectSelct">驳回</el-button>
                                    <el-button size="mini" @click="agreeSelect">同意</el-button>
                                </td>
                            </tr>
                            <tr>
                                <td>审批记录</td>
                                <td colspan="5">
                                    <p class="tableTitle">
                                        <span>安保部：李四</span>
                                        <span>于 2020-05-27 11：35</span>
                                        <span>审批： <i>通过</i></span>
                                        <span>审批意见：无</span>
                                    </p>
                                     <p class="tableTitle">
                                        <span>抄送人：王五</span>
                                        <span>于 2020-05-27 11：35</span>
                                        <span> 已抄送</span>
                                    </p>
                                </td>
                            </tr>
                       </table>
                    </div>
                </div>
                <div class="seeFlowPath" v-if="seeFlowBool">
                    <div class="flowTitle">
                        <p>流程视图</p>
                        <i class="el-icon-circle-close" @click="closeFlow"></i>
                    </div>
                    <el-table :data="flowList"  border size="mini" stripe  style="width: 100%" :height="tableHeight">
                        <el-table-column   align="center" type="index" label="序号"></el-table-column>
                        <el-table-column   align="center" prop="orgName" label="操作时间"></el-table-column>
                        <el-table-column   align="center" prop="keySite" label="操作内容"></el-table-column>
                        <el-table-column   align="center" prop="deviceType" label="操作人"></el-table-column>
                        <el-table-column   align="center" prop="deviceName" label="操作记录"></el-table-column>
                        <el-table-column   align="center" prop="code" label="发送时间"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="printPreview" v-show="printPreviewBool">
            <print-preview @closeAddOrEditBox="closeAddOrEditBox"></print-preview>
        </div>
    </div>
</template>

<script>
import OrgTree from '../../OrgTree'
import printPreview from './printPreview'
import {
  mapActions,
  mapMutations
} from 'vuex'

export default {
  name: 'hotDetail',
  components: {
    OrgTree,
    printPreview
  },
  data() {
    return {
        tableHeight: 400,
        printPreviewBool:false,
        seeFlowBool:false,
        selectType:false,
        approvalOpinion:"",
        flowList:[
            {
            orgName: '保定分行',
            keySite: '融汇支行(办公楼)',
            deviceType: '202005261002',
            deviceName: '张三',
            code: '***工程装修装饰有限公司'
            },
            {
            orgName: '保定分行',
            keySite: '融汇支行(办公楼)',
            deviceType: '202005261002',
            deviceName: '张三',
            code: '***工程装修装饰有限公司'
            },
            {
            orgName: '保定分行',
            keySite: '融汇支行(办公楼)',
            deviceType: '202005261002',
            deviceName: '张三',
            code: '***工程装修装饰有限公司'
            },
            {
            orgName: '保定分行',
            keySite: '融汇支行(办公楼)',
            deviceType: '202005261002',
            deviceName: '张三',
            code: '***工程装修装饰有限公司'
            },
            {
            orgName: '保定分行',
            keySite: '融汇支行(办公楼)',
            deviceType: '202005261002',
            deviceName: '张三',
            code: '***工程装修装饰有限公司'
            },
            {
            orgName: '保定分行',
            keySite: '融汇支行(办公楼)',
            deviceType: '202005261002',
            deviceName: '张三',
            code: '***工程装修装饰有限公司'
            },
            {
            orgName: '保定分行',
            keySite: '融汇支行(办公楼)',
            deviceType: '202005261002',
            deviceName: '张三',
            code: '***工程装修装饰有限公司'
            },
            {
            orgName: '保定分行',
            keySite: '融汇支行(办公楼)',
            deviceType: '202005261002',
            deviceName: '张三',
            code: '***工程装修装饰有限公司'
            }
        ]
    }
  },
  methods: {
    // 查看流程
    lookChange() {
        this.seeFlowBool = true
    },
    //打印动火证
    printingHot(){
        this.printPreviewBool = true;
    },
    //打印动火证弹窗关闭
    closeAddOrEditBox(){
      this.printPreviewBool = false;
    },
    //父组件的操作时间
    parentHotDetail(row,type){
        this.selectType = type;
    },
    //关闭流程弹窗
    closeFlow(){
        this.seeFlowBool = false
    },
    //驳回
    rejectSelct(){

    },
    //同意
    agreeSelect(){

    },
    //返回列表
    goBlackLIst(){
        this.$emit("closeAddOrEditBox");
    },
  }
}
</script>

<style lang="less" scoped>
    .content {
        width: 100%;
        height: 100%;
        display: flex;
        .left-tree {
            width: 240px;
            height: 90vh;
            border-right: 1px solid #e1e1e1;
        }
        .right-content {
            font-size: 14px;
            padding: 0 10px;
            width: 100%;
            .top-box {
                .button-box {
                    margin: 18px 0;
                }
            }
            .form-box{
                margin-top: 20px;
            }
            .bodyBox {
                width: 100%;
                height: 100%;
                margin: 20px 0;
                font-size: 12px;
            }
            .box-title{
                text-align: center;
                margin: 10px 0;
            }
            .form-content{
                border: 1px #ccc solid;
                padding: 20px 10px 10px 10px;
            }
            .hotTable, .hotTable tr td { 
                border:1px solid #eee; 
            }
            .hotTable tr td:nth-child(odd){
                background: #eee;
                border-top: 1px #fff solid;
                border-bottom: 1px #fff solid;
            }
            .hotTable tr td{
                padding: 10px 0;
            }
            .hotTable {
                width: 100%;
                min-height: 25px; 
                line-height: 25px; 
                text-align: center; 
                border-collapse: collapse; 
            }   
            .hotPersonnelMes, .hotPersonnelMes tr td { 
                border:1px solid #fff; 
                background: #eee;
            }
            .hotPersonnelMes{
                width:70%;
                margin: auto;
                min-height: 25px; 
                line-height: 25px; 
                text-align: center; 
                border-collapse: collapse; 
            }
            .tableTitle span{
                margin-right: 20px;
                margin-bottom: 8px;
            }
            .seeFlowPath{
               position: absolute;
               width: 50%;
               left:30%;
               margin: auto;
               top: 30%;
               background: #fff;
               z-index: 333;
            }
            .flowTitle{
                padding: 15px;
                background: rgb(45, 114, 211);
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #fff;
            }
            .flowTitle i{
                font-size: 20px;;
            }
            .flowTitle i:hover{
                cursor: pointer;
            }
        }
        .printPreview{
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
            background: #fff;
            height: 100vh;
            overflow: auto;
            z-index: 666;
        }
    }
    @media print {
        .form-box{
            margin-top: 20px;
        }
        .bodyBox {
            width: 100%;
            height: 100%;
            margin: 20px 0;
            font-size: 12px;
        }
        .box-title{
            text-align: center;
            margin: 10px 0;
        }
        .form-content{
            border: 1px #ccc solid;
            padding: 20px 10px 10px 10px;
        }
        .hotTable, .hotTable tr td { 
            border:1px solid #eee; 
        }
        .hotTable tr td:nth-child(odd){
            background: #eee;
            -webkit-print-color-adjust: exact;
            border-top: 1px #fff solid;
            border-bottom: 1px #fff solid;
        }
        .hotTable tr td{
            padding: 10px 0;
        }
        .hotTable {
            width: 100%;
            min-height: 25px; 
            line-height: 25px; 
            text-align: center; 
            border-collapse: collapse; 
        }   
        .hotPersonnelMes, .hotPersonnelMes tr td { 
            border:1px solid #fff; 
            background: #eee;
            -webkit-print-color-adjust: exact;
        }
        .hotPersonnelMes{
            width:70%;
            margin: auto;
            min-height: 25px; 
            line-height: 25px; 
            text-align: center; 
            border-collapse: collapse; 
        }
        .tableTitle span{
            margin-right: 20px;
            margin-bottom: 8px;
        }
        .editTable td,.signTr td{
            background: #fff !important;
            -webkit-print-color-adjust: exact;
        }
        .editTable p,.signTr p{
            text-align: left;
            margin: 15px 40px;
        }
        .signTr p:last-child{
            text-align: right;
            margin: 15px 40px;
        }
        .editTable p input{
            width: 350px;
            border: none;
            border-bottom: 1px #ccc solid;
            outline:none
        }
        .signFrom{
            width: 150px;
            border: none;
            outline:none
        }
        .dateFrom{
            width: 50px;
            border: none;
            outline:none
        }
    }
</style>
<style>
     .tableTextarea textarea{
        border: none !important;
    }
</style>