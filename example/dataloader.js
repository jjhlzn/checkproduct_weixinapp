let service = require('./service').Service
let utils = require('./utils.js').utils;

let getMoreData = function (page) {
  let self = page;
  if (self.data.items.length < self.data.totalCount) {
    //this.loadData(self.data.request.pageNo + 1);
    loadData(self, self.data.request.pageNo + 1)
  } else {
    self.setData({ isLoadAll: true });
  }
}

let reset = function(page) {
  let self = page;
  self.setData({
    request: {
      pageNo: 0,
      pageSize: 100,
    },
    totalCount: 0,
    items: [],
    isLoadAll: false,
    isBackFromSearch: false
  });
  //self.data.queryParams.ticketNo = ''
}

let loadData = function (page, pageNo) {
  var self = page;
  self.data.request.pageNo = pageNo;

  if (self.data.loading) {
    console.log("正在加载数据中")
    return;
  }

  self.setData({ loading: true });
  self.data.loading = true;
  console.log(service.getCheckOrdersUrl())
  wx.request({
    url: service.getCheckOrdersUrl(),
    data: {
      pageNo: self.data.request.pageNo,
      pageSize: self.data.request.pageSize,
      startDate: self.data.queryParams.startDate,
      endDate: self.data.queryParams.endDate,
      ticketNo: self.data.queryParams.ticketNo,
      checker: self.data.queryParams.checker ? self.data.queryParams.checker : "-1",
      status: self.data.status,
      username: utils.getMyUserName()
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      let items = self.data.items;
      res.data.items.forEach( (item)=> {
        if (item.outDate) {
          item.outDate = item.outDate.substr(0, item.outDate.indexOf(' '))
        }
      })
      items.push.apply(items, res.data.items);
      console.log("res:", res);
      self.setData({ items: items, totalCount: res.data.totalCount });
      if (items.length === res.data.totalCount) {
        self.setData({ isLoadAll: true });
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
}

let reloadOrder = function(page, orderNo) {
  wx.request({
    url: service.getCheckOrderInfoUrl(),
    data: {
      ticketNo: orderNo
    },
    header: {
      'content-type': 'application/json'
    },
    complete: function (res) {
      console.log("reloadOrder: "+ JSON.stringify(res));
      if (res.data.status != 0) {
        return;
      }
      let order = res.data.checkOrder
      let orders = page.data.items;
      console.log(JSON.stringify(page.data))
      for(var i = 0; i < orders.length; i++) {
        if (orders[i].ticketNo == order.ticketNo) {
          orders[i] = order;
          page.setData({ items: orders})
          console.log("find order: " + order.ticketNo)
          break;
        }
      }
    },
    fail: function (err) {
      
    }
  })
}

module.exports = {
  loadData: loadData,
  getMoreData: getMoreData,
  reset: reset,
  reloadOrder: reloadOrder
}
