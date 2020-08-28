<template>
  <div class="content">
    <div class="content-left" :style="{width: isOpenPanel ? '195px' : '28px'}">
      <div class="arrow" @click="togglePanel">
        <i :class="isOpenPanel ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
      </div>
      <ul v-show="isOpenPanel">
        <span class="oneMenu" @click="isRegioLists">审批流程管理</span>
        <span class="oneMenu" @click="isRegioList">人员分级管理</span>
      </ul>
    </div>
    <div class="content-right">
      <component :is="componentId"></component>
    </div>
  </div>
</template>

<script>
import Process from "./process"
import People from "./people"


import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    Process,
    People,
  },
  data() {
    return {
      isOpenPanel: true,
    }
  },
  watch: {},
  computed: {
    ...mapState({
      componentId: ({ protectiveCabin }) => protectiveCabin.componentId
    })
  },
  created() {
    this.SET_EQUIPMENT_COMPONENTID('Process')
  },
  mounted() {},
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    isRegioLists(){
      this.SET_EQUIPMENT_COMPONENTID('Process')
    },
    isRegioList(){
      this.SET_EQUIPMENT_COMPONENTID('people')
    },
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    }
  }
}
</script>

<style scoped lang='less'>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .content-left {
    width: 195px;
    height: 1000px;
    background: rgba(245, 245, 245, 1);
    position: relative;
    .arrow {
      width: 18px;
      height: 62px;
      background: rgba(230, 230, 230, 1);
      box-shadow: 0px 0px 6px 0px rgba(44, 44, 44, 0.1);
      position: absolute;
      right: 0;
      top: 50%;
      bottom: 50%;
      line-height: 62px;
      text-align: center;
    }
    width: 195px;
    height: 1000px;
    background: rgba(245, 245, 245, 1);
    .oneMenu {
      width: 195px;
      height: 40px;
      background: rgba(225, 225, 225, 1);
      padding: 0 20px;
      line-height: 40px;
      display: block;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(34, 34, 34, 1);
      &:hover {
        background-color: #d7ebf2;
      }
    }
    .icon {
      float: right;
      cursor: pointer;
      width: 11px;
      height: 6px;
      line-height: 40px;
    }
    .oneMenuChild {
      width: 195px;
      height: 40px;
      padding: 0 20px;
      display: block;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(34, 34, 34, 1);
      line-height: 46px;
      &:hover {
        color: #538bda;
      }
    }
    .active {
      color: #538bda;
      border-left: 4px #538bda solid;
    }
  }
  .content-right {
    flex: 1;
    width: 1434px;
    height: 1000px;
    padding: 10px 0;
  }
}
</style>
