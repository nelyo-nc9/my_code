<template>
  <div class="dome">
    <ul>
       <li title="左上" @mouseup="$emit('stop', 'swayUpLeft')" @mousedown="$emit('start', 'swayUpLeft')">
        <img src="/static/image/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/image/yuntai/ptz-active.png" class="active" ondragstart="return false;" />
      </li>
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
  name: 'BSdome'
}
</script>

<style lang="less" scoped>
.dome {
  width: 168px;
  height: 168px;
  margin: 0 auto;
  background: url("/static/image/yuntai/ptz.png") no-repeat;
  cursor: pointer;
}
.dome .stop {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  position: absolute;
  top: calc(~'50% - 29px');
  left: calc(~'50% - 29px');
}
.dome .stop:hover {
  background: url("/static/image/yuntai/stop-hover.png") no-repeat;
}
.dome .stop:active {
  background: url("/static/image/yuntai/stop-active.png") no-repeat;
}

ul {
  width: 168px;
  height: 168px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  margin: 300px 0 0 300px;
  margin: 0 auto;
}
li {
  left: 0px;
  top: 0px;
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
li span {
  position: absolute;
  right: 27px;
  bottom: 15px;
  display: block;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  -webkit-transform: skew(-45deg) rotate(-45deg) scale(1);
  -moz-transform: skew(-45deg) rotate(-45deg) scale(1);
  -ms-transform: skew(-45deg) rotate(-45deg) scale(1);
  transform: skew(-45deg) rotate(-65deg) scale(1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
}

li img.hover {
  position: absolute;
  right: 0px;
  bottom: 11px;
  display: none;
  -webkit-transform: skew(-45deg) rotate(-45deg) scale(1);
  -moz-transform: skew(-45deg) rotate(-45deg) scale(1);
  -ms-transform: skew(-45deg) rotate(-45deg) scale(1);
  transform: skew(-45deg) rotate(-65deg) scale(1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
}
li img.active {
  position: absolute;
  right: 7px;
  bottom: -1px;
  display: none;
  -webkit-transform: skew(-48deg) rotate(-118deg) scale(1);
  -moz-transform: skew(-48deg) rotate(-118deg) scale(1);
  -ms-transform: skew(-48deg) rotate(-118deg) scale(1);
  transform: skew(-48deg) rotate(-118deg) scale(1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
}

li:nth-child(1) {
  transform: rotate(22.5deg) skew(45deg);
  /*z-index: 999;*/
  img {
    right: 0;
    bottom: 0;
    transform: skew(-45deg) rotate(-19deg) scale(1);
  }
}
li:nth-child(2) {
  transform: rotate(67.5deg) skew(45deg);
  img {
    right: 3px;
    bottom: -3px;
    transform: skew(-45deg) rotate(-19deg) scale(1);
  }
}
li:nth-child(3) {
  transform: rotate(112.5deg) skew(45deg);
  img {
    right: 3px;
    bottom: -6px;
    transform: skew(-45deg) rotate(-19deg) scale(1);
  }
}
li:nth-child(4) {
  transform: rotate(157.5deg) skew(45deg);
  img {
    right: 0;
    bottom: -7px;
    transform: skew(-45deg) rotate(-17deg) scale(1);
  }
}
li:nth-child(5) {
  transform: rotate(202.5deg) skew(45deg);
  img {
    right: -3px;
    bottom: -7px;
    transform: skew(-45deg) rotate(-20deg) scale(1);
  }
}
li:nth-child(6) {
  transform: rotate(247.5deg) skew(45deg);
  img {
    right: -3px;
    bottom: -6px;
    transform: skew(-45deg) rotate(-22deg) scale(1);
  }
}
li:nth-child(7) {
  transform: rotate(292.5deg) skew(45deg);
  img {
    right: 6px;
    bottom: -10px;
    transform: skew(-45deg) rotate(-35deg) scale(1);
  }
}
li:nth-child(8) {
  transform: rotate(337.5deg) skew(45deg);
  img {
    right: 3px;
    bottom: -4px;
    transform: skew(-45deg) rotate(-27deg) scale(1);
  }
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
