// pages/authLogin/authLogin.js
import {getToken} from '../../service/api'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,  // 声明一个变量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    Toast.loading({
      message: '加载中...', 
      forbidClick: true,
      loadingType: 'spinner',
      duration: 500
    });
    var that = this;
    setTimeout(function () {
      that.setData({
        navH: app.globalData.navHeight // 给刚刚声明的变量附上全局获取的nav高度
      })
      wx.hideLoading()
    }, 1000)
  },
  goBack() {
    wx.navigateBack()
  },
  getUserProfile(e) {
    // wx.checkSession({
    //   success () {
    //     //session_key 未过期，并且在本生命周期一直有效
    //   },
    //   fail () {
    //     // session_key 已经失效，需要重新执行登录流程
    //     wx.login() //重新登录
    //   }
    // })
    Toast.loading({
      message: '加载中...', 
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });
    wx.getUserProfile({
      desc: '请求获取您的头像，昵称信息',
      success: (res) => {
        wx.setStorageSync('user', res.userInfo)
        let data = res.userInfo
        console.log(data);
        getToken({ 
          ...data, 
          code: app.globalData.code
        }).then(res => {
          console.log(res) 
          wx.setStorageSync('token', res.data.data.token)
          wx.navigateBack()
        }).catch(err => {
          console.log(err)
          Toast({
            message: '登录失败', 
            duration: 1000
          });
        }).finally(() => {
          Toast.clear()
        })
      },
      fail(err) {
        wx.showToast({
          title: '已取消',
          icon: 'none',
          duration: 1000,
        })
        console.log(err);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('authOnshow');
    wx.login({
      success: res => {
        app.globalData.code = res.code
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})