<template>
  <div class="content">
    <div class="content-left" :style="{width: isOpenPanel ? '195px' : '28px'}">
      <div class="arrow" @click="togglePanel">
        <i :class="isOpenPanel ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
      </div>
      <ul v-show="isOpenPanel">
        <li v-for="(item, index) in tabs" :key="index">
          <span @click="showToggle(item,index)" class="oneMenu">
            {{item.label}}
            <i
              :class="{'el-icon-arrow-up': item.isSubShow, 'el-icon-arrow-down': !item.isSubShow}"
              class="icon"
            ></i>
          </span>
          <ul v-show="item.isSubShow">
            <li
              v-for="item in item.items"
              :key="item.index"
              class="oneMenuChild"
              :class="{'active': componentId === item.index}"
              @click="changeTab(item.index)"
            >
              <span>{{item.label}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="content-right">
      <component :is="componentId" @addItem="showAddItem"></component>
    </div>
  </div>
</template>

<script>
import personnerlList from '../components/overtime/personnerlList' // 申请列表
import holidaypendingList from '../components/overtime/holidaypendingList' // 待审批列表
import hoildayAppoverList from '../components/overtime/hoildayAppoverList' // 已审批列表
import holidayInquire from '../components/overtime/holidayInquire' // 查询
import holidayNewForm from '../components/overtime/holidayNewForm' // 新建组件
export default {
  components: {
    personnerlList,
    holidaypendingList,
    hoildayAppoverList,
    holidayInquire,
    holidayNewForm
  },
  data() {
    return {
      componentId: 'personnerlList',
      isOpenPanel: true,
      tabs: [
        {
          index: 'personnerlList',
          label: '加班人员管理',
          isSubShow: true,
          items: [
            { index: 'personnerlList', label: '申请列表' },
            { index: 'holidaypendingList', label: '待审批列表' },
            { index: 'hoildayAppoverList', label: '已审批列表' },
            { index: 'holidayInquire', label: '查询' }
          ]
        }
      ]
    }
  },
  mounted() {},
  methods: {
    showAddItem(flag) {
      if (flag) {
        this.componentId = 'holidayNewForm'
      } else {
        this.componentId = 'personnerlList'
      }
    },
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    },
    changeTab(item) {
      this.componentId = item
    },
    showToggle(item, index) {
      if (!item.items) {
        this.changeTab(item.index)
      } else {
        item.isSubShow = !item.isSubShow
      }
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
    ul {
      cursor: pointer;
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
