import Vue from 'vue';
const actionsOuter = {
    unifyHttp({ commit, state }, { url, data = {}, method = 'post', success, key }) {
        Vue.prototype.$http({
            url, data, method, success: (res) => {
                if (key) {
                    commit('SETVARIABLE', {
                        key,
                        value: res.data
                    })
                }
                success ? success(res) : ''
            }
        })
    },
    //获取优惠券
    discountsList({ commit, state }, { then, data } = {}) {
        actionsOuter.unifyHttp({ commit, state }, {
            url: "/bjyyq/api/discountsList", key: "discounts", success: (success) => {
                then ? then(success) : ''
            }
        })
    },
    //获取订单列表
    orderList({ commit, state }, { then, data } = {}) {
        actionsOuter.unifyHttp({ commit, state }, {
            url: "/bjyyq/api/orderList", success: (success) => {
                commit('SETVARIABLE', {
                    key: "orderList",
                    value: success.data
                })
                then ? then(success) : ''
            }
        })
    },

}
export default actionsOuter