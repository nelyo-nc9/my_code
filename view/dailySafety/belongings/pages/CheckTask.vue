<template>
  <component
    :is="componentId"
    :listType="listType"
    :editData="editData"
    :componentTitle="componentTitle"
    :listTitle="listTitle"
    @changeComponent="changeComponent"
    @defaultComponent="defaultComponent"
  ></component>
</template>
<script>
import ApplyList from './ApplyList'
import AddApply from './components/AddApply'
export default {
  components: {
    ApplyList,
    AddApply
  },
  data() {
    return {
      componentId: 'ApplyList',
      listType: '核查',
      listTitle: '携物申请审批记录单',
      editData: '', // 数据
      componentTitle: ['核查任务管理', '列表', '查看'],
      defaultMenu: {
        index: 'CheckTask',
        label: '核查任务管理'
      }
    }
  },
  methods: {
    changeComponent(index, title, listTitle, item) {
      // this.componentId = index
      // this.componentTitle = title
      // this.listTitle = listTitle
      // // if (title === '机构管理查询') {
      // //   this.defaultMenu = index
      // // }
      // if (item) {
      //   this.editData = item
      // }
      console.log(arguments)
      // 跳转页面
      this.$emit('changeComponent', 'AddApply', title, listTitle)
    },
    defaultComponent() {
      console.log(this.defaultMenu)
      this.componentId = this.defaultMenu.index
      this.componentTitle = [this.defaultMenu.label, '列表']
    }
  }
}
</script>
