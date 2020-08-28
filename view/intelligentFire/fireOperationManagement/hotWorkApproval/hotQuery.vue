<template>
    <div class="content">
        <header>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                <el-breadcrumb-item>报警管理</el-breadcrumb-item>
                <el-breadcrumb-item>报警主机配置</el-breadcrumb-item>
                <el-breadcrumb-item>查询</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <div style="width:100%;">
            <div class="box-title">
        <span class="pointer" @click="toggle">
          查询条件
          <i :class="isDropdown ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
            </div>
            <div v-show="isDropdown" class="form-box">
                <el-form :model="formData" inline label-width="100px" size="mini">
                    <el-form-item label="所属机构">
                        <el-select v-model="formData.orgName"></el-select>
                    </el-form-item>
                    <el-form-item label="设备类型">
                        <el-select v-model="formData.deviceType"></el-select>
                    </el-form-item>
                    <el-form-item label="资产编码">
                        <el-input v-model="formData.code"></el-input>
                    </el-form-item>
                    <el-form-item label="设备型号">
                        <el-select v-model="formData.deviceModel"></el-select>
                    </el-form-item>
                    <el-form-item label="网络模块类型">
                        <el-select v-model="formData.netModuleModel"></el-select>
                    </el-form-item>
                    <el-form-item label="IP地址">
                        <el-input v-model="formData.ip"></el-input>
                    </el-form-item>
                    <el-form-item label="所属服务">
                        <el-select v-model="formData.service"></el-select>
                    </el-form-item>
                    <el-form-item label=" 探测器数量">
                        <el-input v-model="formData.detectorNo"></el-input>
                    </el-form-item>
                    <el-form-item label="子系统数量">
                        <el-input v-model="formData.subsystemNo"></el-input>
                    </el-form-item>
                    <el-form-item label="所属重点部位">
                        <el-select v-model="formData.keySite"></el-select>
                    </el-form-item>
                    <el-form-item label="设备名称">
                        <el-input v-model="formData.deviceName"></el-input>
                    </el-form-item>
                    <el-form-item label="设备品牌">
                        <el-select v-model="formData.brand"></el-select>
                    </el-form-item>
                    <el-form-item label="网络模块品牌">
                        <el-select v-model="formData.netModuleBrand"></el-select>
                    </el-form-item>
                    <el-form-item label="网络模块ID">
                        <el-input v-model="formData.netModuleID"></el-input>
                    </el-form-item>
                    <el-form-item label="网络端口">
                        <el-input v-model="formData.port"></el-input>
                    </el-form-item>
                    <el-form-item label="网域">
                        <el-input v-model="formData.domain"></el-input>
                    </el-form-item>
                    <el-form-item label="输出通道数量">
                        <el-input v-model="formData.outputNo"></el-input>
                    </el-form-item>
                </el-form>
                <div style="width:100%;text-align:center;position:absolute;bottom:3px;">
                    <el-button size="mini" type="primary">查询</el-button>
                    <el-button size="mini">重置</el-button>
                </div>
            </div>
        </div>
        <div class="table-box" ref="tableBox">
            <div class="box-title">查询结果</div>
            <div>
                <el-button size="mini">导出</el-button>
                <el-button size="mini">打印</el-button>
                <el-button size="mini">删除</el-button>
            </div>
            <div style="position:absolute;top:85px;width:100%;">
                <el-table size="mini" border :height="tableHeight">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="orgName" label="所属机构"></el-table-column>
                    <el-table-column prop="keySite" label="所属重点部位" width="100"></el-table-column>
                    <el-table-column prop="deviceType" label="设备类型"></el-table-column>
                    <el-table-column prop="deviceName" label="设备名称"></el-table-column>
                    <el-table-column prop="brand" label="设备品牌"></el-table-column>
                    <el-table-column prop="deviceModel" label="设备型号"></el-table-column>
                    <el-table-column prop="netModuleBrand" label="网络模块品牌" width="100"></el-table-column>
                    <el-table-column prop="netModuleModel" label="网络模块类型" width="100"></el-table-column>
                    <el-table-column prop="netModuleID" label="网络模块ID" width="100"></el-table-column>
                    <el-table-column prop="keyboardPassword" label="键盘密码"></el-table-column>
                    <el-table-column prop="port" label="网络端口"></el-table-column>
                    <el-table-column prop="userName" label="用户名"></el-table-column>
                    <el-table-column prop="password" label="密码"></el-table-column>
                    <el-table-column prop="service" label="所属服务"></el-table-column>
                    <el-table-column prop="domain" label="网域"></el-table-column>
                    <el-table-column prop="detectorNo" label="探测器数量" width="100"></el-table-column>
                    <el-table-column prop="outputNo" label="输出通道数量" width="100"></el-table-column>
                    <el-table-column prop="subsystemNo" label="子系统数量" width="100"></el-table-column>
                    <el-table-column prop="state" label="状态"></el-table-column>
                    <el-table-column prop="createdBy" label="录入人"></el-table-column>
                    <el-table-column prop="createdDept" label="录入机构"></el-table-column>
                    <el-table-column prop="createdAt" label="录入时间"></el-table-column>
                </el-table>
                <el-pagination
                        style="text-align:right;"
                        :page-sizes="[25, 50, 100, 200]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'hotQuery',
        data() {
            return {
                isDropdown: true,
                tableHeight: 200,
                formData: {
                    // 查询条件字段
                    orgName: '',
                    deviceType: '',
                    code: '',
                    deviceModel: '',
                    netModuleModel: '',
                    ip: '',
                    service: '',
                    detectorNo: '',
                    subsystemNo: '',
                    keySite: '',
                    deviceName: '',
                    brand: '',
                    netModuleBrand: '',
                    netModuleID: '',
                    port: '',
                    domain: '',
                    outputNo: ''
                }
            }
        },
        mounted() {
            this.changeTableHeight()
            window.addEventListener('resize', this.changeTableHeight)
        },
        methods: {
            changeTableHeight() {
                this.$nextTick(() => {
                    this.tableHeight = this.$refs.tableBox.offsetHeight - 114
                })
            },
            toggle() {
                this.isDropdown = !this.isDropdown
                this.changeTableHeight()
            }
        }
    }
</script>

<style lang="less" scoped>
    .content {
        height: 100%;
        position: relative;
        font-size: 14px;
        margin: 0 10px;
        display: flex;
        flex-direction: column;
        .box-title {
            position: relative;
            height: 24px;
            line-height: 24px;
            color: #606266;
            margin: 10px 0;
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
        .form-box {
            width: 100%;
            position: relative;
            display: flex;
            justify-content: space-between;
            padding: 10px 10px 26px;
            border: 1px solid #E1E1E1;
        }
        .table-box {
            position: relative;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
    }
</style>