
// Starts to initialize the site
(function () {
  'use strict';
  const infoModule = new InfoModule(),
    noteModule = new NoteModule(document.getElementById('containerNotes'));

  // CacheModule as an example. Can be removed later.
  const cacheModule = new CacheModule(self.applicationCache);
  cacheModule.init();

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
    //if (noteModule.save(eText.value, eAuthor.firstChild.nodeValue)) {
      bClean = false;
    }
    eText.focus();
  });

  eAuthor.firstChild.nodeValue = fInit(eText.value, eAuthor.firstChild.nodeValue);
  //eAuthor.firstChild.nodeValue = noteModule.init(eText.value, eAuthor.firstChild.nodeValue);
})();