<template>
  <div class="content">
    <div class="content-left" :style="{width: isOpenPanel ? '195px' : '28px'}">
      <div class="arrow" @click="togglePanel">
        <i :class="isOpenPanel ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
      </div>
      <ul v-show="isOpenPanel">
        <li
          v-for="(item, index) in tabs"
          :key="index">
          <span @click="showToggle(item,index)" class="oneMenu" :class="{'changeBackground': !item.items, 'changeStyle': item.isActivedStyle}">
            {{item.label}}
            <i
              :class="{'el-icon-arrow-up': item.isSubShow && item.items, 'el-icon-arrow-down': !item.isSubShow && item.items}"
              class="icon"
            ></i>
          </span>
          <ul v-show="item.isSubShow && item.items">
            <li
              v-for="item in item.items"
              :key="item.index"
              class="oneMenuChild"
              :class="{'active': componentId === item.index}"
              @click="changeTab(item.index)"
            >
              <span>{{item.label}}</span>
              <span class="redWait"></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="content-right">
      <component :is="componentId" @addItem="showAddItem" @close="showAddItem"></component>
    </div>
  </div>
</template>

<script>
import constructionList from '../components/overtime/constructionList' // 施工申请列表
import pendingList from '../components/overtime/pendingList' // 施工待审批列表
import approvedList from '../components/overtime/approvedList' // 施工已审批列表
import inquire from '../components/overtime/inquire' // 查询
import newForm from '../components/overtime/newForm' // 施工信息查询
import HostList from '../components/overtime/hostList' // 施工区域管理

export default {
  components: {
    constructionList,
    pendingList,
    approvedList,
    inquire,
    newForm,
    HostList
  },
  data() {
    return {
      componentId: 'constructionList',
      isOpenPanel: true,
      tabs: [
        {
          index: 'constructionList',
          label: '施工加班申请',
          isSubShow: true,
          isActivedStyle: false,
          items: [
            { index: 'constructionList', label: '申请列表' },
            { index: 'pendingList', label: '待审批列表' },
            { index: 'approvedList', label: '已审批列表' },
            { index: 'inquire', label: '查询' }
          ]
        },
        {
          index: 'HostList',
          label: '施工区域管理',
          isSubShow: false,
          isActivedStyle: false
        }
      ]
    }
  },

  computed: {
    component: function() {
      return this.componentId
    }
  },
  methods: {
    showAddItem(flag) {
      if (flag) {
        this.componentId = 'newForm'
      } else {
        this.componentId = 'constructionList'
      }
    },
    // 菜单切换组件时,初始化
    changeComponent() {
      this.tabs.forEach(element => {
        element.isActivedStyle = false
      })
    },
    changeTab(item) {
      this.changeComponent()
      this.componentId = item
    },
    showToggle(item, index) {
      // this.changeComponent()
      if (!item.items) {
        this.changeTab(item.index)
        item.isActivedStyle = true
      } else {
        item.isSubShow = !item.isSubShow
      }
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
        // background-color: #d7ebf2;
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
    .changeBackground:hover{
      background-color: rgba(223, 245, 252, 1);
    }
    .changeStyle {
      border: 1px solid rgba(1, 194, 255, 1);
      background-color: rgba(223, 245, 252, 1);
    }
  }
  .content-right {
    flex: 1;
    width: 1434px;
    height: 1000px;
    padding: 10px 0;
  }
  .redWait {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 84px;
    left: 184px;
  }
}
</style>
