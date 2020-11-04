
// Starts to initialize the site
(function () {
  'use strict';
  const debugModule = new DebugModule();
  
  const cacheModule = new CacheModule(self.applicationCache);
  cacheModule.on("updateCacheEvent", sText => debugModule.setText(sText));
  cacheModule.init();

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
    if (fSave(eText.value, eAuthor.firstChild.nodeValue)) {
      bClean = false;
    }
    eText.focus();
  });

  eAuthor.firstChild.nodeValue = fInit(eText.value, eAuthor.firstChild.nodeValue);
})();