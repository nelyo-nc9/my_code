<template>
  <div class="org-manage-sync">
    <!-- 机构管理-机构维护-机构同步界面 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>基础信息</el-breadcrumb-item>
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>机构同步</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="content-box">
        <div class="content-box-title">新一代机构组件</div>
        <div class="content-box-main">
          <orgTree ref="leftTree" :lazyTreeApi="getLeftTreeApi" :lazyTreeCheckApi="getSyncTreeChild" :checkboxDisabled="checkboxDisabled" :lazyTreeSearchApi="getSyncTreeSearch" searchType="search" @clickData="clickData" treeLazyToggle iconToggle checkboxToggle></orgTree>
        </div>
      </div>
      <div class="content-button">
        <el-button size="small" @click="addBtn">添加</el-button>
        <el-button size="small" @click="delBtn">删除</el-button>
        <!-- <el-button size="small" @click="allAddBtn">全部添加</el-button> -->
        <el-button size="small" @click="allDelBtn">全部删除</el-button>
      </div>
      <div class="content-box">
        <div class="content-box-title">安防物联管理平台</div>
        <div class="content-box-main">
          <div class="checkbox-search">
            <el-input placeholder="请输入内容" v-model="rightSearchVal" size="mini" :maxlength="255" @input="rightSearch">
              <i class="el-icon-search el-input__icon" slot="suffix" style="cursor: pointer;" @click="rightSearch"></i>
            </el-input>
          </div>
          <el-checkbox-group v-model="checkedSyncOrg" @change="changeSyncOrg">
            <div v-if="rightSearchVal">
              <div class="checkbox-list" v-for="item in searchSyncOrgList" :key="item.serial">
                <el-checkbox :label="item.serial">{{item.name}}</el-checkbox>
              </div>
            </div>
            <div v-else>
              <div class="checkbox-list" v-for="item in syncOrgList" :key="item.serial">
                <el-checkbox :label="item.serial">{{item.name}}</el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <div class="content-right">
        <!-- <el-checkbox v-model="syncInfo">与机构员工同步基本信息</el-checkbox>
        <el-checkbox v-model="syncLevel">与机构员工同步机构级别</el-checkbox>
        <el-checkbox v-model="syncRelation">与机构员工同步层级关系</el-checkbox> -->
      </div>
    </div>
    <div class="footer">
      <el-button size="small" @click="clickSave">保存</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import orgTree from '@src/components/tree/treeBox'
import { getTreeApi, orgSyncApi, getSynchronizedApi, getSyncTreeApi, getSyncTreeChildApi, getSyncTreeSearchApi } from '@src/http/basicInfoManage/orgManage.api'

export default {
  name: 'SyncOrg',
  components: {
    orgTree
  },
  data() {
    return {
      // syncInfo: false,
      // syncLevel: false,
      // syncRelation: false
      oids: [],
      searchSyncOrgList: [], // 右侧框内同步机构复选框列表(有搜索时)
      syncOrgList: [], // 右侧框内同步机构复选框列表
      checkedSyncOrg: [], // 右侧框内同步机构的serial数组
      rightSearchVal: '', // 右侧搜索值
      checkboxDisabled: { // 左侧机构树复选框禁用项
        type: 'nodeKey',
        data: []
      },
      initSyncOrg: [], // 建行已经同步的机构nodeKey数组
      rightChecked: [] // 右侧树选中项
    }
  },
  created() {
    this.getSynchronized()
  },
  methods: {
    rightSearch() { // 右侧搜索
      this.searchSyncOrgList = this.syncOrgList.filter(item => {
        return item.name.indexOf(this.rightSearchVal) !== -1
      })
    },
    addBtn() { // 添加
      let oidArr = this.$refs.leftTree.getCheckedNodes() // 获取左边树选中的节点数组
      console.log(oidArr, 'oidArr')
      if (oidArr.length === 0) {
        this.$messageWarn('请选择机构！')
        return
      }
      oidArr.forEach(item => {
        let hasId = false
        this.syncOrgList.forEach(ite => {
          if (item.serial === ite.serial) {
            hasId = true
          }
        })
        if (!hasId) {
          this.syncOrgList.push(item)
        }
      })
      let checkNodeKey = []
      this.syncOrgList.forEach(item => {
        checkNodeKey.push(item.nodeKey)
      })
      this.checkboxDisabled.data = [
        ...this.initSyncOrg,
        ...checkNodeKey
      ]
      this.$refs.leftTree.setCheckedKeys([]) // 左侧机构树清空选中项
      if (this.rightSearchVal) {
        this.rightSearch()
      }
    },
    delBtn() {
      if (this.rightChecked.length === 0) {
        this.$messageWarn('请选择机构！')
        return
      }
      this.rightChecked.forEach(item => {
        this.syncOrgList.forEach((it, index) => {
          if (item === it.serial) {
            this.syncOrgList.splice(index, 1)
          }
        })
      })
      this.checkedSyncOrg = [] // 左侧选中项清空
      this.rightChecked = []
      let checkNodeKey = []
      this.syncOrgList.forEach(item => {
        checkNodeKey.push(item.nodeKey)
      })
      this.checkboxDisabled.data = [
        ...this.initSyncOrg,
        ...checkNodeKey
      ]
      if (this.rightSearchVal) {
        this.rightSearch()
      }
    },
    allAddBtn() { // 全部添加
      let param = {
        type: 1
      }
      getSynchronizedApi(param).then(res => {
        console.log(res, '获取建行未同步的所有机构')
        if (res.data.code === 0) {
          this.checkboxDisabled.data = [
            ...res.data.data.serialKeys,
            ...this.initSyncOrg
          ]
          res.data.data.orgList.forEach(item => {
            let hasId = false
            this.syncOrgList.forEach(ite => {
              if (item.serial === ite.serial) {
                hasId = true
              }
            })
            if (!hasId) {
              this.syncOrgList.push(item)
            }
          })
          this.$refs.leftTree.setCheckedKeys([])
          if (this.rightSearchVal) {
            this.rightSearch()
          }
        } else {
          console.log(res, '获取建行未同步的所有机构失败')
        }
      }).catch(err => {
        console.log(err, '获取建行未同步的所有机构失败')
      })
    },
    allDelBtn() { // 全部删除
      if (this.syncOrgList.length === 0) {
        this.$messageWarn('请添加机构！')
        return
      }
      this.checkedSyncOrg = []
      this.rightChecked = []
      this.syncOrgList = []
      this.checkboxDisabled.data = [
        ...this.initSyncOrg
      ]
      if (this.rightSearchVal) {
        this.rightSearch()
      }
    },
    changeSyncOrg(val) { // 右侧框内同步机构复选框改变
      console.log(val, '99999999999999999')
      this.rightChecked = val
    },
    cancel() {
      this.$emit('changeComponent', 'OrgVindicate', '机构维护')
    },
    getLeftTreeApi(params) {
      return getSyncTreeApi(params) // 获取新一代机构树的接口(包括未同步的机构)
    },
    getRightTreeApi(params) {
      return getTreeApi(params)
    },
    getSyncTreeChild(params) { // 建行机构树获取递归获取子节点， 复选框使用
      return getSyncTreeChildApi(params)
    },
    getSyncTreeSearch(params) { // 建行机构树模糊查询
      return getSyncTreeSearchApi(params)
    },
    clickSave() {
      if (this.syncOrgList === 0) { return }
      let checkNodeKey = []
      this.syncOrgList.forEach(item => {
        if (!item.children || item.children.length === 0) { // 去掉父节点
          checkNodeKey.push(item.nodeKey)
        }
      })
      this.$refs.leftTree.setCheckedKeys(checkNodeKey)
      let oidArr = this.$refs.leftTree.getCheckedNodes(false, true) // 获取全选和半选的机构
      this.$refs.leftTree.setCheckedKeys([])
      let sOArr = []
      oidArr.forEach(item => {
        sOArr.push(item.serial)
      })
      let param = {
        type: 1, // 1-机构同步
        oids: sOArr
      }
      console.log(param)
      orgSyncApi(param).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          console.log('同步成功')
          this.$emit('orgTreeRefresh')
          this.$messageSuccess('机构同步成功！', '成功')
          this.cancel()
        } else {
          console.log(res, '机构同步失败')
          this.$messageError(`机构同步失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err)
        this.$messageError('机构同步失败，请稍后重试！', '错误')
      })
    },
    clickData(data) { // 机构树加载节点信息
      console.log('clickData', data)
    },
    getSynchronized() { // 获取建行已同步机构
      getSynchronizedApi().then(res => {
        console.log(res, '获取建行已同步机构')
        if (res.data.code === 0) {
          this.checkboxDisabled.data = res.data.data.serialKeys
          this.initSyncOrg = JSON.parse(JSON.stringify(res.data.data.serialKeys))
        } else {
          console.log(res, '获取建行已同步机构失败')
        }
      }).catch(err => {
        console.log(err, '获取建行已同步机构失败')
      })
    }
  }
}

</script>

<style lang="less" scoped>
.org-manage-sync {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .header {
    margin-bottom: 10px;
  }
  .content {
    display: flex;
    padding: 20px 50px;
    .content-box {
      width: 440px;
      height: 700px;
      border: 1px solid #000;
      .content-box-title {
        background: #2D72D3;
        text-align: center;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
      }
      .content-box-main {
        height: calc(~'100% - 30px');
        overflow-y: auto;
        .checkbox-search {
          padding: 5px;
        }
        .checkbox-list {
          padding: 5px 10px;
        }
      }
    }
    .content-button {
      width: 200px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .el-button {
        margin: 10px;
      }
    }
    .content-right {
      padding: 50px 20px;
      display: flex;
      flex-direction: column;
    }
  }
  .footer {
    width: 800px;
    margin: 0 50px;
    text-align: center;
    .el-button {
      width: 80px;
    }
  }
}

</style>
