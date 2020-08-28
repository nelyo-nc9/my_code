
<template>
    <div class="content">
        <div class="left-tree">
            <OrgTree></OrgTree>
        </div>
        <div class="right-content">
            <div v-if="!isShowDetail && !isShowConfig && !isShowSort && !isShowMove" class="top-box">
                <header>
                    <el-breadcrumb separator-class="el-icon-arrow-right mab20">
                        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                        <el-breadcrumb-item>消防运行管理</el-breadcrumb-item>
                        <el-breadcrumb-item>动火审批</el-breadcrumb-item>
                        <el-breadcrumb-item>申请列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
                <div class="button-box">
                    <el-button size="mini" @click="newFileFuc" v-if="componentStatus===0">新建</el-button>
                    <el-button size="mini" @click="editChange" v-if="componentStatus===0">编辑</el-button>
                    <el-button size="mini" v-if="componentStatus!==1">删除</el-button>
                    <el-button size="mini" @click="isShowSort = true" v-if="componentStatus===0">撤回</el-button>
                    <el-button size="mini" @click="isShowSort = true" v-if="componentStatus===1">审批</el-button>
                    <el-button size="mini">导出</el-button>
                    <el-button size="mini">打印</el-button>
                </div>
                <div  class="button-box">
                    <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
                </div>
            </div>
            <div v-if="!isShowDetail  && !isShowConfig && !isShowSort && !isShowMove" style="flex:1;" ref="tableBox">
                <el-table :data="hotWorkList"  @selection-change="select" border size="mini" stripe  style="width: 100%" :height="tableHeight">
                    <el-table-column   align="center" type="selection"></el-table-column>
                    <el-table-column   align="center" type="index" label="序号"></el-table-column>
                    <el-table-column   align="center" prop="orgName" label="所属机构"  width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="keySite" label="所属重点部位" width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="deviceType" label="申请编号" width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="deviceName" label="申请人" width="100" sortable></el-table-column>
                    <el-table-column   align="center" prop="code" label="施工单位" width="220" sortable></el-table-column>
                    <el-table-column   align="center" prop="brand" label="动火部位" width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="deviceModel" label="开始时间" width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="netModuleBrand" label="结束时间" width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="netModuleModel" label="施工人员" width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="netModulePrincipal" label="施工负责人" width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="tutelagePerson" label="监护人员" width="120" sortable></el-table-column>
                    <el-table-column   align="center" prop="donghuaType" label="动火方式" width="120" sortable>
                       <template slot-scope="scope">
                         <span v-if="scope.row.donghuaType=='1'">电气焊作业</span>
                      </template>
                    </el-table-column>
                    <el-table-column   align="center" prop="mihuoType" label="防火措施" width="120" sortable>
                       <template slot-scope="scope">
                         <span v-if="scope.row.mihuoType=='1'">灭火器</span>
                      </template>
                    </el-table-column>
                    <el-table-column   align="center" prop="approvalStatus" label="审批状态"  width="120" sortable>
                       <template slot-scope="scope">
                         <span v-if="scope.row.approvalStatus=='1'">已保处</span>
                      </template>
                    </el-table-column>
                    <el-table-column   align="center" prop="roadworkStatus" label="施工状态"  width="120" sortable>
                       <template slot-scope="scope">
                         <span v-if="scope.row.approvalStatus=='1'">待施工</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      align="center"
                      width="200"
                    >
                      <template slot-scope="scope">
                        <el-button @click="goDetail(scope.row)" type="text">查看</el-button>
                        <el-button type="text" @click="editChange(scope.row)">编辑</el-button>
                        <!-- <el-button type="text" @click="terminationReason(scope.row)">终止原因</el-button> -->
                        <!-- <el-button type="text" @click="prontHotCard(scope.row)">打印动火证</el-button> -->
                        <el-button type="text" @click="goExamine(scope.row)" >审核</el-button>
                      </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        style="text-align:right;margin-top:10px;"
                        :page-sizes="[25, 50, 100, 200]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400"
                ></el-pagination>
            </div>
        </div>
        <!-- //添加/编辑 -->
        <div class="changePropBox" v-show="addEditBoxBool">
              <hot-newly-build @closeAddOrEditBox="closeAddOrEditBox"></hot-newly-build>
        </div>
        <!-- 详情 -->
        <div class="changePropBox" v-show="deatilBoxBool">
              <hot-detail ref="hotDetail" @closeAddOrEditBox="closeAddOrEditBox"></hot-detail>
        </div>
        <div class="printPreview" v-show="printPreviewBool">
            <print-preview @closeAddOrEditBox="closeAddOrEditBox"></print-preview>
        </div>
    </div>
</template>

<script>
import OrgTree from '../../OrgTree'
import { mapMutations, mapState } from 'vuex'
import hotNewlyBuild from './hotNewlyBuild'
import printPreview from './printPreview'
import hotDetail from './hotDetail'
export default {
  name: 'hotWorkList',
  components: {
    OrgTree,
    hotNewlyBuild,
    printPreview,
    hotDetail
  },
  data() {
    return {
      isShowSubOrg: true, // 显示子机构
      isShowDetail: false, // 控制详情页显隐
      isShowConfig: false, // 控制 关联配置页 显隐
      isShowSort: false, // 控制 排序页
      isShowMove: false, // 控制 移动页
      tableHeight: 600,
      selectData:[],//选择数据
      addEditBoxBool:false,//添加编辑操作框是否显示
      deatilBoxBool:false,//详情操作框是否显示
      printPreviewBool:false,
     
      hotWorkList: [
        {
          orgName: '保定分行',
          keySite: '融汇支行(办公楼)',
          deviceType: '202005261002',
          deviceName: '张三',
          code: '***工程装修装饰有限公司',
          brand: '配电箱,电路布线',
          deviceModel: '2020.01.25 15:32',
          netModuleBrand: '2020.01.25 15:32',
          netModuleModel: '李小明,王五',
          netModulePrincipal:"李四",
          tutelagePerson:"李四",
          donghuaType:"1",
          mihuoType:"1",
          approvalStatus:"1",
          roadworkStatus:"1"
        },
        {
          orgName: '保定分行',
          keySite: '融汇支行(办公楼)',
          deviceType: '202005261002',
          deviceName: '张三',
          code: '***工程装修装饰有限公司',
          brand: '配电箱,电路布线',
          deviceModel: '2020.01.25 15:32',
          netModuleBrand: '2020.01.25 15:32',
          netModuleModel: '李小明,王五',
          netModulePrincipal:"李四",
          tutelagePerson:"李四",
          donghuaType:"1",
          mihuoType:"1",
          approvalStatus:"1",
          roadworkStatus:"1"
        }
      ]
    }
  },
  watch: {
  },
  computed: {
    ...mapState('fireOperationManagement', {
      componentStatus: 'componentStatus'
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
    this.$notify({
          title: '',
          message: '这是一条成功的提示消息',
          type: '',
          customClass:"alertSuccess"
        });
  },
  methods: {
    // ...mapMutations('fireOperationManagement',
    //   {
    //     SET_COMPONENT_ID: 'SET_COMPONENT_ID'}),
    resizeFun() {
      this.$refs.tableBox && (this.tableHeight = this.$refs.tableBox.offsetHeight - 32)
    },
     // 选中数据
    select(val) {
      console.log(val)
      this.selectData = val
    },
    //新增
    newFileFuc() {
      // this.SET_COMPONENT_ID('hotNewlyBuild')
      this.addEditBoxBool = true
    },
    //编辑
    editChange(){
      this.addEditBoxBool = true
    },
    //详情
    goDetail(row){
      this.deatilBoxBool = true;
      this.$nextTick(()=>{
        this.$refs.hotDetail.parentHotDetail(row,false);
      })
    },
    //审核
    goExamine(row){
      this.deatilBoxBool = true;
      this.$nextTick(()=>{
        this.$refs.hotDetail.parentHotDetail(row,true);
      })
    },
    //新增/编辑/打印动火证弹窗关闭
    closeAddOrEditBox(){
      this.addEditBoxBool = false;
      this.deatilBoxBool = false;
      this.printPreviewBool = false;
    },
    //终止原因
    terminationReason(row){
      this.$alert('因施工过程违规操作，安全措施不够。已终止施工', '终止原因', {
          confirmButtonText: '确定',
      });
    },
    //打印动火证
    prontHotCard(row){
       this.printPreviewBool = true;
    },
    //父组件调用的方法
    parentMethod(){
      this.addEditBoxBool = false;
      this.deatilBoxBool = false;
    }
  }
}
</script>

<style lang="less" scoped>
    .content {
        width: 100%;
        // height: 100%;
        height: 89vh;
        position: relative;
        .left-tree {
            width: 240px;
            height: 100%;
            height: 89vh;
            position: absolute;
            border-right: 1px solid #e1e1e1;
        }
        .right-content {
            height: 89vh;
            width: calc(~'100% - 240px');
            position: absolute;
            left: 240px;
            font-size: 14px;
            padding: 0 10px;
            display: flex;
            flex-direction: column;
            .button-box {
                margin: 12px 0;
            }
        }
        .changePropBox{
          position: absolute;
          top:0;
          left: 0;
          z-index: 333;
          width: 100%;
          height: 90vh;
          background: #fff;
        }
        .printPreview{
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
            background: #fff;
            height: 100vh;
            overflow: auto;
            z-index: 666;
        }
    }
</style>
<style>
  .alertSuccess{
    top:10% !important;
  }
</style>
