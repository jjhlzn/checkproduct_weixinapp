// search.js
import { checkPermission } from '../model/user.js';
let moment = require('../lib/moment.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate: '',
    ticketNo: "",
    hasChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.queryparams);
    
    if (options.queryparams) {
      this.setData(JSON.parse(options.queryparams));
    } else {
      console.log("date:", new moment().format('YYYY-MM-DD'));
      var endDate = new moment().format('YYYY-MM-DD');
      var startDate = new moment().subtract(30, 'day').format('YYYY-MM-DD');
      this.setData({
        startDate: startDate,
        endDate: endDate,
        ticketNo: ""
      });
    }
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
      title: '查找验货单',
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

  bindTicketNoInput: function(e) {
    this.data.ticketNo = e.detail.value;
  },

  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  bindSearchTap: function() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      queryParams: this.data,
      isBackFromSearch: true
    });
    wx.navigateBack({
      
    })
  }
})