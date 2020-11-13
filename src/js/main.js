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