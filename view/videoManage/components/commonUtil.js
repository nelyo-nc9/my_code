// 警告提示窗
export const messageWarn = (message, title) => {
  this.$notify({
    title: title || '警告',
    message,
    type: 'warning',
    position: 'bottom-right'
  })
}
// 成功提示窗
export const messageSuccess = (message, title) => {
  this.$notify({
    title: title || '成功',
    message,
    type: 'success',
    position: 'bottom-right'
  })
}
// 失败提示窗
export const messageError = (message, title) => {
  this.$notify({
    title: title || '失败',
    message,
    type: 'error',
    position: 'bottom-right'
  })
}