
// Starts to initialize the site
(function (mDebug, mNotes) {
  'use strict';
  if (typeof mDebug === 'undefined' || typeof mNotes === 'undefined') {
    self.console.error('Missing module mDebug or mNotes');
    return;
  }
  
  // import
  const fSetText = mDebug.setText,
    fInit = mNotes.init,
    fSave = mNotes.save;
  
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
  
  self.addEventListener('online', () => fSetText('on the web'));
  self.addEventListener('offline', () => fSetText('off the web'));

  if (navigator.onLine) {
    fSetText('on the web');
  } else {
    fSetText('off the web');
  }
  // oCache.init();

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
})(self.mDebug, self.mNotes);