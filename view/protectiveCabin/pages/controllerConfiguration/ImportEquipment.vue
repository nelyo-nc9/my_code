<template>
  <div class="content-equipment">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
        <el-breadcrumb-item>防护舱设备配置</el-breadcrumb-item>
        <el-breadcrumb-item>导入</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="button-box">
      <el-input size="mini" style="width: 400px;float:left;margin-right:10px;">
        <template slot="prepend">选择导入文件</template>
        <el-upload slot="append" action="">
          <el-button size="mini" type="primary">浏览...</el-button>
        </el-upload>
      </el-input>
      <div>
        <el-button size="mini" type="primary">导入</el-button>
        <el-button size="mini">重置</el-button>
        <el-button size="mini">覆盖</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    isShowImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = false
          }
        })
      }
    },
    // 保存
    save() {
      this.$emit('update:isShowImport', false)
    }
  }
}
</script>

<style lang="less" scoped>
  .content-equipment {
    height: 100%;
    font-size: 14px;
    margin: 0 10px;
    .button-box {
      margin: 10px 0;
    }
    &::after {
      display: block;
      content: '';
      border-top: 1px solid #e1e1e1;
      width: calc(~'100% - 0px');
    }
  }
</style>
