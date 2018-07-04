// example/contractsofitem2/contractsofitem2.js
let service = require('../service').Service
import { checkPermission } from '../model/user.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    selectedType: '全部',
    ticketNo: '',
    products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ticketNo: options.id
    });
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
      title: '货物列表',
    })
    this.loadData();
  },

  loadData: function () {
    let self = this;
    this.setData({
      loading: true
    })
    wx.request({
      url: service.getProductsUrl(),
      data: {
        ticketNo: self.data.ticketNo,
        checkResult: self.data.selectedType
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("res:", res);
        if (res.data.status != 0) {
          wx.showToast({
            title: '加载失败',
          })
          return;
        }
        let products = res.data.products;
        self.setData({ products: products });
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


  bindItemTap: function (e) {
    let contractNoAndSpid = e.currentTarget.dataset.id;
    let contractNo = contractNoAndSpid.split('###')[0]
    let spid = contractNoAndSpid.split('###')[1]

    wx.navigateTo({
      url: '../uploadbeforeassign/uploadbeforeassign?ticketNo=' + this.data.ticketNo + '&spid=' + spid,
    })
  },

  
})