
<template>
    <div class="content">
        <div class="left-tree">
            <OrgTree></OrgTree>
        </div>
        <div class="right-content">
            <div  class="top-box">
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
                    <el-button size="mini" >下载</el-button>
                    <el-button size="mini" @click="isShowDetail = true"  >删除</el-button>
                    <el-button size="mini" @click="newFileFuc" >编辑</el-button>
                    <el-button size="mini" >新建文件夹</el-button>
                    <el-button size="mini" @click="newClifyFolder"  >新建分类</el-button>
                </div>
            </div>
             <div class="body-box">
                 <div class="classTab" v-for="(item,index) in classify" :key="index">
                     <div class="tabHeader">
                         <div class="title">{{item.className}}</div>
                         <div class="amount">共{{item.folderNum}}个</div>
                     </div>
                     <div class="tabBody">
                         <div class="folder" v-for="(folder,j) in item.folders" :key="j">
                             <div ><i class="el-icon-folder-opened"></i></div>
                             <div>{{folder.name}}</div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    </div>
</template>

<script>
import OrgTree from '../../OrgTree'
export default {
  name: 'customizationFile',
  components: {
    OrgTree
  },
  data() {
    return {
      classify: [
        {
          className: '消防安全基础文件',
          folderNum: '12',
          folders: [
            {
              files: [],
              name: '安全负责人'
            }
          ]
        },
        {
          className: '消防安全基础文件',
          folderNum: '12',
          folders: [
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            },
            {
              files: [],
              name: '安全负责人'
            }
          ]
        },
        {
          className: '消防安全基础文件',
          folderNum: '12',
          folders: [
            {
              files: [],
              name: '安全负责人'
            }
          ]
        }
      ]
    }
  },
  watch: {
  },
  computed: {
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  mounted() {
  },
  methods: {
    resizeFun() {

    },
    newFileFuc() {

    },
    newClifyFolder() {
      this.classify.push(
        {
          className: '新建消防安全基础文件',
          folderNum: '16',
          folders: [
            {
              files: [],
              name: '新建安全负责人'
            }
          ]
        }
      )
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
            .top-box{
               height: 70px;
            }

            .body-box{
                flex:1;
                width:100%;
                overflow-y: auto;
                border: 1px solid #ddd;
                .classTab{
                    .tabHeader{
                        width: 100%;
                        height: 30px;
                        background: #f0f0f0;
                        display: flex;
                        padding: 0 15px;
                        justify-content: space-between;
                        .title{
                            line-height: 30px;
                        }
                        .amount{
                            line-height: 30px;
                        }
                    }
                    .tabBody{
                        display: flex;
                        flex-wrap: wrap;
                        padding: 15px;
                        .folder{
                            width:120px;
                            margin-bottom:15px;
                            div:first-child{
                                text-align: center;
                                font-size: 60px;
                                color: #fda54b;
                            }
                            div:last-child{
                                text-align: center;
                              text-wrap: normal;
                            }

                        }

                    }
                }
            }
        }
    }
</style>
