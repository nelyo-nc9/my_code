<!--
 * @Author: tuozhaoping
 * @Date: 2020-06-01 21:18:16
 * @LastEditTime: 2020-07-21 18:31:36
 * @LastEditors: dfk
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\components\Home.vue
-->
<template>
  <div class="hello">
    <div class="bg">
      <div
        v-for="(item,index) in info"
        :class="`nav-${item.class}`"
        class="hoverBg"
        @click="toRoute(item)"
        :key="index"
        style="position: relative;"
      >
        <div :class="`items-${item.class}`">
          <p style="width:120px;">{{item.label}}</p>
        </div>
        <section
          v-if="item.show"
          style="
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;left: 0;z-index: 999;
        display: flex;cursor: pointer;
        justify-content: center;
        align-items: center;
        font-weight:700;
        background: rgba(0,0,0,.3);
        color:#fff4cde0;
        font-size:18px;"
        >暂无权限</section>
      </div>
      <!-- <div class="nav-security" @click="jump('/intelligentSecurity/warnn')">
        <el-button type="primary" @click="jump('/intelligentSecurity/warnn')">智慧安防</el-button>
        <div class="items-security">
          <p>智慧安防</p>
        </div>
      </div>
      <div class="nav-fire" @click="jump('/intelligentFire/alarmEmergencyResponse')">
        <div class="items-fire">
          <p>智慧消防</p>
        </div>
      </div>
      <div class="nav-ai">
        <div class="items-ai">
          <p>AI应用</p>
        </div>
      </div>
      <div class="nav-centralDuty" @click="jump('/centerDutyManagement/map')">
        <div class="items-centralDuty">
          <p style="width:113px;">中心值班管理</p>
        </div>
      </div>
      <div class="nav-safetyManagement" @click="jump('/dailySafety/overtime')">
        <div class="items-safetyManagement">
          <p style="width:113px;">日常安全管理</p>
        </div>
      </div>
      <div class="nav-businessLinkage">
        <div class="items-businessLinkage" @click="jump('/business/navmenu')">
          <p>业务联动</p>
        </div>
      </div>
      <div class="nav-app">
        <div class="items-app">
          <p>APP应用</p>
        </div>
      </div>
      <div class="nav-bigData">
        <div class="items-bigData"  @click="jump('/bigData/index')">
          <p>大数据</p>
        </div>
      </div>
      <div class="nav-systemMaintenance" @click="jump('/systemMaintenancet/basicInfo/orgManage')">
        <div class="items-systemMaintenance">
          <p>系统维护</p>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      route: [],
      info: [
        {
          show: true,
          class: 'security',
          label: '智慧安防',
          url: '/intelligentSecurity'
        },
        {
          show: true,
          class: 'fire',
          label: '智慧消防',
          url: '/intelligentFire'
        },
        {
          show: true,
          class: 'ai',
          label: 'AI应用',
          url: '/B'
        },
        {
          show: true,
          class: 'centralDuty',
          label: '中心值班管理',
          url: '/centerDutyManagement'
        },
        {
          show: true,
          class: 'safetyManagement',
          label: '日常安全管理',
          url: '/dailySafety'
        },
        {
          show: true,
          class: 'businessLinkage',
          label: '业务联动',
          url: '/business'
        },
        {
          show: true,
          class: 'app',
          label: 'APP应用',
          url: ''
        },
        {
          show: true,
          class: 'bigData',
          label: '大数据',
          url: '/bigData'
        },
        {
          show: true,
          class: 'systemMaintenance',
          label: '系统维护',
          url: '/systemMaintenancet'
        }
      ]
    }
  },
  computed: {
    ...mapState('login', ['useRouter', 'poweRoute'])
  },
  created() {
    let info = this.$lodash.cloneDeep(this.info)
    let poweRoute = this.poweRoute || JSON.parse(sessionStorage.poweRoute)
    info = info.map(item => {
      if (poweRoute.some(i => i.path === item.url)) {
        let str = item.url
        let arr = poweRoute.filter(io => io.path === item.url)[0]
        if (arr.children) {
          str = arr.children[0] && arr.children[0].path
          if (arr.children[0] && arr.children[0].children) {
            str = arr.children[0].children[0] && arr.children[0].children[0].path
          }
        }
        item.url = str
        item.show = false
      }
      return item
    })
    this.info = info
    // console.log(this.info)
  },
  methods: {
    ...mapActions('login', ['setState', 'setTab']),
    /**
     * @description: 路由跳转
     * @param {strPath：router路由中配置的path路径}
     * @return: 无
     */
    jump(strPath) {
      this.$router.push(strPath)
    },
    toRoute(item) {
      if (!item.show) {
        this.setTab(item.url)
        this.jump(item.url)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@bgSize: 85px;
@ftSize: 20px;
.hello {
  width: 100%;
  height: 100%;
  background: url(../../static/home/bg.png) no-repeat;
  background-size: cover;
  .bg {
    width: 80%;
    min-width: 1524px;
    max-width: 1600px;
    margin: 265px auto 0;
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    .hoverBg {
      &:hover :first-child p {
        font-size: @ftSize;
      }
      &:hover :first-child {
        background-size: @bgSize;
      }
    }
    p {
      width: 76px;
      height: 19px;
      font-size: 18px;
      position: relative;
      top: 157px;
      text-align: center;
      margin: 0 auto;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }
    .nav-security {
      width: 300px;
      height: 200px;
      cursor: pointer;
      margin-right: 6px;
      background: rgba(0, 102, 179, 1);
      opacity: 0.9;
      .items-security {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/smartSecurity.png) no-repeat center;
      }
    }
    .nav-fire {
      width: 300px;
      height: 200px;
      cursor: pointer;
      margin-right: 6px;
      background: rgba(217, 133, 53, 1);
      opacity: 0.9;
      .items-fire {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/smartFire.png) no-repeat center;
      }
    }
    .nav-ai {
      width: 300px;
      height: 200px;
      cursor: pointer;
      margin-right: 6px;
      background: rgba(62, 101, 221, 1);
      opacity: 0.9;
      .items-ai {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/ai.png) no-repeat center;
      }
    }
    .nav-centralDuty {
      width: 300px;
      height: 200px;
      cursor: pointer;
      margin-right: 6px;
      background: rgba(95, 107, 234, 1);
      opacity: 0.9;
      .items-centralDuty {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/centralDuty.png) no-repeat center;
      }
    }
    .nav-safetyManagement {
      width: 300px;
      height: 200px;
      cursor: pointer;
      background: rgba(45, 129, 236, 1);
      opacity: 0.9;
      .items-safetyManagement {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/safetyManagement.png) no-repeat center;
      }
    }
    .nav-businessLinkage {
      width: 300px;
      height: 200px;
      cursor: pointer;
      margin: 6px 6px 0 0;
      background: rgba(224, 103, 61, 1);
      opacity: 0.9;
      .items-businessLinkage {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/businessLinkage.png) no-repeat center;
      }
    }
    .nav-app {
      width: 300px;
      height: 200px;
      cursor: pointer;
      margin: 6px 6px 0 0;
      background: #5974A3;
      opacity: 0.9;
      .items-app {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/app.png) no-repeat center;
      }
    }
    .nav-bigData {
      width: 300px;
      height: 200px;
      cursor: pointer;
      margin: 6px 6px 0 0;
      background: rgba(231, 167, 59, 1);
      opacity: 0.9;
      .items-bigData {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/bigData.png) no-repeat center;
      }
    }
    .nav-systemMaintenance {
      width: 300px;
      height: 200px;
      cursor: pointer;
      margin-top: 6px;
      background: rgba(19, 162, 220, 1);
      opacity: 0.9;
      .items-systemMaintenance {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url(../../static/home/systemMaintenance.png) no-repeat center;
      }
    }
  }
}
</style>
