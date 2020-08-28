<!--
 * @Author: shikai
 * @Date: 2020-07-17 16:32:18
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-17 17:12:17
-->
<template>
    <div class="addParts">
        <el-form ref="addForm" size="mini" :model="formData" label-position="right" label-width="120px">
            <el-form-item label="所属机构">
                <el-input v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="所属机构" required>
                <el-input placeholder="输入所属公司" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="所属重点部位">
              <el-row>
                <el-col :span="11">
                  <el-select v-model="formData.deviceName" style="width:100%">
                      <el-option
                              v-for="item in partsStatus"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                      ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="11" :offset="2">
                  <el-select v-model="formData.deviceName" style="width:100%">
                      <el-option
                              v-for="item in partsStatus"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                      ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="巡检任务内容" required>
                <el-select v-model="formData.deviceName" style="width:100%">
                    <el-option
                            v-for="item in partsRelation"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="巡检频率" required>
                <el-radio-group v-model="formData.resource">
                  <el-radio label="每日"></el-radio>
                  <el-radio label="每周"></el-radio>
                  <el-radio label="每月"></el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      partsStatus: [{
        label: '正常',
        value: '正常'
      }, {
        label: '报警',
        value: '报警'
      }, {
        label: '故障',
        value: '故障'
      }, {
        label: '其他',
        value: '其他'
      }],
      partsRelation: [{
        label: '是',
        value: '是'
      }, {
        label: '否',
        value: '否'
      }],
      formData: {
        deviceName: '',
        resource: '',
        time: ''
      }
    }
  }
}
</script>

<style>

</style>
