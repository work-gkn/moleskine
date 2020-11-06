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
    var f, args = [].slice.call(arguments, 1); 
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
// ESLint definition for globals
/* global InfoModule,  StorageModule */


/**
 * Module to handle the notes
 */
self.mNotes = (function () {
  const infoModule = new InfoModule(),
    storageModule = new StorageModule();
  
  let bStorage = true,
    eUl = document.getElementById('containerNotes'),
    sDefaultAuthor = '',
    sDefaultText = '';

  /**
   * Generate a String from a given date Object
   * @param {Object} oDate   A valid JS date object
   * @param {Number} nFormat Number to get the formated string
   *                         1 = For output in frontend
   *                         2 = For insert into datetime attribute
   */
  const fDateToString = function (oDate, nFormat = 1) {
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
  };

  /**
   * Gets the time element from DOM and updates it with the given parameters
   * @param {String} sValueText   Text to set in the textnode of time element
   * @param {String} sValueAttrib Text to set into the datetime attribute of time element
   */
  const fUpdateTimeElement = function (sValueText, sValueAttrib) {
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
  };

  /**
   * Tries to delete the given id from localStorage after confirmation
   * @param {String} sId ID that should be tried to remove from localStorage
   * @returns {Boolean} If deletion was successful or not
   */
  const fDelete = function(sId) {
    if (typeof sId !== 'string' || sId === '') {
      self.console.log('Wrong format for parameter sId');
      return false;
    }

    let bQuestion = self.confirm('Do you really want to delete this entry?'),
      oDate = new Date();

    if (bQuestion && bStorage) {
      bQuestion = storageModule.remove(sId); // Overwrites bQuestion with boolean bSuccess from remove!
    }
    
    if (bQuestion) {
      // getDateTime()
      fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
      
    }
    return bQuestion;
  };

  /**
   * Creates the note item to include it in the DOM
   * @param {number} nId     Id for li element
   * @param {string} sText   Text for li element
   * @param {boolean} bFirst Item should be set on top
   */
  const fCreate = function(nId, sText, bFirst = false) {
    let oDate = new Date(nId),
      eLi = document.createElement('li'),
      eDiv = document.createElement('div'),
      eStr = document.createElement('strong'),
      eP = document.createElement('p'),
      eBtn = document.createElement('button'),
      sDate = fDateToString(oDate, 1);
      // getDateTime(nId)

    eStr.appendChild(document.createTextNode(sDate));

    eP.appendChild(document.createTextNode(sText));

    eBtn.setAttribute('type', 'button');
    eBtn.classList.add('btn', 'btn-danger', 'destroy');
    eBtn.appendChild(document.createTextNode('Delete'));

    eDiv.appendChild(eStr);
    eDiv.appendChild(eP);
    eDiv.appendChild(eBtn);

    eLi.classList.add('list-group-item');
    eLi.setAttribute('id', nId);
    
    eBtn.addEventListener('click', () => { 
      if(fDelete(eLi.attributes.id.value)) {
        eLi.remove();
      }
    });

    eLi.appendChild(eDiv);

    if (bFirst === true) {
      let eFirst;
      eFirst = eUl.childNodes[0];
      eUl.insertBefore(eLi, eFirst);
    } else {
      eUl.appendChild(eLi);
    }
  };

  /**
   * Get the content for the note and creates new elements to include in DOM
   * @param {String} sEntry  Content from textarea
   * @param {String} sAuthor Content from h2 element
   * @returns {Boolean} Save in localStorage was successful or not
   */
  const fSave = function(sEntry, sAuthor) {
    let bSuccess = true, // When no localStorage is available, set only to DOM
      oDate = new Date(),
      nKey = oDate.getTime();
      // getDateTime()

    if (sEntry === '' || sEntry === sDefaultText) {
      return false;
    }

    if (bStorage) {
      if (sAuthor !== sDefaultAuthor) {
        bSuccess = storageModule.save('author', sAuthor);
      }
      bSuccess = storageModule.save(nKey.toString(), sEntry);
    }
    if (bSuccess) {
      fCreate(nKey, sEntry, true);
      fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
    }
    return bSuccess;
  };

  /** 
   * Get entries from Storage and writes the information for each item into DOM
   * @returns {String} value read from aEntries with key author or an empty string
   */
  const fReadStore = function () {
    let aEntries = storageModule.getList(),
      bUpdate = true,
      oDate = new Date(),
      sAuthor = '';
    
    for (let i = 0; i < aEntries.length; i = i + 1) {
      let oEntry = aEntries[i],
        nCheck = parseInt(oEntry.key, 10);
        //getDateTime(nCheck)

      if (isNaN(nCheck)) {
        if (oEntry.key === 'author') {
          sAuthor = oEntry.value;
        }
      } else {
        oDate.setTime(nCheck);
        // This updates the information in 'Last updated' with the date of the first entry
        if (bUpdate) {
          fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
          bUpdate = false;
        }

        fCreate(nCheck, oEntry.value);
      }
    }
    return sAuthor;
  };

  /**
   * Init the module. Reads information from localstorage and add existing items.
   * @param {String} sTextDef   The existing text in textarea
   * @param {String} sAuthorDef The default text in h2 element
   * @returns {String} Content from fReadstore or h2 element 
   */
  const fInit = function(sTextDef, sAuthorDef) {
    let oDate = new Date(),
      sAuthor = '';

    // To set current date in case localStorage has no entries
    // fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
  
    if (typeof(self.localStorage) === 'undefined') {
      infoModule.setText('No localStorage!');
      bStorage = false;
    } else {
      sAuthor = fReadStore();
    }

    if (typeof sTextDef === 'string') {
      sDefaultText = sTextDef;
    }

    if (typeof(sAuthorDef) === 'string') {
      sDefaultAuthor = sAuthorDef;
    }

    if (sAuthor === '') {
      return sAuthorDef;
    } else {
      return sAuthor;
    }
  };

  // Set public methods
  return {
    init: fInit,
    save: fSave,
  };
})();

/* The same as class */
class NoteModule {
  constructor (eUl) {
    this.infoModule = new InfoModule();
    this.bStorage = true,
    this.storageModule = new StorageModule(),
    this.eUl = eUl,
    this.sDefaultAuthor = '',
    this.sDefaultText = '';
  }

  delete() {}

  create() {}

  save() {}

  readStore() {}

  init() {}
}
// ESLint definition for globals
/* global CacheModule, InfoModule, NoteModule */

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
  
  const infoModule = new InfoModule();
  //  noteModule = new NoteModule(document.getElementById('containerNotes'));
  
  // import of Notes
  const fInit = self.mNotes.init,
    fSave = self.mNotes.save;
  
  let bClean = false,
    eAuthor = document.getElementById('author'),
    eBtn = document.getElementById('save'),
    eText = document.getElementById('textarea');
  
  /** Clean up the textarea from text */
  const fCleanUp = function () {
    if (bClean) {
      return;
    }
    eText.value = '';
    bClean = true;
  };
  
  self.addEventListener('online', () => infoModule.setText('on the web'));
  self.addEventListener('offline', () => infoModule.setText('off the web'));

  if (navigator.onLine) {
    infoModule.setText('on the web');
  } else {
    infoModule.setText('off the web');
  }

  eAuthor.addEventListener('click', () => eAuthor.firstChild.nodeValue = '');

  eText.addEventListener('click', () => fCleanUp());
  eText.addEventListener('focus', () => fCleanUp());

  eBtn.addEventListener('click', () => {
    if (fSave(eText.value, eAuthor.firstChild.nodeValue)) {
      bClean = false;
    }
    eText.focus();
  });

  eAuthor.firstChild.nodeValue = fInit(eText.value, eAuthor.firstChild.nodeValue);
})();