<template>
  <div class="print-dialog">
    <!-- 机构管理-机构维护-打印弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>基础信息</el-breadcrumb-item>
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>打印</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content" id="printJS-org-info">
      <div class="content-title">{{componentTitle}}</div>
      <div class="content-table">
        <table cellspacing="0" cellpadding="0">
          <tr>
            <td class="cell-title">机构编号</td>
            <td class="cell-text">{{serial}}</td>
            <td class="cell-title">机构中文简称</td>
            <td class="cell-text">{{name}}</td>
          </tr>
          <tr>
            <td class="cell-title">机构类别</td>
            <td class="cell-text">{{kindName}}</td>
            <td class="cell-title">固定电话</td>
            <td class="cell-text">{{telephone}}</td>
          </tr>
          <tr>
            <td class="cell-title">移动电话</td>
            <td class="cell-text">{{mobile}}</td>
            <td class="cell-title">电子邮件</td>
            <td class="cell-text">{{email}}</td>
          </tr>
          <tr>
            <td class="cell-title">机构地址</td>
            <td class="cell-text" colspan="3">{{address}}</td>
          </tr>
          <tr>
            <td class="cell-title">机构状态</td>
            <td class="cell-text">{{status}}</td>
            <td class="cell-title">开始营业时间</td>
            <td class="cell-text">{{businessHours}}</td>
          </tr>
            <tr>
            <td class="cell-title">开业日期</td>
            <td class="cell-text">{{startBusiness}}</td>
            <td class="cell-title">关闭日期</td>
            <td class="cell-text">{{closeBusiness}}</td>
          </tr>
          <tr>
            <td class="cell-title">机构负责人名称</td>
            <td class="cell-text">{{functionary}}</td>
            <td class="cell-title">上级机构名称</td>
            <td class="cell-text">{{parentName}}</td>
          </tr>
          <tr>
            <td class="cell-title">上级机构编码</td>
            <td class="cell-text">{{parentSerial}}</td>
            <td class="cell-title"></td>
            <td class="cell-text"></td>
          </tr>
        </table>
      </div>
      <div class="content-bottom">
        <table cellspacing="0" cellpadding="0">
          <tr>
            <td class="cell-title">录入时间</td>
            <td class="cell-text">{{orgCreateTime}}</td>
            <td class="cell-title">录入机构</td>
            <td class="cell-text">{{updatedDept}}</td>
            <td class="cell-title">录入人</td>
            <td class="cell-text">{{updatedBy}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="footer">
      <el-button size="small" @click="clickPrint">打印</el-button>
      <el-button size="small" @click="clickClose">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrintDialog',
  props: {
    componentTitle: {
      type: String,
      default: ''
    },
    nodeData: {
      type: Object,
      default: () => {}
    },
    parentData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      serial: '',
      name: '',
      kindName: '',
      telephone: '',
      mobile: '',
      email: '',
      address: '',
      status: '',
      businessHours: '',
      startBusiness: '',
      closeBusiness: '',
      functionary: '',
      parentName: '',
      parentSerial: '',
      id: '',
      orgCreateTime: '',
      updatedDept: '',
      updatedBy: ''
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() { // 请求表格数据方法
      let cpNode = JSON.parse(JSON.stringify(this.nodeData))
      let cpParent = JSON.parse(JSON.stringify(this.parentData))
      let statusArr = ['', '正常营业', '撤销', '合并', '临时停业']
      let kindArr = ['', '总行', '一级分行', '二级分行', '直管行', '县级行', '园区']
      this.serial = cpNode.serial
      this.name = cpNode.name
      this.kindName = kindArr[cpNode.kind] || ''
      this.telephone = cpNode.telephone
      this.mobile = cpNode.mobile
      this.email = cpNode.email
      this.address = cpNode.address
      this.status = statusArr[cpNode.status]
      this.businessHours = cpNode.businessHours
      this.startBusiness = cpNode.startBusiness
      this.closeBusiness = cpNode.closeBusiness
      this.functionary = cpNode.functionary
      this.parentName = cpParent.name || ''
      this.parentSerial = cpParent.serial || ''
      this.id = cpNode.id
      this.orgCreateTime = cpNode.orgCreateTime
      this.updatedDept = cpNode.updatedDept
      this.updatedBy = cpNode.updatedBy
      this.isCcbOrg = cpNode.type ? (cpNode.type === 0) : true
      console.log(this.nodeData, 'this.nodeData999999999999999999999')
    },
    clickPrint() {
      printJS({
        printable: 'printJS-org-info',
        type: 'html',
        targetStyles: ['*']
      })
    },
    clickClose() {
      this.$emit('defaultComponent')
    }
  }
}
</script>

<style lang="less" scoped>
.print-dialog {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .header {
    margin-bottom: 10px;
  }
  .content {
    width: 800px;
    border: 1px solid #ddd;
    padding: 30px 20px 40px 20px;
    .content-title {
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-size: 18px;
    }
    .content-table {
      border: 1px solid #ddd;
      padding: 1px;
      width: 100%;
      table {
        width: 100%;
        height: 100%;
        tr {
          .cell-title {
            height: 36px;
            width: 15%;
            background: #eee;
            text-align: center;
            border: 0.5px solid #ddd;
          }
          .cell-text {
            width: 35%;
            height: 36px;
            border: 0.5px solid #ddd;
            padding: 0 5px;
          }
        }
      }
    }
    .content-bottom {
      border: 1px solid #ddd;
      padding: 1px;
      width: 100%;
      margin-top: 10px;
      table {
        width: 100%;
        height: 100%;
        tr {
          .cell-title {
            height: 36px;
            width: 10%;
            background: #eee;
            text-align: center;
            border: 0.5px solid #ddd;
          }
          .cell-text {
            width: 23.3%;
            height: 36px;
            border: 0.5px solid #ddd;
            padding: 0 5px;
          }
        }
      }
    }
  }
  .footer {
    width: 700px;
    margin: 20px;
    display: flex;
    justify-content: center;
    .el-button {
      width: 80px;
    }
  }
}
</style>
