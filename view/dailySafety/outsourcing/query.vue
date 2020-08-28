<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>外委公司管理</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="changeShow">
            查询条件
            <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div class="query-criteria" :style="{height: isShow ? '380px' : '0px', transition: 'height .8s', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}">
          <div class="title-name">按发生机构查询</div>
          <!-- <div class="top-name">
            <span class="name">查询条件 <i :class="{'el-icon-arrow-up': isshow, 'el-icon-arrow-down': !isshow}"></i></span>
            <span class="border-span"></span>
          </div> -->
          <div class="form-box">
            <div class="form">
              <div class="form-item">
                <label>所属机构</label>
                <el-input v-model="form.input" placeholder="请输入内容"></el-input>
              </div>
              <div class="form-item">
                <label>员工姓名</label>
                <el-input v-model="form.input" placeholder="请输入内容"></el-input>
              </div>
              <div class="form-item">
                <label>合同开始时间</label>
                <span>
                  <el-input v-model="form.input" placeholder="请输入内容"></el-input>
                  <span>到</span>
                  <el-input v-model="form.input" placeholder="请输入内容"></el-input>
                </span>
              </div>
            </div>
            <div class="form">
              <div class="form-item">
                <label>公司名称</label>
                <el-input v-model="form.input" placeholder="请输入内容"></el-input>
              </div>
              <div class="form-item">
                <label style="backgroundColor:#fff; opacity:0;"></label>
              </div>
              <div class="form-item">
                <label>合同开始时间</label>
                <span>
                  <el-input v-model="form.input" placeholder="请输入内容"></el-input>
                  <span>到</span>
                  <el-input v-model="form.input" placeholder="请输入内容"></el-input>
                </span>
              </div>

            </div>
          </div>
          <div class="footer-button">
            <el-button>查询</el-button>
            <el-button>重置</el-button>
            <el-button>导出</el-button>
          </div>
        </div>
        <div class="query-results">
          <div>
            <div class="top-name">
              <span class="name">查询结果</span>
              <span class="border-span"></span>
            </div>
          </div>
          <div class="table-content" style="margin:15px">
            <el-table :data="tableData" border size="mini" stripe :height="isShow ?'520px':'696px'">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column v-for="item in tableColumn" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-pagination style="text-align:center;margin-top:5px;" :page-sizes="[25, 50, 100, 200]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
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
      isShow: true, // 查询条件显隐
      isShowSubOrg: true,
      form: {
        value: '1',
        input: ''
      },
      tableColumn: [
        // 表格标题行内容
        { prop: 'name', label: '公司名称' },
        { prop: 'time', label: '合同有效期' },
        { prop: 'fanwei', label: '合同业务范围' },
        { prop: 'phone', label: '公司电话' },
        { prop: 'peopleName', label: '公司员工' },
      ],
      tableData: [
        {
          name: '一个公司',
          time: '2022',
          fanwei: '范围',
          phone: '110120119',
          peopleName: '张三，李四，王五',
        },
        {
          name: '一个公司',
          time: '2022',
          fanwei: '很大',
          phone: '110120119',
          peopleName: '张三，李四，王五',
        },
      ],
    }
  },
  mounted() { },
  methods: {
    changeShow() {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style lang="less" scoped>
.content-page {
  height: 100%;
  width: 100%;
  height: 100%;
  position: relative;
  /deep/ .el-button {
    width: 70px;
    font-size: 13px;
  }
  .right-content {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    .top-box {
      margin: 15px 0 10px 15px;
    }
    .table-box {
      width: 100%;
      height: calc(~'100% - 34px');
      // display: flex;
      flex-direction: column;
      .title-name {
        margin: 0 auto;
      }
      .box-title {
        margin: 0 0 0 15px;
        position: relative;
        height: 24px;
        line-height: 24px;
        color: #606266;
        i {
          position: absolute;
          top: 50%;
          left: 70px;
          transform: translateY(-50%);
        }
        &::after {
          display: block;
          content: '';
          border-top: 1px solid #e1e1e1;
          width: calc(~'100% - 100px');
          margin-left: 100px;
          margin-top: -12px;
        }
      }
      .top-name {
        display: flex;
        width: 1703px;
        align-content: center;
        height: 19px;
        margin-left: 15px;

        .name {
          color: #606266;
          font-size: 14px;
          width: 75px;
        }
        .border-span {
          height: 1px;
          width: calc(~'100% - 75px');
          background: #ccc;
          margin-top: 10px;
        }
      }
      .query-criteria {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .form-box {
          width: 920px;
          border: 1px solid #ccc;
          box-sizing: border-box;
          padding: 5px;
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
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
            .form-item > span {
              span {
                margin: 0 14px;
              }
              /deep/ .el-input {
                width: 120px;
                .el-input__inner {
                  height: 30px;
                  width: 120px;
                  border-radius: 0px;
                }
              }
            }
          }
        }
        .footer-button {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
