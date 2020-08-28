<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
            <el-breadcrumb-item>系统校时</el-breadcrumb-item>
            <el-breadcrumb-item>参数配置</el-breadcrumb-item>
            <el-breadcrumb-item>{{editShow?'参数编辑':'查看'}}</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="footer-button"
           v-if="!editShow">
        <el-button @click="changeEdit">编辑</el-button>
        <el-button>打印</el-button>
      </div>
      <div class="table-box">
        <div class="form-content">
          <h5>巡检参数查看</h5>
          <div class="form-box">
            <div class="form">
              <div class="form-item">
                <label>设备巡检并发量</label>
                <el-input v-model="form.input"
                          placeholder="请输入内容"></el-input>
              </div>
              <div class="form-item">
                <label>超时重试次数</label>
                <el-input v-model="form.input"
                          placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="form">
              <div class="form-item">
                <label>定时查询时间</label>
                <el-input v-model="form.input"
                          placeholder="请输入内容"></el-input>
              </div>
              <div class="form-item">
                <label>设备巡检间隔（s）</label>
                <el-input v-model="form.input"
                          placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
          <div class="form-footer">
            <div class="form-item">
              <label>录入时间</label>
              <el-input v-model="form.input"
                        placeholder="请输入内容"></el-input>
            </div>
            <div class="form-item">
              <label>录入机构</label>
              <el-input v-model="form.input"
                        placeholder="请输入内容"></el-input>
            </div>
            <div class="form-item">
              <label>录入人</label>
              <el-input v-model="form.input"
                        placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="footer-button"
               v-if="editShow">
            <el-button>保存</el-button>
            <el-button>重置</el-button>
            <el-button>打印</el-button>
            <el-button @click="changeEdit">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        value: '1',
        input: ''
      },
      editShow: false
    }
  },
  mounted() {},
  methods: {
    changeEdit() {
      this.editShow = !this.editShow
    }
  }
}
</script>

<style lang="less" scoped>
.content-page {
  width: 100%;
  height: 100%;
  position: relative;
  /deep/ .el-button {
    width: 70px;
    padding: 7px 20px;
    font-size: 13px;
  }
  .el-breadcrumb {
    i {
      margin-right: 5px;
    }
    display: flex;
    align-items: c;
    align-items: center;
    padding: 10px 0px 10px 3px;
  }
  .right-content {
    height: 100%;
    width: 100%;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .table-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .form-content {
        width: 921px;
        display: flex;
        flex-direction: column;
        align-items: center;
        h5 {
          text-align: center;
          margin-top: 20px;
        }
        .form-footer {
          width: 100%;
          display: flex;
          padding-top: 5px;
          margin: 100px 0;
          .form-item {
            margin-bottom: 5px;
            label {
              width: 87px;
              margin-left: 5px;
              background: #f1f1f1;
              display: inline-block;
              height: 30px;
              font-size: 13px;
              line-height: 30px;
              text-align: center;
            }
            /deep/ .el-input {
              width: 210px;
              .el-input__inner {
                height: 30px;
                width: 210px;
                border-radius: 0px;
              }
            }
          }
        }
        .form-box {
          width: 920px;
          border: 1px solid #ccc;
          padding: 5px;
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          .form {
            width: 49%;
            .form-item {
              margin-bottom: 5px;
              label {
                width: 140px;
                margin-left: 5px;
                background: #f1f1f1;
                display: inline-block;
                height: 30px;
                font-size: 13px;
                line-height: 30px;
                text-align: center;
              }
              /deep/ .el-select {
                .el-input {
                  .el-input__inner {
                    height: 30px;
                    width: 290px;
                    border-radius: 0px;
                  }
                  .el-input__suffix {
                    .el-input__suffix-inner {
                      i {
                        line-height: 30px;
                      }
                    }
                  }
                }
              }
              /deep/ .el-input {
                width: 290px;
                .el-input__inner {
                  height: 30px;
                  width: 290px;
                  border-radius: 0px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
