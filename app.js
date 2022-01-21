// app.js
App({
  globalData: {},
  onLaunch() {
    this.login().then(res => {
      console.log('code:' + res)
      this.globalData.code = res
    }).catch(err => {
      wx.showToast({
        title: err.message,
        duration: 1000
      })
    })
  },

  login() {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token') || ''
      if (!token) {
        wx.login({
          success: res => {
            const code = res.code
            resolve(code)
          },
          fail: err => {
            reject(err)
          }
        })
      }
    })
  },
  // checkToken() {
  //   console.log('checkToken')
  //   const token = wx.getStorageSync('token')
  //   return new Promise((resolve, reject) => {
  //     wx.request({
  //       url: `${config.url}/auth`,
  //       header: {
  //         'authorization': token
  //       },
  //       method: 'POST',
  //       success (res) {
  //         console.log(res);
  //         resolve(res)
  //       },
  //       fail (err) {
  //         console.log(err);
  //         reject(err)
  //       }
  //     })
  //   })
  // },
  // switch: false
  // wx.login({
  //   success: (res) => {
  //     const code = res.code
  //     if (code) {
  //       wx.request({
  //         url: `${config.url}/wxlogin`,
  //         method: 'POST',
  //         data: {
  //           code: code
  //         },
  //         header: {   
  //           'content-type': 'application/json'
  //         },  
  //         success: (res) => {  
  //           console.log(res);
  //           console.log('token:',res.data.token)
  //           wx.setStorageSync('token', res.data.data.token)
  //           resolve()
  //         }   
  //       }) 
  //     } else {
  //       console.log('获取用户登录态失败' + res.errMsg);
  //       reject(err) 
  //     }  
  //   }
  // })
})

