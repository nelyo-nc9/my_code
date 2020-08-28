<template>
  <div class="role-manage-import-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>施工加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>申请列表</el-breadcrumb-item>
          <el-breadcrumb-item>新建</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="btns">
        <el-button size="mini" @click="show">新建</el-button>
        <el-button size="mini" @click="back">导出</el-button>
        <el-button size="mini" @click="back">打印</el-button>
      </div>
      <div class="main-box">
        <div class="box-title">施工加班申请表</div>
        <div class="create-from">
          <ul>
            <li>
              <span>所属机构*</span>
              <section>
                <el-input v-model="form.name" size="small" clearable></el-input>
              </section>
            </li>
            <li>
              <span>所属重点部位*</span>
              <section>
                <el-input v-model="form.name" size="small" clearable></el-input>
              </section>
            </li>
            <li>
              <span>申请编号</span>
              <section>
                <el-input v-model="form.name" size="small" clearable></el-input>
              </section>
            </li>
            <li>
              <span>施工单位</span>
              <section>
                <el-input v-model="form.name" size="small" clearable></el-input>
              </section>
            </li>
            <li>
              <span>施工区域</span>
              <section>
                <el-input v-model="form.name" size="small" clearable></el-input>
              </section>
            </li>
            <li class="last">
              <span>施工事项</span>
              <section>
                <el-input size="small" clearable></el-input>
              </section>
            </li>
            <li>
              <span>开始日期*</span>
              <section>
                <el-date-picker
                  size="small"
                  v-model="value1"
                  type="date"
                  style="width:100%"
                  placeholder="选择日期"
                ></el-date-picker>
              </section>
            </li>
            <li>
              <span>结束时间*</span>
              <section>
                <el-date-picker
                  size="small"
                  v-model="value1"
                  type="date"
                  style="width:100%"
                  placeholder="选择日期"
                ></el-date-picker>
              </section>
            </li>
          </ul>
        </div>

        <div class="p-search-footer">
          <el-button type="primary" @click="submit" size="small">保存</el-button>
          <el-button type="primary" @click="submit" size="small">提交</el-button>
          <el-button @click="close" size="small">取消</el-button>
          <el-button @click="reset" size="small">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newForm',
  data() {
    return {
      flag: true
    }
  }
}
</script>

<style lang="less" scoped>
.role-manage-import-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    .top {
      width: 100%;
      height: 30px;
      color: #333333;
      /deep/ .el-breadcrumb {
        font-size: 12px;
        .active {
          .el-breadcrumb__inner {
            color: #2d72d3;
          }
        }
      }
    }
    .main-box {
      width: 100%;
      height: calc(~'100%-30px');
      .box-title {
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
      }
      .create-from {
        border: 1px solid #ddd;
        padding: 5px 10px;
        width: 80%;
        max-width: 1360px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        ul {
          width: 100%;
          height: 96%;
          display: flex;
          flex-wrap: wrap;
          li {
            width: calc(100% / 3);
            height: 36px;
            display: flex;
            span {
              width: 150px;
              height: 96%;
              background: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            section {
              flex: 1;
              height: 100%;
              padding: 0px 10px;
              display: flex;
              align-items: center;
              .el-select {
                width: 100%;
              }
              .el-cascader {
                width: 100%;
              }
            }
          }
          .last {
            width: 100%;
          }
        }
      }
      .transfer {
        border: 1px solid #ddd;
        padding: 2px;
        width: 80%;
        max-width: 1360px;
        height: 580px;
        margin: 15px auto;
        display: flex;
        justify-content: space-around;
        section {
          width: 40%;
          height: 100%;
          h3 {
            text-align: center;
            background: #ebebeb;
            padding: 10px 0px;
          }
          .section {
            width: 100%;
            height: 520px;
            border: 1px solid #ededed;
            margin-top: 5px;
            overflow: auto;
          }
        }
      }
      .p-search-footer {
        // max-width: 1360px;
        padding-top: 10px;
        text-align: center;
      }
    }
  }
}
</style>
