// index.js
// 获取应用实例
import { getSideBarInfo, getGoodsInfo, getStoreInfo, getCouponInfo, getSwiperInfo } from '../../service/api'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';


// import _ from '../../node_modules/lodash'
const app = getApp()

Page({
  data: {
    // 分类列表
    cateList: [],
    // 商品列表
    goodsList: [],
    // 轮播图
    swiperInfo: [],
    // 侧边栏
    activeKey: 0,
    // 离顶部的距离
    scrollTop: 0,
    scrollTo: 0,
    // 店铺信息
    storeInfo: {},
    // 店铺完整地址
    storeAddress: '',
    // 优惠信息
    couponInfo: '',
    // 购物车各商品商品数量
    cartList: {},
    // 是否显示购物车
    footerIsShow: true,
    // 总价格
    totalPrice: 0,
    // 购物车数量
    cartNum: 0,
    // 购物车信息
    cartInfo: [],
    // 商品详情
    goodsItem: {},
    // 是否显示商品详情弹框
    show: false,
    // 是否展示购物车
    isShowCart: false,
    // 已选商品参数
    indexArr: [],
  },
  // 页面滚动回调
  onPageScroll(e) {
    // console.log(e)
    this.setData({scrollTop: e.scrollTop})
  },
  // 侧边栏变化回调
  onSideChange(event) {
    console.log(event.detail)
    this.setData({activeKey: event.detail})
    wx.pageScrollTo({
      selector: `#cate-${event.detail}`,
      duration: 300,
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  // Tabs页变化回调
  onTabsChange(event) {
    if (event.detail.index == 0) {
      this.setData({ footerIsShow: true})
    } else {
      this.setData({ footerIsShow: false})
    }
    console.log(event.detail.index)
    if(this.data.scrollTop != 0) {
      console.log(this.data.scrollTop)
      wx.pageScrollTo({
        scrollTop: this.data.scrollTop,
        duration: 0
      })
    }
  },
  // 展示商品详情
  showGoodsInfo(e) {
    this.setData({ 
      show: true,
      goodsItem: e.target.dataset.goodsitem,
      indexArr: Array(e.target.dataset.goodsitem.Parameters.length).fill(0)
    })
  },
  // 关闭弹出框
  onClose() {
    this.setData({
      indexArr: [],
      show: false
    })
    console.log(this.data.indexArr);
  },
  // 商品可选参数改变
  onChange(event) {
    // console.log(event);
    this.setData({
      radio: event.target.dataset.index,
      [`indexArr[${event.target.dataset.index}]`]: event.detail
    });
    // console.log(this.data.indexArr);
  },
  // 添加商品
  addGoods(e) {
    let isShow
    // 商品id
    const goodsItem = e.target.dataset.goodsitem
    const id = goodsItem.id
    const name = goodsItem.name
    const url = goodsItem.goodsPics[0].pic_url
    const price = goodsItem.real_price
    const len = goodsItem.Parameters.length
    // 如果没有参数选项则没有弹框 
    if (len == 0) {
      // 不显示弹窗
      isShow = this.data.show
      // 商品第一次加入购物车
      if (this.data.cartList[id] == 0) {
        const length = this.data.cartInfo.length
        this.setData({
          [`cartInfo[${length}].num`]: this.data.cartList[id] + 1,
          [`cartInfo[${length}].id`]: id,
          [`cartInfo[${length}].name`]: name,
          [`cartInfo[${length}].url`]: url,
          [`cartInfo[${length}].price`]: price,
        })
      } else {
        // 商品加入第二次，修改商品数量
        this.data.cartInfo.forEach((item,index) => {
          if (item.id == id) {
            this.setData({
              [`cartInfo[${index}].num`]: this.data.cartList[id] + 1,
            })
          }
        })
      }
    } else {
      isShow = true
      // 菜品参数
      let params = ''
      // 获取已选商品的参数名和参数项
      goodsItem.Parameters.forEach((item, index) => {
        params = params + item.name + ':' + item.list.split(',')[this.data.indexArr[index]] + ';'
      })
      if (this.data.cartList[id] == 0) {
        // 带参数的菜品第一次加入购物车
        const length = this.data.cartInfo.length
        this.setData({
          [`cartInfo[${length}].num`]: this.data.cartList[id] + 1,
          [`cartInfo[${length}].id`]: id,
          [`cartInfo[${length}].name`]: name,
          [`cartInfo[${length}].url`]: url,
          [`cartInfo[${length}].price`]: price,
          [`cartInfo[${length}].params`]: params,
        })
      } else {
        const length = this.data.cartInfo.length
        // 菜品不是第一次加入，判断购物车中石油有参数一致的菜品
        for(let i=0; i<length; i++) {
          // 如果参数一致,菜品数量加一,跳出循环
          if (this.data.cartInfo[i].id == id && this.data.cartInfo[i].params == params) {
            // 参数相同 直接数量加一
            this.setData({
              [`cartInfo[${i}].num`]: this.data.cartInfo[i].num + 1,
            })
            break
          }
          // 遍历完后,没有参数一致的菜品,将菜品加入购物车,跳出循环
          if(i == length - 1) {
            this.setData({
              [`cartInfo[${length}].num`]: 1,
              [`cartInfo[${length}].id`]: id,
              [`cartInfo[${length}].name`]: name,
              [`cartInfo[${length}].url`]: url,
              [`cartInfo[${length}].price`]: price,
              [`cartInfo[${length}].params`]: params,
            })
            break
          }
        }
      }
    }
    // 购物车商品数量加1
    this.setData({
      // 商品数量
      [`cartList.${id}`]: this.data.cartList[id] + 1,
      // 订单总价格
      totalPrice: this.data.totalPrice + price,
      // 购物车数量
      cartNum: this.data.cartNum + 1,
      show: isShow
    }, () => {
      Toast({
        message: '已加入购物车',
        position: 'bottom',
        duration: 1000,
        zIndex: 10001
      });
      // wx.showToast({
      //   title: '已加入购物车',
      //   duration: 1000
      // })
    })
    console.log(this.data.cartList);
    // console.log(this.data.cartInfo);
  },
  // 减少商品
  subtractGoods(e) {
    const goodsItem = e.target.dataset.goodsitem
    const id = goodsItem.id
    const price = goodsItem.real_price || goodsItem.price
    const params = goodsItem.params
    // 菜品没有可选参数
    if (!params) {
      const arr = this.data.cartInfo
      this.data.cartInfo.forEach((item, index) => {
        if (item.id == id) {
          // 如果数量为1，直接移除购物车
          if (item.num == 1) {
            arr.splice(index, 1)
            this.setData({cartInfo: arr})
          } else {
            this.setData({[`cartInfo[${index}].num`]: item.num - 1})
          }
        }
      })
    } else {
      const length = this.data.cartInfo.length
      const arr = this.data.cartInfo
      for(let i=0; i<length; i++) {
        if (this.data.cartInfo[i].id == id && this.data.cartInfo[i].params == params) {
          // 如果数量为1，直接移除购物车
          if (this.data.cartInfo[i].num == 1) {
            arr.splice(i, 1)
            this.setData({cartInfo: arr})
          } else {
            this.setData({[`cartInfo[${i}].num`]: this.data.cartInfo[i].num - 1})
          }
        }
      }
    }
    // 商品数量减1
    this.setData({ 
      [`cartList.${id}`]: this.data.cartList[id] - 1,
      totalPrice: this.data.totalPrice - price,
      cartNum: this.data.cartNum - 1
    })
    console.log(this.data.cartList);
  },
  // 查看购物车
  openCart(){
    this.setData({isShowCart : true})
  },
  // 关闭购物车
  closeCart() {
    this.setData({isShowCart : false})
  },
  // 在购物车中直接添加菜品
  cartAdd(e){
    const {id, num, params, price} = e.target.dataset.goodsitem
    if (!params) {
      this.data.cartInfo.forEach((item, index) => {
        if(item.id == id) {
          this.setData({
            [`cartInfo[${index}].num`]: num + 1,
            cartNum: this.data.cartNum + 1,
            totalPrice: this.data.totalPrice + price,
            [`cartList.${id}`]: num + 1
          })
        }
      })
    } else {
      this.data.cartInfo.forEach((item, index) => {
        if(item.id == id && item.params == params) {
          this.setData({
            [`cartInfo[${index}].num`]: num + 1,
            cartNum: this.data.cartNum + 1,
            totalPrice: this.data.totalPrice + price,
            [`cartList.${id}`]: num + 1
          })
        }
      })
    }
  },
  // 清空购物车
  cleanCart(){
    if(this.data.cartInfo.length != 0) {
      const obj = {}
      Object.keys(this.data.cartList).forEach(key => {
        obj[key] = 0
      })
      Dialog.confirm({
        title: '提示',
        message: '确认清空购物车？',
        zIndex: 10001
      }).then(() => {
        this.setData({
          cartInfo: [],
          cartNum: 0,
          totalPrice: 0,
          cartList: obj
        })
      }).catch(() => {
        Toast({
          message: '已取消',
          position: 'bottom',
          zIndex: 10001
        })
      })
    }
  },
  // 复制电话
  onPhoneCall() {
    wx.setClipboardData({
      data: this.data.storeInfo.phone,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // 页面加载完成回调
  onLoad() {
    // 获取侧边栏信息
  //   this.API_getSideBarInfo()
  //   // 获取商品信息
  //   this.API_getAllGoods()
  },
  // 页面展示回调
  onShow: async function () {
    this.getTabBar().init()
    if(this.data.cateList.length == 0) {
      await this.API_getSideBarInfo()
    }
    if(this.data.goodsList == 0) {
      await this.API_getGoodsInfo() 
    }
    this.API_getSwiperInfo()
    this.API_getStoreInfo()
    this.API_getCouponInfo()
  },
  // 网络请求：获取侧边栏分类信息
  async API_getSideBarInfo() {
    await getSideBarInfo().then(res => {
      console.log(res)
      if(res.data.meta.status === 200) {
        this.setData({ cateList: res.data.data })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err.errMsg,
        icon: 'none',
        duration: 2000
      })
    })
  },
  // 网络请求：获取商品信息
  async API_getGoodsInfo() {
    await getGoodsInfo().then(res => {
      console.log(res)
      if(res.data.meta.status === 200) {
        const goods = [...this.data.cateList]
        const numList = {}
        goods.forEach((item1, index) => {
          goods[index].goods = []
          res.data.data.forEach(item2 => {
            numList[item2.id] = 0
            if(item2.category_id == item1.id) {
              goods[index].goods.push(item2)
            }
          })
        })
        this.setData({ cartList: numList })
        this.setData({ goodsList: goods })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err.errMsg,
        icon: 'none',
        duration: 2000
      })
    })
  },
  // 网络请求:获取店铺信息
  API_getStoreInfo() {
    getStoreInfo().then(res => {
      console.log(res)
      const storeInfo = res.data.data
      if(res.data.meta.status === 200) {
        this.setData({
          storeInfo: storeInfo,
          storeAddress: storeInfo.province + storeInfo.city + storeInfo.county + storeInfo.address,
        })
      }
    })
  },
  API_getCouponInfo() {
    getCouponInfo().then(res => {
      console.log(res)
      if(res.data.meta.status === 200) {
        const data = res.data.data
        let coupon = ''
        data.forEach(item => {
          coupon = coupon + '满' + item.full + '减' + item.subtract + ';'
        })
        this.setData({couponInfo: coupon})
      }
    })
  },
  API_getSwiperInfo() {
    getSwiperInfo().then(res => {
      console.log(res)
      if(res.data.meta.status === 200) {
        this.setData({swiperInfo: res.data.data.swipers})
      }
    })
  }
})
