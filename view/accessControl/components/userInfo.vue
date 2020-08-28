<template>
  <div id="userInfo">
    <ul class="box">
      <li class="boxItem">
        <i class="itemTitle">录入时间</i>
        <span>{{Info.updatedAt || '--'}}</span>
      </li>
      <li class="boxItem">
        <i class="itemTitle">录入机构</i>
        <span>{{Info.updatedDept || '--'}}</span>
      </li>
      <li class="boxItem">
        <i class="itemTitle">录入人</i>
        <span>{{Info.updatedBy || '--'}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { time } from '@src/view/accessControl/components/formData.js'
import { mapMutations } from 'vuex'
export default {
  props: ['Info'],
  data() {
    return {}
  },
  created() {},
  methods: {},
  computed: {},
  mounted() {},
}
</script>

<style lang="less" scoped>
#userInfo {
  border: 1px solid rgba(225, 225, 225, 1);
  margin: 20px 0;
  .box {
    display: flex;
    margin: 0 auto;
    .boxItem {
      height: 35px;
      display: flex;
      flex: 1;
      .itemTitle {
        padding: 0 10px;
        width: 30%;
        display: block;
        text-align: center;
        background: #f5f5f5;
        height: 35px;
        line-height: 35px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(33, 33, 33, 1);
      }
      span {
        padding: 0 10px;
        height: 35px;
        line-height: 35px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(33, 33, 33, 1);
      }
    }
  }
}
</style>