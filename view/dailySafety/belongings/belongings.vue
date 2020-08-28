<template>
  <div class="content">
    <div class="content-left" :style="{ width: isOpenPanel ? '195px' : '28px' }">
      <div class="arrow" @click="togglePanel">
        <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <ul v-show="isOpenPanel">
        <li v-for="(item, index) in tabs" :key="index">
          <span @click="showToggle(item, index)" class="oneMenu">
            {{ item.label }}
            <i :class="{ 'el-icon-arrow-up': item.isSubShow, 'el-icon-arrow-down': !item.isSubShow }" class="icon"></i>
          </span>
          <ul v-show="item.isSubShow">
            <li
              v-for="item in item.items"
              :key="item.index"
              class="oneMenuChild"
              :class="{ active: componentId === item.index }"
              @click="changeTab(item)"
            >
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="content-right">
      <div class="header">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item style="font-size:12px;">携物管理</el-breadcrumb-item>
          <el-breadcrumb-item style="font-size:12px;" v-for="(item, index) in componentTitle" :key="index">{{
            item
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <component
        :is="componentId"
        :listType="listType"
        :editData="editData"
        :componentTitle="componentTitle"
        :listTitle="listTitle"
        @changeComponent="changeComponent"
        @defaultComponent="defaultComponent"
      ></component>
    </div>
  </div>
</template>

<script>
import AddApply from './pages/components/AddApply'
import ApplyList from './pages/ApplyList'
import WaitApprovalList from './pages/WaitApprovalList'
import HadApprovalList from './pages/HadApprovalList'
import CheckTask from './pages/CheckTask'
import ApplyStatic from './pages/ApplyStatic'
import ApplySearch from './pages/ApplySearch'
import DangerousList from './pages/DangerousList'
import DangerSearch from './pages/DangerSearch'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    ApplyList,
    WaitApprovalList,
    HadApprovalList,
    CheckTask,
    AddApply,
    ApplyStatic,
    ApplySearch,
    DangerousList,
    DangerSearch
  },
  data() {
    return {
      isOpenPanel: true,
      listType: '申请', // 页面类型
      componentId: 'ApplyList',
      defaultMenu: {
        index: 'ApplyList',
        label: '申请列表'
      }, // 默认导航
      componentTitle: ['申请列表', '列表'],
      listTitle: '携物申请单',
      editData: '', // 数据
      tabs: [
        {
          index: 'belongings',
          label: '携物管理',
          isSubShow: true,
          items: [
            { index: 'ApplyList', label: '申请列表' },
            { index: 'WaitApprovalList', label: '待审批列表' },
            { index: 'HadApprovalList', label: '已审批列表' },
            { index: 'CheckTask', label: '核查任务管理' },
            { index: 'ApplyStatic', label: '统计' },
            { index: 'ApplySearch', label: '查询' }
          ]
        },
        {
          index: 'Dangerous',
          label: '危险品核查记录',
          isSubShow: true,
          items: [
            { index: 'DangerousList', label: '列表' },
            { index: 'DangerSearch', label: '查询' }
          ]
        }
      ]
    }
  },
  watch: {},
  computed: {
    ...mapState({
      // componentId: ({ protectiveCabin }) => protectiveCabin.componentId
    })
  },
  created() {
    this.SET_EQUIPMENT_COMPONENTID('ApplyList')
  },
  mounted() {},
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    showToggle(item, index) {
      this.tabs.forEach(i => {
        if (i.isSubShow !== this.tabs[index].isSubShow) {
          i.isSubShow = false
        }
      })
      item.isSubShow = !item.isSubShow
      let componentValue = ''
      componentValue = item.items[0].index === 'AddEquipment' ? 'EquipmentList' : item.items[0].index
      this.SET_EQUIPMENT_COMPONENTID(componentValue)
    },
    changeTab(item) {
      console.log(item)
      this.defaultMenu = item
      let index = item.index
      if (index === 'ApplyStatic' || index === 'ApplySearch') {
        this.changeComponent(item.index, [item.label])
      } else if (index === 'DangerousList' || index === 'DangerSearch') {
        this.changeComponent(item.index, ['危险品核查记录', item.label])
      } else {
        this.changeComponent(item.index, [item.label, '列表'])
      }
    },
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    },
    changeComponent(index, title, listTitle, item) {
      this.componentId = index
      this.componentTitle = title
      this.listTitle = listTitle
      // if (title === '机构管理查询') {
      //   this.defaultMenu = index
      // }
      if (item) {
        this.editData = item
      }
    },
    defaultComponent() {
      console.log(this.defaultMenu)
      let index = this.defaultMenu.index
      this.componentId = index
      console.log(index)
      if (index === 'ApplyStatic' || index === 'ApplySearch') {
        this.componentTitle = [this.defaultMenu.label]
      } else if (index === 'DangerousList' || index === 'DangerSearch') {
        this.componentTitle = ['危险品核查记录', this.defaultMenu.label]
      } else {
        this.componentTitle = [this.defaultMenu.label, '列表']
      }
    }
  }
}
</script>

<style scoped lang="less">
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
    padding: 10px 20px;
  }
}
</style>
