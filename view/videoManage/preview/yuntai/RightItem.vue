<template>
  <div class='dbcount'>
    <i class='add iconfont icon-add'
       @mouseup="$emit('stopAdd')"
       @mousedown="$emit('startAdd')"></i>
    <b>{{title}}</b>
    <i class='reduce iconfont icon-reduce'
       @mouseup="$emit('stopMinus')"
       @mousedown="$emit('startMinus')"></i>
  </div>
</template>
<script>
export default {
  name: 'BStimes',
  props: ['title']
}
</script>

<style lang="less" scoped>
.dbcount {
  overflow: hidden;
  margin: 2px 0;
  width: 44%;
  height: 33px;
  border-radius: 16px;
  border: 1px solid rgba(233, 233, 233, 1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  i {
    cursor: pointer;
    width: 40px;
    height: 33px;
    font-size: 18px;
    text-align: center;
    line-height:33px;
    font-style: normal;
    user-select: none;
    background: #fff;
    color: #2D71D3;
    &:hover {
      color: rgb(70, 153, 248);
    }
    &:active {
      color: rgb(45, 113, 211);
    }
  }
  b {
    height: 33px;
    line-height: 33px;
    width: 40px;
    color: #656565;
    font-size: 12px;
    text-align: center;
    font-weight: normal;
    user-select: none;
  }
}
</style>
