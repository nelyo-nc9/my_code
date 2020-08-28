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
                        <el-breadcrumb-item>维保管理</el-breadcrumb-item>
                        <el-breadcrumb-item>维保任务管理</el-breadcrumb-item>
                        <el-breadcrumb-item>服务评价</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
            </div>
            <div class="bodyBox">
                <div class="form-box">
                    <div class="form-content">
                        <el-divider content-position="left">维保服务评价</el-divider>
                        <div class="tableBoxCon">
                          <el-table :data="tableData" border size="mini" stripe>
                          <el-table-column
                                v-for="item in tableColumn"
                                :key="item.label"
                                :prop="item.prop"
                                :label="item.label"
                                :width="item.width"
                                show-overflow-tooltip
                              ></el-table-column>
                          </el-table>
                        </div>
                        <div class="evaluateBox">
                          <div class="evaCon">
                            <div class="block">
                              <span class="demonstration">评分：</span>
                              <el-rate v-model="rateVal"></el-rate>
                            </div>
                            <div class="evaRule" @click="evaRule">评分规则</div>
                          </div>
                          <div class="evaOrLable">
                            <div class="evaTag">
                              <label>标签：</label>
                              <div>
                                <el-checkbox-group v-model="checkboxGroup" class="lableGroup">
                                  <el-checkbox-button v-for="(item,index) in evaLableList" :label="item.id" :key="index">{{item.value}}</el-checkbox-button>
                                </el-checkbox-group>
                              </div>
                            </div>
                            <div class="evaText">
                               <label>评价：</label>
                               <el-input
                                  type="textarea"
                                  placeholder="输入评价内容(选填)"
                                  v-model="evaContent"
                                  maxlength="100"
                                  rows="4"
                                  show-word-limit
                                >
                                </el-input>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="form-footer">
                        <el-button size="mini"  @click="goBlackLIst">返回</el-button>
                        <el-button size="mini" type="primary" @click="submitToList">提交</el-button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import OrgTree from '../../OrgTree'
import {
  mapActions,
  mapMutations
} from 'vuex'

export default {
  name: 'serviceEvaluation',
  components: {
    OrgTree,
  },
  data() {
    return {
      tableColumn: [
        // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构'
        }, {
          prop: 'keySite',
          label: '所属重点部位'
        }, {
          prop: 'deviceType',
          label: '维保任务名称'
        }, {
          prop: 'deviceName',
          label: '维保任务内容'
        }, {
          prop: 'code',
          label: '完成时间点'
        }, {
          prop: 'brand',
          label: '维保人员'
        }, {
          prop: 'deviceModel',
          label: '联系电话'
        }, {
          prop: 'netModuleBrand',
          label: '任务状态'
        }, {
          prop: 'netModuleModel',
          label: '维保状态'
        }
      ],
      tableData: [
        {
          orgName: '保定分行',
          keySite: '汇融支行营业网点',
          deviceType: '每月维保任务',
          deviceName: '火警报警主机和水系统巡查检测',
          code: '2020-05-12',
          brand: '张三',
          deviceModel: '157271627162',
          netModuleBrand: '进行中',
          netModuleModel: '服务中'
        }
      ],
      rateVal:"",
      checkboxGroup:[],
      evaContent:"",
      evaLableList:[
        {
        id:1,
        value:'技术较好'
      },
      {
        id:2,
        value:'有责任心态度好'
      },
      {
        id:3,
        value:'检查仔细'
      },
      {
        id:4,
        value:'有责任心态度好'
      },
      {
        id:5,
        value:'技术较好'
      },
      {
        id:6,
        value:'检查仔细'
      },
      {
        id:7,
        value:'技术较好'
      },
      {
        id:8,
        value:'技术较好'
      }]
    }
  },
  created() {
  },
  methods: {
    ...mapActions(['addAlarmHost']),
    // 提交操作
    submitToList() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          console.log(11111111)
        }
      })
      this.addAlarmHost(this.formData).then(res => {
        console.log(res, '添加报警主机:addAlarmHost')
        this.$emit("closeAddOrEditBox");
        this.$notify.success({
          title: '成功',
          message: '添加成功'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    //返回列表
    goBlackLIst(){
        // this.SET_COMPONENT_ID('hotWorkList')
        this.$emit("closeModelBox");
    },
    //评分操作
    evaRule(){
      var str = '<p class="ruleText">1-2星“服务很糟糕” ： 差</p><p class="ruleText">3星“服务一般” ： 良</p><p class="ruleText">4-5星“服务优秀” ：优</p>'
      this.$alert(str, '评分规则', {
          showConfirmButton:false,
          dangerouslyUseHTMLString:true
        });
    },
    //父组件调用的方法
    parentPropMethods(row,type){

    }
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
            border-right: 1px solid #e1e1e1;
        }
        .right-content {
            font-size: 14px;
            padding: 0 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            .top-box {
                .button-box {
                    margin: 18px 0;
                }
            }
            .bodyBox {
                width: 100%;
                height: 100%;
                display: flex;
                font-size: 12px;
                .form-box {
                    // border: 1px solid #f2f2f2;
                    flex: 1;
                    overflow-y: auto;
                    .form-content {
                        width: 100%;
                        padding: 10px;
                        font-size: 12px;
                    }
                    .form-footer {
                        margin-top: 12px;
                        width: 100%;
                        text-align: center;
                    }
                    .tableBoxCon,.evaluateBox{
                      border: 1px #ccc solid;
                      padding: 20px;
                      margin-bottom: 15px;
                    }
                    .evaCon{
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    }
                    .block{
                      display: flex;
                      align-items: center;
                      justify-content: start;
                    }
                    .evaRule{
                      padding: 3px 8px;
                      border: 1px #ccc solid;
                    }
                    .evaRule:hover{
                      cursor: pointer;
                    }
                    .evaOrLable{
                      display: flex;
                      align-items: center;
                      margin-top: 20px;
                    }
                    .evaTag,.evaText{
                      width: 50%;
                      display: flex;
                      align-items: center;
                    }
                     .evaTag div,.evaText div{
                        width: 90%;
                     }
                     .demonstration,.evaOrLable label{
                       margin-right: 8px;
                     }
                }
            }
        }
    }
</style>
<style>
  .lableGroup .el-checkbox-button .el-checkbox-button__inner{
    display: block;
    margin-right: 8px;
    margin-bottom: 8px;
    position: relative;
    border: 1px rgb(0, 120, 215) solid;
    border-radius: 0;
  }
  .ruleText{
      text-align: center;
  }
</style>