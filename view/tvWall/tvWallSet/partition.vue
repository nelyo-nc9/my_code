<template>
  <div class="tableWrap"
       style="width:100%;height:100%;background: #f2f2f2;">
    <div style="width:100%;height:100%">
      <div style="width:100%;padding:8px"
           v-if="openOrclose">
        <div class="list-header">
          <i class="el-icon-circle-plus-outline"
             title="新增"
             @click="addOrchange('add')"></i>
          <i class="el-icon-edit"
             title="编辑"
             @click="addOrchange('change')"></i>
          <i class="el-icon-delete"
             title="删除"
             @click="delectMethod(0)"></i>
        </div>
        <el-table :data="detectorList"
                  @selection-change="handleSelectionChange"
                  border
                  style="width: 100%"
                  size="mini"
                  stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column v-for="item in detectorTableColumn"
                           :key="item.label"
                           :prop="item.prop"
                           :width="item.width"
                           :label="item.label"
                           show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <div class="AddWrap"
           v-if="!openOrclose && createdAndchange">
        <div class="AddWrapTop">
          <div class="title">
            <span>分区名称</span>
          </div>
          <div class="const">
            <el-input v-model="formData.name"></el-input>
          </div>
        </div>
        <div class="AddWrapTop AddWrapTopStyle">
          <div class="title">
            <span>绑定MAC地址</span>
          </div>
          <div class="const">
            <el-input v-model="formData.mac"></el-input>
          </div>
        </div>
        <div class="parttab">
          <div class="AddWrapTab">
            <ul>
              <li :class="{ 'active-tab': changPage === index }"
                  v-for="(label, index) in tabLabels"
                  :key="label"
                  @click="changPage = index">
                {{ label }}
              </li>
            </ul>
          </div>
          <div style="width:100%;padding:8px;position: relative;"
               v-if="changPage === 0">
            <div class="list-header fontSize">
              <i @click="addCodeMethod"
                 class="el-icon-circle-plus-outline"
                 title="新增"></i>
              <i class="el-icon-delete"
                 title="删除"
                 @click="delectMethod(1)"></i>
              <i class="el-icon-top"
                 title="上移"
                 @click="upMethod()"></i>
              <i class="el-icon-bottom"
                 title="下移"
                 @click="downMethod()"></i>
            </div>
            <el-table :data="detectorList1"
                      @selection-change="handleSelectionChange1"
                      border
                      style="width: 100%"
                      height="260"
                      size="mini"
                      stripe>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index"
                               label="序号"></el-table-column>
              <el-table-column v-for="item in detectorTableColumn1"
                               :key="item.label"
                               :prop="item.prop"
                               :width="item.width"
                               :label="item.label"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <div class="footer">
              <el-button size="small"
                         @click="backList">取消</el-button>
              <el-button type="primary"
                         size="small"
                         @click="savePartMethod('created')">保存</el-button>
            </div>
            <div class="add_code"
                 v-if="addcode">
              <div class="code_top">
                <div class="title">窗口编号</div>
                <div class="const">
                  <el-select style="width:130px;"
                             v-model="formCode">
                    <el-option v-for="item in codeArr"
                               :key="item"
                               :label="item"
                               :value="item"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="code_bottom">
                <el-button size="small"
                           @click="addcode = false">取消</el-button>
                <el-button type="primary"
                           size="small"
                           @click="saveCodeMethod">保存</el-button>
              </div>
            </div>
          </div>
          <div class="treeWrap"
               v-show="changPage === 1">
            <div style="width:200px; height:290px;border:1px solid gainsboro;overflow: auto; margin-bottom: 10px;">
              <treeBox :default-checked-keys="(nodeKey || '').split(',')"
                       :lazyTreeApi="getTreeApi"
                       :lazyTreeCheckApi="getTreeApi"
                       @checkclick="checkclick"
                       @clickData="clickData"
                       :treeType="treeType"
                       searchType="search"
                       :lazyTreeSearchApi="getLazyTreeSearchApi"
                       treeLazyToggle
                       @rootId="rootId"
                       :checkboxToggle="true"
                       iconToggle>
              </treeBox>
            </div>
            <div class="footer1">
              <el-button size="small"
                         @click="back">取消</el-button>
              <el-button type="primary"
                         size="small"
                         @click="back">保存</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 修改 -->
      <div class="AddWrap"
           v-if="!openOrclose && !createdAndchange">
        <div class="AddWrapTop">
          <div class="title">
            <span>分区名称2</span>
          </div>
          <div class="const">
            <el-input v-model="changePartData.name"></el-input>
          </div>
        </div>
        <div class="AddWrapTop AddWrapTopStyle">
          <div class="title">
            <span>绑定MAC地址</span>
          </div>
          <div class="const">
            <el-input v-model="changePartData.mac"></el-input>
          </div>
        </div>
        <div class="parttab">
          <div class="AddWrapTab">
            <ul>
              <li :class="{ 'active-tab': changPage === index }"
                  v-for="(label, index) in tabLabels"
                  :key="label"
                  @click="changPage = index">
                {{ label }}
              </li>
            </ul>
          </div>
          <div style="width:100%;padding:8px;position: relative;"
               v-if="changPage === 0">
            <div class="list-header fontSize">
              <i @click="addCodeMethod"
                 class="el-icon-circle-plus-outline"
                 title="新增"></i>
              <i class="el-icon-delete"
                 title="删除"
                 @click="delectMethod(1)"></i>
              <i class="el-icon-top"
                 title="上移"
                 @click="upMethod()"></i>
              <i class="el-icon-bottom"
                 title="下移"
                 @click="downMethod()"></i>
            </div>
            <el-table :data="detectorList1"
                      @selection-change="handleSelectionChange1"
                      border
                      style="width: 100%"
                      height="260"
                      size="mini"
                      stripe>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index"
                               label="序号"></el-table-column>
              <el-table-column v-for="item in detectorTableColumn1"
                               :key="item.label"
                               :prop="item.prop"
                               :width="item.width"
                               :label="item.label"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <div class="footer">
              <el-button size="small"
                         @click="backList">取消</el-button>
              <el-button type="primary"
                         size="small"
                         @click="savePartMethod('change')">保存</el-button>
            </div>
            <div class="add_code"
                 v-if="addcode">
              <div class="code_top">
                <div class="title">窗口编号</div>
                <div class="const">
                  <el-select style="width:130px;"
                             v-model="formCode">
                    <el-option v-for="item in codeArr"
                               :key="item"
                               :label="item"
                               :value="item"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="code_bottom">
                <el-button size="small"
                           @click="addcode = false">取消</el-button>
                <el-button type="primary"
                           size="small"
                           @click="saveCodeMethod">保存</el-button>
              </div>
            </div>
          </div>
          <div class="treeWrap"
               v-show="changPage === 1">
            <div style="width:200px; height:290px;border:1px solid gainsboro;overflow: auto; margin-bottom: 10px;">
              <treeBox :lazyTreeApi="getTreeApi"
                       :treeType="treeType"
                       searchType="search"
                       :lazyTreeSearchApi="getLazyTreeSearchApi"
                       treeLazyToggle
                       @rootId="rootId"
                       :checkboxToggle="true"
                       iconToggle>
              </treeBox>
            </div>
            <div class="footer1">
              <el-button size="small"
                         @click="back">取消</el-button>
              <el-button type="primary"
                         size="small"
                         @click="back">保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, searchTreeApi2 } from '@src/http/tvWall/tvWallmanage.api'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      tvWallMessage: ({ tvWall }) => tvWall.allTvWallList, // 接受传出来的电视墙信息
      tvWallChangeData: ({ tvWall }) => tvWall.tvWallchangeData // 接受电视墙主页面(内容页面)发送的改变好数据格式的电视墙信息
    })
  },
  data() {
    return {
      addcode: false, // 添加窗口
      allData: [], // 整条数据
      codeArr: [], // 窗口编号
      formCode: null, // code的值
      macAdrss: '', // session
      windowCodeUsed: [], // 已经配置了的窗口
      createdAndchange: true, // 新建和修改的切换
      changePartData: {}, // 需要修改的分区信息
      treeType: 2,
      formData: {
        name: '',
        code: [],
        mac: '',
        permission: '',
        wallId: '',
        nodeKey: ''
      },
      nodeKey: '',
      // 分区列表数据
      detectorList: [],
      detectorTableColumn: [
        { prop: 'name', label: '分区名称', width: '' },
        { prop: 'windowCode', label: '窗口', width: '140' },
        { prop: 'mac', label: '绑定MAC地址', width: '98' },
        { prop: 'permissions', label: '报警资源权限', width: '98' }
      ],
      detectorList1: [],
      detectorTableColumn1: [{ prop: 'name', label: '窗口名称', width: '' }],

      openOrclose: true, // 控制显隐
      filterText: '',
      tabLabels: ['网格编号列表', '报警资源权限配置'],
      changPage: 0,
      multipleSelection: [], // 分区列表选中数据
      multipleSelection1: [] // 报警列表选中数据
    }
  },
  watch: {
    tvWallChangeData: {
      // 监听对象时要deep:true
      handler(newVal, oldVal) {
        this.getpartList() // 获取当前电视墙的分区列表
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_CREATED_FLOOR']),
    ...mapActions(['createPartmanage', 'chanegePartmanage', 'deletePartmanage', 'getPartmanageList']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        key: params.search
      }
      return searchTreeApi2(params)
    },
    // -------------- 列表的增删改 -----------------------------
    // 获取当前电视墙的分区列表
    getpartList() {
      let params = {
        wallId: this.tvWallMessage.id
      }
      this.getPartmanageList(params)
        .then(res => {
          if (res.data.code === 0) {
            this.detectorList = res.data.data.results || []
            if (this.detectorList.length !== 0) {
              this.windowCodeUsed = [] // 清空数组
              this.detectorList.map(item => {
                item['permissions'] = '已配置'
                let windowCodeArr = []
                item.code.map(item1 => {
                  this.windowCodeUsed.push(item1.code)
                  windowCodeArr.push(item1.name)
                  item['windowCode'] = windowCodeArr.join(',')
                })
              })
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // ----------------------------------------------------------
    // 拿到跟机构的id
    rootId(val) {
      this.formData.permission = val // 默认全部权限(机构树跟机构)
    },
    // 获取窗口编号
    getWindowCode() {
      this.codeArr = []
      let obj = JSON.parse(JSON.stringify(this.tvWallChangeData)) // 复制一份vuex里传下来的数据，不可以直接更改它
      this.allData = obj
      obj.map(item => {
        item.children &&
          item.children.map(val => {
            this.codeArr.push(val.windowIndex)
          })
      })
      console.log(this.windowCodeUsed)
      console.log(this.codeArr)
      // debugger
      // 差集=并集-交集  去除两个数组相同的元素
      this.codeArr = this.codeArr.filter(item => !this.windowCodeUsed.includes(item))
      console.log(this.codeArr)
      // debugger
    },
    // 报警资源权限配置
    checkclick(node, data, status) {
      console.log(node)
      console.log(data)
      console.log(status)
      // debugger
      this.formData.permission = node.id
      this.formData.nodeKey = node.nodeKey
    },
    clickData(data) {
      // 机构树加载节点信息
      if (data && data.id) {
        // 返回机构树加载根节点信息
        this.nodeKey = data.nodeKey // 高亮根节点
      }
    },
    // 点击新增按钮
    addOrchange(type) {
      if (type === 'change') {
        if (this.multipleSelection.length === 0) {
          this.failureMethod('请选择要修改的分区')
        } else if (this.multipleSelection.length === 1) {
          this.changePartData = this.multipleSelection[0]
          this.detectorList1 = this.changePartData.code
          this.createdAndchange = false
          this.openOrclose = false
        } else {
          this.failureMethod('修改哪条分区')
        }
      } else {
        this.getWindowCode() // 获取窗口编号
        // let macAndipData = JSON.parse(sessionStorage.getItem('macAddress'))
        // if (macAndipData) {
        //   this.formData.mac = macAndipData.adaptors[0].mac
        // }
        this.openOrclose = false
      }
    },
    // 新建/修改保存分区(发送保存请求)
    savePartMethod(val) {
      if (val === 'created') {
        // 新建
        this.formData.wallId = this.tvWallMessage.id
        if (this.detectorList1.length !== 0) {
          this.detectorList1.map(item => {
            let obj = { name: '', code: 0 }
            obj.name = item.name
            obj.code = item.code
            this.formData.code.push(obj) // 保存成功，清空数组
          })
        }
        if (this.formData.name === '') {
          this.failureMethod('请填写分区名称')
        } else if (this.formData.mac === '') {
          this.failureMethod('请填写mac地址')
        } else if (this.formData.code.length === 0) {
          this.failureMethod('请选择配置权限的窗口')
        } else {
          this.createPartmanage(this.formData)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('分区添加成功')
                this.getpartList() // 新建成功，刷新分区列表
                this.openOrclose = true // 新建页面关闭
                // 分区新建成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                let sendObj = {
                  state: true,
                  id: this.tvWallMessage.id
                }
                this.SET_CREATED_FLOOR(sendObj)
                this.detectorList1 = [] // 保存成功，清空数组
                this.formData = {
                  name: '',
                  code: [],
                  mac: '',
                  permission: '',
                  wallId: ''
                }
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      } else if (val === 'change') {
        // 修改分区
        let params = {
          id: this.changePartData.id,
          name: this.changePartData.name,
          mac: this.changePartData.mac,
          permission: this.changePartData.permission,
          code: [],
          wallId: this.tvWallMessage.id
        }
        this.detectorList1.map(item => {
          let obj = { code: 0, name: '' }
          obj.code = item.code
          obj.name = item.name
          params.code.push(obj)
        })
        if (this.changePartData.name === '') {
          this.failureMethod('请填写分区名称')
        } else if (this.changePartData.mac === '') {
          this.failureMethod('请填写mac地址')
        } else if (this.changePartData.code.length === 0) {
          this.failureMethod('请选择配置权限的窗口')
        } else {
          this.chanegePartmanage(params)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('分区修改成功')
                this.getpartList() // 新建成功，刷新分区列表
                this.openOrclose = true // 新建页面关闭
                this.createdAndchange = true
                // 分区修改成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                let sendObj = {
                  state: true,
                  id: this.tvWallMessage.id
                }
                this.SET_CREATED_FLOOR(sendObj)
                this.detectorList1 = [] // 保存成功，清空数组
              } else {
                this.failureMethod('分区修改失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    // 点击取消，返回列表
    backList() {
      this.createdAndchange = true
      this.openOrclose = true
    },
    back() {
      this.changPage = 0
    },
    // 删除弹框提示
    delectModel(val, index, data) {
      let title = '确定删除' + val + ', 是否继续?'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (index === 1) {
            // 删除分区列表
            let params = {
              ids: [],
              wallId: this.tvWallMessage.id
            }
            data.map(item => {
              params.ids.push(item.id)
            })
            this.deletePartmanage(params)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('删除成功')
                  this.getpartList()
                  // 分区删除成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                  let sendObj = {
                    state: true,
                    id: this.tvWallMessage.id
                  }
                  this.SET_CREATED_FLOOR(sendObj)
                } else {
                  this.failureMethod(res.data.message)
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else if (index === 2) {
            // 删除所选的窗口
            for (let i = 0; i < this.detectorList1.length; i++) {
              for (let j = 0; j < this.multipleSelection1.length; j++) {
                if (this.multipleSelection1[j].code === this.detectorList1[i].code) {
                  this.codeArr.push(this.multipleSelection1[j].code) // 删除一个，窗口数组中恢复一个
                  this.detectorList1.splice(i, this.multipleSelection1.length)
                  i--
                }
              }
            }
          }
        })
        .catch(() => { })
    },
    delectMethod(val) {
      if (val === 0) {
        if (this.multipleSelection.length === 0) {
          // 删除分区
          this.failureMethod('请选择要删除的分区')
        } else {
          this.delectModel('该分区', 1, this.multipleSelection)
        }
      } else if (val === 1) {
        if (this.multipleSelection1.length === 0) {
          // 删除窗口
          this.failureMethod('请选择要删除的窗口')
        } else {
          this.delectModel('该窗口', 2)
        }
      }
    },
    // 分区列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 窗口列表选中
    handleSelectionChange1(val) {
      this.multipleSelection1 = val
    },
    // 添加窗口
    addCodeMethod() {
      this.addcode = true
    },
    // 确定添加此窗口
    saveCodeMethod() {
      if (this.formCode === null) {
        this.addcode = false
      } else {
        let index
        let indexArr = []
        for (let i = 0; i < this.allData.length; i++) {
          let item = this.allData[i].children
          console.log(item)
          for (let j = 0; j < item.length; j++) {
            let val = item[j]
            if (this.formCode === val.windowIndex) {
              console.log(j)
              index = j
              break
            }
          }
        }
        console.log(index)
        for (let i = 0; i < this.allData.length; i++) {
          indexArr.push(this.allData[i].children[index].windowIndex)
        }
        console.log(indexArr)
        // debugger
        indexArr.map(item => {
          let obj = { name: '窗口' + item, code: item }
          this.detectorList1.push(obj) // 保存成功，清空数组
        })
        // 差集=并集-交集  去除两个数组相同的元素
        this.codeArr = this.codeArr.filter(item => !indexArr.includes(item))
        this.formCode = null
        this.addcode = false
      }
    },
    // 上移函数
    upMethod() {
      if (this.multipleSelection1.length === 0) {
        this.failureMethod('请选择要上移的数据')
      } else {
        const list = []
        this.detectorList1.forEach((item, index) => {
          this.multipleSelection1.forEach((itemChange, indexChange) => {
            if (item.id === itemChange.id) {
              list.push(index)
            }
          })
        })
        list.forEach(index => {
          this._upChannel(index)
        })
      }
    },
    _upChannel(index) {
      const nodes = this.detectorList1
      if (index !== 0) {
        const item1 = nodes[index - 1]
        const item2 = nodes[index]
        nodes.splice(index - 1, 2, item2, item1)
      }
    },
    // 下移函数
    downMethod() {
      if (this.multipleSelection1.length === 0) {
        this.failureMethod('请选择要下移的数据')
      } else {
        const list = []
        this.detectorList1.forEach((item, index) => {
          this.multipleSelection1.forEach((itemChange, indexChange) => {
            if (item.id === itemChange.id) {
              list.push(index)
            }
          })
        })
        list.forEach(index => {
          this._downChannel(index)
        })
      }
    },
    _downChannel(index) {
      const nodes = this.detectorList1
      if (index !== nodes.length - 1) {
        const item1 = nodes[index]
        const item2 = nodes[index + 1]
        nodes.splice(index, 2, item2, item1)
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
    }
  },
  created() {
    this.getpartList() // 新建成功，刷新分区列表
  }
}
</script>
<style scoped lang="less">
.list-header {
  text-align: right;
  margin-bottom: 2px;
  i {
    cursor: pointer;
    margin-right: 6px;
  }
}
.AddWrap {
  width: 100%;
  height: 100%;
  background-color: rgba(242, 242, 242, 1);
}
.search-box {
  width: 300px;
  padding: 20px 15px;
}
.AddWrapTop {
  display: flex;
  padding: 20px 15px;
  align-items: center;
}
.AddWrapTopStyle {
  padding-top: 0;
}
.title {
  width: 84px;
  text-align: center;
}
.const /deep/.el-input__inner {
  height: 30px;
}
.parttab {
  width: 80%;
  border: 1px solid gainsboro;
  height: 400px;
  margin-left: 15px;
  min-width: 308px;
  display: flex;
  flex-direction: column;
}
.AddWrapTab ul {
  display: flex;
  justify-content: center;
}
.AddWrapTab ul li {
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  min-width: 130px;
  border: 1px solid gainsboro;
  margin: 5px 16px 5px 0;
  line-height: 30px;
  height: 30px;
  border-radius: 5%;
}
.AddWrapTab ul li:hover {
  color: #4699f9;
}
.AddWrapTab .active-tab {
  color: #fff !important;
  background: #4699f9;
}
.fontSize {
  font-size: 14px;
  font-weight: 800;
}
.footer {
  margin-top: 24px;
  justify-content: flex-end;
  display: flex;
  padding-right: 26px;
}
.treeWrap {
  width: 100%;
  padding: 8px;
  justify-content: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.treeWrap /deep/ .el-tree {
  background-color: rgba(242, 242, 242, 1);
}
.footer1 {
  margin-left: 40%;
}
.add_code {
  width: 90%;
  height: 200px;
  position: absolute;
  top: 78px;
  left: 5%;
  z-index: 1;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
}
.code_top {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.code_bottom {
  height: 35px;
  text-align: right;
  margin-right: 20px;
}
.code_top .const /deep/ .el-input__suffix {
  top: 5px;
}
</style>
