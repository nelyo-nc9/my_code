<template>
  <div class="people-manage-box">
    <!-- 左侧导航 -->
    <div class="menu-content-left" :style="{width: isOpenMenu ? '200px !important' : '0px', transition: 'width .3s', overflow: 'hidden'}">
      <el-menu :default-active="currentView" class="el-menu-vertical-demo" :unique-opened="true" @select="changeTab">
          <template v-for="item in newMenu">
            <el-submenu v-if="item.items" :index="item.index" :key="item.index">
              <template>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </template>
      </el-menu>
    </div>
    <div class="menu-left-btn" @click="isOpenMenu = !isOpenMenu" :style="{left: isOpenMenu? '200px' : '0', transition: 'left .3s'}">
      <div class="isShow">
        <i :class="isOpenMenu ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
    </div>
    <!-- 中间内容 -->
    <div class="content-center" v-show="isShowTree">
      <PeopleTree></PeopleTree>
    </div>
    <!-- 右侧内容 -->
    <div class="content-right">
      <!-- {{aa}} -->
      <!-- 动态组件 -->
      <component :is="currentView"></component>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import PeopleTree from './pages/PeopleTree'
import PeopleManageList from './pages/PeopleManageList'
import PeopleManageSync from './pages/PeopleManageSync'
import PeopleManageSearch from './pages/PeopleManageSearch'
import PeopleManageDetail from './pages/PeopleManageDetail'

export default {
  name: 'peopleManage',
  components: {
    PeopleTree,
    PeopleManageList,
    PeopleManageSync,
    PeopleManageSearch,
    PeopleManageDetail
  },
  data() {
    return {
      isOpenMenu: true, // 左侧导航是否显示
      menus: [
        {
          index: 'PeopleManage',
          title: '人员管理',
          items: [
            {
              index: 'PeopleManageSync',
              title: '同步'
            },
            {
              index: 'PeopleManageList',
              title: '列表'
            },
            {
              index: 'PeopleManageSearch',
              title: '查询'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapState('peopleManage', ['currentView', 'currentTitle']),
    ...mapState({vstate: ({ peopleManage }) => peopleManage}),
    ...mapGetters('peopleManage', ['isShowTree'])
  },
  created() {
    // 初始化tab列表
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.states({currentView: this.defaultComponent.index, currentTitle: this.defaultComponent.title})
    let peopleInfo = this.$CryptoAES.urlSlice('people')
    if (peopleInfo) {
      let {currentView, currentTitle, fromView, fromTitle, orgId, orgName, nodeKey, detailData} = peopleInfo && JSON.parse(this.$CryptoAES.decrypt(peopleInfo))
      this.states({currentView, currentTitle, fromView, fromTitle, orgId, orgName, nodeKey, detailData})
    }
  },
  methods: {
    ...mapActions('peopleManage', ['setState']),
    ...mapActions('login', ['setMenu', 'changIndex']),
    async state(a, b) {
      await this.setState({type: 'SET_STATE', key: a, value: b})
    },
    states(obj = {}) {
      for (let i in obj) { this.state(i, obj[i]) }
    },
    changeTab(index, payload) {
      this.changIndex(index)
      let { menus } = this
      let obj = menus[0].items.filter(item => item.index === payload[1])[0]
      this.states({currentView: index, currentTitle: obj.title})
      let people = JSON.stringify(this.vstate)
      this.$router.push({path: '/systemMaintenancet/basicInfo/peopleManage', query: {people: this.$CryptoAES.encrypt(people)}})
    }
  }
}
</script>

<style lang="less" scoped>
.people-manage-box {
  width: 100%;
  height: 100%;
  padding: 5px 0px;
  box-shadow:inset 0 0 10px 3px #ececec;
  display: flex;
  justify-content: flex-start;
  position: relative;
  .menu-content-left {
    flex-shrink: 0;
    height: 100%;
    padding: 5px 0px;
    background: #F5F5F5;
    .el-menu-vertical-demo {
      width: 200px;
    }
    /deep/ .el-menu {
      border-right: none;
      background-color: transparent;
    }
    /deep/ .el-menu-item-group__title {
      padding: 0;
    }
  }
  .menu-left-btn {
    position: absolute;
    top: calc(~'50% - 31px');
    z-index: 10;
    width: 18px;
    height: 62px;
    overflow: hidden;
    cursor: pointer;
    .isShow {
      width: 36px;
      height: 62px;
      border-top: 15px solid transparent;
      border-right: 18px solid transparent;
      border-bottom: 15px solid transparent;
      border-left: 18px solid #E6E6E6;
      position: relative;
      i {
        color: #666;
        position: absolute;
        left: -15px;
        top: 9.5px;
      }
    }
  }
  .content-center {
    width: 280px;
    flex-shrink: 0;
    height: 100%;padding: 5px 0px;
    overflow: hidden;
  }
  .content-right {
    flex: 1;
    width: 100%;height: 100%;
    overflow: hidden;
    padding: 10px 20px 20px 20px;
    box-shadow:inset 0 0 10px 1px #ececec;
  }
}
</style>
