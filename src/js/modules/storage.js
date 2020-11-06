// ESLint definition for globals
/* global InfoModule */

/** Class representing a storage module to interact with LocalStorage */
class StorageModule {

  /** Set instance of InfoModule */
  constructor() {
    this.infoModule = new InfoModule();
  }

  /**
   * Sets the given parameters into localstorage
   * @param {String} sKey The key for the local storage
   * @param {String} sValue Content to store
   */
  save(sKey, sValue) { // should be handled as async 
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
        this.infoModule.setText('Entry saved locally');
      }
      return true;
    } catch (e) {
      this.infoModule.setText('Error while saving: ' + e);
      return false;
    }
  }

  /**
   * Get all entries from local storage. The returned array contains the 
   * entries in descending order. 
   * @returns {Array} Array with objects of entries
   */
  getList() {
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
  }

  /**
   * Removes a item from localStorage by given id
   * @param {String} sId The key in localStorage to remove
   * @returns {Boolean} If operation was successfull or not
   */
  remove(sId) {
    if (typeof sId !== 'string' || sId === '') {
      self.console.warn('Format of parameter sId was not correct');
      return false;
    }
    try {
      localStorage.removeItem(sId);
      this.infoModule.setText('Entry deleted locally');
      return true;
    } catch (e) {
      this.infoModule.setText('Error while deleting: ' + e);
      return false;
    }
  }
}