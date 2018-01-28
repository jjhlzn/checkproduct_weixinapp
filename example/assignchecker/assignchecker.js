// assignchecker.js
import { checkPermission } from '../model/user.js';
let service = require('../service').Service;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkers: [
      {name: '张三', username: '0001'}
    ],
    checkerNames: [
      '张三'
    ],
    checkerIndex: 0,
    ticketNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ticketNo: options.id});
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    checkPermission();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '分配验货员'
    })
  },

  loadData: function () {
    var self = this;
    if (this.data.loading) {
      console.log("正在加载数据中")
      return;
    }

    self.setData({ loading: true });
    wx.request({
      url: service.getAllCheckersUrl(),
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let items = self.data.items;
        console.log(res);
        let checkers = res.data.checkers;
        self.setData({checkers: checkers});
        let checkerNames = checkers.map(item => item.name);
        self.setData({ checkerNames: checkerNames});
      },
      fail: function (err) {
        console.error(err)
        wx.showToast({
          title: '加载失败',
        })
      },
      complete: function () {
        self.setData({ loading: false });
      }
    })
  },


  /**
   * 下拉刷新处理
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
  
  },

  bindCheckerChange: function (e) {
    this.setData({
      checkerIndex: e.detail.value
    })
  },

  bindSaveTap: function(e) {
    let loginUser = wx.getStorageSync('loginUser');
    let self = this;
    wx.request({
      url: service.assignCheckerUrl(),
      data: {
        ticketNo: this.data.ticketNo,
        checker: loginUser.username
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 0) {
          wx.showToast({
            title: '保存成功',
          });

          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.removeItem(self.data.ticketNo);


        } else {
          wx.showToast({
            title: '保存失败',
          })
        }
      },
      fail: function (err) {
        console.error(err)
        wx.showToast({
          title: '保存失败',
        })
      }
    })

    
  }
})