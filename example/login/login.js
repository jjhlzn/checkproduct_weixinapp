var service = require('../service').Service;

// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    wx.reLaunch({
      url: '../notchecklist/notchecklist',
    }); */
    let loginUser = wx.getStorageSync('loginUser');
    console.log('loginUser: ', loginUser);
    if (loginUser) {
      wx.reLaunch({
        url: '../notchecklist/notchecklist',
      });
    }
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
   * 下拉刷新处理
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindLoginTap: function() {
    console.log("login pressed");
    wx.showLoading({
      title: '登陆中',
    });
    /*
    wx.navigateTo({
      url: '../notchecklist/notchecklist',
    }) */

    wx.request({
      url: service.loginUrl(), //仅为示例，并非真实的接口地址
      data: {
      },
      header: { 
        'content-type': 'application/json'
      },
      success: function (res) { 
        console.log("success");
        console.log(res)
        var status = res.data.status;
        if (status != 0) {
          wx.showModal({
            content: res.data.errorMessage,
            showCancel: false,
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
          return;
        }
        wx.setStorageSync('loginUser', res.data.user)
        wx.reLaunch({
          url: '../notchecklist/notchecklist',
        });
      },
      fail: function(res) {
        console.log("fail");
        wx.showModal({
          content: '服务器出错',
          showCancel: false,
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      },
      complete: function(res) {
        wx.hideLoading()
      }
    })
  }
})