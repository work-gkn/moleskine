
var mDateStrings = (function () {
  let nId,
    sId,
    sDtTmAttr,
    sDtTm;

  let fPad = function (nNr) {
    if (nNr < 10) {
      return '0' + nNr;
    }
    return nNr;
  };


  let fGtDtTm = function (nId) {
    let oDt = new Date();

    if (typeof nId === 'undefined') {
      nId = oDt.getTime();
    } else {
      oDt.setTime(nId);
    }

    let sDt = oDt.getFullYear() + '-' + fPad(oDt.getMonth() + 1) + '-' + fPad(oDt.getDate());
    let sTm = fPad(oDt.getHours()) + ':' + fPad(oDt.getMinutes()) + ':' + fPad(oDt.getSeconds());

    let oRtrn = {
      Key: nId,
      Id: oDt.toString(),
      TextTime: sDt + ' ' + sTm,
      TextDateTime = sDt + 'T' + sTm
    }
    
    return oRtrn;
  }

  return {
    getDateTime: fGtDtTm
  };
});