
<template>

  <div class="pageContent">
    <!-- 打印按钮上添加   v-print="'#contentinfo'"   -->
    <el-button  v-print="'#contentinfo'">打印</el-button>
    <!-- 需要打印的部分用一个有ID的div包起来  -->
    <div id="contentinfo">
      <div class="box1">111111111</div>
      <div class="box2">222222222</div>
    </div>

  </div>
</template>

<script>
export default {

  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
//页面展示的样式
.box1 {
  width: 200px;
  height: 200px;
  background-color: rgb(204, 204, 204);
  border: 10px solid #ccc;
}
.box2 {
  margin-top: 50px;
  width: 100px;
  height: 100px;
  background-color: rgb(59, 59, 59);
  border: 2px solid #000;
}

//打印需要的样式（可以和页面展示样式一样，需要微调）
@media print {
  #contentinfo {
    margin-top: 200px;
    margin-left: 500px;
    .box1 {
      width: 100px;
      height: 100px;
      background-color: rgb(59, 59, 59);
      border: 2px solid #ccc;
    }
    .box2 {
      margin-top: 50px;
      width: 200px;
      height: 200px;
      background-color: rgb(204, 204, 204);
      border: 10px solid #000;
    }
  }
}
</style>
