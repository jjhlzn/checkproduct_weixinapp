let utils = {
  isFloat: isFloat,
  isInt: isInt,
  isNeedReloadNotCheckListKey: 'isNeedReloadNotCheckListKey',
  isNeedReloadNotCompleteListKey: 'isNeedReloadNotCompleteListKey',
  isNeedReloadCheckedListKey: 'isNeedReloadCheckedListKey',
  queryParamsKey: 'queryParamsKey',
  combineImageUrls: combineImageUrls,
  onShowHandler: onShowHandler
};

function isFloat(value) {
  if (!isNumeric(value))
    return false;

  let val = parseFloat(value);
  if (isNaN(val)) 
    return false;
  return true;
}

function isInt(value) {
  return isFloat(value)
}


function isNumeric(num) {
  return !isNaN(num)
}

function combineImageUrls(array) {
  if (array.length == 0)
    return "";
  let result = array[0];
  for (var i = 1; i < array.length; i++) {
    result = result + "^" + array[i];
  }
  return result;
}


function onShowHandler(page, isReloadKey, reset, loadData) {
  let self = page;
  let queryParams = wx.getStorageSync(utils.queryParamsKey);
  console.log("queryParams: " + JSON.stringify(queryParams));
  if (queryParams) {
    console.log("load data after search")
    self.setData({
      queryParams: queryParams
    })
    if (queryParams.isBackFromSearch) {
      reset(self);
      loadData(self, 0)
    }
    wx.setStorageSync(utils.queryParamsKey, null);
  } else {
    if (isReloadKey) {
      let isNeedReload = wx.getStorageSync(isReloadKey);
      console.log("isNeedReload: " + isNeedReload);
      if (isNeedReload) {
        wx.setStorageSync(isReloadKey, false)
        reset(self);
        loadData(self, 0)
      }
    }
  }
}



module.exports = {
  utils: utils
}
