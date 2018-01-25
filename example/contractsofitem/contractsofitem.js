// example/contractsofitem/contractofitem.js
let service = require('../service').Service;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkOrder: {
      ticketNo: "",
      checkStatus: "",
      checkMemo: ""
    },
    contracts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       checkOrder: {
         ticketNo: options.id,
         checkStatus: "未完成",
         checkMemo: "无"
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
  },

  loadData: function() {
    var self = this;
    if (this.data.loading) {
      console.log("正在加载数据中")
      return;
    }

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
        self.setData({ loading: false });
      }
    })
  },

  bindItemTap: function (e) {

    let contractNo = e.currentTarget.dataset.id;
    //let item = this.getItem(id);
    //console.log("item:", item);
    //if (item) {
      /*
    wx.navigateTo({
      url: '../contractsofitem2/contractsofitem2?id=' + id,
    }) */
    
    wx.navigateTo({
      url: '../checkitem/checkitem?ticketNo=' + this.data.checkOrder.ticketNo + '&contractNo=' + contractNo ,
    })

    //}
  },

  bindCheckTap: function () {
    wx.navigateTo({
      url: '../check/check',
    })
  },
})