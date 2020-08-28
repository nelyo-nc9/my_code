<template>
  <div id="dropdown">
    <div class="dropdown-content dropdown-cursor-pointer dropdown-float-left" @click="triggerDropdown" v-if="isShowDownIcon">
      <div class="dropdown-content-label dropdown-float-left">{{ label }}</div>
      <div class="dropdown-content-icon dropdown-float-left">
        <i :class="isOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
      </div>
    </div>
    <div class="dropdown-content dropdown-float-left" v-if="!isShowDownIcon">
      <div class="dropdown-content-label dropdown-float-left">{{ label }}</div>
    </div>
    <div class="dropdown-division dropdown-float-right"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    isShowDownIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    triggerDropdown() {
      this.$emit('triggerDropdown')
    }
  }
}
</script>

<style lang="less">
  #dropdown {
    overflow: hidden;

    .dropdown-float-left {
      float: left;
    }

    .dropdown-float-right {
      float: right;
    }

    .dropdown-cursor-pointer {
      cursor: pointer;
    }

    .dropdown-content {
      overflow: hidden;

      .dropdown-content-label {
        width: 60px;
      }
    }

    .dropdown-division {
      @val: 80px;
      width: calc(~"100% - @{val}");
      border-top: 1px solid #ddd;
      margin-top: 10px;
    }
  }
</style>
