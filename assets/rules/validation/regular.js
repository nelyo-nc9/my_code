// 文件存储公共的正则校验表达式// 邮箱// IP地址// 固定电话// 手机号



// 手机号
let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
//邮箱
let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
//固定电话
let telephoneReg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
//IP地址
let IPReg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/

let FormValidate = (function () {
    function FormValidate() { }
    // From表单验证规则  可用于公用的校验部分
    FormValidate.Form = function () {
        return {

            // 邮箱的验证规则
            validateEmail(rule, value, callback) {
                if (!value) {
                    return callback(new Error('必填'))
                }
                if (!emailReg.test(value)) {
                    callback(new Error('邮箱格式不正确'))
                } else {
                    callback()
                }
            },

            // 电话号码的验证
            validatePhone(rule, value, callback) {
                if (!value) {
                    return callback(new Error('必填'))
                }
                if (!phoneReg.test(value)) {
                    callback(new Error('手机格式不正确'))
                } else {
                    callback()
                }
            },

            // 固定电话号码的验证      
            validatetelephone(rule, value, callback) {
                if (!value) {
                    return callback(new Error('必填'))
                }
                if (!telephoneReg.test(value)) {
                    callback(new Error('固定电话号码格式不正确'))
                } else {
                    callback()
                }
            },

            // IP地址      
            validateIP(rule, value, callback) {
                if (!value) {
                    return callback(new Error('必填'))
                }
                if (!IPReg.test(value)) {
                    callback(new Error('IP地址码格式不正确'))
                } else {
                    callback()
                }
            },


        }
    }

    return FormValidate
}())

exports.FormValidate = FormValidate
