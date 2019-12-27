import Vue from 'vue';
import Vuex from 'vuex';
import actionsOuter from './actions'
import stateOuter from './state'
import { Toast } from 'mint-ui'
Vue.use(Vuex);
let $store = {
    state: {
        companyInfo: '',
        swipers: null,
        category: null,
        categoryFoods: [],
        shopInfo: [],
        goodsDetail: {},
        userId: '1'
    },
    mutations: {
        //设置userid
        setUserId(state, data) {
            state.userId = data
        },
        setCompanyInfo(state, data) {
            state.companyInfo = data
        },
        setSwipers(state, data) {
            // console.log(data,'ppp')
            // let arr = []
            let arr = data.map((item) => {
                let obj = {
                    id: '',
                    contentinfo: ''
                }
                obj.id = item.id
                obj.contentinfo = `http://bjyyq.zhaoshuikan.com.cn/static/${item.contentinfo}`
                return obj
            })
            state.swipers = arr
        },
        setCategory(state, data) {
            state.category = data
        },
        setCategoryFood(state, data) {
            state.categoryFoods = data
        },
        setShopInfo(state, data) {
            console.log('000', data)
            state.shopInfo = data
        },
        //设置商品详情
        getGoodsDetail(state, data) {
            state.goodsDetail = data
        },
        SETVARIABLE(state, { key, value }) {
            state[key] = value
        }
    },
    actions: {
        //获取商品详情
        async getGoodsDetail({ commit, state }, goodsId) {
            await Vue.prototype.$http({
                url: "/bjyyq/api/goodsDetail", data: { goodsId }, method: 'get', success: (data) => {
                    if (data.status == 'success') {
                        console.log(state.shopInfo, 'state.shopInfo')
                        let res = data.data[0]
                        if(res.catagoryid==41){
                            let healthPrice = 0
                            Vue.prototype.$http({
                                url: "/bjyyq/api/healthInfo",
                                data: {},
                                method: "get",
                                success: data1 => {
                                    if(data1.data.length>0){
                                        data1.data.map((item)=>{
                                            healthPrice+=Number(item.price)
                                        })
                                    // this.totalPrice+=this.healthPrice
                                    }
                                    res.quantity = 0
                                    state.shopInfo.map((item, index) => {
                                        if (item.goodid == res.id) {
                                            res.quantity = item.quantity
                                            res.enddate = item.enddate
                                            res.startdate = item.startdate
                                        }
                                    })
                                    res.foodprice = Number(res.foodprice)+Number(healthPrice)
                                    commit('getGoodsDetail', res)
                                }
                            })
                        }else{
                            res.quantity = 0
                            state.shopInfo.map((item, index) => {
                                if (item.goodid == res.id) {
                                    res.quantity = item.quantity
                                    res.enddate = item.enddate
                                    res.startdate = item.startdate
                                }
                            })
                            commit('getGoodsDetail', res)
                        }
                        
                        
                    }

                }
            })
        },
        //获取公司信息
        getCompanyInfo({ commit }) {
            Vue.prototype.$http({
                url: "/bjyyq/api/companyInfo", data: {}, method: 'get', success: (data) => {
                    commit('setCompanyInfo', data[0].contentinfo)
                }
            })
        },
        //获取订餐swiper
        getSwipers({ commit }) {
            Vue.prototype.$http({
                url: "/bjyyq/api/swiper", data: {}, method: 'get', success: (data) => {
                    commit('setSwipers', data)
                }
            })
        },
        //获取商品分类
        getCategory({ commit }) {
            return Vue.prototype.$http({
                url: "/bjyyq/api/category", data: {}, method: 'get', success: (data) => {
                    data.map((item) => {
                        item.active = false

                    })
                    commit('setCategory', data)
                }
            })
        },
        //获取分类商品
        getCategoryFood({ commit, state }, categoryId) {
            
            Vue.prototype.$http({
                url: "/bjyyq/api/categoryFood", data: { categoryId }, method: 'get', success: (data) => {
                    let arr1 = []
                    let healthPrice = 0
                    console.log(categoryId,'categoryId')
                    if(categoryId.categoryId==41){
                        //营养咨询服务
                        console.log('000')
                        Vue.prototype.$http({
                            url: "/bjyyq/api/healthInfo",
                            data: {},
                            method: "get",
                            success: data1 => {
                                if(data1.data.length>0){
                                    data1.data.map((item)=>{
                                        healthPrice+=Number(item.price)
                                    })
                                // this.totalPrice+=this.healthPrice
                                }
                                data.map((item) => {
                                    let obj = item
                                    obj.foodpicsmall = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicsmall}`
                                    obj.foodpicbig = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicbig}`
                                    obj.foodkeywordarr = item.foodkeyword.split(',')
                                    state.shopInfo.length > 0 && state.shopInfo.map((item1) => {
                                        if (item1.goodid == item.foodid) {
                                            obj.num = item1.quantity
                                        } else {
                                            obj.num = 0
                                        }
                                    })
                                    if(categoryId.categoryId==41){
                                        console.log(obj.foodprice,healthPrice)
                                        obj.foodprice = Number(obj.foodprice)+Number(healthPrice)
                                    }
                                    arr1.push(obj)
                                })
                                let arr = []
                                state.category.map((item) => {
                                    let obj = item
                                    obj.active = false
                                    if (obj.id == categoryId.categoryId) {
                                        obj.active = true
                                    }
                                    arr.push(obj)
                                })
                                commit('setCategoryFood', arr1)
                                commit('setCategory', arr)
                            }
                        });
                    }else{
                        data.map((item) => {
                            let obj = item
                            obj.foodpicsmall = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicsmall}`
                            obj.foodpicbig = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicbig}`
                            obj.foodkeywordarr = item.foodkeyword.split(',')
                            state.shopInfo.length > 0 && state.shopInfo.map((item1) => {
                                if (item1.goodid == item.foodid) {
                                    obj.num = item1.quantity
                                } else {
                                    obj.num = 0
                                }
                            })
                            if(categoryId.categoryId==41){
                                console.log(obj.foodprice,healthPrice)
                                obj.foodprice = obj.foodprice+healthPrice
                            }
                            arr1.push(obj)
                        })
                        let arr = []
                        state.category.map((item) => {
                            let obj = item
                            obj.active = false
                            if (obj.id == categoryId.categoryId) {
                                obj.active = true
                            }
                            arr.push(obj)
                        })
                        commit('setCategoryFood', arr1)
                        commit('setCategory', arr)
                    }
                    
                }
            })
        },
        //修改商品数量
        async goodNum({ commit, state }, obj) {
            await Vue.prototype.$http({
                url: "/bjyyq/api/modifyShopCart", data: obj, method: 'get', success: (data) => {
                    if (data.status == 'success') {
                        Toast({
                            message: '操作成功',
                            // position: 'bottom',
                            duration: 1000
                        })
                    } else {
                        Toast({
                            message: '操作失败',
                            // position: 'bottom',
                            duration: 1000
                        })
                    }

                }
            })
        },
        //获取购物车信息
        async getCartInfo({ commit, state }, obj) {
            await Vue.prototype.$http({
                url: "/bjyyq/api/shopCart", data: obj, method: 'get', success: (data) => {
                    console.log(state.categoryFoods,'state.categoryFoods')
                    let arr = state.categoryFoods
                    // let healthPrice = 0
                    // Vue.prototype.$http({
                    //     url: "/bjyyq/api/healthInfo",
                    //     data: {},
                    //     method: "get",
                    //     success: data1 => {
                    //         if(data1.data.length>0){
                    //             data1.data.map((item)=>{
                    //                 healthPrice+=Number(item.price)
                    //             })
                    //         // this.totalPrice+=this.healthPrice
                    //         }
                            console.log(arr, 'arr')
                            arr.length > 0 && arr.map((item1) => {
                                // if(item1.goodid == item.foodid){
                                //     obj.num = item1.quantity
                                // }else{
                                item1.num = 0
                                // }
                                
                            })
                            data.map((item) => {
                                // let obj = item
                                item.foodpicsmall = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicsmall}`
                                arr.map((item1) => {
                                    if (item.goodid == item1.foodid) {
                                        item1.num = item.quantity
                                        // obj
                                        // item.foodName = item1.foodname
                                        // item.foodpicsmall = `${item1.foodpicsmall}`
                                        // item.foodprice = item1.foodprice
                                    }
                                })
                                // if(item.catagoryid==41){
                                //     item.foodprice = Number(item.foodprice)+Number(healthPrice)
                                // }
                            })
                            console.log(data,arr)
                            commit('setShopInfo', data)

                            commit('setCategoryFood', arr)
                        }
                    })
                    

            //     }
            // })
        }
    },
}
$store.state = Object.assign(stateOuter, $store.state)
$store.actions = Object.assign(actionsOuter, $store.actions)

const goods = new Vuex.Store($store)
export default goods