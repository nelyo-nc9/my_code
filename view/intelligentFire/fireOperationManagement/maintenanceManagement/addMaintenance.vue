<!--
 * @Author: shikai
 * @Date: 2020-07-16 21:08:44
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-16 21:28:36
-->
<template>
    <div class="addParts">
        <el-form ref="addForm" size="mini" :model="formData" label-position="right" label-width="120px">
            <el-form-item label="所属机构">
                <el-input v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="所属重点部位">
                <el-select v-model="formData.deviceName" style="width:100%;">
                    <el-option
                            v-for="item in partsStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务名称" required>
                <el-select v-model="formData.deviceName" style="width:100%;">
                    <el-option
                            v-for="item in partsRelation"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属公司" required>
                <el-input placeholder="输入所属公司" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="维保人员" required>
                <el-input placeholder="输入维保人员" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" required>
                <el-input placeholder="输入联系方式" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="维保内容" required>
                <el-input placeholder="输入维保内容" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="任务截止时间" required>
                <el-date-picker v-model="formData.time" type="date" placeholder="选择日期" style="width:100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="维保规则" required>
                <el-radio-group v-model="formData.resource">
                  <el-radio label="每周维保"></el-radio>
                  <el-radio label="每月维保"></el-radio>
                  <el-radio label="每季维保"></el-radio>
                  <el-radio label="每年维保"></el-radio>
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
