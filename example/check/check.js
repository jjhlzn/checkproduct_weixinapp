let service = require('../service').Service;

Page({
  data: {

    radioItems: [
      { name: '通过', value: '0' },
      { name: '不通过', value: '1', checked: true }
    ],

    files: []
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
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  bindLongImageTap: function (e) {
    console.log("long tap image");
  },

  bindSubmitTap: function(e) {
    console.log("submit tap");
    //上传图片，使用对话框提示，图片上传完之后，提交验货结果
    this.data.files.forEach(function(file) {
      console.log(file);
      wx.uploadFile({
        url: service.uploadFileUrl(), //仅为示例，非真实的接口地址
        filePath: file,
        name: 'file',
        formData: {},
        success: function (res) {
          var data = res.data
          //do something
          console.log(res);
        },
        fail: function (err) {
          console.log("err: ", err);
        }
      })
    });

    /*
    wx.uploadFile({
      url: service.uploadFileUrl(), //仅为示例，非真实的接口地址
      filePath: this.data.files[0],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        var data = res.data
        //do something
        console.log(res);
      },
      fail: function (err) {
        console.log("err: ", err);
      }
    })*/
  }
});