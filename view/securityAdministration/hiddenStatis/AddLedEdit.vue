<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTvWallTreeApi"
               searchType="filter"
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
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>LED设备配置</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-box">
        <div class="form-title">LED设备信息</div>
        <div class="form-content magBottom">
          <div class="left-form">
            <el-form ref="addForm"
                     :rules="rules"
                     size="mini"
                     :model="formData"
                     label-position="right"
                     label-width="120px">
              <el-form-item label="设备名称"
                            required
                            class="maBottom"
                            prop="name">
                <el-input v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="所属机构"
                            required
                            class="maBottom"
                            prop="orgName">
                <el-input disabled
                          v-model="formData.orgName"></el-input>
              </el-form-item>
              <el-form-item label="所属重点部位"
                            required
                            class="maBottom"
                            prop="keyPartName">
                <el-input disabled
                          v-model="formData.keyPartName"></el-input>
              </el-form-item>
              <el-form-item label="接入服务器"
                            required
                            class="maBottom"
                            prop="accessService">
                <el-select v-model="formData.accessService">
                  <el-option v-for="item in devModelList4"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="IP地址"
                            required
                            class="maBottom"
                            prop="ip">
                <el-input v-model="formData.ip"></el-input>
              </el-form-item>
              <el-form-item label="端口"
                            required
                            class="maBottom"
                            prop="port">
                <el-input v-model.number="formData.port"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right-form">
            <el-form size="mini"
                     ref="addForm2"
                     :rules="rules"
                     :model="formData"
                     label-position="right"
                     label-width="120px">
              <el-form-item label="资源编码"
                            class="maBottom"
                            prop="assetCode">
                <el-input v-model="formData.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="所属电视墙"
                            class="maBottom">
                <el-select v-model="formData.wallName"
                           @change="changeTv">
                  <el-option v-for="item in devModelList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌"
                            class="maBottom"
                            required
                            prop="brand">
                <el-select v-model="formData.brand"
                           @change="changeBrand">
                  <el-option v-for="item in devBrandList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="型号"
                            required
                            class="maBottom"
                            prop="modelNum">
                <el-select v-model="formData.modelNum">
                  <el-option v-for="item in devModelList1"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用户名"
                            required
                            class="maBottom"
                            prop="username">
                <el-input v-model="formData.username"></el-input>
              </el-form-item>
              <el-form-item label="密码"
                            required
                            class="maBottom"
                            prop="password">
                <el-input v-model="formData.password"
                          show-password></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="footer">
          <ul>
            <li>
              <div class="title">
                <span>录入时间</span>
              </div>
              <div class="const"></div>
            </li>
            <li>
              <div class="title">
                <span>录入机构</span>
              </div>
              <div class="const"></div>
            </li>
            <li>
              <div class="title">
                <span>录入人</span>
              </div>
              <div class="const"></div>
            </li>
          </ul>
        </div>
        <div class="form-footer">
          <el-button type="primary"
                     size="small"
                     @click="sucessfulSave">保存</el-button>
          <el-button size="small"
                     @click="skipToList">取消</el-button>
          <el-button size="small"
                     @click="resetMethod">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTvWallTreeApi } from '../../../http/tvWall/tvWallmanage.api'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      formData_copy: ({ tvWall }) => tvWall.copy_data
    })
  },
  watch: {
    formData_copy: {
      handler(newVal, oldVal) {
        this.getcopy_data() // 处理复制数据
      },
      deep: true,
      immediate: true // 初次也监听
    }
  },
  data() {
    return {
      // 表单验证
      rules: {
        name: [
          { required: true, message: '解码设备名称不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        assetCode: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        username: [
          { required: true, message: '用户名不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }],
        accessService: [{ required: true, message: '接入服务器不能为空' }],
        password: [
          { required: true, message: '密码不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }],
        port: [
          { required: true, message: '端口不能为空' },
          { type: 'number', min: 0, max: 65535, message: '请填写0~65535范围端口' }],
        ip: [
          { required: true, message: 'ip不能为空' },
          { pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/, message: '请输入合法的IP' }],
        keyPartName: [{ required: true, message: '重点部位不能为空' }],
        brand: [{ required: true, message: '品牌不能为空' }],
        modelNum: [{ required: true, message: '型号不能为空' }],
        orgName: [{ required: true, message: '所属机构不能为空' }]
      },
      formData: {
        // 表单数据
        orgId: '',
        keyPartId: '',
        keyPartType: '',
        assetCode: '',
        name: '',
        brand: '',
        modelNum: '',
        username: '',
        password: '',
        accessService: '',
        ip: '',
        port: '',
        wallId: '',
        type: 3,
        accessProtocol: 'SDK',
        updatedBy: '', // 录入人 // 字段有问题
        updatedDept: '', // 字段有问题
        orgName: '', // 机构名称
        keyPartName: '', // 所属重点部位名称
        wallName: ''
      },
      changeTv_type: false, // 修改所属电视墙时，触发修改电视墙接口
      /**
       * 字典数据:所属电视墙
       * */
      // 所属电视墙下拉选项
      devModelList: [],
      // 接入服务器
      devModelList4: [],
      // 设备品牌下拉选项
      devBrandList: [],
      // 型号下拉选项
      devModelList1: [],
      dropdownStatus: {
        detector: false,
        output: false
      }
    }
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_COMPONENTID2', 'SET_TVWALL_COPYDATA']),
    ...mapActions(['addDecodingDevice', 'getTvWallMenuList', 'chanegeTvWallApi', 'getdictionariesdata', 'getservice']),
    getTvWallTreeApi(params) {
      return getTvWallTreeApi(params)
    },
    // 页面初始化函数
    initializationMethod() {
      this.Tvdictionaries() // 初始化字典数据
      this.getservicelist() // 获取接入服务器数据
      let queryList = [
        { type: '1', moduleId: '1', childModuleId: '8', dictId: '1' } // dictId:品牌是1  型号是2
      ]
      this.getTypeMethod(queryList, 1)
    },
    changeBrand(val) {
      this.formData.modelNum = ''
      for (let i = 0; i < this.devBrandList.length; i++) {
        if (this.devBrandList[i].value === val) {
          let queryList = [
            { type: '1', moduleId: '1', childModuleId: '8', dictId: '2', homeClass: this.devBrandList[i].label } // dictId:品牌是1  型号是2
          ]
          this.getTypeMethod(queryList, 2)
        }
      }
    },
    // 点击树节点，拿到对应的机构和重点部位
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.formData.orgId = data.id
        this.formData.orgName = data.name
      } else {
        let parentNode = node.parent
        if (!parentNode) {
          return
        }
        this.formData.orgId = (parentNode.data && node.parent.data.id) || ''
        this.formData.orgName = (parentNode.data && node.parent.data.name) || ''
        this.formData.keyPartId = data.id
        this.formData.keyPartName = data.name
      }
    },
    // 跳转到列表页
    skipToList() {
      this.SET_COMPONENTID1('LedEditList')
    },
    // 保存成功，跳转到详细信息页面
    sucessfulSave() {
      this.$refs['addForm'].validate(valid => {
        this.$refs['addForm2'].validate(valid2 => {
          if (valid && valid2) {
            let SendTvWallData = JSON.parse(JSON.stringify(this.formData))
            delete this.formData.keyPartName
            delete this.formData.orgName
            delete this.formData.wallName
            this.addDecodingDevice(this.formData)
              .then(res => {
                if (res.data.code === 0) {
                  SendTvWallData.id = res.data.data.id
                  this.succefullMethod('LED设备添加成功')
                  this.SET_TVWALL_MESSAGE(SendTvWallData)
                  this.SET_COMPONENTID2('add') // 从新建进入查看
                  this.SET_COMPONENTID1('newLedMessage')
                  let obj = {} // 清除复制的数据(vuex)
                  this.SET_TVWALL_COPYDATA(obj)
                  /**
                   * 如果新建时选中所属电视墙时，必须触发修改电视墙接口
                   * */
                  if (this.changeTv_type) {
                    let params = {
                      id: this.formData.wallId
                      // type: this.formData.type
                    }
                    this.chanegeTvWallApi(params)
                      .then(res => {
                        if (res.data.code === 0) {
                          this.changeTv_type = false // 修改成功，关闭
                        }
                      })
                      .catch(err => {
                        console.log(err)
                      })
                  }
                } else {
                  this.failureMethod('请求失败')
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      })
    },
    // 处理复制数据
    getcopy_data() {
      if (this.formData_copy.orgId) {
        this.formData.name = this.formData_copy.name
        this.formData.orgName = this.formData_copy.orgName
        this.formData.orgId = this.formData_copy.orgId
        this.formData.keyPartName = this.formData_copy.keyPartName
        this.formData.keyPartId = this.formData_copy.keyPartId
        this.formData.accessService = this.formData_copy.accessService
        this.formData.ip = this.formData_copy.ip
        this.formData.brand = this.formData_copy.brand
        this.formData.username = this.formData_copy.username
        this.formData.assetCode = this.formData_copy.assetCode
        this.formData.wallName = this.formData_copy.wallName
        this.formData.wallId = this.formData_copy.wallId
        this.formData.modelNum = this.formData_copy.modelNum
        this.formData.port = this.formData_copy.port
        this.formData.password = this.formData_copy.password
      }
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
    },
    // 重置
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
    /**
     * select框选中时触发
     * */
    changeTv(val) {
      this.changeTv_type = true // 激活修改电视墙
      this.formData.wallId = val
    },
    /*********************************************
     * 字典数据
     * 所有字典数据以dictionaries结尾
     */
    Tvdictionaries() {
      // 所属电视墙字典
      this.getTvWallMenuList()
        .then(res => {
          console.log(res.data.data.results)
          res.data.data.results.map(item => {
            let obj = { label: '', value: '' }
            obj.label = item.name
            obj.value = item.id
            this.devModelList.push(obj)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getservicelist() {
      // 接入服务器
      this.getservice()
        .then(res => {
          this.devModelList4 = []
          for (let i = 0; i < res.data.length; i++) {
            let tempData = {
              label: res.data[i],
              value: res.data[i]
            }
            this.devModelList4.push(tempData)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTypeMethod(args, num) {
      this.getdictionariesdata({ queryList: args })
        .then(res => {
          console.log(res, 'res============================')
          console.log(res.data.data[0].attr, '数据字典接口返回=========')
          if (num === 1) {
            this.devBrandList = []
            for (let i = 0; i < res.data.data[0].attr.length; i++) {
              let tempData = {
                label: res.data.data[0].attr[i].data,
                value: res.data.data[0].attr[i].data
              }
              this.devBrandList.push(tempData)
            }
            console.log(this.devBrandList, 'this.devBrandList=====')
          }
          if (num === 2) {
            this.devModelList1 = []
            for (let i = 0; i < res.data.data[0].attr.length; i++) {
              let tempData = {
                label: res.data.data[0].attr[i].data,
                value: res.data.data[0].attr[i].data
              }
              this.devModelList1.push(tempData)
            }
            console.log(this.devModelList1, 'this.devModelList1=====')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.initializationMethod()
  }
}
</script>
<style lang="less" scoped>
.form-content /deep/.el-input--mini {
  margin-left: 5px;
}
.magBottom /deep/.el-form-item--mini.el-form-item {
  // margin-bottom: 10px !important;
}
.right-form /deep/ .el-input--mini .el-input__inner {
  width: 250px;
}
.left-form /deep/ .el-input--mini .el-input__inner {
  width: 250px;
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
        width: 810px;
        font-weight: 600;
        text-align: center;
        padding: 20px 0;
        color: #606266;
      }
      .form-content {
        display: flex;
        width: 810px;
        padding: 15px;
        font-size: 12px;
        background: #f5f5f5;
        .left-form {
          width: 380px;
          margin-right: 24px;
        }
        .right-form {
          width: 380px;
        }
      }
      .form-footer {
        margin-top: 18px;
        width: 810px;
        text-align: center;
      }
    }
    .bottom-box {
      flex: 1;
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
  // 新建底部样式
  .footer {
    margin-top: 20px;
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
          // border: 1px solid #fff;
          // background: #f2f2f2;
        }
      }
    }
  }
}
</style>
