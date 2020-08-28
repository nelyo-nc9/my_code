<!--  -->
<template>
  <div class="content">
     <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>监管系统对接</el-breadcrumb-item>
            <el-breadcrumb-item>下级资源检索</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="main">
        <div class="left-box">
           <el-button style="margin-left:210px">重新推送</el-button>
           <div class="left-box-table">
              <div class="top">
                <h3>下级服务器</h3>
              </div>   
              <div class="list-box-table">
                <el-table :row-style="{height:'10px'}" :cell-style="{padding:'0px'}" style="font-size: 12px;" stripe border height="100%" max-height="556"
                      :data='tableData'>
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="序号" type="index" width="50" align="center"> </el-table-column>
                    <el-table-column :row-style="{height:'5px'}" 
                    :cell-style="{padding:'0px'}" style="font-size: 8px; height:'25px'" 
                    v-for="(column) in columns" :key="column.id" :prop="column.prop" :label="column.label" :width="column.width" 
                    :sortable="column.sortable" show-overflow-tooltip align="center">
                    </el-table-column>
                    <el-table-column label="操作" width="160" align="center">
                      <template>
                        <el-button
                          size="samll"
                          type="text"
                          @click="handleEdit"
                          style="font-size:12px;margin-left:0;line-height: 8px;"
                        >重新推送</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
             </div>
           </div>
        </div>
        <div class="content-box">
           <div class="left-content-box">
              <div class="top">
                 <span>资源类型</span>
                 <el-select v-model="formData.agree">
                      <el-option v-for="(item,index) in agreeList"
                              :key="index"
                              :label="item.label"
                              :value="item.value"></el-option>
                 </el-select>
              </div>
              <div class="tree-box">
                <div class="tree-top">
                  <h3>下级已推送资源</h3>
                </div>
                <div class="tree">
                  <orgTree style="width:298px;height:570px"
                    :lazyTreeApi="getAudioTreeApi" 
                    :treeType="treeType" 
                    searchType="filter" 
                    treeLazyToggle iconToggle 
                    checkRecursionToggle :checkboxToggle="true"
                    @onceClick="onceClick">
                  </orgTree>
                </div>
              </div>
           </div>
           <div class="button-box">
              <el-button size="mini" class="btn1"><i class="el-icon-right"></i></el-button>
              <el-button size="mini" class="btn2"><i class="el-icon-back"></i></el-button>
           </div>
           <div class="right-content-box">
              <div class="top">
                <span style="margin-left:10px">资源类型</span>
                 <el-select v-model="formData.agree">
                      <el-option v-for="(item,index) in agreeList"
                              :key="index"
                              :label="item.label"
                              :value="item.value"></el-option>
                 </el-select>
                 <el-button style="width:70px;height:35px;line-height:8px;">保存</el-button>
              </div>
              <div class="tree-box">
                <div class="tree-top">
                  <h3>映射到本级资源</h3>
                </div>
                <div class="tree">
                  <orgTree style="width:298px;height:570px"
                    searchType="filter" 
                    treeLazyToggle iconToggle 
                    checkRecursionToggle :checkboxToggle="true"
                    @onceClick="onceClick">
                  </orgTree>
                </div>
              </div>  
           </div>
        </div>
      </div>
  </div>
</template>
<script>
import orgTree from '@src/components/tree/treeBox'
import { getAudioTreeApi } from "@src/http/audioManage/audioTree.api.js"
export default {
  name: '',
  components: {
    orgTree
  },
  data() {
    return {
      title:'列表',
      treeType: 2,
      formData:{
        agree:'视频资源'
      },
      columns: [
        { prop: 'serverName', sortable: false, label: '服务器名称', width: '110', sortable: true },
        { prop: 'serverip', sortable: false, label: '服务器地址', width: '110', sortable: true },
        { prop: 'serverId', sortable: false, label: '服务器ID', width: '110', sortable: true },
        { prop: 'port', sortable: false, label: '端口', width: '110', sortable: true },
        { prop: 'sip', sortable: false, label: 'SIP域', width: '180', sortable: true },
        { prop: 'sign', sortable: false, label: '注册有效期', width: '180', sortable: true },
        { prop: 'heart', sortable: false, label: '心跳周期', width: '110', sortable: true },
        { prop: 'bigheart', sortable: false, label: '最大心跳超时次数', width: '180', sortable: true },
        { prop: 'status', sortable: false, label: '状态', width: '230', sortable: true },
      ],
      tableData:[
        {
          serverName:'石家庄市公安局',
          serverip:'192.168.14.4',
          serverId:'34020000012349852',
          port:'7100',
          sip:'340200000',
          sign:'86400',
          heart:'60',
          bigheart:'3',
          status:'在线',
          operate:'重新推送'
        },
        {
          serverName:'长安区公安局',
          serverip:'192.168.14.4',
          serverId:'34020000012349852',
          port:'7100',
          sip:'340200000',
          sign:'86400',
          heart:'60',
          bigheart:'3',
          status:'在线',
          operate:'重新推送'
        },
        {
          serverName:'长安区综治办',
          serverip:'192.168.14.4',
          serverId:'34020000012349852',
          port:'7100',
          sip:'340200000',
          sign:'86400',
          heart:'60',
          bigheart:'3',
          status:'在线',
          operate:'重新推送'
        }
      ],
      agreeList:[
        {label:'视频资源',value:'视频资源'},
        
      ],
      checked: false
    }
  },
  methods: {
    getAudioTreeApi(params) {
      return getAudioTreeApi(params)
    },
    onceClick(){

    },
    handleEdit(){
       this.$confirm('请确认是否推送', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$messageSuccess('推送成功')
      }).catch(() => {})  
    }
  },
  created() {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
  .content{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding:12px;
    .main{
      width: 100%;
      height: calc(~'99% - 56px');
      position: relative;
      .left-box{
           width: 308px;
           height: 750px;
           margin-left:48px;
           margin-top:20px;
           float: left;
           /deep/.el-button{
             width: 90px;
             height: 30px;
             font-size: 12px;
             text-align: center;
             line-height: 8px;
           }
        .left-box-table{
           margin-top:20px;
            width: 100%;
            height: 588px;
            border: 1px solid #ccc;
            .top{
              width: 100%;
              height: 30px;
              background: #eee;
              line-height: 30px;
              h3{
                margin-left:10px;
              }
            }
            .list-box-table {
              width: 100%;
              height: calc(~'102% - 40px');
            }
        } 
      }
      .content-box{
        width: 800px;
        height: 650px;
        float: left;
        margin-left:20px;
        margin-top:10px;
        .left-content-box{
          width: 300px;
          height: 100%;
          float: left;
            .top{
              width:100%;
              height:50px;
              line-height: 50px;
              span{
                margin-left:80px;
              }
              /deep/ .el-select {
                .el-input__inner {
                        height: 25px;
                        width: 160px;
                        border-radius: 5px;
                        font-size:12px;
                    }
                }
            }
            .tree-box{
              width: 100%;
              height:600px;
              border:1px solid #ccc;
              .tree-top{
                width:100%;
                height: 30px;
                background: #eee;
                line-height: 30px;
                h3{
                  margin-left:10px;
                }
              }
            }
              
        } 
        .button-box{
          width: 100px;
          height: 100%;
          float: left;
          margin-left:20px;
          position: relative;
          .btn1{
             position: absolute;
             top:50%;
             left:20px;
          }
          .btn2{
             position: absolute;
             top:58%;
             left:10px;
          }
        }
        .right-content-box{
           width: 300px;
          height: 100%;
          float: left;
          margin-left:20px;
            .top{
              width:100%;
              height:50px;
              line-height: 50px;
               /deep/ .el-select {
                .el-input__inner {
                        height: 25px;
                        width: 160px;
                        border-radius: 5px;
                        font-size:12px;
                    }
                }
              /deep/.el-checkbox{
                width: 50px;
                margin-right:2px;
                /deep/.el-checkbox__label{
                  padding-left:5px;
                }
              }
            }
            .tree-box{
              width: 100%;
              height:599px;
              border:1px solid #ccc;
              .tree-top{
                width:100%;
                height: 30px;
                background: #eee;
                line-height: 30px;
                h3{
                  margin-left:10px;
                }
              }
            }
        }
      }
    }
   }
   /deep/.select-panel{
          min-width: 160px;
          position: absolute;
          top: 150px;
          left: 674px;
          transform-origin: center top;
          z-index: 2090;
        }
</style>