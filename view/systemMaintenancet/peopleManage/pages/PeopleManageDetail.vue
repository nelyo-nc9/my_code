<template>
  <div class="people-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 面包屑 -->
      <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">查看</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <!-- 操作按钮 -->
      <div class="button-box">
          <el-button size="small" v-print="'#printJS_people'" icon="el-icon-printer">打印</el-button>
          <el-button size="small" @click="cancel()">取消</el-button>
      </div>
      <div class="main" ref="printJS_people" id="printJS_people">
        <div class="box-title">人员查看</div>
        <div class="detail-from">
              <ul>
                <li>
                  <span>姓名</span>
                  <section>
                    {{detailData.name}}
                  </section>
                </li>
                <li>
                  <span>姓名拼音全称</span>
                  <section>
                    {{detailData.pinyin}}
                  </section>
                </li>
                <li>
                  <span>员工识别登录名</span>
                  <section>
                    {{detailData.userName}}
                  </section>
                </li>
                <li>
                  <span>学位</span>
                  <section>
                    {{detailData.degree}}
                  </section>
                </li>
                <li>
                  <span>专业</span>
                  <section>
                    {{detailData.professional}}
                  </section>
                </li>
                <li>
                  <span>学校性质</span>
                  <section>
                    {{detailData.schoolType}}
                  </section>
                </li>
                <li>
                  <span>毕业日期</span>
                  <section>
                    {{detailData.graduationDate}}
                  </section>
                </li>
                <li>
                  <span>工作单位</span>
                  <section>
                    {{detailData.units}}
                  </section>
                </li>
                <li>
                  <span>用户状态</span>
                  <section>
                    {{detailData.status}}
                  </section>
                </li>
                <li>
                  <span>移动电话</span>
                  <section>
                    {{detailData.mobilePhone}}
                  </section>
                </li>
                <li>
                  <span>电子邮箱</span>
                  <section>
                    {{detailData.email}}
                  </section>
                </li>
              </ul>
              <ul>
                <!-- <li style="height:166px;">
                  <span style="height:100%;">照片</span>
                  <section style="height:100%;">
                    <img :src="detailData.picture" height="98%" :alt="detailData.name">
                  </section>
                </li> -->
                <li>
                  <span>性别</span>
                  <section>
                    {{detailData.sex}}
                  </section>
                </li>
                <li>
                  <span>出生日期</span>
                  <section>
                    {{detailData.birthday}}
                  </section>
                </li>
                <li>
                  <span>员工编号</span>
                  <section>
                    {{detailData.uid}}
                  </section>
                </li>
                <li>
                  <span>学历</span>
                  <section>
                    {{detailData.schooling}}
                  </section>
                </li>
                <li>
                  <span>毕业院校</span>
                  <section>
                    {{detailData.school}}
                  </section>
                </li>
                <li>
                  <span>学习形式</span>
                  <section>
                    {{detailData.learningType}}
                  </section>
                </li>
                <li>
                  <span>所属机构</span>
                  <section>
                    {{detailData.orgName}}
                  </section>
                </li>
                <li>
                  <span>用户类型</span>
                  <section>
                    {{detailData.type}}
                  </section>
                </li>
                <li>
                  <span>办公电话</span>
                  <section>
                    {{detailData.officePhone}}
                  </section>
                </li>
                <li>
                  <span>备用电话</span>
                  <section>
                    {{detailData.alternatePhone}}
                  </section>
                </li>
                <li>
                  <!-- <span></span>
                  <section>
                  </section> -->
                </li>
              </ul>
        </div>
        <div class="detail-footer">
              <ul>
                <li>
                  <span>录入时间</span>
                  <section>{{detailData.createdAt}}</section>
                </li>
                <li>
                  <span>录入机构</span>
                  <section>{{detailData.createdOrgName}}</section>
                </li>
                <li>
                  <span>录入人</span>
                  <section>{{detailData.createdUserName}}</section>
                </li>
              </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PeopleManageDetail',
  data() {
    return {
      detailData: []
    }
  },
  computed: {
    ...mapState({
      fromView: ({peopleManage}) => peopleManage.fromView,
      fromTitle: ({peopleManage}) => peopleManage.fromTitle,
      lookData: ({peopleManage}) => peopleManage.detailData
    })
  },
  created() {
    if (this.lookData[0]) {
      this.detailData = this.$lodash.cloneDeep(this.lookData[0])
    } else {
      this.detailData = this.$lodash.cloneDeep(this.lookData)
    }
  },
  methods: {
    ...mapActions('peopleManage', ['setState']),
    // 取消
    cancel() {
      this.setState({ type: 'SET_STATE', key: 'currentView', value: this.fromView })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: this.fromTitle })
    }
  }
}
</script>

<style lang="less" scoped>
.people-manage-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding: 5px 0px 5px 10px;
    .header {
      margin-bottom: 10px;
      color: #333333;
      /deep/ .el-breadcrumb {
        font-size: 12px;
        .active {
          .el-breadcrumb__inner {
            color: #2D72D3;
          }
        }
      }
    }
    .button-box {
      width: 100%;
      margin: 10px 0px;
    }
    .main {
      width: 1200px;
      // min-width: 800px;
      // height: calc(~'100% - 75px');
      padding: 20px;
      border: 1px solid #ddd;
      margin: 0 auto;
      .box-title {
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 18px;
      }
      .detail-from {
        // border: 1px solid #ddd;
        width: 1020px;
        // padding:5px 10px;
        // height: 510px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        ul {
          display: flex;
          flex-direction: column;
          li {
            width: 500px;
            height: 40px;
            display: flex;
            align-items: center;
            border:1px solid rgba(225, 225, 225, 1);
            box-sizing: border-box;
            span {
              width: 150px;
              height: 100%;
              background: rgba(245,245,245,1);
              display: flex;
              justify-content: center;
              align-items: center;
            }
            section {
              flex: 1;
              height: 100%;
              padding-left: 10px;
              display: flex;
              align-items: center;
              background:rgba(245,245,245,0);
              .el-select {
                width: 100%;
              }
              el-date-picker {
                width: 100%;
              }
            }
          }
        }
      }
      .detail-footer {
        border: 1px solid #ddd;
        width: 1020px;
        height: 40px;
        margin: 20px auto;
        ul {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          li {
            flex: 1;
            height: 100%;
            display: flex;
            span {
              width: 150px;
              height: 100%;
              background: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            section {
              flex: 1;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
@media print {
  .main {
    width: 1200px;
    // min-width: 800px;
    // height: calc(~'100% - 75px');
    padding: 20px;
    // border: 1px solid #ddd;
    margin: 0 auto;
    .box-title {
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-size: 18px;
    }
    .detail-from {
        border: 1px solid #ddd;
        width: 1020px;
        padding:5px 10px;
        // height: 510px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        ul {
          display: flex;
          flex-direction: column;
          li {
            width: 500px;
            height: 40px;
            margin: 1px;
            display: flex;
            align-items: center;
            span {
              width: 150px;
              height: 96%;
              background: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid #eaeaea;
            }
            section {
              flex: 1;
              height: 96%;
              padding-left: 10px;
              display: flex;
              align-items: center;
              border: 1px solid #eaeaea;
              .el-select {
                width: 100%;
              }
              el-date-picker {
                width: 100%;
              }
            }
          }
        }
    }
    .detail-footer {
        // border: 1px solid #ddd;
        width: 1020px;
        height: 40px;
        margin: 20px auto;
        ul {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          li {
            flex: 1;
            height: 100%;
            display: flex;
            span {
              width: 150px;
              height: 100%;
              background: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid #eaeaea;
            }
            section {
              flex: 1;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid #eaeaea;
            }
          }
        }
    }
  }
}
</style>
