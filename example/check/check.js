let service = require('../service').Service;
import { checkPermission } from '../model/user.js';

Page({
  data: {
    lock: false,
    uploadedCount: 0,
    radioItems: [
      { name: '完成', value: '0' },
      { name: '未完成', value: '1', checked: true }
    ],
    checkResult: {
      result: "1",
      description: "",
    },
    files: []
  },

  onLoad: function(options) {
    let self = this;

    //从服务器上获取结果
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: service.getCheckItemResultUrl(),
      data: {
        request: options,
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
        self.setData({
          checkResult: res.data.result
        })

        if (self.data.checkResult.result == "完成") {
          self.setData({
            radioItems: [
              { name: '完成', value: '0', checked: true },
              { name: '未完成', value: '1' }
            ]
          })
        } else {
          self.setData({
            radioItems: [
              { name: '完成', value: '0' },
              { name: '未完成', value: '1', checked: true }
            ]
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    })
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
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  touchend: function(e) {
    if (this.data.lock) {
      setTimeout( () => {
        this.setData({
          lock: false
        })
      }, 100)
    }
  },

  //传入按键事件，将所点按的图片删除
  removeImage: function(e) {
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    this.data.files.splice(index, 1);
    this.setData({files: this.data.files});
    //console.log(this.data.files);
  },

  bindLongImageTap: function (e) {
    let self = this;
    this.setData({
      lock: true
    });
    console.log("long tap image");
    console.log(e);
    wx.showModal({
      title: '',
      content: '删除该图片？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          self.removeImage(e);

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  checkBeforeTap: function(){
    return true;
  },

  submitCheckRequest: function() {
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
              let data= curPage.data
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

  handleImageUploadFail: function() {
    wx.showToast({
      title: '图片上传失败',
      duration: 3000
    })
  },

  bindSubmitTap: function(e) {
    if (!this.checkBeforeTap()) {
      return false;
    }

    console.log("submit tap");
    var self = this;

    //上传图片，使用对话框提示，图片上传完之后，提交验货结果
    let imageCount = this.data.files.length;

    if (imageCount > 0) {
      wx.showLoading({
        title: '正在上传图片( ' + 1 + '/' + imageCount  +' )',
      })
      
      this.uploadFiles(this.data.files);
    }
  
  },

  uploadFiles: function(files) {
    this.data.uploadedCount = 0;
    var i = 0;
    for( i =  0; i < files.length && i < 5; i++) {
      this.uploadFile(files, i);
    }
  },

  uploadFile: function(files, index) {
    var self = this;

    wx.uploadFile({
      url: service.uploadFileUrl(), //仅为示例，非真实的接口地址
      filePath: files[index],
      name: 'file',
      formData: {},
      success: function (res) {
        console.log(res);
        let json = JSON.parse(res.data)
        if (json.status != 0) {
          self.handleImageUploadFail();
          return;
        }

        self.data.uploadedCount++;
        console.log('完成第' + self.data.uploadedCount + '张');

        if (self.data.uploadedCount == files.length) {
          self.submitCheckRequest();
        } else {
          wx.showLoading({
            title: '正在上传图片( ' + (self.data.uploadedCount + 1) + '/' + files.length + ' )',
          })
          let next = index + 5;
          if (next < files.length ) {
            this.uploadFile(files, index + 5)
          }
        }
      },
      fail: function (err) {
        console.log(err);
        self.handleImageUploadFail();
      }
    })
  },

  /**
 * 下拉刷新处理
 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },


});