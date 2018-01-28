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

module.exports = {
  utils: {
    isFloat: isFloat,
    isInt: isInt,
    isNeedReloadNotCheckListKey: 'isNeedReloadNotCheckListKey',
    combineImageUrls: combineImageUrls
  }
}
