let service = require('../service').Service;

function handleImageUploadFail() {
  wx.showToast({
    title: '图片上传失败',
    duration: 3000
  })
}

function uploadFiles(files, controller) {
  let self = controller;
  self.data.uploadedCount = 0;
  var i = 0;
  for (i = 0; i < files.length && i < self.data.maxUploadCount; i++) {
    upload(files, i, self);
  }
}

function upload(files, index, controller) {

  var self = controller;
  console.log("self: " + self);
  wx.uploadFile({
    url: service.uploadFileUrl(),
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
          title: '上传中( ' + (self.data.uploadedCount + 1) + '/' + files.length + ' )',
        })
        let next = index + self.data.maxUploadCount;
        if (next < files.length) {
          upload(files, index + self.data.maxUploadCount, self)
        }
      }
    },
    fail: function (err) {
      console.log(err);
      handleImageUploadFail();
    }
  });

}

module.exports = {
  uploadFiles: uploadFiles
}