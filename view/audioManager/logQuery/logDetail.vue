<template>
  <div class="detail">
    <div class="wrap-res">
      <h3>查询结果</h3>
      <div class="wrap-list">
        <h4 class="top">发起者</h4>
        <p>{{obj.sponsor}}</p>
        <h4>对讲参与者</h4>
        <p>{{obj.participant}}</p>
        <h4>对讲开始时间</h4>
        <p>{{obj.startTimeBegin}}</p>
        <h4>对讲时长</h4>
        <p>{{obj.durationType}}</p>
        <h4>通话标记</h4>
        <div class="wrap-textarea">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            disabled
            v-model="obj.remarks">
          </el-input>
        </div>
        <h4>音视频文件</h4>
        <p class="last" @click="lookVideo">{{obj.videoPath}}</p>
      </div>
    </div>
    <el-button @click="backLog" size="mini" type="primary">返回</el-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        obj: {
          sponsor: '123', // 发起者
          participant: '12', // 对讲参与者
          startTimeBegin: 'sdsd', // 对讲开始时间
          durationType: 'sds', // 对讲时长
          remarks: 'sdsd', // 通话标记
          videoPath: 'sdsd' // 音视频文件
        }
      }
    },
    methods: {
      backLog() {
        this.$emit('backLog')
      },
      lookVideo () {
        this.$emit('lookVideo')
      }
    },
  }
</script>

<style lang="less" scoped>
  .detail{
    height: calc(~'100vh - 176px');
    overflow: auto;
    padding: 20px 0 0 20px;
    .wrap-res {
      width: 616px;
      border:1px solid rgba(225, 225, 225, 1);
      h3{
        padding-left: 14px;
        height:40px;
        background:rgba(249,249,249,1);
        border-bottom:1px solid rgba(225, 225, 225, 1);
        font-size:12px;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height: 40px;
      }
      .wrap-list{
        padding: 10px 20px 14px 14px;
        background:rgba(255,255,255,1);
        h4 {
          border-left: 2px solid #2D71D3;
          padding-left: 8px;
          font-size: 12px;
          line-height: 12px;
          color: #333;
          margin-top: 22px;
        }
        h4.top{
          margin-top: 0;
        }
        .wrap-textarea,
        p{
          padding-left: 10px;
          font-size: 12px;
          color: #333;
          line-height: 12px;
          margin-top: 12px;
        }
        p.last{
          cursor: pointer;
          color: #409EFF;
        }
        .el-textarea{
          color: #333;
        }
      }
    }
    .el-button{
      margin-top: 20px;
    }
  }
</style>