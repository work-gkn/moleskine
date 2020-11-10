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


  get(sKey) {
    let oValue = {},
      sValue = '';
    if (!this.bStorage) {
      return;
    }

    sValue = this.storage.getItem(sKey);
    if (sValue) {
      oValue = {key: sKey, value: sValue};
    }
    return oValue;
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
}
// ESLint definition for globals
/* global EmitterModule */

/** 
 * Class representing the note module 
 * @extends EmitterModule
 */

class NoteListModule extends EmitterModule {
  /**
   * 
   * @param {HTMLUListElement} eUl 
   */
  constructor (eUl) {
    super();
    this.eUl = eUl,
    this.aEntries = [],
    this.sDefaultText = '';
  }

  /**
   * Generate a String from a given date Object
   * @param {Object} oDate   A valid JS date object
   * @param {Number} nFormat Number to get the formated string
   *                         1 = For output in frontend
   *                         2 = For insert into datetime attribute
   */
  dateToString(oDate, nFormat = 1) {
    let fPad,
      sDate,
      sTime;

    fPad = function (nNr) {
      if (nNr < 10) {
        return '0' + nNr;
      }
      return nNr;
    };

    sDate = oDate.getFullYear() +
    '-' + fPad(oDate.getMonth() + 1) +
    '-' + fPad(oDate.getDate());

    sTime = fPad(oDate.getHours()) +
    ':' + fPad(oDate.getMinutes()) +
    ':' + fPad(oDate.getSeconds());

    if (nFormat === 2) {
      return sDate + 'T' + sTime;
    } else {
      return sDate + ' ' + sTime;
    }
  }
  
  /**
   * Gets the time element from DOM and updates it with the given parameters
   * @param {String} sValueText   Text to set in the textnode of time element
   * @param {String} sValueAttrib Text to set into the datetime attribute of time element
   */
  updateTimeElement(sValueText, sValueAttrib) {
    if (typeof sValueText !== 'string' || sValueText === '') {
      self.console.warn('Wrong format for parameter sValueText');
      return;
    }

    if (typeof sValueAttrib !== 'string' || sValueAttrib === '') {
      self.console.warn('Wrong format for parameter sValueAttrib');
      return;
    }

    let eTime = document.getElementsByTagName('time')[0];

    if (eTime) {
      eTime.firstChild.nodeValue = sValueText;
      eTime.setAttribute('datetime', sValueAttrib);
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
   * Try to call saveEntry from the events property and pass the parameters to it. Saves also
   * the given parameter sValue as the first entry of the property aEntries.
   * 
   * @param {String} sKey   Key to save in storage.
   * @param {String} sValue Value to save in storage.
   */
  saveEntry(sKey, sValue) {
    try {
      this.emit('saveEntry', sKey, sValue)
    } catch (e) {
      this.setInfoText('Entry could not be saved in storage!');
      self.console.error(e);
    } finally {
      this.aEntries.unshift({key: sKey, value: sValue});
    }
  }

  /**
   * Try to call deleteEntry from the events property and pass the parameters to it.
   * 
   * @param {String} sKey   Key to save in storage.
   * @param {String} sValue Value to save in storage.
   */
  deleteEntry(sId, oDate) {
    try {
      this.emit('deleteEntry', sId, oDate);
    } catch(e) {
      self.console.error(e);
      return false;
    }
  }

  /**
   * Tries to remove the given sId from the internal property aEntries.
   * @param {String} sId ID to remove from the array
   * @param {Date} oDate Date object to update the last change info
   */
  removeFromList(sId, oDate) {
    this.updateTimeElement(this.dateToString(oDate, 1), this.dateToString(oDate, 2));
    let index = this.aEntries.findIndex(value => value.key === sId);
    if (index > -1) {
      this.aEntries.splice(index, 1);
    }
    document.getElementById(sId).remove();
  }

  /**
   * Tries to delete the given id from localStorage after confirmation
   * @param {String} sId ID that should be tried to remove from localStorage
   * @returns {Boolean} If deletion was successful or not
   */
  delete(sId) {
    if (typeof sId !== 'string' || sId === '') {
      self.console.log('Wrong format for parameter sId');
      return false;
    }

    let bQuestion = self.confirm('Do you really want to delete this entry?'),
      oDate = new Date();

    if (bQuestion) {
      this.deleteEntry(sId, oDate);
    }
  }

  /**
   * Creates the note item to include it in the DOM
   * @param {number} nId     Id for li element
   * @param {string} sText   Text for li element
   * @param {boolean} bFirst Item should be set on top
   */
  create(nId, sText, bFirst = false) {
    let eLi = document.createElement('li'),
      eDiv = document.createElement('div'),
      eStr = document.createElement('strong'),
      eP = document.createElement('p'),
      eBtn = document.createElement('button'),
      sDate = this.dateToString(new Date(nId), 1);
      // getDateTime(nId)

    eStr.appendChild(document.createTextNode(sDate));

    eP.appendChild(document.createTextNode(sText));

    eBtn.setAttribute('type', 'button');
    eBtn.setAttribute('data-key', nId)
    eBtn.classList.add('btn', 'btn-danger', 'destroy', 'remove-note');
    eBtn.appendChild(document.createTextNode('Delete'));

    eDiv.appendChild(eStr);
    eDiv.appendChild(eP);
    eDiv.appendChild(eBtn);

    eLi.classList.add('list-group-item');
    eLi.setAttribute('id', nId);

    eLi.appendChild(eDiv);

    if (bFirst === true) {
      const eFirst = this.eUl.childNodes[0];
      this.eUl.insertBefore(eLi, eFirst);
    } else {
      this.eUl.appendChild(eLi);
    }
  }

  /**
   * Get the content for the note and creates new elements to include in DOM
   * @param {String} sEntry  Content from textarea
   * @returns {Boolean}      Save in Storage was successful or not
   */
  save(sEntry) {
    let oDate = new Date(),
      nKey = oDate.getTime(), // getDateTime()
      sKey = nKey.toString();

    if (sEntry === '' || sEntry === this.sDefaultText) {
      return false;
    }

    this.saveEntry(sKey, sEntry);  
  }

  /** 
   * Get entries from Storage and writes the information for each item into DOM
   * @returns {String} value read from aEntries with key author or an empty string
   */
  initList(aValues) {
    let bUpdate = true,
    oDate = new Date();

    aValues.map(item => {
      const nCheck = parseInt(item.key, 10);
      if (typeof nCheck === 'number' && item.key !== 'author') {
        oDate.setTime(nCheck);
        // This updates the information in 'Last updated' with the date of the first entry
        if (bUpdate) {
          this.updateTimeElement(this.dateToString(oDate, 1), this.dateToString(oDate, 2)); // getDateTime(oDate)
          bUpdate = false;
        }
        this.aEntries.push(item);
        this.create(nCheck, item.value);
      }
    });
    console.dir(this.aEntries);
  }

  /**
   * Init the module. Init event listener for the delete button and calls 
   * [method readStore]{@link NoteModule#readStore}
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
      this.delete(sId);
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
  
  const KEY_RETURN = "Enter",
    infoModule = new InfoModule(),
    storageHandler = new StorageModule(self.localStorage),
    noteListModule = new NoteListModule(document.getElementById('containerNotes')),
    eAuthor = document.getElementById('author'),
    eBtn = document.getElementById('save'),
    eText = document.getElementById('textarea'),
    sDefaultAuthor = eAuthor.firstChild.nodeValue;

  /** Clean up the textarea from text */
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
      infoModule.setText('off the web')
    }
  };

  /** Get and set informaton about the owner (Author) Tries to save it in Storage */
  function manageAuthor(sAction, sValue) {
    let sAuthor = sDefaultAuthor;
    if (typeof sAction !== 'string') {
      return sAuthor;
    }

    if (sAction === 'set' && typeof sValue === 'string' && sValue !== '') {
      storageHandler.save('author', sValue);
      sAuthor = sValue;
    } else {
      let oValue = storageHandler.get('author');
      if (oValue.value && oValue.value !== '' && oValue.value !== sDefaultAuthor) {
        sAuthor = oValue.value;
      }
    }
    return sAuthor;
  }

  // The Emitters in this block are only examples! For a one file JS this is not really necessary.
  noteListModule.on('setInfoText', sText => infoModule.setText(sText));
  noteListModule.on('readStore', () => {
    const aList = storageHandler.getList();
    noteListModule.initList(aList);
  });

  noteListModule.on('saveEntry', (sKey, sValue) => {
     if (storageHandler.save(sKey, sValue)) {
      noteListModule.create(parseInt(sKey, 10), sValue, true);
      //noteListModule.updateTimeElement(this.dateToString(oDate, 1), this.dateToString(oDate, 2));
     }
  });
  
  noteListModule.on('deleteEntry', (sId, oDate) => {
    if (storageHandler.remove(sId)) {
      noteListModule.removeFromList(sId, oDate);
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

  // Elemets for the note text.
  eText.addEventListener('click', () => fCleanUp());
  eText.addEventListener('focus', () => fCleanUp());

  // Save button in form.
  eBtn.addEventListener('click', () => {
    noteListModule.save(eText.value);
    bClean = false;
    eText.focus();
  });

  // Init moduleList and Author with defaults or from StorageHandler
  noteListModule.init();
  eAuthor.firstChild.nodeValue = manageAuthor('get');
})();