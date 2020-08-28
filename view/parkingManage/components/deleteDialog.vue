<!--
 * @Author: your name
 * @Date: 2020-06-13 15:54:35
 * @LastEditTime: 2020-06-15 15:01:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\components\deleteDialog.vue
-->
<template>
  <div>
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="20%">
      <span>确定要删除所选设备吗?</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="deleteBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'deleteDialog',
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    deleteBtn() {
      this.$emit('deleteInfo')
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog__header {
  padding: 5px 20px 5px;
  background: rgba(242, 242, 242, 1);
}
/deep/.el-dialog__headerbtn {
  top: 10px;
}
</style>
