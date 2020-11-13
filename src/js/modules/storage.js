// ESLint definition for globals
/* global InfoModule */

/** Class representing a storage module to interact with LocalStorage */
class StorageModule {

  /** 
   *  Set instance of storage module
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
   * Tries to get only one Information from LocalStorage. Searching for the key given in Parameter. 
   * @param {String} sKey The key to search in LS.
   * 
   * @returns {Object}  Information about the Entry. Contains following properties:
   *                    {String} key:   The key from localStorage
   *                    {String} value: The value from localStorage
   */
  get(sKey) {
    let oValue = {},
      sValue = '';

    if (!this.bStorage || typeof sKey !== "string") {
      return oValue;
    }
    try {
      sValue = this.storage.getItem(sKey);
      if (sValue) {
        oValue = {key: sKey, value: sValue};
      }
    }
    catch(e) {
      self.console.warn("Get was not sucessful", e);
    }
    finally {
      return oValue;
    }
  }

  /**
   * Get all entries from local storage. The returned array contains the 
   * entries in descending order.
   * 
   * @returns {Array} Array with objects of entries. See [get]{@link localStorage#get} for the 
   *                  object details.
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

    // Sort the key after the timestamp and bring it in descending order
    aKeys = aKeys.sort();
    for (let i = aKeys.length; i-- > 0;) {
      let oValue = this.get(aKeys[i]);
      
      if (oValue.value) {
        aValues.push(oValue);
      }
    }
    return aValues;
  }

  /**
   * Removes a item from localStorage by the given ID.
   * @param {String} sId  The key in localStorage to remove
   * 
   * @returns {Boolean}   If operation was successfull or not
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

  /**
   * Tries to set the given parameters into localStorage
   * @param {String} sKey The key for the local storage
   * @param {String} sValue Content to store
   */
  save(sKey, sValue) {
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
      this.infoModule.setText('Entry saved in LocalStorage');
      return true;
    } catch (e) {
      this.infoModule.setText('Error while saving: ' + e);
      return false;
    }
  }
}