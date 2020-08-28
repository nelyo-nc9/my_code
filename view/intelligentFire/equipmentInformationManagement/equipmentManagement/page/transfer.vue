<!--
 * @Author: shikai
 * @Date: 2020-07-09 21:08:34
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-10 06:03:14
-->
<template>
    <div>
        <div class="form-box mab20">
            <div class="box-title">报警主机信息</div>
            <el-button size="mini">上移</el-button>
            <el-button size="mini">下移</el-button>
            <el-button size="mini">置顶</el-button>
            <el-button size="mini">置尾</el-button>
        </div>
        <el-table ref="partsTable" :data="detectorList" border style="width: 500px;margin-bottom:20px;" size="mini" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
                v-for="item in detectorTableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <div class="from-bottom">
            <el-button size="mini">保存</el-button>
            <el-button size="mini" @click="goBack">关闭</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                detectorTableColumn: [{
                    prop: 'name',
                    label: '报警主机名称',
                    width: ''
                }, {
                    prop: 'code',
                    label: '设备编码',
                    width: ''
                }],
                detectorList: [{
                    name: '报警主机1-高柜区',
                    code: '105134000067'
                }, {
                    name: '报警主机1-高柜区',
                    code: '105134000067'
                }]
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.partsSelection = val;
            },
            goBack() {
                this.$emit('goBack', 'list')
            }
        }
    }
</script>

<style lang="less" scoped>
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
    
    .el-table::before {
        background: none;
    }
</style>