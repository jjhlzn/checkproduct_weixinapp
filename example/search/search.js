// search.js
import { checkPermission } from '../model/user.js';
let moment = require('../lib/moment.js');
let utils = require('../utils').utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate: '',
    ticketNo: "",
    hasChecked: false,

    statusIndex: 0,
    statuses: [{ name: '未分配', value: '未分配'},
      { name: '待验货', value: '未验货' },
      { name: '未完成', value: '未完成' },
      { name: '已验货', value: '已验货' },
              ],
    statusNames: [
      '未分配',
      '待验货',
      '未完成',
      '已验货'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options:" + options.queryparams);
    if (options.queryparams) {
      let queryParams = JSON.parse(options.queryparams);
      this.data.statuses.forEach( (item, index) => {
        console.log(item);
        console.log("index: " + index);
        if (item.value == queryParams.status) {
          queryParams.statusIndex = index;
        }
      })
      this.setData(queryParams);
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
    /*
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      queryParams: this.data,
      isBackFromSearch: true
    }); */
    wx.setStorageSync(utils.queryParamsKey, {
      queryParams: {
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        ticketNo: this.data.ticketNo,
        status: this.data.statuses[this.data.statusIndex].value
      },
      isBackFromSearch: true
    });
    console.log("before wx.switchTab")
    let url = "";
    if (this.data.statusIndex == 0) {
      url = '../assignlist/assignlist';
    } else if (this.data.statusIndex == 1) {
      url = '../notchecklist/notchecklist';
    } else if (this.data.statusIndex == 2) {
      url = '../notcompletelist/notcompletelist';
    } else if (this.data.statusIndex == 3) {
      url = '../checklist/checklist';
    }
    wx.switchTab({
      url: url,
    })
  }
})