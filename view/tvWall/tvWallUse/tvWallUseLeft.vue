<template>
  <div class="left-con">
    <div class="foldWrap">
      <div class="foldTop">
        <div class="tabs"
             :class="{ 'active-tab': changPage === index }"
             v-for="(label, index) in tabLabels"
             :key="label"
             @click="changeContenMethod(label, index)">
          {{ label }}
        </div>
      </div>
      <div class="foldContend"
           v-if="contendFlag">
        <div class="tab-pane"
             v-if="changPage === 0">
          <organization v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></organization>
        </div>
        <div class="tab-pane"
             v-if="changPage === 1">
          <favorites v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></favorites>
        </div>
        <div class="tab-pane"
             v-if="changPage === 2">
          <polling :usePage="whoPageFlag"
                   v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></polling>
        </div>
        <div class="tab-pane"
             v-if="changPage === 3">
          <scene :usePage="whoPageFlag"
                 v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></scene>
        </div>
        <div class="tab-pane"
             v-if="changPage === 4">
          <plan :usePage="whoPageFlag"
                v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></plan>
        </div>
      </div>
      <div class="foldTop">
        <div class="tabs1"
             :class="{ 'active-tab': changPage1 === index }"
             v-for="(label, index) in tabLabels2"
             :key="label"
             @click="changeContenMethod(label, index)">
          {{ label }}
        </div>
      </div>
      <div class="foldContend"
           v-if="!contendFlag">
        <div class="tab-pane"
             v-if="changPage1 === 1 && tabLabels2.length != 1">
          <localTerminal v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></localTerminal>
        </div>
        <div class="tab-pane"
             v-if="changPage1 === 2 && tabLabels2.length != 1">
          <layout :usePage="whoPageFlag"
                  v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></layout>
        </div>
        <div class="tab-pane"
             v-if="changPage1 === 0">
          <PreviewControler :showImageEdjust="showImageEdjust"
                            :pluginStatus="pluginStatus"
                            v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></PreviewControler>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import PreviewControler from './yuntai/PreviewControler'
import PreviewControler from '../../videoManage/preview/yuntai/PreviewControler'
import favorites from '../tvWallSet/favorites'
import organization from '../tvWallSet/organization'
import polling from '../tvWallSet/Tvpolling'
import scene from '../tvWallSet/scene'
import plan from '../tvWallSet/plan'
import layout from '../tvWallSet/layOut'
import localTerminal from '../tvWallSet/localTerminal'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  components: {
    PreviewControler,
    favorites,
    organization,
    polling,
    scene,
    plan,
    layout,
    localTerminal
  },
  data() {
    return {
      key: '1',
      tabLabels: ['机构', '收藏夹', '轮巡', '场景', '预案'],
      tabLabels2: ['云台控制'],
      changPage: 0,
      changPage1: '',
      contendFlag: true,
      whoPageFlag: true, // 传送给子组件
      // 云台所需参数
      showImageEdjust: false,
      pluginStatus: {
        isPlay: true,
        source: {
          devIp: '',
          devCport: '',
          channel: ''
        }
      }
    }
  },
  computed: {
    ...mapState({
      tvWallData: ({ tvWall }) => tvWall.allTvWallList, // 接受电视墙发送出来的信息
      playParams: ({ tvWall }) => tvWall.playParams // 判断拖拽的什么东西上墙:资源还是轮巡等
    })
  },
  watch: {
    tvWallData: function (newmess, oldmess) {
      if (this.contendFlag) {
        // this.changPage = 0
      } else if (newmess.type === 1) {
        if (newmess.type === oldmess.type) {
          console.log('两次电视墙属性一致')
        } else {
          // 从拼控一体机电视墙切换到普通电视墙时
          this.changPage1 = ''
          this.changPage = 0
          this.contendFlag = true
        }
      }
      this.changeTabels()
    },
    playParams: {
      // 监听对象时要deep:true
      handler(newVal, oldVal) {
        this.pluginStatus.source.devIp = newVal.ip
        this.pluginStatus.source.devCport = Number(newVal.cport)
        this.pluginStatus.source.channel = Number(newVal.serise)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['SET_TABLE_INDEX1']),
    changeContenMethod(val, index) {
      // 左侧菜单上下滑动
      if (val === '机构' || val === '轮巡' || val === '场景' || val === '收藏夹' || val === '预案') {
        this.contendFlag = true
        this.changPage1 = ''
        this.changPage = index
      } else {
        this.contendFlag = false
        this.changPage1 = index
        this.changPage = ''
      }
    },
    /**
   *  判断该电视墙是什么类型的电视墙
   * tvWallData.type === 1(M3) || tvWallData.type === 4(M3+b20)
   * tvWallData.type === 2(b20)
   * */
    changeTabels() {
      if (this.tvWallData.type === 1 || this.tvWallData.type === 4) {
        this.tabLabels2 = ['云台控制']
      } else if (this.tvWallData.type === 2) {
        this.tabLabels2 = ['云台控制', '本地终端输入', '布局']
      }
    }
  },
  created() {
    this.changeTabels()
  }
}
</script>
<style scoped>
.foldWrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.foldTop {
  height: 38px;
  background: #999999;
  border-bottom: 1px solid gainsboro;
}
.foldContend {
  flex: 1;
  overflow: hidden;
}

.left-con .tabs.active-tab {
  color: #fff;
  background: #2d72d3;
}
.left-con .tabs1.active-tab {
  color: #fff;
  background: #2d72d3;
}
.left-con {
  width: 340px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-left: 5px;
}
.fresh-con {
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
  color: #fff;
  z-index: 2;
  background-color: #2d72d3;
  width: 34px;
  height: 40px;
  line-height: 38px;
  text-align: center;
}
.left-con .tabs-box {
  height: 38px;
  background-color: #2d72d3;
}
.left-con .tabs {
  width: 67px;
  display: inline-block;
  padding: 11px 10px;
  cursor: pointer;
  text-align: center;
}
.left-con .tabs1 {
  width: 92px;
  display: inline-block;
  padding: 11px 10px;
  cursor: pointer;
  text-align: center;
}

.tab-pane {
  width: 100%;
  height: 100%;
  flex: 1;
}
.tabs:hover {
  color: #4699f9;
}
.tabs1:hover {
  color: #4699f9;
}
</style>
