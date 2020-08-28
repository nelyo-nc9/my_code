<template>
  <div class="alarm-main">
    <div @click="isOpenPanel = !isOpenPanel" class="isShow" :style="{ left: isOpenPanel ? '220px' : '0' }">
      <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="left-tabs" :style="{ width: isOpenPanel ? '220px' : '28px' }">
      <div class="menu-content" v-show="isOpenPanel">
        <dl v-for="item in tabs" :key="item.index">
          <dt v-if="!item.items" :class="{ active: componentId === item.index }" @click="changeTab(item.index)">
            {{ item.label }}
          </dt>
          <div v-else>
            <dt>{{ item.label }}</dt>
            <dd
              v-for="val in item.items"
              :key="val.index"
              :class="{ active: componentId === val.index }"
              @click="changeTab(val.index)"
            >
              {{ val.label }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="right-content">
      <component :is="componentId"></component>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import newlyPatrol from './newlyPatrol'
import patrolQuery from './patrolQuery'
import patrolTask from './patrolTask'
export default {
  components: {
    newlyPatrol,
    patrolQuery,
    patrolTask
  },
  data() {
    return {
      tabs: [
        {
          index: 'hotOperationManagement',
          label: '消防审批',
          items: [
            { index: 'path:hotWorkApproval:hotWorkList:0', label: '申请列表' },
            { index: 'path:hotWorkApproval:hotWorkList:1', label: '待审批列表' },
            { index: 'path:hotWorkApproval:hotWorkList:2', label: '已审批列表' },
            { index: 'path:hotWorkApproval:hotWorkList:3', label: '历史抄送列表' },
            { index: 'path:hotWorkApproval:hotQuery', label: '查询' }
          ]
        },
        {
          index: 'maintenanceManagement',
          label: '维保管理',
          items: [
            { index: 'path:maintenanceManagement:maintenanceList', label: '维保任务管理' },
            { index: 'path:maintenanceManagement:maintenanceQuery', label: '维保任务执行查询' }
          ]
        },
        {
          index: 'patrolInspectionManagement',
          label: '巡检管理',
          items: [
            { index: 'newlyPatrol', label: '新增巡检点' },
            { index: 'patrolTask', label: '巡检任务管理' },
            { index: 'patrolQuery', label: '巡检任务查询' }
          ]
        },
        {
          index: 'fireFightingArchives',
          label: '消防档案',
          items: [
            { index: 'path:fireFightingArchives:customizationFile', label: '自定义文件' },
            { index: 'path:fireFightingArchives:filesDetail', label: '档案详情' },
            { index: 'path:fireFightingArchives:editFileName', label: '编辑文件详情名称' }
          ]
        }
      ],
      isOpenPanel: true
    }
  },
  watch: {},
  created() {
    // this.SET_COMPONENT_ID('newlyPatrol')
    this.setMenu(this.tabs) // 重新赋值menus
    this.tabs = this.newMenu
    this.changeTab(this.defaultComponent.index)
    console.log(this.newMenu, this.defaultComponent.index)
  },
  computed: {
    ...mapState('fireOperationManagement', {
      componentId: 'componentId'
    }),
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn'])
    // ...mapState({
    //   componentId: ({ alarm }) => alarm.componentId
    // })
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    // ...mapMutations(['SET_COMPONENTID', 'SET_SKIP_NUM']),
    ...mapMutations('fireOperationManagement', {
      SET_COMPONENT_ID: 'SET_COMPONENT_ID',
      SET_FIRECOMPONENT_STATUS: 'SET_FIRECOMPONENT_STATUS',
      SET_NAV_NAME: 'SET_NAV_NAME'
    }),
    changeTab(index) {
      if (index.indexOf(':') !== -1) {
        let result = index.split(':')
        console.log(result)
        this.SET_COMPONENT_ID(result[2])
        let status = result[3] || null
        if (status) {
          this.SET_FIRECOMPONENT_STATUS(parseInt(status))
        } else {
          this.SET_FIRECOMPONENT_STATUS('')
        }
        this.SET_NAV_NAME(result[1])
        this.$router.push({ name: result[1] })
      } else {
        this.SET_COMPONENT_ID(index)
      }
    },
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
