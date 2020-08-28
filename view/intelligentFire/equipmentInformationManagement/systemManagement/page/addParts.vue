<!--
 * @Author: shikai
 * @Date: 2020-07-09 19:47:56
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-09 20:14:57
-->
<template>
    <div class="addParts">
        <el-form ref="addForm" size="mini" :model="formData" label-position="right" label-width="120px">
            <el-form-item label="设施名称">
                <el-input v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="部件名称" required>
                <el-input placeholder="输入设备名称" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="部件型号" required>
                <el-input placeholder="输入设备名称" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="部件区号" required>
                <el-input placeholder="输入设备名称" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="部件回路号" required>
                <el-input placeholder="输入设备名称" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="部件位号" required>
                <el-input placeholder="输入设备名称" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="安装位置" required>
                <el-input placeholder="输入设备名称" v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="部件状态">
                <el-select v-model="formData.deviceName">
                    <el-option
                            v-for="item in partsStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态描述" required>
                <el-input v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="资产编码" required>
                <el-input v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="是否关联" required>
                <el-select v-model="formData.deviceName">
                    <el-option
                            v-for="item in partsRelation"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
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
        deviceName: ''
      }
    }
  }
}
</script>

<style>

</style>
