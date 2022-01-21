import request from './index'

const getToken = function(data) {
  return request({
    url: '/wxlogin',
    method: 'POST',
    data
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
export {
  getToken,
  getSideBarInfo,
  getGoodsInfo,
  getStoreInfo,
  getCouponInfo
}