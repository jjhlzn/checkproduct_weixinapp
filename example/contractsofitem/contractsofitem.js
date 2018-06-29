// example/contractsofitem/contractofitem.js
let service = require('../service').Service;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkOrder: {
      ticketNo: "",
      announcements: "",
      checkResult: null,
      checkMemo: null
    },
    contracts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log("options: " + JSON.stringify(options));
     this.setData({
       checkOrder: {
         ticketNo: options.id,
         announcements: options.announcements, 
         checkResult: options.checkResult ,
         checkMemo: options.checkMemo
       }
     })
     
     this.loadData();
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
      title: '采购合同号',
    })

    console.log("checkOrder: " + JSON.stringify(this.data.checkOrder));
  },

  loadData: function() {
    console.log('加载合同信息')
    var self = this;
    if (this.data.loading) {
      console.log("正在加载数据中")
      return;
    }
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: service.getCheckOrderContractsUrl(),
      data: {
        ticketNo: self.data.checkOrder.ticketNo
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status != 0) {
          wx.showToast({
            title: '加载失败',
          })
          return;
        }
        let contracts = res.data.contracts;
        self.setData({ contracts: contracts});
      },
      fail: function (err) {
        console.error(err)
        wx.showToast({
          title: '加载失败',
        })
      },
      complete: function () {
        wx.hideLoading()
        self.setData({ loading: false });
      }
    })
  },

  updateCheckResult: function (ticketNo, checkResult) {
    console.log('updateCheckResult: ' + ticketNo + " = " + ticketNo + ', checkResult = '
      + checkResult);
    this.data.checkOrder.checkResult = checkResult;
    this.setData({
      checkOrder: this.data.checkOrder
    });
  },

  bindItemTap: function (e) {

    let contractNo = e.currentTarget.dataset.id;
    if (!contractNo) {
      wx.showToast({
        title: '合同号不能为空',
        duration: 3000,
        image: '../icons/error.png'
      })
      return;
    }

    wx.navigateTo({
      url: '../checkitem/checkitem?ticketNo=' + this.data.checkOrder.ticketNo + '&contractNo=' + contractNo ,
    })
  },

  bindCheckTap: function () {
    wx.navigateTo({
      url: '../check/check?ticketNo=' + this.data.checkOrder.ticketNo,
    })
  },

  bindModifyChecker: function() {
    if (this.data.checkOrder.ticketNo) {
      wx.navigateTo({
        url: '../assignchecker/assignchecker?id=' + this.data.checkOrder.ticketNo,
      })
    }
  }
})