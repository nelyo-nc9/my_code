<template>
  <div class="dome">
    <ul>
      <li title="左上" @mouseup="$emit('stop', 'swayUpLeft')" @mousedown="$emit('start', 'swayUpLeft')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="上" @mouseup="$emit('stop', 'tiltUp')" @mousedown="$emit('start', 'tiltUp')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="右上" @mouseup="$emit('stop', 'swayUpRight')" @mousedown="$emit('start', 'swayUpRight')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="右" @mouseup="$emit('stop', 'panRight')" @mousedown="$emit('start','panRight')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="右下" @mouseup="$emit('stop', 'swayDownRight')" @mousedown="$emit('start','swayDownRight')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="下" @mouseup="$emit('stop', 'tiltDown')" @mousedown="$emit('start','tiltDown')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="左下" @mouseup="$emit('stop', 'swayDownLeft')" @mousedown="$emit('start','swayDownLeft')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="左" @mouseup="$emit('stop', 'panLeft')" @mousedown="$emit('start','panLeft')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <div class="stop" title="停止" @mousedown.stop="$emit('start','stopAll')"></div>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ImgDome'
}
</script>

<style lang="less" scoped>
.dome {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: url("/static/image/yuntai/ptz.png") no-repeat center;
  margin-bottom: 10px;
  cursor: pointer;
  transform: scale(0.9);
  .stop {
    width: 66px;
    height: 66px;
    border-radius: 50%;
    position: absolute;
    top: calc(~'50% - 33px');
    left: calc(~'50% - 33px');
    &:hover {
      background: url("/static/image/yuntai/stop-hover.png") no-repeat center;
      left: calc(~'50% - 31px');
    }
    &:active {
      background: url("/static/image/yuntai/stop-active.png") no-repeat center;
      left: calc(~'50% - 32px');
    }
  }
}

ul {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  margin: 0 auto;
}
li {
  left: 10px;
  top: 12px;
  position: absolute;
  width: 88px;
  height: 88px;
  color: #fff;
  overflow: hidden;
  -webkit-transform-origin: 100% 100%;
  -moz-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  -webkit-transform: rotate(45deg) skew(45deg);
  -moz-transform: rotate(45deg) skew(45deg);
  -ms-transform: rotate(45deg) skew(45deg);
  transform: rotate(45deg) skew(45deg);
}

li img.hover {
  position: absolute;
  right: 0px;
  bottom: -8px;
  display: none;
  -webkit-transform: skew(-45deg) rotate(-113deg) scale(1);
  -moz-transform: skew(-45deg) rotate(-113deg) scale(1);
  -ms-transform: skew(-45deg) rotate(-113deg) scale(1);
  transform: skew(-45deg) rotate(-113deg) scale(1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
}
li img.active {
  position: absolute;
  right: 0px;
  bottom: -6px;
  display: none;
  -webkit-transform: skew(-45deg) rotate(-65deg) scale(0.95);
  -moz-transform: skew(-45deg) rotate(-65deg) scale(0.95);
  -ms-transform: skew(-45deg) rotate(-65deg) scale(0.95);
  transform: skew(-45deg) rotate(-65deg) scale(0.95);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
}

li:nth-child(1) {
  transform: rotate(22.5deg) skew(45deg);
  // .hover {
  //   bottom: -4px;
  //   -webkit-transform: skew(-43deg) rotate(-110deg) scale(0.95);
  //   -moz-transform: skew(-43deg) rotate(-110deg) scale(0.95);
  //   -ms-transform: skew(-43deg) rotate(-110deg) scale(0.95);
  //   transform: skew(-43deg) rotate(-110deg) scale(0.95);
  // }
}
li:nth-child(2) {
  transform: rotate(67.5deg) skew(45deg);
  // .hover {
  //   bottom: -4px;
  // }
}
li:nth-child(3) {
  transform: rotate(112.5deg) skew(45deg);
  // .hover {
  //   bottom: -4px;
  // }
}
li:nth-child(4) {
  transform: rotate(157.5deg) skew(45deg);
  // .hover {
  //   bottom: -7px;
  // }
}
li:nth-child(5) {
  transform: rotate(202.5deg) skew(45deg);
  // .hover {
  //   bottom: -7px;
  //   transform: skew(-45deg) rotate(-111deg) scale(0.95);
  // }
}
li:nth-child(6) {
  transform: rotate(247.5deg) skew(45deg);
  // .hover {
  //   bottom: -8px;
  //   transform: skew(-45deg) rotate(-112deg) scale(0.95);
  // }
}
li:nth-child(7) {
  transform: rotate(292.5deg) skew(45deg);
  // .hover {
  //   bottom: -7px;
  //   transform: skew(-45deg) rotate(-117deg) scale(0.95);
  // }
  // .active {
  //   bottom: -4px;
  // }
}
li:nth-child(8) {
  transform: rotate(337.5deg) skew(45deg);
  // .hover {
  //   transform: skew(-46deg) rotate(-115deg) scale(0.95);
  // }
}
li:hover img.hover {
  display: block;
}
li:active img.active {
  display: block;
}
li:active img.hover {
  display: none;
}
</style>
