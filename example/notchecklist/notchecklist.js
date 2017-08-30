// notchecklist.js
let service = require('../service').Service

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    var self = this;
    wx.showLoading({
      title: '加载验货列表',
    })
    wx.request({
      url: service.getNotCheckListUrl(),
      header: {
        'content-type': 'application/ json'
      },
      success: function(res) {
          self.setData({items: res.data.items});
      }, 
      fail: function(err) {
        console.error(err)
        wx.showToast({
          title: '加载失败',
        })
      },
      complete: function() {
        wx.hideLoading()
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
    wx.setNavigationBarTitle({
      title: '未验货列表'
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

  getItem(ticketNo) {
    for(var i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i].ticketNo == ticketNo) {
        return this.data.items[i];
      }
    }
    return null;
  },

  bindItemTap: function(e) {

    let id = e.currentTarget.dataset.id;
    console.log("id: ", id);

    let item = this.getItem(id);
    console.log("item:", item);
    if (item) {
      if (item.status === '未分配' ) {
        wx.navigateTo({
          url: '../assignchecker/assignchecker?id=' + id,
        })
      } else {
        wx.navigateTo({
          url: '../checkitem/checkitem?id=' + id,
        })
      }
      
    }
  },

  bindSearchTap: function(e) {
    wx.navigateTo({
      url: '../search/search',
    })
  }
})