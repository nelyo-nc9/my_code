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
      listType: '待审批',
      listTitle: '携物报备申请单审批',
      editData: '', // 数据
      componentTitle: ['待审批列表', '列表', '审批'],
      defaultMenu: {
        index: 'WaitApprovalList',
        label: '待审批列表'
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
