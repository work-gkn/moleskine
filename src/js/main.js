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
  
  const infoModule = new InfoModule(),
    storageModule = new StorageModule(self.localStorage),
    noteListModule = new NoteListModule(document.getElementById('containerNotes')),
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

  /** Set info for Browser online*/
  const infoOnline = function (bOnline) {
    if (bOnline) {
      infoModule.setText('on the web');
    } else {
      infoModule.setText('off the web')
    }
  };

  // The Emitters in this block are only examples! For a one file JS this is not really necessary.
  noteListModule.on('setInfoText', sText => infoModule.setText(sText));
  noteListModule.on('readStore', () => {
    const aList = storageModule.getList();
    if (aList.length > 0) {
      noteListModule.aEntries = aList;
    }
  });

  noteListModule.on('saveEntry', (sKey, sValue) => {
     if (storageModule.save(sKey, sValue)) {
      noteListModule.create(parseInt(sKey, 10), sValue, true);
      noteListModule.updateTimeElement(this.dateToString(oDate, 1), this.dateToString(oDate, 2));
     }
  });
  
  noteListModule.on('deleteEntry', (sId, oDate) => {
    if (storageModule.remove(sId)) {
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

  eText.addEventListener('click', () => fCleanUp());
  eText.addEventListener('focus', () => fCleanUp());

  eBtn.addEventListener('click', () => {
    noteListModule.save(eText.value, eAuthor.firstChild.nodeValue);
    bClean = false;
    eText.focus();
  });

  eAuthor.firstChild.nodeValue = noteListModule.init(eAuthor.firstChild.nodeValue);
})();