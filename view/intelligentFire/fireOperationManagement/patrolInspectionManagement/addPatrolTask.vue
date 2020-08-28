<!--
 * @Author: shikai
 * @Date: 2020-07-17 17:11:07
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-17 17:24:45
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
                <el-select v-model="formData.deviceName" style="width:100%">
                    <el-option
                            v-for="item in partsStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="巡检任务名称" required>
                <el-input placeholder="输入巡检任务名称" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="选择巡检点" required>
                <el-select v-model="value1" multiple filterable placeholder="请选择" style="width:100%">
                  <el-option
                    v-for="item in partsRelation"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="巡检单位" required>
                <el-select v-model="formData.deviceName" style="width:100%">
                    <el-option
                            v-for="item in partsRelation"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择巡检人" required>
                <el-select v-model="formData.deviceName" style="width:100%">
                    <el-option
                            v-for="item in partsRelation"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" required>
                <el-date-picker v-model="formData.time" type="date" placeholder="选择日期" style="width:100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" required>
                <el-date-picker v-model="formData.time" type="date" placeholder="选择日期" style="width:100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="巡检频率" required>
                <el-select v-model="formData.deviceName" style="width:100%">
                    <el-option
                      v-for="item in partsRelation"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="巡检规则" required>
                <el-radio-group v-model="formData.resource">
                  <el-radio label="自动生成(循环巡检任务)"></el-radio>
                  <el-radio label="手动生成(临时巡检任务)"></el-radio>
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
