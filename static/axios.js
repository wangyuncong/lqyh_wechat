/*
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-10 17:49:50
 * @LastEditors: Zhang Zi Fang
 * @LastEditTime: 2019-10-22 10:35:07
 */
import axios from "axios";
// import { Message } from 'element-ui';
// const host ='/apitarget'
const host = process.env.NODE_ENV === 'production' ? 'http://bjyyq.zhaoshuikan.com.cn' : '/apitarget'  //本地调试时 
var img = 'http://bjyyq.zhaoshuikan.com.cn/static/'
axios.interceptors.request.use(config => {
    return config
}, error => {
    return
})
// 成功的拦截器
axios.interceptors.response.use(data => {
    if (data) {

    }
    return data
}, error => {
    return
})
// 参数1：地址，参数2：参数，参数3：成功回调函数，参数4：失败回调函数
function $http({ url, data, method, success, error }) {
    var url = url || ''
    // 为了避免他们没有传参的参数而报错
    var data = data || {}
    // 有发送方式就为发送方式  没的话就默认get
    var method = method || 'post'
    // 这里是判断 由于axios的get和post发送方法不同  post是data发送  get是params发送 
    var params = method.toUpperCase() == 'GET' ? data : {}
    sessionStorage.img = img
    sessionStorage.host = host
    if (!data.userid) {
        data.userid = sessionStorage.userId || sessionStorage.userid
    }
    // data.structid = sessionStorage.structid
    // console.log(method)
    // console.log(host + url)
    return new Promise((resolve, reject) => {
        axios({
            url: host + url,
            method: method,
            data: data,
            params: params,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.data.status !== 0 && response.data.status != 999) {
                // this.$alert(`${response.data.errordesc}`)
                // console.log(`${response.data.errordesc}`)
            }
            if (response.data.status == 999) {
                // this.$alert(`服务器异常！错误代码(${url})`)
                // console.log(`服务器异常！错误代码(${url})`)
            }
            resolve(response.data)
            if (success) {
                success(response.data)
            }
            // 成功回调函数

        }).catch((error) => {
            // console.log(error)
            // 失败回调函数
            // this.$alert(`网络连接失败！请尝试刷新页面！错误代码(${url})`)
            // console.log(`网络连接失败！请尝试刷新页面！错误代码(${url})`)
            if (error) {
                error(error)
            }
            reject(error)
        })
    })


}

export default $http
