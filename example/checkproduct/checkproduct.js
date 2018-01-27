let service = require('../service').Service;
let uploadFiles = require('../logic/upload').uploadFiles;
import { checkPermission } from '../model/user.js';

Page({
  data: {
    maxUploadCount: 3,
    lock: false,     
    uploadedCount: 0,
    radioItems: [
      { name: '合格', value: '合格' },
      { name: '不合格', value: '不合格'},
      { name: '未完成', value: '未完成', checked: true },
      { name: '待定', value: '待定' }
    ],
    ticketNo: "",
    contractNo: "",
    productNo: "",
    product: {

    },
    files: [],
    deleteImages: [],
    addImages: []
  },

  onLoad: function (options) {
    console.log('options: ' + options)

    this.setData({
      ticketNo: options.ticketNo,
      contractNo: options.contractNo,
      productNo: options.productNo
    })

    var self = this;
    console.log("onload");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: service.getProductInfoUrl(),
      data: {
        contractNo: self.data.contractNo,
        productNo: self.data.productNo
      },
      header: {
        'content-type': 'application/json'
      },
      complete: function (res) {
        wx.hideLoading()
        console.log(res);
        if (res.data.status != 0) {
          wx.showToast({
            title: '加载失败',
          })
          return;
        }
        self.data.radioItems.forEach( item => {
          if (item.value == res.data.product.checkResult) {
            item.checked = true;
          } else {
            delete item.checked;
          }
        });

        let files = res.data.product.pictureUrls;
        let urls = files.map(file => service.makeImageUrl(file));
        self.setData({
          product: res.data.product,
          files: urls,
          radioItems: self.data.radioItems
        })
        
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    })
  },

  setPickCount: function(e) {
    this.data.product.pickCount = e.detail.value;
  },
  setBoxSize: function (e) {
    this.data.product.boxSize = e.detail.value;
  },
  setGrossWeight: function (e) {
    this.data.product.grossWeight = e.detail.value;
  },
  setNetWeight: function (e) {
    this.data.product.netWeight = e.detail.value;
  },
  setCheckMemo: function (e) {
    this.data.product.checkMemo = e.detail.value;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '验货',
    })
    checkPermission()
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.data.product.checkResult = e.detail.value;
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    if (this.data.lock) {
      return;
    }
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    console.log("index = " + index);
    wx.previewImage({
      current: this.data.files[index], // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  touchend: function (e) {
    if (this.data.lock) {
      setTimeout(() => {
        this.setData({
          lock: false
        })
      }, 100)
    }
  },

  getImageUrl: function(event) {
    let e = event;
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    return this.data.files[index];
  },

  //传入按键事件，将所点按的图片删除
  removeImage: function (e) {
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    let url = this.data.files.splice(index, 1);
    console.log("delete image: " + url);
    this.setData({ files: this.data.files });
  },

  bindLongImageTap: function (e) {
    let self = this;
    this.setData({
      lock: true
    });
    //console.log("long tap image");
    //console.log(e);
    wx.showModal({
      title: '',
      content: '删除该图片？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let url = self.getImageUrl(e);
          self.removeImage(e);
          console.log('url: ' + url);
          if (!url.startsWith('http://tmp/') && !url.startsWith('wxfile://')) {
            self.data.deleteImages.push(url);
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  checkBeforeTap: function () {
    return true;
  },

  submitCheckRequest: function () {
    wx.showLoading({
      title: '提交验货结果',
    })
    wx.request({
      url: service.checkProductUrl(),
      success: function (res) {
        wx.hideLoading();
        if (res.data.status == 0) {

          wx.showModal({
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              //把审核的结果传递回前一个页面
              let pages = getCurrentPages();
              let curPage = pages[pages.length - 2];
              let data = curPage.data
              console.log("data: ", data);

              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({
                  checkResult: {
                    result: true
                  }
                });
              }
            }
          });


        } else {
          wx.showModal({
            content: '提交失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      },
      fail: function (err) {
        wx.showModal({
          content: '提交失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      }
    })
  },

  combineImageUrls: function(array) {
    if (array.length == 0)
      return "";

    let result = array[0];
    for(var i = 1; i < array.length; i++) {
      result = result + "^" + array[i];
    }
    return result;
  },

  uploadCompleteHandler: function() {
    wx.showLoading({
      title: '提交验货结果',
    })
    let self = this;
    console.log("deleteImages: " + self.combineImageUrls(self.data.deleteImages));
    
    wx.request({
      url: service.checkProductUrl(),
      data: {
        ticketNo: self.data.ticketNo,
        contractNo: self.data.contractNo,
        productNo: self.data.productNo,

        checkResult: self.data.product.checkResult,
        pickCount: self.data.product.pickCount,
        boxSize: self.data.product.boxSize,
        grossWeight: self.data.product.grossWeight,
        netWeight: self.data.product.netWeight,
        checkMemo: self.data.product.checkMemo,

        addImages: self.combineImageUrls(self.data.addImages),
        deleteImages: self.combineImageUrls(self.data.deleteImages)
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let items = self.data.items;
        console.log("checkproduct response:", res);
        if (res.data.status != 0) {
          wx.showToast({
            title: '验货失败',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '验货成功',
            duration: 3000
          })
        }
      },
      fail: function (err) {
        console.error(err)
        wx.showToast({
          title: '验货失败',
          duration: 3000
        })

      },
      complete: function () {
      }
    })
  },

  bindSubmitTap: function (e) {
    if (!this.checkBeforeTap()) {
      return false;
    }

    console.log("submit tap");
    var self = this;

    //上传图片，使用对话框提示，图片上传完之后，提交验货结果

    //过滤不需要进行上传的图片
    this.data.files.forEach(item => {
      console.log("item: " + item);
    })
    //let needUploadFiles = this.data.files.filter((item) => { return !item.startsWith('https:') && !item.startsWith('http:')} );
    let needUploadFiles = this.data.files.filter((item) => { return item.startsWith('http://tmp/') || item.startsWith('wxfile://') });

    console.log("needUploadFiles: " + JSON.stringify(needUploadFiles));

    let imageCount = needUploadFiles.length;

    if (imageCount > 0) {
      wx.showLoading({
        title: '上传中( ' + 1 + '/' + imageCount + ' )',
      })
    }
    uploadFiles(needUploadFiles, this, this.uploadCompleteHandler);

  },


});