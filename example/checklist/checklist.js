// notchecklist.js
let service = require('../service').Service
import { checkPermission } from '../model/user.js';
let moment = require('../lib/moment.js');


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
    isLoadAll: false,
    isBackFromSarch: false,
    queryParams: {
      startDate: '',
      endDate: '',
      ticketNo: '',
      hasChecked: false
    }
  },

  makeRequest: function() {
    let self = this;
    return {
      pageNo: self.data.request.pageNo,
      pageSize: self.data.request.pageSize,
      startDate: self.data.queryParams.startDate,
      endDate: self.data.queryParams.endDate,
      ticketNo: self.data.queryParams.ticketNo,
      hasChecked: self.data.queryParams.hasChecked
    }
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
        request: self.makeRequest()
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
    var endDate = new moment().format('YYYY-MM-DD');
    var startDate = new moment().subtract(30, 'day').format('YYYY-MM-DD');
    this.setData({
      queryParams: {
        startDate: startDate,
        endDate: endDate,
        ticketNo: "",
        hasChecked: true
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    checkPermission();
    this.loadData(0)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isBackFromSearch) {
      console.log("load data after search")
      this.reset();
      this.loadData(0);
    }

    wx.setNavigationBarTitle({
      title: '已验货列表',
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

  reset() {
    this.setData({ 
      request: {
        pageNo: 0,
        pageSize: 10
      },
      totalCount: 0,
      items: [], 
      isLoadAll: false,
      isBackFromSearch: false });
  },

  /**
   * 下拉刷新处理
   */
  onPullDownRefresh: function () {
    let self = this;
    this.reset();
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
      url: '../search/search?queryparams=' + JSON.stringify(this.data.queryParams),
    })
  }
})