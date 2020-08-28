<template>
  <div class="container">
      <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'container',
  data() {
    return {
    }
  },
  mounted() {},
  methods: {
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
