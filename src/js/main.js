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
      if (value in oValue && oValue.value !== '' && oValue.value !== sDefaultAuthor) {
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