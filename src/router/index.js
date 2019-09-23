import Vue from 'vue'
import Router from 'vue-router'
import Mine from '@/components/Mine'
import Goods from '@/components/Goods'
import GoodsDetail from '@/components/GoodsDetail'
import Introduce from '@/components/Introduce'
import editAddress from '@/components/Address/editAddress'
import addressList from '@/components/Address/addressList'
import createOrder from '@/components/Order/createOrder.vue'
import paySuccess from '@/components/Order/paySuccess.vue'

import mineRourter from '@/components/Mine/router'
Vue.use(Router)



export default new Router({
  // mode: process.env.NODE_ENV === 'production' ? 'hash' : 'history',
  
  routes: [
    {
      path: '/',
      redirect: '/bjyyq/goods'
    },
    {
      path: '/bjyyq/mine',
      name: 'Mine',
      component: Mine,
      meta: {
        title: '另起一行'
      }
    }, {
      path: '/bjyyq/goods',
      name: 'Goods',
      component: Goods,
      meta: {
        title: '另起一行'
      }
    }, {
      path: '/bjyyq/goodsDetail',
      name: 'GoodsDetail',
      component: GoodsDetail,
      meta: {
        title: '商品详情'
      }
    }, {
      path: '/bjyyq/createOrder',
      name: 'createOrder',
      component: createOrder,
      meta: {
        title: '提交订单'
      }
    }, {
      path: '/bjyyq/introduce',
      name: 'Introduce',
      component: Introduce,
      meta: {
        title: '关于我们'
      }
    }, {
      path: '/bjyyq/editAddress',
      name: 'editAddress',
      component: editAddress,
      meta: {
        title: '新增收货地址'
      }
    },
    {
      path: '/bjyyq/addressList',
      name: 'addressList',
      component: addressList,
      meta: {
        title: '收货地址'
      }
    },
    {
      path: '/bjyyq/paySuccess',
      name: 'paySuccess',
      component: paySuccess,
      meta: {
        title: '支付成功'
      }
    },
    ...mineRourter
  ]
})
