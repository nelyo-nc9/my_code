<template>
  <div id="screenSelect">
    <el-select v-model="value" class="screen-select-content" placeholder="请选择" @change="selectChange">
      <el-option
        key=""
        label="全部"
        value="">
      </el-option>
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'screenSelect',
  data() {
    return {
      selectOptions: [],
      value: this.selectValue
    }
  },
  props: {
    options: {
      type: Array,
      default: () => { return [] }
    },
    selectValue: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.selectOptions = JSON.parse(JSON.stringify(this.options))
  },
  methods: {
    selectChange(e) {
      console.log(e)
      this.$emit('change', e)
    }
  }
}
</script>

<style lang="less">
  #screenSelect {
    .screen-select-content {
      width: 100%;
    }
  }
</style>
