/*
  * @Author: shikai
  * @Date: 2020-07-03 14:06:09
 * @Last Modified by: shikai
 * @Last Modified time: 2020-07-03 14:06:09
 * 
  */
import printView from '../components/printView'

export default [
    {
        path: '/',
        component: printView,
        children: [{
            path: 'assessmentReport',
            name: 'assessmentReport',
            component: resolve => require(['../view/intelligentFire/print/assessmentReport.vue'], resolve),
            menuName: '评估报告打印'
        }]
    }
]