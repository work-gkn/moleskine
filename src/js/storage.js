/**
 * Module to interact with localStorage
 */
var mStorage = (function (mDebug) {
  if (typeof self.mDebug === 'undefined') {
    return;
  }
  // import
  const fSetText = mDebug.setText;
  
  /**
   * Sets the given parameters into localstorage
   * @param {String} sKey The key for the local storage
   * @param {String} sValue Content to store
   */
  const fSet = function (sKey, sValue) {
    if (typeof sKey !== 'string' || sKey === '') {
      self.console.warn('Format of parameter sKey is not correct');
      return false;
    }

    if (typeof sValue !== 'string' || sValue === '') {
      self.console.warn('Format of parameter sValue is not correct');
      return false;
    }

    try {
      localStorage.setItem(sKey, sValue);
      if (sKey !== 'author') {
        fSetText('Entry saved locally');
      }
      return true;
    } catch (e) {
      fSetText('Error while saving: ' + e);
      return false;
    }
  };
  
  /**
   * Get all entries from local storage. The returned array contains the 
   * entries in descending order. 
   * @returns {Array} Array with objects of entries
   */
  const fGetAll = function () {
    let aKeys = [],
      aValues = [];

    for (let i = 0; i < localStorage.length; i = i + 1) {
      aKeys.push(localStorage.key(i));
    }
    // sort the key after the timestamp and bring it in descending order
    aKeys = aKeys.sort();
    for (let i = aKeys.length; i-- > 0;) {
      let sKey = aKeys[i],
        sValue = localStorage.getItem(sKey);
      if (sValue) {
        aValues.push({key: sKey, value: sValue});
      } else {
        continue;
      }
    }
    return aValues;
  };

  /**
   * Removes a item from localStorage by given id
   * @param {String} sId The key in localStorage to remove
   * @returns {Boolean} If operation was successfull or not
   */
  const fRemove = function (sId) {
    if (typeof sId !== 'string' || sId === '') {
      self.console.warn('Format of parameter sId was not correct');
      return false;
    }
    try {
      localStorage.removeItem(sId);
      fSetText('Entry deleted locally');
      return true;
    } catch (e) {
      fSetText('Error while deleting: ' + e);
      return false;
    }
  };
  
  // Set the public methods 
  return {
    getAll: fGetAll,
    remove: fRemove,
    set: fSet
  };
})(self.mDebug);