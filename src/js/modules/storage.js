// ESLint definition for globals
/* global InfoModule */

/** Class representing a storage module to interact with LocalStorage */
class StorageModule {

  /** Set instance of InfoModule
   *  @param {Storage} localStorage The Storage object of the Web Storage API
   */
  constructor(localStorage) {
    this.infoModule = new InfoModule();
    this.bStorage = true;
    this.storage = {};
    
    if (typeof(localStorage) === 'undefined') {
      this.infoModule.setText('No localStorage!');
      this.bStorage = false;
    } else {
      this.storage = localStorage;
    }
  }

  /**
   * Sets the given parameters into localstorage
   * @param {String} sKey The key for the local storage
   * @param {String} sValue Content to store
   */
  save(sKey, sValue) { // should be handled as async
    if (!this.bStorage) {
      return false;
    }

    if (typeof sKey !== 'string' || sKey === '') {
      self.console.warn('Format of parameter sKey is not correct');
      return false;
    }

    if (typeof sValue !== 'string' || sValue === '') {
      self.console.warn('Format of parameter sValue is not correct');
      return false;
    }

    try {
      this.storage.setItem(sKey, sValue);
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
   * @returns {Array} Array with objects of entries. The object itself has the structure
   *                  {key: 'theKey', value: 'theValue'}.
   */
  getList() {
    let aKeys = [],
      aValues = [];

    if (!this.bStorage) {
      return aValues;
    }

    for (let i = 0; i < this.storage.length; i = i + 1) {
      aKeys.push(this.storage.key(i));
    }
    // sort the key after the timestamp and bring it in descending order
    aKeys = aKeys.sort();
    for (let i = aKeys.length; i-- > 0;) {
      let sKey = aKeys[i],
        sValue = this.storage.getItem(sKey);
      
      if (sValue) {
        aValues.push({key: sKey, value: sValue});
      } else {
        continue;
      }
    }
    return aValues;
  }

  /**
   * Removes a item from localStorage by given ID
   * @param {String} sId The key in localStorage to remove
   * @returns {Boolean} If operation was successfull or not
   */
  remove(sId) {
    if (!this.bStorage) {
      return false;
    }

    if (typeof sId !== 'string' || sId === '') {
      self.console.warn('Format of parameter sId was not correct');
      return false;
    }
    
    try {
      this.storage.removeItem(sId);
      this.infoModule.setText('Entry deleted locally');
      return true;
    } catch (e) {
      this.infoModule.setText('Error while deleting: ' + e);
      return false;
    }
  }
}