class EmitterModule {
  constructor() {
    this.events = {};
  }

/** 
   * Löst ein Ereignis aus. Dieser Funktion dürfen beliebig viele 
   * Parameter übergeben werden, diese werden 1:1 an die Event-Listener  
   * durchgereicht.  
   *  
   * @param {string} eventName  
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

  /** 
   * Registriert einen Event-Listener für das Event eventName. 
   *  
   * @param {string} eventName  
   * @param {Function} cb  
   */ 
  on(eventName, cb) { 
    if (!(eventName in this.events)) { 
      this.events[eventName] = []; 
    } 
    this.events[eventName].push(cb); 
  } 
}
/**
 * Module to generate a Message in a toaster
 */
self.mDebug = (function () {
  /**
   * inits and shows the toaster. This is taken from bootstrap documentation
   */
  const fShow = function() {
    try {
      let toastElList = [].slice.call(document.querySelectorAll('.toast'));
      let toastList = toastElList.map(function (toastEl) {
        return new self.bootstrap.Toast(toastEl, {delay:1500});
      });
      for (const toast of toastList) {
        toast.show();
      }
    } catch (e) {
      self.console.error(e);
    }
  };

  /**
   * Defines the toster and set it into the right position in DOM
   * @param {string} sText Text that should be shown in toaster
   */
  const fCreateOutput = function(sText) {
    if (typeof sText !== 'string' || sText === '') {
      self.console.warn('Format of parameter was not correct');
      return;
    }
    let eCntner = document.getElementById('debug'),
      eDvTst = document.createElement('div'),
      eDvHdr = document.createElement('div'),
      eDvBdy = document.createElement('div'),
      eStrng = document.createElement('strong');

    eStrng.appendChild(document.createTextNode('Info'));
    
    eDvHdr.classList.add('toast-header', 'bg-info');
    eDvHdr.appendChild(eStrng);
    
    eDvBdy.classList.add('toast-body');
    eDvBdy.appendChild(document.createTextNode(sText));
    
    eDvTst.classList.add('toast');
    eDvTst.setAttribute('role', 'alert');
    eDvTst.appendChild(eDvHdr);
    eDvTst.appendChild(eDvBdy);
    
    //Removes the content from DOM, after toaster was shown.
    eDvTst.addEventListener('hidden.bs.toast', function () {
      eDvTst.remove();
    });

    eCntner.appendChild(eDvTst);
  };

  /**
   * Gets a text to show in the toaster.
   * @param {string} sText Message, that could be set to the debug body
   */
  const fSetText = function (sText) {
    if (typeof sText === 'string' && sText !== '') {
      fCreateOutput(sText);
      fShow();
    } else {
      self.console.warn('Format of parameter was not correct');
    }
  };

  // Set the public methods
  return {
    setText: fSetText
  };
})();


/* the same as Module */
class DebugModule {
  constructor() {
    this.toastrText = '';
  }

  show() {
    try {
      let toastElList = [].slice.call(document.querySelectorAll('.toast'));
      let toastList = toastElList.map(function (toastEl) {
        return new self.bootstrap.Toast(toastEl, {delay:1500});
      });
      for (const toast of toastList) {
        toast.show();
      }
    } catch (e) {
      self.console.error(e);
    }
  }
  
  createOutput() {
    let eCntner = document.getElementById('debug'),
      eDvTst = document.createElement('div'),
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
    eDvTst.addEventListener('hidden.bs.toast', function () {
      eDvTst.remove();
    });

    eCntner.appendChild(eDvTst);
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
    this.show();
  }
}
/**
 * Module for setting cache operations
 */
class CacheModule extends EmitterModule {
  constructor(appCache) {
    super();
    this.appCache = appCache;
  }

  emitTextChange(sText) {
    this.emit('updateCacheEvent', sText);
  }

  init() {
    if (!this.appCache) {
      self.console.warn('No applicationCache available!');
      return;
    }
    
    this.appCache.addEventListener('checking', () => this.emitTextChange('Check the cache ...'));
    this.appCache.addEventListener('noupdate', () => this.emitTextChange('No cache update necessary'));
    this.appCache.addEventListener('downloading', () => this.emitTextChange('Update the cache ...'));
    this.appCache.addEventListener('progress', () => this.emitTextChange('Download file ...'));
    this.appCache.addEventListener('updateready', () => this.emitTextChange('Cache update ready ...'));
    this.appCache.addEventListener('cached', () => this.emitTextChange('Cache is up-to-date'));
    this.appCache.addEventListener('obsolete', () => this.emitTextChange('Cache is obsolete'));
    this.appCache.addEventListener('error', (e) => this.emitTextChange('Problem with Cache: ' + e));
  }
}
/**
 * Module to interact with localStorage
 */
self.mStorage = (function (mDebug) {
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

/* The same as Class  */
class StorageModule extends EmitterModule {
  constructor() {
    super();
  }

  /* Emitter to set a text into the toastr */
  emitStorageDebug(sText) {
    this.emit('storageDebugText', sText);
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
        this.emitStorageDebug('Entry saved locally');
      }
      return true;
    } catch (e) {
      this.emitStorageDebug('Error while saving: ' + e);
      return false;
    }
  }

  getList() {

  }

  remove(sId) {

  }
}
/**
 * Module to handle the notes
 */
self.mNotes = (function (mDebug, mStorage) {
  if (typeof mDebug === 'undefined' || typeof mStorage === 'undefined') {
    return;
  }
  // import
  const fSetText = mDebug.setText,
    fGetAll = mStorage.getAll,
    fRemove = mStorage.remove,
    fSet = mStorage.set;
  
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
      bQuestion = fRemove(sId); // Overwrites bQuestion with boolean bSuccess from remove!
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
        bSuccess = fSet('author', sAuthor);
      }
      bSuccess = fSet(nKey.toString(), sEntry);
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
    let aEntries = fGetAll(),
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
      fSetText('No localStorage!');
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
})(self.mDebug, self.mStorage);

/* The same as class */
class NoteModule extends EmitterModule {
  constructor (eUl) {
    super();
    this.bStorage = true,
    this.eUl = eUl,
    this.sDefaultAuthor = '',
    this.sDefaultText = '';
  }

  /* Emitter to set a text into the toastr */
  emitNoteDebug(sText) {
    this.emit('noteDebugText', sText);
  }

  emitNoteSaveStorage(sKey, sValue) {
    this.emit('noteSaveStorage', sKey, sValue);
  }

  delete() {

  }

  create() {

  }
  /**
   * Get the content for the note and creates new elements to include in DOM
   * @param {String} sEntry  Content from textarea
   * @param {String} sAuthor Content from h2 element
   * @returns {Boolean} Save in localStorage was successful or not
   */
  save(sEntry, sAuthor) {  //Should be handle a async 
    let bSuccess = true, // When no localStorage is available, set only to DOM
      oDate = new Date(),
      nKey = oDate.getTime();

    if (sEntry === '' || sEntry === this.sDefaultText) {
      return false;
    }

    if (this.bStorage) {
      if (sAuthor !== this.sDefaultAuthor) {
        bSuccess = this.emitNoteSaveStorage('author', sAuthor);
      }
      bSuccess = this.emitNoteSaveStorage(nKey.toString(), sEntry);
    }
    if (bSuccess) {
      // fCreate(nKey, sEntry, true);
      // fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
    }
    return bSuccess;
  }

  readStore() {

  }
  /**
   * Init the module. Reads information from localstorage and add existing items.
   * @param {String} sTextDef   The existing text in textarea
   * @param {String} sAuthorDef The default text in h2 element
   * @returns {String} Content from fReadstore or h2 element 
   */
  init(sTextDef, sAuthorDef) {
    let oDate = new Date(),
      sAuthor = '';

    // To set current date in case localStorage has no entries
    // fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
  
    if (typeof(self.localStorage) === 'undefined') {
      this.emitNoteDebug('No localStorage!');
      this.bStorage = false;
    } else {
      console.log('sAuthor = fReadStore()');
    }

    if (typeof sTextDef === 'string') {
      this.sDefaultText = sTextDef;
    }

    if (typeof(sAuthorDef) === 'string') {
      this.sDefaultAuthor = sAuthorDef;
    }

    if (sAuthor === '') {
      return sAuthorDef;
    } else {
      return sAuthor;
    }
  }
}

// Starts to initialize the site
(function () {
  'use strict';
  const debugModule = new DebugModule(),
    storageModule = new StorageModule(),
    noteModule = new NoteModule(document.getElementById('containerNotes'));

  // CacheModule as an example. Can be removed later.
  const cacheModule = new CacheModule(self.applicationCache);
  cacheModule.on('updateCacheEvent', sText => debugModule.setText(sText));
  cacheModule.init();

  // Init all emitter
  storageModule.on('storageDebugText', sText => debugModule.setText(sText));
  noteModule.on('noteDebugText', sText => debugModule.setText(sText));
  noteModule.on('noteSaveStorage', (sKey, sValue) => storageModule.save(sKey, sValue));

  //init methods 

  // import
  const fInit = self.mNotes.init,
    fSave = self.mNotes.save;
  
  let bClean = false,
    eAuthor = document.getElementById('author'),
    eBtn = document.getElementById('save'),
    eText = document.getElementById('textarea');
  
  /**
   * Clean up the textarea from text
   */
  const fCleanUp = function () {
    if (bClean) {
      return;
    }
    eText.value = '';
    bClean = true;
  };
  
  self.addEventListener('online', () => debugModule.setText('on the web'));
  self.addEventListener('offline', () => debugModule.setText('off the web'));

  if (navigator.onLine) {
    debugModule.setText('on the web');
  } else {
    debugModule.setText('off the web');
  }
  

  eAuthor.addEventListener('click', () => eAuthor.firstChild.nodeValue = '');

  eText.addEventListener('click', () => fCleanUp());
  eText.addEventListener('focus', () => fCleanUp());

  eBtn.addEventListener('click', () => {
    //if (fSave(eText.value, eAuthor.firstChild.nodeValue)) {
    if (noteModule.save(eText.value, eAuthor.firstChild.nodeValue)) {
      bClean = false;
    }
    eText.focus();
  });

  //eAuthor.firstChild.nodeValue = fInit(eText.value, eAuthor.firstChild.nodeValue);
  eAuthor.firstChild.nodeValue = noteModule.init(eText.value, eAuthor.firstChild.nodeValue);
})();