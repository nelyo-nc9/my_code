<template>
  <component :is="childrenComponent"
             :deviceData="deviceModel"
             :optType="optType"
             @modelChange="modelChange"></component>
</template>

<script>
import AddEquipment from './AddEquipment'
import EquipmentList from './EquipmentList'
import SearchEquipment from './SearchEquipment'
import ImportEquipment from './ImportEquipment'
// import Import from './Import'
// import Search from './Search'
import Info from './Info'

export default {
  components: {
    AddEquipment,
    EquipmentList,
    SearchEquipment,
    ImportEquipment,
    Info,
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'AddEquipment',
    },
  },
  watch: {
    childrenComponent() {
      this.$forceUpdate()
    },
  },
  data() {
    return {
      // currentComponent: 'List',
      deviceModel: {},
      optType: 'AddEquipment', // 区分新建和删除
    }
  },
  methods: {
    modelChange(obj, type) {
      console.log(obj)
      this.deviceModel = obj
      this.optType = type
    },
  },
}
</script>

<style lang="less" scoped>
</style>
