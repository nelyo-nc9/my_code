<template>
  <div id="blockView">
    <el-carousel trigger="click" indicator-position="outside" :interval="0">
      <el-carousel-item class="box" v-for="(item,index) in blockViewList" :key="index">
        <div class="right-aisle-box">
          <div class="box-content" v-for="(items, index) in item" :key="index">
            <img :src="doorImg" alt class="pic" style="height: 40px" />
            <p class="status">
              状态 :
              <span>{{items.status}}</span>
            </p>
            <div class="box-msg" style="margin-top:80px">
              <p>{{items.doorType}}</p>
              <p>{{items.HostType}}</p>
              <el-button class="btn" size="mini" @click="isDiao(items)">控制</el-button>
              <!-- <span style="float: right;margin-top: 18px;">{{item.point}}</span> -->
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- <Diao :dialogVisible="dialogVisible" /> -->
    <el-dialog
      title="门禁提示"
      :visible.sync="dialogVisible"
      width="1200px"
      custom-class="diao"
      :before-close="handleClose"
      top="1vh"
      :close-on-click-modal="false"
    >
      <div class="videoCon">
        <div class="videoLeft">
          <div v-for="(item, index) in 4" :key="index" class="videoItem">
            <div class="videoContent">
              <p>视频预览</p>
            </div>
            <div class="iconList">
              <ul class="iconBox">
                <li class="iconItem" v-for="(item, index) in 7" :key="index">
                  <i class="el-icon-camera"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="videoRight">
          <div class="rightContent">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="视频设备" name="1">
                <div class="isBor">
                  <i class="el-icon-video-camera"></i>
                  <span>摄像机</span>
                </div>
                <div class="isBor">
                  <i class="el-icon-video-camera"></i>
                  <span>摄像机</span>
                </div>
                <div>
                  <i class="el-icon-video-camera"></i>
                  <span>摄像机</span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="远程控制" name="2">
                <div>
                  <i class="el-icon-refrigerator"></i>
                  <span>D1门-加钞间</span>
                </div>
                <div class="btns">
                  <el-button size="mini" @click="open">开门</el-button>
                  <el-button size="mini">关门</el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item title="对讲设备1" name="3">
                <div>
                  <i class="el-icon-microphone"></i>
                  <span>对讲设备1</span>
                </div>
                <div>
                  <el-button size="mini">
                    <span>开始对讲</span>
                  </el-button>
                  <el-button size="mini">
                    <span>停止对讲</span>
                  </el-button>
                  <!-- <el-button size="mini">停止对讲</el-button> -->
                </div>
              </el-collapse-item>

              <el-collapse-item title="报警设备1" name="4">
                <div>
                  <i class="el-icon-location-outline"></i>
                  <span>D1门-加钞间</span>
                </div>
                <div>
                  <el-button size="mini">
                    <span>开启</span>
                  </el-button>
                  <el-button size="mini">
                    <span>关闭</span>
                  </el-button>
                </div>
              </el-collapse-item>

              <el-collapse-item title="报警设备2" name="4">
                <div>
                  <i class="el-icon-location-outline"></i>
                  <span>D1门-加钞间</span>
                </div>
                <div>
                  <el-button size="mini">
                    <span>开启</span>
                  </el-button>
                  <el-button size="mini">
                    <span>关闭</span>
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="videoFooter">
          <ul>
            <li v-for="(item, index) in 7" :key="index">可同时展开多个面板，面板之间不影响</li>
          </ul>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="fn" type="primary" size="mini" @click="close(fn)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      fn: null,
      dialogVisible: true,
      doorImg: '../../../static/protectiveCabin/u38.png',
      list: [1, 2, 123, 12, 312, 3, 123, 12, 3, 123, 12, 3, 123, 12, 3, 123, 1, 31, 23, 12, 312, 31],
      blockViewList: [
        [
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' },
          { status: '开门', doorType: 'D1门-加钞间', HostType: '门禁主机-营业区' }
        ],
        [
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间' },
          { status: '关门', doorType: 'D1门-营业区', HostType: '门禁主机-加钞间'}
        ]
      ]
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    close(callBack) {
      this.dialogVisible = false
      this.handleClose(callBack)
    },
    isDiao(va) {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.fn = done
      console.log(done)
      this.dialogVisible = false
      if (!this.dialogVisible) done()
    },
  },
  mounted() {
    this.handleClose(() => {})
  }
}
</script>

<style lang="less" scoped>
#blockView {
  .right-aisle-box {
    display: flex;
    flex: 1 1 360px;
    flex-wrap: wrap;
    overflow-y: auto;
    .box-content {
      margin: 10px 0px;
      margin-left: 10px;
      width: 255px;
      height: 130px;
      border: 1px solid #bcbcbc;
      justify-content: space-around;
      align-content: center;
      text-align: center;
      position: relative;
      .box-msg {
        .btn {
          margin-top: -28px;
          margin-right: 10px;
          float: right;
        }
      }
      .status {
        float: right;
        margin: 0 10px;
      }
      .pic {
        position: absolute;
        left: 50%;
        top: 35%;
        transform: translateY(-50%);
        text-align: center;
        margin-left: -20px;
      }
    }
  }
  /deep/ .el-dialog__header {
    text-align: center;
    font-weight: 700;
  }
  .diao {
    width: 1200px;
    overflow: hidden;
    background: #d7d7d7;

    .videoCon {
      // border: 1px solid red;
      overflow: hidden;
      font-family: fantasy;

      .videoLeft {
        overflow: hidden;
        width: 80%;
        height: 600px;
        // border: 1px solid yellow;
        // display: inline-block;
        float: left;
        margin-right: 20px;
        .videoContent {
          text-align: center;
          line-height: 250px;
          height: 250px;
          // background: violet;
        }
        .iconList {
          text-align: center;
          // height: 50px;
          // line-height: 50px;
          padding: 10px 0;
          .iconBox {
            .iconItem {
              display: inline-block;
              margin: 0 10px;
            }
          }
        }
        .videoItem {
          float: left;
          width: 450px;
          height: 290px;
          // border: 1px solid turquoise;
          margin: 5px;
          background: #fff;
        }
      }
      .videoFooter {
        margin-top: 50px;
        float: left;
        height: 130px;
        width: 100%;
        background: #fff;
        ul {
          width: 600px;
          height: 100px;
          list-style: none;
        }
      }
      .videoRight {
        overflow: auto;
        width: 18%;
        // overflow: hidden;
        height: 600px;
        background: #fff;
        float: left;
        // padding: 0 10px;
        /deep/ .el-collapse-item__content .isBor {
          border-bottom: 1px solid #e6e6e6;
        }
        /deep/ .el-collapse-item__content .isBor:last-child {
          border-bottom: none;
        }
        /deep/ .el-collapse-item__content div {
          // padding-left: 10px;
          padding: 5px 10px;
        }
        /deep/ .el-collapse-item__header {
          padding-left: 10px;
          border-bottom: 2px solid #e6e6e6;
        }
        /deep/ .el-collapse-item__content {
          padding-bottom: 0 !important;
        }
        // .rightContent {
        //   // overflow-y: auto;
        // }
        .btns {
          border-bottom: 1px solid #e6e6e6;
        }
      }
    }
  }
}
</style>
