<!-- 对讲平台配置 -->
<template>
  <component :is="childComponent" @modelChange="modelChange" :detailData="detailData" :selectAllData="selectAllData" :pagetype="pagetype"></component>
</template>
<script>
import Create from './Create'   // 对讲平台新建
import List from './List'  // 对讲平台列表
import Import from './Import' // 导入
import Search from './Search'  // 查询
import edit from "./edit"  // 编辑
import examine from "./examine"  // 查看
import examinelook from "./examinelook";  // 新建-查看
import sort from "./sort"  // 排序
import migtate from "./migtate"  // 迁移
import { mapMutations } from 'vuex'

export default {
  name: '',
  components: {
    Create,
    List,
    Import,
    Search,
    edit,
    examine,
    sort,
    migtate,
    examinelook
  }, 
  data() {
    return {
      childComponent : this.childrenComponent ,  // 默认子组件
      detailData:{},  // 传递给 编辑，查看的对象值
      selectAllData:[],  // 选中的数组
      pagetype:'',  // 区分 来源页面 
    }
  },
  props:{
       childrenComponent: {
        type: String,   
        default: 'List'
    }
  },
  watch: {
    childrenComponent(){
      this.childComponent = this.childrenComponent;
    }
  },

  methods: {
    ...mapMutations(['AUDIO_TAB']),
    // 改变子组件
    modelChange(name,data,selectAllData,pagetype) {
      console.log(name)
      this.childComponent = name;
      if (data == 'cancel') {
        this.AUDIO_TAB('IntercomPlatform-List')
      }
      this.detailData = data;
      this.selectAllData = selectAllData;
      this.pagetype = pagetype;
    }
  },
  created() {
    
  },
  computed: {
    
  },
}
</script>
<style lang="less" scoped>
  
</style>