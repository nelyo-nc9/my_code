<template>
  <div class="content">
    <div class="left-tree no-print">
      <OrgTree></OrgTree>
    </div>
    <div class="right-content">
      <div class="top-box no-print">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>消防评估</el-breadcrumb-item>
            <el-breadcrumb-item>消防评估配置</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="mini" @click="printing()">打印</el-button>
          <el-button size="mini">导出</el-button>
        </div>
      </div>
      <div class="report-box">
        <div class="print" ref="prints">
            <div class="print-title">消防评估配置表</div>
            <el-table :data="tableData" style="width: 100%;margin-bottom:50px;" :span-method="arraySpanMethod">
              <el-table-column align="center" :label="`所属机构: ${affiliatedInstitutions}`" width="150">
                <el-table-column align="center" prop="classIfy" label="分类"></el-table-column>
                <el-table-column align="center" prop="catalog" label="目录"></el-table-column>
                <el-table-column align="center" prop="content" label="内容"></el-table-column>
                <el-table-column align="center" prop="score" label="分项分值(分)"></el-table-column>
                <el-table-column align="center" prop="weight" label="权重"></el-table-column>
              </el-table-column>
            </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import OrgTree from '../../../OrgTree'
    import {
        mapActions,
        mapMutations
    } from 'vuex'

    export default {
        components: {
            OrgTree
        },
        data() {
            return {
              affiliatedInstitutions: '保定分行',
              formData: {
                    
              },
              tableData: [{
                classIfy: '基础信息(40分）',
                catalog: '基础',
                content: '单位名称，位置，类型',
                score: '0',
                weight: '0.5'
              },
              {
                classIfy: '基础信息(40分）',
                catalog: '基础',
                content: '时间约束：消防审核合格，通过验收',
                score: '0',
                weight: '0.5'
              },
              {
                classIfy: '基础信息(40分）',
                catalog: '基础',
                content: '上一年基本情况火灾次数，奖惩记录',
                score: '0',
                weight: '0.5'
              },
              {
                classIfy: '基础信息(40分）',
                catalog: '建筑',
                content: '建筑：面积，楼层（地上地下）及面积',
                score: '0',
                weight: '0.5'
              },{
                classIfy: '基础信息(40分）',
                catalog: '建筑',
                content: '建筑：房间功能',
                score: '0',
                weight: '0.5'
              },{
                classIfy: '基础信息(40分）',
                catalog: '建筑',
                content: '特殊场合：儿童游乐，机房，化工产品',
                score: '0',
                weight: '0.5'
              },{
                classIfy: '基础信息(40分）',
                catalog: '设备',
                content: '消防系统：火灾报警，消防炮、自动喷水灭火，防排烟，防火分隔，气体，泡沫，应急照明和疏散，灭火器，消火栓',
                score: '0',
                weight: '0.5'
              },{
                classIfy: '基础信息(40分）',
                catalog: '基础',
                content: '单位名称，位置，类型',
                score: '0',
                weight: '0.5'
              },{
                classIfy: '基础信息(40分）',
                catalog: '基础',
                content: '单位名称，位置，类型',
                score: '0',
                weight: '0.5'
              },{
                classIfy: '基础信息(40分）',
                catalog: '基础',
                content: '单位名称，位置，类型',
                score: '0',
                weight: '0.5'
              }]
            }
        },
        created() {
          console.log(this.$print)
        },
        methods: {
          //编辑表格行与列的合并
          arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
              if(columnIndex === 0) {
                return {
                  rowspan: 7,
                  colspan: 1
                };
              }else if(columnIndex === 1 || columnIndex === 4){
                return {
                  rowspan: 3,
                  colspan: 1
                };
              }
            }else if(rowIndex === 1){
              if(columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }else if(rowIndex === 2){
              if(columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }else if(rowIndex === 3){
              if(columnIndex === 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }else if(columnIndex === 1 || columnIndex === 4){
                return {
                  rowspan: 3,
                  colspan: 1
                };
              }
            }else if(rowIndex === 4){
              if(columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }else if(rowIndex === 5){
              if(columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }else if(rowIndex === 6){
              if(columnIndex === 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          },
          //打印
          async printing() {
            await this.$nextTick(() => {
              this.$print(this.$refs.prints)
            })
          }       
        },
        mounted() {
            
        }
    }
</script>

<style lang="less" scoped>
    .content {
        width: 100%;
        // height: 100%;
        display: flex;
        .left-tree {
            width: 240px;
            border-right: 1px solid #e1e1e1;
        }
        .right-content {
            font-size: 14px;
            padding: 10px 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            .top-box {
              .button-box {
                  margin: 12px 0;
              }
            }
            .report-box{
              width: 100%;
              .print-title{
                text-align: center;
                line-height:60px;
                font-size:24px;
              }
            }
        }
    }
</style>
<style lang="less">
    .content {
        .right-content {
            .form-box {
                .left-form,
                .right-form {
                    .el-form-item--mini.el-form-item {
                        margin-bottom: 0;
                    }
                    .el-form-item__label {
                        border: 1px solid #fff;
                        background: #f2f2f2;
                    }
                }
            }
        }
    }
</style>