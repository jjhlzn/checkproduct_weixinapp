// notchecklist.js
let service = require('../service').Service

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    totalCount: 0,
    items: []
  },

  loadData: function () {
    var self = this;
    if (this.data.loading) {
      console.log("正在加载数据中")
      return;
    }

    self.setData({ loading: true });
    self.data.loading = true;
    wx.request({
      url: service.getNotCheckListUrl(),
      header: {
        'content-type': 'application/ json'
      },
      success: function (res) {
        let items = self.data.items;
        items.push.apply(items, res.data.items);
        self.setData({ items: items, totalCount: res.data.totalCount });
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
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