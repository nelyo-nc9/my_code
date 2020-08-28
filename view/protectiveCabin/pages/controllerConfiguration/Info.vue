<template>
  <div class="info-box">
    <!-- 中间树 -->
    <div class="info-tree">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="filter"
               :treeType="treeType"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle></treeBox>
    </div>
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
            <el-breadcrumb-item>防护舱设备配置</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small"
                     v-print="'#contentinfo'">打印</el-button>
          <el-button size="small"
                     @click="goBack">关闭</el-button>
        </div>
      </div>
      <div id='contentinfo'>
        <!-- 新建预览表单 -->
        <div class="form-box"
             style="margin-bottom:10px;">
          <div class="title">
            <span>防护舱主机设备</span>
          </div>
          <div class="message-box">
            <div class="info-detail">
              <span>防护舱主机名称</span>
              <span>{{deviceModel.name}}</span>
              <span>资产编码</span>
              <span>{{deviceModel.assetCode}}</span>
            </div>
            <div class="info-detail">
              <span>所属机构</span>
              <span>{{deviceModel.orgName}}</span>
              <span>所属重点部位</span>
              <span>{{deviceModel.keyPartName}}</span>
            </div>
            <div class="info-detail">
              <span>设备序列号</span>
              <span>{{deviceModel.deviceSerise}}</span>
              <span>接入服务器</span>
              <span>{{deviceModel.accessService}}</span>
            </div>
            <div class="info-detail">
              <span>IP地址</span>
              <span>{{deviceModel.ip}}</span>
              <span>端口</span>
              <span>{{deviceModel.port}}</span>
            </div>
            <div class="info-detail">
              <span>品牌</span>
              <span>{{deviceModel.brand}}</span>
              <span>型号</span>
              <span>{{deviceModel.modelNum}}</span>
            </div>
            <div class="info-detail">
              <span>用户名</span>
              <span>{{deviceModel.username}}</span>
              <span>密码</span>
              <span>{{deviceModel.password}}</span>
            </div>
            <div class="info-detail">
              <span>防护舱通道数量</span>
              <span>{{deviceModel.cabinNumber}}</span>
              <span>报警输入数量</span>
              <span>{{deviceModel.inputNumber}}</span>
            </div>
            <div class="info-detail">
              <span>报警输出数量</span>
              <span>{{deviceModel.inputNumber}}</span>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
            </div>
          </div>
          <div class="creat-messages">
            <span>录入时间</span>
            <span>{{deviceModel.updatedAt}}</span>
            <span>录入机构</span>
            <span>{{deviceModel.updatedDept}}</span>
            <span>录入人</span>
            <span>{{deviceModel.updatedBy}}</span>
          </div>
        </div>
        <!-- 底部Tab -->
        <table-result :showOptIcon="showOptIcon"
                      :devInfo="deviceData"
                      :id="deviceModel.id"
                      :deviceName="deviceModel.name"
                      source="info"></table-result>
      </div>
    </div>
  </div>
</template>

<script>
import TableResult from './TableResult'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
// import { DEVICETYPE, TRANSPORTPROTOCOLS } from '../../../components/selectConf'
export default {
  name: 'Info',
  components: {
    TableResult,
    treeBox,
  },
  props: {
    deviceData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    console.log(this.deviceData)
  },
  data() {
    return {
      deviceModel: this.deviceData,
      showOptIcon: false,
      treeType: 2,
    }
  },
  methods: {
    goBack() {
      this.$parent.$parent.childrenComponent = 'EquipmentList'
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick() {},
  },
}
</script>

<style lang="less" scoped>
.info-box {
  width: 100%;
  height: 100%;
  display: flex;
  .info-tree {
    width: 280px;
    height: 100%;
  }
  .content {
    width: calc(~'100% - 280px');
    height: 100%;
    padding-left: 10px;
    .top {
      .header {
        color: #333333;
        margin: 23px 0;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2d72d3;
            }
          }
        }
      }
    }
    #contentinfo {
      height: calc(~'100% - 70px');
      overflow: auto;
    }
    .form-box {
      width: 1000px;
      margin-bottom: 40px;
      .title {
        width: 100%;
        text-align: center;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .message-box {
        border: 1px solid #e1e1e1;
        border-bottom: none;
        margin-top: 12px;
        margin-bottom: 25px;
        .info-detail {
          width: 100%;
          display: flex;
          height: 35px;
          border-bottom: 1px solid #e1e1e1;
          span {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            display: inline-block;
            line-height: 34px;
          }
          span:nth-child(odd) {
            width: 152px;
            height: 100%;
            background: #f5f5f5;
            padding-left: 34px;
            box-sizing: border-box;
          }
          span:nth-child(even) {
            width: 329px;
            height: 100%;
            background: #fff;
            padding-left: 32px;
            box-sizing: border-box;
          }
        }
      }
      .creat-messages {
        width: 1000px;
        height: 35px;
        border: 1px solid rgba(225, 225, 225, 1);
        display: flex;
        margin-bottom: 30px;
        span:nth-child(odd) {
          width: 155px;
          height: 100%;
          background: rgba(245, 245, 245, 1);
          text-align: center;
          line-height: 35px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
        }
        span:nth-child(even) {
          width: 170px;
          height: 100%;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
          line-height: 35px;
          text-align: center;
        }
      }
    }
  }
}
</style>
<style lang="less">
@media print {
  #contentinfo {
    height: calc(~'100% - 70px');
    overflow: auto;
    .form-box {
      width: 1000px;
      margin-bottom: 40px;
      .title {
        width: 100%;
        text-align: center;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .message-box {
        border: 1px solid #e1e1e1;
        border-bottom: none;
        margin-top: 12px;
        margin-bottom: 25px;
        .info-detail {
          width: 100%;
          display: flex;
          height: 35px;
          border-bottom: 1px solid #e1e1e1;
          span {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            display: inline-block;
            line-height: 34px;
          }
          span:nth-child(odd) {
            width: 152px;
            height: 100%;
            background: #f5f5f5;
            padding-left: 34px;
            box-sizing: border-box;
          }
          span:nth-child(even) {
            width: 329px;
            height: 100%;
            background: #fff;
            padding-left: 32px;
            box-sizing: border-box;
          }
        }
      }
      .creat-messages {
        width: 1000px;
        height: 35px;
        border: 1px solid rgba(225, 225, 225, 1);
        display: flex;
        margin-bottom: 30px;
        span:nth-child(odd) {
          width: 155px;
          height: 100%;
          background: rgba(245, 245, 245, 1);
          text-align: center;
          line-height: 35px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
        }
        span:nth-child(even) {
          width: 170px;
          height: 100%;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
          line-height: 35px;
          text-align: center;
        }
      }
    }
  }
}
</style>
