<template>
  <div class="pull-down">
    <div>
      <el-form class="inp">
        <el-form-item label="部位类型">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form class="inp">
        <el-form-item label="对讲状态">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="对讲名称">
          <el-input v-model="form.name" class="inp"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="btn" size="mini">查询</el-button>
      <el-button class="btn" size="mini">重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
        form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
    }
  }
}
</script>

<style lang="less" scoped>
.pull-down {
  width: 1444px;
  height: 27px;
  margin-top: -25px;
  div {
    display: flex;
    width: 100%;
    .inp {
      width: 300px;
      height: 10px;
    }
    /deep/ .el-input__inner {
      width: 200px;
      height: 28px;
      border-radius: 0px;
      margin-top: 7px;
    }
    .btn {
      width: 70px;
      height: 25px;
      margin-top: 5px;
    }
  }
}
</style>
