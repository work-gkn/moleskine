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