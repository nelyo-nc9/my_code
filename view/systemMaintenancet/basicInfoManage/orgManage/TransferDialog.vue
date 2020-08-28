<template>
  <div class="transfer-dialog">
    <!-- 机构管理-机构维护-迁移弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>基础信息</el-breadcrumb-item>
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>迁移</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="content-title">{{topTitle}}</div>
      <div class="content-main">
        <div class="content-main-left">
          <div class="main-left-title"><h3>迁移源信息</h3></div>
          <div class="main-div-content">
            <div class="content-label"><div class="orgLabel">机构名称</div><div class="orgText">{{name}}</div></div>
            <div class="content-label"><div class="orgLabel">机构代码</div><div class="orgText">{{serial}}</div></div>
            <div class="content-label"><div class="orgLabel">上级机构</div><div class="orgText">{{parentName}}</div></div>
            <div class="content-label"><div class="orgLabel">机构状态</div><div class="orgText">{{status}}</div></div>
            <div class="content-label"><div class="orgLabel">营业时间</div><div class="orgText">{{businessHours}}</div></div>
          </div>
        </div>
        <div class="content-main-left">
          <div class="main-left-title"><h3>选择迁移目标</h3></div>
            <orgTree ref="tree" :lazyTreeApi="getTreeApi"  :lazyTreeSearchApi="getLoadingTreeSearch" searchType="search" treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
          <div class="main-div-content">
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button size="small" @click="clickSave">保存</el-button>
      <el-button size="small" @click="clickClose">关闭</el-button>
    </div>
  </div>
</template>

<script>
import orgTree from '@src/components/tree/treeBox'
import { getTreeApi, getLoadingTreeSearchApi, orgMoveApi } from '@src/http/basicInfoManage/orgManage.api'
export default {
  name: 'TransferDialog',
  components: {
    orgTree
  },
  props: {
    componentTitle: {
      type: String,
      default: ''
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      topTitle: '机构迁移',
      parentId: '', // 迁移源机构的父节点id
      id: '', // 迁移源机构id
      name: '', // 迁移源机构名称
      serial: '', // 迁移源机构代码
      parentName: '', // 迁移源上级机构
      status: '', // 迁移源机构状态
      businessHours: '', // 迁移源营业时间
      goOrgSerial: '' // 迁移目标机构serial
    }
  },
  watch: {
    // id() {
    //   this.treeRefresh()
    // }
  },
  created() {
    this.topTitle = this.componentTitle
    this.getShowIndo()
  },
  methods: {
    getShowIndo() {
      console.log(this.editData, '6666666666666')
      let statusArr = ['', '正常营业', '撤销', '合并', '临时停业']
      this.parentId = this.editData.parentId
      this.id = this.editData.id
      this.name = this.editData.name
      this.serial = this.editData.serial
      this.parentName = this.editData.pid.name || ''
      this.status = statusArr[this.editData.status]
      this.businessHours = this.editData.businessHours
    },
    clickSave() {
      if (!this.goOrgSerial) {
        this.$messageWarn('选择迁移目标机构！')
        return
      }
      let idsArr = []
      idsArr[0] = this.id
      let param = {
        ids: idsArr,
        parentId: this.goOrgSerial,
        type: 1
      }
      orgMoveApi(param).then(res => {
        if (res.data.code === 0) {
          console.log('机构迁移成功')
          this.$messageSuccess('机构迁移成功！', '成功')
          this.$emit('orgTreeRefresh')
          this.clickClose()
        } else {
          console.log(res, '机构迁移失败')
          this.$messageError(`机构迁移失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError('机构迁移失败，请稍后重试！', '错误')
      })
    },
    clickClose() {
      this.$emit('defaultComponent')
    },
    getTreeApi(params) {
      // return getTreeApi(params)
      return new Promise((resolve, reject) => {
        getTreeApi(params).then(res => {
          if (res.data.code === 0) {
            // res.data.data.nodes = res.data.data.nodes.filter(item => {
            //   return item.serial !== this.parentId
            // })
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    getLoadingTreeSearch(params) { // 懒加载树搜索接口
      // return getLoadingTreeSearchApi(params)
      return new Promise((resolve, reject) => {
        getLoadingTreeSearchApi(params).then(res => {
          if (res.data.code === 0) {
            // res.data.data.nodes = res.data.data.nodes.filter(item => {
            //   return item.serial !== this.parentId
            // })
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    treeRefresh() { // 机构树刷新
      this.$refs.tree.refresh()
    },
    onceClick(data, node) {
      console.log(data, 'data')
      console.log(node, 'node')
      this.goOrgSerial = data.serial
    }
  }
}
</script>

<style lang="less" scoped>
.transfer-dialog {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    margin-bottom: 10px;
  }
  .content {
    width: 700px;
    border: 1px solid #ddd;
    margin: 20px;
    height: 650px;
    .content-title {
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      margin: 20px 0;
    }
    .content-main {
      display: flex;
      justify-content: center;
      .content-main-left {
        width: 300px;
        height: 500px;
        margin: 20px 5px;
        display: flex;
        flex-direction: column;
      }
      .main-left-title {
        height: 30px;
        line-height: 30px;
        background: #ccc;
        text-align: center;
      }
      .main-div-content {
        padding: 10px 20px;
        .content-label {
          margin: 20px 0px;
          // height: 30px;
          // line-height: 30px;
          font-size: 14px;
          div {
            display: inline-block;
            padding-left: 20px;
            vertical-align: top;
          }
          .orgText{
            width: 170px;
          }
        }
      }
    }
  }
  .footer {
    width: 700px;
    margin: 0 20px;
    display: flex;
    justify-content: center;
    .el-button {
      width: 80px;
    }
  }
}
</style>
