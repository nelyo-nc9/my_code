<template>
    <div class="assistantProgress">
      <div class="assistantProgressTitle">
        <span>当前位置：</span>
        <span>协查管理 > </span>
        <span>协查事件 > </span>
        <span>协查进展列表</span>
      </div>
      <div class="assistantProgressBtn">
        <el-button>结束协查</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
      <div class="queryassistantProgresslist">
        <el-row type="flex" justify="center">
          <el-col :span="19">
            <el-card shadow="hover">
              <form-view :userId="getUserData.userId"></form-view>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
import FormView from '../../components/FormView'
import {mapGetters} from 'vuex'
export default {
  name: 'assistantProgress',
  created() {
    console.log(this.$route)
  },
  components: {
    FormView
  },
  methods: {
    close() {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapGetters('assistantManageMenu/admin', ['getUserData'])
  }
}
</script>

<style scoped lang="less">
  .assistantProgress{
   flex: auto;
    .assistantProgressTitle{
      padding: 15px 0;
    }
    .assistantProgressBtn{
      display: flex;
      /deep/ .el-button{
            width: 70px;
            height: 30px;
            font-size: 12px;
            color: #000000;
            text-align: center;
            background-color: rgba(255, 255, 255, 1);
            border-color: rgba(22, 155, 213, 1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
    }
    .queryassistantProgresslist{
     padding-top: 15px;
    }
  }

</style>
