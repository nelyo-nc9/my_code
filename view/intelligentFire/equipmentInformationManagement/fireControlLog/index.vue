<template>
  <div class="alarm-main">
    <div class="right-content" style="max-width:100%;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="报警日志" name="first"></el-tab-pane>
        <el-tab-pane label="操作日志" name="second"></el-tab-pane>
      </el-tabs>
      <component :is="componentId"></component>
    </div>
  </div>
</template>

<script>
import fireFightingSubsystemManagement from './page/fireFightingSubsystemManagement'
import fireFightingList from './page/fireFightingList'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    fireFightingSubsystemManagement,
    fireFightingList
  },
  data() {
    return {
      isOpenPanel: true,
      activeName: 'first' // 默认报警日志
    }
  },
  created() {
    this.SET_COMPONENT_ID('fireFightingSubsystemManagement')
  },
  watch: {
    isNewFile: function(newVale, oldValue) {
      if (newVale) {
        console.log(newVale)
        this.SET_COMPONENT_ID(newVale)
      }
    }
  },
  computed: {
    ...mapState('equipmentManagement', {
      componentId: 'componentId',
      isNewFile: 'isNewFile'
    })
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_COMPONENT_ID: 'SET_COMPONENT_ID'
    }),
    handleClick(tab, event) {
      if (tab.name === 'first') {
        this.SET_COMPONENT_ID('fireFightingSubsystemManagement')
      } else {
        this.SET_COMPONENT_ID('fireFightingList')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-main {
  width: 100%;
  height: 100%;
  padding: 10px 50px;
  display: flex;
  .left-tabs {
    height: 100%;
    .arrow {
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      text-align: right;
      i {
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
    }
    .menu-content {
      font-size: 14px;
      dt {
        background: #f2f2f2;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        cursor: pointer;
        &:hover {
          background: #dff5fc;
        }
      }
      dd {
        background: #f8f8f8;
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        margin-inline-start: 0px;
        border-top: 1px solid #ffffff;
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
      .active {
        color: #538bda;
        border-left: 2px solid #2d72d3;
      }
    }
  }
  .right-content {
    flex: 1;
    height: 100%;
    background: #fff;
  }
  .el-menu {
    background-color: #eee;
  }
}
</style>
