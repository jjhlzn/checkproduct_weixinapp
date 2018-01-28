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

module.exports = {
  utils: {
    isFloat: isFloat,
    isInt: isInt,
    isNeedReloadNotCheckListKey: 'isNeedReloadNotCheckListKey'
  }
}
