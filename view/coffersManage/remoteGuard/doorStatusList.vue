<!--
 * @Author: yanglei
 * @Date: 2020-06-01 15:20:04
 * @LastEditTime: 2020-08-21 15:52:07
 * @LastEditors: your name
 * @Description:
 * @FilePath: \ccb-client\client\src\view\coffersManage\remoteGuard\doorStatusList.vue
-->
<template>
  <div class="door-status-container">
    <!-- <div class="door-status-title">
      <span></span><h3>金库门状态</h3><span></span>
      <span class="show-more"></span>
    </div> -->
    <!-- <p class="show-more"><span @click="gotoDoorStatus">更多>></span></p> -->
    <div class="door-status-title">
      <h3>金库门状态</h3>
      <span class="show-more" @click="gotoDoorStatus">...</span>
    </div>
    <div class="door-status-list" ref="doorStatusListDom" v-if="!showProcessingReq">
      <el-card shadow="always" class="door-status-item" v-for="doorItem in doorListData" :key="doorItem.id">
        <div class="organize-info">
          <p :title="doorItem.organization">{{ doorItem.organization }}</p>
          <br>
          <p :title="doorItem.keySite">{{ doorItem.keySite }}</p>
        </div>
        <div class="first-door">
          <span>1道门</span>
          <!-- <div :class="[doorItem.first === '已开启' ? 'open-door' : doorItem.first === '关闭' ? 'close-door' : 'open-door']">
            <span class="handle"></span>
            <span v-if="doorItem.first === '异常'" class="unusual-door">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#ccbjinggao"></use>
              </svg>
            </span>
          </div> -->
          <div class="currentdoor-div">
            <img :src="'/static/image/doorstatus/' + ['open', 'close', 'unusual', 'unknown'][['开启', '关闭', '异常', '未知'].findIndex(item => item === doorItem.first)] + '.png'" alt="" style="width: 100%; height: 100%;">
          </div>
          <span>{{ doorItem.first }}</span>
        </div>
        <div class="second-door">
          <span>2道门</span>
          <!-- <div :class="[doorItem.second === '已开启' ? 'open-door' : doorItem.second === '关闭' ? 'close-door' : 'open-door']">
            <span class="handle"></span>
            <span v-if="doorItem.second === '异常'" class="unusual-door">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#ccbjinggao"></use>
              </svg>
            </span>
          </div> -->
          <div class="currentdoor-div">
            <img :src="'/static/image/doorstatus/' + ['open', 'close', 'unusual', 'unknown'][['开启', '关闭', '异常', '未知'].findIndex(item => item === doorItem.second)] + '.png'" alt="" style="width: 100%; height: 100%;">
          </div>
          <span>{{ doorItem.second }}</span>
        </div>
      </el-card>
    </div>
    <div v-else class="current-dispose-door">
      <h3>当前正在处理的金库门状态</h3>
      <div class="current-door-state">
        <div class="organize-info">
          <p :title="currentDoorStatus.organization"><span>机构名称:</span> {{ currentDoorStatus.organization }}</p>
          <p :title="currentDoorStatus.keySite"><span>重点部位:</span> {{ currentDoorStatus.keySite }}</p>
          <p :title="currentDoorStatus.deviceName"><span>门禁设备:</span> {{ currentDoorStatus.deviceName }}</p>
        </div>
        <div class="first-door">
          <span>1道门</span>
          <!-- <div :class="[currentDoorStatus.first ? currentDoorStatus.first.status === '开启' ? 'open-door' : currentDoorStatus.first.status === '关闭' ? 'close-door' : 'open-door' : 'open-door']">
            <span class="handle"></span>
            <span v-if="currentDoorStatus.first && currentDoorStatus.first.status === '异常'" class="unusual-door">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#ccbjinggao"></use>
              </svg>
            </span>
          </div> -->
          <div class="currentdoor-div">
            <img :src="'/static/image/doorstatus/' + ['open', 'close', 'unusual', 'unknown'][['开启', '关闭', '异常', '未知'].findIndex(item => item === currentDoorStatus.second.status)] + '.png'" alt="" style="width: 100%; height: 100%;">
          </div>
          <span>{{ currentDoorStatus.first ? currentDoorStatus.first.status : '' }}</span>
        </div>
        <div class="second-door">
          <span>2道门</span>
          <!-- <div :class="currentDoorStatus.second ? currentDoorStatus.second.status === '开启' ? 'open-door' : currentDoorStatus.second.status === '关闭' ? 'close-door' : 'open-door' : 'open-door'">
            <span class="handle"></span>
            <span v-if="currentDoorStatus.second && currentDoorStatus.second.status === '异常'" class="unusual-door">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#ccbjinggao"></use>
              </svg>
            </span>
          </div> -->
          <div class="currentdoor-div">
            <img :src="'/static/image/doorstatus/' + ['open', 'close', 'unusual', 'unknown'][['开启', '关闭', '异常', '未知'].findIndex(item => item === currentDoorStatus.second.status)] + '.png'" alt="" style="width: 100%; height: 100%;">
          </div>
          <span>{{ currentDoorStatus.second ? currentDoorStatus.second.status : '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@src/assets/ccb_iconfonts/iconfont.js'

export default {
  name: 'doorStatusList',
  props: {
    showProcessingReq: {
      type: Boolean,
      default: false
    },
    doorListData: {
      type: Array,
      default: function() {
        return []
      }
    },
    currentDoorStatus: {
      type: Object,
      default: function() {
        return {
          // first: {
          //   status: '未知'
          // },
          // second: {
          //   status: '未知'
          // }
          organization: '',
          keySiteId: '',
          keySite: '',
          deviceName: '',
          first: {
            status: '未知',
            channelId: ''
          },
          second: {
            status: '未知',
            channelId: ''
          }
        }
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    /**
       * @description: 跳转金库门状态页面
       * @param {type} : 无
       * @return: 无
       */
    gotoDoorStatus() {
      try {
        this.$parent.$parent.toThirdRoute({
          menuName: '金库门状态',
          name: 'doorStatus',
          path: '/intelligentSecurity/coffersManage/doorStatus'
        })
      } catch (err) {
        this.$router.push({name: 'doorStatus', path: '/intelligentSecurity/coffersManage/doorStatus'})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.door-status-container {
  height: 100%;
  overflow: auto;
  .door-status-title {
    width: 100%;
    height: 50px;
    padding-top: 15px;
    position: relative;
    h3 {
      padding-left: 10px;
      font-weight: 400;
      font-family: Microsoft YaHei;
      color: #333333;
      border-left: 3px solid #2D72D3;
      margin-left: 20px;
    }
    .show-more {
      font-size: 30px;
      top: -5px;
      right: 22px;
      position: absolute;
      cursor: pointer;
    }
  }
  // .door-status-title {
  //   width: 100%;
  //   text-align: center;
  //   padding: 20px 0 0 0;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-around;
  //   span {
  //     width: 40%;
  //     height: 1px;
  //     display: inline-block;
  //     border: 1px solid #E4E4E4;
  //   }
  // }
  // .show-more {
  //   line-height: 40px;
  //   padding-right: 20px;
  //   display: flex;
  //   flex-direction: row-reverse;
  //   span {
  //     color: #2D72D3;
  //     cursor: pointer;
  //     text-decoration: underline;
  //   }
  // }

  .door-status-list {
    // height: calc(~"100% - 90px");
    height: calc(~"100% - 60px");
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    overflow: auto;

    .door-status-item {
      width: 46%;
      height: 150px;
      margin-bottom: 15px;
      /deep/ .el-card__body  {
        padding: 10px;
        height: 100%;
        display: flex;
        justify-content: space-around;
        .organize-info {
          width: 30%;
          padding-top: 38px;
          p {
            width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: bottom;
            font-size: 14px;
          }
        }
        .first-door {
          width: 30%;
          text-align: center;
        }
        .second-door {
          width: 30%;
          text-align: center;
        }
      }

      &:hover {
        border: 1px solid #2D72D3;
      }
    }
  }
  .door-status-list:after {
    content: "";
    width: 46%;
  }

  /* 当前正在处理的金库状态 */
  .current-dispose-door {
    width: 100%;
    height: 300px;
    padding: 20px;
    h3 {
      font-size: 16px;
      margin-left: 30px;
    }
    .current-door-state {
      font-size: 14px;
      width: 80%;
      padding-top: 30px;
      display: flex;
      p {
        line-height: 36px;
        margin-left: 30px;
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        span {
          margin-right: 5px;
        }
      }
      .organize-info {
        flex: 5;
        padding: 20px 0 0 60px;
      }
      .first-door {
        flex: 3;
        text-align: center;
      }
      .second-door {
        flex: 3;
        text-align: center;
      }
    }
  }

  .currentdoor-div {
    width: 70px;
    height: 80px;
    margin: 10px auto;
    // border: 5px solid #666666;
    position: relative;
  }

  /* 门禁开启状态 */
  // .open-door {
  //   width: 70px;
  //   height: 80px;
  //   margin: 10px auto;
  //   border: 5px solid #666666;
  //   position: relative;
  //   .handle {
  //     width: 16px;
  //     border: 3px solid red;
  //     position: absolute;
  //     top: 50%;
  //     left: 44px;
  //     transform: translateY(-3px);
  //   }
  // }
  /* 门禁关闭状态 */
  // .close-door {
  //   width: 70px;
  //   height: 80px;
  //   margin: 10px auto;
  //   border: 5px solid #666666;
  //   position: relative;
  //   .handle {
  //     height: 20px;
  //     border: 3px solid #666666;
  //     position: absolute;
  //     top: 50%;
  //     left: 44px;
  //     transform: translateY(-10px);
  //   }
  // }
  /* 门禁异常状态 */
  // .unusual-door {
  //   width: 30px;
  //   height: 30px;
  //   position: absolute;
  //   left: 0;
  //   bottom: 0;
  //   .icon {
  //     width: 30px;
  //     height: 30px;
  //     fill: currentColor;
  //     overflow: hidden;
  //   }
  // }
}
</style>
