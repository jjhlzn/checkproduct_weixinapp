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
    isBackFromSarch: false,
    queryParams: {
      startDate: '',
      endDate: '',
      ticketNo: '',
      hasChecked: false
    }
  },

  loadData: function () {
    var self = this;
    if (this.data.loading) {
      console.log("正在加载数据中")
      return;
    }

    self.setData({ loading: true });
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
    var endDate = new moment().format('YYYY-MM-DD');
    var startDate = new moment().subtract(30, 'day').format('YYYY-MM-DD');
    this.setData({
      queryParams: {
        startDate: startDate,
        endDate: endDate,
        ticketNo: "",
        hasChecked: false
      }
    });

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    checkPermission();
    this.loadData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isBackFromSearch) {
      console.log("load data after search")
      this.setData({
        items: [],
        totalCount: 0,
        isBackFromSearch: false
      });
      this.loadData();
    }
    wx.setNavigationBarTitle({
      title: '未完成列表'
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
    for (var i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i].ticketNo == ticketNo) {
        return this.data.items[i];
      }
    }
    return null;
  },

  bindItemTap: function (e) {

    let id = e.currentTarget.dataset.id;

    let item = this.getItem(id);
    console.log("item:", item);
    if (item) {
      wx.navigateTo({
        url: '../checkitem/checkitem?id=' + id,
      })
    }
  },

  bindSearchTap: function (e) {
    wx.navigateTo({
      url: '../search/search?queryparams=' + JSON.stringify(this.data.queryParams),
    })
  }
})