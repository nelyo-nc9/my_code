<template>
  <div class="content bigDataHome">
    <nav>
      <div class="logo logo-tile">
        <img src="../../../static/bigData/logo.png" alt />
        <span class="line"></span>
        <p v-if="true" @click="goHome()">首页</p>
      </div>
      <div class="homeTitle">
        <span @click="open()">智慧消防安全大数据平台 {{ title }}</span>
      </div>
    </nav>
    <router-view :title="title"></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: ''
    }
  },
  methods: {
    open() {
      var _this = this
      this.$prompt('请输入数据更新间隔（1~60分钟）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^([1-9]|[1-5][0-9]|60)$/,
        inputErrorMessage: '请输入数据更新间隔（1~60分钟）'
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: '每 ' + value + '分钟更新一次首页数据'
          })

          localStorage.setItem('interval', value * 60 * 1000)
          setTimeout(function() {
            console.log('　this.$router', _this.$router)
            // _this.$router.replace({
            //   path:"/intelligentFire/fireVisualization",
            //   name:"fireVisualization"
            // })
            document.location.reload()
          }, 1000)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    placeholderPic() {
      // 窗口字体自适应
      //  document.documentElement.style.fontSize=document.documentElement.offsetWidth/60+"px";
    },
    goHome() {
      console.log(' this.$route.path intelligentFire/fireVisualization', this.$route.path)
      // alert()
      this.$router.go(-1)
      // this.$router.push('/intelligentFire/fireVisualization')
    }
  },

  mounted() {
    $('.container .nav').hide()
    //  document.getElementsByClassName('nav')[0].remove()
    //  修改默认的最小宽度，大数据达到自适应
    // document.getElementById('content').style.minWidth = '100%'
    var _this = this
    setTimeout(() => {
      console.log('$(".container .nav")', $('.container .nav'))
      $('.container .nav').hide()
    }, 1000)
    window.onresize = function() {
      //窗口改变时再次执行一次函数即可
      _this.placeholderPic()
    }
  },
  watch: {
    $route: {
      handler(val, old) {
        console.log('route', val.params.title)
        if (val.params.title) this.title = '-' + val.params.title
        else this.title = ''
      }
    }
  }
}
</script>
<style>
.el-message-box__wrapper{
  z-index: 10000 !important;
}
</style>
<style lang="less" scoped>
#content {
  width: 100% !important;
}
.content {
  margin: 0px;
  color: #fff;
  width: 100%;
  height: 100%;
  // background: sienna;
  background-image: url(../../../static/bigData/home-bg.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: none;
  position: relative;
  @media (min-width: 0px) and (max-width: 2000px) {
    /deep/ p {
      // color: red;
      font-size: 0.6rem;
      // font-weight: 700;
      // color: red;
    }
  }
  @media (min-width: 2000px) and (max-width: 4000px) {
    /deep/ p {
      // color: orange;
    }
  }
  @media (min-width: 4000px) {
    /deep/ p {
      // color: blue;
    }
  }
  nav {
    width: 100vw;
    height: 2.27vw;
    .logo {
      width: 12%;
      position: fixed;
      height: 2.27vw;
      display: flex;
      justify-content: space-around;
      align-items: center;
      left: 1%;
      top: 1%;
      img {
        width: 80%;
        height: 100%;
      }
        p{
        font-size: 14px;
        padding-left: 4%;
        border-left: 1px solid rgb(117,138,157);
        cursor: pointer;
      }
      button {
        border-width: 0px;
        width: 80px;
        height: 34px;
        color: #fff;
        background-color: rgba(45, 114, 211, 1);
        cursor: pointer;
      }
    }
    .homeTitle {
      width: 90%;
      margin: 0 auto;
      background-image: url(../../../static/bigData/nav-bar.png);
      height: 100%;
      box-sizing: border-box;
      display: flex;
      font-family: Microsoft YaHei;
      font-size: 18px;
      line-height: 2.27vw;
      font-weight: 700;
      -ms-flex-pack: justify;
      justify-content: center;
      background-size: 100% 100%;
      cursor: pointer;
      span {
        letter-spacing: 0.2vw;
        background-image: -webkit-linear-gradient(left,#3C8ACC,#13F9F6,#3C8ACC);
        -webkit-background-clip: text;
        -webkit-text-fill-color:transparent;
      }
    }
  }
}
</style>
