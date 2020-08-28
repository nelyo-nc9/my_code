<!--
 * @Author: shikai
 * @Date: 2020-07-14 21:33:00
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-14 23:49:41
--> 
<template>
    <div class="secend-containter">
        <div class="secendMenu no-print">
            <div class="home flex-row">
                <el-button type="primary" @click="">打印</el-button>
                <el-button @click="$router.back(-1)">关闭</el-button>
            </div>
        </div>
        <div class="secend-body">
            打印内容
        </div>
    </div>
</template>

<script>
    
</script>

<style scoped lang="less">
    .secend-containter {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 100%;
        /*min-height: 1000px;*/
        .secendMenu {
            width: 100%;
            display: flex;
            height: 40px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 6px 0px rgba(133, 133, 133, 0.19);
            .home {
                width: 65px;
                line-height: 40px;
                color: #333333;
                font-size: 14px;
                margin-left: 40px;
                a {
                    text-decoration: none;
                    color: #333333;
                }
                a:hover {
                    color: #2d72d3;
                }
            }
        }
    }
</style>
