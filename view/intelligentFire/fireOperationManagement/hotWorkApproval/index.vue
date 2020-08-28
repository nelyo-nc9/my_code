<template>
  <div class="alarm-main">
    <div @click="isOpenPanel = !isOpenPanel" class="isShow" :style="{ left: isOpenPanel ? '220px' : '0' }">
      <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="left-tabs" :style="{ width: isOpenPanel ? '220px' : '28px' }">
      <div class="menu-content" v-show="isOpenPanel">
        <!-- <dl v-for="item in tabs" :key="item.index">
          <dt v-if="!item.items" :class="{ active: componentId === item.index }" @click="changeTab(item.index)">
            {{ item.title }}
          </dt>
          <div v-else>
            <dt>{{ item.title }}</dt> 
            <dd
              v-for="val in item.items"
              :key="val.index"
              :class="{ active: componentIdAct === val.index }" 
              @click="changeTab(val.index)"
            >
              {{ val.title }}
            </dd>
          </div>
        </dl> -->
        <el-menu
          :default-active="combinationName"
          class="el-menu-vertical-demo"
          :unique-opened="true"
          @select="changeTab"
        >
          <template v-for="item in tabs">
            <el-submenu v-if="item.items" :index="item.index" :key="item.id">
              <template>
                <span slot="title">{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">{{
                  val.title
                }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="right-content">
      <component :is="componentId" ref="parentComponent"></component>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import hotWorkList from './hotWorkList'
import hotQuery from './hotQuery'
import newlyPatrol from '../patrolInspectionManagement/newlyPatrol'
export default {
  components: {
    hotWorkList,
    hotQuery,
    newlyPatrol
  },
  data() {
    return {
      combinationName: '',
      tabs: [
        {
          index: 'hotOperationManagement',
          title: '消防审批',
          items: [
            { index: 'hotWorkList0', title: '申请列表' },
            { index: 'hotWorkList1', title: '待审批列表' },
            { index: 'hotWorkList2', title: '已审批列表' },
            { index: 'hotWorkList3', title: '历史抄送列表' },
            { index: 'hotQuery', title: '查询' }
          ]
        },
        {
          index: 'maintenanceManagement',
          title: '维保管理',
          items: [
            { index: 'path:maintenanceManagement:maintenanceList', title: '维保任务管理' },
            { index: 'path:maintenanceManagement:maintenanceQuery', title: '维保任务执行查询' }
          ]
        },
        {
          index: 'patrolInspectionManagement',
          title: '巡检管理',
          items: [
            { index: 'path:patrolInspectionManagement:newlyPatrol', title: '新增巡检点' },
            { index: 'path:patrolInspectionManagement:patrolTask', title: '巡检任务管理' },
            { index: 'path:patrolInspectionManagement:patrolQuery', title: '巡检任务查询' }
          ]
        },
        {
          index: 'fireFightingArchives',
          title: '消防档案',
          items: [
            { index: 'path:fireFightingArchives:customizationFile', title: '自定义文件' },
            { index: 'path:fireFightingArchives:filesDetail', title: '档案详情' },
            { index: 'path:fireFightingArchives:editFileName', title: '编辑文件详情名称' }
          ]
        }
      ],
      isOpenPanel: true
    }
  },
  watch: {},
  created() {
    this.setMenu(this.tabs) // 重新赋值menus
    this.tabs = this.newMenu
    this.changeTab(this.defaultComponent.index)
    this.combinationName = this.defaultComponent.index
    console.log(this.newMenu, this.defaultComponent.index)
  },
  computed: {
    ...mapState('fireOperationManagement', {
      componentId: 'componentId',
      componentStatus: 'componentStatus'
    }),
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
    // ...mapState({
    //   componentId: ({ alarm }) => alarm.componentId
    // }),
    componentIdAct: function() {
      return this.componentId + this.componentStatus
    }
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    // ...mapMutations(['SET_COMPONENT_ID', 'SET_SKIP_NUM']),
    ...mapMutations('fireOperationManagement', {
      SET_COMPONENT_ID: 'SET_COMPONENT_ID',
      SET_FIRECOMPONENT_STATUS: 'SET_FIRECOMPONENT_STATUS',
      SET_NAV_NAME: 'SET_NAV_NAME'
    }),
    changeTab(index) {
      console.log(index)
     
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
        console.log(this.SET_COMPONENT_ID)
        if (index.indexOf('hotWorkList') !== -1) {
          this.$nextTick(()=>{
            this.$refs.parentComponent.parentMethod()
          })
          this.SET_COMPONENT_ID('hotWorkList')
          let status = parseInt(index.slice(index.length - 1))
          this.SET_FIRECOMPONENT_STATUS(status)
        } else {
          this.SET_COMPONENT_ID(index)
        }
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
