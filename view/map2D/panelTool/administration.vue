<template>
  <div id="administration">
    <p class="title">行政区设置</p>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="行政区名称">
        <p>海淀区</p>
      </el-form-item>
      <el-form-item label="边框类型">
        <el-select v-model="form.bors" placeholder="请选择">
          <el-option label="实线" value="实线"></el-option>
          <el-option label="虚线" value="虚线"></el-option>
          <el-option label="点线" value="点线"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="边框宽度">
        <el-select v-model="form.borswidth" placeholder="请选择">
          <el-option label="1px" value="1px"></el-option>
          <el-option label="2px" value="2px"></el-option>
          <el-option label="2px" value="2px"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="边框颜色">
        <el-select v-model="form.borscolor" placeholder="请选择">
          <el-option label="#FF0000" value="#FF0000"></el-option>
          <el-option label="色值选择" value="色值选择"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="边框透明度">
        <div class="borslucency">
          <el-slider v-model="value" :show-tooltip="false"></el-slider>
        </div>
      </el-form-item>
      <el-form-item label="颜色填充">
        <el-select v-model="form.colorfill" placeholder="请选择">
          <el-option label="#FF0000" value="#FF0000"></el-option>
          <el-option label="色值选择" value="色值选择"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="填充透明度">
        <div class="filllucency">
          <el-slider v-model="values" :show-tooltip="false"></el-slider>
        </div>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-select v-model="form.colorfill" placeholder="请选择">
          <el-option label="#FF0000" value="#FF0000"></el-option>
          <el-option label="色值选择" value="色值选择"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字体大小">
        <el-select v-model="form.fontsize" placeholder="请选择">
          <el-option label="12px" value="12px"></el-option>
          <el-option label="14px" value="14px"></el-option>
          <el-option label="16px" value="16px"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'administra-tion',
    data() {
      return {
        value: 66,
        values: 36,
        form: {
          bors:'实线',
          borswidth:'1px',
          borscolor:'#FF0000',
          colorfill:'#FF0000',
          fontcolor:'#FF0000',
          fontsize:'12px'
        }
      }
    },
    methods: {
      formatTooltip(val) {
        return val / 100;
      }
    }   
}
</script>

<style scoped lang="less">
  #administration{
    margin-left: 10px;
  }
  .title{
    font-size: 14px;
    margin: 20px 0;
  }
  .el-slider{
    width: 210px;
  }
</style>