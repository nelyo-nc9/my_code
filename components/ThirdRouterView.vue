<template>
  <div class="secend-containter">
    <div class="secendMenu" >
      <div class="home">
        <!--        <i class="el-icon-s-home"></i>-->
        <router-link to="/home">首页</router-link>
      </div>
      <div class="menu"
           v-for=" item in secendMenuData"
           :key="item.name"
           @click="toThirdRoute(item)"
           @contextmenu.prevent="newPage(item)"
           :class="{isActive:item.name===activeName}">
        <span>{{item.menuName}}</span>
      </div>
    </div>
    <div class="secend-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  name: 'thirdRouterView',
  data() {
    return {
      secendMenuData: [],
      activeName: '',
      // 消防默认选中三级选项卡
      tabObj: {
        hotWorkApproval: 'hotWorkList',
        patrolInspectionManagement: 'newlyPatrol',
        maintenanceManagement: 'maintenanceList',
        fireFightingArchives: 'customizationFile'
      }
    }
  },
  watch: {
    '$store.state.routerArray.thirdRouterArray'(newName, oldName) {
      this.secendMenuData = newName
      setTimeout(() => {
        this.munuSelect()
      }, 30)
    },
    '$store.state.fireOperationManagement.navName'(newName, oldName) {
      this.activeName = newName
    }
  },
  computed: {
    ...mapState({
      thirdRouterArray: ({ routerArray }) => routerArray.thirdRouterArray
    })
  },
  created() {},
  mounted() {
    this.secendMenuData = this.$store.state.routerArray.thirdRouterArray || []
    setTimeout(() => {
      this.munuSelect()
    }, 30)
  },
  methods: {
    ...mapMutations('fireOperationManagement', {
      SET_COMPONENT_ID: 'SET_COMPONENT_ID'
    }),
    ...mapActions('login', ['setTab']),
    toThirdRoute(item) {
      this.setTab(item.path)
      this.handleSelectSecend(item)
    },
    newPage(item) {
      let routes = this.$router.resolve({ name: item.name, query: { } })
      routes.href = item.path
      window.open(routes.href, '_blank')
    },
    /**
     * @description: 路由切换函数
     * @param {path}
     * @return: 无
     */
    handleSelectSecend(path) {
      this.$router.push(path.path)
      this.activeName = path.name
      this.SET_COMPONENT_ID(this.tabObj[this.activeName])
    },
    /**
     * @description: 路由切换函数
     * @param {path}
     * @return: 无
     */
    munuSelect() {
      let strPath = this.$route.path.split('/')[3]
      console.log(strPath, 'strPath')
      if (!strPath) {
        if (this.secendMenuData[0] && this.secendMenuData[0].name) {
          this.activeName = this.secendMenuData[0].name
        }
      } else {
        this.secendMenuData.forEach(item => {
          if (item.path.indexOf('/') !== -1) {
            let path = item.path.split('/')[3]
            if (strPath === path) {
              this.activeName = item.name
              this.SET_COMPONENT_ID(this.tabObj[this.activeName])
            }
          } else {
            if (strPath === item.path) {
              this.activeName = item.name
              this.SET_COMPONENT_ID(this.tabObj[this.activeName])
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.secend-containter {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  /*min-height: 1000px;*/

  .secendMenu {
    width: 100%;
    display: flex;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px 0px rgba(133, 133, 133, 0.19);
    z-index: 2;
    .home {
      width: 65px;
      line-height: 40px;
      color: #333333;
      font-size: 14px;
      margin-left: 40px;
      a {
        text-decoration: none;
        color: #333333;
      }
      a:hover {
        color: #2d72d3;
      }
    }
    .menu {
      color: #333333;
      line-height: 40px;
      font-size: 14px;
      padding: 0 20px 0 20px;
      cursor: pointer;
      display: inline-block;
    }
    .menu:hover {
      color: #2d72d3;
    }

    .isActive {
      position: relative;
      color: #2d72d3;
      /*background: rgba(1, 194, 255, 0.278431);*/
      span {
        display: inline-block;
        height: 40px;
        border-bottom: 3px solid #2d72d3;
      }
    }
  }

  .secend-body {
    height: calc(~'100% - 40px');
    flex: 1;
    overflow: auto;
  }
}
</style>
