<template>
  <div class="main">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>迁移</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="main-content">
      <div class="tab-content">
        <div class="left-tree-box">
          <div style="text-align:center;">迁移源</div>
          <div class="tree-box">
            <div v-for="item in migrantData" :key="item.id" :title="item.name" class="item">
              {{ item.name }}
            </div>
          </div>
          <!-- <div class="tree-box">
            <el-checkbox-group v-model="checkList" @change="checkedSource">
              <el-checkbox
                v-for="item in migrantData"
                :key="item.id"
                :label="item.id"
                style="display: block;margin: 10px 5px;"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div> -->
        </div>
        <div class="left-tree-box">
          <div style="text-align:center;">迁移目标</div>
          <div class="tree-box">
            <treeBox
              :lazyTreeApi="getTreeApi"
              searchType="filter"
              :treeType="treeType"
              @onceClick="onceClick"
              treeLazyToggle
              iconToggle
            ></treeBox>
          </div>
        </div>
      </div>
      <div class="form-footer" slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" style="margin-right:24px;" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import { fireInterface } from '@src/http/intelligentFire/equipmentManagement.js'
import treeBox from '@src/components/tree/treeBox'
import { mapState } from 'vuex'
export default {
  name: 'Move',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    migrantData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    treeBox
  },

  data() {
    return {
      treeType: 2,
      checkList: [],
      currentOrg: '',
      keyPartId: '',
      keyPartType: ''
    }
  },
  created() {},
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive', // 页面title
      sidebarActiveId: 'sidebarActiveId' // 页面类型id
    })
  },
  methods: {
    getTreeApi(params) {
      return getTreeApi(params)
    },
    cancel() {
      this.$confirm('确认取消正在编辑的内容吗？')
        .then(_ => {
          this.$emit('clickMoveShow', false)
        })
        .catch(_ => {})
    },
    onceClick(data) {
      if (data.tierType === 'org') {
        this.currentOrg = data.id.toString()
      } else {
        this.currentOrg = data.orgId
        this.keyPartId = data.id.toString()
        this.keyPartType = data.keyPartType
      }
    },
    // checkedSource(val) {
    //   console.log(val)
    //   this.checkList = this.$lodash.cloneDeep(val)
    // },
    save() {
      let _this = this
      if (this.migrantData && this.migrantData.length > 0 && this.keyPartId) {
        let funPromise = []
        this.migrantData.map(item => {
          let params = {
            id: item.id,
            orgId: this.currentOrg
          }
          if (this.keyPartId) {
            params['keyPartId'] = this.keyPartId
            params['keyPartType'] = this.keyPartType
          }
          console.log(params)
          let funChild = fireInterface.comBustibleUpDateHost(params)
          funPromise.push(funChild)
        })

        Promise.all(funPromise)
          .then(res => {
            this.checkList = []
            this.currentOrg = ''
            this.keyPartId = ''
            this.keyPartType = ''
            this.$notify.success({
              message: '迁移成功',
              title: '成功'
            })
            _this.$emit('clickMoveShow', false)
          })
          .catch(_ => {
            this.$notify.success({
              message: '迁移失败',
              title: '失败'
            })
          })
      } else if (!this.checkList && this.checkList.length === 0) {
        this.$notify.warning({
          message: '请选择迁移源',
          title: '警告'
        })
      } else {
        this.$notify.warning({
          message: '请选择迁目标',
          title: '警告'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .main-content {
    width: 800px;
    margin-top: 20px;
    text-align: center;
    .form-footer {
      margin-top: 20px;
    }
    .tab-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .left-tree-box {
        width: 48%;
        height: auto;
        margin-left: 10px;
      }
      .tree-box {
        height: 500px;
        text-align: left;
        border: 1px solid #e1e1e1;
        .item {
          width: 100%;
          height: 36px;
          padding-left: 10px;
          // border-bottom: 1px solid #e1e1e1;
          line-height: 36px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            background-color: #e5f0ff;
            border-left: 3px solid #2d72d3;
          }
        }
      }
    }
  }
}
</style>
