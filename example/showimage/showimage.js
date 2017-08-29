// showimage.js
let service = require('../service').Service;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkItem: {
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options: ', options);
    
    var checkItem = options;
    checkItem.imageUrl = service.getCheckFileUrl() + '?id='+options.id + '&fileid=' + options.fileid;
    this.setData({
      checkItem: checkItem
    })

    console.log("imageUrl: ", this.data.checkItem.imageUrl);
    wx.showLoading({
      title: '图片加载中',
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    /* 
    wx.downloadFile({
      url: 'http://pic28.nipic.com/20130424/11588775_115415688157_2.jpg',
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function(err) {
            console.log(err);
          }
        })
      },
      fail: function(err){
        console.log(err);
      }
    })*/
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindImageLoadSuccess: function() {
    wx.hideLoading()
  },

  bindImageLoadError: function() {
    wx.hideLoading()
  }
})

