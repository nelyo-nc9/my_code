<template>
  <!-- 对讲设备配置管理  查看 -->
  <div class="main">
    <div class="form-box" v-if="activeCreate">
      <div class="top-box">
        <div class="button-box">
          <el-button size="mini"  v-print="'#printJS_container'">打印</el-button>
          <el-button size="mini" @click="close">关闭</el-button>
        </div>
      </div>

      <div class="print-container" ref="printJS_container" id="printJS_container">
        <div class="form-top">对讲设备信息</div>
        <div class="form-content">
          <div class="form-group">
            <span class="label">所属重点部位</span>
            <span class="form-item">{{ formData.keyPartName }}</span>
          </div>
          <div class="form-group">
            <span class="label">所属对讲平台</span>
            <span class="form-item">{{ formData.platformName }}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲设备名称</span>
            <span class="form-item">{{ formData.name }}</span>
          </div>
          <div class="form-group">
            <span class="label">类型</span>
            <span class="form-item">{{ formData.subSystemName }}</span>
          </div>
          <div class="form-group">
            <span class="label">品牌</span>
            <span class="form-item">{{ formData.brand }}</span>
          </div>
          <div class="form-group">
            <span class="label">型号</span>
            <span class="form-item">{{ formData.modelNum }}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲设备IP地址</span>
            <span class="form-item">{{ formData.ip }}</span>
          </div>
          <div class="form-group">
            <span class="label">端口号</span>
            <span class="form-item">{{ formData.port }}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲通道数量</span>
            <span class="form-item">{{ formData.intercomNumber }}</span>
          </div>
          <div class="form-group">
            <span class="label">对讲设备唯一ID</span>
            <span class="form-item">{{ formData.uniqueId }}</span>
          </div>
          <div class="form-group">
            <span class="label">资产编码</span>
            <span class="form-item">{{ formData.assetCode }}</span>
          </div>
          <div class="form-group">
            <span class="label">输出通道数量</span>
            <span class="form-item">{{ formData.outputNumber }}</span>
          </div>
          <div class="form-group">
            <span class="label last">在线状态</span>
            <span v-if="formData.status == 2" class="form-item last">在线</span>
            <span v-else-if="formData.status == 1" class="form-item last">离线</span>
            <span v-else class="form-item last">未知</span>
          </div>

        </div>
      </div>
    </div>
    <div class="wrap-bottom">
        <div class="bottom-box">
            <div style="width:100%;">
              <div class="form-title">
                <span class="title"
                      @click="dropdownStatus.detector1 = !dropdownStatus.detector1">对讲通道列表</span>
                <i :class="!dropdownStatus.detector1 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </div>
              <div v-show="!dropdownStatus.detector1"
                  style="width:100%;">
                <el-table 
                  size="mini"
                  :data="tableDataa"
                  stripe>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column v-for="item in talkColumn"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    :formatter="formatterTable"
                    show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>

        <div class="bottom-box">
            <div style="width:100%;">
              <div class="form-title">
                <span class="title"
                      @click="dropdownStatus.detector2 = !dropdownStatus.detector2">输出通道列表</span>
                <i :class="!dropdownStatus.detector2 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </div>
              <div v-show="!dropdownStatus.detector2"
                  style="width:100%;">
                <el-table 
                  border
                  style="width: 100%"
                  size="mini"
                  stripe
                  >
                  <el-table-column type="index"
                                  label="序号">
                  </el-table-column>
                  <el-table-column v-for="item in goColumn"
                                  :key="item.label"
                                  :prop="item.prop"
                                  :label="item.label"
                                  :formatter="formatterTable"
                                  show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>
      </div>
  </div>
</template>
<script>
import {getAudioHostApi,getHostListChannelApi,deletChannelListApi,createAudioChannelApi,editChannelListApi} from "../../../../../http/audioManage/talkback.api"
import {mapMutations} from "vuex"
export default {
  components: {},
  props:['talklist'],
  data() {
    return {
      activeCreate: true,
      formData: {
        // 表单数据
        
      },
      modalTitle:"",
      dropdownStatus: {
        detector1: false,
        detector2: false
      },
      talkback:{
        detector: true
      },

      statusList:[
        { label:'在线',value:"2",},
        { label:'离线',value:'1',},
        { label:'未知',value:'3',}
      ],
      talkColumn: [
        { prop: 'name', label: '对讲通道名称*',  width: '',sortable: true },
        { prop: 'serise', label: '对讲通道号',  width: '',sortable: true },
        { prop: 'type', label: '应用类型',  width: '',sortable: true },
        { prop: 'brand', label: '品牌',  width: '',sortable: true },
        { prop: 'modelNum', label: '型号',  width: '',sortable: true },
        { prop: 'assetCode', label: '资产编码',  width: '',sortable: true },
        { prop: 'status', label: '在线状态',  width: '',sortable: true },
        // { prop: 'status', label: '运行状态',  width: '',sortable: true }
      ],
      goColumn: [
        // 台麦列表项
        { prop: 'name', label: '输出通道名称*',  width: '',sortable: true },
        { prop: 'serise', label: '输出通道号',  width: '',sortable: true },
        { prop: 'brand', label: '输出设备品牌',  width: '',sortable: true },
        { prop: 'modelNum', label: '输出设备型号',  width: '',sortable: true },
        { prop: 'assetCode', label: '资产编码',  width: '',sortable: true },
        { prop: 'status', label: '在线状态',  width: '',sortable: true },
        // { prop: 'status', label: '运行状态',  width: '',sortable: true }
      ],
      tableDataa:[],
      arr:[],
      channels:[]
    }
  },
  methods: {
    formatterTable(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'status':
          if(cellValue == 1){
            params = '在线';
          }else if(cellValue == 2){
            params = '离线';
          }else{
            params = '未知';
          }
          break
          break
        case 'inputNumber':
        case 'outputNumber':
        case 'analogNumber':
        case 'audioNumber':
        case 'digitalNumber':
          params = cellValue === '' ? 0 : cellValue
          break
        case 'type':
          obj = {
            1: 'NVR',
            2: 'HDVR',
            3: 'DVR',
            4: 'IPC'
          }
          params = obj[cellValue] || ''
          break
        case 'protocol':
          obj = {
            1: 'TCP',
            2: 'UDP'
          }
          params = obj[cellValue] || ''
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    getchannelList(){
      let obj={
        id:this.talklist.id,
        type:1
      }
      getAudioHostApi(obj).then(res=>{
         console.log(res)
         this.tableDataa=res.data.data
      })
    },
    //点击关闭回到列表
    close(){
      this.$emit('closeEdit')
    }
  },
  mounted(){
    console.log(this.talklist)
    this.formData =  this.talklist
  },
  created(){
     this.getchannelList()
  }
}
</script>

<style lang="less" scoped>
  .main {
    width: 100%;
    height: 100%;
    .print-container{
      padding-bottom: 20px;
    }
    .bottom-box {
      margin-top: 35px;
      .title {
        margin-left: 7px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        position: relative;
        cursor: pointer;
      }
      .title::before {
        content: '';
        width: 2px;
        height: 12px;
        display: block;
        background: #2d72d3;
        position: absolute;
        left: -7px;
        top: 2.5px;
      }
      .form-title {
        margin: 20px 0 18px;
        i {
          color: #333;
        }
      }
      .form-title1{
        margin-top: 0;
      }
    }
    .content-btn {
      margin: 10px 0;
    }
    .form-box {
      width:1000px;
      .form-top {
        width: 846px;
        text-align: center;
        margin-bottom: 20px;
        font-size: 15px;
      }
      .form-content{
        color: #666;
        border: 1px solid #e1e1e1;
        overflow: hidden;
        .form-group {
          display: flex;
          width: 50%;
          float: left;
          height: 34px;
          line-height: 34px;
          .label {
            width: 145px;
            background: #f5f5f5;
            border-bottom: 1px solid #e1e1e1;
            text-align: center;
          }
          .label.last,
          .form-item.last{
            border-bottom: none;
          }
          .form-item {
            flex: 1;
            border-bottom: 1px solid #e1e1e1;
            border-left: none;
            padding-left:15px;
          }
        }
      }
    }
    .wrap-bottom{
      padding-bottom: 20px;
    }
  }
  @media print{
    .print-container{
      .form-top {
        width: 846px;
        text-align: center;
        padding: 10px 0;
        font-size: 15px;
      }
      .form-content{
        color: #666;
        padding: 4px;
        border: 1px solid #f2f2f2;
        overflow: hidden;
        .form-group {
          display: flex;
          width: 50%;
          float: left;
          height: 30px;
          line-height: 30px;
          .label {
            width: 145px;
            background: #f8f8f8;
            border: 1px solid #fff;
            text-align: center;
          }
          .form-item {
            flex: 1;
            border: 1px solid #f8f8f8;
            border-left: none;
            padding-left:15px;
          }
        }
      }
      .box-title {
        position: relative;
        height: 24px;
        line-height: 24px;
        color: #606266;
        margin-top: 10px 0;
        i {
          position: absolute;
          top: 50%;
          left: 100px;
          transform: translateY(-50%);
        }
        &::after {
          display: block;
          content: '';
          border-top: 1px solid #e1e1e1;
          width: calc(~'100% - 120px');
          margin-left: 120px;
          margin-top: -12px;
        }
      }

      .bottom-btn {
        margin-top: 12px;
        width: 846px;
        text-align: center;
      }
        
      }

    
  }
</style>
