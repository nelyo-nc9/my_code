<template>
  <div id="vsddd">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
      <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
      <el-breadcrumb-item>门禁平台配置</el-breadcrumb-item>
      <el-breadcrumb-item>列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>{{optType == 'Create' ? '新建' : '修改'}}</el-breadcrumb-item> -->
    </el-breadcrumb>
    <div class="viewVBtns">
      <el-button size="mini" v-print="'#contentinfo'">
        <i class="el-icon-printer"></i>
        打印
      </el-button>
      <el-button @click="chageType(true)" size="mini">关闭</el-button>
    </div>

    <div class="listViewBtns" style="overflow-y:auto;height: calc(100% - 103px);">
      <div class="tables" id="contentinfo" style="overflow-y:auto">
        <el-collapse value="1">
          <el-collapse-item title name="1">
            <p style="text-align:center;padding:10px 0">门禁平台信息</p>
            <div class="form-box">
              <div class="form-content">
                <div class="left-form">
                  <el-form :model="updataItem" size="mini" label-position="right" label-width="120px">
                    <el-form-item label="门禁平台名称">
                      <span>{{ updataItem.name }}</span>
                    </el-form-item>
                    <el-form-item label="所属机构">
                      <span>{{ updataItem.orgName }}</span>
                    </el-form-item>
                    <!-- <el-form-item label="所属子系统" required>
                      <span>{{updataItem.subSystemName || '--'}}</span>
                    </el-form-item>-->
                    <el-form-item label="品牌">
                      <span>{{ updataItem.brand }}</span>
                    </el-form-item>
                    <el-form-item label="接入服务器">
                      <span>{{ updataItem.accessService || '--' }}</span>
                    </el-form-item>
                    <el-form-item label="IP地址">
                      <span>{{ updataItem.ip }}</span>
                    </el-form-item>
                    <!-- <el-form-item label="用户名" required>
                      <span>{{updataItem.username}}</span>
                    </el-form-item>-->
                  </el-form>
                </div>
                <div class="right-form">
                  <el-form size="mini" label-position="right" label-width="120px">
                    <el-form-item label="所属重点部位">
                      <span>{{ updataItem.keyPartName || '--' }}</span>
                    </el-form-item>
                    <el-form-item label="型号">
                      <span>{{ updataItem.modelNum }}</span>
                    </el-form-item>
                    <el-form-item label="端口">
                      <span>{{ updataItem.port }}</span>
                    </el-form-item>
                    <el-form-item label="密码">
                      <span>{{ updataItem.password }}</span>
                    </el-form-item>
                    <el-form-item label="用户名">
                      <span>{{ updataItem.username }}</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="bottomInfo">
                <userInfo :Info="Info" />
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

        <div class="collapses">
          <div class="collapse-item">
            <div class="box-title" style="margin-bottom:10px">
              <span class="pointer" style="color:#2D72D3" @click="toggleOpen('videoChan')">
                门禁主机列表
                <i :class="dropdownStatus.videoChan ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.videoChan" style="width:100%;">
              <div
                class="list-header"
                style="text-align:right; font-size: 16px;display:none"
                @click="Multifunction($event)"
              >
                <i class="el-icon-download" title="获取主机信息" @click="getHost"></i>
                <i class="el-icon-circle-plus-outline" title="新增" @click="addHost"></i>
                <i class="el-icon-edit" title="编辑"></i>
                <i class="el-icon-delete" title="删除" @click="delHost"></i>
                <i class="el-icon-refresh-right" title="刷新" @click="Refresh"></i>
              </div>
              <!-- <div style="margin-bottom:30px"> -->
              <el-table :data="host" v-loading="loading" tooltip-effect="dark" style="width: 100%">
                <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
                <el-table-column show-overflow-tooltip label="序号" width="60" type="index"></el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="门禁主机名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="uniqueId" label="门禁主机ID"></el-table-column>
                <!-- <el-table-column label="在线状态">
                    <template slot-scope="scope">
                      <span v-show="scope.row.status == 1">在线</span>
                      <span v-show="scope.row.status == 2">离线</span>
                    </template>
                  </el-table-column>-->
                <el-table-column show-overflow-tooltip label="门禁主机类型">
                  <template slot-scope="scope">
                    <span v-show="scope.row.type == 1">金库门禁</span>
                    <span v-show="scope.row.type == 2">普通门禁</span>
                    <span v-show="scope.row.type == 3">互锁门门禁</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="assetCode" label="资产编码"></el-table-column>
                <el-table-column show-overflow-tooltip prop="guardNumber" label="门禁通道数"></el-table-column>
                <el-table-column show-overflow-tooltip prop="readerNumber" label="读头数量"></el-table-column>
                <el-table-column show-overflow-tooltip prop="inputNumber" label="报警输入数量"></el-table-column>
              </el-table>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <el-dialog :title="clickHostType" :visible.sync="isEditDetector" width="400px">
      <!-- clickHostType  createHostBody-->
      <el-form
        :model="createHostBody"
        size="mini"
        label-position="right"
        label-width="120px"
        v-if="clickHostType == '新增'"
      >
        <el-form-item label="资产编码" required>
          <el-input v-model="createHostBody.assetCode"></el-input>
        </el-form-item>
        <el-form-item label="唯一标识ID" required>
          <el-input v-model="createHostBody.uniqueId"></el-input>
        </el-form-item>
        <el-form-item label="门禁主机名称" required>
          <el-input v-model="createHostBody.name"></el-input>
        </el-form-item>

        <el-form-item label="主机类型" required>
          <el-select v-model="createHostBody.type">
            <el-option label="金库门禁" value="1"></el-option>
            <el-option label="普通门禁" value="2"></el-option>
            <el-option label="互锁门门禁" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" required>
          <el-select v-model="createHostBody.brand">
            <el-option label="丽泽" value="NeaTech"></el-option>
            <el-option label="DDS" value="DDS"></el-option>
            <el-option label="海康" value="HIK"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" required>
          <el-select v-model="createHostBody.modelNum">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <!-- <el-option
                      v-for="(item, index) in modelNum"
                      :key="index"
                      :label="item"
                      :value="item"
                ></el-option>-->
            <!-- <el-option label="A" value="A"></el-option>
                    <el-option label="B" value="B"></el-option>
                <el-option label="C" value="C"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="读头通道数量" required>
          <el-input v-model="createHostBody.readerNumber"></el-input>
        </el-form-item>
        <el-form-item label="门禁通道数量" required>
          <el-input v-model="createHostBody.guardNumber"></el-input>
        </el-form-item>
        <el-form-item label="报警输入数量" required>
          <el-input v-model="createHostBody.inputNumber"></el-input>
        </el-form-item>
        <el-form-item label="在线状态" required>
          <el-select v-model="createHostBody.status">
            <!-- <el-option label="全部" value="全部"></el-option> -->
            <el-option label="在线" value="1"></el-option>
            <el-option label="离线" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 编辑 -->
      <el-form
        v-if="clickHostType == '编辑'"
        :model="platformDatas"
        size="mini"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="资产编码" required>
          <el-input v-model="platformDatas.assetCode"></el-input>
        </el-form-item>
        <el-form-item label="唯一标识ID" required>
          <el-input v-model="platformDatas.uniqueId"></el-input>
        </el-form-item>
        <el-form-item label="门禁主机名称" required>
          <el-input v-model="platformDatas.name"></el-input>
        </el-form-item>

        <el-form-item label="主机类型" required>
          <el-select v-model="platformDatas.type">
            <el-option label="金库门禁" value="1"></el-option>
            <el-option label="普通门禁" value="2"></el-option>
            <el-option label="互锁门门禁" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" required>
          <el-select v-model="platformDatas.brand">
            <el-option label="丽泽" value="NeaTech"></el-option>
            <el-option label="DDS" value="DDS"></el-option>
            <el-option label="海康" value="HIK"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" required>
          <el-select v-model="platformDatas.modelNum">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <!-- <el-option
                      v-for="(item, index) in modelNum"
                      :key="index"
                      :label="item"
                      :value="item"
                ></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="读头通道数量" required>
          <el-input v-model="platformDatas.readerNumber"></el-input>
        </el-form-item>
        <el-form-item label="门禁通道数量" required>
          <el-input v-model="platformDatas.guardNumber"></el-input>
        </el-form-item>
        <el-form-item label="报警输入数量" required>
          <el-input v-model="platformDatas.inputNumber"></el-input>
        </el-form-item>
        <el-form-item label="在线状态" required>
          <el-select v-model="platformDatas.status">
            <el-option label="在线" value="1"></el-option>
            <el-option label="离线" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button size="mini" type="primary" @click="saveDetector(clickHostType)">保存</el-button>
        <el-button size="mini" @click="isEditDetector = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getHosts, getDetal } from '@src/http/access/accessMan'
import { getZhiDhosts } from '@src/http/access/control'
import { creatHost, removeHost, delHostList, getRmOrDelHostsList } from '@src/http/access/host'

export default {
  components: {
    TabMenu: () => import('../../components/tabMenu'),
    userInfo: () => import('@src/view/accessControl/components/userInfo.vue'),
  },
  data() {
    return {
      selectHost: [],
      listPopsData: {}, // 克隆传过来的数据
      loading: false,
      platformDatas: {},
      hostInfo: {},
      createHostBody: {
        // 新增or编辑探测器表单
        assetCode: '', //资产编码
        uniqueId: '', // 唯一标识id
        name: '', // 主机名称
        type: '', //主机类型
        brand: '', // 品牌
        modelNum: '', // 型号i
        readerNumber: '', //读头通道数量
        guardNumber: '', // 门禁通道数量
        inputNumber: '', //报警输入数量
        status: '', // 在线状态 1 离线 2在线
      },
      delHostArr: [],
      clickHostType: '',
      isEditDetector: false,

      dropdownStatus: {
        videoChan: true,
        audioChan: false,
        inputChan: false,
      },
      platform: {},
      host: [], //指定平台主机列表数据
      Info: {},
      tableData: [],
      currentPage4: 4,
      isCreate: '',
      activeNames: '1',
      tabList: ['基础信息', '门禁平台管理', '列表', '查看'],
    }
  },
  props: ['isView', 'deviceModel', 'listRow', 'qianyi', 'updataItem', 'viewPsData'],
  methods: {
    /* 打印 */
    // print() {
    //   printJS('printBox', 'html')
      // let list = []
      // if (this.delHostArr && this.delHostArr.length > 0) {
      //   list = this.delHostArr
      // } else {
      //   list = this.tableData
      // }
      // list = list.map((item) => {
      //   return {
      //     orgName: item.orgName || '',
      //     keyPartName: item.keyPartName || '',
      //     subSystemName: item.subSystemName || '',
      //     name: item.name || '',
      //     brand: item.brand || '',
      //     modelNum: item.modelNum || '',
      //     accessProtocol: item.accessProtocol || '',
      //     assetCode: item.assetCode || '',
      //     uniqueId: item.uniqueId || '',
      //     ip: item.ip || '',
      //     port: item.port || '',
      //     cport: item.cport || '',
      //     dport: item.dport || '',
      //     username: item.username || '',
      //     password: item.password || '',
      //     status: item.status || '',
      //     status: item.status || '',
      //     updatedDeptId: item.updatedDeptId || '',
      //     updatedById: item.updatedById || '',
      //     updatedAt: item.updatedAt || '',
      //   }
      // })
      // printJS({
      //   //表格数据的来源
      //   printable: list,
      //   //field 表格内容  displayName：表头名
      //   properties: [
      //     { field: 'orgName', displayName: '所属机构' },
      //     { field: 'keyPartName', displayName: '所属重点部位' },
      //     { field: 'subSystemName', displayName: '所属子系统' },
      //     { field: 'name', displayName: '对讲平台名称' },
      //     { field: 'brand', displayName: '品牌' },
      //     { field: 'modelNum', displayName: '型号' },
      //     { field: 'accessProtocol', displayName: '接入协议' },
      //     { field: 'assetCode', displayName: '资产编码' },
      //     { field: 'uniqueId', displayName: '对讲平台唯一ID' },
      //     { field: 'ip', displayName: 'IP地址' },
      //     { field: 'port', displayName: '终端接收端口' },
      //     { field: 'cport', displayName: '服务器接收端口' },
      //     { field: 'dport', displayName: '级联音频端口' },
      //     { field: 'username', displayName: '用户名' },
      //     { field: 'password', displayName: '密码' },
      //     { field: 'status', displayName: '在线状态' },
      //     { field: 'status', displayName: '运行状态' },
      //     { field: 'updatedDeptId', displayName: '录入机构' },
      //     { field: 'updatedById', displayName: '录入人' },
      //     { field: 'updatedAt', displayName: '录入时间' },
      //   ],
      //   type: 'json',
      //   // 表题
      //   header: '<p class="custom">门禁平台主机信息</p>',
      //   // 表题样式
      //   style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
      //   //表头样式
      //   gridHeaderStyle:
      //     'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111; ',
      //   //内容样式
      //   gridStyle: 'border: 1px solid lightgray; font-size:12px; text-align:center;color:#222;',
      // })
    // },
    async saveDetector(hostType) {
      if (hostType == '新增') {
        this.isEditDetector = false
        let { keyPartType, keyPartId, id, subSystem, orgId } = this.updataItem

        this.createHostBody.platformId = id
        // 创建门禁主机
        await creatHost(this.createHostBody).then((res) => {
          console.log('Log ??/', res)
          this.$message({
            message: '新建主机成功',
            type: 'success',
          })
          getRmOrDelHostsList(`/resource/v1/guard/platform/${id}/host`).then((res) => {
            console.log('Log 查看数据完成', res)
            this.host = res.data.data
          })
        })
      }
      if (hostType == '编辑') {
        this.isEditDetector = false
        // removeHost(`/resource/v1/guard/host/${this.updataItem.id}`).then(res => {
        //   console.log('Log 主机是否修改成功?', res)
        //   this.$message({
        //     message: '编辑主机成功',
        //     type: 'success'
        //   })
        //   this.$refs.multipleTable.clearSelection()
        //   this.isEditDetector = false
        // })
        console.log('Log ????xx查看修改后的数据源', this.hostInfo)
        let body = {
          assetCode: this.hostInfo.assetCode,
          uniqueId: this.hostInfo.uniqueId,
          name: this.hostInfo.name,
          id: this.hostInfo.id,
          type: this.hostInfo.type,
          brand: this.hostInfo.brand,
          modelNum: this.hostInfo.modelNum,
          readerNumber: this.hostInfo.readerNumber,
          guardNumber: this.hostInfo.guardNumber,
          inputNumber: this.hostInfo.inputNumber,
          status: this.hostInfo.status,
        }
        // 修改主机
        removeHost(`/resource/v1/guard/host/${this.updataItem.id}`, this.cloneDeepHostInfo).then((res) => {
          console.log('Log 主机是否修改成功?', res)
          this.loading = true
          setTimeout(() => {
            getHosts(this.updataItem).then((res) => {
              // 获取修改后的主机
              console.log('Log ???---------', res)
              this.host = res.data.data
              this.$message({
                message: '编辑主机成功',
                type: 'success',
              })
              this.loading = false
              this.isEditDetector = false
            })
          }, 1000)
          // this.$refs.multipleTable.clearSelection()
        })
      }
      if (hostType == '删除') {
        this.isEditDetector = false
      }
      for (const key in this.createHostBody) {
        this.createHostBody[key] = ''
      }
    },
    Multifunction(v) {
      // 获取指定平台下的主机列表
      switch (v.target.title) {
        case '获取主机信息':
          this.clickHostType = '新增'
          return
          alert('xxxxxxxxxxx')
          this.loading = true
          setTimeout(() => {
            getHosts(this.updataItem).then((res) => {
              console.log('Log 查看指定平台下的所有主机', res)
              this.host = res.data.data.hosts
              if (this.host.length < 1) {
                this.$message({
                  message: '暂无主机信息,请新建主机后查看',
                  type: 'warning',
                })
              } else {
                this.$message({
                  message: '获取主机信息成功',
                  type: 'success',
                })
              }

              this.loading = false
            })
          }, 1000)
          break
        case '新增':
          /* fn... */
          this.clickHostType = '新增'
          return
          let param = {
            // detcreateHostBodyectorData: {
            //   // 新增or编辑探测器表单
            //   name: this.detectorData.name,
            //   serialNumber: this.detectorData.serialNumber,
            //   deviceType: this.detectorData.deviceType,
            //   count: this.detectorData.count, //型号
            //   brand: this.detectorData.brand, //品牌
            //   code: this.detectorData.code
            // }
          }
          this.isEditDetector = true
          break
        case '编辑':
          this.clickHostType = '编辑'
          if (this.host.length < 1) {
            this.$message({
              message: '暂无主机',
              type: 'error',
            })
            return
          }
          if (this.delHostArr.length < 1) {
            this.$message({
              message: '请选择主机',
              type: 'error',
            })
            return
          }
          this.isEditDetector = true
          break
        case '删除':
          this.clickHostType = '删除'
          return
          if (false) {
            this.$message({
              message: '编辑成功',
              type: 'success',
            })
          }

          break
        case '刷新':
          /* fn... */
          this.loading = true
          return
          setTimeout(() => {
            getHosts(this.updataItem).then((res) => {
              console.log('Log 查看指定平台下的所有主机', res)
              this.host = res.data.data.hosts
              this.$message({
                message: '刷新成功',
                type: 'success',
              })
            })
            this.loading = false
          }, 1000)
          break
        default:
          break
      }
    },
    getHostTDlist(type) {
      // console.log('Log 查看平台id', this.updataItem)
      let { id } = this.updataItem
      let params = {
        id: id,
      }
      // this.loading = true
      getZhiDhosts(params).then((res) => {
        console.log('Log 查看指定平台下的所有主机是否成功?', res)
        console.log('Log', res)
        if (res.data.code != 0) {
          this.$message({
            message: '服务器繁忙',
            type: 'error',
          })
          // this.loading = false
          return
        } else {
          // this.loading = false
        }
        setTimeout(() => {
          getHosts(this.updataItem).then((res) => {
            console.log('Log ???---------', res)
            this.$message({
              message: type == '刷新完毕' ? type : '更新主机成功',
              type: 'success',
            })
            this.host = res.data.data
            // this.loading = false
          })
        }, 1000)
      })
    },
    /*  */
    getHost() {
      this.getHostTDlist()
    },
    addHost() {
      this.isEditDetector = true
    },
    delHost() {
      if (this.host.length < 1) {
        this.$message({
          message: '暂无主机数据,请添加',
          type: 'warning',
        })
        return
      } else if (this.delHostArr.length < 1) {
        this.$message({
          message: '请选择要删除的主机',
          type: 'warning',
        })
        return
      } else {
        this.$confirm('此操作将删除指定主机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let idsArr = this.delHostArr
              .map((item) => item.id)
              .join()
              .split(',')
            let ids = idsArr
            delHostList({ ids: idsArr }).then((res) => {
              // this.$refs.multipleTable.clearSelection()
              this.isEditDetector = false
              // this.dbGetList()
              // this.loading = true
              setTimeout(() => {
                getRmOrDelHostsList(`/resource/v1/guard/platform/${this.updataItem.id}/host`).then((res) => {
                  console.log('Log 查看数据完成', res)
                  this.$message({
                    type: 'success',
                    message: '删除主机成功',
                  })
                  this.host = res.data.data
                })
                // this.loading = false
              }, 1000)
              // getDetal(this.updataItem).then(res => {
              //   this.host = res.data.data.hosts
              // })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      }
    },
    Refresh() {
      this.getHostTDlist('刷新完毕')
    },
    select(s, row) {
      this.delHostArr = s
      this.hostInfo = row

      console.log('Log 查看选中的对象', this.hostInfo)
    },
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    chageType(a) {
      this.$confirm('此操作返回列表页, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // this.$parent.$parent.childrenComponent = 'List'
          this.$emit(
            'modelChange',
            {
              ParerntFlag: a,
              CurrtTitle: '列表',
            },
            'Create'
          )
          this.$notify({
            title: '成功',
            message: '返回列表页成功',
            type: 'success',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    //table 多选
    tableSelect() {},
    collapseChange(chageItem) {},
    handleSizeChange() {},
    handleCurrentChange() {},

    // 获取指定平台下的主机列表
    getDesignatedPlatformHost() {
      let params = {
        id: this.updataItem.id,
      }
      getZhiDhosts(params).then((res) => {
        console.log('Log 查看指定平台下的所有主机是否成功?', res)
        getHosts(this.updataItem).then((res) => {
          console.log('Log 查看res', res)
          // this.platform = res.data.data.platform
          this.host = res.data.data
          this.$message({
            message: '主机更新成功',
            type: 'success',
          })
        })
      })
    },
  },
  created() {
    // this.getDesignatedPlatformHost()
  },
  mounted() {
    let obj = this.$lodash.cloneDeep(this.updataItem)
    this.listPopsData = obj
    console.log('Log useinfo数据', this.updataItem)
    this.Info = {
      updatedAt: this.updataItem.updatedAt,
      updatedDept: this.updataItem.updatedDept,
      updatedBy: this.updataItem.updatedBy,
    }
    this.loading = true
    this.timer = setTimeout(() => {
      getDetal(this.updataItem.id).then((res) => {
        if(res.data.code != 0){
               this.$notify({
            title: '失败',
            message: '获取主机失败',
            type: 'error',
          })
          retutn
        }
        this.platformDatas = res.data.data.platforms
        this.host = res.data.data.hosts
        if (this.host.length < 1) {
          this.$notify({
            title: '成功',
            message: '暂无主机',
            type: 'success',
          })
        } else {
          this.$notify({
            title: '成功',
            message: '获取主机成功',
            type: 'success',
          })
        }
      })
      this.loading = false
    }, 1000)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
}
</script>

<style lang="less" scoped>
.tables {
  /deep/ .el-collapse-item__header {
  }
  /deep/ .el-collapse {
    border: none;
  }
  /deep/ .el-collapse-item__header {
    display: none;
  }
  /deep/ .el-collapse-item__wrap {
    border: none;
  }
  .form-box {
    width: 80%;
    height: auto;
    /deep/ .el-form-item {
    }
    .form-content {
      display: flex;
      border-left: 1px solid #e1e1e1;
      border-right: 1px solid #e1e1e1;
      border-bottom: 1px solid #e1e1e1;
      .left-form {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(33, 33, 33, 1);
        width: 50%;
        flex: 1;
        // margin-right: 24px;
        float: left;
        // border-left: 1px solid #e1e1e1;
        // border-top: 1px solid #e1e1e1;
        // border-right: 1px solid #e1e1e1;
        /deep/ .el-form-item__label {
          background: #f5f5f5;
          height: 35px;
          border-top: 1px solid #e1e1e1;
        }
        span {
          padding: 0 10px;
        }
        /deep/ .el-form-item__content {
          // border-bottom: 1px solid #e1e1e1;
          border-top: 1px solid #e1e1e1;
          height: 35px;
          background: #fff;
        }
        /deep/ .el-form-item__content:first-child {
          border-top: none;
        }
      }
      .right-form {
        flex: 1;
        width: 50%;
        width: 200px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(33, 33, 33, 1);
        /deep/ .el-form-item__label {
          background: #f5f5f5;
        }
        /deep/ .el-form-item__label {
          height: 35px;
          background: #f5f5f5;
          border-top: 1px solid #e1e1e1;
        }
        span {
          padding: 0 10px;
        }
        /deep/ .el-form-item__content {
          border-top: 1px solid #e1e1e1;
          background: #fff;
          height: 35px;
        }
        /deep/ .el-form-item__content:nth-child(1) {
          border-top: none;
        }
      }
      /deep/ .el-form-item {
        padding: 0;
        margin: 0;
        .el-select {
          width: 100%;
        }
      }
    }
    .form-footer {
      width: 100%;
      margin-top: 40px;
      text-align: center;
    }
  }
}
.viewVBtns {
  margin: 10px 0;
}
#vsddd {
  height: 100%;
  width: 100%;
  .saveBtns {
    padding: 10px 0;
  }
  .bottomInfo {
    // margin: -;
    margin: 20px 0;
  }
  .collapses {
    height: 100%;
    .collapse-item {
      width: 100%;
      margin-bottom: 10px;
      .box-title {
        position: relative;
        height: 24px;
        line-height: 24px;
        color: #606266;
        i {
          position: absolute;
          top: 50%;
          left: 85px;
          transform: translateY(-50%);
        }
        &::after {
          display: block;
          content: '';
          border-top: 1px solid #e1e1e1;
          width: calc(~'100% - 120px');
          margin-left: 100px;
          margin-top: -12px;
        }
      }
      .list-header {
        text-align: right;
        i {
          cursor: pointer;
          margin-right: 10px;
          font-size: 20px;
          height: 20px;
          line-height: 20px;
        }
      }
    }
    /deep/ .el-input__inner {
      width: 240px;
    }
  }
}
.bottomInfo {
  margin: 20px 0;
}
.pointer {
  position: relative;
  margin-left: 5px;
  color: #2d71d3;
  padding-left: 7px;
  &::after {
    position: absolute;
    content: '';
    display: block;
    width: 2px;
    height: 12px;
    background: #2d71d3;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<style lang="less">
@media print {
  #contentinfo {
    .tables {
      /deep/ .el-collapse-item__header {
      }
      /deep/ .el-collapse {
        border: none;
      }
      /deep/ .el-collapse-item__header {
        display: none;
      }
      /deep/ .el-collapse-item__wrap {
        border: none;
      }
      .form-box {
        width: 80%;
        height: auto;
        /deep/ .el-form-item {
        }
        .form-content {
          display: flex;
          border-left: 1px solid #e1e1e1;
          border-right: 1px solid #e1e1e1;
          border-bottom: 1px solid #e1e1e1;
          .left-form {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(33, 33, 33, 1);
            width: 50%;
            flex: 1;
            // margin-right: 24px;
            float: left;
            // border-left: 1px solid #e1e1e1;
            // border-top: 1px solid #e1e1e1;
            // border-right: 1px solid #e1e1e1;
            /deep/ .el-form-item__label {
              background: #f5f5f5;
              height: 35px;
              border-top: 1px solid #e1e1e1;
            }
            span {
              padding: 0 10px;
            }
            /deep/ .el-form-item__content {
              // border-bottom: 1px solid #e1e1e1;
              border-top: 1px solid #e1e1e1;
              height: 35px;
              background: #fff;
            }
            /deep/ .el-form-item__content:first-child {
              border-top: none;
            }
          }
          .right-form {
            flex: 1;
            width: 50%;
            width: 200px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(33, 33, 33, 1);
            /deep/ .el-form-item__label {
              background: #f5f5f5;
            }
            /deep/ .el-form-item__label {
              height: 35px;
              background: #f5f5f5;
              border-top: 1px solid #e1e1e1;
            }
            span {
              padding: 0 10px;
            }
            /deep/ .el-form-item__content {
              border-top: 1px solid #e1e1e1;
              background: #fff;
              height: 35px;
            }
            /deep/ .el-form-item__content:nth-child(1) {
              border-top: none;
            }
          }
          /deep/ .el-form-item {
            padding: 0;
            margin: 0;
            .el-select {
              width: 100%;
            }
          }
        }
        .form-footer {
          width: 100%;
          margin-top: 40px;
          text-align: center;
        }
      }
    }
  }
}
</style>
