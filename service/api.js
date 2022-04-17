import request from './request'

const getToken = function(data) {
  return request({
    url: '/wxlogin',
    method: 'POST',
    data
  })
}

const checkToken = function () {
  return request({
    url: '/auth',
    method: 'POST'
  })
}

// 获取侧边栏分类信息
const getSideBarInfo = () => {
  return request({
    url: '/categorys',
    method: 'GET'
  })
}

// 获取商品信息
const getGoodsInfo = () => {
  return request({
    url: '/goods',
    method: 'GET'
  })
}

// 获取店铺信息
const getStoreInfo = () => {
  return request({
    url: '/storefront',
    method: 'GET'
  })
}

// 获取优惠券信息
const getCouponInfo = () => {
  return request({
    url: '/coupons',
    method: 'GET'
  })
}

const getSwiperInfo = () => {
  return request({
    url: '/swipers',
    method: 'GET'
  })
}

const createOrder = (data) => {
  return request({
    url: '/orders',
    method: 'POST',
    data
  })
}

const getOrderInfo = (data) => {
  return request({
    url: '/orders',
    method: 'GET',
    data
  })
}

const updateOrderStatus = (data) => {
  return request({
    url: '/orders',
    method: 'PUT',
    data
  })
}

const getTableInfo = () => {
  return request({
    url: '/tables'
  })
}

const createEvaluation = (data) => {
  return request({
    url: '/evaluation',
    method: 'post',
    data
  })
}

export {
  getToken,
  checkToken,
  getSideBarInfo,
  getGoodsInfo,
  getStoreInfo,
  getCouponInfo,
  getSwiperInfo,
  createOrder,
  getOrderInfo,
  updateOrderStatus,
  getTableInfo,
  createEvaluation
}