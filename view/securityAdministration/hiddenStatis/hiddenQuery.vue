<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="filter"
               :treeType="treeType"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle>
      </treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>安全检查</el-breadcrumb-item>
            <el-breadcrumb-item>隐患统计</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>编辑</el-breadcrumb-item> -->
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-box">
        <div class="form-title" v-text="mechanismName">选中机构名称</div>
        <div class="form-title">隐患查询</div>
        <div class="form-content">
          <div class="left-form">
            <el-form ref="addForm"
                     :rules="rules"
                     size="mini"
                     :model="formDataCopy"
                     label-position="right"
                     label-width="120px">
              <el-form-item label="安全检查部位"
                            class="maBottom"
                             >
                <el-input v-model="formDataCopy.name"
                          maxlength="128"></el-input>
              </el-form-item>
              <el-form-item label="防范类别"
                            class="maBottom">
                <el-input v-model="formDataCopy.position"
                          maxlength="128"></el-input>
              </el-form-item>
              <el-form-item label="隐患编码"                         
                            class="maBottom">
                <el-input v-model="formDataCopy.keyPartName"
                          ></el-input>
              </el-form-item>
               <el-form-item label="开始时间"                          
                            class="maBottom">
                <el-input v-model="formDataCopy.uptime"
                          ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!--  :rules="rules" input 验证警告 -->
          <div class="right-form">
            <el-form size="mini"
                     ref="addForm2"                  
                     :model="formDataCopy"
                     label-position="right"
                     label-width="130px">
              <el-form-item label="重点部位名称"
                            class="maBottom"
                            prop="assetCode">
                <el-input v-model="formDataCopy.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="风险级别"
                            class="maBottom"
                          >
                <el-input v-model="formDataCopy.orgName"
                         ></el-input>
              </el-form-item>
              <el-form-item label="整改状态"
                            class="maBottom"
                           >
                <el-select v-model="formDataCopy.linkWallName"
                           @change="selectData">
                  <el-option v-for="item in devBrandList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="截止时间"                          
                            class="maBottom">
                <el-input v-model="formDataCopy.downTime"
                          ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary"
                     size="small"
                     @click="getDangerList">查询</el-button>
          <el-button size="small"
                     @click="resetMethod">重置</el-button>
      <el-button style="font-size:12px;" plain @click="Toprint('安全检查列表')">打印</el-button>
        </div>
      </div>
      <div class="bottom-box">
        <div style="width:100%;">
          <div class="box-title">
            <span class="pointer"
                  @click="toggleOpen('detector')">
              查询结果
              <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </span>
          </div>
        </div>
    <div >
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="index" label="序号" min-width="30"></el-table-column>
        <el-table-column
          v-for="item in detectorTableColumn"
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
       
      </el-table>
      <el-pagination
              style="text-align:center;"
              :page-sizes="[25, 50, 100, 200]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            ></el-pagination>
        </div>
      </div>
    </div>
    
   
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '../../../http/tvWall/tvWallmanage.api'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      formData: ({ tvWall }) => tvWall.tvWallData,
      formIndex: ({ tvWall }) => tvWall.whocomponentIndex
    })
  },
  data() {
    return {
       tableData: [
        {
          index: 1,
          date: '2016-05-02',
          name: '王小虎',
          id: 1,
          orgName: '北京'
        },
        {
          index: 2,
          date: '2016-05-04',
          name: '王小虎',
          id: 2,
          orgName: '上海'
        },
        {
          index: 3,
          date: '2016-05-01',
          name: '王小虎',
          id: 3,
          orgName: '北京'
        },
        {
          index: 4,
          date: '2016-05-03',
          name: '王小虎',
          id: 4,
          orgName: '西安'
        }
      ],
      rules: { // 表单验证
        name: [
          { required: true, message: '电视墙名称不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        assetCode: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        keyPartName: [
          { required: true, message: '重点部位不能为空' }
        ],
        orgName: [
          { required: true, message: '所属机构不能为空' }
        ],
        linkWallName: [
          { required: true, message: '联动默认电视墙不能为空' }
        ]
      },
      mechanismName:"选中机构名称",
      multipleSelection: [],
   //from 列表
      formDataCopy: {
        orgId: '',
        keyPartId: '',
        name: '',
        position: '',
        // server: '',
        linkWall: '',
        assetCode: null,
        type: '',
        updatedById: '',
        updatedDeptId: '',
        orgName: '', // 机构名称
        keyPartName: '', // 所属重点部位名称
        linkWallName: ''
      },
      treeType: 2, // 机构-重点部位树
      treeType1: 1, // 机构-重点部位-设备树

      // 请求树接口入参
      customizeQuery: {
        params: {
          subSystem: '7',
          isRecursion: '0',
          hostType: 1
        }
      },
      devBrandList: [
        // 整改状态下拉选项
        { label: '是', value: '是' },
        { label: '否', value: '否' }
      ],
      //table标题箭头控制
      dropdownStatus: {
        detector: true,
        output: true
      },
     // table列表 字段
      detectorTableColumn: [
        // 解码设备列表项
        { prop: 'name', label: '隐患问题', width: '100' },
        { prop: 'typeName', label: '安全检查部位', width: '' },
        { prop: 'ip', label: '重点部位名称', width: '' },
        { prop: 'port', label: '防范类别', width: '' },
        { prop: 'inputNumber', label: '风险级别', width: '95' },
        { prop: 'inputNumber', label: '隐患编码', width: '120' },
        { prop: 'outputNumber', label: '整改责任人', width: '95' },
        { prop: 'assetCode', label: '备注', width: '' },
        { prop: 'inputNumber', label: '整改状态', width: '120' },
        { prop: 'outputNumber', label: '整改限期', width: '95' },

      ],
     
      LEDList: [],
      isEditDetector: false, // 新增or修改
      isEditOutput: false, // 控制输出通道新增or编辑弹框显隐
      dialogVisible: false, // 是否删除确认提示框
      detectorData: {
        isLink: ''
      },
      downloadObject: []//打印导出数据

    }

  },
   mounted() {
    this.formDataCopy = JSON.parse(JSON.stringify(this.formData)) // 克隆(避免直接修改vue里的数据)
    if (this.formDataCopy) {
      this.getDangerList() // 获取隐匿问题列表
      // this.getLEDList(1) // 获取LED设备列
    }
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_COMPONENTID2']),
    ...mapActions(['chanegeTvWallApi', 'changeDecodingDevice', 'getDecodingDevice', 'deleteDecodingDevice', 'relievedeviceApi']),
    //获取树结构数据
    getTreeApi(params) {
      return getTreeApi(params)
    },
    //获取选中状态数据
    handleSelectionChange(val) {
      this.downloadObject = val
    },
    // 下拉框状态控制
    selectData (){

    },
      resetMethod() {
      this.formData = {
        orgId: '',
        keyPartId: '',
        keyPartType: '',
        assetCode: '',
        name: '',
        brand: '',
        modelNum: '',
        username: '',
        password: '',
        ip: '',
        accessService: '',
        port: '',
        wallId: '',
        type: 3,
        orgName: '', // 机构名称
        keyPartName: '' // 所属重点部位名称
      }
    },
    //打印方法
     Toprint(title) {
      // 判断打印全部还是选中
      let list = []
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属部门' },
          { field: 'date', displayName: '申请编号' },
          { field: 'name', displayName: '申请缘由' },
          { field: 'date', displayName: '访客信息' },
          { field: 'name', displayName: '入园时间' },
          { field: 'date', displayName: '结束时间' },
          { field: 'name', displayName: '被访区域' },
          { field: 'date', displayName: '审批状态' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">' + title + '</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    //——————————————————————————————————————————————————————————————————————————————
    // 获取问题列表
    getDangerList(val) {
      //参数对象
      let params = {
        limit: 200,
        page: 1,
        orgId: '',
        keyPartId: '',
        wallId: this.formDataCopy.id,
        type: '1,2,4'
      }
      //请求方法
      this.getDecodingDevice(params)
        .then(res => {
          if (val === 2) {
            this.succefullMethod('数据刷新成功')
          }
         
        })
        .catch(err => {
          console.log(err)
        })
    },
   
    // table选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 点击机构树的节点
    onceClick(data, node) {
      debugger
      if (data.tierType === 'org') {
        this.formDataCopy.orgName = data.name
        this.formDataCopy.orgId = data.id
      } else {
        let parentNode = node.parent
        if (!parentNode) {
          return
        }
        this.formDataCopy.orgId = (parentNode.data && node.parent.data.id) || ''
        this.formDataCopy.orgName = (parentNode.data && node.parent.data.name) || ''
        this.formDataCopy.keyPartId = data.id
        this.formDataCopy.keyPartName = data.name
      }
    },
    // 点击设备树的节点
    onceClick1(data, node) {
      console.log(data)
       debugger
      if (data.tierType === 'equ') {
        this.equData.name = data.name
        this.equData.id = data.id
        this.equData.type = data.type
      }
    },
  
    // 跳转到列表页
    skipToList() {
      this.SET_COMPONENTID1('ManageList')
    },
   
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    }
  },
 
}
</script>
<style lang="less" scoped>
.decodingWrap /deep/.el-dialog__header {
  border-bottom: 1px solid gainsboro;
  padding: 10px 20px 10px;
}
.decodingWrap /deep/.el-dialog__title {
  font-size: 16px;
}
.decodingWrap /deep/.el-dialog__headerbtn {
  top: 15px;
}
.decodingWrap /deep/ .el-dialog__body {
  padding: 16px 20px;
}
.decoding-box {
  width: 100%;
  max-height: 400px;
  overflow: auto;
  margin-bottom: 15px;
}
.decoding-box /deep/ .el-input--mini .el-input__inner {
  width: 240px;
}
.decoding-box /deep/ .el-input__suffix {
  right: 110px;
  top: 1px;
}
.form-content /deep/.el-input--mini {
  margin-left: 5px;
}
.right-form /deep/ .el-input--mini .el-input__inner {
  width: 250px;
}
.left-form /deep/ .el-input--mini .el-input__inner {
  width: 260px;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .left-tree {
    width: 240px;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    font-size: 14px;
    padding: 0 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .form-box {
      .form-title {
        width: 830px;
        font-weight: 600;
        text-align: center;
        padding: 20px 0;
        color: #606266;
      }
      .form-content {
        display: flex;
        width: 830px;
        // width: 700px;
        padding: 15px;
        font-size: 12px;
        border: 1px solid #f2f2f2;
        .left-form {
          width: 380px;
          margin-right: 24px;
        }
        .right-form {
          width: 380px;
        }
      }
      .form-footer {
        margin-top: 12px;
        width: 830px;
        text-align: center;
      }
    }
    .bottom-box {
      flex: 1;
      overflow: auto;
    }
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
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
    .pointer {
      cursor: pointer;
      display: inline-block;
      width: 120px;
    }
  }
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 6px;
    }
  }
  .maBottom {
    margin-bottom: 14px !important;
  }
  .footer {
    margin-top: 30px;
    width: 830px;
    border: 1px solid #f2f2f2;
    height: 40px;
  }
  .footer ul {
    font-size: 12px;
    display: flex;
  }
  .footer ul li {
    display: flex;
    justify-content: space-between;
  }
  .footer .title {
    text-align: center;
    width: 110px;
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
  }
  .footer .const {
    width: 166px;
    height: 100%;
    text-align: center;
    line-height: 40px;
  }
}
</style>
<style lang="less">
.content {
  .right-content {
    .form-box {
      .left-form,
      .right-form {
        .el-form-item--mini.el-form-item {
          margin-bottom: 0;
        }
        .el-form-item__label {
          border: 1px solid #fff;
          background: #f2f2f2;
        }
      }
    }
  }
}
