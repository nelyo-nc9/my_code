<template>
  <div class="relevance-config-box">
    <div class="top">
      <!-- 面包屑 -->
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>视频管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{configType}}</el-breadcrumb-item>
          <el-breadcrumb-item>关联配置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 操作按钮 -->
      <div class="button-box">
        <el-button size="small" @click="goBackList">返回列表</el-button>
      </div>
    </div>
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="tabClick">
      <el-tab-pane v-for="(tab, index) in tabs" :key="tab.name + '_' + index" :label="tab.label" :name="tab.name">
        <div class="tab-content">
          <div class="transfer-box">
            <div class="tab-content">
              <div class="left-tree-box">
                <div style="text-align:center;">源</div>
                <div class="tree-box"></div>
              </div>
              <div class="icon-box">
                <i class="el-icon-right"></i>
                <i class="el-icon-back"></i>
              </div>
              <div style="flex:1">
                <div style="text-align:center;">目标</div>
                <div class="tree-box"></div>
              </div>
            </div>
            <div style="text-align:center;margin-top:24px">
              <el-button size="mini" type="primary">保存</el-button>
              <el-button size="mini" @click="cancel">取消</el-button>
            </div>
          </div>
          <div class="gplot"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'RelevanceConf',
  props: {
    configType: {
      type: String,
      required: true
    }
  },
  computed: {},
  data() {
    return {
      activeTabName: '',
      tabs: ''
    }
  },
  mounted() {
    if (this.configType === '摄像机关联配置') {
      this.activeTabName = '对讲通道'
      this.tabs = [
        {label: '对讲通道', name: '对讲通道'},
        {label: '门禁通道', name: '门禁通道'},
        {label: '输出通道', name: '输出通道'}
      ]
    } else {
      this.activeTabName = '镜头通道'
      this.tabs = [
        {label: '镜头通道', name: '镜头通道'},
        {label: '对讲通道', name: '对讲通道'},
        {label: '门禁通道', name: '门禁通道'},
        {label: '输出通道', name: '输出通道'}
      ]
    }
  },
  methods: {
    tabClick(value) {
      this.activeTabName = value.name
    },
    goBackList() {
      this.$emit('changeComponent', 'List')
    },
    cancel() {}
  }
}

</script>

<style lang='less' scoped>
.relevance-config-box {
  width: 100%;
  height: 100%;
  .header {
    margin-bottom: 10px;
  }
  .tab-content {
    width: 100%;
    height: 100%;
    display: flex;
    .transfer-box {
      width: 700px;
      height: 100%;
      padding: 10px;
      border: 1px solid #333;
        .tab-content {
          width: 100%;
          height: 100%;
          .left-tree-box {
            flex: 1;
          }
          .tree-box {
            height: 500px;
            border: 1px solid #E1E1E1;
          }
          .icon-box {
            width: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 26px;
            i {
              cursor: pointer;
            }
          }
        }
    }
    .gplot {
      width: calc(~'100% - 510px');
      margin-left: 10px;
      border: 1px solid #333;
    }
  }
}
</style>
