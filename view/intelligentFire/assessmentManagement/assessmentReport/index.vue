<template>
  <div class="alarm-main">
    <div @click="isOpenPanel = !isOpenPanel" class="isShow" :style="{ left: isOpenPanel ? '220px' : '0' }">
      <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="left-tabs no-print" :style="{ width: isOpenPanel ? '220px' : '28px' }">
      <div class="menu-content" v-show="isOpenPanel">
        <dl v-for="item in tabs" :key="item.index">
          <div>
            <dt>{{ item.label }}</dt>
            <dd v-for="val in item.items" :key="val.index" :class="{ active: componentId === val.index }">
              {{ val.label }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="right-content">
      <component :is="'assessmentReport'"></component>
    </div>
  </div>
</template>

<script>
import assessmentReport from './page/assessmentReport'
// import viewDetails from './page/viewDetails'
// import evaluationReportRules from './page/evaluationReportRules'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  components: {
    assessmentReport
    // evaluationReportRules,
    // viewDetails
  },
  data() {
    return {
      tabs: [
        {
          index: 'assessmentReport',
          label: '消防评估配置',
          items: [
            // { index: 'viewDetails', label: '查看详情' },
            // { index: 'evaluationReportRules', label: '评估报告规则' }
          ]
        }
      ],
      isOpenPanel: true
    }
  },
  created() {
    this.setMenu(this.tabs) // 重新赋值menus
    this.tabs = this.newMenu
    this.SET_COMPONENTID(this.defaultComponent.index)
    this.combinationName = this.defaultComponent.index
    console.log(this.newMenu, this.defaultComponent.index)
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
    ...mapState({
      componentId: ({ alarm }) => alarm.componentId
    })
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    ...mapMutations(['SET_COMPONENTID', 'SET_SKIP_NUM']),
    // ...mapMutations('equipmentManagement', {
    //   SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
    //   SET_COMPONENT_ID: 'SET_COMPONENT_ID'
    // }),
    // changeTab(index) {
    //   this.SET_COMPONENT_ID(index)
    // },
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-main {
  width: 100%;
  height: 100%;
  padding: 10px 0;
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
  .isShow {
    position: absolute;
    top: calc(~'50% - 31px');
    width: 36px;
    height: 62px;
    border-top: 18px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 18px solid #e6e6e6;
    z-index: 10;
    cursor: pointer;
    i {
      color: #666;
      position: absolute;
      left: -15px;
      top: 6px;
    }
  }
  .el-menu {
    background-color: #eee;
  }
}
</style>
