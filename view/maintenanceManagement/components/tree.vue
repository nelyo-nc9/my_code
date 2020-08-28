
<template>
    <div class="treeBox">
        <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="treeValue"
            style="height:35px;">
        </el-input>
        <el-tree style="width:100%; height:100%; margin-top:15px;" :data="treeData"
            :props="defaultProps" @node-click="handleNodeClick" default-expand-all
        ></el-tree>
    </div>
</template>

<script>
export default {
  name: '',
  components: {

  },
  data() {
    return {
      treeValue: '',
      treeData: [
        { label: '保定分行',
          children: [
            {label: '融汇支行'},
            {label: '城建支行'},
            {label: '高开区支行'},
            {label: '融汇支行',
              children: [
                {label: '城区分理处'},
                {label: '中兴区分理处'},
                {label: '西城分理处'}
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  },
  created() {
  }
}
</script>

<style lang="less" scoped>
    .treeBox{
      width:290px;
      height:100%;
      box-sizing: border-box;
      padding:10px;
    }
</style>
