// { min: 11, max: 11, message: '请正确输入手机号码', trigger: 'blur' }
// rules: {
//     email: [
//         {required: true, message: '请输入邮箱', trigger: 'blur'},
//         {validator: validateEmail, trigger: ['blur', 'change']}
//     ],
// }
import store from '../store/index'
import { Message } from 'element-ui'
var language = store.state.app.language
// console.log(language)
// 文件名验证
const verifyFileNameCheck = (file) => {
    let fileName = file.name
    // console.log(fileName)
    if (/[^a-zA-Z0-9\u4E00-\u9FA5_.#-]+/.test(fileName)) {
        if (language == 'en') {
            Message.error('Filenames allow strings of Numbers, letters, underscores, underscores, dots, and #, case - sensitive, no more than 200 characters')
        } else {
            Message.error('文件名允许数字、字母、中划线、下划线、点、#的字符串，区分大小写，不超过200个字符')
        }
        return false
    } else {
        return true
    }
}

// 上传文件后缀
const verifyFileName = (file, val1, val2, isOnce = false) => {
    let fileName = file.name
    let arr = fileName.split('.')
    let str = arr[arr.length - 1].toLowerCase()
    if (!isOnce) {
        if (str != val1 && str != val2) {
            if (language == 'en') {
                Message.error('Please select the file with the suffix' + val1 + '/' + val2)
            } else {
                Message.error('请选择后缀为' + val1 + '/' + val2 + '的文件')
            }
            return false
        }else{
            return true
        }
    } else{
        if (str != val1) {
            if (language == 'en') {
                Message.error('Please select the file with the suffix' + val1)
            } else {
                Message.error('请选择后缀为' + val1 + '的文件')
            }
            return false
        }else{
            return true
        }
    }
}
// 文件名长度
const verifyFileNameLength = (file, length) => {
    let fileName = file.name
    if (fileName.length > length) {
        if (language == 'en') {
            Message.error('Filename length must not exceed ' + length + ' characters')
        } else {
            Message.error('文件名含后缀不能超过 ' + length + '个字符')
        }
        return false
    } else {
        return true
    }
    
}
// 邮箱
const validateEmail = (rule, value, callback) => {
    const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (!reg.test(value)) {
        if (language == 'en') {
            callback(new Error('Please enter the correct email format!'))
        } else {
            callback(new Error('请输入正确的邮箱格式！'))
        }
    } else {
        callback()
    }
}
// 用户名
const validateName = (rule, value, callback) => {
    var reg = /^[\u4e00-\u9fa5a-z0-9]+$/gi
    if(!reg.test(value)) {
        if (language == 'en') {
            callback(new Error('Allow to input Chinese characters, letters, Numbers, length 2-10 characters!'))
        } else {
            callback(new Error('允许输入汉字、字母、数字，长度2-10个字符!'))
        }
    } 
    else if(value.length >= 10) {
        if (language == 'en') {
            callback(new Error('Allow to input Chinese characters, letters, Numbers, length 2-10 characters!'))
        } else {
            callback(new Error('允许输入汉字、字母、数字，长度2-10个字符!'))
        }
    } 
    else {
        callback()
    }
}
// 密码
const validatePassword = (rule, value, callback) => {
    const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/u
    if (!regex.test(value)) {
        if (language == 'en') {
            callback(new Error('The password should be in English and a combination of digits, between 6 and 20 in length'))
        } else {
            callback(new Error('密码应为英文、数字组合，长度6-20之间'))
        }
    } else {
        callback()
    }
}
// 手机号
const telRegex = /^1[3|4|5|7|8][0-9]\d{8}$/u
const validateTel = (rule, value, callback) => {
    if (!telRegex.test(value)) {
        if (language == 'en') {
            callback(new Error('Please enter the correct phone number'))
        } else {
            callback(new Error('请输入正确的手机号'))
        }
    } else {
        callback()
    }
}
// 编号
const validateTurbineName = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter the serial number'))
        } else {
            callback(new Error('请输入编号'))
        }
    } 
    else if (!/^[A-Za-z0-9-]{1,10}$/.test(value)) {
        if (language == 'en') {
            callback(new Error('Please enter the number correctly'))
        } else {
            callback(new Error('请正确输入编号'))
        }
    }
    else if (!/^[\w.-]{1,10}$/.test(value)) {
        if (language == 'en') {
            callback(new Error('Allowed to enter Numbers, letters, middle line, characters not exceeding 10'))
        } else {
            callback(new Error('允许输入数字、字母、中划线、字符不超10'))
        }
    }
     else {
        callback()
    }
}
// WGS84投影坐标X
const validateWGS84X = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter the projection coordinate X'))
        } else {
            callback(new Error('请输入投影坐标X'))
        }
    }
    else if (!/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(value)) {
        if (language == 'en') {
            callback(new Error("We're allowed to put in eight decimal places, X is minus 180-180"))
        } else {
            callback(new Error('X为-180-180，允许输入到小数点后八位'))
        }
    } 
    else {
        callback()
    }
}
// WGS84投影坐标Y
const validateWGS84Y = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter the projection coordinate Y'))
        } else {
            callback(new Error('请输入投影坐标Y'))
        }
    }
     else if (!/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(value)) {
        if (language == 'en') {
            callback(new Error("You're allowed to put in eight decimal places, Y is -90-90"))
        } else {
            callback(new Error('Y为-90-90，允许输入到小数点后八位'))
        }
    }
     else {
        callback()
    }
}
// 经纬度，忽略小数
const validateLon = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter'))
        } else {
            callback(new Error('请输入'))
        }
    }
    else if (value > 180 || value < -180) {
        if (language == 'en') {
            callback(new Error('X is minus 180-180'))
        } else {
            callback(new Error('X为-180-180'))
        }
    } 
    else {
        callback()
    }
}
// 经纬度，忽略小数
const validateLat = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter'))
        } else {
            callback(new Error('请输入'))
        }
    }
     else if (value > 90 || value < -90) {
        if (language == 'en') {
            callback(new Error('Y is -90-90'))
        } else {
            callback(new Error('Y为-90-90'))
        }
    }
     else {
        callback()
    }
}
// 6位数坐标验证
const valUTMX = (rule, value, callback) => {
    if (value === '' || value === null) { 
        if (language == 'en') {
            callback(new Error('Please enter the projection coordinate X'))
        } else {
            callback(new Error('请输入投影坐标X'))
        }
    } else if (!/^[\d]{6}(\.\d{1,4})?$/.test(value)) {  
        if (language == 'en') {
            callback(new Error("You're allowed to put in eight decimal places, and X is a six-digit positive number"))
        } else {
            callback(new Error('X为6位正数，允许输入到小数点后八位'))
        }                   
    } else {
        callback()
    }
}
// 其他投影坐标X
const validateCoordinateX = (rule, value, callback) => {
    if (value === '' || value === null) { 
        if (language == 'en') {
            callback(new Error('Please enter the projection coordinate X'))
        } else {
            callback(new Error('请输入投影坐标X'))
        }
    } else if (!/^[\d]{8}(\.\d{1,4})?$/.test(value)) {    
        if (language == 'en') {
            callback(new Error("You're allowed to input to eight decimal places, where X is an 8-digit positive number"))
        } else {
            callback(new Error('X为8位正数，允许输入到小数点后八位'))
        }                 
    } else {
        callback()
    }
}
// 其他投影坐标Y
const validateCoordinateY = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter the projection coordinate Y'))
        } else {
            callback(new Error('请输入投影坐标Y'))
        }
    } else if (!/^[\d]{7}(\.\d{1,4})?$/.test(value)) {
        if (language == 'en') {
            callback(new Error("You're allowed to put in eight decimal places, and Y is a 7-digit positive number"))
        } else {
            callback(new Error('Y为7位正数，允许输入到小数点后八位'))
        }
    } else {
        callback()
    }
}

// 机型
const validateType = (rule, value, callback) => {
    let arr = value.split('/')
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please type'))
        } else {
            callback(new Error('请输入机型'))
        }
    } else if (arr.length != 2 || arr.length <= 1 ) {
        if (language == 'en') {
            callback(new Error('Please enter the type correctly'))
        } else {
            callback(new Error('请正确输入机型'))
        }
    } else {
        callback()
    }
}
// 状态
const validateStatues = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter status'))
        } else {
            callback(new Error('请输入状态'))
        }
    } else {
        callback()
    }
}
// 字母，数字
const validateAzNumber = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('please enter'))
        } else {
            callback(new Error('请输入'))
        }
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
        if (language == 'en') {
            callback(new Error('Letters and Numbers are allowed'))
        } else {
            callback(new Error('允许输入字母和数字'))
        }
    }
    else {
        callback()
    }
}

// 坐标系
const validateCoordinates = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please select the reference frame'))
        } else {
            callback(new Error('请选择参考坐标系'))
        }
    }
    else {
        callback()
    }
}
// 折减系数
const validateDiscount = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter the reduction coefficient'))
        } else {
            callback(new Error('请输入折减系数'))
        }
    }
    else {
        callback()
    }
}
// 高度
const validateHeight = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter height'))
        } else {
            callback(new Error('请输入高度'))
        }
    }
    else if (!/^[0-9]+$/.test(value)) {
        if (language == 'en') {
            callback(new Error('Values range from 0 to 300'))
        } else {
            callback(new Error('取值范围0~300'))
        }
    }
    else if (value > 300 || value < 0) {
        if (language == 'en') {
            callback(new Error('Values range from 0 to 300'))
        } else {
            callback(new Error('取值范围0~300'))
        }
    }
    else {
        callback()
    }
}
// 文件名
const validateFile = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please upload the file'))
        } else {
            callback(new Error('请上传文件'))
        }
    }
    else {
        callback()
    }
}
// 空气密度
const validateDensity = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter air density'))
        } else {
            callback(new Error('请输入空气密度'))
        }
    }
    else if (value <= 0 || value > 1.5) {
        if (language == 'en') {
            callback(new Error('Values range from 0 to 1.5'))
        } else {
            callback(new Error('取值范围0~1.5'))
        }
    }
    else {
        callback()
    }
}
// 海拔
const validateElevation = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter altitude'))
        } else {
            callback(new Error('请输入海拔'))
        }
    }
    else if (value < 0) {
        if (language == 'en') {
            callback(new Error("It's greater than 0"))
        } else {
            callback(new Error('取值范围大于0'))
        }
    }
    else {
        callback()
    }
}
// 图谱高度
const validateLayerheight = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('Please enter the height of the map'))
        } else {
            callback(new Error('请输入图谱高度'))
        }
    }
    else if (!/^\d+$/.test(value)) {
        if (language == 'en') {
            callback(new Error('Please enter an integer'))
        } else {
            callback(new Error('请输入整数'))
        }
    }
    else if (value > 200 || value < 10) {
        if (language == 'en') {
            callback(new Error('Values range from 10 to 200'))
        } else {
            callback(new Error('取值范围10~200'))
        }
    }
    else {
        callback()
    }
}

// 不能为空
const validateNull = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('please enter'))
        } else {
            callback(new Error('请输入'))
        }
    }
    else {
        callback()
    }
}
// 不能为空
const validateNull2 = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('please select'))
        } else {
            callback(new Error('请选择'))
        }
    }
    else {
        callback()
    }
}

// 名称
const validateSchemeName = (rule, value, callback) => {
    if (value === '' || value === null) {
        if (language == 'en') {
            callback(new Error('please enter name'))
        } else {
            callback(new Error('请输入名称'))
        }
    }
    else if (value.length >= 100) {
        if (language == 'en') {
            callback(new Error('No more than 100 characters'))
        } else {
            callback(new Error('不超过100个字符'))
        }
    }
    else {
        callback()
    }
}


export {
    verifyFileNameCheck,
    verifyFileName,
    verifyFileNameLength,
    validateEmail,
    validateName,
    validatePassword,
    validateTel,
    validateTurbineName,
    validateWGS84X,
    validateWGS84Y,
    valUTMX,
    validateCoordinateX,
    validateCoordinateY,
    validateType,
    validateStatues,
    validateAzNumber,
    validateCoordinates,
    validateDiscount,
    validateHeight,
    validateFile,
    validateDensity,
    validateElevation,
    validateLayerheight,
    validateNull,
    validateSchemeName,
    validateLat,
    validateLon,
    validateNull2
}
