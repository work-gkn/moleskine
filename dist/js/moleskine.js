/** class representing an emitter module */
class EmitterModule {
  constructor() {
    this.events = {};
  }
  
  /** 
   * Registers an event listener for the event eventName. 
   *  
   * @param {String} eventName  
   * @param {Function} cb  
   */ 
  on(eventName, cb) { 
    if (!(eventName in this.events)) { 
      this.events[eventName] = []; 
    } 
    this.events[eventName].push(cb); 
  } 

  /** 
   * Triggers an event. Any number of parameters may be passed to this function, these are passed
   * 1:1 to the event listeners. 
   *  
   * @param {String} eventName  
   * @param {*=} arguments 
   */ 
  emit(eventName) { 
    var f,
      args = [].slice.call(arguments, 1); 
    
    if (eventName in this.events) { 
      for(f of this.events[eventName]) { 
        f.apply(this, args); 
      } 
    } 
  }
}
/** Class representing an inforamtion module. */
class InfoModule {

  constructor() {
    this.toastrText = '';
    this.eCntnr = document.getElementById('debug');
  }

  /**
   * Gets a text to show in the toaster.
   * @param {string} sText Message, that could be set to the debug body
   */
  setText(sText) {
    if (typeof sText !== 'string' || sText === '') {
      self.console.warn('Format of parameter was not correct');
      this.toastrText = '';
      return;
    }
    this.toastrText = sText;
    this.createOutput();
  }

  /**
   * Creates the HTML elements for a toastr to the DOM. Also set an event listener that the toaster
   * could be removed by the Bootstrap Toast method.
   */
  createOutput() {
    let eDvTst = document.createElement('div'),
      eDvHdr = document.createElement('div'),
      eDvBdy = document.createElement('div'),
      eStrng = document.createElement('strong');

    eStrng.appendChild(document.createTextNode('Info'));
    
    eDvHdr.classList.add('toast-header', 'bg-info');
    eDvHdr.appendChild(eStrng);
    
    eDvBdy.classList.add('toast-body');
    eDvBdy.appendChild(document.createTextNode(this.toastrText));
    
    eDvTst.classList.add('toast');
    eDvTst.setAttribute('role', 'alert');
    eDvTst.appendChild(eDvHdr);
    eDvTst.appendChild(eDvBdy);
    
    //Removes the content from DOM, after toaster was shown.
    eDvTst.addEventListener('hidden.bs.toast', () => eDvTst.remove());
    this.eCntnr.appendChild(eDvTst);
    this.show(eDvTst);
  }

  /**
   * Tries to show the created toastrs here.
   * @param {HTMLDivElement} eDvTst 
   */
  show(eDvTst) {
    try {
      // This code is taken from Bootstrap documentation
      let toastElList = [].slice.call(document.querySelectorAll('.toast'));
      let toastList = toastElList.map(toastEl => new self.bootstrap.Toast(toastEl, {delay:1500}));
      toastList.map(toast => toast.show());
    } catch (e) {
      self.console.warn('Bootstrap JS is not available now!', e);
      eDvTst.remove();
    }
  }
}
// ESLint definition for globals
/* global InfoModule */

/**
 * Class representing a cache inforamtion module.
 * 
 * Heads up! Using this is now an antipattern!
 */
class CacheModule {
  /**
   * Checks, if ApplicationCache is available and set EventListeners to inform the user about
   * the cache status.
   * @param {ApplicationCache} appCache 
   */
  constructor(appCache) {
    const infoModule = new InfoModule();
    if (appCache) {
      appCache.addEventListener('checking', () => infoModule.setText('Check the cache ...'));
      appCache.addEventListener('noupdate', () => infoModule.setText('No cache update necessary'));
      appCache.addEventListener('downloading', () => infoModule.setText('Update the cache ...'));
      appCache.addEventListener('progress', () => infoModule.setText('Download file ...'));
      appCache.addEventListener('updateready', () => infoModule.setText('Cache update ready ...'));
      appCache.addEventListener('cached', () => infoModule.setText('Cache is up-to-date'));
      appCache.addEventListener('obsolete', () => infoModule.setText('Cache is obsolete'));
      appCache.addEventListener('error', e => infoModule.setText('Problem with Cache: ' + e));
    } else {
      self.console.warn('No applicationCache available!');
    }
  }
}
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
// ESLint definition for globals
/* global EmitterModule */

/** 
 * Class representing the notelist module 
 * @extends EmitterModule
 */

class NoteListModule extends EmitterModule {
  /**
   * 
   * @param {HTMLUListElement}  eUl
   * @param {HTMLTimeElement}   eTime
   */
  constructor (eUl, eTime) {
    super();
    this.eUl = eUl,
    this.eTime = eTime;
    this.aEntries = [],
    this.sDefaultText = '';
  }

  /**
   * Generates a new Date object and set time to the value in parameter, if given.
   * @param {String=} sTmstmp  An timestamp in milliseconds as string.
   * 
   * @returns {Object}  Which has the following properties
   *                    {Object} dateObject:    The date object itself.
   *                    {String} textTimestamp: Converted timestamp of date object.
   *                    {String} textTime:      Date and Time as String, seperated by blank
   *                                            (YYYY-MM-DD hh:mm:ss)
   *                    {String} textDateTime:  Date and Time as String, sperated by T 
   *                                            (YYYY-MM-DDThh:mm:ss)
   */
  generateDates(sTmstmp) {
    let oDt = new Date();
    
    if (typeof sTmstmp !== 'string') {
      sTmstmp = oDt.getTime().toString(10);
    } else {
      oDt.setTime(parseInt(sTmstmp, 10));
    }
    
    const fPad = function (nNr) {
      if (nNr < 10) {
        return '0' + nNr;
      }
      return nNr;
    };

    let sDt = oDt.getFullYear() + '-' + fPad(oDt.getMonth() + 1) + '-' + fPad(oDt.getDate());
    let sTm = fPad(oDt.getHours()) + ':' + fPad(oDt.getMinutes()) + ':' + fPad(oDt.getSeconds());

    return {
      dateObject: oDt,
      textTimestamp: sTmstmp,
      textTime: sDt + ' ' + sTm,
      textDateTime: sDt + 'T' + sTm
    }
  }
  
  /**
   * Gets the time element from DOM and updates it with the given object
   * @param {Object} oDtGnrt Object should be geerated by method [generateDates]{@link NoteListModule#generateDates}
   */
  updateTimeElement(oDtGnrt) {
    if (this.eTime) {
      this.eTime.firstChild.nodeValue = oDtGnrt.textTime;
      this.eTime.setAttribute('datetime', oDtGnrt.textDateTime);
    }
  }

  /**
   * Try to call setInfoText from the events property and pass the parameters to it.
   * @param {String} sText Text to show in InfoModule
   */
  setInfoText(sText) {
    try {
      this.emit('setInfoText', sText);
    } catch (e) {
      self.console.error(e);
    }
  }

  /**
   * Try to call deleteEntry from the events property and pass the parameters to it.
   */
  deleteEntry(sId) {
    try {
      this.emit('deleteEntry', sId);
    } catch(e) {
      self.console.error(e);
    }
  }

  /**
   * Tries to remove the given sId from the internal property aEntries and the related element in
   * DOM.
   * @param {String} sId ID to remove from the array
   */
  removeFromList(sId) {
    let index = this.aEntries.findIndex(value => value.key === sId);
    if (index > -1) {
      this.aEntries.splice(index, 1);
    }
    document.getElementById(sId).remove();
    this.updateTimeElement(this.generateDates());
  }

  /**
   * Try to call readStore from the events property.
   */
  readStore() {
    if (this.aEntries.length === 0) {
      try {
        this.emit('readStore');
      } catch (e) {
        self.console.warn('Storage not available: ', e);
      }
    }
  }

  /**
   * Try to call saveEntry from the events property and pass the parameter to it.
   * 
   * @param {String} sValue Value to save in storage.
   */
  save(sValue) {
    if (sValue === '' || sValue === this.sDefaultText) {
      return;
    }

    try {
      this.emit('saveEntry', sValue, this.generateDates())
    } catch (e) {
      this.setInfoText('Entry could not be saved in storage!');
      self.console.error(e);
    }
  }

  /**
   * Prepairs delete after confirming deletion
   * @param {String} sId ID that should be tried to remove from localStorage
   * 
   */
  delete(sId) {
    if (typeof sId !== 'string' || sId === '') {
      self.console.log('Wrong format for parameter sId');
      return;
    }

    if (self.confirm('Do you really want to delete this entry?')) {
      this.deleteEntry(sId);
    }
  }

  /**
   * Creates a note item element to include it in the DOM
   * @param {Object} oDtGnrt  Date information and strings. See [generateDates]{@link NoteListModule#generateDates}
   * @param {String} sText   Text for li element
   * @param {Boolean} bFirst Item should be set on top. Mainly the case by generating a new note.
   */
  create(oDtGnrt, sText, bFirst = false) {
    
    let eLi = document.createElement('li'),
      eDiv = document.createElement('div'),
      eStr = document.createElement('strong'),
      eP = document.createElement('p'),
      eBtn = document.createElement('button'),
      oEntry = {key: oDtGnrt.textTimestamp, value: sText, dateGenerate: oDtGnrt};

    eStr.appendChild(document.createTextNode(oDtGnrt.textTime));

    eP.appendChild(document.createTextNode(sText));

    eBtn.setAttribute('type', 'button');
    eBtn.setAttribute('data-key', oDtGnrt.textTimestamp)
    eBtn.classList.add('btn', 'btn-danger', 'destroy', 'remove-note');
    eBtn.appendChild(document.createTextNode('Delete'));

    eDiv.appendChild(eStr);
    eDiv.appendChild(eP);
    eDiv.appendChild(eBtn);

    eLi.classList.add('list-group-item');
    eLi.setAttribute('id', oDtGnrt.textTimestamp);

    eLi.appendChild(eDiv);

    if (bFirst === true) {
      this.aEntries.unshift(oEntry);
      this.updateTimeElement(oDtGnrt);
      this.eUl.insertBefore(eLi, this.eUl.childNodes[0]);
    } else {
      this.aEntries.push(oEntry);
      this.eUl.appendChild(eLi);
    }
  }

  /** 
   * Get entries from Storage and calls [create]{@link NoteListModule#create} for each note item.
   * @param {Array} aValues Array of entries generated by the storage handler.
   */
  initList(aValues) {
    let bUpdate = true;

    aValues.map(item => {
      const oDtGnrt = this.generateDates(item.key),
        nCheck = oDtGnrt.dateObject.getTime();
      if (typeof nCheck === 'number' && item.key !== 'author') {
        this.create(oDtGnrt, item.value);
        // This updates the information in 'Last updated' with the date of the first entry
        if (bUpdate) {
          this.updateTimeElement(oDtGnrt);
          bUpdate = false;
        }
      }
    });
  }

  /**
   * Init the module. Init event listener for the delete button and calls 
   * method [readStore]{@link NoteModule#readStore}
   */
  init() {
    const on = function (selector, eventType, cb) {
      document.addEventListener(eventType, (event) => {
        let element = event.target

        while (element) {
          if (element.matches(selector)) {
            return cb({
              handleObj: element, 
              originalEvent: event
            })
          }
          element = element.parentElement
        }
      })
    };

    // Set listener to get click event of the delete buttons 
    on('.remove-note', 'click', event => {
      const sId = event.handleObj.getAttribute("data-key");
      if (sId) {
        this.delete(sId);
      }
    });

    this.readStore();
  }
}
// ESLint definition for globals
/* global CacheModule, InfoModule, NoteListModule, StorageModule */

// Starts to initialize the site
(function () {
  'use strict';
  /*
   * CacheModule is now only an example. The applcation cache feature is deprecated and will be
   * removed from the Web platform! Also using ApplicationCache by loading a HTML file from disk
   * is also not possible.
   * See https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache
   */
  new CacheModule(self.applicationCache);
  
  let bClean = false;
  
  const KEY_RETURN = 'Enter',
    infoModule = new InfoModule(),
    storageHandler = new StorageModule(self.localStorage),
    noteListModule = new NoteListModule(document.getElementById('containerNotes'), document.getElementsByTagName('time')[0]),
    eAuthor = document.getElementById('author'),
    eBtn = document.getElementById('save'),
    eText = document.getElementById('textarea'),
    sDefaultAuthor = eAuthor.firstChild.nodeValue;

  /** Cleans up the textarea from text */
  const fCleanUp = function () {
    if (bClean) {
      return;
    }
    eText.value = '';
    bClean = true;
  };

  /** Set info for Browser online*/
  const infoOnline = function (bOnline) {
    if (bOnline) {
      infoModule.setText('on the web');
    } else {
      infoModule.setText('off the web');
    }
  };

  /**
   * Get and set informaton about the owner (Author). Gives value to StorageHandler (set) or get
   * value from it.
   * @param {String} sAction Possible values are "get" and "set". Default is "get".
   * @param {String=} sValue Name of Author to store. Should be set, when sAction "set"
   */
  function manageAuthor(sAction, sValue) {
    if (typeof sAction !== 'string' || sAction === '') {
      sAction = 'get';
    }

    if (sAction === 'set' && typeof sValue === 'string' && sValue !== '') {
      storageHandler.save('author', sValue);
      return sValue;
    }
    
    let oValue = storageHandler.get('author');
    if (oValue.value && oValue.value !== '' && oValue.value !== sDefaultAuthor) {
      return oValue.value;
    }
    return sDefaultAuthor;
  }
 
  // The Emitters in this block are only examples! For a one file JS this is not really necessary.
  noteListModule.on('setInfoText', sText => infoModule.setText(sText));
  noteListModule.on('readStore', () => {
    const aList = storageHandler.getList();
    noteListModule.initList(aList);
  });

  noteListModule.on('saveEntry', (sValue, oDtGnrt) => {
    if (storageHandler.save(oDtGnrt.textTimestamp, sValue)) {
      noteListModule.create(oDtGnrt, sValue, true);
    }
  });
  
  noteListModule.on('deleteEntry', (sId) => {
    if (storageHandler.remove(sId)) {
      noteListModule.removeFromList(sId);
    }
  });
  // End Emitters

  // Set listeners and show info about online status
  self.addEventListener('online', () => infoOnline(true));
  self.addEventListener('offline', () => infoOnline(false));
  infoOnline(navigator.onLine);

  // Cleans up the h2 element to write a new owners name
  eAuthor.addEventListener('click', () => eAuthor.firstChild.nodeValue = '');
  // On Enter give Author to StorageHandler
  eAuthor.addEventListener('keydown', (event) => {
    if (event.key === KEY_RETURN) {
      event.preventDefault();
      event.target.firstChild.nodeValue = manageAuthor('set', event.target.firstChild.nodeValue);
      eText.focus();
    }
  });

  // Events for the element that contains note text.
  eText.addEventListener('click', () => fCleanUp());
  eText.addEventListener('focus', () => fCleanUp());

  // Event for the save button in form.
  eBtn.addEventListener('click', () => {
    noteListModule.save(eText.value);
    bClean = false;
    eText.focus();
  });

  // Init moduleList and Author with defaults or from StorageHandler
  noteListModule.init();
  eAuthor.firstChild.nodeValue = manageAuthor('get');
})();