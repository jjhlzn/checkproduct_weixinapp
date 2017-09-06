// notchecklist.js
let service = require('../service').Service

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    totalCount: 0,
    items: [],
    request: {
      pageNo: 0,
      pageSize: 10
    },
    isLoadAll: false
  },

  

  loadData: function(pageNo) {
    var self = this;
    self.data.request.pageNo = pageNo;
    if (this.data.loading) {
      console.log("正在加载数据中")
      return;
    }
    
    self.setData({loading: true});
    self.data.loading = true;
    wx.request({
      url: service.getCheckListUrl(),
      data: {
        request: self.data.request
      },
      header: {
        'content-type': 'application/ json'
      },
      success: function (res) {
        let items = self.data.items;
        items.push.apply(items, res.data.items);
        console.log("res:", res);
        self.setData({ items: items, totalCount: res.data.totalCount });
        if (items.length === res.data.totalCount) {
          self.setData({isLoadAll: true});
        }
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
    this.loadData(0)
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
      title: '已验货列表'
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
    console.log("onPullDownRefresh called");
    this.getMoreData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom called")
    this.getMoreData();
  },

  getMoreData() {
    let self = this;
    if (this.data.items.length < this.data.totalCount) {
      this.loadData(self.data.request.pageNo + 1);
    } else {
      this.setData({isLoadAll: true});
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 下拉刷新处理
   */
  onPullDownRefresh: function () {
    let self = this;
    this.setData({ items: [], isLoadAll: false });
    this.loadData(0);
    wx.stopPullDownRefresh();
  },

  bindItemTap: function (e) {
    console.log("item: ", e);
    let id = e.currentTarget.dataset.id;
    console.log("id: ", id);
    wx.navigateTo({
      url: '../checkitem/checkitem?id=' + id,
    })
  },

  bindSearchTap: function (e) {
    wx.navigateTo({
      url: '../search/search',
    })
  }
})