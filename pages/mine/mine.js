//index.js
//获取应用实例
const app = getApp()
import { getToken } from '../../service/api'

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    canIUseOpenData: false 
  },
  onLoad() {
    
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onShow: function () {
    this.getTabBar().init();
  },
  // onShow: function () {
  //   app.login().then(res => {
  //     app.globalData.code = res
  //     console.log(res);
  //   }).catch(err => {
  //     wx.showToast({
  //       title: err.message,
  //       icon: 'none',
  //       duration: 1000
  //     })
  //   })
  // },
  getUserProfile(e) {
    // wx.getSetting({
    //   success: res => {
    //     console.log(res)
    //     if (!res.authSetting['scope.userInfo']) {
    //       console.log('没有授权用户信息');
    //     } else {
    //       console.log('授权了');
    //     }
    //   }
    // })
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })
    wx.getUserProfile({
      desc: '请求获取您的头像，昵称信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo, 
          hasUserInfo: true
        })
        wx.setStorageSync('user', res.userInfo)
        let data = res.userInfo
        console.log(data);
        getToken({ 
          ...data, 
          code: app.globalData.code
        }).then(res => {
          console.log(res) 
          wx.setStorageSync('token', res.data.data.token)
        }).catch(err => {
          console.log(err)
        })
        // wx.request({ 
        //   url: getToken.url,
        //   method: "POST",
        //   data: { 
        //     ...data, 
        //     code: app.globalData.code
        //   },
        //   success: res => {
        //     console.log(res) 
        //     wx.setStorageSync('token', res.data.data.token)
        //   },
        //   fail: err => {
        //     console.log(err)
        //   }
        // })
      },
      fail(err) {
        wx.showToast({
          title: '请先授权登录',
          icon: 'none',
          duration: 1000
        })
        console.log(err);
      }
    })
  },


  //退出登录
  quit: function() {
    try {
      wx.removeStorageSync('token')
      wx.removeStorageSync('user')
      this.setData({
        userInfo: {},
        hasUserInfo: false,
      })
      wx.showToast({
        title: '退出登录',
        icon: 'none',
        duration: 1000
      })
    } catch (e) {
      console.log(e);
    }
  },
})