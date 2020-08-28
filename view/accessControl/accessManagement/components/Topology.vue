<template>
  <div id="clo">
    <div class="right">
      <p style="text-align:center">拓补图</p>
      <el-button style="float:right" size="mini">打印</el-button>
      <div class="top">
        <div>
          <i></i>
          <span>摄像机</span>
        </div>
        <div>
          <i></i>
          <span>摄像机</span>
        </div>
      </div>
      <div class="center">
        <div>
          <i></i>
          <span>T1对讲面板-自主1</span>
        </div>
        <div class="centerItem">
          <i></i>
          <span>D1门-加钞间</span>
        </div>
        <div>
          <i></i>
          <span>O1门-警号</span>
        </div>
      </div>
      <div class="rightView">
        <div>
          <i></i>
          <span>T3对讲面板-自助1</span>
        </div>
        <div>
          <i></i>
          <span>O1门-射灯</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>
<style lang="less" scoped>
.after(@origin,@deg,@wz) {
  display: block;
  content: '';
  position: absolute;
  width: 100px;
  height: 1px;
  border: 1px dotted springgreen;
  bottom: (@wz);
  left: 50%;
  margin-left: -50px;
  transform: rotate(@deg);
  transform-origin: @origin;
}
.before(@origin,@deg,@fx,@wz) {
  display: block;
  content: '';
  position: absolute;
  width: 221px;
  height: 1px;
  border: 1px dotted springgreen;
  top: 50%;
  right: (@wz);
  transform: rotate(@deg);
  transform-origin: @origin;
}
#clo {
  .right {
    width: 80%;
    height: 500px;
    margin-left: 70px;
    padding: 0 100px;
    .top {
      margin-left: 145px;
      overflow: hidden;
      width: 380px;
      margin-top: 20px;
      text-align: center;
      line-height: 50px;
      height: 120px;
      div {
        width: 150px;
        height: 50px;
        background-color: rgba(22, 155, 213, 1);
        margin: 10px;
        display: inline-block;
        position: relative;
        &:nth-child(1)::after {
          .after(left, 40deg, -2px);
        }
        &:nth-child(2)::after {
          .after(right, -40deg, -2px);
        }
      }
    }
    .center {
      // margin-top: 50px;
      position: relative;
      line-height: 50px;
      // margin-top: 50px;
      div {
        background-color: rgba(255, 153, 0, 1);
        display: inline-block;
        width: 150px;
        height: 50px;
        background: springgreen;
        text-align: center;
        position: relative;
        &:nth-child(1)::after {
          display: block;
          content: '';
          position: absolute;
          width: 162px;
          height: 1px;
          border: 1px dotted springgreen;
          top: 50%;
          right: -162px;
          transform: rotate(0deg);
          transform-origin: right;
        }
        &:nth-child(3) {
          float: right;
          text-align: center;
          background-color: rgba(255, 51, 51, 1);
        }
        &:nth-child(2) {
          position: absolute;
          text-align: center;
          left: 50%;
          transform: translateX(-50%);
          background-color: springgreen;
          //   margin-left: -30px;
        }
        &:nth-child(2)::after {
          display: block;
          content: '';
          position: absolute;
          width: 162px;
          height: 1px;
          border: 1px dotted springgreen;
          top: 50%;
          right: -162px;
          transform: rotate(0deg);
          transform-origin: right;
        }
      }
    }
    .rightView {
      line-height: 50px;
      text-align: center;
      overflow: hidden;
      padding-top: 40px;
      div {
        width: 150px;
        height: 50px;
        float: left;
        background-color: rgba(255, 153, 0, 1);
        position: relative;
        &:nth-child(2) {
          float: right;
          background-color: rgba(255, 51, 51, 1);
        }
        &:nth-child(2)::after {
          display: block;
          content: '';
          position: absolute;
          width: 221px;
          height: 1px;
          border: 1px dotted springgreen;
          top: 50%;
          left: 0;
          transform: rotate(-158deg);
          transform-origin: left;
        }
        &:nth-child(1)::after {
          .before(right, 159deg, right, 0);
        }
      }
    }
  }
}
</style>

