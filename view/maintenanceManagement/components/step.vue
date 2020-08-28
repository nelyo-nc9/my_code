
<template>
    <div class="titleBox">
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>维保管理</el-breadcrumb-item>
        <el-breadcrumb-item :style="{'color': secondTitle && !title ? '#2D72D3' : '#606266'}">{{secondTitle}}</el-breadcrumb-item>
        <el-breadcrumb-item style="color: #2D72D3;" v-if="title">{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
  name: '',
  props: ['title', 'secondTitle'],
  data() {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
</style>
