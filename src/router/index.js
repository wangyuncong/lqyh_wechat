/*
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-09-10 17:49:50
 * @LastEditors: 
 * @LastEditTime: 2019-11-19 18:00:41
 */
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
import zhuanyiMycustomer from '@/components/mycustomer/index.vue'

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
        title: '个人中心'
      }
    }, {
      path: '/bjyyq/goods',
      name: 'Goods',
      component: Goods,
      meta: {
        title: '商城'
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
    },{
      path: '/bjyyq/zhuanyiMycustomer',
      name: 'zhuanyiMycustomer',
      component: zhuanyiMycustomer,
      meta: {
        title: '客户转移'
      }
      
    },
    ...mineRourter
  ]
})
