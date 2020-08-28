<!--  -->
<!--  -->
<!-- 查询 -->
<template>
  <div class="Serarch-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>话筒MAC地址绑定</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small"
                     v-print="'#printJS_container'">打印</el-button>
          <el-button size="small"
                     @click="clonelist">关闭</el-button>
        </div>
      </div>
      <div class="top-box">
        <div class="print-container" id="printJS_container">
          <div class="form-box"
              style="margin-bottom:10px;">
            <div class="title">
              <span>话筒绑定MAC信息</span>
            </div>
            <div class="message-box">
              <div class="info-detail">
                <span>所属机构</span>
                <span>{{formData.orgName}}</span>
                <span>所属重点部位</span>
                <span>{{formData.keyPartName}}</span>
              </div>
              <div class="info-detail">
                <span>所属对讲平台</span>
                <span>{{formData.platformName}}</span>
                <span>对讲设备名称</span>
                <span>{{formData.name}}</span>
              </div>
              <div class="info-detail">
                <span>品牌</span>
                <span>{{formData.brand}}</span>
                <span>类型</span>
                <span>主机</span>
              </div>
              <div class="info-detail">
                <span>型号</span>
                <span>{{formData.modelNum}}</span>
                <span>话筒地址</span>
                <span>{{formData.ip}}</span>
              </div>
              <div class="info-detail">
                <span>话筒唯一ID</span>
                <span>{{formData.uniqueId}}</span>
                <span>话筒绑定MAC地址</span>
                <span>{{formData.mac}}</span>
              </div>
              <div class="info-detail">
                <span>资产编码</span>
                <span>{{formData.assetCode}}</span>
                <span>在线状态</span>
                <span>{{onlineStatus}}</span>
              </div>
            </div>
            <div class="creat-messages">
              <span>录入时间</span>
              <span>{{formData.updatedAt}}</span>
              <span>录入机构</span>
              <span>{{formData.updatedDept}}</span>
              <span>录入人</span>
              <span>{{formData.updatedBy}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AudioPaination from "../../../components/AudioPagination"
import {editHostListApi} from "../../../../../http/audioManage/talkback.api"
export default {
  name: '',
  components: {
    AudioPaination
  },
  props:["talklist"],
  data() {
    return {
      total: 0,
      formData: {
        // 表单数据
        orgName: '',
        keyPartName: '',
        brand: '',
        modelNum:"",
        name:'',
        ip: '',
        mac:'',
        keyPart: '', //所属重点部位
        uniqueId: '',
        type:"话筒"
      },
      activeCreate: true,
      activePrint: false,
      dropdownStatus: {
        detector: true
      },
      total: 0,
      status: '全部'
    }
  },
  methods: {
    clonelist(){
    this.$emit("closeList")
    },
    sizeChange(value) {},
    select(s, row) {
    console.log(s, row, '单选')
    },

    // 打印功能
    print(){
      
    },

  },
  created() {
     this.formData=this.talklist
  },
  computed: {
    onlineStatus () {
      if (this.formData.status == '1') {
        return '离线'
      } else if (this.formData.status == '2') {
        return '在线'
      } else {
        return '未知'
      }
    }
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
.Serarch-box {
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
        margin-top: 20px;
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
  #printJS_container {
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