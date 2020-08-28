<template>
    <div class="content">
        <div class="right-content">
            <div class="bodyBox">
                <div class="flowTitle">
                    <p> 打印预览</p>
                    <i class="el-icon-circle-close" @click="goBlackLIst"></i>
                </div>
                <div class="button-box">
                    <el-button size="mini" v-print="'#printBox'">打印</el-button>
                    <el-button size="mini" @click="goBlackLIst">关闭</el-button>
                </div>
                <div class="form-box"  ref="printDom" id="printBox">
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
                                <td colspan="5">同意</td>
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
                            <tr>
                                <td colspan="6">现场安全防护措施（划线部分可编辑）</td>
                            </tr>
                             <tr class="editTable">
                                <td colspan="6">
                                    <p>1.动火作业前，清理动火作业点10米范围内的易燃易爆物品；</p>
                                    <p>2.动火作业点现场配置<input type="text" v-text="name" />（灭火器材）；</p>
                                    <p>3.动火作业现场人员在作业前了解该部位的消防设施及疏散通道，熟悉火灾报警的程序和使用灭火器材的方法；</p>
                                    <p>4.动火作业现场人员在作业前对作业区域进行检查，确认符合动火作业的安全条件后，再开始作业；</p>
                                    <p>5.动火作业过程中，监火人全程监护动火现场；</p>
                                    <p>6.每日作业完毕后，及时清理现场，并监视现场至少30分钟，确认无残留火种再离开；</p>
                                    <p>7.其他安全防护措施：<input type="text" /></p>
                                </td>
                               
                            </tr>
                             <tr>
                                <td colspan="6">动火作业单位安全承诺</td>
                            </tr>
                             <tr class="signTr">
                                <td colspan="6"><p>1.严格遵守动火作业安全操作规程和其他各项安全规定。</p>
                                <p>2.发生火灾事故，依法承担相关责任。</p>
                                <p>动火作业负责人（签字/盖章）：<input class="signFrom" type="text" /><input class="dateFrom" type="text" />年<input class="dateFrom" type="text" />月<input class="dateFrom" type="text" />日</p></td>
                            </tr>
                       </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import OrgTree from '../../OrgTree'
import upload from '../../components/upload'
import {
  mapActions,
  mapMutations
} from 'vuex'
export default {
  name: 'printPreview',
  components: {
    OrgTree,
    upload
  },
  data() {
    return {
       name:""
    }
  },
  methods: {
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
        .right-content {
            font-size: 14px;
            padding: 0 10px;
            width: 100%;
            .bodyBox {
                width: 100%;
                height: 100%;
                // margin: 20px 0;
                font-size: 12px;
            }
            .box-title{
                text-align: center;
                margin: 20px 0;
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
            .editTable td,.signTr td{
                background: #fff !important;
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
            .button-box{
                background: rgb(223, 237, 245);
                padding: 8px 15px;
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
