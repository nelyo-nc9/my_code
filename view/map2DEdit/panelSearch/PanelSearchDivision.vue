<template>
  <div id="panelSearchDivision">
    <div class="panel-search-floor">
      <img class="panel-search-floor-img" :src="imgUrl" alt="" />
      <span class="panel-search-floor-label">{{ label }}</span>
      <span class="panel-search-floor-division"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    imgUrl: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
#panelSearchDivision {
  .panel-search-floor {
    padding: 5px;

    .panel-search-floor-img {
      display: inline-block;
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }

    .panel-search-floor-label {
      display: inline-block;
      height: 24px;
      line-height: 26px;
      vertical-align: middle;
    }

    .panel-search-floor-division {
      display: inline-block;
      @val: 90px;
      width: calc(~'100% - @{val}');
      height: 6px;
      margin-left: 10px;
      border-bottom: 1px solid #ededed;
      vertical-align: middle;
    }
  }
}
</style>
