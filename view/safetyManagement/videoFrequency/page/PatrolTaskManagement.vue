<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
            <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
            <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="table-box">
        <div class="form-content">
          <h5>新建巡检任务</h5>
          <div class="form-box">
            <div class="form">
              <div class="form-item">
                <label>巡检计划名称</label>
                <el-input v-model="form.input"
                          placeholder="请输入内容"></el-input>
              </div>
              <div class="form-item">
                <label>子系统</label>
                <span>
                  <el-select v-model="form.value"
                             placeholder="请选择">
                    <el-option label="全部"
                               value="1"></el-option>
                  </el-select>
                </span>
              </div>
              <div class="form-item">
                <label>巡检时间</label>
                <el-input v-model="form.input"
                          placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="form">
              <div class="form-item">
                <label>巡检周期</label>
                <el-input v-model="form.input"
                          placeholder="请输入内容"></el-input>
              </div>
              <div class="form-item">
                <label>计划录像保存天数</label>
                <el-input v-model="form.input"
                          placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
          <div class="top-name">
            <span class="name">查询结果</span>
            <span class="border-span"></span>
          </div>
          <el-transfer v-model="value"
                       :data="data"></el-transfer>
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
          <div class="footer-button">
            <el-button>保存</el-button>
            <el-button>重置</el-button>
            <el-button>打印</el-button>
            <el-button>关闭</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      data: generateData(),
      value: [1, 4],
      form: {
        value: '1',
        input: ''
      }
    }
  },
  mounted() {},
  methods: {}
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
  .right-content {
    height: 100%;
    width: 100%;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .el-breadcrumb {
      i {
        margin-right: 5px;
      }
      display: flex;
      align-items: center;
      padding: 10px 0px 10px 3px;
    }
    .table-box {
      width: 100%;
      height: calc(~'100% - 34px');
      display: flex;
      align-items: center;
      flex-direction: column;
      .top-name {
        display: flex;
        width: 100%;
        align-content: center;
        height: 19px;
        margin-top: 40px;
        margin-bottom: 40px;
        .name {
          color: #606266;
          font-size: 14px;
          margin: 0 7px;
          width: 75px;
        }
        .border-span {
          height: 1px;
          width: calc(~'100% - 75px');
          background: #ccc;
          margin-top: 10px;
        }
      }
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
          margin: 40px 0;
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
