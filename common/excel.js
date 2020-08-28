/*
 * @Author: shikai
 * @Date: 2020-07-15 11:57:13
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-17 14:04:45
 */

import { export_json_to_excel } from './vendor/Export2Excel'
import XLSX from 'xlsx'

/**
 *  格式数据
 *  @filterVal  格式头
 *  @tableData   导出
 */
export const handleExport = (tHeader, filterVal, filename, tableData) => {
  let data = formatJson(filterVal, tableData)
  export_json_to_excel(
    tHeader,
    data,
    filename
  )
}

/**
 *  格式数据
 *  @filterVal  格式头
 *  @tableData  导入
 */
export const handleImport = (event, obj, callback) => {
  // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容
  let fileReader = new FileReader()
  const file = event.raw
  let sheetArray = []
  // 回调函数
  fileReader.onload = ev => {
    try {
      let data = ev.target.result
      let workbook = XLSX.read(data, {
        type: 'binary'
      })
      // excel读取出的数据
      // let excelData = XLSX.utils.sheet_to_json(
      //   workbook.Sheets[workbook.SheetNames[0]]
      // )
      for (let sheet in workbook.Sheets) {
        sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
      }
      // 将上面数据转换成 table需要的数据
      let arr = {}
      let array = []
      sheetArray.forEach((item, index) => {
        arr = {}
        for (let key in item) {
          Object.assign(arr, {
            [obj[key]]: item[key]
          })
        }
        array.push(arr)
      })
      callback(array)
    } catch (e) {
      window.alert('文件类型不正确！')
      return false
    }
  }
  // 读取文件 成功后执行上面的回调函数
  fileReader.readAsBinaryString(file)
}

/**
 *  格式数据
 *  @filterVal  格式头
 *  @tableData  用来格式的表格数据
 */
function formatJson(filterVal, tableData) {
  return tableData.map(v => {
    return filterVal.map(j => {
      return v[j]
    })
  })
}
