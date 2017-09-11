// checkitem.js
let service = require('../service').Service;
import { checkPermission } from '../model/user.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
   checkItem: {
     id: "",
     content: "",
     files: [],
     checkResult: {},
     properties: [
       
     ]
   }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    console.log("onload");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: service.getCheckItemUrl(),
      data: options,
      header: {
        'content-type': 'application/json'
      },
      complete: function(res) {
         wx.hideLoading()
         console.log(res);
         if (res.data.status != 0) {
           wx.showToast({
             title: '加载失败',
           })
           return;
         }
         self.setData({
           checkItem: res.data.item
         })
      },
      fail: function(err) {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    checkPermission()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow");
    wx.setNavigationBarTitle({
      title: '验货单',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload");
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindCheckTap: function() {
    wx.navigateTo({
      url: '../check/check',
    })
  },

  bindFileTap: function(e) {
    console.log(e)
    /*
    let fileId = e.currentTarget.dataset.fileId;
    console.log(fileId);
    let url = '../showimage/showimage?id=' + this.data.checkItem.id + '&fileid=' + fileId;
    console.log("url: ", url);
    wx.navigateTo({
      url: url,
    })*/

    var url2 = service.getCheckFileUrl();
    console.log("url: ", url2);
    wx.previewImage({
      current: url2, // 当前显示图片的http链接
      urls: [url2] // 需要预览的图片http链接列表
    })
  },

  bindFileTap2: function(e) {
    wx.navigateTo({
      url: '../showdocument/showdocument',
    })
  },

  bindViewImagesTap: function(e) {
    let images = this.data.checkItem.checkResult.images;
    wx.navigateTo({
      url: '../checkimages/checkimages?images='+JSON.stringify(images),
    })
  },

  bindProductTap: function(e) {
    wx.navigateTo({
      url: '../product/product?item=' + JSON.stringify(this.data.checkItem),
    })
  },

  /**
 * 下拉刷新处理
 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})