
<template>
    <div class="content">
        <div class="left-tree">
            <OrgTree></OrgTree>
        </div>
        <div class="right-content">
            <div v-if="!isShowDetail && !isShowConfig && !isShowSort && !isShowMove" class="top-box">
                <header>
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                        <el-breadcrumb-item>消防运行管理</el-breadcrumb-item>
                        <el-breadcrumb-item>动火审批</el-breadcrumb-item>
                        <el-breadcrumb-item>申请列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
                <div class="button-box">
                    <el-button size="mini" @click="newFileFuc" >上传</el-button>
                    <el-button size="mini" @click="newFileFuc" >下载</el-button>
                    <el-button size="mini" @click="newFileFuc" >删除</el-button>
                    <el-button size="mini" >编辑</el-button>
                </div>
                <div  class="button-box">
                    <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
                </div>
            </div>
            <div v-if="!isShowDetail  && !isShowConfig && !isShowSort && !isShowMove" style="flex:1;" ref="tableBox">
                <el-table border size="mini" stripe :height="tableHeight">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="orgName" label="所属机构"></el-table-column>
                    <el-table-column prop="keySite" label="所属重点部位" width="100"></el-table-column>
                    <el-table-column prop="deviceType" label="申请编号"></el-table-column>
                    <el-table-column prop="deviceName" label="申请人"></el-table-column>
                    <el-table-column prop="code" label="施工单位"></el-table-column>
                    <el-table-column prop="brand" label="动火部位"></el-table-column>
                    <el-table-column prop="deviceModel" label="开始时间"></el-table-column>
                    <el-table-column prop="netModuleBrand" label="结束时间" width="100"></el-table-column>
                    <el-table-column prop="netModuleModel" label="施工人员" width="100"></el-table-column>

                </el-table>
                <el-pagination
                        style="text-align:right;"
                        :page-sizes="[25, 50, 100, 200]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400"
                ></el-pagination>
            </div>
            <!--            <detail v-if="isShowDetail" :isShowDetail.sync="isShowDetail"></detail>-->
            <!--            <linkConfig v-if="isShowConfig" :isShowConfig.sync="isShowConfig"></linkConfig>-->
            <!--            <Sort v-if="isShowSort" :isShowSort.sync="isShowSort"></Sort>-->
            <!--            <Move v-if="isShowMove" :isShowMove.sync="isShowMove"></Move>-->
        </div>
    </div>
</template>

<script>
import OrgTree from '../../OrgTree'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'filesDetail',
  components: {
    OrgTree
  },
  data() {
    return {
      isShowSubOrg: true, // 显示子机构
      isShowDetail: false, // 控制详情页显隐
      isShowConfig: false, // 控制 关联配置页 显隐
      isShowSort: false, // 控制 排序页
      isShowMove: false, // 控制 移动页
      tableHeight: 728
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
  },
  methods: {
    ...mapMutations('fireOperationManagement',
      {
        SET_COMPONENT_ID: 'SET_COMPONENT_ID'}),
    resizeFun() {
      this.$refs.tableBox && (this.tableHeight = this.$refs.tableBox.offsetHeight - 32)
    },
    newFileFuc() {
      this.SET_COMPONENT_ID('hotNewlyBuild')
    }
  }
}
</script>

<style lang="less" scoped>
    .content {
        width: 100%;
        height: 100%;
        position: relative;
        .left-tree {
            width: 240px;
            height: 100%;
            position: absolute;
            border-right: 1px solid #e1e1e1;
        }
        .right-content {
            height: 100%;
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
    }
</style>
