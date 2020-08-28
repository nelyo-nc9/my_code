<template>
  <div class="container">
    <div class="nav">
      <div class="left">
        <div>
          <img src="../../static/logo.png"
               alt />
        </div>
        <div>安防物联管理平台</div>
        <!--                <div>|</div>-->
      </div>
      <div class="center">
        <div class="nav-btn"
             @click="navScrollFuc('left')"
             v-show="isShowNavigationButton&&navigationButton==='left'">
          <i class="el-icon-more"></i>
        </div>
        <div class="first-menu"
             ref="scrollId"
             :class="{menuPadd:isShowNavigationButton}">
          <div class="nav-scroll">
            <div class="menu"
                 @click="towRoute(item)"
                 @contextmenu.prevent="newPage(item)"
                 v-for=" (item,i) in FirstmenuData"
                 :key="i"
                 :class="{isActive:item.name===activeName}">{{item.menuName}}
            </div>
          </div>
        </div>
        <div class="nav-btn"
             @click="navScrollFuc('right')"
             v-show="isShowNavigationButton&&navigationButton==='right'">
          <i class="el-icon-more"></i>
        </div>
        <div v-if="shiftBtnShow"
             class="shift-btn"
             title="交接班"
             @click="startShift">
          <i class="el-icon-user-solid"></i>
        </div>
      </div>
      <div class="right">
        <div>
          <i class="el-icon-bell"></i>
        </div>
        <div>
          <i class="el-icon-message"></i>
        </div>
        <div>
          |
        </div>
        <div>{{dataTime}}</div>
        <div>
          <div style="position:relative">
            <i class="el-icon-warning-outline"
               @click="isbanshow=!isbanshow"></i>
            <div class="bna"
                 v-if="isbanshow"
                 @mouseleave="isbanshow=false">
              <div class="point" style="left:34px"></div>
              <div class='li'>操作手册</div>
              <div class='li'
                   @click="banbencenterDialogVisible=true">版本信息</div>
            </div>
          </div>
        </div>

        <div>
          <div style="position:relative">
            <i class="el-icon-user"
               @click="isUserShow=!isUserShow"></i>
            <div class="bna"
                 style="height:90px;width:120px;left:-75px;"
                 v-if="isUserShow"
                 @mouseleave="isUserShow=false">
              <div class="point" style="left:77px"></div>
              <div class="" style="height:30px;line-height:30px;display:flex;align-items: center;"><div style="width:50px;text-align: right;">姓名：</div>{{user.name}}</div>
              <div class="" style="height:30px;line-height:30px;display:flex;align-items: center;"><div style="width:50px;text-align: right;">用户名：</div>{{user.userName}}</div>
              <div class='li'
                   @click="_ => {
                    this.userOut()
                    this.$router.push('/login')
                   }">退出登录</div>
            </div>
          </div>
          <!-- <i class="el-icon-user"></i> -->
        </div>
        <div @click="fullScreen"
             v-if="!isFullScreen">
          <i class="el-icon-full-screen"></i>
        </div>
        <div @click="exitScreen"
             v-if="isFullScreen">
          <!--                    <i class="el-icon-full-screen"></i>-->
          <span class="iconfont">&#xe708;</span>
        </div>
      </div>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
    <div>
      <el-dialog title="版本信息"
                 :visible.sync="banbencenterDialogVisible"
                 width="30%"
                 left>
        <div>
          <div style="height: 30px;line-height: 30px;">
            <span style="display:inline-block;width:90px">web版本：</span>
            <span>{{WEB_VERSION}}</span>
          </div>
          <div style="height: 30px;line-height: 30px;">
            <span style="display:inline-block;width: 90px">node版本：</span>
            <span>{{NODE_VERSION0}}</span>
          </div>
        </div>

      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapMutations, mapActions } from 'vuex'
import { WEB_VERSION, NODE_VERSION } from '../../static/constants'
console.log(WEB_VERSION, NODE_VERSION)
export default {
  name: 'secendRouterView',
  data() {
    return {
      WEB_VERSION: WEB_VERSION,
      NODE_VERSION0: NODE_VERSION,
      banbencenterDialogVisible: false,
      isbanshow: false,
      isUserShow: false,
      dataTime: moment(new Date()).format('YYYY-MM-DD'),
      isFullScreen: false,
      FirstmenuData: [],
      activeName: '',
      isShowNavigationButton: false,
      navigationButton: 'right',
      shiftBtnShow: false // 交接班登录按钮
    }
  },
  computed: {
    ...mapState('login', ['poweRoute']),
    user() {
      return JSON.parse(sessionStorage.user)
    }
  },
  created() {
    // let powerPage = sessionStorage.useRouter && JSON.parse(sessionStorage.useRouter).page
    let strPath = this.$route.path.split('/')[1]
    let childPath = this.filterPath(strPath)
    console.log(childPath)
    this.FirstmenuData = childPath
    let firstMenu = this.$route.path.split('/')[2]
    let secendMeun = []
    childPath.forEach(item => {
      let path = item.path.split('/')[2]
      if (path === firstMenu) {
        secendMeun = item.children || []
        this.activeName = item.name
      }
    })
    this.shiftBtnShow = this.activeName === 'dutyManagement'
    this.$store.commit('SET_THIRD_ROUTER', secendMeun)
  },
  mounted() {
    this.isShowNavigationButtonFuc()
  },
  methods: {
    ...mapMutations('dutyManagement', ['SET_KEY_CONCERNS_SHOW']),
    ...mapMutations('fireOperationManagement', ['SET_NAV_NAME']),
    ...mapActions('login', ['userOut', 'setTab']),
    towRoute(item) {
      if (item.children && item.children.length > 0) {
        this.setTab(item.children[0].path)
        this.handleSelect(item)
      } else {
        this.setTab(item.path)
        this.handleSelect(item)
      }
    },
    newPage(item) {
      let routes = this.$router.resolve({ name: item.name, query: { } })
      routes.href = item.children[0] ? item.children[0].path : item.path
      window.open(routes.href, '_blank')
    },
    /**
     * @description: 根据一级路由，filter筛选出二级路由
     * @param {path}
     * @return: 无
     */
    filterPath(path) {
      let arr = []
      this.poweRoute.map(item => {
        if (item.path.indexOf(path) !== -1) {
          arr = item.children
        }
      })
      return arr
    },
    /**
     * @description:  点击一级路由，更加路由配置是否显示二级菜单
     * @param {path}
     * @return: 无
     */
    handleSelect(path) {
      this.shiftBtnShow = path.menuName === '值班管理'
      if (path.name === this.activeName) {
        return
      }
      this.activeName = path.name
      if (path.children) {
        this.$store.commit('SET_THIRD_ROUTER', path.children)
        this.SET_NAV_NAME(path.children[0].name)
        this.$router.push(path.children[0].path)
      } else {
        this.$store.commit('SET_THIRD_ROUTER', [])
        this.SET_NAV_NAME(path.name)
        this.$router.push(path.path)
      }
    },
    /**
     * @description:  全屏
     * @param {无}
     * @return: 无
     */
    fullScreen() {
      this.isFullScreen = true
      var el = document.documentElement
      var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el)
      }
    },
    /**
     * @description: 退出全屏
     * @param {无}
     * @return: 无
     */
    exitScreen() {
      this.isFullScreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      if (typeof cfs !== 'undefined' && cfs) {
        // eslint-disable-next-line no-undef
        cfs.call(el)
      }
    },
    /**
     * @description: 导航条超出时，点击小圆点，左右滚动...
     * @param {无}
     * @return: 无
     */
    navScrollFuc(direction) {
      let scrollDom = this.$refs.scrollId
      let width = scrollDom.children[0].clientWidth
      if (direction === 'right') {
        scrollDom.scrollLeft = width - scrollDom.clientWidth
        this.navigationButton = 'left'
      } else if (direction === 'left') {
        scrollDom.scrollLeft = 0
        this.navigationButton = 'right'
      }
    },
    /**
     * @description: 导航加载时判断是否显示...
     * @param {无}
     * @return: 无
     */
    isShowNavigationButtonFuc() {
      let scrollDom = this.$refs.scrollId
      let width = scrollDom.children[0].clientWidth
      let scrollWidth = scrollDom.clientWidth
      if (width > scrollWidth) {
        this.isShowNavigationButton = true
      } else {
        this.isShowNavigationButton = false
      }
    },
    /**
     * @description: 开始交班
     * @param {无}
     * @return: 无
     */
    startShift() {
      this.SET_KEY_CONCERNS_SHOW(true)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;

  .nav {
    width: 100%;
    height: 40px;
    display: flex;
    font-size: 16px;
    line-height: 40px;
    justify-content: space-between;
    color: #fff;
    background: #3047a4;
    /*background: url("../../static/nav.png") 100% 100% no-repeat;*/
    background-size: 100% 100%;

    .left {
      display: flex;
      width: 350px;

      div:first-child {
        height: 40px;
        padding-left: 21px;
        img {
          height: 32px;
          width: 139px;
          vertical-align: middle;
        }
      }

      div:nth-child(2) {
      }

      div:last-child {
        margin: 0 0 0 25px;
      }
    }

    .center {
      flex: 1;
      display: flex;
      overflow: hidden;
      position: relative;

      .nav-btn {
        position: absolute;
        height: 45px;
        line-height: 45px;
        width: 30px;
        text-align: center;
      }

      .nav-btn:first-child {
        left: 0;
        top: 0;
        background: rgba(45, 114, 211, 1);
      }

      .nav-btn:last-child {
        right: 0;
        top: 0;
        background: rgba(45, 114, 211, 1);
      }

      .menuPadd {
        padding: 0 30px;
      }

      .first-menu {
        height: 40px;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        /*padding: 0 25px;*/
        flex: 1;
        /*background: rgba(45, 114, 211, 1);*/
        padding: 0 40px;

        .nav-scroll {
          /*display: flex;*/
          /*flex-wrap: nowrap;*/
          white-space: nowrap;
          .menu {
            line-height: 40px;
            font-size: 14px;
            padding: 0 20px;
            cursor: pointer;
            display: inline-block;
            min-width: 60px;
          }

          .menu:hover {
            background: #16319c;
            /*color: rgba(45, 114, 211, 1);*/
          }

          .isActive {
            /*background: rgba(1, 194, 255, 0.278431);*/
            background: #12287f;
          }
        }
      }

      .first-menu::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
      }

      .first-menu::-webkit-scrollbar-track {
        width: 0 !important;
        height: 0 !important;
      }
      .shift-btn {
        position: relative;
        top: 0;
        left: -270px;
        font-size: 18px;
        cursor: pointer;
      }
    }

    .right {
      display: flex;
      width: 300px;
      justify-content: space-around;
      font-size: 16px;
      div:nth-child(3) {
        /*font-size: 12px;*/
      }

      i {
        cursor: pointer;
      }
      span {
        cursor: pointer;
      }
      .bna {
        position: absolute;
        top: 40px;
        width: 80px;
        left: -30px;
        height: 60px;
        background: rgb(255, 255, 255);
        border: 1px solid rgb(221, 221, 221);
        border-radius: 4px;
        z-index: 11111111;
        color: #333;
        font-size: 12px;
        text-align: center;
        .point {
          position: absolute;
          top: -9px;
          left: 40px;
          width: 0;
          height: 0;
          border-bottom: 5px solid #fff;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid transparent;
        }
        .li {
          line-height: 28px;
        }
        .li:hover {
          background: #c6e2ff;
          cursor: pointer;
        }
      }
    }
  }

  .body {
    flex: 1;
    height: calc(~'100% - 40px');
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
}
</style>
