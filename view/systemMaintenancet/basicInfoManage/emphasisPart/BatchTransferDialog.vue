<template>
  <div class="key-part-transfer-dialog">
    <!-- 重点部位-批量迁移弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>基础信息</el-breadcrumb-item>
        <el-breadcrumb-item>重点部位</el-breadcrumb-item>
        <el-breadcrumb-item>{{ componentTitle }}</el-breadcrumb-item>
        <el-breadcrumb-item>迁移</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="content-title">{{ topTitle }}迁移</div>
      <div class="content-main">
        <div class="content-main-left">
          <div class="main-left-title"><h3>迁移源信息</h3></div>
          <div class="main-div-content">
            <div class="checkbox-search">
              <el-input
                placeholder="请输入内容"
                v-model="leftSearchVal"
                size="mini"
                :maxlength="255"
                @input="leftSearch"
              >
                <i class="el-icon-search el-input__icon" slot="suffix" style="cursor: pointer;" @click="leftSearch"></i>
              </el-input>
            </div>
            <el-checkbox-group v-model="checkedKeyPart">
              <div v-if="leftSearchVal">
                <div class="checkbox-list" v-for="item in searchKeyPartList" :key="item.id">
                  <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
                </div>
              </div>
              <div v-else>
                <div class="checkbox-list" v-for="item in keyPartList" :key="item.id">
                  <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div class="content-main-left">
          <div class="main-left-title"><h3>选择迁移目标</h3></div>
          <div class="main-div-content">
            <orgTree
              ref="tree"
              :lazyTreeApi="getTreeApi"
              :lazyTreeSearchApi="getLoadingTreeSearch"
              searchType="search"
              treeLazyToggle
              iconToggle
              @onceClick="onceClick"
            ></orgTree>
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
  name: 'BatchTransferDialog',
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
      topTitle: '待迁移部位',
      goOrgId: '', // 迁移目标机构id
      leftSearchVal: '', // 左侧搜索值
      checkedKeyPart: [], // 左侧框内重点部位的id数组
      keyPartList: [], // 左侧重点部位列表
      searchKeyPartList: [] // 左侧搜索重点部位列表
    }
  },
  watch: {
    // id() {
    //   this.treeRefresh()
    // }
  },
  created() {
    this.topTitle = this.componentTitle
    this.getCheckedList()
  },
  methods: {
    leftSearch() {
      // 左侧搜索
      this.searchKeyPartList = this.keyPartList.filter(item => {
        return item.name.indexOf(this.leftSearchVal) !== -1
      })
    },
    getCheckedList() {
      this.keyPartList = JSON.parse(JSON.stringify(this.editData.selectData))
    },
    clickSave() {
      if (!this.checkedKeyPart.length) {
        this.$messageWarn('选择迁移源！')
        return
      }
      if (!this.goOrgId) {
        this.$messageWarn('选择迁移目标机构！')
        return
      }
      let param = {
        ids: this.checkedKeyPart,
        parentId: this.goOrgId,
        type: 2
      }
      orgMoveApi(param)
        .then(res => {
          if (res.data.code === 0) {
            console.log('重点部位迁移成功')
            this.$messageSuccess('重点部位迁移成功！', '成功')
            this.clickClose()
          } else {
            console.log(res, '重点部位迁移失败')
            this.$messageError(`重点部位迁移失败，原因：${res.data.message}`, '错误')
          }
        })
        .catch(err => {
          console.log(err, 'err')
          this.$messageError('重点部位迁移失败，请稍后重试！', '错误')
        })
    },
    clickClose() {
      this.$emit('changeComponent', 'AwaitTransferPart', this.componentTitle)
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLoadingTreeSearch(params) {
      // 懒加载树搜索接口
      return getLoadingTreeSearchApi(params)
    },
    treeRefresh() {
      // 机构树刷新
      this.$refs.tree.refresh()
    },
    onceClick(data, node) {
      console.log(data, 'data')
      console.log(node, 'node')
      this.goOrgId = data.id
    }
  }
}
</script>

<style lang="less" scoped>
.key-part-transfer-dialog {
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
        padding: 0px 20px;
        .checkbox-search {
          padding: 5px;
        }
        .checkbox-list {
          padding: 5px 10px;
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
