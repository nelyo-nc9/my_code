<template>
  <div class="right-content">
    <div class="top-box">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>制度和安全</el-breadcrumb-item>
        <el-breadcrumb-item>规章制度管理</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table-box">
      <div class="box-title">
        <span class="pointer" @click="changeShow">
          查询条件
          <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
      </div>
      <div class="main-box-center" v-show="isShow">
        <div class="main" id="contentinfo">
          <div class="main-box">
            <div class="main-box-center">
              <div class="center-li">
                <div class="li-item">
                  <span>文件名</span>
                  <el-input v-model="formData.name"></el-input>
                </div>
                <div class="li-item">
                  <span>文号</span>
                  <el-input v-model="formData.number"></el-input>
                </div>
                <div class="li-item">
                  <span>文件来源</span>
                  <el-select v-model="formData.source " placeholder="全部">
                      <el-option value="行内"></el-option>
                      <el-option value="行外"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="center-li">
                <div class="li-item">
                  <span>颁布级别</span>
                  <el-select v-model="formData.level" placeholder="全部">
                      <el-option value="总行"></el-option>
                      <el-option value="一级分行"></el-option>
                      <el-option value="二级分行"></el-option>
                      <el-option value="国家"></el-option>
                      <el-option value="省市"></el-option>
                      <el-option value="地市"></el-option>
                  </el-select>
                </div>
                <div class="li-item">
                  <span>文件种类</span>
                  <el-select v-model="formData.type" placeholder="全部">
                      <el-option value="制度"></el-option>
                      <el-option value="标准"></el-option>
                      <el-option value="预案"></el-option>
                      <el-option value="方案"></el-option>
                      <el-option value="操作规范"></el-option>
                      <el-option value="通知"></el-option>
                      <el-option value="意见"></el-option>
                      <el-option value="其他"></el-option>
                  </el-select>
                </div>
                <div class="li-item">
                  <span>发布单位</span>
                  <el-input v-model="formData.company"></el-input>
                </div>
              </div>
              <div class="center-li">
                <div class="li-item">
                  <span>发布时间</span>
                  <el-input v-model="formData.time"></el-input>
                </div>
                <div class="li-item">
                  <span>有效性</span>
                  <el-select v-model="formData.validity" placeholder="全部">
                      <el-option value="有效"></el-option>
                      <el-option value="无效"></el-option>
                  </el-select>
                </div>
                <div class="li-item">
                  <span>录入机构</span>
                  <el-input v-model="formData.enterMechanism"></el-input>
                </div>
              </div>
              <div class="center-li2">
                <span class="li2-title">内容分类</span>
                <div class="li2-con">
                  <el-checkbox v-for="item of checkboxData" :key="item.title" v-model="item.ischecked">{{item.title}}</el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-button" v-show="isShow">
        <el-button plain class="baocun" @click="setQuery" size="small">查询</el-button>
        <el-button plain size="small" @click="reset">重置</el-button>
        <el-button plain size="small" @click="exportFile('规章制度管理查询表')">导出</el-button>
      </div>
      <div class="query-results">
        <div class="box-title" style="margin-bottom:10px;">
          <span class="pointer">查询结果</span>
        </div>
        <div class="table-content">
          <div class="table-content-box">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="100%"
            stripe
            :default-sort="{prop: 'date', order: 'descending'}"
            :cell-style="{'text-align':'center'}"
            :header-cell-style="{'text-align':'center'}"
            @selection-change="selectionData"
            @sort-change="sortChange"
          >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column prop="name" label="文件名" width="" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="number" label="文号" width="" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="source" label="文件来源" width="" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="level" label="颁布级别" width="" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="type" label="文件种类" width="" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="company" label="发布单位" width="" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="time" label="发布时间" width="" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="contentType" label="内容分类" width="" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="validity" label="有效性" width="" sortable show-overflow-tooltip></el-table-column>
          </el-table>
          </div>
          <el-pagination
            style="text-align:center;margin-top:15px;"        
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="pageSize"
            :current-page="currentPage"
            :total="tableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      downloadObject: [], //打印/导出数据
      isShow: true, // 查询条件显隐
      formData: {
        name: '', //文件名
        number: '', //文号
        source: '', //文件来源
        level: '', //颁布级别
        type: '', //文件种类
        company: '', //发布单位
        time: '', //发布时间
        contentType : [], //内容分类
        enclosure: [], //附件
        enterTime: '', //录入时间
        enterMechanism: '', //录入机构
        enterPerson: '', //录入人
        validity: '' //有效性
      },
      checkboxData:[
        {
          title: '基础管理',
          ischecked: false
        },
        {
          title: '技防',
          ischecked: false
        },
        {
          title: '消防',
          ischecked: false
        },
        {
          title: '物防',
          ischecked: false
        },
        {
          title: '营业网点',
          ischecked: false
        },
        {
          title: '办公楼',
          ischecked: false
        },
        {
          title: '机房',
          ischecked: false
        },
        {
          title: '金库',
          ischecked: false
        },
        {
          title: '自助服务区',
          ischecked: false
        },
        {
          title: '保管箱库',
          ischecked: false
        },
        {
          title: '装备',
          ischecked: false
        },
        {
          title: '守押',
          ischecked: false
        },
        {
          title: '安全生产',
          ischecked: false
        },
        {
          title: '预警',
          ischecked: false
        },
        {
          title: '维稳',
          ischecked: false
        },
        {
          title: '委外事务',
          ischecked: false
        },
        {
          title: '案件管理',
          ischecked: false
        },
        {
          title: '其他',
          ischecked: false
        },
      ],
      tableData: [
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        }
      ],
      pageSize: 5, //每页条数
      currentPage: 1 //当前页
    }
  },
  methods: {
    //查询条件显隐
    changeShow() {
      this.isShow = !this.isShow
    },
    //查询按钮
    setQuery() {
      this.$confirm('暂无后台接口调用！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭',
        type: 'warning'
      })
    },
    //重置按钮
    reset() {
      for (var index in this.formData) {
        if(this.formData[index] instanceof Array){
          this.formData[index] = [];
        }else{
          this.formData[index] = '';        
        }
      }
      for (var index in this.checkboxData) {
        this.checkboxData[index].ischecked = false;
      }
    },
    //排序
    sortChange(val) {
      console.log(val)
    },
    //改变每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
      this.$confirm('暂无后台接口调用', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭',
        type: 'warning'
      })
    },
    //改变当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$confirm('暂无后台接口调用', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭',
        type: 'warning'
      })
    },
    //表格选中
    selectionData(val) {
      this.downloadObject = val;
    },
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '文件名',
        '文号',
        '文件来源',
        '颁布级别',
        '文件种类',
        '发布单位',
        '发布时间',
        '内容分类',
        '附件',
        '录入时间',
        '录入机构',
        '录入人',
        '有效性'
      ]
      // 字段名
      const filterVal = [
        'name',
        'number',
        'source',
        'level',
        'type',
        'company',
        'time',
        'contentType',
        'enclosure',
        'enterTime',
        'enterMechanism',
        'enterPerson',
        'validity'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, title)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="less" scoped>
  .right-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow:hidden;
    .top-box{
      margin-bottom: 20px;
    }
    .table-box {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow:hidden;
      .box-title {
        // margin-bottom: 10px;
        height: 24px;
        line-height: 24px;
        color: #606266;
        &::after {
          display: block;
          content: '';
          border-top: 1px solid #e1e1e1;
          width: calc(~'100% - 120px');
          margin-left: 100px;
          margin-top: -12px;
        }
      }
      .main-box-center {
        width: 100%;
        .main {
          margin: 10px 0;
          width: 100%;
          .main-box {
            // padding: 20px;
            .box-title {
              width: 60%;
              height: 60px;
              text-align: center;
              line-height: 60px;
              font-size: 18px;
            }
            .main-box-center {
              border: 1px solid #ddd;
              padding: 5px 10px 15px;
              width: 60%;
              // margin-left: 20%;
              background: #eee;
              .center-li{
                width: 100%;
                height: 35px;
                margin-top: 10px;
                .li-item{
                  width: 33.3333%;
                  height:35px;
                  float:left;
                  span{
                    float:left;
                    width: 40%;
                    line-height: 35px;
                    text-align: center;
                  }
                  .el-input, .el-select{
                    float:left;
                    width: 60%;
                    height: 35px;
                  }
                }
              }
              .center-li2{
                width: 100%;
                height: 70px;
                margin-top: 10px;
                .li2-title{
                  float: left;
                  width: 13.4%;
                  line-height: 70px;
                  text-align: center;
                }
                .li2-con{
                  float: left;
                  width: 86.6%;
                  height: 70px;
                  padding-left: 20px;
                  background: #fff;
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  .el-checkbox {
                    font-size: 12px;
                    margin-right: 0; 
                    height: 16px;
                    width: 90px;
                    /deep/ .el-checkbox__label {
                      padding-left: 5px;
                      line-height: 19px;
                      font-size: 12px;
                    }
                    /deep/ .el-checkbox__inner{
                      width: 12px;
                      height: 12px;
                    }
                    /deep/ .el-checkbox__inner::after{
                      left: 3px;
                      top: 0;
                    }
                  }
                }
              }
            }
            .main-box-footer {
              padding: 1px;
              margin: 20px 0;
              width: 60%;
              height: 39px;
              // margin-left: 20%;
              border: 1px solid #ddd;
              background: #eee;
              .footer-li{
                width: 33.3333%;
                height: 35px;
                float: left;
                span{
                    float:left;
                    width: 30%;
                    line-height: 35px;
                    text-align: center;
                }
                .el-input{
                  float:left;
                  width: 70%;
                  height: 35px;
                  background: none;
                }
              }
            }
          }
        }
      }
      .footer-button {
        width: 60%;
        margin: 10px 0;
        text-align: center;
        .baocun{
          background: #2E72D4;
          color: #fff;
          border: 1px solid #2E72D4;
        }
      }
      .query-results {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow:hidden;
        .table-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow:hidden;
          .table-content-box{
            flex: 1;
            overflow: hidden;
            /deep/ .el-table::before{
              height: 0;
            }
            /deep/ .el-table .caret-wrapper{
              width: 13px;
            }
          }
        }
      }
    }
  }
</style>
